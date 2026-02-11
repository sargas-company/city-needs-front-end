import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Verification } from '@/lib/api';

interface VerificationCardProps {
  verification: Verification;
  onViewDocument?: (verification: Verification) => void;
}

const VerificationCard = forwardRef<HTMLDivElement, VerificationCardProps>(
  ({ verification, onViewDocument }, ref) => {
    const router = useRouter();

    const handleCardClick = () => {
      // Navigate using business ID instead of verification ID
      router.push(`/business-approval/${verification.business.id}`);
    };

    const handleViewDocumentClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onViewDocument?.(verification);
    };

    const getStatusConfig = (status: string) => {
      switch (status.toUpperCase()) {
        case 'APPROVED':
          return {
            label: 'Approved',
            icon: '✏️',
          };
        case 'REJECTED':
          return {
            label: 'Rejected',
            icon: '✗',
          };
        case 'PENDING':
          return {
            label: 'Pending',
            icon: '⏳',
          };
        default:
          return {
            label: status,
            icon: '◦',
          };
      }
    };

    const statusConfig = getStatusConfig(verification.status);

    return (
      <div
        ref={ref}
        onClick={handleCardClick}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      >
        {/* Business Header - Logo + Name in horizontal layout */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {verification.business.logo?.url ? (
              <img
                src={verification.business.logo.url}
                alt={verification.business.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-gray-600 text-xl font-semibold">
                  {verification.business.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {verification.business.name}
          </h3>
        </div>

        {/* Owner Info */}
        <div className="space-y-1 mb-6">
          {verification.business.owner.username && (
            <p className="text-base font-medium text-gray-900">
              {verification.business.owner.username}
            </p>
          )}
          {verification.business.owner.email && (
            <p className="text-sm text-gray-600">
              {verification.business.owner.email}
            </p>
          )}
        </div>

        {/* View Documents Button */}
        <button
          onClick={handleViewDocumentClick}
          className="w-full py-3 px-4 mb-4 bg-white border-2 border-blue-900 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          View documents
        </button>

        {/* Status */}
        <div className="flex items-center justify-center pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-blue-900 flex items-center gap-2">
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>
      </div>
    );
  }
);

VerificationCard.displayName = 'VerificationCard';

export default VerificationCard;
