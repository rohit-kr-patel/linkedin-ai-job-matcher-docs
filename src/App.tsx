import ResumeUpload from "./components/ResumeUpload";

export default function App() {
  return (
    <div className="flex flex-col bg-white px-6 py-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-lg font-semibold text-slate-900">
          LinkedIn AI Job Matcher
        </h1>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-emerald-700">
            Extension Working
          </span>
        </div>
      </div>
      <ResumeUpload />
    </div>
  );
}
