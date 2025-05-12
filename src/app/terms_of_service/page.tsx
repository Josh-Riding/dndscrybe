import { siteConfig } from "@/config/site";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground mb-12 text-sm">
        Effective Date: April 30, 2025
        <br />
        Last Updated: April 30, 2025
      </p>

      <Section title="1. Use of the Service">
        You may use the Service only in compliance with these Terms and all
        applicable local, state, national, and international laws, rules, and
        regulations. You must be at least 13 years old to use the Service.
      </Section>

      <Section title="2. User Content">
        You retain ownership of all content (including audio files,
        transcriptions, and summaries) you upload to or generate through the
        Service (&quot;User Content&quot;). By uploading User Content, you grant
        us a non-exclusive, limited license to process, store, and display the
        content as necessary to operate the Service.
        <br />
        <br />
        You affirm that you have the rights necessary to upload and process any
        content submitted. You may not upload or transmit content that:
        <ul className="mt-2 list-inside list-disc">
          <li>You do not have the legal right to share</li>
          <li>Is harmful, offensive, or abusive</li>
          <li>Violates any third-party rights or applicable laws</li>
        </ul>
        We reserve the right to remove content that violates these Terms.
      </Section>

      <Section title="3. Acceptable Use">
        You agree not to:
        <ul className="mt-2 list-inside list-disc">
          <li>
            Access or use the Service for unlawful or unauthorized purposes
          </li>
          <li>
            Attempt to interfere with or disrupt the integrity or performance of
            the Service
          </li>
          <li>
            Reverse engineer or attempt to extract the source code of the
            Service
          </li>
          <li>Upload malicious code, viruses, or other harmful software</li>
        </ul>
      </Section>

      <Section title="4. Accounts">
        If the Service offers account creation, you are responsible for
        maintaining the confidentiality of your login credentials and for all
        activity under your account. We reserve the right to suspend or
        terminate your account if you violate these Terms.
      </Section>

      <Section title="5. Service Availability & Modifications">
        We reserve the right to modify or discontinue the Service at any time
        without notice. While we aim for high availability, we do not guarantee
        uninterrupted access or error-free performance.
      </Section>

      <Section title="6. Disclaimers">
        The Service is provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of any kind. We do not guarantee the accuracy,
        reliability, or completeness of any transcription, summary, or content
        produced by the Service. You use the Service at your own risk.
      </Section>

      <Section title="7. Limitation of Liability">
        To the maximum extent permitted by law, we are not liable for any
        indirect, incidental, special, consequential, or punitive damages
        arising out of your access to or use of the Service.
      </Section>

      <Section title="8. Termination">
        We may suspend or terminate your access to the Service at any time, for
        any reason, including violation of these Terms. Upon termination, all
        rights granted to you will cease.
      </Section>

      <Section title="9. Governing Law">
        These Terms shall be governed by and construed in accordance with the
        laws of the State of {siteConfig.legalState}, without regard to its
        conflict of law provisions.
      </Section>

      <Section title="10. Changes to These Terms">
        We may update these Terms from time to time. We will notify you of
        material changes by posting the revised version on our website with an
        updated effective date. Continued use of the Service after such changes
        constitutes acceptance of the updated Terms.
      </Section>

      <Section title="11. Contact Us">
        If you have questions about these Terms, please contact us at:
        <br />
        <a href={`mailto:${siteConfig.contactEmail}`} className="underline">
          {siteConfig.contactEmail}
        </a>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
      <div className="text-muted-foreground text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
}
