import { useEffect, useState, type ChangeEvent } from "react";
import { extractPdfText } from "../lib/extractPdfText";
import { getResume, saveResume } from "../lib/resumeStorage";
import type { ResumeUploadState } from "../types";

function isPdfFile(file: File): boolean {
  if (file.type === "application/pdf") {
    return true;
  }

  return file.name.toLowerCase().endsWith(".pdf");
}

export default function ResumeUpload() {
  const [state, setState] = useState<ResumeUploadState>({
    isLoading: false,
    error: null,
    characterCount: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadStoredResume() {
      try {
        const record = await getResume();
        if (cancelled || !record) {
          return;
        }

        setState({
          isLoading: false,
          error: null,
          characterCount: record.text.length,
        });
      } catch {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            error: "Could not load saved resume.",
          }));
        }
      }
    }

    void loadStoredResume();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isPdfFile(file)) {
      setState((current) => ({
        ...current,
        error: "Please select a PDF file.",
      }));
      return;
    }

    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    try {
      const text = await extractPdfText(file);

      if (!text) {
        setState((current) => ({
          ...current,
          isLoading: false,
          error: "Could not extract text from this PDF.",
        }));
        return;
      }

      try {
        await saveResume({ text });
        setState({
          isLoading: false,
          error: null,
          characterCount: text.length,
        });
      } catch {
        setState((current) => ({
          ...current,
          isLoading: false,
          error: "Failed to save resume.",
        }));
      }
    } catch {
      setState((current) => ({
        ...current,
        isLoading: false,
        error: "Could not extract text from this PDF.",
      }));
    }
  }

  const { isLoading, error, characterCount } = state;

  return (
    <section className="mt-6 w-full border-t border-slate-200 pt-4 text-left">
      <h2 className="text-sm font-semibold text-slate-900">Resume Upload</h2>
      <input
        type="file"
        accept="application/pdf,.pdf"
        disabled={isLoading}
        onChange={handleFileChange}
        className="mt-3 block w-full text-xs text-slate-600 file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700"
      />
      {isLoading ? (
        <p className="mt-3 text-sm text-slate-500">Extracting text…</p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {characterCount !== null ? (
        <div className="mt-3 text-sm text-slate-800">
          <p className="font-medium">Resume Uploaded ✅</p>
          <p className="mt-1 text-slate-600">
            Characters Extracted: {characterCount}
          </p>
        </div>
      ) : null}
    </section>
  );
}
