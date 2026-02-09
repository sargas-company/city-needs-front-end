import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RejectModalProps {
  onClose: () => void;
  onReject: (reason: string) => Promise<void>;
}

export default function RejectModal({ onClose, onReject }: RejectModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const handleReject = async () => {
    const trimmedReason = rejectionReason.trim();

    // Validation
    if (!trimmedReason) return;
    if (trimmedReason.length > 500) return;

    setIsRejecting(true);
    try {
      await onReject(trimmedReason);
    } finally {
      setIsRejecting(false);
    }
  };

  const isValid = rejectionReason.trim().length > 0 && rejectionReason.trim().length <= 500;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full m-4 p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reject Business</h2>
        <p className="text-gray-600 mb-6">
          Please specify the reason for rejection. This message will be sent to the business owner.
        </p>

        {/* Textarea */}
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Message to business..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-black"
        />

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={isRejecting}
            className="px-12 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={!isValid || isRejecting}
            className="px-12 py-3 bg-blue-900 text-white rounded-full font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRejecting && <Loader2 className="w-4 h-4 animate-spin" />}
            Reject Business
          </button>
        </div>
      </div>
    </div>
  );
}
