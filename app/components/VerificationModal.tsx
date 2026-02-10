import { useEffect, useState } from "react";
import type { Verification } from "@/lib/api";
import { getFileSignedUrl } from "@/lib/api";
import { Loader2, RotateCcw } from "lucide-react";
import RejectModal from "./RejectModal";
import RequestResubmissionModal from "./RequestResubmissionModal";

interface VerificationModalProps {
  verification: Verification;
  onClose: () => void;
  onApprove?: (verificationId: string) => Promise<void>;
  onReject?: (verificationId: string, reason: string) => Promise<void>;
  onRequestResubmission?: (
    verificationId: string,
    message: string,
  ) => Promise<void>;
}

export default function VerificationModal({
  verification,
  onClose,
  onApprove,
  onReject,
  onRequestResubmission,
}: VerificationModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showResubmissionModal, setShowResubmissionModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    async function loadFile() {
      try {
        setIsLoadingFile(true);
        setFileError(null);
        const response = await getFileSignedUrl(
          verification.verificationFile.id,
        );
        setFileUrl(response.url);
      } catch {
        setFileError("Failed to load document");
      } finally {
        setIsLoadingFile(false);
      }
    }

    loadFile();
  }, [verification.verificationFile.id]);

  const handleRejectConfirm = async (reason: string) => {
    await onReject?.(verification.id, reason);
    setShowRejectModal(false);
  };

  const handleResubmissionConfirm = async (message: string) => {
    if (onRequestResubmission) {
      await onRequestResubmission(verification.id, message);
    }

    setShowResubmissionModal(false);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
        </div>
      );
    }

    if (fileError || !fileUrl) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-red-600">
            {fileError || "Unable to load document"}
          </p>
        </div>
      );
    }

    const mimeType = verification.verificationFile.mimeType;

    if (mimeType === "application/pdf") {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[500px] border border-gray-300 rounded-lg"
          title="PDF Document"
        />
      );
    }

    if (mimeType.startsWith("image/")) {
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

    if (mimeType === "text/plain") {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[500px] border border-gray-300 rounded-lg"
          title="Text Document"
        />
      );
    }

    if (
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="font-medium text-gray-700">Word Document</p>
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Download Document
          </a>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-gray-600">
          Preview not available for this file type
        </p>
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Document Viewer
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Verification document for {verification.business.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg text-black font-semibold text-center mb-6">
            Business Identification Document
          </h3>
          {renderFileViewer()}
        </div>

        {verification.status === "PENDING" && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={() => setShowResubmissionModal(true)}
              disabled={isApproving}
              className="flex items-center gap-2 text-blue-900 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Request re-submission
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isApproving}
                className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
              <button
                onClick={handleApproveClick}
                disabled={isApproving}
                className="px-8 py-3 bg-blue-900 text-white rounded-full font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isApproving && <Loader2 className="w-4 h-4 animate-spin" />}
                Approve
              </button>
            </div>
          </div>
        )}
      </div>

      {showRejectModal && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onReject={handleRejectConfirm}
        />
      )}

      {showResubmissionModal && (
        <RequestResubmissionModal
          onClose={() => setShowResubmissionModal(false)}
          onRequestResubmission={handleResubmissionConfirm}
        />
      )}
    </div>
  );
}
