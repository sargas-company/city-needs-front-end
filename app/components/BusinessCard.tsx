import { forwardRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    owner?: {
      id: string;
      username: string | null;
      email: string | null;
    };
    status: string;
    category?: {
      id: string;
      title: string;
      slug: string;
    };
    address?: {
      city: string;
      state: string;
      countryCode: string;
      addressLine1: string;
      addressLine2: string | null;
      zip: string;
    };
    logo?: {
      id: string;
      url: string;
      type: string;
      mimeType: string;
      sizeBytes: number;
      originalName: string;
    } | null;
    createdAt: string;
  };
  onStatusToggle?: (businessId: string, currentStatus: string) => void;
  isUpdating?: boolean;
  isDisabled?: boolean;
}

const BusinessCard = forwardRef<HTMLDivElement, BusinessCardProps>(
  ({ business, onStatusToggle, isUpdating = false, isDisabled = false }, ref) => {
    const router = useRouter();
    const isActive = ['ACTIVE', 'PENDING', 'REJECTED'].includes(business.status);

    const handleCardClick = () => {
      router.push(`/business-approval/${business.id}`);
    };

    const handleStatusToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      onStatusToggle?.(business.id, business.status);
    };

    return (
      <div
        ref={ref}
        onClick={handleCardClick}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
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

        {/* Location */}
        {business.address && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {business.address.city}, {business.address.state}
            </p>
          </div>
        )}

        {/* Status Button */}
        <button
          onClick={handleStatusToggle}
          disabled={isDisabled}
          className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center justify-center gap-2">
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            )}
            <span>{isActive ? 'Activated' : 'Deactivated'}</span>
          </div>
        </button>
      </div>
    );
  }
);

BusinessCard.displayName = 'BusinessCard';

export default BusinessCard;
