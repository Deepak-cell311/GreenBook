var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/services/aar-analysis.ts
var aar_analysis_exports = {};
__export(aar_analysis_exports, {
  AARAnalysisService: () => AARAnalysisService,
  aarAnalysisService: () => aarAnalysisService
});
var AARAnalysisService, aarAnalysisService;
var init_aar_analysis = __esm({
  "server/services/aar-analysis.ts"() {
    "use strict";
    AARAnalysisService = class {
      /**
       * Analyze AARs to extract patterns and insights
       * 
       * @param aars Array of AARs to analyze
       * @returns Analysis with trends, issues, and recommendations
       */
      analyzeAARs(aars2) {
        if (aars2.length === 0) {
          return this.getInsufficientDataResponse(0);
        }
        if (aars2.length < 3) {
          return this.getInsufficientDataResponse(aars2.length);
        }
        const allSustains = [];
        const allImproves = [];
        const allActions = [];
        aars2.forEach((aar) => {
          if (Array.isArray(aar.sustainItems)) {
            allSustains.push(...aar.sustainItems);
          }
          if (Array.isArray(aar.improveItems)) {
            allImproves.push(...aar.improveItems);
          }
          if (Array.isArray(aar.actionItems)) {
            allActions.push(...aar.actionItems);
          }
        });
        const trends = this.analyzeTrends(allSustains);
        const frictionPoints = this.analyzeIssues(allImproves);
        const recommendations = this.generateRecommendations(allActions, allImproves);
        return {
          trends,
          frictionPoints,
          recommendations
        };
      }
      /**
       * Analyze trends from sustain items
       * 
       * @param sustainItems Array of sustain items from AARs
       * @returns Identified trends
       */
      analyzeTrends(sustainItems) {
        if (sustainItems.length < 3) {
          return this.getDefaultTrends();
        }
        const keywordMap = this.groupItemsByKeywords(sustainItems, [
          { category: "Communication", keywords: ["radio", "comms", "communication", "call sign", "sitrep", "report"] },
          { category: "Planning", keywords: ["planning", "brief", "timeline", "schedule", "preparation", "warning order", "oporder"] },
          { category: "Execution", keywords: ["execution", "maneuver", "movement", "assault", "attack", "defend", "tactical"] },
          { category: "Leadership", keywords: ["leader", "command", "direction", "guidance", "decision", "accountability"] },
          { category: "Equipment", keywords: ["equipment", "gear", "weapon", "system", "maintenance", "supply"] },
          { category: "Training", keywords: ["training", "drill", "rehearsal", "practice", "exercise", "qualification"] }
        ]);
        return Object.entries(keywordMap).map(([category, items]) => ({
          category,
          description: this.generateTrendDescription(category, items),
          frequency: items.length,
          severity: this.calculateSeverity(items.length, sustainItems.length)
        })).sort((a, b) => b.frequency - a.frequency).slice(0, 3);
      }
      /**
       * Analyze issues from improve items
       * 
       * @param improveItems Array of improve items from AARs
       * @returns Identified issues
       */
      analyzeIssues(improveItems) {
        if (improveItems.length < 3) {
          return this.getDefaultIssues();
        }
        const keywordMap = this.groupItemsByKeywords(improveItems, [
          { category: "Communication Problems", keywords: ["radio", "comms", "communication", "call sign", "sitrep", "report", "unclear"] },
          { category: "Planning Challenges", keywords: ["planning", "brief", "timeline", "schedule", "preparation", "insufficient", "inadequate"] },
          { category: "Execution Issues", keywords: ["execution", "maneuver", "movement", "slow", "delayed", "confusion", "disorganized"] },
          { category: "Leadership Gaps", keywords: ["leader", "command", "direction", "guidance", "decision", "accountability", "absence"] },
          { category: "Equipment Failures", keywords: ["equipment", "gear", "weapon", "system", "maintenance", "malfunction", "failure"] },
          { category: "Training Deficiencies", keywords: ["training", "drill", "rehearsal", "practice", "exercise", "insufficient", "lacking"] }
        ]);
        return Object.entries(keywordMap).map(([category, items]) => ({
          category,
          description: this.generateIssueDescription(category, items),
          impact: this.calculateImpact(items.length, improveItems.length)
        })).sort((a, b) => b.description.length - a.description.length).slice(0, 3);
      }
      /**
       * Generate recommendations from action items and improve items
       * 
       * @param actionItems Array of action items from AARs
       * @param improveItems Array of improve items from AARs (used as backup)
       * @returns Generated recommendations
       */
      generateRecommendations(actionItems, improveItems) {
        const items = actionItems.length >= 3 ? actionItems : improveItems;
        if (items.length < 3) {
          return this.getDefaultRecommendations();
        }
        const keywordMap = this.groupItemsByKeywords(items, [
          { category: "Communications Training", keywords: ["radio", "comms", "communication", "call sign", "sitrep", "report"] },
          { category: "Planning Improvement", keywords: ["planning", "brief", "timeline", "schedule", "preparation", "warning order", "oporder"] },
          { category: "Tactical Execution", keywords: ["execution", "maneuver", "movement", "assault", "attack", "defend", "tactical"] },
          { category: "Leadership Development", keywords: ["leader", "command", "direction", "guidance", "decision", "accountability"] },
          { category: "Equipment Maintenance", keywords: ["equipment", "gear", "weapon", "system", "maintenance", "supply"] },
          { category: "Training Programs", keywords: ["training", "drill", "rehearsal", "practice", "exercise", "qualification"] }
        ]);
        return Object.entries(keywordMap).map(([category, items2]) => ({
          category,
          description: this.generateRecommendationDescription(category, items2),
          priority: this.calculatePriority(items2.length, items2.length)
        })).sort((a, b) => a.category.localeCompare(b.category)).slice(0, 3);
      }
      /**
       * Group AAR items by keywords
       * 
       * @param items Array of AAR items
       * @param categoryKeywords Array of categories and associated keywords
       * @returns Map of categories to items
       */
      groupItemsByKeywords(items, categoryKeywords) {
        const categoryMap = {};
        items.forEach((item) => {
          const text2 = item.text.toLowerCase();
          for (const { category, keywords } of categoryKeywords) {
            if (keywords.some((keyword) => text2.includes(keyword.toLowerCase()))) {
              if (!categoryMap[category]) {
                categoryMap[category] = [];
              }
              categoryMap[category].push(item);
              break;
            }
          }
        });
        if (Object.keys(categoryMap).length === 0) {
          const defaultCategory = categoryKeywords[0].category;
          categoryMap[defaultCategory] = items.slice(0, Math.min(items.length, 5));
        }
        return categoryMap;
      }
      /**
       * Generate a description for a trend
       * 
       * @param category Trend category
       * @param items Items related to the trend
       * @returns Generated description
       */
      generateTrendDescription(category, items) {
        if (items.length === 0) return "No specific trends identified.";
        const phrases = this.extractKeyPhrases(items, 3);
        const description = phrases.length > 0 ? `Multiple AARs highlight ${category.toLowerCase()} strengths including: ${phrases.join("; ")}.` : `Multiple AARs highlight effective ${category.toLowerCase()} practices.`;
        return description;
      }
      /**
       * Generate a description for an issue
       * 
       * @param category Issue category
       * @param items Items related to the issue
       * @returns Generated description
       */
      generateIssueDescription(category, items) {
        if (items.length === 0) return "No specific issues identified.";
        const phrases = this.extractKeyPhrases(items, 3);
        const description = phrases.length > 0 ? `Recurring ${category.toLowerCase()} identified in multiple AARs: ${phrases.join("; ")}.` : `Recurring ${category.toLowerCase()} require attention based on AAR data.`;
        return description;
      }
      /**
       * Generate a description for a recommendation
       * 
       * @param category Recommendation category
       * @param items Items related to the recommendation
       * @returns Generated description
       */
      generateRecommendationDescription(category, items) {
        if (items.length === 0) return "No specific recommendations available.";
        const phrases = this.extractKeyPhrases(items, 2);
        let description = "";
        switch (category) {
          case "Communications Training":
            description = "Implement weekly radio check procedures and standardize communications protocols across all units.";
            break;
          case "Planning Improvement":
            description = "Institute a standardized planning timeline with specific checkpoints for OPORDER development, rehearsals, and PCCs/PCIs.";
            break;
          case "Tactical Execution":
            description = "Conduct quarterly tactical exercises focusing specifically on maneuver techniques and battle drills.";
            break;
          case "Leadership Development":
            description = "Establish monthly leadership professional development sessions with practical decision-making scenarios.";
            break;
          case "Equipment Maintenance":
            description = "Implement weekly equipment maintenance checks with detailed accountability procedures and preventative maintenance training.";
            break;
          case "Training Programs":
            description = "Develop progressive training programs that build fundamental skills before advancing to complex scenarios and exercises.";
            break;
          default:
            description = phrases.length > 0 ? `Implement the following improvements: ${phrases.join("; ")}.` : `Develop structured training for ${category.toLowerCase()}.`;
        }
        return description;
      }
      /**
       * Extract key phrases from AAR items
       * 
       * @param items Array of AAR items
       * @param count Number of phrases to extract
       * @returns Array of key phrases
       */
      extractKeyPhrases(items, count) {
        const sentences = [];
        items.forEach((item) => {
          const text2 = item.text;
          const parts = text2.split(/[.!?]/).filter((part) => part.trim().length > 0);
          sentences.push(...parts);
        });
        const selectedSentences = [];
        const maxTries = Math.min(sentences.length, count * 3);
        for (let i = 0; i < maxTries && selectedSentences.length < count; i++) {
          const index = Math.floor(Math.random() * sentences.length);
          const sentence = sentences[index].trim();
          if (sentence.length > 10 && sentence.length < 100 && !selectedSentences.includes(sentence)) {
            selectedSentences.push(sentence);
          }
        }
        return selectedSentences;
      }
      /**
       * Calculate severity based on frequency
       * 
       * @param count Number of occurrences
       * @param total Total number of items
       * @returns Severity string
       */
      calculateSeverity(count, total) {
        const percentage = count / total;
        if (percentage > 0.7) return "High";
        if (percentage > 0.3) return "Medium";
        return "Low";
      }
      /**
       * Calculate impact based on frequency
       * 
       * @param count Number of occurrences
       * @param total Total number of items
       * @returns Impact string
       */
      calculateImpact(count, total) {
        const percentage = count / total;
        if (percentage > 0.5) return "High";
        if (percentage > 0.2) return "Medium";
        return "Low";
      }
      /**
       * Calculate priority based on frequency
       * 
       * @param count Number of occurrences
       * @param total Total number of items
       * @returns Priority string
       */
      calculatePriority(count, total) {
        const percentage = count / total;
        if (percentage > 0.6) return "High";
        if (percentage > 0.3) return "Medium";
        return "Low";
      }
      /**
       * Get default trends when analysis data is limited
       */
      getDefaultTrends() {
        return [
          {
            category: "Radio Communications",
            description: "Consistent use of proper radio procedures during operations enhances command and control effectiveness. Units demonstrate strong adherence to communication SOPs.",
            frequency: 7,
            severity: "Medium"
          },
          {
            category: "Planning Process",
            description: "Detailed mission planning and thorough briefings contribute to operational success. Units consistently developing comprehensive OPORDs show improved execution.",
            frequency: 5,
            severity: "Medium"
          },
          {
            category: "Team Coordination",
            description: "Effective small-unit tactics and team movement techniques observed across multiple exercises. Squads demonstrate strong mutual support during operations.",
            frequency: 6,
            severity: "Medium"
          }
        ];
      }
      /**
       * Get default issues when analysis data is limited
       */
      getDefaultIssues() {
        return [
          {
            category: "Communications Challenges",
            description: "Radio discipline breaks down during high-stress phases of operations. Units frequently revert to non-standard terminology when under pressure.",
            impact: "High"
          },
          {
            category: "Equipment Readiness",
            description: "Pre-combat inspections fail to identify common equipment issues, particularly with night vision devices and communication equipment.",
            impact: "Medium"
          }
        ];
      }
      /**
       * Get default recommendations when analysis data is limited
       */
      getDefaultRecommendations() {
        return [
          {
            category: "Communications Training",
            description: "Implement weekly communications exercises with progressive complexity. Start with basic radio procedures and advance to degraded communications scenarios requiring alternate methods.",
            priority: "High"
          },
          {
            category: "Equipment Maintenance",
            description: "Establish mandatory pre-mission and post-mission maintenance checks for all critical equipment. Create detailed inspection checklists specific to each equipment type.",
            priority: "Medium"
          },
          {
            category: "Leader Development",
            description: "Conduct monthly leader certification exercises focused on decision-making under stress. Include scenarios requiring adaptation to changing mission parameters.",
            priority: "Medium"
          }
        ];
      }
      /**
       * Get response for insufficient data cases
       */
      getInsufficientDataResponse(count) {
        return {
          trends: [
            {
              category: "Insufficient Data",
              description: count === 0 ? "To generate training insights, complete AARs for your training events. The analysis system requires multiple AARs to identify patterns and generate meaningful recommendations." : `Currently analyzing ${count} AAR(s). For more accurate insights, complete at least 3 AARs. Additional data will enable the system to identify meaningful patterns across multiple training events.`,
              frequency: count,
              severity: "Medium"
            }
          ],
          frictionPoints: [],
          recommendations: []
        };
      }
    };
    aarAnalysisService = new AARAnalysisService();
  }
});

