export const roundTypeSuggestions = [
  "Aptitude",
  "Technical MCQ",
  "Coding",
  "Technical Interview",
  "HR Interview",
  "Group Discussion",
  "System Design",
  "Managerial Interview"
];

export const normalizeRoundType = (value) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const formatRoundTypeLabel = (value) =>
  (value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");

export const buildRoundTitle = (round, index) => {
  const normalizedType = normalizeRoundType(round?.type);

  if (normalizedType) {
    return `Round ${index + 1}: ${formatRoundTypeLabel(normalizedType)}`;
  }

  return `Round ${index + 1}`;
};

export const getFeedbackRounds = (feedback) => {
  if (Array.isArray(feedback.roundDetails) && feedback.roundDetails.length > 0) {
    return feedback.roundDetails.map((round, index) => ({
      ...round,
      type: normalizeRoundType(round.type),
      title: round.title || buildRoundTitle(round, index),
      questions: Array.isArray(round.questions) ? round.questions.filter(Boolean) : []
    }));
  }

  const legacyRounds = [
    { type: "aptitude", questions: feedback.aptitudeQuestions || [] },
    { type: "coding", questions: feedback.codingQuestions || [] },
    { type: "interview", questions: feedback.interviewQuestions || [] }
  ];

  (feedback.extraRoundQuestions || []).forEach((questions, index) => {
    legacyRounds.push({
      type: `round-${index + 4}`,
      questions: Array.isArray(questions) ? questions : [questions]
    });
  });

  return legacyRounds
    .filter((round) => round.questions.length > 0)
    .map((round, index) => ({
      ...round,
      title: buildRoundTitle(round, index)
    }));
};
