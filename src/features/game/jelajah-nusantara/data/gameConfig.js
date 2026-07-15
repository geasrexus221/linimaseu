export const GAME_CONFIG = {
  // Movement
  STEP_DELAY: 600, // ms per tile
  
  // Base (Markas)
  BASE_HEAL_AMOUNT: 50,
  
  // Chest Cost
  CHEST_COST_1: 200,
  CHEST_COST_2: 400,
  CHEST_COST_3: 600,
  
  // Quiz
  QUIZ_KOIN_REWARD: 50,
  QUIZ_TEKAD_PENALTY: 20,
  
  // Battle / Duel
  DUEL_KOIN_STEAL: 50,
  
  // Trap
  TRAP_MAX_TEKAD_PENALTY: 50,
  TRAP_MAX_BACK_STEPS: 5,
  TRAP_KOIN_PENALTY: 30,
  
  // AI
  AI_THINK_DELAY: 1500,
  AI_STOP_AT_BASE_THRESHOLD: 70, // Stop if tekad < 70

  // Win Condition
  WIN_ARTIFACTS_GOAL: 3,
};
