import { Request, Response } from "express";
import { Driver } from "../models/Driver";
import { Constructor } from "../models/Constructor";
import { Race } from "../models/Race";
import { FantasyTeam } from "../models/FantasyTeam";
import axios from "axios";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
let aiCallCount = 0;
let resetTime = Date.now() + 60 * 60 * 1000;

// Security: Maximum query length to prevent abuse
const MAX_QUERY_LENGTH = 500; 

function checkAIRateLimit(): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  if (now >= resetTime) {
    aiCallCount = 0;
    resetTime = now + 60 * 60 * 1000; 
  }
  if (aiCallCount >= 10) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: resetTime
    };
  }
  aiCallCount++;
  
  return {
    allowed: true,
    remaining: 10 - aiCallCount,
    resetTime: resetTime
  };
}

async function fetchSiteData(userId?: string) {
  try {
    const [drivers, constructors, allRaces, standings, userFantasyTeams] = await Promise.all([
      Driver.find().lean().catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching drivers:', err.message);
        }
        return [];
      }),
      Constructor.find().lean().catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching constructors:', err.message);
        }
        return [];
      }),
      
      Race.find().sort({ 'schedule.race': 1 })
      .lean()
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching races:', err.message);
        }
        return [];
      }),
      
      axios.get(`https://f1api.dev/api/2025/drivers-championship`)
        .then(res => res.data.drivers_championship)
        .catch(err => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching standings:', err.message);
          }
          return null;
        }),
      
      // Fetch user's fantasy teams if userId is provided
      userId ? FantasyTeam.find({ user: userId })
        .populate('drivers', 'name surname shortName number teamId')
        .populate('captain', 'name surname shortName')
        .populate('race', 'raceName round location')
        .lean()
        .catch(err => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching user fantasy teams:', err.message);
          }
          return [];
        }) : Promise.resolve([])
    ]);
    
    // Separate races into upcoming and completed
    const now = new Date();
    const nextRace = allRaces.find(race => race.schedule?.race && new Date(race.schedule.race) >= now) || null;
    const completedRaces = allRaces.filter(race => race.schedule?.race && new Date(race.schedule.race) < now);
    const upcomingRaces = allRaces.filter(race => race.schedule?.race && new Date(race.schedule.race) >= now);
    
    // Fetch race results for completed races (limit to last 3 for performance)
    const recentCompletedRaces = completedRaces.slice(-3);
    const raceResults = await Promise.all(
      recentCompletedRaces.map(async (race) => {
        try {
          const apiUrl = `https://f1api.dev/api/${race.year}/${race.round}/race`;
          const response = await axios.get(apiUrl);
          return {
            raceId: race.raceId,
            raceName: race.raceName,
            round: race.round,
            results: response.data?.races?.results || []
          };
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`Error fetching results for race ${race.raceName}:`, err);
          }
          return null;
        }
      })
    );

    const siteData = {
      drivers,
      constructors,
      nextRace,
      completedRaces: completedRaces.slice(-20), // Last 5 completed races
      upcomingRaces: upcomingRaces.slice(0, 20), // Next 5 upcoming races
      allRaces,
      driverStandings: standings,
      raceResults: raceResults.filter(r => r !== null),
      userFantasyTeams: userFantasyTeams || []
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetched site data:', {
        driversCount: drivers.length,
        constructorsCount: constructors.length,
        hasNextRace: !!nextRace,
        completedRacesCount: completedRaces.length,
        upcomingRacesCount: upcomingRaces.length,
        allRacesCount: allRaces.length,
        hasStandings: !!standings,
        raceResultsCount: raceResults.filter(r => r !== null).length,
        userFantasyTeamsCount: userFantasyTeams.length
      });
    }
    
    // Check if critical data is available
    // Critical data: drivers and constructors (core F1 data)
    // If both are empty/missing, return null to indicate complete failure
    const hasCriticalData = drivers.length > 0 && constructors.length > 0;
    
    if (!hasCriticalData) {
      console.error('Critical data missing: Unable to fetch drivers or constructors');
      return null;
    }
    
    return siteData;
  } catch (error) {
    console.error('Error fetching site data:', error);
    return null;
  }
}

