import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";

const questionTabs = [
  { value: "aptitude", label: "Aptitude" },
  { value: "coding", label: "Coding" },
  { value: "interview", label: "Interview" }
];

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

const loadLogoAsset = async () => {
  try {
    const response = await fetch("/image.png");
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    return await new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext("2d").drawImage(image, 0, 0);
        URL.revokeObjectURL(imageUrl);

        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          format: "PNG"
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        resolve(null);
      };

      image.src = imageUrl;
    });
  } catch (error) {
    return null;
  }
};

const addPdfPageFrame = (doc, title, logoAsset) => {
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.7);
  doc.line(14, 10, 196, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Placement Pulse By K7 Services", 14, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(title, 14, 27);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, 32, 196, 32);
  doc.setFontSize(10);
  doc.text("K7 Education", 14, 288);
  if (logoAsset) {
    try {
      doc.addImage(logoAsset.dataUrl, logoAsset.format, 168, 282, 20, 10);
    } catch (error) {
      // Ignore invalid logo files so PDF download still succeeds.
    }
  }
  doc.line(14, 282, 196, 282);
  doc.setFontSize(11);
};

const QuestionsPage = () => {
  const { name } = useParams();
  const companyName = decodeURIComponent(name);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = questionTabs.some((tab) => tab.value === requestedTab) ? requestedTab : questionTabs[0].value;
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (requestedTab !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
      return;
    }

    const loadQuestions = async () => {
      try {
        const { data } = await api.get(`/feedback/questions/${encodeURIComponent(companyName)}/${activeTab}`);
        setQuestions(data);
        setError("");
      } catch (err) {
        setQuestions([]);
        setError(err.response?.data?.message || "Unable to load question bank.");
      }
    };

    loadQuestions();
  }, [activeTab, companyName, requestedTab, setSearchParams]);

  const downloadPdf = async () => {
    const doc = new jsPDF();
    const activeLabel = questionTabs.find((tab) => tab.value === activeTab)?.label || activeTab;
    const title = `${activeLabel} Questions - ${companyName}`;
    const logoAsset = await loadLogoAsset();
    addPdfPageFrame(doc, title, logoAsset);

    let y = 42;
    questions.forEach((item, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${item.question}`, 180);
      doc.text(lines, 14, y);
      y += lines.length * 6;

      doc.text(`(${item.location}, ${formatDate(item.attendedDate)})`, 14, y);

      y += 10;
      if (y > 270) {
        doc.addPage();
        addPdfPageFrame(doc, title, logoAsset);
        y = 42;
      }
    });

    doc.save(`${companyName}-${activeTab}-questions.pdf`);
  };

  return (
    <Layout>
      <section className="rounded-[2rem] bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Question Bank</p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">{companyName}</h1>
          </div>
          <button type="button" onClick={downloadPdf} className="rounded-2xl bg-brand-700 px-5 py-3 font-semibold text-white">
            Download PDF
          </button>
        </div>

        <div className="mt-8 flex gap-3 overflow-x-auto">
          {questionTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSearchParams({ tab: tab.value })}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeTab === tab.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {questions.map((item, index) => (
            <div key={`${item.question}-${index}`} className="rounded-2xl border border-slate-200 p-5">
              <p className="font-medium text-slate-900">{item.question}</p>
              <p className="mt-2 text-sm text-slate-500">
                ({item.attendedCollegeCampus || "Campus not provided"}, {item.location}, {formatDate(item.attendedDate)})
              </p>
            </div>
          ))}
          {questions.length === 0 && <p className="text-sm text-slate-500">No questions have been submitted in this section yet.</p>}
        </div>
      </section>
    </Layout>
  );
};

export default QuestionsPage;
