export default function Modal({
  isOpen,
  onClose,
  title,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-2xl rounded bg-[#1f1f1f] p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-red-400">
            ✕
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto text-sm whitespace-pre-line text-gray-200">
          {content}
        </div>
      </div>
    </div>
  );
}
