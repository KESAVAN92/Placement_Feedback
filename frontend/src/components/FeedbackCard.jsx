import React from "react";
import { getFeedbackRounds } from "../utils/rounds";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

const FeedbackCard = ({ feedback }) => {
  const rounds = getFeedbackRounds(feedback);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{feedback.companyName}</h3>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {rounds.length || feedback.rounds} Rounds
        </span>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <p>Submitted Date: {formatDate(feedback.submittedDate)}</p>
        <p>Company Location: {feedback.location}</p>
        <p>College Campus: {feedback.attendedCollegeCampus || "Not provided"}</p>
        <p>Attended Date: {formatDate(feedback.attendedDate)}</p>
        <p>Student: {feedback.studentId?.name || "Unknown"}</p>
      </div>
      <div className="mt-6 space-y-4">
        {rounds.map((round, roundIndex) => (
          <div key={`${feedback._id}-${round.title}-${roundIndex}`}>
            <p className="text-sm font-semibold text-slate-800">{round.title}</p>
            <div className="mt-2 space-y-2 text-sm text-slate-600">
              {round.questions.map((question, questionIndex) => (
                <p key={`${feedback._id}-${round.title}-${questionIndex}`}>{questionIndex + 1}. {question}</p>
              ))}
            </div>
          </div>
        ))}
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
    </article>
  );
};

export default FeedbackCard;
