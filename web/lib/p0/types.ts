export type PreferenceKey = "energy" | "interaction" | "format" | "novelty";

export type Confidence = "low" | "medium" | "high";

export type PreferenceSignal = {
  key: PreferenceKey;
  value: string;
  confidence: Confidence;
  source: "choice" | "correction" | "prediction";
};

export type PreferenceProfile = Partial<Record<PreferenceKey, PreferenceSignal>>;

export type LifeState = {
  mood: "tired_but_playful" | "calm" | "playful";
  workState: "late_day" | "done" | "normal";
  fitnessState: "might_skip_gym" | "going_to_gym" | "skipped_gym";
  openLoop: "deciding_whether_to_train" | "gym_resolved";
};

export type RecommendationMode = "known_fit" | "explore" | "surprise_me";

export type ExperienceVector = {
  energy: "warm" | "confident" | "selective" | "playful";
  interaction: "teasing" | "direct" | "mysterious" | "conversational";
  context: "gym" | "work" | "night" | "home" | "discovery";
  format: "text" | "voice" | "mixed";
  dynamic: "mara_leads" | "user_leads" | "collaborative";
  narrative: "standalone" | "continuation" | "callback" | "branching";
  novelty: "known_fit" | "adjacent";
  personalizationDepth: "P0" | "P1";
};

export type ExperienceDefinition = {
  id: string;
  family: "relationship" | "confident" | "situational" | "discovery" | "voice" | "surprise";
  title: string;
  maraIntro: string;
  body: string;
  voiceText?: string;
  premiumLabel?: string;
  vector: ExperienceVector;
};

export type Recommendation = {
  selected: ExperienceDefinition;
  alternative?: ExperienceDefinition;
  mode: RecommendationMode;
  debugScore?: number;
};

export type OpenLoop = {
  id: string;
  text: string;
  createdAt: string;
};

export type P0PersistedState = {
  completed: boolean;
  profile: PreferenceProfile;
  selectedExperienceId?: string;
  userContext?: {
    plansToTrain?: boolean;
  };
  openLoop?: OpenLoop;
  lastSeenAt: string;
};
