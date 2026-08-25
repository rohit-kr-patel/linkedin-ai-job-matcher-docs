export const RESUME_STORAGE_KEY = "resume";

export interface ResumeRecord {
  text: string;
}

export interface ResumeUploadState {
  isLoading: boolean;
  error: string | null;
  characterCount: number | null;
}
