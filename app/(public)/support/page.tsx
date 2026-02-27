import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support | City Needs',
  description: 'Get help with City Needs. Contact our support team for assistance with your account, bookings, or any questions.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-full">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Get Help
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Have a question or need assistance? We&apos;re here to help with your account, bookings, or anything else related to City Needs.
        </p>

        {/* Email */}
        <div className="bg-brand-light/5 border border-brand-light/10 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-500 mb-2">Email us at</p>
          <a
            href="mailto:support@cityneeds.ca"
            className="text-xl font-medium text-brand-orange hover:text-brand-orange-hover hover:underline"
          >
            support@cityneeds.ca
          </a>
        </div>

        {/* Response time */}
        <p className="text-sm text-gray-500 mb-8">
          We typically respond within 24-48 hours.
        </p>

        {/* Back link */}
        <Link
          href="/"
          className="text-sm text-brand hover:text-brand-light hover:underline"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
