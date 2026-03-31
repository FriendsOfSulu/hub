import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

const isoDateTimeString = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,
    'Invalid ISO datetime string'
  )

export default defineContentConfig({
  collections: {
    bundle: defineCollection({
      type: 'page',
      source: 'bundles/**/*.md',
      schema: z.object({
        title: z.string(),
        packageName: z.string(),
        shortDescription: z.string(),
        license: z.string(),
        githubLink: z.string(),
        githubAvatar: z.string(),
        githubStars: z.number(),
        githubMaintainer: z.string(),
        totalDownloads: z.number(),
        latestRelease: z.string(),
        targetSuluVersion: z.string().optional(),
        lastRepositoryUpdate: isoDateTimeString.optional(),
        categories: z.array(z.string())
      })
    })
  }
})
