import React from "react";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

const questionSections = [
  { title: "Round 1: Aptitude", key: "aptitudeQuestions" },
  { title: "Round 2: Coding", key: "codingQuestions" },
  { title: "Round 3: Interview", key: "interviewQuestions" }
];

const FeedbackCard = ({ feedback }) => (
  <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-lg font-semibold text-slate-900">{feedback.companyName}</h3>
      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
        {feedback.rounds} Rounds
      </span>
    </div>
    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
      <p>Submitted Date: {formatDate(feedback.submittedDate)}</p>
      <p>Company Location: {feedback.location}</p>
      <p>Attended Date: {formatDate(feedback.attendedDate)}</p>
      <p>Student: {feedback.studentId?.name || "Unknown"}</p>
    </div>
    <div className="mt-6 space-y-4">
      {questionSections.map(
        (section) =>
          feedback[section.key]?.length > 0 && (
            <div key={section.key}>
              <p className="text-sm font-semibold text-slate-800">{section.title}</p>
              <div className="mt-2 space-y-2 text-sm text-slate-600">
                {feedback[section.key].map((question, index) => (
                  <p key={`${feedback._id}-${section.key}-${index}`}>{index + 1}. {question}</p>
                ))}
              </div>
            </div>
          )
      )}
    </div>
    {feedback.tips && (
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-800">Tips for juniors</p>
        <p className="mt-1 text-sm text-slate-600">{feedback.tips}</p>
      </div>
    )}
    {feedback.struggles && (
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-800">Struggles faced</p>
        <p className="mt-1 text-sm text-slate-600">{feedback.struggles}</p>
      </div>
    )}
    {feedback.extraRoundQuestions?.length > 0 && (
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-800">Additional rounds</p>
        <div className="mt-1 space-y-2 text-sm text-slate-600">
          {feedback.extraRoundQuestions.map((round, index) => (
            <p key={`${feedback._id}-extra-round-${index}`}>Round {index + 4}: {round}</p>
          ))}
        </div>
      </div>
    )}
  </article>
);

export default FeedbackCard;
