import { RESUME_STORAGE_KEY, type ResumeRecord } from "../types";

export async function getResume(): Promise<ResumeRecord | null> {
  const result = await chrome.storage.local.get(RESUME_STORAGE_KEY);
  const record = result[RESUME_STORAGE_KEY] as ResumeRecord | undefined;

  if (!record || typeof record.text !== "string" || record.text.length === 0) {
    return null;
  }

  return record;
}

export async function saveResume(record: ResumeRecord): Promise<void> {
  await chrome.storage.local.set({ [RESUME_STORAGE_KEY]: record });
}
