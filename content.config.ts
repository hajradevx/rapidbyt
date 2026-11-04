import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        updatedAt: z.string().optional(), // for dateModified in JSON-LD — separate from datePublished
        readTime: z.number(),
        category: z.string(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
      }),
    }),
  },
});