function createContextString(siteData: any) {
  if (!siteData) return '';
  
  let context = `You are an F1 Fantasy League AI assistant. You ONLY answer questions related to Formula 1 racing, F1 Fantasy League, drivers, teams, races, and standings. If asked about anything else, politely decline and redirect to F1 topics.

IMPORTANT INSTRUCTIONS:
- Provide clear, concise, and complete answers
- NEVER end your response with a question
- Make definitive statements and recommendations
- If you're unsure, state what you know with certainty
- Keep responses informative and helpful\n\n`;
  
  context += `========================================\n`;
  context += `F1 FANTASY LEAGUE RULES & SCORING:\n`;
  context += `========================================\n\n`;
  
  context += `TEAM CREATION RULES:\n`;
  context += `- Each fantasy team must have exactly 5 drivers\n`;
  context += `- Total budget: 100 million\n`;
  context += `- Each driver has a cost (see driver list below)\n`;
  context += `- You must select 1 captain (earns double points)\n`;
  context += `- Cannot select the same driver multiple times\n`;
  context += `- Teams are locked before race start\n`;
  context += `- One team per user per race\n\n`;
  
  context += `FANTASY POINTS SCORING SYSTEM:\n`;
  context += `Position Points (Top 10):\n`;
  context += `  1st: 25 points\n`;
  context += `  2nd: 18 points\n`;
  context += `  3rd: 15 points\n`;
  context += `  4th: 12 points\n`;
  context += `  5th: 10 points\n`;
  context += `  6th: 8 points\n`;
  context += `  7th: 6 points\n`;
  context += `  8th: 4 points\n`;
  context += `  9th: 2 points\n`;
  context += `  10th: 1 point\n\n`;
  
  context += `Bonus Points:\n`;
  context += `  - Win Bonus: +10 points (for 1st place)\n`;
  context += `  - Podium Bonus: +5 points (for top 3)\n`;
  context += `  - Fastest Lap: +5 points\n\n`;
  
  context += `Penalties:\n`;
  context += `  - Poor Finish (below 15th): -2 points\n`;
  context += `  - DNF (Did Not Finish): -5 points\n\n`;
  
  context += `Special Rules:\n`;
  context += `  - CAPTAIN gets DOUBLE points (all points x2)\n`;
  context += `  - Total team points = sum of all 5 drivers' points\n\n`;
  
  context += `========================================\n\n`;
  
  context += `CURRENT SITE DATA:\n\n`;
  
  // Next Race Info
  if (siteData.nextRace) {
    context += `NEXT RACE:\n`;
    context += `- Name: ${siteData.nextRace.raceName}\n`;
    context += `- Location: ${siteData.nextRace.location?.locality}, ${siteData.nextRace.location?.country}\n`;
    context += `- Circuit: ${siteData.nextRace.circuitName}\n`;
    context += `- Round: ${siteData.nextRace.round}\n`;
    context += `- Race Date: ${siteData.nextRace.schedule?.race}\n`;
    if (siteData.nextRace.schedule?.qualifying) {
      context += `- Qualifying: ${siteData.nextRace.schedule.qualifying}\n`;
    }
    context += `\n`;
  }
  
  // Upcoming Races
  if (siteData.upcomingRaces && siteData.upcomingRaces.length > 0) {
    context += `UPCOMING RACES (Next 5):\n`;
    siteData.upcomingRaces.forEach((race: any) => {
      context += `- Round ${race.round}: ${race.raceName} at ${race.location?.locality}, ${race.location?.country} on ${new Date(race.schedule?.race).toLocaleDateString()}\n`;
    });
    context += `\n`;
  }
  
  // Recent Completed Races
  if (siteData.completedRaces && siteData.completedRaces.length > 0) {
    context += `RECENT COMPLETED RACES:\n`;
    siteData.completedRaces.forEach((race: any) => {
      context += `- Round ${race.round}: ${race.raceName} at ${race.location?.locality}, ${race.location?.country}\n`;
    });
    context += `\n`;
  }
  
  // Race Results
  if (siteData.raceResults && siteData.raceResults.length > 0) {
    context += `RECENT RACE RESULTS (Top 10):\n`;
    siteData.raceResults.forEach((raceResult: any) => {
      context += `\n${raceResult.raceName} (Round ${raceResult.round}):\n`;
      raceResult.results.slice(0, 10).forEach((result: any, index: number) => {
        const dnf = result.position === "NC" || result.retired !== null;
        context += `  ${index + 1}. ${result.driver?.name} ${result.driver?.surname} (${result.team?.teamName})${dnf ? ' - DNF' : ''} - ${result.points} F1 points\n`;
      });
    });
    context += `\n`;
  }
  
  // Drivers with costs
  if (siteData.drivers && siteData.drivers.length > 0) {
    context += `CURRENT F1 DRIVERS (2025 Season) WITH FANTASY COSTS:\n`;
    siteData.drivers.forEach((driver: any) => {
      context += `- #${driver.number} ${driver.name} ${driver.surname} (${driver.shortName}) - ${driver.teamId} - ${driver.nationality} - Cost: $${driver.cost || 'N/A'}M\n`;
    });
    context += `\n`;
  }
  
  // Constructors
  if (siteData.constructors && siteData.constructors.length > 0) {
    context += `CONSTRUCTORS/TEAMS:\n`;
    siteData.constructors.forEach((constructor: any) => {
      context += `- ${constructor.name} (${constructor.constructorId}) - ${constructor.nationality}\n`;
    });
    context += `\n`;
  }
  
  // Driver Standings
  if (siteData.driverStandings && siteData.driverStandings.length > 0) {
    context += `CURRENT DRIVER CHAMPIONSHIP STANDINGS (Top 15):\n`;
    siteData.driverStandings.slice(0, 15).forEach((standing: any) => {
      context += `${standing.position}. ${standing.driver_name} - ${standing.points} points\n`;
    });
    context += `\n`;
  }
  
  // User's Fantasy Teams
  if (siteData.userFantasyTeams && siteData.userFantasyTeams.length > 0) {
    context += `USER'S FANTASY TEAMS:\n`;
    siteData.userFantasyTeams.forEach((team: any) => {
      context += `\nRace: ${team.race?.raceName} (Round ${team.race?.round})\n`;
      context += `Status: ${team.locked ? 'LOCKED' : 'UNLOCKED'}\n`;
      context += `Total Points: ${team.points}\n`;
      context += `Drivers:\n`;
      team.drivers.forEach((driver: any) => {
        const isCaptain = team.captain && driver._id.toString() === team.captain._id.toString();
        context += `  - ${driver.name} ${driver.surname} (#${driver.number}) - ${driver.teamId}${isCaptain ? ' [CAPTAIN - 2x points]' : ''}\n`;
      });
    });
    context += `\n`;
  }
  
  context += `========================================\n\n`;
  context += `Use this information to help users with:\n`;
  context += `- Creating fantasy teams within budget\n`;
  context += `- Understanding scoring and rules\n`;
  context += `- Driver and team recommendations\n`;
  context += `- Race schedules and results\n`;
  context += `- Championship standings analysis\n`;
  context += `- Fantasy team strategy and optimization\n\n`;
  
  return context;
}

