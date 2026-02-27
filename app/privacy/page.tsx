import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | City Needs',
  description: 'Privacy Policy for City Needs - Learn how we collect, use, and protect your personal information.',
};

const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'data-we-collect', title: '2. Data We Collect' },
  { id: 'how-we-use-data', title: '3. How We Use Your Data' },
  { id: 'third-party-services', title: '4. Third-Party Services' },
  { id: 'data-sharing', title: '5. Data Sharing' },
  { id: 'data-retention', title: '6. Data Retention' },
  { id: 'your-rights', title: '7. Your Rights' },
  { id: 'account-deletion', title: '8. Account Deletion' },
  { id: 'childrens-privacy', title: "9. Children's Privacy" },
  { id: 'cookies-tracking', title: '10. Cookies & Tracking' },
  { id: 'changes', title: '11. Changes to This Policy' },
  { id: 'contact', title: '12. Contact Us' },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/"
            className="text-orange-600 hover:text-orange-700 text-sm font-medium mb-6 inline-block"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">
            Last Updated: February 28, 2025
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Table of Contents
          </h2>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-orange-600 hover:text-orange-700 hover:underline text-sm"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* 1. Introduction */}
          <section id="introduction" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to City Needs. City Needs is a mobile application (available on iOS and Android) that connects customers with local service providers, including beauty, grooming, home services, and more. Users can browse and book services, view provider profiles and video reels, and leave reviews. Service providers can manage their business profiles and accept bookings through the platform.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By creating an account or using our services, you agree that we may process your personal data in accordance with this Privacy Policy. We use your information to create and manage your account, provide our services, and improve your overall experience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy explains what information we collect, how we use it, and your rights regarding your personal data.
            </p>
          </section>

          {/* 2. Data We Collect */}
          <section id="data-we-collect" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Data We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect the following types of information to provide and improve our services:
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              Account & Identity Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>User ID:</strong> Unique identifier for authentication and account management
              </li>
              <li>
                <strong>Name:</strong> Your name for user and business profiles
              </li>
              <li>
                <strong>Email Address:</strong> Used for account creation, login, and notifications
              </li>
              <li>
                <strong>Phone Number:</strong> Used for contact purposes and verification
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              Location Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Precise Location:</strong> With your permission, we collect your device location to show nearby service providers and enable location-based features
              </li>
              <li>
                <strong>Physical Address:</strong> Business addresses provided by service providers for their listings
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              Content & Media
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Photos and Videos:</strong> Profile photos, business images, and video reels uploaded by users and service providers
              </li>
              <li>
                <strong>Other User Content:</strong> Reviews, service descriptions, and business information you provide
              </li>
              <li>
                <strong>Other Contact Information:</strong> Business social media links and additional contact details
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              Transaction & Activity Data
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Purchase History:</strong> Your booking history and service transactions
              </li>
              <li>
                <strong>Product Interaction:</strong> How you use the app, including views, searches, and interactions with service listings
              </li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">
              Verification & Support
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Provider Verification Documents:</strong> Identity and business verification documents submitted by service providers
              </li>
              <li>
                <strong>Customer Support:</strong> Information you provide when contacting our support team
              </li>
            </ul>
          </section>

          {/* 3. How We Use Your Data */}
          <section id="how-we-use-data" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. How We Use Your Data
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Account Management:</strong> To create, maintain, and secure your account
              </li>
              <li>
                <strong>Service Delivery:</strong> To connect customers with service providers, facilitate bookings, and process transactions
              </li>
              <li>
                <strong>Location Services:</strong> To show nearby service providers and enable location-based search
              </li>
              <li>
                <strong>Communication:</strong> To send booking confirmations, notifications, and important updates about your account or our services
              </li>
              <li>
                <strong>Verification:</strong> To verify service provider identities and business credentials
              </li>
              <li>
                <strong>Improvement:</strong> To analyze usage patterns and improve our app features and user experience
              </li>
              <li>
                <strong>Safety & Security:</strong> To detect and prevent fraud, abuse, and security issues
              </li>
              <li>
                <strong>Customer Support:</strong> To respond to your inquiries and resolve issues
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable laws and regulations
              </li>
            </ul>
          </section>

          {/* 4. Third-Party Services */}
          <section id="third-party-services" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use trusted third-party services to operate our platform. These services may process limited data on our behalf:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-3">
              <li>
                <strong>Firebase (Google):</strong> We use Firebase for user authentication, account management, and app functionality. Firebase may collect device information and authentication tokens. See{' '}
                <a
                  href="https://firebase.google.com/support/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Firebase Privacy Policy
                </a>
              </li>
              <li>
                <strong>Stripe:</strong> For payment processing, we use Stripe to handle financial transactions securely. Stripe processes payment information according to their privacy practices. See{' '}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Stripe Privacy Policy
                </a>
              </li>
              <li>
                <strong>Google Maps / Mapbox:</strong> We use mapping services to display maps, calculate distances, and provide location-based features. These services may receive location data when you use map features. See{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong>Analytics:</strong> We may use analytics tools to understand how users interact with our app and improve our services
              </li>
            </ul>
          </section>

          {/* 5. Data Sharing */}
          <section id="data-sharing" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Data Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal data to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>With Service Providers:</strong> When you book a service, we share relevant information (such as your name and contact details) with the service provider to fulfill your booking
              </li>
              <li>
                <strong>With Customers:</strong> Service provider profiles, including business information, photos, and reviews, are visible to customers using the platform
              </li>
              <li>
                <strong>Service Partners:</strong> Trusted partners who process data on our behalf for core functionality (authentication, payments, analytics, notifications)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order, or government request
              </li>
              <li>
                <strong>Safety & Security:</strong> To protect the rights, safety, or property of City Needs, our users, or the public
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction
              </li>
            </ul>
          </section>

          {/* 6. Data Retention */}
          <section id="data-retention" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal data for as long as necessary to provide our services and fulfill the purposes described in this policy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Account Data:</strong> Retained while your account is active and for a reasonable period after account deletion to comply with legal obligations
              </li>
              <li>
                <strong>Transaction Records:</strong> Retained for the period required by applicable tax and financial regulations (typically 5-7 years)
              </li>
              <li>
                <strong>Verification Documents:</strong> Retained while the associated business account is active and for a reasonable period after to handle disputes
              </li>
              <li>
                <strong>Support Communications:</strong> Retained for a reasonable period to improve our services and handle ongoing issues
              </li>
              <li>
                <strong>Usage Data:</strong> Typically retained in aggregated or anonymized form for analytics purposes
              </li>
            </ul>
          </section>

          {/* 7. Your Rights */}
          <section id="your-rights" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Access:</strong> You can request a copy of the personal data we hold about you
              </li>
              <li>
                <strong>Correction:</strong> You can update or correct inaccurate information through your account settings or by contacting us
              </li>
              <li>
                <strong>Deletion:</strong> You can request deletion of your account and associated personal data (see Account Deletion section)
              </li>
              <li>
                <strong>Data Portability:</strong> You can request your data in a portable format where technically feasible
              </li>
              <li>
                <strong>Withdraw Consent:</strong> You can withdraw consent for optional data processing (such as location services) through your device settings or the app
              </li>
              <li>
                <strong>Object to Processing:</strong> You can object to certain types of data processing
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, please contact us using the information in the Contact Us section below.
            </p>
          </section>

          {/* 8. Account Deletion */}
          <section id="account-deletion" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Account Deletion
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can request deletion of your account and personal data at any time. To delete your account:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
              <li>Open the City Needs app</li>
              <li>Go to Settings &gt; Account</li>
              <li>Select &quot;Delete Account&quot;</li>
              <li>Confirm your request</li>
            </ol>
            <p className="text-gray-700 leading-relaxed mb-4">
              Alternatively, you can email us at{' '}
              <a
                href="mailto:privacy@cityneeds.app"
                className="text-orange-600 hover:underline"
              >
                privacy@cityneeds.app
              </a>{' '}
              with your account deletion request.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Upon receiving your request, we will delete your account and personal data within 30 days, except for information we are required to retain for legal, regulatory, or legitimate business purposes (such as transaction records for tax compliance).
            </p>
          </section>

          {/* 9. Children's Privacy */}
          <section id="childrens-privacy" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              City Needs is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information promptly.
            </p>
          </section>

          {/* 10. Cookies & Tracking */}
          <section id="cookies-tracking" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              10. Cookies & Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Keep you signed in to your account</li>
              <li>Understand how you use our app</li>
              <li>Measure the effectiveness of our services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can disable certain tracking technologies through your device settings, but some features may not work correctly if you do so.
            </p>
          </section>

          {/* 11. Changes to This Policy */}
          <section id="changes" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When we make material changes, we will notify you through an in-app notification, email, or by updating the &quot;Last Updated&quot; date at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          {/* 12. Contact Us */}
          <section id="contact" className="mb-10 scroll-mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, how we handle your data, or wish to exercise your privacy rights, please contact us:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:privacy@cityneeds.app"
                  className="text-orange-600 hover:underline"
                >
                  privacy@cityneeds.app
                </a>
              </li>
              <li>
                <strong>Support:</strong>{' '}
                <a
                  href="mailto:support@cityneeds.app"
                  className="text-orange-600 hover:underline"
                >
                  support@cityneeds.app
                </a>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} City Needs. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
