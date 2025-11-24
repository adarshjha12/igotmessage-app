// app/terms/page.tsx or pages/terms.tsx
'use client'

import { ShieldCheck, FileText, Info, AlertTriangle } from 'lucide-react'

export default function TermsPageComponent() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-[var(--textColor)] bg-[var(--wrapperColor)]">
      <div className="text-center space-y-2">
        <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
        <h1 className="text-3xl font-semibold">Terms & Conditions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Effective date: July 7, 2025</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Introduction
        </h2>
        <p>
          By accessing or using our application, you agree to be bound by these Terms & Conditions. Please read them carefully before creating a profile or using any of our services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" /> User Responsibilities
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>You must provide accurate and truthful information when creating your profile.</li>
          <li>You are responsible for the content and images you upload and must not violate copyrights, trademarks, or privacy rights of others.</li>
          <li>Any misuse, including posting offensive or harmful content, may result in suspension or deletion of your account.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" /> Limitation of Liability
        </h2>
        <p>
          We do our best to maintain the service but are not liable for any damages, losses, or inconvenience caused by errors, interruptions, or changes to the app.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Privacy
        </h2>
        <p>
          We respect your privacy. Personal data is handled according to our Privacy Policy, which explains what data we collect and how we use it.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Changes to These Terms</h2>
        <p>
          We may update these Terms & Conditions at any time. We will notify you by posting an updated version on this page. Continued use of the app after changes means you accept the new terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p>
          If you have questions about these Terms & Conditions, please contact us at <a href="mailto:support@example.com" className="text-primary underline">jhaa50872@gmail.com</a>.
        </p>
        
      </section>
      <div className='fixed bottom-0 w-full justify-evenly font-exo2 py-4 flex bg-[var(--wrapperColor)]'>
        <p>IGotMessage</p>
        <p>Copyright © 2025</p>
        <p>JhaFusion LLC</p>
      </div>
    </main>
  )
}
