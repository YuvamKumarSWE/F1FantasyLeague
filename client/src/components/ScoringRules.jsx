import React from 'react';

function ScoringRules() {
  const scoringRules = [
    {
      category: "Position Points",
      description: "Points awarded based on finishing position",
      rules: [
        { position: "1st", points: 25 },
        { position: "2nd", points: 18 },
        { position: "3rd", points: 15 },
        { position: "4th", points: 12 },
        { position: "5th", points: 10 },
        { position: "6th", points: 8 },
        { position: "7th", points: 6 },
        { position: "8th", points: 4 },
        { position: "9th", points: 2 },
        { position: "10th", points: 1 }
      ]
    },
    {
      category: "Bonus Points",
      description: "Additional points for special achievements",
      rules: [
        { achievement: "Win Bonus", points: "+10", condition: "Finishing 1st" },
        { achievement: "Podium Bonus", points: "+5", condition: "Finishing 1st-3rd" },
        { achievement: "Fastest Lap", points: "+5", condition: "Setting fastest lap" }
      ]
    },
    {
      category: "Penalties",
      description: "Points deducted for poor performance",
      rules: [
        { penalty: "Poor Finish", points: "-2", condition: "Finishing 16th or worse" },
        { penalty: "Did Not Finish (DNF)", points: "-5", condition: "Not completing the race" }
      ]
    },
    {
      category: "Captain Multiplier",
      description: "Special rule for captain selection",
      rules: [
        { rule: "Captain Points", points: "x2", condition: "All points doubled for captain" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Fantasy Scoring Rules</h2>
        <p className="text-gray-300">Understand how points are calculated for your fantasy team</p>
      </div>

      {scoringRules.map((category, index) => (
        <div key={index} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{category.category}</h3>
          <p className="text-gray-400 mb-4">{category.description}</p>

          <div className="space-y-3">
            {category.rules.map((rule, ruleIndex) => (
              <div key={ruleIndex} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04] border border-white/5">
                <div className="flex-1">
                  {rule.position && (
                    <span className="text-white font-medium">{rule.position} Place</span>
                  )}
                  {rule.achievement && (
                    <span className="text-white font-medium">{rule.achievement}</span>
                  )}
                  {rule.penalty && (
                    <span className="text-white font-medium">{rule.penalty}</span>
                  )}
                  {rule.rule && (
                    <span className="text-white font-medium">{rule.rule}</span>
                  )}
                  {rule.condition && (
                    <span className="text-gray-400 text-sm ml-2">({rule.condition})</span>
                  )}
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${
                    typeof rule.points === 'string' && rule.points.startsWith('+') ? 'text-green-400' :
                    typeof rule.points === 'string' && rule.points.startsWith('-') ? 'text-red-400' :
                    typeof rule.points === 'string' && rule.points === 'x2' ? 'text-yellow-400' :
                    'text-[#FF1801]'
                  }`}>
                    {rule.points} {typeof rule.points === 'number' && 'pts'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#FF1801]/10 to-red-600/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">💡 Pro Tips</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• Captain your strongest driver to maximize points</li>
          <li>• Consider fastest lap potential when selecting drivers</li>
          <li>• Balance risk with drivers who might DNF vs. consistent performers</li>
          <li>• Podium finishes provide significant bonus points</li>
        </ul>
      </div>
    </div>
  );
}

export default ScoringRules;
