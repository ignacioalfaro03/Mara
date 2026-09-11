const HARD_BLOCK_PATTERNS: RegExp[] = [
  /\b(minor|menor(?:es)?|niñ[oa]s?|adolescente(?:s)?|underage)\b/i,
  /\b(trata|traffick(?:ing)?|secuestr|kidnap)\b/i,
  /\b(sin consentimiento|no consent|forzar|forced|coerc)\b/i,
  /\b(servicio sexual|sexo por dinero|prostituci[oó]n|escort sexual)\b/i,
];

export function creatorRequestPolicy(text: string) {
  const normalized = text.trim();
  if (!normalized) return { allowed: false as const, reason: "empty" };
  if (HARD_BLOCK_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return { allowed: false as const, reason: "unsupported_or_unsafe_request" };
  }
  return { allowed: true as const };
}
