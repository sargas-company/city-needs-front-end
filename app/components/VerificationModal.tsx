import { useEffect, useState } from 'react';
import type { Verification } from '@/lib/api';
import { getFileSignedUrl } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import RejectModal from './RejectModal';

interface VerificationModalProps {
  verification: Verification;
  onClose: () => void;
  onApprove?: (verificationId: string) => Promise<void>;
  onReject?: (verificationId: string, reason: string) => Promise<void>;
}

export default function VerificationModal({
  verification,
  onClose,
  onApprove,
  onReject,
}: VerificationModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    async function loadFile() {
      try {
        setIsLoadingFile(true);
        setFileError(null);
        const response = await getFileSignedUrl(verification.verificationFile.id);
        setFileUrl(response.url);
      } catch (error) {
        console.error('Failed to load file:', error);
        setFileError('Failed to load document');
      } finally {
        setIsLoadingFile(false);
      }
    }

    loadFile();
  }, [verification.verificationFile.id]);

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    await onReject?.(verification.id, reason);
    setShowRejectModal(false);
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
  };

  const handleApproveClick = async () => {
    setIsApproving(true);
    try {
      await onApprove?.(verification.id);
    } finally {
      setIsApproving(false);
    }
  };

  const renderFileViewer = () => {
    if (isLoadingFile) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      );
    }

    if (fileError || !fileUrl) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-red-600">{fileError || 'Unable to load document'}</p>
        </div>
      );
    }

    const mimeType = verification.verificationFile.mimeType;

    // PDF files
    if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[500px] border border-gray-300 rounded-lg"
          title="PDF Document"
        />
      );
    }

    // Image files
    if (mimeType.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img
            src={fileUrl}
            alt="Verification document"
            className="max-w-full max-h-[500px] rounded-lg border border-gray-300"
          />
        </div>
      );
    }

    // Text files
    if (mimeType === 'text/plain') {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[500px] border border-gray-300 rounded-lg"
          title="Text Document"
        />
      );
    }

    // Word documents - provide download link
    if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-gray-600">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
            <p className="text-center font-medium">Word Document</p>
            <p className="text-sm text-gray-500 mt-2">{verification.verificationFile.originalName}</p>
          </div>
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Download Document
          </a>
        </div>
      );
    }

    // Fallback for unsupported types
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-gray-600">Preview not available for this file type</p>
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Document Viewer</h2>
            <p className="text-sm text-gray-600 mt-1">
              Verification document for {verification.business.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Section Title */}
          <h3 className="text-lg text-black font-semibold text-center mb-6">
            Business Identification Document
          </h3>

          {/* File Viewer */}
          <div className="mt-6">
            {renderFileViewer()}
          </div>
        </div>

        {/* Footer Actions - Only show if status is PENDING */}
        {verification.status === 'PENDING' && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleRejectClick}
              disabled={isApproving}
              className="px-8 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </button>
            <button
              onClick={handleApproveClick}
              disabled={isApproving}
              className="px-8 py-3 bg-blue-900 text-white rounded-full font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isApproving && <Loader2 className="w-4 h-4 animate-spin" />}
              Approve
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          onClose={handleRejectCancel}
          onReject={handleRejectConfirm}
        />
      )}
    </div>
  );
}
