import { forwardRef } from 'react';
import Image from 'next/image';

interface BusinessApprovalCardProps {
  business: {
    id: string;
    name: string;
    owner?: {
      id: string;
      username: string | null;
      email: string | null;
    };
    approvalStatus: string;
    category?: {
      id: string;
      title: string;
      slug: string;
    };
    logo?: {
      id: string;
      url: string;
      type: string;
      mimeType: string;
      sizeBytes: number;
      originalName: string;
    } | null;
  };
  onViewDocuments?: (businessId: string) => void;
}

const BusinessApprovalCard = forwardRef<HTMLDivElement, BusinessApprovalCardProps>(
  ({ business, onViewDocuments }, ref) => {
    const getStatusConfig = (status: string) => {
      switch (status.toUpperCase()) {
        case 'APPROVED':
          return {
            label: 'Approved',
            textColor: 'text-green-600',
            icon: '✓',
          };
        case 'REJECTED':
          return {
            label: 'Rejected',
            textColor: 'text-red-600',
            icon: '✗',
          };
        case 'PENDING':
          return {
            label: 'Pending',
            textColor: 'text-orange-600',
            icon: '⏳',
          };
        default:
          return {
            label: status,
            textColor: 'text-gray-600',
            icon: '◦',
          };
      }
    };

    const statusConfig = getStatusConfig(business.approvalStatus);

    return (
      <div
        ref={ref}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        {/* Business Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
            {business.logo?.url ? (
              <Image
                src={business.logo.url}
                alt={business.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-gray-600 text-xl font-semibold">
                  {business.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{business.name}</h3>
            {business.category && (
              <span className="text-xs text-gray-500">{business.category.title}</span>
            )}
          </div>
        </div>

        {/* Owner Info */}
        <div className="space-y-1 mb-4">
          {business.owner?.username && (
            <p className="text-sm text-gray-700">{business.owner.username}</p>
          )}
          {business.owner?.email && (
            <p className="text-sm text-gray-500 truncate">{business.owner.email}</p>
          )}
        </div>

        {/* View Documents Button */}
        <button
          onClick={() => onViewDocuments?.(business.id)}
          className="w-full py-2.5 px-4 mb-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View documents
        </button>

        {/* Status */}
        <div className="flex items-center justify-center gap-2">
          <span className={`text-sm font-medium ${statusConfig.textColor}`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>
      </div>
    );
  }
);

BusinessApprovalCard.displayName = 'BusinessApprovalCard';

export default BusinessApprovalCard;
