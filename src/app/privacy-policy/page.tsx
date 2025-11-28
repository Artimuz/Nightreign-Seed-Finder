'use client'

import { useState, useEffect } from 'react'

export default function PrivacyPolicyPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="pt-32 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how SeedFinder collects, 
            uses, and protects your information.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: November 28, 2024
          </div>
        </div>

        {/* Content */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-gray-600/30 p-8">
          <div className="prose prose-invert prose-lg max-w-none">
            
            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  SeedFinder is designed with privacy in mind. We collect minimal information to provide you with the best experience:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Local Storage Data:</strong> Your preferences, dismissed updates, and selected spawn locations are stored locally in your browser</li>
                  <li><strong className="text-white">Advertising Data:</strong> Google AdSense may collect data about your visits, interactions, and interests to serve relevant advertisements</li>
                  <li><strong className="text-white">Usage Analytics:</strong> Anonymous usage statistics to improve the application</li>
                  <li><strong className="text-white">No Personal Data:</strong> We do not directly collect names, emails, or other personally identifiable information</li>
                </ul>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <div className="text-gray-300 space-y-4">
                <p>The limited data we collect is used solely to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remember your preferences and settings between visits</li>
                  <li>Prevent showing you the same update notifications repeatedly</li>
                  <li>Improve the overall user experience</li>
                </ul>
              </div>
            </section>

            {/* Data Storage */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Data Storage & Security</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Your data security is our priority:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Local Storage:</strong> Your app preferences are stored locally in your browser</li>
                  <li><strong className="text-white">Google AdSense:</strong> Advertising data is processed by Google according to their privacy policy</li>
                  <li><strong className="text-white">Browser Control:</strong> You can clear stored data and manage cookie preferences through browser settings</li>
                  <li><strong className="text-white">Data Sharing:</strong> We share anonymous usage data with Google AdSense for advertising purposes</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Cookies & Tracking</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  SeedFinder uses the following tracking technologies:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Essential Storage:</strong> Local storage for app functionality (preferences, spawn selections)</li>
                  <li><strong className="text-white">Advertising Cookies:</strong> Google AdSense uses cookies to serve personalized advertisements based on your interests</li>
                  <li><strong className="text-white">Third-Party Tracking:</strong> Google may track your visits across websites to improve ad targeting</li>
                  <li><strong className="text-white">Analytics:</strong> Anonymous usage data to improve the application experience</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-white">Managing Cookies:</strong> You can control or disable cookies through your browser settings. 
                  Note that disabling advertising cookies may result in less relevant advertisements.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights & Choices</h2>
              <div className="text-gray-300 space-y-4">
                <p>You have control over your data and privacy:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">App Data:</strong> Clear local preferences through browser settings</li>
                  <li><strong className="text-white">Ad Personalization:</strong> Visit <a href="https://adssettings.google.com" className="text-blue-400 hover:text-blue-300">Google Ad Settings</a> to control ad personalization</li>
                  <li><strong className="text-white">Cookie Management:</strong> Use browser settings to block or delete advertising cookies</li>
                  <li><strong className="text-white">GDPR/CCPA Rights:</strong> Contact Google directly for data access, deletion, or portability requests</li>
                </ul>
              </div>
            </section>

            {/* Updates to Privacy Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may update this Privacy Policy from time to time. When we do:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We will update the &quot;Last updated&quot; date at the top of this page</li>
                  <li>Significant changes will be announced through our update notification system</li>
                  <li>Continued use of the application constitutes acceptance of any changes</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Email: alanrodroogs@gmail.com
                </p>
              </div>
            </section>

            {/* Summary */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/50">
              <h3 className="text-xl font-semibold text-white mb-3">Privacy Summary</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">TL;DR:</strong> SeedFinder stores your app preferences locally and uses Google AdSense 
                for advertising, which may collect and use data for personalized ads. We don&apos;t collect personal information directly, 
                but Google may track your usage for advertising purposes. You can control ad personalization through Google&apos;s settings.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}