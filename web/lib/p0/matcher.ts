import type {
  ExperienceDefinition,
  LifeState,
  PreferenceProfile,
  Recommendation,
  RecommendationMode,
} from "@/lib/p0/types";

function scorePreference(profile: PreferenceProfile, experience: ExperienceDefinition) {
  let score = 0;

  const energy = profile.energy?.value;
  const interaction = profile.interaction?.value;
  const format = profile.format?.value;
  const novelty = profile.novelty?.value;

  if (energy && experience.vector.energy === energy) score += 4;
  if (interaction && experience.vector.interaction === interaction) score += 4;
  if (format && experience.vector.format === format) score += 4;
  if (format === "voice" && experience.vector.format === "mixed") score += 2;
  if (novelty === "high" && experience.vector.novelty === "adjacent") score += 3;
  if (novelty === "low" && experience.vector.novelty === "known_fit") score += 3;

  return score;
}

function scoreLifeState(lifeState: LifeState, experience: ExperienceDefinition) {
  let score = 0;

  if (lifeState.workState === "late_day" && experience.vector.context === "work") score += 2;
  if (
    (lifeState.fitnessState === "might_skip_gym" || lifeState.fitnessState === "going_to_gym") &&
    experience.vector.context === "gym"
  ) {
    score += 3;
  }

  if (lifeState.mood === "tired_but_playful" && ["warm", "playful", "selective"].includes(experience.vector.energy)) {
    score += 1;
  }

  return score;
}

function deterministicTieBreak(id: string) {
  return id.split("").reduce((total, char) => total + char.charCodeAt(0), 0) / 100000;
}

export function recommendExperience(
  profile: PreferenceProfile,
  lifeState: LifeState,
  availableExperiences: ExperienceDefinition[],
  mode: RecommendationMode = "known_fit",
): Recommendation {
  const eligible = availableExperiences.filter((experience) => {
    if (mode === "surprise_me") return experience.vector.novelty === "adjacent";
    if (mode === "explore") return experience.vector.novelty === "adjacent" || experience.family === "discovery";
    return true;
  });

  const scored = eligible
    .map((experience) => {
      let score = scorePreference(profile, experience) + scoreLifeState(lifeState, experience);

      if (mode === "known_fit" && experience.vector.novelty === "known_fit") score += 2;
      if (mode !== "known_fit" && experience.vector.novelty === "adjacent") score += 3;

      return { experience, score: score + deterministicTieBreak(experience.id) };
    })
    .sort((a, b) => b.score - a.score);

  const selected = scored[0]?.experience ?? availableExperiences[0];
  const alternative = scored.find(({ experience }) => experience.id !== selected.id)?.experience;

  return {
    selected,
    alternative,
    mode,
    debugScore: process.env.NODE_ENV === "development" ? scored[0]?.score : undefined,
  };
}
