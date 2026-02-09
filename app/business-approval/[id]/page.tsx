'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';

const dummyData = {
  business: {
    name: 'Grooming Center',
    owner: 'Emma Foster',
    id: '123456789',
    email: 'groomingcenter1212@gmail.com',
    city: 'Saskatoon',
    category: 'Pets',
    logoUrl: '',
  },
  verificationDocument: {
    name: 'Business License',
    fileName: 'Groomingcenter.jpg',
  },
  businessVideo: {
    name: 'Business Video',
    fileName: 'Groomingcenter',
    status: 'Approved',
  },
};

export default function VerificationDetailPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Businesses
          </h1>
          <p className="text-sm text-gray-500">
            Manage business profiles, approvals and activity status.
          </p>
        </div>

        {/* Business card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {dummyData.business.logoUrl ? (
                  <img
                    src={dummyData.business.logoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm font-semibold">
                    GC
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {dummyData.business.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {dummyData.business.owner}
                </p>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="
                px-8 py-2
                rounded-full
                bg-blue-900
                text-white
                text-sm
                cursor-pointer
                hover:bg-blue-800
                transition
              "
            >
              Back
            </button>
          </div>

          {/* Business details */}
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <p className="text-gray-500">
              Business Name:{' '}
              <span className="text-gray-900 font-medium">
                {dummyData.business.name}
              </span>
            </p>
            <p className="text-gray-500">
              Email:{' '}
              <span className="text-gray-900 font-medium">
                {dummyData.business.email}
              </span>
            </p>
            <p className="text-gray-500">
              Owner:{' '}
              <span className="text-gray-900 font-medium">
                {dummyData.business.owner}
              </span>
            </p>
            <p className="text-gray-500">
              City:{' '}
              <span className="text-gray-900 font-medium">
                {dummyData.business.city}
              </span>
            </p>
            <p className="text-gray-500">
              Business ID Number:{' '}
              <span className="text-gray-900 font-medium">
                {dummyData.business.id}
              </span>
            </p>
            <p className="text-gray-500">
              Category:{' '}
              <span className="text-gray-900 font-medium">
                {dummyData.business.category}
              </span>
            </p>
          </div>
        </div>

        {/* Verification Document */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
            Verification Document
          </h3>

          <div className="grid grid-cols-2 px-6 py-3 bg-gray-100 text-sm font-medium text-gray-600">
            <span>Document</span>
            <span>Uploaded file</span>
          </div>

          <div className="grid grid-cols-2 px-6 py-4 text-sm text-gray-900">
            <span>{dummyData.verificationDocument.name}</span>
            <span className="text-blue-600 hover:underline cursor-pointer">
              {dummyData.verificationDocument.fileName}
            </span>
          </div>
        </div>

        {/* Business Video */}
        <div className="bg-white rounded-xl border border-gray-200">
          <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
            Business Video
          </h3>

          <div className="grid grid-cols-3 px-6 py-3 bg-gray-100 text-sm font-medium text-gray-600">
            <span>Video</span>
            <span>Uploaded video</span>
            <span>Verification</span>
          </div>

          <div className="grid grid-cols-3 px-6 py-4 text-sm items-center text-gray-900">
            <span>{dummyData.businessVideo.name}</span>

            <span className="text-blue-600 hover:underline cursor-pointer flex items-center gap-2">
              ▶ {dummyData.businessVideo.fileName}
            </span>

            <span className="text-blue-700 font-medium">
              {dummyData.businessVideo.status}
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
