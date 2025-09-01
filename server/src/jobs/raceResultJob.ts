import cron from 'node-cron';
import { Race } from '../models';
import { processRaceResults } from '../services/gameService';
import { updateRaceData } from '../services/raceService';

export function startRaceResultScheduler() {
    // Run every Monday at 00:00 AM
    cron.schedule('0 0 * * 1', async () => {
        try {
            console.log('🔄 [CRON] Starting weekly race result check...', new Date().toISOString());
            
            // Step 1: Update race data from F1 API
            await updateRaceData();
            
            // Step 2: Look for completed races that need result processing
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            console.log(`🔍 [CRON] Looking for completed races since: ${oneWeekAgo.toDateString()}`);

            // Find races that have finished in the past week and have results (winner field populated)
            const completedRaces = await Race.find({
                'schedule.race': {
                    $gte: oneWeekAgo,
                    $lt: now
                },
                winner: { $exists: true, $ne: null }
            });

            if (completedRaces.length === 0) {
                console.log('⏭️  [CRON] No completed races found - nothing to process');
                return;
            }

            console.log(`🏁 [CRON] Found ${completedRaces.length} completed race(s) to process`);

            let successCount = 0;
            let errorCount = 0;

            for (const race of completedRaces) {
                try {
                    console.log(`🚀 [CRON] Processing race: ${race.raceId} (${race.raceName})`);
                    const result = await processRaceResults(race.raceId);
                    
                    console.log(`✅ [CRON] Successfully processed race ${race.raceId}:`);
                    console.log(`   - Teams updated: ${result.updatedTeams.length}`);
                    console.log(`   - Results processed: ${result.totalResultsProcessed}`);
                    
                    successCount++;
                } catch (error: any) {
                    console.error(`❌ [CRON] Failed to process race ${race.raceId}:`, error.message);
                    errorCount++;
                }
            }

            console.log(`🏆 [CRON] Weekly processing complete - Success: ${successCount}, Errors: ${errorCount}`);
            
        } catch (error: any) {
            console.error('💥 [CRON] Critical error in race result scheduler:', error.message);
        }
    });

    console.log('🚀 [SCHEDULER] Race result scheduler started - will run every Monday at 00:00 AM');
    
    // For development: Also run on startup
    // previously the app ran the initial check unconditionally on startup
    // changed code: make startup check opt-in via env var RUN_STARTUP_CHECK
    const RUN_STARTUP_CHECK = process.env.RUN_STARTUP_CHECK === 'true';

    if (RUN_STARTUP_CHECK) {
        console.log('🔧 [DEV] Running initial check on startup...');
        setTimeout(async () => {
            try {
                await updateRaceData();
                
                const now = new Date();
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

                const completedRaces = await Race.find({
                    'schedule.race': {
                        $gte: oneWeekAgo,
                        $lt: now
                    },
                    winner: { $exists: true, $ne: null }
                });

                if (completedRaces.length > 0) {
                    console.log(`🔧 [DEV] Found ${completedRaces.length} completed race(s), processing now...`);
                    for (const race of completedRaces) {
                        try {
                            await processRaceResults(race.raceId);
                            console.log(`✅ [DEV] Processed ${race.raceId}`);
                        } catch (error: any) {
                            console.error(`❌ [DEV] Failed to process ${race.raceId}:`, error.message);
                        }
                    }
                }
            } catch (error: any) {
                console.error('💥 [DEV] Error in startup race check:', error.message);
            }
        }, 5000);
    } else {
        console.log('🔧 [DEV] Startup initial check skipped (set RUN_STARTUP_CHECK=true to enable)');
    }
}