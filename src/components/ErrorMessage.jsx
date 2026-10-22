export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p>{message}</p>
      <button onClick={onRetry} className="mt-2 font-medium underline">
        Try again
      </button>
    </div>
  );
}
