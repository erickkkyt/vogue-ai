import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - VOGUE AI',
  description: 'Read the Terms of Service for VOGUE AI. Understand your rights and responsibilities when using our platform.',
  alternates: {
    canonical: 'https://www.vogueai.net/terms-of-service',
  },
  openGraph: {
    title: 'Terms of Service - VOGUE AI',
    description: 'Read the Terms of Service for VOGUE AI. Understand your rights and responsibilities when using our platform.',
    url: 'https://www.vogueai.net/terms-of-service',
    // Uses default social share image from root layout unless a specific one is set here
    // images: [
    //   {
    //     url: '/social-share-tos.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Terms of Service - AI Baby Generator',
    //   },
    // ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - VOGUE AI',
    description: 'Read the Terms of Service for VOGUE AI. Understand your rights and responsibilities when using our platform.',
    // Uses default social share image from root layout unless a specific one is set here
    // images: ['/social-share-tos.png'],
    // creator: '@YourTwitterHandle',
  },
  // If other metadata properties exist, they should be preserved.
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700 py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Your agreement with VOGUE AI
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
            <div className="mb-12 p-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl border-l-4 border-purple-500">
              <p className="text-lg leading-relaxed text-gray-300">
                By accessing and using <strong className="text-purple-400">VOGUE AI</strong> ("the Service"), you agree to comply with and be bound by the following Terms of Use ("Terms") related to the use of Google Login. If you do not agree to these Terms, please do not use the Service or the Google Login functionality.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">1</span>
                Google Login Integration
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    1.1. To enhance your experience, <strong className="text-purple-400">VOGUE AI</strong> offers a third-party authentication service powered by Google Login. By using Google Login, you allow us to access certain information from your Google Account, including but not limited to:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Your Google Account Profile Information</strong>: <span className="text-gray-300">Your name, email address, profile picture, and other details that you have chosen to share with Google.</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Authentication Token</strong>: <span className="text-gray-300">A secure token that confirms your identity and grants you access to the Service.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    1.2. Google Login uses OAuth 2.0 authentication protocol, which means your login session is managed securely by Google.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">2</span>
                Data Collection and Usage
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    2.1. By using Google Login, you consent to the collection and use of your Google Account information for the following purposes:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">To authenticate your identity and log you into the Service.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">To personalize your experience and customize content based on the information retrieved from your Google Account.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">To communicate with you, if necessary, regarding your account and Service updates.</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    2.2. We will not collect or store your Google password. The information we access from your Google Account is limited to what is necessary to provide the login service and related functionality.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">3</span>
                Access Tokens and Session Management
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    3.1. <strong className="text-white">Access Tokens</strong>: When you log in using Google Login, we obtain an access token that enables us to authenticate you with Google. The access token is valid for a limited time, and we will refresh it using a secure refresh token as needed.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    3.2. <strong className="text-white">Session Duration</strong>: Your session will remain active as long as your access token is valid or until you log out of your account or revoke access to your Google account.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    3.3. You can disconnect your Google account from the Service at any time by logging out or by modifying your Google account settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">4</span>
                Privacy and Security
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    4.1. We take your privacy and security seriously. Please refer to our <Link href="/privacy-policy" className="text-purple-400 hover:underline">Privacy Policy</Link> for detailed information on how we handle your personal information, including the data we access from Google Login.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    4.2. <strong className="text-white">Data Security</strong>: We implement industry-standard security measures to protect your data. However, we cannot guarantee the security of your data transmitted over the internet.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    4.3. <strong className="text-white">Revoking Access</strong>: You may revoke access to your Google account at any time by visiting your Google Account settings or by logging out of the Service.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">5</span>
                User Responsibilities
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    5.1. By using Google Login, you agree to: Provide accurate and up-to-date information in your Google Account. Keep your Google account credentials and access tokens secure. Not use Google Login for any unlawful or fraudulent purposes.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    5.2. You may not use the Service if prohibited by applicable law. Without limiting the foregoing, you represent and warrant that you are not located in, under the control of, or a resident of any country subject to embargoes or sanctions, including those administered by the United States government, nor are you listed on any restricted party list.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    5.3. Your use of the Service must comply with all applicable laws, regulations, and third-party platform terms.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    5.4. You may only use the Service for personal, non-commercial purposes in accordance with these Terms.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    5.5. When using the Service, you agree not to:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Violate any applicable laws or regulations;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Copy, distribute, sublicense, sell, or exploit the Service;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Reverse-engineer or attempt to access the source code of the Service;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Use bots, scrapers, or other automated means to access or manipulate content;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Circumvent DRM protections or access controls on third-party platforms;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Interfere with or disrupt the Service, including through the use of automated tools; Infringe the rights of others, including intellectual property and privacy rights, including but without limits: 1) upload, generate, display, post, distribute or otherwise transmit any information that violates any third-party right, including any copyright, trademark, patent, trade secret, moral right, privacy right, right of publicity, or any other intellectual property or proprietary right; 2) use VOGUE AI Outputs in any immoral or illegal way, especially VOGUE AI Outputs which features a recognisable person; 3) use VOGUE AI Outputs on or in conjunction with anything pornographic, obscene, offensive (including but not limited to in relation to adult entertainment venues, escort services, drug use, dating services, in a way which portrays someone as suffering from, or medicating for, a physical or mental ailment), illegal, immoral, infringing, defamatory, hateful, threatening or libellous in nature, in a political context (such as the promotion, advertisement or endorsement of any party, candidate, or elected official or in connection with any political party or viewpoint); 4) use VOGUE AI Outputs in a misleading or deceptive way, including without limit (i) by suggesting that any depicted person, brand, organisation or other third party endorses or is affiliated with you or your goods or services, unless permission has been granted; or (ii) by giving the impression that VOGUE AI Outputs were created by anyone other than the intellectual property rights holder of VOGUE AI Outputs (including without limitation, by claiming or giving the impression that you hold ownership of, or exclusive rights to, VOGUE AI Outputs); 5) use VOGUE AI Outputs in breach of any law, regulation or industry code, or in any way which infringes the rights of any person or entity; 6) Copy, share, or display VOGUE AI Outputs without appropriate authorization.</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    5.6. The content provided by VOGUE AI such as pictures and videos are for personal use only. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use VOGUE AI Outputs. You do not acquire any ownership rights in VOGUE AI Outputs. You have the exclusive right to use VOGUE AI Outputs solely for personal, educational, or non-commercial research purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">6</span>
                Intellectual Property
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    6.1. All content, trademarks, and intellectual property related to the Service are owned by VOGUE AI or its licensors. You may not use or reproduce any content without permission.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    6.2. VOGUE AI respects the intellectual property rights of others and expects users to do the same. Unauthorized use of copyrighted material is prohibited.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    6.3. By using the Service, you grant VOGUE AI a license to use any content you submit or create, for the purpose of operating and improving the Service.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    6.4. You have the exclusive right to use VOGUE AI Outputs solely for personal, educational, or non-commercial research purposes.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    6.5. By submitting feedback or suggestions, you grant us a royalty-free, perpetual, worldwide license to use and incorporate such input without obligation.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">7</span>
                Termination of Access
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    7.1. We reserve the right to terminate or suspend your access to Google Login if we believe you are in violation of these Terms or our Privacy Policy. We may also suspend or terminate Google Login integration for any reason, at our discretion, with or without notice.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    7.2. Provisions regarding intellectual property, liability, indemnification, and dispute resolution will survive termination.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">8</span>
                Fees, Payment, Auto-Renewal, Cancellation, and Refund Policy
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    8.1. <strong className="text-white">Fees and Payment</strong>: You agree to pay all applicable fees for the Services, as specified at the time of your purchase or subscription. We reserve the right to adjust pricing at any time, and any price changes will take effect after advance notice to you.
                  </p>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    8.2. <strong className="text-white">Auto-Renewal and Cancellation of Subscriptions</strong>: If you choose to purchase a subscription, your subscription will continue and automatically renew at the then-current price for such subscription, at the frequency specified at the time of purchase (e.g., monthly, annually), until terminated in accordance with these Terms.
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Authorization to Charge</strong>: <span className="text-gray-300">By subscribing, you authorize us to charge your designated payment method now, and again at the beginning of any subsequent subscription period.</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Payment Failure</strong>: <span className="text-gray-300">If VOGUE AI does not receive payment upon renewal of your subscription, (i) you shall pay all amounts due on your account upon demand, and/or (ii) you agree that VOGUE AI may either terminate or suspend your subscription and continue to attempt to charge your designated payment method until payment is received (upon receipt of payment, your account will be activated and for purposes of automatic renewal, your new subscription commitment period will begin as of the day payment was received).</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Cancellation</strong>: <span className="text-gray-300">If you do not want your account to renew automatically, or if you want to change or terminate your subscription, you must do so through your account settings or contact VOGUE AI at <a href="mailto:support@vogueai.net" className="text-purple-400 hover:text-purple-300 underline font-medium">support@vogueai.net</a> prior to the next renewal date. If you purchased your subscription through a third-party application store, you must cancel, change, or terminate your subscription through such third-party application store before your renewal start date.</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Effect of Cancellation</strong>: <span className="text-gray-300">If you cancel your subscription, you may use your subscription until the end of your then-current subscription term; your subscription will not be renewed after your then-current term expires.</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    8.3. <strong className="text-white">Refund Policy</strong>:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">General</strong>: <span className="text-gray-300">Except as expressly set forth in these Terms or as required by applicable law, all fees paid are non-refundable.</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Subscription Fees</strong>: <span className="text-gray-300">Fees paid for a subscription period (e.g., monthly, annually) are generally non-refundable once the subscription period has commenced. Even if you cancel your subscription mid-period, you will not be eligible for a pro-rata refund of any portion of the subscription fee paid for the then-current subscription term. As stated in Section 8.2 above, upon cancellation, you will continue to have access to the service until the end of your then-current paid subscription term.</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">One-Time Purchases (if applicable)</strong>: <span className="text-gray-300">For any one-time purchases of service packs or credits (if such services are offered), refunds are generally not provided unless requested within 7 days of purchase and the service pack or credits remain entirely unused.</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Exceptions</strong>:
                        <ul className="mt-2 ml-4 space-y-2">
                          <li className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-300"><strong className="text-white">Material Service Defects</strong>: If our Service suffers from a material defect that prevents you from reasonably using its core functionalities, and we fail to remedy such defect within a reasonable time after receiving written notice from you, you may be eligible for a partial or full refund, determined on a case-by-case basis.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-300"><strong className="text-white">As Required by Law</strong>: We will provide refunds where required by applicable law.</span>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <strong className="text-white">Refund Requests</strong>: <span className="text-gray-300">All refund requests (if eligible under the exceptions above) must be submitted to <a href="mailto:support@vogueai.net" className="text-purple-400 hover:text-purple-300 underline font-medium">support@vogueai.net</a> with details of the purchase and the reason for the request. We will evaluate your request in accordance with this policy.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">9</span>
                Disclaimer of Warranties
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    9.1. The Service is provided &quot;as is&quot; and &quot;as available.&quot; We disclaim all warranties, express or implied, including fitness for a particular purpose and non-infringement.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    9.2. We do not guarantee the Service will be uninterrupted, error-free, or compatible with all devices or platforms.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    9.3. Third-party services involved, including Google Login, are not under our control, and we do not review, approve, monitor, endorse, warrant, or make any representations and warranties, express or implied with respect to third party services and are not responsible for any third-party service.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">10</span>
                Liabilities and Indemnification
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    10.1. We reserve the right to investigate violations and take appropriate action regarding your breach of Terms, including but not limited to suspending or disabling access.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    10.2. You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Your use of the Service;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Your breach of these Terms;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">Your violation of any law or third-party rights.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">11</span>
                Limitation of Liability
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    11.1. To the fullest extent permitted by law, <strong className="text-white">VOGUE AI</strong> shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of Google Login, including any issues related to authentication, security breaches, or data loss.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    11.2. YOU SHALL USE THE SERVICES PROVIDED BY US AND VOGUE AI OUTPUTS IN STRICT ACCORDANCE WITH THIS AGREEMENT. WE ARE NOT LIABLE FOR LOSSES ARISING FROM YOUR BREACH OF THESE TERMS OR ANY OF OUR OTHER RULES.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    11.3. WE WILL NOT BE LIABLE TO YOU OR ANY OTHER INDIVIDUAL OR ENTITY FOR ANY INDIRECT DAMAGES.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    11.4. IN NO EVENT SHALL OUR AGGREGATE LIABILITY FOR COMPENSATION UNDER THIS TERMS (WHETHER IN CONTRACT, TORT OR OTHERWISE) EXCEED THE HIGHER OF THE TOTAL FEES PAID BY YOU TO US FOR YOUR USE OF THE SERVICES HEREUNDER DURING THE TWELVE (12) MONTHS IMMEDIATELY PRIOR TO THE EVENT OR CIRCUMSTANCE GIVEN RISE TO SUCH LIABILITY.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 12 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">12</span>
                Modifications to Terms of Use
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    We may update or modify these Terms of Use at any time, and such changes will be effective immediately upon posting on this page. It is your responsibility to review these Terms periodically for any changes. Continued use of the Service after any changes to these Terms constitutes acceptance of those changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 13 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">13</span>
                Governing Law and Dispute Resolution
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    13.1 These Terms are governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in [Jurisdiction].
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    13.2. Any controversy or dispute between you and us shall be firstly settled through friendly negotiations, fail which, you agree that such controversy or dispute may be submitted to the competent people&apos;s court at the place where you are permanently located.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    13.3. UNLESS YOU ARE A RESIDENT IN ANY PROVINCE, TERRITORY OR JURISDICTION WHERE SUCH CLAUSES OR WAIVERS ARE PROHIBITED, YOU AGREE THAT, YOU MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT ON A CLASS, REPRESENTATIVE, OR COLLECTIVE BASIS, AND YOU HEREBY WAIVES ALL RIGHTS TO HAVE ANY DISPUTE BE BROUGHT, HEARD, ADMINISTERED, RESOLVED, OR ARBITRATED ON A CLASS, COLLECTIVE, REPRESENTATIVE, OR MASS ACTION BASIS. ONLY INDIVIDUAL RELIEF IS AVAILABLE, AND DISPUTES OF MORE THAN ONE CUSTOMER OR USER CANNOT BE ARBITRATED OR CONSOLIDATED WITH THOSE OF ANY OTHER USER.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    13.4. We may seek injunctive or equitable relief in any competent court where you are permanently located, as necessary to protect our rights or interests.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 14 */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">14</span>
                General Provisions
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    14.1. If any provision of these Terms is deemed unenforceable, the remainder shall remain in effect.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    14.2. These Terms represent the entire agreement between you and us regarding the Service.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    14.3. You may not assign these Terms without our consent. We may assign them freely.
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    14.4. Our failure to enforce any provision shall not constitute a waiver.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 15 - Contact Us */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">15</span>
                Contact Us
              </h2>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    If you have any questions or concerns regarding these Terms of Use, or if you identify any infringement upon your legitimate rights or interests during your use of the Service, please promptly contact us and provide us with legally valid supporting materials, including but not limited to identity certificate, ownership certificate, and description of specific infringement, so that we may take necessary measures to deal with such issue. In addition, if you identify any violation of laws or regulations or relevant rules on the Service hereunder during your use of the Service, please contact us.
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Email</strong>: <a href="mailto:support@vogueai.net" className="text-purple-400 hover:text-purple-300 underline font-medium">support@vogueai.net</a>
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