export const handleAIChatbot = async (req: Request, res: Response) => {
  try {
    // Check rate limit first
    const rateLimit = checkAIRateLimit();
    
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      const minutesUntilReset = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      
      return res.status(429).json({
        success: false,
        message: `AI service rate limit exceeded. The system allows 10 requests per hour across all users. Please try again in ${minutesUntilReset} minutes.`,
        data: null,
        rateLimit: {
          limit: 10,
          remaining: 0,
          resetTime: resetDate.toISOString(),
          minutesUntilReset
        }
      });
    }
    
    const { query } = req.body;
    
    // Enhanced input validation with security measures
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      // Decrement counter since we're not actually making an AI call
      aiCallCount--;
      
      return res.status(400).json({
        success: false,
        message: 'Query field is required in request body and must be a non-empty string',
        data: null
      });
    }
    
    // Check maximum query length to prevent abuse
    if (query.length > MAX_QUERY_LENGTH) {
      aiCallCount--;
      
      return res.status(400).json({
        success: false,
        message: `Query too long. Maximum length is ${MAX_QUERY_LENGTH} characters.`,
        data: null
      });
    }
    
    // Sanitize input to prevent potential injection attacks
    const userQuery = query
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .slice(0, MAX_QUERY_LENGTH);
    
    // Get userId from authenticated request (set by authMiddleware)
    const userId = (req as any).user?.id;
    
    // Fetch current site data including user's fantasy teams if available
    const siteData = await fetchSiteData(userId);
    
    // Check if critical data is available
    if (!siteData) {
      // Decrement counter since we're not actually making an AI call
      aiCallCount--;
      
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch F1 data at this time. Please try again later.',
        data: null
      });
    }
    
    // Create context for the AI
    const context = createContextString(siteData);
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    // Create the prompt with context
    const prompt = `${context}\n\nUser Question: ${userQuery}\n\nPlease provide a helpful, accurate, and concise answer based on the data provided above. If the question is not related to Formula 1 or F1 Fantasy League, politely decline and redirect to F1 topics. Keep your response friendly and informative. IMPORTANT: Do NOT end your response with a question. Provide complete, definitive answers.`;
    
    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    // Return successful response with rate limit info
    return res.status(200).json({
      success: true,
      message: 'Response generated successfully',
      data: {
        query: userQuery,
        response: aiResponse
      },
      rateLimit: {
        limit: 10,
        remaining: rateLimit.remaining,
        resetTime: new Date(rateLimit.resetTime).toISOString()
      }
    });
    
  } catch (error: any) {
    // Log error server-side only (not exposed to client)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in AI chatbot:', error);
    }
    
    // Handle specific Gemini API errors without exposing details
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'AI service is temporarily unavailable. Please try again later.',
        data: null
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI response. Please try again later.',
      data: null
    });
  }
};


