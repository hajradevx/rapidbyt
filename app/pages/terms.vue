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
  <UPage>
    <UContainer class="py-16 max-w-3xl">
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center"
          >
            <UIcon name="i-lucide-scroll-text" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h1 class="text-3xl font-black text-zinc-900 dark:text-white">Terms of Service</h1>
            <p class="text-sm text-zinc-400 dark:text-zinc-500">Last updated: September 2026</p>
          </div>
        </div>
        <USeparator />
      </div>

      <!-- Sections -->
      <div class="space-y-6">
        <!-- 1 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="01" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Acceptance of Terms</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            By accessing or using RapidByt services, you agree to be bound by these Terms of Service
            and our
            <ULink to="/privacy" class="text-primary font-medium">Privacy Policy</ULink>. If you do
            not agree, please do not use our services.
          </p>
        </UPageCard>

        <!-- 2 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="02" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Services</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            RapidByt provides website performance optimization, SEO, web application development,
            cloud infrastructure, security monitoring, and related digital services. Specific
            deliverables, timelines, and fees are agreed upon in writing before work begins. We
            reserve the right to modify or discontinue any service at any time with reasonable
            notice.
          </p>
        </UPageCard>

        <!-- 3 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="03" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Payments</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Fees for services are as listed on our website or as quoted in a written proposal.
            One-time services are invoiced upon project commencement. Monthly retainer services are
            billed in advance on a recurring basis. All fees are in US dollars unless otherwise
            stated. Payment is due within 7 days of invoice.
          </p>
        </UPageCard>

        <!-- 4 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="04" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Refund Policy</h2>
            </div>
          </template>
          <div class="space-y-4">
            <p class="text-zinc-500 dark:text-zinc-400">
              We stand behind our work. The following refund terms apply:
            </p>
            <div class="space-y-3">
              <div
                class="flex gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <UIcon
                  name="i-lucide-badge-dollar-sign"
                  class="w-5 h-5 text-sky-500 mt-0.5 shrink-0"
                />
                <div>
                  <p class="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-1">
                    One-time services (e.g. Accelerate — $100)
                  </p>
                  <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    If we fail to deliver the agreed deliverables within the agreed timeline, you
                    are entitled to a full refund. Refund requests must be submitted within 14 days
                    of the agreed delivery date. Refunds are not issued for completed and delivered
                    work that meets the agreed scope.
                  </p>
                </div>
              </div>
              <div
                class="flex gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <UIcon name="i-lucide-repeat" class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p class="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-1">
                    Monthly retainer (e.g. Scale — $150/month)
                  </p>
                  <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    You may cancel at any time before the next billing cycle with no penalty. We do
                    not offer prorated refunds for a billing period already in progress.
                  </p>
                </div>
              </div>
              <div
                class="flex gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <UIcon
                  name="i-lucide-shield-check"
                  class="w-5 h-5 text-indigo-500 mt-0.5 shrink-0"
                />
                <div>
                  <p class="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-1">
                    "Results or refund" guarantee
                  </p>
                  <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Where explicitly stated in a written service agreement, a results-based refund
                    applies only to the specific measurable outcomes defined in that agreement.
                    General improvement claims on our marketing materials do not constitute a
                    contractual guarantee.
                  </p>
                </div>
              </div>
            </div>
            <UAlert
              icon="i-lucide-mail"
              color="primary"
              variant="soft"
              title="Refund requests"
              description="Email info.rapidbyt@gmail.com with your invoice number and reason for the request."
            />
          </div>
        </UPageCard>

        <!-- 5 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="05" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Client Responsibilities</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            You are responsible for providing accurate information and timely access to systems,
            credentials, and assets necessary for us to deliver the service. You must ensure you
            have the rights to any content or assets shared with us. You must not use our services
            for any unlawful purpose.
          </p>
        </UPageCard>

        <!-- 6 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="06" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Intellectual Property</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            All custom deliverables (code, designs, content) become your property upon receipt of
            full payment. RapidByt retains the right to showcase completed work in its portfolio and
            use it as a case study unless otherwise agreed in writing.
          </p>
        </UPageCard>

        <!-- 7 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="07" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Confidentiality</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Both parties agree to keep confidential any sensitive business information, credentials,
            or proprietary data shared during the engagement. This obligation survives termination
            of the service relationship.
          </p>
        </UPageCard>

        <!-- 8 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="08" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Limitation of Liability</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            RapidByt is not liable for indirect, incidental, or consequential damages arising from
            the use of our services, including but not limited to loss of revenue, data, or business
            opportunities. Our total liability for any claim shall not exceed the total amount paid
            by you for the relevant service in the 3 months preceding the claim.
          </p>
        </UPageCard>

        <!-- 9 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="09" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Governing Law</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            These Terms are governed by applicable international commercial law. Any disputes will
            be resolved by good-faith negotiation. If unresolved, disputes will be submitted to
            binding arbitration.
          </p>
        </UPageCard>

        <!-- 10 -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="10" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Changes to These Terms</h2>
            </div>
          </template>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We may update these Terms from time to time. Continued use of our services after changes
            are posted constitutes your acceptance of the revised Terms.
          </p>
        </UPageCard>

        <!-- 11 — Contact -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge label="11" variant="soft" color="primary" size="sm" />
              <h2 class="font-black text-zinc-900 dark:text-white">Contact</h2>
            </div>
          </template>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-mail" class="w-5 h-5 text-zinc-400 shrink-0" />
            <p class="text-zinc-500 dark:text-zinc-400">
              Questions about these terms? Email us at
              <ULink href="mailto:info.rapidbyt@gmail.com" class="text-primary font-medium"
                >info.rapidbyt@gmail.com</ULink
              >.
            </p>
          </div>
        </UPageCard>
      </div>
    </UContainer>
  </UPage>
</template>
