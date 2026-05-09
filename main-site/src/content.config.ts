import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const robots = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/robots' }),
  schema: z.object({
    name: z.string(),
    season: z.number().int(),
    game: z.string().optional(),
    summary: z.string(),
    image: z.string().optional(),
    techBinderUrl: z.url().optional(),
    onshapeUrl: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().optional()
  })
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    summary: z.string(),
    location: z.string().optional(),
    image: z.string().optional(),
    signupUrl: z.url().optional(),
    category: z.enum(['camp', 'meeting', 'competition', 'outreach', 'other']).default('other'),
    featured: z.boolean().default(false),
    order: z.number().optional()
  })
});

export const collections = { robots, events };
