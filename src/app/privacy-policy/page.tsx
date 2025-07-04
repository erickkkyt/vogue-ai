import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - VOGUE AI',
  description: 'Learn how VOGUE AI collects, uses, and protects your personal information. Your privacy is important to us.',
  alternates: {
    canonical: 'https://vogueai.net/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy - AI Baby Generator',
    description: 'Learn how AI Baby Generator collects, uses, and protects your personal information.',
    url: 'https://vogueai.net/privacy-policy',
    // Uses default social share image from root layout unless a specific one is set here
    // images: [
    //   {
    //     url: '/social-share-privacy.png', 
    //     width: 1200,
    //     height: 630,
    //     alt: 'Privacy Policy - AI Baby Generator',
    //   },
    // ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - VOGUE AI',
    description: 'Learn how VOGUE AI collects, uses, and protects your personal information.',
    // Uses default social share image from root layout unless a specific one is set here
    // images: ['/social-share-privacy.png'], 
    // creator: '@YourTwitterHandle',
  },
  // If other metadata properties exist, they should be preserved.
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700 py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Your privacy is our priority
          </p>
          <p className="text-sm text-gray-400 opacity-90">
            Last updated: June 12, 2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-600 overflow-hidden">
          <div className="p-12">{/* Content will continue here */}

            {/* Introduction */}
            <div className="mb-12 p-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl border-l-4 border-blue-500">
              <p className="text-lg leading-relaxed text-gray-300">
                Welcome to <strong className="text-blue-400">VOGUE AI</strong>. Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, store, and protect your personal information when you use our services. By using our product, you consent to the collection and use of information in accordance with this policy.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">1</span>
                Information We Collect
              </h2>
              <div className="bg-gray-700 rounded-xl p-6 mb-6">
                <p className="text-gray-300 leading-relaxed mb-6">
                  We collect different types of information to provide, improve, and personalize your experience with our service. This includes:
                </p>
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Personal Information
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div className="text-gray-300">
                      <strong className="text-white">Account Information</strong>: When you create an account, we collect information such as your name, email address, and profile details.
                    </div>
                  </li>
                  <li className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div className="text-gray-300">
                      <strong className="text-white">Payment Information</strong>: If you make a purchase or subscribe to a paid plan, we collect billing information, such as credit card numbers or other payment methods.
                    </div>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-white flex items-center mt-8">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Usage Data
                </h3>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    We collect information about how you use our service, including interaction data, pages viewed, time spent, and features used. This data helps us understand how our service is used and where we can improve.
                  </p>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-white flex items-center mt-8">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Device and Technical Information
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div className="text-gray-300">
                      Information about the device you use to access our service (e.g., device type, operating system, browser type, IP address).
                    </div>
                  </li>
                  <li className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div className="text-gray-300">
                      Cookies and similar technologies: We may use cookies, web beacons, and other tracking technologies to enhance your experience and analyze site traffic. You can control cookie settings through your browser.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">2</span>
                How We Use Your Information
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed mb-6">
                  We use the information we collect for the following purposes:
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">To Provide and Improve Our Services</strong>: <span className="text-gray-300">We use your data to deliver the features and functionality of the product, improve performance, and troubleshoot issues.</span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">To Communicate with You</strong>: <span className="text-gray-300">We may send you service-related emails, notifications, or marketing communications if you have opted into them.</span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">To Process Payments</strong>: <span className="text-gray-300">If applicable, we use payment information to process transactions and provide billing support.</span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">For Legal and Security Purposes</strong>: <span className="text-gray-300">We may use your information to comply with legal obligations or protect our users and services from fraudulent activity.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">3</span>
                Sharing Your Information
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed mb-6">
                  We may share your information with the following entities:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">Third-Party Service Providers</strong>: <span className="text-gray-300">We use third-party companies to support our business, such as payment processors, analytics services, and cloud storage providers. These partners are required to keep your information confidential and only use it to provide services to us.</span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">Legal Compliance</strong>: <span className="text-gray-300">We may disclose your information if required by law or to comply with legal processes, such as subpoenas or court orders.</span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">Business Transfers</strong>: <span className="text-gray-300">In the event of a merger, acquisition, or sale of all or part of our assets, your personal information may be transferred.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">4</span>
                Data Security
              </h2>
              <div className="bg-gray-700 rounded-xl p-6 space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    You acknowledge and authorize that, in order to enhance your user experience in using our product, we and our affiliated companies may use the input collected through your usage of our product and the corresponding output for the optimization of the products and services under this policy, provided that such information is processed with secure encryption technology and de-identified or anonymized. If you refuse to provide the foregoing authorization, you may provide feedback to us in accordance with Article 10 of this policy, and we will take effective measures to protect your legitimate rights and interests on the basis of fully respecting your opinions, but this may affect your use of some functions of our product.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">5</span>
                International Data Transfers
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    Our service may involve the transfer of your personal data to countries outside your own, including to the United States or other locations where our servers or third-party service providers are based. By using our service, you consent to the transfer of your information across borders.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">6</span>
                Your Rights and Choices
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed mb-6">
                  Depending on your location, you may have the following rights concerning your personal information:
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">Access and Correction</strong>: <span className="text-gray-300">You can request access to the personal information we hold about you and request corrections if the information is inaccurate or incomplete.</span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">Data Deletion</strong>: <span className="text-gray-300">You can request that we delete your personal information, subject to legal and contractual obligations.</span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">Opt-Out of Marketing</strong>: <span className="text-gray-300">You can opt-out of receiving marketing emails or notifications at any time by following the unsubscribe instructions provided in the communication.</span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    <div>
                      <strong className="text-white">Data Portability</strong>: <span className="text-gray-300">You may request a copy of your personal data in a structured, commonly used format.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300">
                    If you wish to exercise any of these rights or have questions about how we handle your data, please contact us at <a href="mailto:support@vogueai.net" className="text-blue-400 hover:text-blue-300 underline font-medium">support@vogueai.net</a>.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">7</span>
                Retention of Data
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, or as required by law. When your data is no longer needed, we will securely delete it.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">8</span>
                Cookies and Tracking Technologies
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We use cookies, web beacons, and similar technologies to enhance your experience. These technologies help us:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-center text-gray-300">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                      Analyze user activity
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                      Personalize content and ads
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                      Monitor site traffic and usage
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    You can control cookies through your browser settings. For more information on how we use cookies, please refer to our <strong className="text-white">Cookie Policy</strong> (Note: You may need to create a separate Cookie Policy page or section).
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">9</span>
                Changes to This Privacy Policy
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    We may update our Privacy Policy from time to time. Any changes will be posted on this page, with an updated "Last updated" date. We encourage you to review this policy periodically to stay informed about how we are protecting your data.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 10 - Contact Us */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">10</span>
                Contact Us
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300">
                    <strong className="text-white">Email</strong>: <a href="mailto:support@vogueai.net" className="text-blue-400 hover:text-blue-300 underline font-medium">support@vogueai.net</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <Link href="/" className="fixed bottom-8 right-8 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-4 px-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 z-50 flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </Link>
    </div>
  );
}