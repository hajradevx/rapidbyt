<script setup lang="ts">
useSeoMeta({
  title: "Terms of Service — RapidByt",
  description: "Read the terms and conditions governing the use of RapidByt services.",
  ogTitle: "Terms of Service — RapidByt",
  ogDescription: "Read the terms and conditions governing the use of RapidByt services.",
  ogImage: "https://rapidbyt.com/og-image.png",
});
useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/terms" }],
});
</script>

<template>
  <UContainer class="py-16 max-w-3xl">
    <h1 class="text-3xl font-black mb-2">Terms of Service</h1>
    <p class="text-muted text-sm mb-10">Last updated: September 2026</p>

    <div class="prose prose-zinc dark:prose-invert max-w-none space-y-8">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using RapidByt services, you agree to be bound by these Terms of Service
          and our <NuxtLink to="/privacy">Privacy Policy</NuxtLink>. If you do not agree, please do
          not use our services.
        </p>
      </section>

      <section>
        <h2>2. Services</h2>
        <p>
          RapidByt provides website performance optimization, SEO, web application development,
          cloud infrastructure, security monitoring, and related digital services. Specific
          deliverables, timelines, and fees are agreed upon in writing before work begins. We
          reserve the right to modify or discontinue any service at any time with reasonable notice.
        </p>
      </section>

      <section>
        <h2>3. Payments</h2>
        <p>
          Fees for services are as listed on our website or as quoted in a written proposal.
          One-time services are invoiced upon project commencement. Monthly retainer services are
          billed in advance on a recurring basis. All fees are in US dollars unless otherwise
          stated. Payment is due within 7 days of invoice.
        </p>
      </section>

      <section>
        <h2>4. Refund Policy</h2>
        <p>We stand behind our work. The following refund terms apply:</p>
        <ul>
          <li>
            <strong>One-time services (e.g. Accelerate package — $100):</strong> If we fail to
            deliver the agreed deliverables within the agreed timeline, you are entitled to a full
            refund. Refund requests must be submitted within 14 days of the agreed delivery date.
            Refunds are not issued for completed and delivered work that meets the agreed scope.
          </li>
          <li>
            <strong>Monthly retainer (e.g. Scale package — $150/month):</strong> You may cancel at
            any time before the next billing cycle with no penalty. We do not offer prorated refunds
            for a billing period already in progress.
          </li>
          <li>
            <strong>"Results or refund" guarantee:</strong> Where explicitly stated in a written
            service agreement, a results-based refund applies only to the specific measurable
            outcomes defined in that agreement. General improvement claims on our marketing
            materials do not constitute a contractual guarantee.
          </li>
        </ul>
        <p>
          To request a refund, email
          <a href="mailto:info.rapidbyt@gmail.com">info.rapidbyt@gmail.com</a>
          with your invoice number and reason for the request.
        </p>
      </section>

      <section>
        <h2>5. Client Responsibilities</h2>
        <p>
          You are responsible for providing accurate information and timely access to systems,
          credentials, and assets necessary for us to deliver the service. You must ensure you have
          the rights to any content or assets shared with us. You must not use our services for any
          unlawful purpose.
        </p>
      </section>

      <section>
        <h2>6. Intellectual Property</h2>
        <p>
          All custom deliverables (code, designs, content) become your property upon receipt of full
          payment. RapidByt retains the right to showcase completed work in its portfolio and use it
          as a case study unless otherwise agreed in writing.
        </p>
      </section>

      <section>
        <h2>7. Confidentiality</h2>
        <p>
          Both parties agree to keep confidential any sensitive business information, credentials,
          or proprietary data shared during the engagement. This obligation survives termination of
          the service relationship.
        </p>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          RapidByt is not liable for indirect, incidental, or consequential damages arising from the
          use of our services, including but not limited to loss of revenue, data, or business
          opportunities. Our total liability for any claim shall not exceed the total amount paid by
          you for the relevant service in the 3 months preceding the claim.
        </p>
      </section>

      <section>
        <h2>9. Governing Law</h2>
        <p>
          These Terms are governed by applicable international commercial law. Any disputes will be
          resolved by good-faith negotiation. If unresolved, disputes will be submitted to binding
          arbitration.
        </p>
      </section>

      <section>
        <h2>10. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of our services after changes
          are posted constitutes your acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions about these terms? Email us at
          <a href="mailto:info.rapidbyt@gmail.com">info.rapidbyt@gmail.com</a>.
        </p>
      </section>
    </div>
  </UContainer>
</template>
