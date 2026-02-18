import { useState } from 'react';
import { RotateCcw, Loader2 } from 'lucide-react';

interface BusinessVideoReviewModalProps {
  onClose: () => void;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onRequestResubmission: (reason: string) => Promise<void>;
}

export default function BusinessVideoReviewModal({
  onClose,
  onApprove,
  onReject,
  onRequestResubmission,
}: BusinessVideoReviewModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const trimmedReason = reason.trim();
  const isReasonValid = trimmedReason.length >= 5;

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onApprove();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!isReasonValid) return;
    setIsLoading(true);
    try {
      await onReject(trimmedReason);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResubmission = async () => {
    if (!isReasonValid) return;
    setIsLoading(true);
    try {
      await onRequestResubmission(trimmedReason);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full m-4 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Business Video Review
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Make sure the video follows the platform rules."
          disabled={isLoading}
          className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-black disabled:opacity-50"
        />

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleRequestResubmission}
            disabled={isLoading || !isReasonValid}
            className="flex items-center gap-2 text-blue-900 font-medium hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            Request re-submission
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={isLoading || !isReasonValid}
              className="px-12 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="px-12 py-3 bg-blue-900 text-white rounded-full font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