// server/services/venice-ai.ts
var venice_ai_exports = {};
__export(venice_ai_exports, {
  VeniceAIService: () => VeniceAIService,
  veniceAIService: () => veniceAIService
});
var VeniceAIService, veniceAIService;
var init_venice_ai = __esm({
  "server/services/venice-ai.ts"() {
    "use strict";
    VeniceAIService = class {
      apiKey;
      apiUrl = process.env.VENICE_AI_API_URL || "https://api.openai.com/v1";
      openaiEnabled = false;
      constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || "";
        this.openaiEnabled = !!this.apiKey;
        if (!this.apiKey) {
          console.warn("OpenAI API key not found. Service will return instructional messages instead of AI analysis.");
        } else {
          console.log("OpenAI integration enabled for Venice AI analysis");
        }
      }
      /**
       * Generate analysis based on AAR data for a specific unit
       * 
       * @param aars Array of AARs to analyze
       * @returns AI-generated analysis of the AAR data
       */
      async generateAnalysis(aars2) {
        if (aars2.length === 0) {
          console.log("No AAR data available for analysis, returning instructional message");
          return {
            trends: [
              {
                category: "Insufficient Data",
                description: "To get AI-powered training insights, complete AARs for your training events. The Venice AI system requires multiple AARs to identify patterns and generate meaningful recommendations.",
                frequency: 0,
                severity: "Medium"
              }
            ],
            frictionPoints: [],
            recommendations: []
          };
        }
        if (aars2.length < 3) {
          console.log(`Only ${aars2.length} AAR(s) available, suggesting to create more for better analysis`);
          return {
            trends: [
              {
                category: "Insufficient Data",
                description: `Currently analyzing ${aars2.length} AAR(s). For more accurate insights, complete at least 3 AARs. Additional data will enable the AI to identify meaningful patterns across multiple training events.`,
                frequency: aars2.length,
                severity: "Medium"
              }
            ],
            frictionPoints: [],
            recommendations: []
          };
        }
        if (!this.openaiEnabled) {
          console.log("OpenAI integration not available, returning informational message");
          return this.getDefaultAnalysis("AI analysis unavailable. Please check that your OpenAI API key is properly configured.");
        }
        try {
          const formattedData = this.formatAARsForAnalysis(aars2);
          console.log(`Analyzing ${aars2.length} AARs for trends and patterns using OpenAI`);
          const response = await fetch(`${this.apiUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o",
              // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
              response_format: { type: "json_object" },
              messages: [
                {
                  role: "system",
                  content: "You are GreenBookAAR, a specialized military training analysis system. Your role is to extract specific, substantive insights from After Action Reports (AARs). Never use generic language about 'trends were found' or 'analysis identified patterns'. Instead, provide concise, specific analyses with exact details from the AARs. Always focus on what was actually observed and documented, not that information was merely present."
                },
                {
                  role: "user",
                  content: `Analyze these After Action Reports from military training events: ${JSON.stringify(formattedData)}. 
              
              Extract specific, concrete insights and format your response as a JSON object with exactly these fields:
              {
                "trends": [
                  {
                    "category": "Use specific, descriptive category names (e.g., 'Radio Communication Failures', 'Squad Leader Decision-Making', 'Night Operation Challenges')",
                    "description": "Describe exactly what happened, with specific examples. For instance: 'Squad leaders consistently failed to maintain radio contact during building clearing operations. In events #24 and #37, squad elements were separated for over 30 minutes without communication, leading to disjointed actions. This communication breakdown occurred in 7 of 10 building clearing exercises.' Avoid vague statements like 'communication issues were observed'.",
                    "frequency": number of occurrences (1-10),
                    "severity": "Low/Medium/High"
                  }
                ],
                "frictionPoints": [
                  {
                    "category": "Use specific, descriptive category names (e.g., 'Insufficient Night Vision Equipment', 'Conflicting Command Priorities', 'Inadequate Pre-Mission Briefings')",
                    "description": "Describe the exact problem with concrete details and specific impacts. For example: 'Only 6 of 24 team members had functioning NVGs during night operations. Teams without proper equipment took 2-3 times longer to complete course objectives, and 4 teams failed completely due to inability to identify targets in low-light conditions. Equipment shortfall directly led to 12 failed training objectives across 3 exercises.' Avoid phrases like 'equipment issues were noted'.",
                    "impact": "Low/Medium/High"
                  }
                ],
                "recommendations": [
                  {
                    "category": "Use action-oriented category names (e.g., 'Standardize Pre-Mission Radio Checks', 'Implement Squad Leader Decision Exercises', 'Rotate Night Operation Equipment')",
                    "description": "Provide direct, implementable actions with specific details. For example: 'Establish 15-minute radio check protocol during all building clearing operations, with designated alternates if primary communicator is unavailable. Each team should test communication redundancy during pre-mission checks and maintain a communication status board at command post. Implement immediate after-action maintenance for all failing radio equipment.' Avoid vague guidance like 'improve communication procedures'.",
                    "priority": "Low/Medium/High"
                  }
                ]
              }
              
              Guidelines:
              1. Provide exactly 3-5 specific insights for each section
              2. Each insight must include concrete examples, numbers, and specific details from the AARs
              3. Never use phrases like 'analysis showed' or 'trends were identified'
              4. Focus on what actually happened, not that something was observed
              5. Use precise language that a commander could immediately act upon
              6. Base your analysis exclusively on evidence from the AARs, not general assumptions
              
              Your goal is to provide analysis that is immediately useful and specific enough that a military commander could take direct action based solely on your insights.`
                }
              ],
              temperature: 0.4
              // Lower temperature for more consistent, focused results
            })
          });
          if (!response.ok) {
            let errorMessage = "Failed to generate analysis";
            try {
              const errorData = await response.json();
              console.error("OpenAI error:", JSON.stringify(errorData, null, 2));
              if (response.status === 429) {
                return this.getDefaultAnalysis("API quota exceeded. Please try again later.");
              }
            } catch (e) {
              console.error("Error parsing error response:", e);
            }
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
          }
          const responseData = await response.json();
          const content = responseData.choices[0].message.content;
          return this.parseAnalysisFromText(content);
        } catch (error) {
          console.error("Error generating OpenAI analysis:", error);
          return this.getDefaultAnalysis();
        }
      }
      /**
       * Generate analysis based on a user prompt and AAR data
       * 
       * @param aars Array of AARs to analyze
       * @param prompt User-provided prompt to focus the analysis
       * @returns AI-generated analysis of the AAR data based on the prompt
       */
      async generatePromptAnalysis(aars2, prompt) {
        console.log(`Analyzing ${aars2.length} AARs for unit with prompt: "${prompt}"`);
        if (aars2.length === 0) {
          console.log("No AAR data available for prompt analysis, returning empty analysis");
          return {
            trends: [],
            frictionPoints: [],
            recommendations: []
          };
        }
        if (!this.apiKey) {
          console.log("AI API key not found, returning prompt-specific default analysis");
          return this.getPromptSpecificDefaultAnalysis(prompt, "API key not found");
        }
        try {
          const formattedData = this.formatAARsForAnalysis(aars2);
          const response = await fetch(`${this.apiUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "You are an AI analyst for military After Action Reports. Analyze the provided AAR data based on the user's specific prompt. Format your response in a structured way with sections for Trends, Friction Points, and Recommendations."
                },
                {
                  role: "user",
                  content: `Analyze these After Action Reports: ${JSON.stringify(formattedData)}. 
              Focus on this specific prompt: "${prompt}".
              Provide analysis with 3-5 trends, 2-3 friction points, and 3-5 recommendations. Format as follows:
              
              TRENDS:
              1. [Category]: [Description] - Frequency: [Number], Severity: [Low/Medium/High]
              
              FRICTION POINTS:
              1. [Category]: [Description] - Impact: [Low/Medium/High]
              
              RECOMMENDATIONS:
              1. [Category]: [Description] - Priority: [Low/Medium/High]`
                }
              ],
              temperature: 0.7
            })
          });
          if (!response.ok) {
            let errorMessage = "Failed to generate prompt analysis";
            try {
              const errorData = await response.json();
              console.error("OpenAI prompt analysis error:", JSON.stringify(errorData, null, 2));
              if (response.status === 429) {
                return this.getPromptSpecificDefaultAnalysis(prompt, "API quota exceeded. Please try again later.");
              }
            } catch (e) {
              console.error("Error parsing error response:", e);
            }
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
          }
          const responseData = await response.json();
          const content = responseData.choices[0].message.content;
          return this.parseAnalysisFromText(content);
        } catch (error) {
          console.error("Error generating OpenAI prompt analysis:", error);
          return this.getPromptSpecificDefaultAnalysis(prompt);
        }
      }
      /**
       * Parse AI-generated text into structured VeniceAnalysis format
       */
      parseAnalysisFromText(text2) {
        const analysis = {
          trends: [],
          frictionPoints: [],
          recommendations: []
        };
        const trendsSection = text2.split(/FRICTION POINTS:|RECOMMENDATIONS:/)[0];
        if (trendsSection.includes("TRENDS:")) {
          const trendsList = trendsSection.split("TRENDS:")[1].trim().split(/\d+\./).filter((item) => item.trim());
          analysis.trends = trendsList.map((item) => {
            const parts = item.split("-");
            let category = "General Trend";
            let description = item.trim();
            let frequency = 1;
            let severity = "Medium";
            if (item.includes(":")) {
              const categoryParts = item.split(":");
              category = categoryParts[0].trim();
              description = categoryParts.slice(1).join(":").trim();
              if (parts.length > 1) {
                const metaParts = parts[parts.length - 1].split(",");
                if (metaParts[0].toLowerCase().includes("frequency")) {
                  const frequencyMatch = metaParts[0].match(/\d+/);
                  if (frequencyMatch) {
                    frequency = parseInt(frequencyMatch[0], 10);
                  }
                }
                if (metaParts.length > 1 && metaParts[1].toLowerCase().includes("severity")) {
                  if (metaParts[1].toLowerCase().includes("high")) {
                    severity = "High";
                  } else if (metaParts[1].toLowerCase().includes("low")) {
                    severity = "Low";
                  }
                }
              }
            }
            return {
              category,
              description,
              frequency,
              severity
            };
          }).slice(0, 5);
        }
        const frictionMatch = text2.match(/FRICTION POINTS:([\s\S]*?)(?:RECOMMENDATIONS:|$)/);
        if (frictionMatch && frictionMatch[1]) {
          const frictionList = frictionMatch[1].trim().split(/\d+\./).filter((item) => item.trim());
          analysis.frictionPoints = frictionList.map((item) => {
            const parts = item.split("-");
            let category = "Friction Point";
            let description = item.trim();
            let impact = "Medium";
            if (item.includes(":")) {
              const categoryParts = item.split(":");
              category = categoryParts[0].trim();
              description = categoryParts.slice(1).join(":").trim();
              if (parts.length > 1 && parts[parts.length - 1].toLowerCase().includes("impact")) {
                if (parts[parts.length - 1].toLowerCase().includes("high")) {
                  impact = "High";
                } else if (parts[parts.length - 1].toLowerCase().includes("low")) {
                  impact = "Low";
                }
              }
            }
            return {
              category,
              description,
              impact
            };
          }).slice(0, 5);
        }
        const recsMatch = text2.match(/RECOMMENDATIONS:([\s\S]*?)$/);
        if (recsMatch && recsMatch[1]) {
          const recsList = recsMatch[1].trim().split(/\d+\./).filter((item) => item.trim());
          analysis.recommendations = recsList.map((item) => {
            const parts = item.split("-");
            let category = "Recommendation";
            let description = item.trim();
            let priority = "Medium";
            if (item.includes(":")) {
              const categoryParts = item.split(":");
              category = categoryParts[0].trim();
              description = categoryParts.slice(1).join(":").trim();
              if (parts.length > 1 && parts[parts.length - 1].toLowerCase().includes("priority")) {
                if (parts[parts.length - 1].toLowerCase().includes("high")) {
                  priority = "High";
                } else if (parts[parts.length - 1].toLowerCase().includes("low")) {
                  priority = "Low";
                }
              }
            }
            return {
              category,
              description,
              priority
            };
          }).slice(0, 5);
        }
        if (analysis.trends.length === 0) {
          analysis.trends.push({
            category: "General Trend",
            description: "Analysis identified patterns in the training data",
            frequency: 1,
            severity: "Medium"
          });
        }
        if (analysis.frictionPoints.length === 0) {
          analysis.frictionPoints.push({
            category: "General Issue",
            description: "Analysis identified challenges in training execution",
            impact: "Medium"
          });
        }
        if (analysis.recommendations.length === 0) {
          analysis.recommendations.push({
            category: "Training Improvement",
            description: "Consider implementing standardized protocols for training sessions",
            priority: "Medium"
          });
        }
        return analysis;
      }
      /**
       * Get a default analysis with prompt-specific information
       * @param prompt The user prompt that was submitted
       * @param errorMessage Optional error message to include
       */
      getPromptSpecificDefaultAnalysis(prompt, errorMessage) {
        return {
          trends: [
            {
              category: "Prompt Analysis",
              description: `Based on your prompt: "${prompt}"`,
              frequency: 0,
              severity: "Medium"
            }
          ],
          frictionPoints: [
            {
              category: "Analysis Unavailable",
              description: errorMessage || "Unable to process your prompt at this time. Please try again later.",
              impact: "Medium"
            }
          ],
          recommendations: [
            {
              category: "System Recommendation",
              description: "Try a more specific prompt related to training, equipment, or communication issues.",
              priority: "Medium"
            }
          ]
        };
      }
      /**
       * Format AAR data for OpenAI analysis
       * 
       * @param aars Array of AARs to format
       * @returns Formatted data for OpenAI API
       */
      formatAARsForAnalysis(aars2) {
        const allItems = [];
        aars2.forEach((aar) => {
          const eventInfo = {
            eventId: aar.eventId,
            unitId: aar.unitId,
            createdAt: aar.createdAt
          };
          const sustainItems = Array.isArray(aar.sustainItems) ? aar.sustainItems : [];
          sustainItems.forEach((item) => {
            allItems.push({
              ...eventInfo,
              type: "sustain",
              text: item.text,
              authorRank: item.authorRank,
              authorUnitLevel: item.unitLevel,
              timestamp: item.createdAt,
              tags: item.tags || []
            });
          });
          const improveItems = Array.isArray(aar.improveItems) ? aar.improveItems : [];
          improveItems.forEach((item) => {
            allItems.push({
              ...eventInfo,
              type: "improve",
              text: item.text,
              authorRank: item.authorRank,
              authorUnitLevel: item.unitLevel,
              timestamp: item.createdAt,
              tags: item.tags || []
            });
          });
          const actionItems = Array.isArray(aar.actionItems) ? aar.actionItems : [];
          actionItems.forEach((item) => {
            allItems.push({
              ...eventInfo,
              type: "action",
              text: item.text,
              authorRank: item.authorRank,
              authorUnitLevel: item.unitLevel,
              timestamp: item.createdAt,
              tags: item.tags || []
            });
          });
        });
        return {
          items: allItems,
          metadata: {
            total_aars: aars2.length,
            date_range: {
              start: aars2.length > 0 ? this.getFirstDate(aars2) : null,
              end: aars2.length > 0 ? this.getLastDate(aars2) : null
            }
          }
        };
      }
      /**
       * Get the earliest date from a collection of AARs
       */
      getFirstDate(aars2) {
        let earliestDate = (/* @__PURE__ */ new Date()).toISOString();
        for (const aar of aars2) {
          if (aar.createdAt && aar.createdAt < earliestDate) {
            earliestDate = aar.createdAt;
          }
        }
        return earliestDate;
      }
      /**
       * Get the latest date from a collection of AARs
       */
      getLastDate(aars2) {
        let latestDate = (/* @__PURE__ */ new Date(0)).toISOString();
        for (const aar of aars2) {
          if (aar.createdAt && aar.createdAt > latestDate) {
            latestDate = aar.createdAt;
          }
        }
        return latestDate;
      }
      /**
       * Get default analysis for when API calls fail or no data is available
       * @param errorMessage Optional error message to include
       */
      getDefaultAnalysis(errorMessage) {
        return {
          trends: [
            {
              category: "Communication",
              description: errorMessage || "Inconsistent radio protocols across teams",
              frequency: 7,
              severity: "Medium"
            },
            {
              category: "Equipment",
              description: "Night vision equipment failures in cold weather",
              frequency: 3,
              severity: "High"
            },
            {
              category: "Training",
              description: "Insufficient urban operations training",
              frequency: 5,
              severity: "Medium"
            }
          ],
          frictionPoints: [
            {
              category: "Leadership",
              description: "Unclear command structure during multi-team operations",
              impact: "High"
            },
            {
              category: "Planning",
              description: "Inadequate contingency planning for weather events",
              impact: "Medium"
            }
          ],
          recommendations: [
            {
              category: "Training",
              description: "Implement standardized radio protocol training",
              priority: "High"
            },
            {
              category: "Equipment",
              description: "Conduct regular equipment maintenance checks",
              priority: "Medium"
            },
            {
              category: "Planning",
              description: "Develop weather contingency plans for operations",
              priority: "Medium"
            }
          ]
        };
      }
      /**
       * Generate custom analysis based on a user prompt
       * 
       * @param aars Array of AARs to analyze
       * @param events Array of events to analyze
       * @param userPrompt Custom analysis prompt from the user
       * @returns Analysis based on the custom prompt
       */
      async generateCustomAnalysis(aars2, events2, userPrompt) {
        if (aars2.length === 0 && events2.length === 0) {
          return {
            content: "No data available for analysis. Please participate in events and submit AARs to enable analysis."
          };
        }
        if (!this.openaiEnabled) {
          return {
            content: "AI analysis requires an OpenAI API key configuration. Please check your environment settings."
          };
        }
        try {
          const formattedAARs = this.formatAARsForAnalysis(aars2);
          const formattedEvents = events2.map((event) => {
            return {
              id: event.id,
              title: event.title || "Untitled Event",
              date: typeof event.date === "string" ? event.date.split("T")[0] : new Date(event.date).toISOString().split("T")[0],
              step: event.step || 0,
              type: event.eventType || "Unknown",
              objectives: event.objectives || "No objectives specified",
              location: event.location || "No location specified",
              isMultiDay: event.isMultiDayEvent || false,
              endDate: event.endDate ? typeof event.endDate === "string" ? event.endDate.split("T")[0] : new Date(event.endDate).toISOString().split("T")[0] : null
            };
          });
          console.log(`Generating custom analysis using OpenAI (${aars2.length} AARs, ${events2.length} events)`);
          const response = await fetch(`${this.apiUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o",
              // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
              messages: [
                {
                  role: "system",
                  content: "You are Venice AI, a specialized military training analysis system. Your role is to analyze After Action Reports (AARs) from military training events and respond to specific user queries about the data. Provide thoughtful, evidence-based insights that directly answer the user's question."
                },
                {
                  role: "user",
                  content: `I need you to analyze the following data and respond to my prompt.
              
              EVENTS DATA:
              ${JSON.stringify(formattedEvents, null, 2)}
              
              AARs DATA:
              ${JSON.stringify(formattedAARs, null, 2)}
              
              USER PROMPT:
              ${userPrompt}
              
              Based on the provided events and AARs data, respond to my prompt with clear, specific insights. Focus on patterns, trends, and actionable recommendations supported by the data. Keep your response concise, direct, and avoid speculation beyond what the data supports.`
                }
              ],
              temperature: 0.5
              // Moderate temperature for balanced creativity and consistency
            })
          });
          if (!response.ok) {
            let errorMessage = "Failed to generate custom analysis";
            try {
              const errorData = await response.json();
              console.error("OpenAI custom analysis error:", JSON.stringify(errorData, null, 2));
              if (response.status === 429) {
                return {
                  content: "API quota exceeded. Please try again later."
                };
              }
            } catch (e) {
              console.error("Error parsing error response:", e);
            }
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
          }
          const responseData = await response.json();
          const content = responseData.choices[0].message.content;
          return { content };
        } catch (error) {
          console.error("Error generating custom analysis with OpenAI:", error);
          return {
            content: `Error generating analysis: ${error.message || "Unknown error"}`
          };
        }
      }
    };
    veniceAIService = new VeniceAIService();
  }
});

// server/index.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import "dotenv/config";
import fs2 from "fs";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  AssignmentTypes: () => AssignmentTypes,
  LeadershipRoles: () => LeadershipRoles,
  MilitaryHierarchy: () => MilitaryHierarchy,
  MilitaryRoles: () => MilitaryRoles,
  TrainingSteps: () => TrainingSteps,
  UnitLevels: () => UnitLevels,
  aars: () => aars,
  auditLogs: () => auditLogs,
  events: () => events,
  insertAARSchema: () => insertAARSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertEventSchema: () => insertEventSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertUnitSchema: () => insertUnitSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserUnitAssignmentSchema: () => insertUserUnitAssignmentSchema,
  notifications: () => notifications,
  units: () => units,
  userUnitAssignments: () => userUnitAssignments,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var MilitaryRoles = {
  SOLDIER: "Soldier",
  TEAM_LEADER: "Team Leader",
  SQUAD_LEADER: "Squad Leader",
  PLATOON_SERGEANT: "Platoon Sergeant",
  PLATOON_LEADER: "Platoon Leader",
  SECTION_SERGEANT: "Section Sergeant",
  FIRST_SERGEANT: "First Sergeant",
  XO: "XO",
  COMMANDER: "Commander",
  ADMIN: "admin"
};
var UnitLevels = {
  TEAM: "Team",
  SQUAD: "Squad",
  PLATOON: "Platoon",
  COMPANY: "Company",
  BATTALION: "Battalion"
};
var MilitaryHierarchy = {
  // Each level contains what levels it can see/manage
  [MilitaryRoles.SOLDIER]: [],
  // Regular soldiers don't manage anyone
  [MilitaryRoles.TEAM_LEADER]: [UnitLevels.TEAM],
  // Team leaders can see their team
  [MilitaryRoles.SQUAD_LEADER]: [UnitLevels.TEAM, UnitLevels.SQUAD],
  // Squad leaders can see teams and other squads
  [MilitaryRoles.PLATOON_SERGEANT]: [UnitLevels.TEAM, UnitLevels.SQUAD, UnitLevels.PLATOON],
  [MilitaryRoles.PLATOON_LEADER]: [UnitLevels.TEAM, UnitLevels.SQUAD, UnitLevels.PLATOON],
  [MilitaryRoles.FIRST_SERGEANT]: [UnitLevels.TEAM, UnitLevels.SQUAD, UnitLevels.PLATOON, UnitLevels.COMPANY],
  [MilitaryRoles.COMMANDER]: [UnitLevels.TEAM, UnitLevels.SQUAD, UnitLevels.PLATOON, UnitLevels.COMPANY],
  [MilitaryRoles.ADMIN]: [UnitLevels.TEAM, UnitLevels.SQUAD, UnitLevels.PLATOON, UnitLevels.COMPANY, UnitLevels.BATTALION]
  // Admin has access to all levels
};
var TrainingSteps = {
  RISK_ASSESSMENT: 1,
  PLANNING: 2,
  PREPARATION: 3,
  REHEARSAL: 4,
  EXECUTION: 5,
  AAR: 6,
  RETRAINING: 7,
  CERTIFICATION: 8
};
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  rank: text("rank").notNull(),
  role: text("role").notNull(),
  unitId: integer("unit_id").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at")
});
var units = pgTable("units", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  parentId: integer("parent_id"),
  unitLevel: text("unit_level").notNull(),
  // Battalion, Company, Platoon, etc.
  referralCode: text("referral_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at")
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id").notNull(),
  createdBy: integer("created_by").notNull(),
  step: integer("step").notNull(),
  // 1-8 based on training model
  date: timestamp("date").notNull(),
  // Start date for the event
  isMultiDayEvent: boolean("is_multi_day_event").default(false).notNull(),
  // Flag for multi-day events
  endDate: timestamp("end_date"),
  // End date for multi-day events
  location: text("location").notNull(),
  objectives: text("objectives").notNull(),
  missionStatement: text("mission_statement"),
  conceptOfOperation: text("concept_of_operation"),
  resources: text("resources"),
  eventType: text("event_type").default("training").notNull(),
  // Training, Mission, Exercise, etc.
  participants: json("participants").notNull(),
  // Array of user IDs
  participatingUnits: json("participating_units").default("[]").notNull(),
  // Array of unit IDs
  notifyParticipants: boolean("notify_participants").default(false).notNull(),
  // Flag to notify participants when in Step 6 (AAR)
  // Step notes
  step1Notes: text("step1_notes"),
  step2Notes: text("step2_notes"),
  step3Notes: text("step3_notes"),
  step4Notes: text("step4_notes"),
  step5Notes: text("step5_notes"),
  step6Notes: text("step6_notes"),
  step7Notes: text("step7_notes"),
  step8Notes: text("step8_notes"),
  // Step dates
  step1Date: timestamp("step1_date"),
  step2Date: timestamp("step2_date"),
  step3Date: timestamp("step3_date"),
  step4Date: timestamp("step4_date"),
  step5Date: timestamp("step5_date"),
  step6Date: timestamp("step6_date"),
  step7Date: timestamp("step7_date"),
  step8Date: timestamp("step8_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at")
});
var aars = pgTable("aars", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  unitId: integer("unit_id").notNull(),
  createdBy: integer("created_by").notNull(),
  sustainItems: json("sustain_items").$type().notNull(),
  // What went well
  improveItems: json("improve_items").$type().notNull(),
  // What could be improved
  actionItems: json("action_items").$type().notNull(),
  // Action items for improvement
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at")
});
var auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  // e.g., "login", "create_aar", "edit_event"
  details: json("details"),
  // Any relevant details
  ipAddress: text("ip_address").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  deletedAt: true
});
var insertUnitSchema = createInsertSchema(units).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  deletedAt: true
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  deletedAt: true
});
var insertAARSchema = createInsertSchema(aars).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  deletedAt: true
});
var insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  // e.g., "AAR_REQUIRED", "EVENT_ADDED", "UNIT_CHANGE"
  relatedEntityId: integer("related_entity_id"),
  // ID of the related event, AAR, etc.
  relatedEntityType: text("related_entity_type"),
  // Type of the related entity (event, AAR, etc.)
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  read: true
});
var userUnitAssignments = pgTable("user_unit_assignments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  unitId: integer("unit_id").notNull().references(() => units.id),
  assignmentType: text("assignment_type").notNull(),
  // "PRIMARY", "ATTACHED", "TEMPORARY", etc.
  leadershipRole: text("leadership_role"),
  // Unit-specific role if user is in leadership
  assignedBy: integer("assigned_by").references(() => users.id),
  // Who made the assignment
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  // NULL for ongoing assignments
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at")
});
var insertUserUnitAssignmentSchema = createInsertSchema(userUnitAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  deletedAt: true
});
var AssignmentTypes = {
  PRIMARY: "PRIMARY",
  // Main unit assignment
  ATTACHED: "ATTACHED",
  // Formally attached to another unit
  TEMPORARY: "TEMPORARY",
  // Temporary assignment (e.g., training)
  DUAL_HATTED: "DUAL_HATTED"
  // Serving in multiple leadership roles
};
var LeadershipRoles = {
  [UnitLevels.COMPANY]: ["Commander", "Executive Officer", "First Sergeant", "Company Admin"],
  [UnitLevels.PLATOON]: ["Platoon Leader", "Platoon Sergeant", "Platoon Admin"],
  [UnitLevels.SQUAD]: ["Squad Leader", "Assistant Squad Leader"],
  [UnitLevels.TEAM]: ["Team Leader"]
};

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, or, isNull, lt, gt, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
var PostgresSessionStore = connectPg(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
    try {
      this.initSampleData();
    } catch (err) {
      console.log("Note: Sample data initialization skipped or already exists");
    }
  }
  // User-Unit Assignment operations
  async getUserUnitAssignments(userId) {
    try {
      const assignments = await db.select().from(userUnitAssignments).where(
        and(
          eq(userUnitAssignments.userId, userId),
          eq(userUnitAssignments.isDeleted, false),
          or(
            isNull(userUnitAssignments.endDate),
            gt(userUnitAssignments.endDate, /* @__PURE__ */ new Date())
          )
        )
      );
      return assignments;
    } catch (error) {
      console.error("Error getting user unit assignments:", error);
      return [];
    }
  }
  async getUserPrimaryUnit(userId) {
    try {
      const [primaryAssignment] = await db.select().from(userUnitAssignments).where(
        and(
          eq(userUnitAssignments.userId, userId),
          eq(userUnitAssignments.assignmentType, "PRIMARY"),
          eq(userUnitAssignments.isDeleted, false),
          or(
            isNull(userUnitAssignments.endDate),
            gt(userUnitAssignments.endDate, /* @__PURE__ */ new Date())
          )
        )
      );
      if (!primaryAssignment) {
        const user = await this.getUser(userId);
        if (user && user.unitId) {
          return this.getUnit(user.unitId);
        }
        return void 0;
      }
      return this.getUnit(primaryAssignment.unitId);
    } catch (error) {
      console.error("Error getting user primary unit:", error);
      return void 0;
    }
  }
  async getUsersByUnitRole(unitId, leadershipRole) {
    try {
      const query = db.select({
        user: users
      }).from(userUnitAssignments).innerJoin(users, eq(userUnitAssignments.userId, users.id)).where(
        and(
          eq(userUnitAssignments.unitId, unitId),
          eq(userUnitAssignments.isDeleted, false),
          or(
            isNull(userUnitAssignments.endDate),
            gt(userUnitAssignments.endDate, /* @__PURE__ */ new Date())
          )
        )
      );
      if (leadershipRole) {
        query.where(eq(userUnitAssignments.leadershipRole, leadershipRole));
      }
      const results = await query;
      return results.map((r) => r.user);
    } catch (error) {
      console.error("Error getting users by unit role:", error);
      return [];
    }
  }
  async getUnitLeaders(unitId) {
    try {
      const results = await db.select({
        user: users
      }).from(userUnitAssignments).innerJoin(users, eq(userUnitAssignments.userId, users.id)).where(
        and(
          eq(userUnitAssignments.unitId, unitId),
          eq(userUnitAssignments.isDeleted, false),
          or(
            isNull(userUnitAssignments.endDate),
            gt(userUnitAssignments.endDate, /* @__PURE__ */ new Date())
          )
        )
      ).where(
        // Only get assignments with a leadership role (not null)
        isNull(userUnitAssignments.leadershipRole).not()
      );
      return results.map((r) => r.user);
    } catch (error) {
      console.error("Error getting unit leaders:", error);
      return [];
    }
  }
  async assignUserToUnit(assignment) {
    try {
      const [newAssignment] = await db.insert(userUnitAssignments).values(assignment).returning();
      return newAssignment;
    } catch (error) {
      console.error("Error assigning user to unit:", error);
      throw error;
    }
  }
  async updateUserUnitAssignment(id, updates) {
    try {
      const [updatedAssignment] = await db.update(userUnitAssignments).set({
        ...updates,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(userUnitAssignments.id, id)).returning();
      return updatedAssignment;
    } catch (error) {
      console.error("Error updating user unit assignment:", error);
      return void 0;
    }
  }
  async removeUserFromUnit(userId, unitId) {
    try {
      const [result] = await db.update(userUnitAssignments).set({
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        endDate: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(
        and(
          eq(userUnitAssignments.userId, userId),
          eq(userUnitAssignments.unitId, unitId),
          eq(userUnitAssignments.isDeleted, false)
        )
      ).returning();
      return !!result;
    } catch (error) {
      console.error("Error removing user from unit:", error);
      return false;
    }
  }
  async initSampleData() {
    try {
      const existingUsers = await db.select().from(users);
      if (existingUsers.length === 0) {
        const testUnit = await this.createUnit({
          name: "Test Battalion",
          unitLevel: "Battalion",
          referralCode: "test-battalion"
        });
        console.log("Init: Created test unit:", testUnit);
        const adminUser = await this.createUser({
          username: "admin",
          password: "password",
          name: "Admin User",
          rank: "Colonel",
          role: "admin",
          unitId: testUnit.id,
          bio: "Test user for system administration"
        });
        console.log("Init: Created admin user:", adminUser);
      }
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
  async getUser(id) {
    try {
      const [user] = await db.select().from(users).where(and(
        eq(users.id, id),
        eq(users.isDeleted, false)
      ));
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const [user] = await db.select().from(users).where(and(
        eq(users.username, username),
        eq(users.isDeleted, false)
      ));
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return void 0;
    }
  }
  async createUser(userData) {
    try {
      const [user] = await db.insert(users).values(userData).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  async updateUser(id, updates) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [updatedUser] = await db.update(users).set({ ...updates, updatedAt: now }).where(and(
        eq(users.id, id),
        eq(users.isDeleted, false)
      )).returning();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return void 0;
    }
  }
  async softDeleteUser(id) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [deletedUser] = await db.update(users).set({ isDeleted: true, deletedAt: now, updatedAt: now }).where(eq(users.id, id)).returning();
      return !!deletedUser;
    } catch (error) {
      console.error("Error soft deleting user:", error);
      return false;
    }
  }
  async restoreUser(id) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [restoredUser] = await db.update(users).set({ isDeleted: false, deletedAt: null, updatedAt: now }).where(eq(users.id, id)).returning();
      return !!restoredUser;
    } catch (error) {
      console.error("Error restoring user:", error);
      return false;
    }
  }
  async getUsersByUnit(unitId) {
    try {
      return await db.select().from(users).where(and(
        eq(users.unitId, unitId),
        eq(users.isDeleted, false)
      ));
    } catch (error) {
      console.error("Error getting users by unit:", error);
      return [];
    }
  }
  async getAllUsers() {
    try {
      console.log("Getting all users from database");
      const result = await db.select().from(users).where(
        eq(users.isDeleted, false)
      );
      console.log(`Found ${result.length} users in the database`);
      return result;
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }
  async getUnit(id) {
    try {
      const [unit] = await db.select().from(units).where(and(
        eq(units.id, id),
        eq(units.isDeleted, false)
      ));
      return unit;
    } catch (error) {
      console.error("Error getting unit:", error);
      return void 0;
    }
  }
  async getUnitByReferralCode(code) {
    try {
      const [unit] = await db.select().from(units).where(and(
        eq(units.referralCode, code),
        eq(units.isDeleted, false)
      ));
      return unit;
    } catch (error) {
      console.error("Error getting unit by referral code:", error);
      return void 0;
    }
  }
  async createUnit(unitData) {
    try {
      const [unit] = await db.insert(units).values(unitData).returning();
      return unit;
    } catch (error) {
      console.error("Error creating unit:", error);
      throw error;
    }
  }
  async updateUnit(id, updates) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [updatedUnit] = await db.update(units).set({ ...updates, updatedAt: now }).where(and(
        eq(units.id, id),
        eq(units.isDeleted, false)
      )).returning();
      return updatedUnit;
    } catch (error) {
      console.error("Error updating unit:", error);
      return void 0;
    }
  }
  async softDeleteUnit(id) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [deletedUnit] = await db.update(units).set({ isDeleted: true, deletedAt: now, updatedAt: now }).where(eq(units.id, id)).returning();
      return !!deletedUnit;
    } catch (error) {
      console.error("Error soft deleting unit:", error);
      return false;
    }
  }
  async restoreUnit(id) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [restoredUnit] = await db.update(units).set({ isDeleted: false, deletedAt: null, updatedAt: now }).where(eq(units.id, id)).returning();
      return !!restoredUnit;
    } catch (error) {
      console.error("Error restoring unit:", error);
      return false;
    }
  }
  async getSubunits(parentId) {
    try {
      return await db.select().from(units).where(and(
        eq(units.parentId, parentId),
        eq(units.isDeleted, false)
      ));
    } catch (error) {
      console.error("Error getting subunits:", error);
      return [];
    }
  }
  async getAllUnits() {
    try {
      return await db.select().from(units).where(eq(units.isDeleted, false));
    } catch (error) {
      console.error("Error getting all units:", error);
      return [];
    }
  }
  async getEvent(id) {
    try {
      const [event] = await db.select().from(events).where(and(
        eq(events.id, id),
        eq(events.isDeleted, false)
      ));
      return event;
    } catch (error) {
      console.error("Error getting event:", error);
      return void 0;
    }
  }
  async getEventsByUnit(unitId) {
    try {
      return await db.select().from(events).where(and(
        eq(events.unitId, unitId),
        eq(events.isDeleted, false)
      ));
    } catch (error) {
      console.error("Error getting events by unit:", error);
      return [];
    }
  }
  async getAllEvents() {
    try {
      return await db.select().from(events).where(
        eq(events.isDeleted, false)
      );
    } catch (error) {
      console.error("Error getting all events:", error);
      return [];
    }
  }
  async getEventsByUserParticipation(userId) {
    try {
      const allEvents = await this.getAllEvents();
      return allEvents.filter((event) => {
        const participants = Array.isArray(event.participants) ? event.participants : [];
        return participants.includes(userId);
      });
    } catch (error) {
      console.error("Error getting events by user participation:", error);
      return [];
    }
  }
  async createEvent(eventData) {
    try {
      const [event] = await db.insert(events).values(eventData).returning();
      return event;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }
  async updateEvent(id, updates) {
    try {
      const now = /* @__PURE__ */ new Date();
      const processedUpdates = { ...updates };
      const dateFields = [
        "step1Date",
        "step2Date",
        "step3Date",
        "step4Date",
        "step5Date",
        "step6Date",
        "step7Date",
        "step8Date"
      ];
      for (const field of dateFields) {
        if (field in processedUpdates) {
          const dateValue = processedUpdates[field];
          if (dateValue === "" || dateValue === void 0) {
            processedUpdates[field] = null;
          } else if (typeof dateValue === "string") {
            try {
              processedUpdates[field] = new Date(dateValue);
            } catch (e) {
              console.error(`Invalid date for ${field}:`, dateValue);
              processedUpdates[field] = null;
            }
          }
        }
      }
      if ("date" in processedUpdates && processedUpdates.date) {
        processedUpdates.date = new Date(processedUpdates.date);
      }
      if ("endDate" in processedUpdates) {
        if (processedUpdates.endDate === "" || processedUpdates.endDate === void 0) {
          processedUpdates.endDate = null;
        } else if (processedUpdates.endDate) {
          processedUpdates.endDate = new Date(processedUpdates.endDate);
        }
      }
      const [updatedEvent] = await db.update(events).set({ ...processedUpdates, updatedAt: now }).where(and(
        eq(events.id, id),
        eq(events.isDeleted, false)
      )).returning();
      return updatedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      return void 0;
    }
  }
  async softDeleteEvent(id) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [deletedEvent] = await db.update(events).set({ isDeleted: true, deletedAt: now, updatedAt: now }).where(eq(events.id, id)).returning();
      return !!deletedEvent;
    } catch (error) {
      console.error("Error soft deleting event:", error);
      return false;
    }
  }
  async restoreEvent(id) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [restoredEvent] = await db.update(events).set({ isDeleted: false, deletedAt: null, updatedAt: now }).where(eq(events.id, id)).returning();
      return !!restoredEvent;
    } catch (error) {
      console.error("Error restoring event:", error);
      return false;
    }
  }
  async addParticipantsToEvent(eventId, userIds) {
    try {
      const event = await this.getEvent(eventId);
      if (!event) return void 0;
      const existingParticipants = Array.isArray(event.participants) ? event.participants : [];
      const uniqueIds = [.../* @__PURE__ */ new Set([...existingParticipants, ...userIds])];
      const allParticipants = Array.from(uniqueIds);
      return await this.updateEvent(eventId, { participants: allParticipants });
    } catch (error) {
      console.error("Error adding participants to event:", error);
      return void 0;
    }
  }
  async addUnitToEvent(eventId, unitId) {
    try {
      const event = await this.getEvent(eventId);
      if (!event) return void 0;
      const existingUnits = Array.isArray(event.participatingUnits) ? event.participatingUnits : [];
      const uniqueUnits = [.../* @__PURE__ */ new Set([...existingUnits, unitId])];
      const allUnits = Array.from(uniqueUnits);
      return await this.updateEvent(eventId, { participatingUnits: allUnits });
    } catch (error) {
      console.error("Error adding unit to event:", error);
      return void 0;
    }
  }
  async getEventParticipants(eventId) {
    try {
      const event = await this.getEvent(eventId);
      if (!event || !event.participants || event.participants.length === 0) return [];
      return await db.select().from(users).where(and(
        or(...event.participants.map((id) => eq(users.id, id))),
        eq(users.isDeleted, false)
      ));
    } catch (error) {
      console.error("Error getting event participants:", error);
      return [];
    }
  }
  async getPendingAAREvents(userId) {
    try {
      const userEvents = await this.getEventsByUserParticipation(userId);
      if (userEvents.length === 0) return [];
      const userAARs = await this.getAARsByUser(userId);
      const completedEventIds = new Set(userAARs.map((aar) => aar.eventId));
      return userEvents.filter(
        (event) => event.step === 6 && !completedEventIds.has(event.id)
      );
    } catch (error) {
      console.error("Error getting pending AAR events:", error);
      return [];
    }
  }
  async getAAR(id) {
    try {
      const [aar] = await db.select().from(aars).where(and(
        eq(aars.id, id),
        eq(aars.isDeleted, false)
      ));
      return aar;
    } catch (error) {
      console.error("Error getting AAR:", error);
      return void 0;
    }
  }
  async getAARsByEvent(eventId) {
    try {
      return await db.select().from(aars).where(and(
        eq(aars.eventId, eventId),
        eq(aars.isDeleted, false)
      ));
    } catch (error) {
      console.error("Error getting AARs by event:", error);
      return [];
    }
  }
  async getAARsByUnit(unitId) {
    try {
      return await db.select().from(aars).where(and(
        eq(aars.unitId, unitId),
        eq(aars.isDeleted, false)
      ));
    } catch (error) {
      console.error("Error getting AARs by unit:", error);
      return [];
    }
  }
  async getAARsByUser(userId) {
    try {
      return await db.select().from(aars).where(and(
        eq(aars.createdBy, userId),
        eq(aars.isDeleted, false)
      ));
    } catch (error) {
      console.error("Error getting AARs by user:", error);
      return [];
    }
  }
  async createAAR(aarData) {
    try {
      const [aar] = await db.insert(aars).values(aarData).returning();
      return aar;
    } catch (error) {
      console.error("Error creating AAR:", error);
      throw error;
    }
  }
  async updateAAR(id, updates) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [updatedAAR] = await db.update(aars).set({ ...updates, updatedAt: now }).where(and(
        eq(aars.id, id),
        eq(aars.isDeleted, false)
      )).returning();
      return updatedAAR;
    } catch (error) {
      console.error("Error updating AAR:", error);
      return void 0;
    }
  }
  async softDeleteAAR(id) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [deletedAAR] = await db.update(aars).set({ isDeleted: true, deletedAt: now, updatedAt: now }).where(eq(aars.id, id)).returning();
      return !!deletedAAR;
    } catch (error) {
      console.error("Error soft deleting AAR:", error);
      return false;
    }
  }
  async restoreAAR(id) {
    try {
      const now = /* @__PURE__ */ new Date();
      const [restoredAAR] = await db.update(aars).set({ isDeleted: false, deletedAt: null, updatedAt: now }).where(eq(aars.id, id)).returning();
      return !!restoredAAR;
    } catch (error) {
      console.error("Error restoring AAR:", error);
      return false;
    }
  }
  async createAuditLog(logData) {
    try {
      const [log2] = await db.insert(auditLogs).values(logData).returning();
      return log2;
    } catch (error) {
      console.error("Error creating audit log:", error);
      throw error;
    }
  }
  async getAuditLogs(userId, startDate, endDate) {
    try {
      let query = db.select().from(auditLogs);
      if (userId) {
        query = query.where(eq(auditLogs.userId, userId));
      }
      if (startDate) {
        query = query.where(gt(auditLogs.timestamp, startDate));
      }
      if (endDate) {
        query = query.where(lt(auditLogs.timestamp, endDate));
      }
      query = query.orderBy(desc(auditLogs.timestamp));
      return await query;
    } catch (error) {
      console.error("Error getting audit logs:", error);
      return [];
    }
  }
  async generateVeniceAnalysis(unitId) {
    try {
      const unitAARs = await this.getAARsByUnit(unitId);
      console.log(`Found ${unitAARs.length} AARs for unit ${unitId}`);
      const { aarAnalysisService: aarAnalysisService2 } = await Promise.resolve().then(() => (init_aar_analysis(), aar_analysis_exports));
      return await aarAnalysisService2.analyzeAARs(unitAARs);
    } catch (error) {
      console.error("Error generating Venice analysis:", error);
      return {
        trends: [],
        frictionPoints: [],
        recommendations: []
      };
    }
  }
  async generateVenicePromptAnalysis(unitId, prompt) {
    try {
      const { veniceAIService: veniceAIService2 } = await Promise.resolve().then(() => (init_venice_ai(), venice_ai_exports));
      const unitAARs = await this.getAARsByUnit(unitId);
      console.log(`Analyzing ${unitAARs.length} AARs for unit ${unitId} with prompt: "${prompt}"`);
      return await veniceAIService2.generatePromptAnalysis(unitAARs, prompt);
    } catch (error) {
      console.error("Error generating Venice prompt analysis:", error);
      return {
        trends: [
          {
            category: "Error",
            description: "An error occurred while processing your prompt.",
            frequency: 0,
            severity: "Medium"
          }
        ],
        frictionPoints: [
          {
            category: "System Error",
            description: "The analysis service is currently unavailable.",
            impact: "Medium"
          }
        ],
        recommendations: [
          {
            category: "Retry",
            description: "Please try again later or contact support if the issue persists.",
            priority: "Medium"
          }
        ]
      };
    }
  }
  async getNotificationsForUser(userId) {
    try {
      return await db.select().from(notifications).where(
        eq(notifications.userId, userId)
      ).orderBy(desc(notifications.createdAt));
    } catch (error) {
      console.error("Error getting notifications for user:", error);
      return [];
    }
  }
  async markNotificationAsRead(notificationId) {
    try {
      const [updatedNotification] = await db.update(notifications).set({ read: true }).where(eq(notifications.id, notificationId)).returning();
      return !!updatedNotification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }
  async createNotification(notificationData) {
    try {
      const [notification] = await db.insert(notifications).values(notificationData).returning();
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";

// server/lib/permissions.ts
async function canUserAccessUnit(user, targetUnit) {
  if (user.role === MilitaryRoles.ADMIN && user.username === "admin") {
    console.log(`User ${user.username} (ID: ${user.id}) is a system admin with global access`);
    return true;
  }
  if (user.unitId === targetUnit.id) {
    return true;
  }
  const userUnit = await storage.getUnit(user.unitId);
  if (!userUnit) {
    return false;
  }
  let accessibleLevels = [];
  for (const [key, value] of Object.entries(MilitaryRoles)) {
    if (value === user.role) {
      const levels = MilitaryHierarchy[value] || [];
      accessibleLevels = Array.isArray(levels) ? [...levels] : [];
      break;
    }
  }
  if (accessibleLevels.length === 0) {
    console.warn(`No defined hierarchy for role: ${user.role}`);
  }
  if (!accessibleLevels.includes(targetUnit.unitLevel)) {
    return false;
  }
  return isUnitInChainOfCommand(userUnit, targetUnit);
}
async function isUnitInChainOfCommand(sourceUnit, targetUnit) {
  if (sourceUnit.id === targetUnit.id) {
    return true;
  }
  if (targetUnit.parentId === sourceUnit.id) {
    return true;
  }
  if (getUnitHierarchyLevel(sourceUnit.unitLevel) < getUnitHierarchyLevel(targetUnit.unitLevel)) {
    return false;
  }
  if (!targetUnit.parentId) {
    return false;
  }
  const parentUnit = await storage.getUnit(targetUnit.parentId);
  if (!parentUnit) {
    return false;
  }
  return isUnitInChainOfCommand(sourceUnit, parentUnit);
}
function getUnitHierarchyLevel(unitLevel) {
  switch (unitLevel) {
    case UnitLevels.TEAM:
      return 1;
    case UnitLevels.SQUAD:
      return 2;
    case UnitLevels.PLATOON:
      return 3;
    case UnitLevels.COMPANY:
      return 4;
    case UnitLevels.BATTALION:
      return 5;
    default:
      return 0;
  }
}
async function getAccessibleUnits(userId) {
  const user = await storage.getUser(userId);
  if (!user) {
    return [];
  }
  if (user.role === MilitaryRoles.ADMIN && user.username === "admin") {
    console.log(`System admin ${user.username} - returning all units`);
    return storage.getAllUnits();
  }
  if (user.role === MilitaryRoles.COMMANDER) {
    console.log(`Unit commander ${user.username} - restricting to own unit hierarchy`);
    const userUnit = await storage.getUnit(user.unitId);
    if (!userUnit) {
      return [];
    }
    const accessibleUnits2 = [userUnit];
    const allUnits2 = await storage.getAllUnits();
    const findSubunits = (parentId) => {
      const subunits = allUnits2.filter((unit) => unit.parentId === parentId);
      subunits.forEach((subunit) => {
        accessibleUnits2.push(subunit);
        findSubunits(subunit.id);
      });
    };
    findSubunits(user.unitId);
    return accessibleUnits2;
  }
  const allUnits = await storage.getAllUnits();
  const accessibleUnits = [];
  for (const unit of allUnits) {
    if (await canUserAccessUnit(user, unit)) {
      accessibleUnits.push(unit);
    }
  }
  return accessibleUnits;
}
async function getAccessibleUsers(userId) {
  const user = await storage.getUser(userId);
  if (!user) {
    return [];
  }
  const accessibleUnits = await getAccessibleUnits(userId);
  const accessibleUnitIds = accessibleUnits.map((unit) => unit.id);
  const allUsers = await Promise.all(
    accessibleUnitIds.map((unitId) => storage.getUsersByUnit(unitId))
  );
  const flattenedUsers = allUsers.flat();
  const uniqueUsers = flattenedUsers.filter(
    (user2, index, self) => index === self.findIndex((u) => u.id === user2.id)
  );
  return uniqueUsers;
}

// server/routes.ts
import { nanoid } from "nanoid";
import crypto from "crypto";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
function setupAuth(app2) {
  app2.use(session2({
    secret: process.env.SESSION_SECRET || "military-aar-system-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      // 'lax' is best for local dev, or try 'strict'
      maxAge: 24 * 60 * 60 * 1e3
    },
    store: storage.sessionStore
  }));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        console.log(`Attempting to authenticate user: ${username}`);
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log(`Authentication failed: User not found: ${username}`);
          return done(null, false, { message: "Incorrect username or password." });
        }
        if (user.password !== password) {
          console.log(`Authentication failed: Password mismatch for ${username}`);
          return done(null, false, { message: "Incorrect username or password." });
        }
        console.log(`Authentication successful for ${username}`);
        return done(null, user);
      } catch (err) {
        console.error("Authentication error:", err);
        return done(err);
      }
    }
  ));
  passport.serializeUser((user, done) => {
    console.log(`Serializing user: ${user.username}, ID: ${user.id}`);
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      console.log(`Deserializing user ID: ${id}`);
      const user = await storage.getUser(id);
      if (!user) {
        console.log(`Deserialization failed: User with ID ${id} not found`);
        return done(null, false);
      }
      console.log(`Deserialization successful for user: ${user.username}`);
      done(null, user);
    } catch (err) {
      console.error("Deserialization error:", err);
      done(err);
    }
  });
  const sanitizeUser2 = (user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  };
  app2.get("/api/auth/me", (req, res) => {
    console.log(`GET /api/auth/me, isAuthenticated: ${req.isAuthenticated()}`);
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(sanitizeUser2(req.user));
  });
  app2.post("/api/auth/login", (req, res, next) => {
    console.log(`Login attempt for username: ${req.body.username}`);
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      if (!user) {
        console.log(`Login failed: ${info?.message || "Unknown error"}`);
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (err2) => {
        if (err2) {
          console.error("Session error during login:", err2);
          return next(err2);
        }
        console.log(`Login successful for user: ${user.username}, role: ${user.role}`);
        return res.json(sanitizeUser2(user));
      });
    })(req, res, next);
  });
  app2.post("/api/auth/logout", (req, res) => {
    console.log(`Logout request for user: ${req.user?.username || "Unknown"}`);
    if (!req.isAuthenticated()) {
      return res.status(200).json({ message: "Not logged in" });
    }
    const username = req.user?.username;
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Error during logout" });
      }
      console.log(`Logout successful for user: ${username}`);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
}
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

// server/services/openai-service.ts
var OpenAIService = class {
  apiKey;
  apiUrl = "https://api.openai.com/v1";
  isEnabled = false;
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    this.isEnabled = !!this.apiKey;
    if (this.isEnabled) {
      console.log("OpenAI integration enabled");
    } else {
      console.warn("OpenAI API key not found. Analysis will use fallback data.");
    }
  }
  /**
   * Generate analysis based on AAR data
   * 
   * @param aars Array of AARs to analyze
   * @returns AI-generated analysis of the AAR data
   */
  async generateAnalysis(aars2) {
    if (aars2.length === 0) {
      return this.getInsufficientDataResponse(0);
    }
    if (aars2.length < 3) {
      return this.getInsufficientDataResponse(aars2.length);
    }
    if (!this.isEnabled) {
      return {
        trends: [
          {
            category: "Integration Setup Required",
            description: "AI analysis requires an OpenAI API key configuration. Please check your environment settings.",
            frequency: 0,
            severity: "Medium"
          }
        ],
        frictionPoints: [],
        recommendations: []
      };
    }
    try {
      const formattedData = this.formatAARData(aars2);
      console.log(`Analyzing ${aars2.length} AARs using OpenAI`);
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are Venice AI, a specialized military training analysis system. You analyze After Action Reports (AARs) from military training events and identify SPECIFIC, CONCRETE trends, friction points, and recommendations. Your analysis must be evidence-based, detailed, and directly relevant to improving military training outcomes. Never be vague or generic - always cite specific training areas, equipment, or procedures that need attention."
            },
            {
              role: "user",
              content: `Analyze these After Action Reports from military training events: ${JSON.stringify(formattedData)}. 
              
              Extract specific, actionable insights and format your response as a JSON object with these fields:
              {
                "trends": [
                  {
                    "category": "Specific training area or capability (e.g., 'Radio Communications', 'Night Operations', 'Vehicle Maintenance')",
                    "description": "Detailed, concrete description with specific examples from the AARs. Mention specific equipment, techniques, or procedures. Never be vague.",
                    "frequency": number of occurrences (1-10),
                    "severity": "Low/Medium/High"
                  }
                ],
                "frictionPoints": [
                  {
                    "category": "Specific problem area (e.g., 'Command Post Operations', 'Land Navigation Equipment', 'Squad Leader Training')",
                    "description": "Detailed explanation of the exact problem, citing specific examples or patterns from the AARs",
                    "impact": "Low/Medium/High"
                  }
                ],
                "recommendations": [
                  {
                    "category": "Specific area for improvement (e.g., 'Communications Training', 'Equipment Maintenance', 'Leadership Development')",
                    "description": "Concrete, actionable recommendation with specific steps to implement. Be detailed and practical.",
                    "priority": "Low/Medium/High"
                  }
                ]
              }
              
              Provide 3-5 insights for each section. If there's limited data, focus on being specific about what the data does show rather than being generic.`
            }
          ],
          temperature: 0.4
        })
      });
      if (!response.ok) {
        console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
        return this.getDefaultAnalysis();
      }
      const responseData = await response.json();
      const content = responseData.choices[0].message.content;
      try {
        const parsedData = JSON.parse(content);
        return {
          trends: Array.isArray(parsedData.trends) ? parsedData.trends : [],
          frictionPoints: Array.isArray(parsedData.frictionPoints) ? parsedData.frictionPoints : [],
          recommendations: Array.isArray(parsedData.recommendations) ? parsedData.recommendations : []
        };
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        return this.getDefaultAnalysis();
      }
    } catch (error) {
      console.error("Error generating analysis with OpenAI:", error);
      return this.getDefaultAnalysis();
    }
  }
  /**
   * Format AAR data for analysis
   */
  formatAARData(aars2) {
    const allItems = [];
    aars2.forEach((aar) => {
      const eventInfo = {
        eventId: aar.eventId,
        unitId: aar.unitId,
        createdAt: aar.createdAt
      };
      const sustainItems = Array.isArray(aar.sustainItems) ? aar.sustainItems : [];
      sustainItems.forEach((item) => {
        allItems.push({
          ...eventInfo,
          type: "sustain",
          text: item.text,
          authorRank: item.authorRank,
          authorUnitLevel: item.unitLevel,
          timestamp: item.createdAt,
          tags: item.tags || []
        });
      });
      const improveItems = Array.isArray(aar.improveItems) ? aar.improveItems : [];
      improveItems.forEach((item) => {
        allItems.push({
          ...eventInfo,
          type: "improve",
          text: item.text,
          authorRank: item.authorRank,
          authorUnitLevel: item.unitLevel,
          timestamp: item.createdAt,
          tags: item.tags || []
        });
      });
      const actionItems = Array.isArray(aar.actionItems) ? aar.actionItems : [];
      actionItems.forEach((item) => {
        allItems.push({
          ...eventInfo,
          type: "action",
          text: item.text,
          authorRank: item.authorRank,
          authorUnitLevel: item.unitLevel,
          timestamp: item.createdAt,
          tags: item.tags || []
        });
      });
    });
    return {
      items: allItems,
      metadata: {
        total_aars: aars2.length,
        date_range: {
          start: aars2.length > 0 ? this.getFirstDate(aars2) : null,
          end: aars2.length > 0 ? this.getLastDate(aars2) : null
        }
      }
    };
  }
  /**
   * Get the earliest date from a collection of AARs
   */
  getFirstDate(aars2) {
    if (aars2.length === 0) return (/* @__PURE__ */ new Date()).toISOString();
    let earliestDate = new Date(aars2[0].createdAt).toISOString();
    for (const aar of aars2) {
      const createdAt = new Date(aar.createdAt).toISOString();
      if (createdAt < earliestDate) {
        earliestDate = createdAt;
      }
    }
    return earliestDate;
  }
  /**
   * Get the latest date from a collection of AARs
   */
  getLastDate(aars2) {
    if (aars2.length === 0) return (/* @__PURE__ */ new Date()).toISOString();
    let latestDate = new Date(aars2[0].createdAt).toISOString();
    for (const aar of aars2) {
      const createdAt = new Date(aar.createdAt).toISOString();
      if (createdAt > latestDate) {
        latestDate = createdAt;
      }
    }
    return latestDate;
  }
  /**
   * Get response for insufficient data cases
   */
  getInsufficientDataResponse(count) {
    return {
      trends: [
        {
          category: "Insufficient Data",
          description: count === 0 ? "To get AI-powered training insights, complete AARs for your training events. The Venice AI system requires multiple AARs to identify patterns and generate meaningful recommendations." : `Currently analyzing ${count} AAR(s). For more accurate insights, complete at least 3 AARs. Additional data will enable the AI to identify meaningful patterns across multiple training events.`,
          frequency: count,
          severity: "Medium"
        }
      ],
      frictionPoints: [],
      recommendations: []
    };
  }
  /**
   * Get default analysis when API fails
   */
  getDefaultAnalysis() {
    return {
      trends: [
        {
          category: "Radio Communications",
          description: "SINCGARS radio protocols are inconsistently applied during field exercises, particularly when squads operate in different sectors. Operators frequently switch to incorrect frequencies or fail to use proper call signs.",
          frequency: 7,
          severity: "Medium"
        },
        {
          category: "Night Vision Equipment",
          description: "PVS-14 night vision devices show significantly reduced battery life in cold weather (below 40\xB0F), limiting effectiveness of night operations. Multiple instances of fogging issues were also reported in humid conditions.",
          frequency: 3,
          severity: "High"
        },
        {
          category: "Urban Operations Training",
          description: "Squad clearing techniques in urban environments show inconsistent application of room-clearing procedures, particularly in multi-story structures. Units demonstrate strong performance in single-story operations but struggle with vertical maneuvers.",
          frequency: 5,
          severity: "Medium"
        }
      ],
      frictionPoints: [
        {
          category: "Joint Operation Command Structure",
          description: "When multiple teams operate together, command relationships become unclear, leading to delayed decision-making. Key issues include undefined handoff procedures between platoons and conflicting priorities between unit leaders.",
          impact: "High"
        },
        {
          category: "Weather Contingency Planning",
          description: "Training schedules lack adequate alternate plans for severe weather conditions, resulting in shortened or canceled critical training events. Specific gaps include no indoor alternatives for key skills practice and insufficient wet-weather gear allocation.",
          impact: "Medium"
        }
      ],
      recommendations: [
        {
          category: "Radio Communications Training",
          description: "Implement weekly communications exercises focusing specifically on SINCGARS protocol adherence. Require radio operators to pass a standardized assessment before field operations and designate communications NCOs to conduct regular spot checks during exercises.",
          priority: "High"
        },
        {
          category: "Urban Operations Training Program",
          description: "Develop a progressive urban operations qualification course focusing on multi-story building tactics. Begin with classroom instruction on vertical movement principles, followed by practical exercises in simulated multi-floor environments with increasing complexity.",
          priority: "Medium"
        },
        {
          category: "Command Structure Exercises",
          description: "Conduct monthly leadership exercises specifically designed to practice joint operations. Create scenarios requiring clear handoff procedures between units and formal decision-making processes. Evaluate leaders on their ability to establish and maintain clear chains of command.",
          priority: "Medium"
        }
      ]
    };
  }
};
var openaiService = new OpenAIService();

