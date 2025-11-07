'use client'
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// PrivacyPolicyComponent.tsx
// Next.js + Tailwind CSS component
// Default export: PrivacyPolicy

export default function PrivacyPolicyPageComponent() {
  const [query, setQuery] = useState("");
  const [filteredIds, setFilteredIds] = useState<string[]>([]);

  useEffect(() => {
    const ids = Array.from(document.querySelectorAll("[data-section]"))
      .map((el) => el.getAttribute("data-section") || "")
      .filter(Boolean);

    setFilteredIds(ids);
  }, []);

  useEffect(() => {
    if (!query) {
      const all = Array.from(document.querySelectorAll("[data-section]"))
        .map((el) => el.getAttribute("data-section") || "")
        .filter(Boolean);
      setFilteredIds(all);
      return;
    }

    const q = query.toLowerCase();
    const matches: string[] = [];
    Array.from(document.querySelectorAll("[data-section]")).forEach((el) => {
      const id = el.getAttribute("id") || "";
      const text = el.textContent || "";
      if (id.toLowerCase().includes(q) || text.toLowerCase().includes(q))
        matches.push(id);
    });
    setFilteredIds(matches);
  }, [query]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-[var(--bgColor)]/50  p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Header card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-1 bg-[var(--bgColor)]  text-[var(--textColor)] backdrop-blur-md border border-slate-200  rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img src={'/logos/igm.png'} className="h-14 w-14 rounded-xl  flex items-center justify-center text-[var(--textColor)] text-xl font-semibold">
                
              </img>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--textColor)] ">
                Privacy Policy ● IGotMessage
              </h1>
              <p className="mt-1 text-sm text-[var(--textColor)] ">
                Social media · Chat · Video calls
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="relative block">
              <span className="sr-only">Search policy</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the policy (e.g. 'data', 'cookies')"
                className="placeholder:text-slate-400 block bg-white/60  w-full border border-slate-200  rounded-md py-2 pl-10 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Search
                className="absolute left-3 top-2.5 text-[var(--textColor)] "
                size={18}
              />
            </label>

            <div className="mt-4 text-sm text-[var(--textColor)]  space-y-3">
              <p>
                Use the table of contents to jump to a section, or search
                keywords above. This policy explains what we collect and how we
                use it to operate a safe, reliable social platform with chat and
                video calls.
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-500"
                >
                  Print / Save
                </button>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("contact");
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          <nav className="mt-6">
            <h3 className="text-xs font-semibold uppercase text-[var(--textColor)] ">
              Table of contents
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "introduction",
                "data-we-collect",
                "how-we-use-data",
                "sharing-and-disclosure",
                "data-retention",
                "security",
                "your-rights",
                "children",
                "cookies-and-tracking",
                "international-transfers",
                "changes",
                "contact",
              ].map((id) => (
                <li key={id}>
                  <button
                    disabled={!!query && !filteredIds.includes(id)}
                    onClick={() => scrollTo(id)}
                    className={`w-full text-left truncate ${
                      !!query && !filteredIds.includes(id)
                        ? "text-blue-600 cursor-not-allowed"
                        : "text-[var(--textColor)]  hover:underline"
                    }`}
                  >
                    {id.replace(/-/g, " ")}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>

        {/* Right: Policy content */}
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="lg:col-span-2 bg-white  border border-slate-100  rounded-2xl p-8 shadow-lg max-h-[80vh] overflow-y-auto"
        >
          <section
            id="introduction"
            data-section="introduction"
            className="prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>IGotMessage</strong> ("we", "our", "us"). This
              Privacy Policy explains how we collect, use, disclose, and protect
              information in connection with our social media platform that
              includes profiles, posts, direct messaging, voice & video calls,
              and interactive features. By using our services you agree to the
              collection and processing described in this policy.
            </p>
          </section>

          <section
            id="data-we-collect"
            data-section="data-we-collect"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>2. Data we collect</h2>
            <p>We collect the following categories of information:</p>
            <h3>Account & Profile</h3>
            <ul>
              <li>
                Full name, username, email address, phone number (if provided)
              </li>
              <li>Profile photo, bio, links, and other profile fields</li>
            </ul>

            <h3>Content you create</h3>
            <ul>
              <li>
                Posts, comments, stories, and any media (images, audio, video)
                you upload
              </li>
              <li>
                Messages, attachments, call logs (metadata), and live-stream
                content
              </li>
            </ul>

            <h3>Communications & Calls</h3>
            <p>
              We process content of messages and audio/video streams to provide
              real-time chat and video call features, including routing,
              encryption (where supported), and optional in-app transcription or
              moderation features if you enable them.
            </p>

            <h3>Device & Usage Data</h3>
            <ul>
              <li>
                IP address, device type, OS, browser, app version, and crash
                logs
              </li>
              <li>
                Usage patterns, features used, session duration, and performance
                metrics
              </li>
            </ul>

            <h3>Location</h3>
            <p>
              Approximate location inferred from IP address. Precise device
              location only if you grant permission and enable location-based
              features.
            </p>

            <h3>Third-party Data</h3>
            <p>
              Information from third-party services if you link them (e.g.,
              contacts, social accounts) or use third-party login (Google,
              Apple, etc.).
            </p>
          </section>

          <section
            id="how-we-use-data"
            data-section="how-we-use-data"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>3. How we use data</h2>
            <ul>
              <li>
                <strong>Provide the service:</strong> To enable accounts,
                deliver messages, initiate video calls, store and serve media,
                and maintain your profile.
              </li>
              <li>
                <strong>Security & Safety:</strong> To detect abuse, scam, spam,
                and to investigate incidents and enforce our terms.
              </li>
              <li>
                <strong>Personalization:</strong> To show relevant content,
                improve recommendations, and personalize your feed and
                notifications.
              </li>
              <li>
                <strong>Communication:</strong> Send transactional messages
                (account updates, important notices) and optional marketing
                content if you opt-in.
              </li>
              <li>
                <strong>Analytics & Research:</strong> To understand feature
                usage, improve performance, and build aggregated, anonymized
                insights.
              </li>
            </ul>
          </section>

          <section
            id="sharing-and-disclosure"
            data-section="sharing-and-disclosure"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>4. Sharing & Disclosure</h2>
            <p>
              We do not sell your personal data. We may share information in
              limited circumstances:
            </p>
            <h3>Service providers</h3>
            <p>
              Vendors who perform services for us (hosting, analytics, messaging
              delivery, payment processors) under contract only to support our
              service.
            </p>

            <h3>Other users</h3>
            <p>
              Content you share publicly (posts, profile, public comments) is
              visible to others. Content you send via direct message or private
              call is accessible only to the parties involved and to us for the
              purposes described (e.g., routing, abuse detection), subject to
              applicable law.
            </p>

            <h3>Legal reasons</h3>
            <p>
              We may disclose data to comply with legal obligations, respond to
              lawful requests, or to protect rights, safety, or property.
            </p>

            <h3>Business transfers</h3>
            <p>
              In the event of acquisition, merger, or sale, we may transfer user
              data as part of the transaction. We will notify users where
              required by law.
            </p>
          </section>

          <section
            id="data-retention"
            data-section="data-retention"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>5. Data retention</h2>
            <p>
              We retain personal data only as long as necessary to provide the
              service and for legitimate business purposes such as legal
              compliance, dispute resolution, and security. Users can request
              deletion of their account which will remove or anonymize personal
              data in accordance with our retention schedule.
            </p>
          </section>

          <section
            id="security"
            data-section="security"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>6. Security</h2>
            <p>
              We use administrative, technical, and physical safeguards designed
              to protect your data. For real-time communications we use industry
              standard transport encryption (TLS) and, where feasible,
              end-to-end encryption for 1:1 conversations. No system is
              perfectly secure — if you suspect an account compromise, contact
              us immediately.
            </p>
          </section>

          <section
            id="your-rights"
            data-section="your-rights"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>7. Your rights</h2>
            <p>
              Depending on your jurisdiction, you may have rights such as
              access, correction, deletion, portability, and objection to
              certain processing. To exercise these rights, contact us at the
              address below and we will respond in accordance with applicable
              law.
            </p>
            <ul>
              <li>
                Access: Request a copy of personal data we hold about you.
              </li>
              <li>
                Deletion: Request deletion of your account and associated
                personal data.
              </li>
              <li>
                Portability: Request a machine-readable export of your content
                and profile.
              </li>
              <li>
                Opt-out: Turn off targeted marketing communications in account
                settings.
              </li>
            </ul>
          </section>

          <section
            id="children"
            data-section="children"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>8. Children</h2>
            <p>
              Our service is not intended for children under 13 (or a higher age
              where required). We do not knowingly collect personal data from
              children. If you believe a child has provided information, please
              contact us so we can delete it.
            </p>
          </section>

          <section
            id="cookies-and-tracking"
            data-section="cookies-and-tracking"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>9. Cookies & tracking</h2>
            <p>
              We use cookies and similar technologies to provide the service,
              remember preferences, and analyze usage. You can control cookies
              via browser settings; however disabling certain cookies may affect
              functionality.
            </p>
          </section>

          <section
            id="international-transfers"
            data-section="international-transfers"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>10. International transfers</h2>
            <p>
              Our servers and service providers may be located in multiple
              countries. By using the service you consent to transfer of your
              information to countries with different data protection laws. We
              implement safeguards such as standard contractual clauses where
              required.
            </p>
          </section>

          <section
            id="changes"
            data-section="changes"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>11. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. If changes are
              material we will provide prominent notice (e.g., in-app
              notification or email). The "Last updated" date will be shown at
              the top of the policy when displayed in-app.
            </p>
          </section>

          <section
            id="contact"
            data-section="contact"
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          >
            <h2>12. Contact</h2>
            <p>
              If you have questions or requests regarding your privacy, please
              contact us at:
            </p>
            <address>
              <strong>Privacy Team - IGotMessage</strong>
              <br />
              <a href="mailto:jhaa50872@gmail.com">
                jhaa50872@gmail.com
              </a>
            </address>

            <p className="mt-4 text-sm text-[var(--textColor)] ">
              This Privacy Policy was drafted to be clear and
              developer-friendly. It is provided for general informational
              purposes and does not constitute legal advice. Consider a review
              by legal counsel to confirm compliance with specific laws (GDPR,
              CCPA, etc.) that apply to your service.
            </p>
          </section>
        </motion.article>
      </div>
    </div>
  );
}
