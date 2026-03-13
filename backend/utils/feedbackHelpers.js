const normalizeLines = (value) =>
  (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const normalizeRoundType = (value) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatRoundTypeLabel = (value) =>
  (value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");

const buildRoundTitle = (type, index) => {
  const label = formatRoundTypeLabel(type);
  return label ? `Round ${index + 1}: ${label}` : `Round ${index + 1}`;
};

const getLegacyRoundDetails = (feedback) => {
  const rounds = [
    { type: "aptitude", questions: feedback.aptitudeQuestions || [] },
    { type: "coding", questions: feedback.codingQuestions || [] },
    { type: "interview", questions: feedback.interviewQuestions || [] }
  ];

  (feedback.extraRoundQuestions || []).forEach((entry, index) => {
    const questions = Array.isArray(entry) ? entry.filter(Boolean) : normalizeLines(entry);
    if (questions.length > 0) {
      rounds.push({ type: `round-${index + 4}`, questions });
    }
  });

  return rounds
    .filter((round) => round.questions.length > 0)
    .map((round, index) => ({
      type: normalizeRoundType(round.type),
      title: buildRoundTitle(normalizeRoundType(round.type), index),
      questions: round.questions
    }));
};

const getRoundDetails = (feedback) => {
  if (Array.isArray(feedback.roundDetails) && feedback.roundDetails.length > 0) {
    return feedback.roundDetails
      .map((round, index) => {
        const type = normalizeRoundType(round.type);
        const questions = Array.isArray(round.questions) ? round.questions.filter(Boolean) : normalizeLines(round.questions);

        return {
          type,
          title: round.title?.trim() || buildRoundTitle(type, index),
          questions
        };
      })
      .filter((round) => round.questions.length > 0);
  }

  return getLegacyRoundDetails(feedback);
};

const hasRoundKeyword = (type, keywords) => keywords.some((keyword) => type.includes(keyword));

const getQuestionBucket = (type) => {
  const normalizedType = normalizeRoundType(type);

  if (
    hasRoundKeyword(normalizedType, [
      "aptitude",
      "mcq",
      "assessment",
      "online-test",
      "online-assessment",
      "oa",
      "quiz",
      "reasoning"
    ])
  ) {
    return "aptitude";
  }

  if (hasRoundKeyword(normalizedType, ["coding", "code", "programming", "dsa", "leetcode", "hackerrank"])) {
    return "coding";
  }

  if (
    hasRoundKeyword(normalizedType, [
      "interview",
      "hr",
      "managerial",
      "manager",
      "behavioral",
      "behavioural",
      "system-design",
      "technical"
    ])
  ) {
    return "interview";
  }

  return "aptitude";
};

const groupLegacyFieldsFromRounds = (roundDetails) => {
  const grouped = {
    aptitudeQuestions: [],
    codingQuestions: [],
    interviewQuestions: []
  };

  roundDetails.forEach((round) => {
    const questionBucket = getQuestionBucket(round.type);

    if (questionBucket === "aptitude") {
      grouped.aptitudeQuestions.push(...round.questions);
      return;
    }

    if (questionBucket === "coding") {
      grouped.codingQuestions.push(...round.questions);
      return;
    }

    grouped.interviewQuestions.push(...round.questions);
  });

  return grouped;
};

const normalizeFeedbackRecord = (feedback) => {
  const objectFeedback = typeof feedback.toObject === "function" ? feedback.toObject() : { ...feedback };
  objectFeedback.roundDetails = getRoundDetails(objectFeedback);
  objectFeedback.rounds = objectFeedback.roundDetails.length || objectFeedback.rounds;
  return objectFeedback;
};

const questionTabs = [
  { value: "aptitude", label: "Aptitude" },
  { value: "coding", label: "Coding" },
  { value: "interview", label: "Interview" }
];

module.exports = {
  normalizeLines,
  normalizeRoundType,
  buildRoundTitle,
  getRoundDetails,
  getQuestionBucket,
  groupLegacyFieldsFromRounds,
  normalizeFeedbackRecord,
  questionTabs
};
