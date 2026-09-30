<script setup lang="ts">
useSeoMeta({
  title: "Disclaimer — RapidByt",
  description:
    "Read the disclaimer for RapidByt covering results, third-party content, and professional advice.",
});
useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/disclaimer" }],
});
</script>

<template>
  <UContainer class="py-16 max-w-3xl">
    <h1 class="text-3xl font-black mb-2">Disclaimer</h1>
    <p class="text-muted text-sm mb-10">Last updated: September 2026</p>

    <div class="prose prose-zinc dark:prose-invert max-w-none space-y-8">
      <section>
        <h2>1. Results Disclaimer</h2>
        <p>
          The case studies, performance improvements, and results described on this website
          (including PageSpeed score increases, traffic growth, and load time reductions) reflect
          outcomes achieved for specific clients under specific circumstances. Individual results
          will vary depending on your website's existing infrastructure, hosting environment,
          content management system, third-party integrations, and other factors outside our
          control. We do not guarantee that you will achieve the same or similar results.
        </p>
      </section>

      <section>
        <h2>2. Professional Advice Disclaimer</h2>
        <p>
          The content published on this website — including blog posts, guides, checklists, and
          diagnostic results — is provided for general informational and educational purposes only.
          It does not constitute professional technical, legal, financial, or business advice. You
          should consult a qualified professional before making decisions based on information
          obtained from this site.
        </p>
      </section>

      <section>
        <h2>3. Diagnosis Tool Disclaimer</h2>
        <p>
          The free website diagnosis tool on this site uses data from the Google PageSpeed Insights
          API. Results are automated, point-in-time snapshots and may not fully represent your
          website's real-world performance across all devices, network conditions, and geographic
          locations. RapidByt is not responsible for decisions made based solely on automated
          diagnosis results.
        </p>
      </section>

      <section>
        <h2>4. Third-Party Links</h2>
        <p>
          Our website may contain links to external websites and resources. These links are provided
          for convenience only. RapidByt does not endorse, control, or accept responsibility for the
          content, privacy practices, or accuracy of any third-party site. Visiting linked sites is
          done entirely at your own risk.
        </p>
      </section>

      <section>
        <h2>5. Advertising Disclosure</h2>
        <p>
          This website displays advertisements served by Google AdSense and potentially other
          third-party advertising networks. These ads are clearly distinguishable from our own
          content. RapidByt does not control the content of third-party advertisements and is not
          responsible for the products, services, or claims made in those ads.
        </p>
        <p>
          Google and its partners may use cookies to serve ads based on your prior visits to this
          and other websites. You can opt out of personalised advertising at
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener"
            >Google Ads Settings</a
          >.
        </p>
      </section>

      <section>
        <h2>6. Accuracy of Information</h2>
        <p>
          We make every effort to ensure the information on this website is accurate and up to date.
          However, the web development and SEO landscape changes rapidly. Content may become
          outdated, and we cannot guarantee the accuracy, completeness, or timeliness of any
          information on this site. We reserve the right to update or remove content at any time
          without notice.
        </p>
      </section>

      <section>
        <h2>7. Affiliate Disclaimer</h2>
        <p>
          Some links on this site may be affiliate links, meaning we may earn a commission if you
          make a purchase through them at no additional cost to you. We only recommend tools and
          services we have used or thoroughly evaluated. Any affiliate relationship is disclosed
          where applicable.
        </p>
      </section>

      <section>
        <h2>8. Money-Back Guarantee</h2>
        <p>
          References to a "results or refund" guarantee on this website are subject to the specific
          terms agreed upon in your service contract. The refund guarantee applies only to defined
          deliverables outlined in writing before work begins. Please refer to our
          <NuxtLink to="/terms" class="text-sky-600 dark:text-sky-400 hover:underline"
            >Terms of Service</NuxtLink
          >
          for full details on refund eligibility and process.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          If you have questions about this disclaimer, please contact us at
          <a href="mailto:info.rapidbyt@gmail.com">info.rapidbyt@gmail.com</a>.
        </p>
      </section>
    </div>
  </UContainer>
</template>
