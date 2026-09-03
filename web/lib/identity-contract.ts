export const IDENTITY_MEMORY_VERSION = "v1" as const;
export const VISUAL_CHOICE_GROUP = "pose_pair_launch_v1" as const;
export const VISUAL_CHOICE_OPTIONS = ["pose_a", "pose_b"] as const;

export type VisualChoiceOption = (typeof VISUAL_CHOICE_OPTIONS)[number];
