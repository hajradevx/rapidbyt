<script setup lang="ts">
useSeoMeta({
  title: "Privacy Policy — RapidByt",
  description: "Learn how RapidByt collects, uses, and protects your personal information.",
  ogTitle: "Privacy Policy — RapidByt",
  ogDescription: "Learn how RapidByt collects, uses, and protects your personal information.",
  ogImage: "https://rapidbyt.com/og-image.png",
});

useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/privacy" }],
});

const linkClass = "text-primary underline underline-offset-2 hover:no-underline";
</script>

<template>
  <UContainer class="py-16">
    <UPageHeader
      title="Privacy Policy"
      description="Last updated: September 2026"
      :ui="{ title: 'font-black' }"
    />

    <UPageBody class="space-y-6">
      <!-- 1 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="01" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">Information we collect</h2>
          </div>
        </template>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          We collect information you provide directly — such as your name, email address, and
          website URL when you submit a contact form or request a free diagnosis. We do not collect
          sensitive personal data.
        </p>
      </UPageCard>

      <!-- 2 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="02" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">How we use your information</h2>
          </div>
        </template>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          We use the information to respond to your inquiries, deliver our services, and send
          occasional updates about RapidByt. We do not sell or share your data with third parties
          for marketing purposes.
        </p>
      </UPageCard>

      <!-- 3 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="03" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">Data storage</h2>
          </div>
        </template>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Data is stored securely on Cloudflare infrastructure. We retain contact data only as long
          as necessary to fulfil the purpose it was collected for.
        </p>
      </UPageCard>

      <!-- 4 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="04" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">Cookies &amp; advertising</h2>
          </div>
        </template>

        <div class="space-y-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <p>We use cookies in the following ways:</p>

          <ul class="list-disc pl-5 space-y-3">
            <li>
              <strong class="text-zinc-900 dark:text-white">Session cookies</strong> — minimal
              cookies required for site authentication and functionality.
            </li>
            <li>
              <strong class="text-zinc-900 dark:text-white">Google AdSense</strong> — this site uses
              Google AdSense to display advertisements. Google uses cookies (including the
              DoubleClick cookie) to serve ads based on your prior visits to this and other
              websites. You can opt out of personalised advertising by visiting
              <ULink
                to="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener"
                :class="linkClass"
              >
                Google Ads Settings
              </ULink>
              or
              <ULink
                to="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener"
                :class="linkClass"
              >
                aboutads.info </ULink
              >.
            </li>
            <li>
              <strong class="text-zinc-900 dark:text-white">Analytics</strong> — we may use Google
              Analytics to understand how visitors use our site. This data is aggregated and
              anonymous.
            </li>
          </ul>

          <p>
            Third-party vendors, including Google, use cookies to serve ads based on your prior
            visits to our website or other websites. Google's use of advertising cookies enables it
            and its partners to serve ads to you based on your visit to our site and/or other sites
            on the Internet.
          </p>
        </div>
      </UPageCard>

      <!-- 5 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="05" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">Your rights (GDPR)</h2>
          </div>
        </template>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland,
          you have the right to access, correct, or delete your personal data. You may also object
          to or restrict certain processing. To exercise these rights, contact us at the email
          below.
        </p>
      </UPageCard>

      <!-- 6 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="06" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">Third-party links</h2>
          </div>
        </template>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Our website may contain links to third-party sites. We are not responsible for the privacy
          practices or content of those sites. We encourage you to review their privacy policies.
        </p>
      </UPageCard>

      <!-- 7 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="07" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">Children's privacy</h2>
          </div>
        </template>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Our services are not directed to children under 13. We do not knowingly collect personal
          information from children.
        </p>
      </UPageCard>

      <!-- 8 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="08" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">Changes to this policy</h2>
          </div>
        </template>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated date. Continued use of our site after changes constitutes acceptance.
        </p>
      </UPageCard>

      <!-- 9 -->
      <UPageCard variant="outline">
        <template #header>
          <div class="flex items-center gap-2">
            <UBadge label="09" variant="soft" color="primary" size="sm" />
            <h2 class="font-black text-zinc-900 dark:text-white">Contact</h2>
          </div>
        </template>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          For any privacy-related questions, email us at
          <ULink to="mailto:info.rapidbyt@gmail.com" :class="linkClass">
            info.rapidbyt@gmail.com </ULink
          >.
        </p>
      </UPageCard>
    </UPageBody>
  </UContainer>
</template>