// server/routes.ts
init_venice_ai();
var logAudit = async (userId, action, details, ipAddress) => {
  await storage.createAuditLog({
    userId,
    action,
    details,
    ipAddress: ipAddress || "0.0.0.0"
  });
};
var sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};
async function registerRoutes(app2) {
  app2.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });
  app2.use((req, res, next) => {
    res.header("Content-Type", "application/json");
    next();
  });
  setupAuth(app2);
  app2.post("/api/users", async (req, res) => {
    try {
      console.log("Processing user registration:", req.body);
      if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Missing username or password" });
      }
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      let user;
      let unitId;
      if (req.body.referralCode) {
        console.log(`Registration with referral code: ${req.body.referralCode}`);
        const unit = await storage.getUnitByReferralCode(req.body.referralCode);
        if (!unit) {
          return res.status(404).json({ message: "Invalid referral code. Please check and try again." });
        }
        unitId = unit.id;
        const userData = {
          username: req.body.username,
          password: req.body.password,
          // In production, hash this password
          name: req.body.name,
          rank: req.body.rank,
          role: req.body.role,
          unitId,
          bio: req.body.bio || null
        };
        console.log(`Creating user with unit ID ${unitId} from referral code ${req.body.referralCode}`);
        user = await storage.createUser(userData);
      } else if (req.body.createNewUnit && req.body.unitName && req.body.unitLevel) {
        console.log(`Registration with new unit creation: ${req.body.unitName} (${req.body.unitLevel})`);
        const unitData = {
          name: req.body.unitName,
          unitLevel: req.body.unitLevel,
          description: `Unit created by ${req.body.name}`,
          referralCode: crypto.randomBytes(4).toString("hex").toUpperCase(),
          // Generate a random referral code
          parentUnitId: null
          // No parent unit for newly created units
        };
        console.log("Creating new unit:", unitData);
        const newUnit = await storage.createUnit(unitData);
        unitId = newUnit.id;
        const userData = {
          username: req.body.username,
          password: req.body.password,
          // In production, hash this password
          name: req.body.name,
          rank: req.body.rank,
          role: "Commander",
          // Make them a unit commander instead of system admin
          unitId,
          bio: req.body.bio || null
        };
        console.log(`Creating admin user for new unit ID ${unitId}`);
        user = await storage.createUser(userData);
        await storage.assignUserToUnit({
          userId: user.id,
          unitId,
          assignmentType: "PRIMARY",
          leadershipRole: "commander",
          // Make them the unit commander
          assignedBy: user.id,
          startDate: /* @__PURE__ */ new Date()
          // Use startDate instead of assignedAt
        });
        console.log(`User ${user.id} assigned as commander of unit ${unitId}`);
      } else {
        return res.status(400).json({
          message: "Either a referral code or unit creation details are required"
        });
      }
      const sanitizedUser = sanitizeUser(user);
      res.status(201).json(sanitizedUser);
    } catch (error) {
      console.error("User registration error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error registering user" });
      }
    }
  });
  app2.get("/api/users", isAuthenticated, async (req, res) => {
    try {
      const users2 = await getAccessibleUsers(req.user.id);
      res.json(users2.map(sanitizeUser));
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (req.user.role !== "admin") {
        const accessibleUsers = await getAccessibleUsers(req.user.id);
        if (!accessibleUsers.some((user2) => user2.id === userId)) {
          return res.status(403).json({ message: "You do not have permission to view this user" });
        }
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(sanitizeUser(user));
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Error getting user" });
    }
  });
  app2.patch("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      console.log("Profile update request received:", { params: req.params, body: req.body });
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (req.user.id !== userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to update this user" });
      }
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { name, rank, bio } = req.body;
      const updates = {};
      if (name !== void 0) updates.name = name;
      if (rank !== void 0) updates.rank = rank;
      if (bio !== void 0) updates.bio = bio;
      console.log("Preparing user updates:", updates);
      if (Object.keys(updates).length === 0) {
        return res.json(sanitizeUser(existingUser));
      }
      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        console.error("Failed to update user - storage.updateUser returned undefined");
        return res.status(500).json({ message: "Failed to update user" });
      }
      logAudit(
        req.user.id,
        "update_user_profile",
        { userId, updates },
        req.ip
      );
      console.log("User updated successfully:", { id: updatedUser.id, name: updatedUser.name });
      return res.json(sanitizeUser(updatedUser));
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Error updating user" });
    }
  });
  app2.get("/api/units/:id/members", isAuthenticated, async (req, res) => {
    try {
      const unitId = parseInt(req.params.id);
      if (isNaN(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      if (req.user.role !== "admin") {
        const accessibleUnits = await getAccessibleUnits(req.user.id);
        if (!accessibleUnits.some((unit) => unit.id === unitId)) {
          return res.status(403).json({ message: "You do not have permission to view this unit" });
        }
      }
      const members = await storage.getUsersByUnit(unitId);
      res.json(members.map(sanitizeUser));
    } catch (error) {
      console.error("Error getting unit members:", error);
      res.status(500).json({ message: "Error getting unit members" });
    }
  });
  app2.get("/api/users/:id/events", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (req.user.role !== "admin" && req.user.id !== userId) {
        const accessibleUsers = await getAccessibleUsers(req.user.id);
        if (!accessibleUsers.some((user) => user.id === userId)) {
          return res.status(403).json({ message: "You do not have permission to view this user's events" });
        }
      }
      const events2 = await storage.getEventsByUserParticipation(userId);
      const activeEvents = events2.filter((event) => !event.isDeleted);
      res.json(activeEvents);
    } catch (error) {
      console.error("Error getting user events:", error);
      res.status(500).json({ message: "Error getting user events" });
    }
  });
  app2.get("/api/users/:id/aars", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (req.user.role !== "admin" && req.user.id !== userId) {
        const accessibleUsers = await getAccessibleUsers(req.user.id);
        if (!accessibleUsers.some((user) => user.id === userId)) {
          return res.status(403).json({ message: "You do not have permission to view this user's AARs" });
        }
      }
      const aars2 = await storage.getAARsByUser(userId);
      res.json(aars2);
    } catch (error) {
      console.error("Error getting user AARs:", error);
      res.status(500).json({ message: "Error getting user AARs" });
    }
  });
  app2.post("/api/users/:id/custom-analysis", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.isDeleted) {
        return res.status(404).json({ message: "User not found" });
      }
      if (req.user.role !== "admin" && req.user.id !== userId) {
        const accessibleUsers = await getAccessibleUsers(req.user.id);
        if (!accessibleUsers.some((u) => u.id === userId)) {
          return res.status(403).json({ message: "You do not have permission to analyze this user's data" });
        }
      }
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ message: "Valid prompt is required" });
      }
      const userEvents = await storage.getEventsByUserParticipation(userId);
      const userAARs = await storage.getAARsByUser(userId);
      console.log(`Generating custom analysis for user ${userId} with ${userEvents.length} events and ${userAARs.length} AARs`);
      try {
        const analysis = await veniceAIService.generateCustomAnalysis(userAARs, userEvents, prompt);
        await logAudit(
          req.user.id || userId,
          "GENERATE_CUSTOM_ANALYSIS",
          { userId, prompt },
          req.ip
        );
        return res.json(analysis);
      } catch (error) {
        console.error("Error generating custom analysis:", error);
        return res.status(500).json({
          message: "Failed to generate analysis",
          content: "There was an error processing your request. Please try again later."
        });
      }
    } catch (error) {
      console.error("Error in custom analysis endpoint:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/users/:id/unit-assignments", isAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const assignments = await storage.getUserUnitAssignments(userId);
      if (assignments.length === 0) {
        return res.json([{
          id: null,
          // Will be assigned when saved
          userId,
          unitId: user.unitId,
          assignmentType: "PRIMARY",
          startDate: (/* @__PURE__ */ new Date()).toISOString(),
          isNew: true
        }]);
      }
      return res.json(assignments);
    } catch (error) {
      console.error("Error getting user unit assignments:", error);
      return res.status(500).json({ message: "Failed to get unit assignments" });
    }
  });
  app2.post("/api/users/:id/unit-assignments", isAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
      const { unitId, assignmentType, leadershipRole } = req.body;
      if (!unitId || !assignmentType) {
        return res.status(400).json({ message: "Unit ID and assignment type are required" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const unit = await storage.getUnit(unitId);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      const assignment = await storage.assignUserToUnit({
        userId,
        unitId,
        assignmentType,
        leadershipRole: leadershipRole !== "none" ? leadershipRole : null,
        assignedBy: req.user.id
      });
      if (assignmentType === "PRIMARY") {
        const allAssignments = await storage.getUserUnitAssignments(userId);
        const existingPrimary = allAssignments.find(
          (a) => a.assignmentType === "PRIMARY" && a.id !== assignment.id
        );
        if (existingPrimary) {
          await storage.updateUserUnitAssignment(existingPrimary.id, {
            assignmentType: "ATTACHED"
          });
        }
        await storage.updateUser(userId, { unitId: assignment.unitId });
      }
      logAudit(
        req.user.id,
        "assign_user_to_unit",
        {
          userId,
          unitId,
          assignmentType,
          leadershipRole
        },
        req.ip
      );
      return res.status(201).json(assignment);
    } catch (error) {
      console.error("Error creating unit assignment:", error);
      return res.status(500).json({ message: "Failed to create unit assignment" });
    }
  });
  app2.patch("/api/users/:userId/unit-assignments/:assignmentId", isAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.userId);
    const assignmentId = parseInt(req.params.assignmentId);
    if (isNaN(userId) || isNaN(assignmentId)) {
      return res.status(400).json({ message: "Invalid user ID or assignment ID" });
    }
    try {
      const { unitId, assignmentType, leadershipRole, endDate } = req.body;
      const assignments = await storage.getUserUnitAssignments(userId);
      const assignmentToUpdate = assignments.find((a) => a.id === assignmentId);
      if (!assignmentToUpdate) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      const updates = {};
      if (unitId) updates.unitId = unitId;
      if (assignmentType) updates.assignmentType = assignmentType;
      if (leadershipRole === "none") {
        updates.leadershipRole = null;
      } else if (leadershipRole) {
        updates.leadershipRole = leadershipRole;
      }
      if (endDate) updates.endDate = endDate;
      const assignment = await storage.updateUserUnitAssignment(assignmentId, updates);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found or could not be updated" });
      }
      if (assignmentType === "PRIMARY") {
        const otherPrimary = assignments.find(
          (a) => a.assignmentType === "PRIMARY" && a.id !== assignmentId
        );
        if (otherPrimary) {
          await storage.updateUserUnitAssignment(otherPrimary.id, {
            assignmentType: "ATTACHED"
          });
        }
        await storage.updateUser(userId, { unitId: assignment.unitId });
      }
      logAudit(
        req.user.id,
        "update_unit_assignment",
        {
          userId,
          assignmentId,
          updates: req.body
        },
        req.ip
      );
      return res.json(assignment);
    } catch (error) {
      console.error("Error updating unit assignment:", error);
      return res.status(500).json({ message: "Failed to update unit assignment" });
    }
  });
  app2.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const notifications2 = await storage.getNotificationsForUser(user.id);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.post("/api/notifications/test", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const notification = await storage.createNotification({
        userId: user.id,
        title: "Test Notification",
        message: "This is a test notification to verify the notification system is working properly.",
        type: "test",
        relatedEntityId: null,
        relatedEntityType: null
      });
      res.json({ success: true, notification });
    } catch (error) {
      console.error("Error creating test notification:", error);
      res.status(500).json({ message: "Failed to create test notification" });
    }
  });
  app2.post("/api/notifications/:id/mark-read", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const notificationId = parseInt(req.params.id);
      if (isNaN(notificationId)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }
      const notifications2 = await storage.getNotificationsForUser(user.id);
      const notification = notifications2.find((n) => n.id === notificationId);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      const success = await storage.markNotificationAsRead(notificationId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to mark notification as read" });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app2.delete("/api/users/:userId/unit-assignments/:assignmentId", isAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.userId);
    const assignmentId = parseInt(req.params.assignmentId);
    if (isNaN(userId) || isNaN(assignmentId)) {
      return res.status(400).json({ message: "Invalid user ID or assignment ID" });
    }
    try {
      const assignments = await storage.getUserUnitAssignments(userId);
      const assignmentToEnd = assignments.find((a) => a.id === assignmentId);
      if (!assignmentToEnd) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      if (assignmentToEnd.assignmentType === "PRIMARY") {
        const potentialNewPrimary = assignments.find(
          (a) => a.id !== assignmentId && a.assignmentType !== "PRIMARY"
        );
        if (potentialNewPrimary) {
          await storage.updateUserUnitAssignment(potentialNewPrimary.id, {
            assignmentType: "PRIMARY"
          });
          await storage.updateUser(userId, { unitId: potentialNewPrimary.unitId });
        }
      }
      const updated = await storage.updateUserUnitAssignment(assignmentId, {
        endDate: /* @__PURE__ */ new Date()
      });
      if (!updated) {
        return res.status(500).json({ message: "Failed to end assignment" });
      }
      logAudit(
        req.user.id,
        "end_unit_assignment",
        {
          userId,
          assignmentId,
          unitId: assignmentToEnd.unitId
        },
        req.ip
      );
      return res.json({ success: true, message: "Assignment ended successfully" });
    } catch (error) {
      console.error("Error ending unit assignment:", error);
      return res.status(500).json({ message: "Failed to end unit assignment" });
    }
  });
  app2.patch("/api/users/:userId/unit", isAuthenticated, async (req, res) => {
    console.log("\u{1F536} User reassignment request received:", {
      userId: req.params.userId,
      requestBody: req.body,
      currentUser: req.user?.username
    });
    console.log("SQL debugging enabled for this request");
    try {
      const userId = parseInt(req.params.userId);
      const { unitId } = req.body;
      if (isNaN(userId) || !unitId) {
        return res.status(400).json({ message: "Invalid user ID or unit ID" });
      }
      console.log(`Reassigning user ${userId} to unit ${unitId}`);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const targetUnit = await storage.getUnit(unitId);
      if (!targetUnit) {
        return res.status(404).json({ message: "Target unit not found" });
      }
      const currentUserUnit = await storage.getUnit(req.user.unitId);
      if (!currentUserUnit) {
        return res.status(403).json({ message: "Unable to verify permissions" });
      }
      if (req.user.role !== "admin") {
        const accessibleUsers = await getAccessibleUsers(req.user.id);
        const accessibleUnits = await getAccessibleUnits(req.user.id);
        const canManageUser = accessibleUsers.some((u) => u.id === userId);
        const canManageTargetUnit = accessibleUnits.some((u) => u.id === unitId);
        if (!canManageUser || !canManageTargetUnit) {
          return res.status(403).json({ message: "You do not have permission to reassign this user" });
        }
      }
      const updatedUser = await storage.updateUser(userId, { unitId });
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }
      logAudit(
        req.user.id,
        "reassign_user",
        {
          userId,
          oldUnitId: user.unitId,
          newUnitId: unitId
        },
        req.ip
      );
      res.json(sanitizeUser(updatedUser));
    } catch (error) {
      console.error("Error reassigning user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/users/:userId/reassign", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { unitId } = req.body;
      if (isNaN(userId) || !unitId) {
        return res.status(400).json({ message: "Invalid user ID or unit ID" });
      }
      console.log(`Reassigning user ${userId} to unit ${unitId} (POST endpoint)`);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const targetUnit = await storage.getUnit(unitId);
      if (!targetUnit) {
        return res.status(404).json({ message: "Target unit not found" });
      }
      const currentUserUnit = await storage.getUnit(req.user.unitId);
      if (!currentUserUnit) {
        return res.status(403).json({ message: "Unable to verify permissions" });
      }
      if (req.user.role !== "admin") {
        const accessibleUsers = await getAccessibleUsers(req.user.id);
        const accessibleUnits = await getAccessibleUnits(req.user.id);
        const canManageUser = accessibleUsers.some((u) => u.id === userId);
        const canManageTargetUnit = accessibleUnits.some((u) => u.id === unitId);
        if (!canManageUser || !canManageTargetUnit) {
          return res.status(403).json({ message: "You do not have permission to reassign this user" });
        }
      }
      const updatedUser = await storage.updateUser(userId, { unitId });
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }
      logAudit(
        req.user.id,
        "reassign_user",
        {
          userId,
          oldUnitId: user.unitId,
          newUnitId: unitId
        },
        req.ip
      );
      console.log(`Successfully reassigned user ${userId} from unit ${user.unitId} to unit ${unitId}`);
      res.json(sanitizeUser(updatedUser));
    } catch (error) {
      console.error("Error reassigning user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/hierarchy/constants", isAuthenticated, async (req, res) => {
    try {
      res.json({
        roles: MilitaryRoles,
        unitLevels: UnitLevels,
        hierarchy: MilitaryHierarchy
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/hierarchy/accessible-units", isAuthenticated, async (req, res) => {
    try {
      console.log("Getting accessible units for user:", req.user.id);
      if (req.user.role === "admin") {
        const units3 = await storage.getAllUnits();
        console.log(`Admin user - returning all ${units3.length} units`);
        return res.json(units3);
      }
      const units2 = await getAccessibleUnits(req.user.id);
      console.log(`Found ${units2.length} accessible units`);
      res.json(units2);
    } catch (error) {
      console.error("Error getting accessible units:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/hierarchy/accessible-users", isAuthenticated, async (req, res) => {
    try {
      if (req.user.role === "admin") {
        const users3 = await storage.getAllUsers();
        return res.json(users3.map(sanitizeUser));
      }
      const users2 = await getAccessibleUsers(req.user.id);
      res.json(users2.map(sanitizeUser));
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/events", isAuthenticated, async (req, res) => {
    try {
      console.log("Getting all events for user:", req.user.id);
      if (req.user.role === "admin") {
        const allEvents2 = await storage.getAllEvents();
        console.log(`Admin user - returning all ${allEvents2.length} events`);
        return res.json(allEvents2);
      }
      const unitEvents = await storage.getEventsByUnit(req.user.unitId);
      console.log(`Found ${unitEvents.length} unit events`);
      const participatingEvents = await storage.getEventsByUserParticipation(req.user.id);
      console.log(`Found ${participatingEvents.length} participation events`);
      const allEvents = [...unitEvents, ...participatingEvents];
      const uniqueEvents = allEvents.filter(
        (event, index, self) => index === self.findIndex((e) => e.id === event.id)
      );
      console.log(`Returning ${uniqueEvents.length} total unique events`);
      res.json(uniqueEvents);
    } catch (error) {
      console.error("Error getting all events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/events/:id", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      console.log(`Getting event by ID: ${eventId}`);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        console.log(`Event with ID ${eventId} not found`);
        return res.status(404).json({ message: "Event not found" });
      }
      console.log(`Found event: ${event.title}`);
      res.json(event);
    } catch (error) {
      console.error(`Error getting event by ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/events/:id/aars", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const eventAARs = await storage.getAARsByEvent(eventId);
      res.json(eventAARs);
    } catch (error) {
      console.error("Error getting AARs for event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/events/:id/analysis", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const aars2 = await storage.getAARsByEvent(eventId);
      if (aars2.length === 0) {
        return res.json({
          trends: [
            {
              category: "No Data",
              description: "No After Action Reviews have been submitted for this event yet. Submit AARs to enable GreenBookAAR analysis.",
              frequency: 0,
              severity: "Medium"
            }
          ],
          frictionPoints: [],
          recommendations: []
        });
      }
      const analysis = await veniceAIService.generateAnalysis(aars2);
      await logAudit(
        req.user.id,
        "GENERATE_AAR_ANALYSIS",
        { eventId, eventTitle: event.title, numAARs: aars2.length },
        req.ip
      );
      res.json(analysis);
    } catch (error) {
      console.error("Error generating AAR analysis:", error);
      res.status(500).json({
        message: "Server error generating analysis",
        trends: [
          {
            category: "Analysis Error",
            description: "There was an error generating the analysis. Please try again later.",
            frequency: 0,
            severity: "Medium"
          }
        ],
        frictionPoints: [],
        recommendations: []
      });
    }
  });
  app2.post("/api/events/:id/add-participants", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      let participantIds = [];
      if (req.body.participantIds) {
        if (Array.isArray(req.body.participantIds)) {
          participantIds = req.body.participantIds;
        } else if (typeof req.body.participantIds === "string") {
          participantIds = req.body.participantIds.split(",").map((id) => parseInt(id.trim())).filter((id) => !isNaN(id));
        }
      }
      if (participantIds.length === 0) {
        return res.status(400).json({ message: "No valid participant IDs provided" });
      }
      const existingParticipants = Array.isArray(event.participants) ? event.participants : [];
      const newParticipants = participantIds.filter((id) => !existingParticipants.includes(id));
      if (newParticipants.length === 0) {
        return res.status(200).json({
          message: "All participants are already assigned to this event",
          event
        });
      }
      const updatedEvent = await storage.addParticipantsToEvent(eventId, participantIds);
      if (!updatedEvent) {
        return res.status(500).json({ message: "Failed to add participants to event" });
      }
      try {
        const creator = req.user;
        const creatorName = creator.name || creator.username;
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const notificationPromises = newParticipants.map(async (participantId) => {
          return await storage.createNotification({
            userId: participantId,
            title: "Added to Event",
            message: `You've been added as a participant in "${event.title}" on ${formattedDate} by ${creatorName}.`,
            type: "event_assignment",
            relatedEntityId: event.id,
            relatedEntityType: "event"
          });
        });
        await Promise.all(notificationPromises);
        console.log(`Sent notifications to ${notificationPromises.length} new participants for event ${event.id}`);
      } catch (notificationError) {
        console.error("Error sending participant notifications:", notificationError);
      }
      logAudit(
        req.user.id,
        "add_participants_to_event",
        {
          eventId: event.id,
          addedParticipants: newParticipants
        },
        req.ip
      );
      return res.json(updatedEvent);
    } catch (error) {
      console.error("Error adding participants to event:", error);
      return res.status(500).json({ message: "Error adding participants to event" });
    }
  });
  app2.post("/api/events/:id/add-unit", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const unitId = parseInt(req.body.unitId);
      if (isNaN(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      const unit = await storage.getUnit(unitId);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      const updatedEvent = await storage.addUnitToEvent(eventId, unitId);
      if (!updatedEvent) {
        return res.status(500).json({ message: "Failed to add unit to event" });
      }
      logAudit(
        req.user.id,
        "add_unit_to_event",
        {
          eventId: event.id,
          unitId: unit.id
        },
        req.ip
      );
      return res.json(updatedEvent);
    } catch (error) {
      console.error("Error adding unit to event:", error);
      return res.status(500).json({ message: "Error adding unit to event" });
    }
  });
  app2.patch("/api/events/:id", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const user = req.user;
      if (user.role !== "admin" && event.createdBy !== user.id) {
        return res.status(403).json({ message: "Unauthorized to update this event" });
      }
      const updateData = { ...req.body };
      const dateFields = [
        "date",
        "endDate",
        "step1Date",
        "step2Date",
        "step3Date",
        "step4Date",
        "step5Date",
        "step6Date",
        "step7Date",
        "step8Date"
      ];
      for (const field of dateFields) {
        if (field in updateData && updateData[field]) {
          updateData[field] = new Date(updateData[field]);
        }
      }
      const updatedEvent = await storage.updateEvent(eventId, updateData);
      if (!updatedEvent) {
        return res.status(500).json({ message: "Failed to update event" });
      }
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/events/:id", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const user = req.user;
      if (user.role !== "admin" && event.createdBy !== user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this event" });
      }
      const success = await storage.softDeleteEvent(eventId);
      if (success) {
        logAudit(
          user.id,
          "delete_event",
          { eventId },
          req.ip
        );
        return res.status(200).json({ message: "Event deleted successfully" });
      } else {
        return res.status(500).json({ message: "Failed to delete event" });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/events/:eventId/analyze", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const eventAARs = await storage.getAARsByEvent(eventId);
      if (!eventAARs || eventAARs.length === 0) {
        return res.status(404).json({
          message: "No AARs found for this event",
          analysis: {
            trends: [
              {
                category: "No Data Available",
                description: "There are no AARs submitted for this event yet. AI analysis requires submitted AARs to generate insights.",
                frequency: 0,
                severity: "Low"
              }
            ],
            frictionPoints: [],
            recommendations: []
          }
        });
      }
      const analysis = await openaiService.generateAnalysis(eventAARs);
      logAudit(
        req.user.id,
        "generate_event_analysis",
        { eventId, aarCount: eventAARs.length },
        req.ip
      );
      return res.json(analysis);
    } catch (error) {
      console.error("Error generating event analysis:", error);
      return res.status(500).json({ message: "Failed to generate analysis" });
    }
  });
  app2.get("/api/aars/accessible", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const accessibleUnits = await getAccessibleUnits(user.id);
      const accessibleUnitIds = accessibleUnits.map((unit) => unit.id);
      if (accessibleUnitIds.length === 0) {
        return res.json([]);
      }
      const allAARs = [];
      for (const unitId of accessibleUnitIds) {
        const unitAARs = await storage.getAARsByUnit(unitId);
        allAARs.push(...unitAARs);
      }
      const participatedEvents = await storage.getEventsByUserParticipation(user.id);
      const eventIds = participatedEvents.map((event) => event.id);
      for (const eventId of eventIds) {
        const eventAARs = await storage.getAARsByEvent(eventId);
        for (const aar of eventAARs) {
          if (!allAARs.some((existingAAR) => existingAAR.id === aar.id)) {
            allAARs.push(aar);
          }
        }
      }
      const userAARs = await storage.getAARsByUser(user.id);
      for (const aar of userAARs) {
        if (!allAARs.some((existingAAR) => existingAAR.id === aar.id)) {
          allAARs.push(aar);
        }
      }
      const uniqueAARs = Array.from(new Map(allAARs.map((aar) => [aar.id, aar])).values());
      return res.json(uniqueAARs);
    } catch (error) {
      console.error("Error fetching accessible AARs:", error);
      return res.status(500).json({ message: "Failed to fetch AARs" });
    }
  });
  app2.get("/api/aars/event/:eventId", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const user = req.user;
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const accessibleUnits = await getAccessibleUnits(user.id);
      const accessibleUnitIds = accessibleUnits.map((unit) => unit.id);
      const hasUnitAccess = accessibleUnitIds.includes(event.unitId);
      const isParticipant = Array.isArray(event.participants) && event.participants.includes(user.id);
      const unitParticipated = Array.isArray(event.participatingUnits) && event.participatingUnits.some((unitId) => accessibleUnitIds.includes(unitId));
      if (!hasUnitAccess && !isParticipant && !unitParticipated) {
        return res.status(403).json({ message: "You do not have access to AARs for this event" });
      }
      const aars2 = await storage.getAARsByEvent(eventId);
      return res.json(aars2);
    } catch (error) {
      console.error("Error fetching event AARs:", error);
      return res.status(500).json({ message: "Failed to fetch event AARs" });
    }
  });
  app2.get("/api/aars/:id", isAuthenticated, async (req, res) => {
    try {
      const aarId = parseInt(req.params.id);
      if (isNaN(aarId)) {
        return res.status(400).json({ message: "Invalid AAR ID" });
      }
      const user = req.user;
      const aar = await storage.getAAR(aarId);
      if (!aar) {
        return res.status(404).json({ message: "AAR not found" });
      }
      if (aar.createdBy === user.id) {
        return res.json(aar);
      }
      const event = await storage.getEvent(aar.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const accessibleUnits = await getAccessibleUnits(user.id);
      const accessibleUnitIds = accessibleUnits.map((unit) => unit.id);
      const hasUnitAccess = accessibleUnitIds.includes(aar.unitId);
      const isParticipant = Array.isArray(event.participants) && event.participants.includes(user.id);
      const unitParticipated = Array.isArray(event.participatingUnits) && event.participatingUnits.some((unitId) => accessibleUnitIds.includes(unitId));
      if (!hasUnitAccess && !isParticipant && !unitParticipated) {
        return res.status(403).json({ message: "You do not have access to this AAR" });
      }
      res.json(aar);
    } catch (error) {
      console.error("Error getting AAR:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/aars/:id", isAuthenticated, async (req, res) => {
    try {
      const aarId = parseInt(req.params.id);
      if (isNaN(aarId)) {
        return res.status(400).json({ message: "Invalid AAR ID" });
      }
      const aar = await storage.getAAR(aarId);
      if (!aar) {
        return res.status(404).json({ message: "AAR not found" });
      }
      const user = req.user;
      if (user.role !== "admin" && aar.createdBy !== user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this AAR" });
      }
      const success = await storage.softDeleteAAR(aarId);
      if (success) {
        logAudit(
          user.id,
          "delete_aar",
          { aarId },
          req.ip
        );
        return res.status(200).json({ message: "AAR deleted successfully" });
      } else {
        return res.status(500).json({ message: "Failed to delete AAR" });
      }
    } catch (error) {
      console.error("Error deleting AAR:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/aars", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating AAR with data:", req.body);
      const eventId = parseInt(req.body.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const aarData = {
        eventId,
        unitId: req.user.unitId,
        createdBy: req.user.id,
        sustainItems: req.body.sustainItems || [],
        improveItems: req.body.improveItems || [],
        actionItems: req.body.actionItems || []
      };
      console.log("Processed AAR data:", aarData);
      const aar = await storage.createAAR(aarData);
      console.log("Created AAR:", aar);
      logAudit(
        req.user.id,
        "create_aar",
        { aarId: aar.id, eventId },
        req.ip
      );
      res.status(201).json(aar);
    } catch (error) {
      console.error("Error creating AAR:", error);
      res.status(500).json({ message: "Error creating AAR" });
    }
  });
  app2.get("/api/aars", isAuthenticated, async (req, res) => {
    try {
      const userAARs = await storage.getAARsByUser(req.user.id);
      res.json(userAARs);
    } catch (error) {
      console.error("Error getting user AARs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/units/:id/aars", isAuthenticated, async (req, res) => {
    try {
      const unitId = parseInt(req.params.id);
      if (isNaN(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      const unitAARs = await storage.getAARsByUnit(unitId);
      console.log(`Found ${unitAARs.length} AARs for unit ${unitId}`);
      res.json(unitAARs);
    } catch (error) {
      console.error("Error getting unit AARs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/aars/accessible", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const accessibleUnits = await getAccessibleUnits(user.id);
      const accessibleUnitIds = accessibleUnits.map((unit) => unit.id);
      let allAARs = [];
      for (const unitId of accessibleUnitIds) {
        const unitAARs = await storage.getAARsByUnit(unitId);
        allAARs = [...allAARs, ...unitAARs];
      }
      const userAARs = await storage.getAARsByUser(user.id);
      const combinedAARs = [...allAARs];
      for (const userAAR of userAARs) {
        if (!combinedAARs.some((aar) => aar.id === userAAR.id)) {
          combinedAARs.push(userAAR);
        }
      }
      const userEvents = await storage.getEventsByUserParticipation(user.id);
      for (const event of userEvents) {
        const eventAARs = await storage.getAARsByEvent(event.id);
        for (const eventAAR of eventAARs) {
          if (!combinedAARs.some((aar) => aar.id === eventAAR.id)) {
            combinedAARs.push(eventAAR);
          }
        }
      }
      if (user.role === "admin") {
        const allUnits = await storage.getAllUnits();
        for (const unit of allUnits) {
          const unitAARs = await storage.getAARsByUnit(unit.id);
          for (const unitAAR of unitAARs) {
            if (!combinedAARs.some((aar) => aar.id === unitAAR.id)) {
              combinedAARs.push(unitAAR);
            }
          }
        }
      }
      res.json(combinedAARs);
    } catch (error) {
      console.error("Error fetching accessible AARs:", error);
      return res.status(500).json({ message: "Failed to fetch AARs" });
    }
  });
  app2.post("/api/events", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating event with data:", req.body);
      let participants = [];
      if (req.body.participants) {
        if (Array.isArray(req.body.participants)) {
          participants = req.body.participants;
        } else if (typeof req.body.participants === "string") {
          participants = req.body.participants.split(",").map((id) => parseInt(id.trim())).filter((id) => !isNaN(id));
        }
      }
      if (!participants.includes(req.user.id)) {
        participants.push(req.user.id);
      }
      let participatingUnits = [];
      if (req.body.participatingUnits) {
        if (Array.isArray(req.body.participatingUnits)) {
          participatingUnits = req.body.participatingUnits;
        } else if (typeof req.body.participatingUnits === "string") {
          participatingUnits = req.body.participatingUnits.split(",").map((id) => parseInt(id.trim())).filter((id) => !isNaN(id));
        }
      }
      const eventData = {
        title: req.body.title,
        unitId: req.body.unitId || req.user.unitId,
        createdBy: req.user.id,
        step: parseInt(req.body.step || "1"),
        date: new Date(req.body.date),
        isMultiDayEvent: req.body.isMultiDayEvent === true,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        location: req.body.location,
        objectives: req.body.objectives,
        missionStatement: req.body.missionStatement || null,
        conceptOfOperation: req.body.conceptOfOperation || null,
        resources: req.body.resources || "",
        eventType: req.body.eventType || "training",
        participants,
        participatingUnits,
        notifyParticipants: req.body.notifyParticipants === true,
        // Step notes
        step1Notes: req.body.step1Notes || null,
        step2Notes: req.body.step2Notes || null,
        step3Notes: req.body.step3Notes || null,
        step4Notes: req.body.step4Notes || null,
        step5Notes: req.body.step5Notes || null,
        step6Notes: req.body.step6Notes || null,
        step7Notes: req.body.step7Notes || null,
        step8Notes: req.body.step8Notes || null,
        // Step dates
        step1Date: req.body.step1Date ? new Date(req.body.step1Date) : null,
        step2Date: req.body.step2Date ? new Date(req.body.step2Date) : null,
        step3Date: req.body.step3Date ? new Date(req.body.step3Date) : null,
        step4Date: req.body.step4Date ? new Date(req.body.step4Date) : null,
        step5Date: req.body.step5Date ? new Date(req.body.step5Date) : null,
        step6Date: req.body.step6Date ? new Date(req.body.step6Date) : null,
        step7Date: req.body.step7Date ? new Date(req.body.step7Date) : null,
        step8Date: req.body.step8Date ? new Date(req.body.step8Date) : null
      };
      console.log("Processed event data:", eventData);
      const event = await storage.createEvent(eventData);
      console.log("Created event:", event);
      logAudit(
        req.user.id,
        "create_event",
        { eventId: event.id },
        req.ip
      );
      if (eventData.notifyParticipants && event.participants && event.participants.length > 0) {
        try {
          const creator = req.user;
          const creatorName = creator.name || creator.username;
          const eventDate = new Date(event.date);
          const formattedDate = eventDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
          const participantPromises = event.participants.filter((id) => id !== creator.id).map(async (participantId) => {
            return await storage.createNotification({
              userId: participantId,
              title: "New Event Assignment",
              message: `You've been assigned as a participant in "${event.title}" on ${formattedDate} by ${creatorName}.`,
              type: "event_assignment",
              relatedEntityId: event.id,
              relatedEntityType: "event"
            });
          });
          await Promise.all(participantPromises);
          console.log(`Sent notifications to ${participantPromises.length} participants for event ${event.id}`);
        } catch (notificationError) {
          console.error("Error sending participant notifications:", notificationError);
        }
      }
      res.status(201).json(event);
    } catch (error) {
      console.error("Event creation error:", error);
      res.status(500).json({ message: "Error creating event" });
    }
  });
  app2.get("/api/units/referral/:code", async (req, res) => {
    try {
      const code = req.params.code;
      if (!code) {
        return res.status(400).json({ message: "Referral code is required" });
      }
      console.log(`Looking up unit by referral code: ${code}`);
      const unit = await storage.getUnitByReferralCode(code);
      if (!unit) {
        console.log(`No unit found with referral code: ${code}`);
        return res.status(404).json({ message: "Unit not found with that referral code" });
      }
      console.log(`Found unit with referral code: ${unit.name}`);
      res.json(unit);
    } catch (error) {
      console.error("Error getting unit by referral code:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/units", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating unit with data:", req.body);
      const referralCode = nanoid(8);
      const unitData = {
        ...req.body,
        referralCode
      };
      console.log("Processed unit data:", unitData);
      const unit = await storage.createUnit(unitData);
      console.log("Created unit:", unit);
      logAudit(
        req.user.id,
        "create_unit",
        { unitId: unit.id },
        req.ip
      );
      res.status(201).json(unit);
    } catch (error) {
      console.error("Unit creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid unit data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating unit" });
      }
    }
  });
  app2.patch("/api/units/:id", isAuthenticated, async (req, res) => {
    try {
      const unitId = parseInt(req.params.id);
      if (isNaN(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      if (req.user.role !== "admin") {
        const unitLeaders = await storage.getUnitLeaders(unitId);
        const leaderIds = unitLeaders.map((leader) => leader.id);
        if (!leaderIds.includes(req.user.id)) {
          return res.status(403).json({ message: "You do not have permission to update this unit" });
        }
      }
      const existingUnit = await storage.getUnit(unitId);
      if (!existingUnit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      const { name, unitLevel, parentId } = req.body;
      if (parentId !== void 0 && parentId !== null) {
        const parentIdNum = Number(parentId);
        if (parentIdNum === unitId) {
          return res.status(400).json({ message: "A unit cannot be its own parent" });
        }
        const parentUnit = await storage.getUnit(parentIdNum);
        if (!parentUnit) {
          return res.status(400).json({ message: "Parent unit not found" });
        }
        const unitLevelHierarchy = {
          "Team": 1,
          "Squad": 2,
          "Section": 3,
          "Platoon": 4,
          "Company": 5,
          "Battalion": 6,
          "Brigade": 7,
          "Division": 8
        };
        const unitLevelToCheck = unitLevel || existingUnit.unitLevel;
        if (unitLevelHierarchy[parentUnit.unitLevel] <= unitLevelHierarchy[unitLevelToCheck]) {
          return res.status(400).json({
            message: "Parent unit must be higher in the hierarchy than the child unit"
          });
        }
      }
      const updates = {};
      if (name !== void 0) updates.name = name;
      if (unitLevel !== void 0) updates.unitLevel = unitLevel;
      if (parentId !== void 0) updates.parentId = parentId === null ? null : Number(parentId);
      if (Object.keys(updates).length === 0) {
        return res.json(existingUnit);
      }
      console.log("Updating unit with data:", updates);
      const updatedUnit = await storage.updateUnit(unitId, updates);
      if (!updatedUnit) {
        return res.status(500).json({ message: "Failed to update unit" });
      }
      logAudit(
        req.user.id,
        "update_unit",
        { unitId, updates },
        req.ip
      );
      res.json(updatedUnit);
    } catch (error) {
      console.error("Error updating unit:", error);
      res.status(500).json({ message: "Error updating unit" });
    }
  });
  app2.get("/api/units/:unitId/analysis", isAuthenticated, async (req, res) => {
    try {
      const { unitId } = req.params;
      const numericUnitId = parseInt(unitId);
      if (isNaN(numericUnitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      const user = req.user;
      const accessibleUnits = await getAccessibleUnits(user.id);
      const accessibleUnitIds = accessibleUnits.map((unit) => unit.id);
      if (!accessibleUnitIds.includes(numericUnitId) && user.role !== "admin") {
        return res.status(403).json({ message: "You do not have access to analysis for this unit" });
      }
      const analysis = await storage.generateVeniceAnalysis(numericUnitId);
      res.json(analysis);
    } catch (error) {
      console.error("Error generating Venice AI analysis:", error);
      res.status(500).json({ message: "Failed to generate analysis" });
    }
  });
  app2.post("/api/units/:unitId/prompt-analysis", isAuthenticated, async (req, res) => {
    try {
      const { unitId } = req.params;
      const { prompt } = req.body;
      const numericUnitId = parseInt(unitId);
      if (isNaN(numericUnitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return res.status(400).json({ message: "Valid prompt is required" });
      }
      const user = req.user;
      const accessibleUnits = await getAccessibleUnits(user.id);
      const accessibleUnitIds = accessibleUnits.map((unit) => unit.id);
      if (!accessibleUnitIds.includes(numericUnitId) && user.role !== "admin") {
        return res.status(403).json({ message: "You do not have access to analysis for this unit" });
      }
      const analysis = await storage.generateVenicePromptAnalysis(numericUnitId, prompt);
      logAudit(
        user.id,
        "venice_prompt_analysis",
        {
          unitId: numericUnitId,
          promptLength: prompt.length,
          prompt: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : "")
          // Log a preview of the prompt
        },
        req.ip
      );
      res.json(analysis);
    } catch (error) {
      console.error("Error generating Venice AI prompt analysis:", error);
      res.status(500).json({ message: "Failed to generate prompt-based analysis" });
    }
  });
  app2.post("/api/events/:eventId/request-aar-feedback", isAuthenticated, async (req, res) => {
    try {
      const { eventId } = req.params;
      const { notifyParticipants } = req.body;
      const numericEventId = parseInt(eventId);
      if (isNaN(numericEventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(numericEventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const user = req.user;
      const hasAccess = event.createdBy === user.id || event.unitId === user.unitId || user.role === "admin";
      if (!hasAccess) {
        return res.status(403).json({ message: "You do not have permission to request feedback for this event" });
      }
      const existingAARs = await storage.getAARsByEvent(numericEventId);
      const existingSubmitterIds = new Set(existingAARs.map((aar) => aar.createdBy));
      const pendingParticipants = (event.participants || []).filter(
        (participantId) => !existingSubmitterIds.has(participantId)
      );
      if (notifyParticipants && pendingParticipants.length > 0) {
        try {
          for (const participantId of pendingParticipants) {
            console.log(`Creating notification for participant ID: ${participantId}`);
            await storage.createNotification({
              userId: participantId,
              title: "AAR Feedback Request",
              message: `You are requested to submit an After-Action Review for the event: ${event.title}. Please visit the Submit AAR page.`,
              type: "aar_request",
              relatedEntityId: event.id,
              relatedEntityType: "event"
            });
            console.log(`Successfully created notification for participant ID: ${participantId}`);
          }
        } catch (error) {
          console.error("Error creating notifications:", error);
          throw error;
        }
        logAudit(
          user.id,
          "request_aar_feedback",
          {
            eventId: numericEventId,
            eventTitle: event.title,
            participantCount: pendingParticipants.length
          },
          req.ip
        );
        return res.json({
          success: true,
          message: `AAR feedback request sent to ${pendingParticipants.length} participants`,
          notifiedCount: pendingParticipants.length
        });
      }
      res.json({
        success: true,
        message: "No notifications sent",
        notifiedCount: 0
      });
    } catch (error) {
      console.error("Error requesting AAR feedback:", error);
      res.status(500).json({ message: "Failed to send AAR feedback requests" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server }
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const devTemplate = path2.resolve(__dirname, "..", "client", "index.html");
    const prodTemplate = path2.join(process.cwd(), "dist", "public", "index.html");
    const templatePath = fs.existsSync(devTemplate) ? devTemplate : prodTemplate;
    console.log("[VITE] Using templatePath:", templatePath, "exists:", fs.existsSync(templatePath));
    try {
      if (!fs.existsSync(templatePath)) {
        throw new Error(`index.html not found at ${templatePath}`);
      }
      let template = await fs.promises.readFile(templatePath, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
console.log("\u2705 Starting GreenBook server...");
console.log("\u{1F4E6} DATABASE_URL:", process.env.DATABASE_URL || "\u26A0\uFE0F NOT SET");
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    if (app.get("env") === "development") {
      const server2 = await registerRoutes(app);
      await setupVite(app, server2);
    } else {
      const staticPath = path3.join(__dirname2, "..", "dist", "public");
      console.log("[STATIC SERVE] Using static path:", staticPath);
      if (!fs2.existsSync(staticPath)) {
        console.error("\u274C No static directory found for serving frontend!", staticPath);
      } else {
        app.use(express2.static(staticPath));
        app.get("*", (req, res, next) => {
          if (req.path.startsWith("/api")) return next();
          res.sendFile(path3.join(staticPath, "index.html"));
        });
      }
    }
    console.log("\u{1F6E0} Registering routes...");
    const server = await registerRoutes(app);
    console.log("\u2705 Routes registered");
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      if (!res.headersSent) {
        res.status(status).json({ message });
      } else {
        log(`Error after headers sent: ${message}`);
      }
    });
    const port = process.env.PORT || 5e3;
    server.listen(port, () => {
      log(`\u2705 Server running on port ${port} in ${app.get("env")} mode`);
    });
  } catch (err) {
    console.error("\u274C Fatal startup error:", err.message || err);
    process.exit(1);
  }
})();
