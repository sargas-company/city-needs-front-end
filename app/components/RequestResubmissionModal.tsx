import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RequestResubmissionModalProps {
  onClose: () => void;
  onRequestResubmission?: (message: string) => Promise<void>;
}

export default function RequestResubmissionModal({
  onClose,
  onRequestResubmission,
}: RequestResubmissionModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedMessage = message.trim();

    // Validation
    if (!trimmedMessage) return;
    if (trimmedMessage.length > 500) return;

    setIsSubmitting(true);
    try {
      if (onRequestResubmission) {
        await onRequestResubmission(trimmedMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = message.trim().length > 0 && message.trim().length <= 500;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full m-4 p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Request re-submission
        </h2>
        <p className="text-gray-600 mb-6">
          Please specify what documents or information are missing
        </p>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message to business..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-black"
        />

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-12 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="px-12 py-3 bg-blue-900 text-white rounded-full font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Send request
          </button>
        </div>
      </div>
    </div>
  );
}
