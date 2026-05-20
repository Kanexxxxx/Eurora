import { z } from "zod";

export const coupleFieldsSchema = z.object({
  person1: z.string().min(2).max(50),
  person2: z.string().min(2).max(50),
  message: z.string().min(10).max(1000),
  music_url: z.string().url().optional().or(z.literal("")),
  relationship_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  theme: z.enum(["black-luxury", "neon-romance", "minimal-love", "velvet-dark"]),
  plan: z.enum(["basic", "premium"]),
});

export const coupleSchema = z.object({
  person1: z.string().min(2).max(50),
  person2: z.string().min(2).max(50),
  message: z.string().min(10).max(1000),
  music_url: z.string().url().optional().or(z.literal("")),
  relationship_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  theme: z.enum(["black-luxury", "neon-romance", "minimal-love", "velvet-dark"]),
  plan: z.enum(["basic", "premium"]),
  photo_urls: z.array(z.string().url()).min(1).max(10),
});

export const paymentWebhookSchema = z.object({
  action: z.string(),
  data: z.object({ id: z.string() }),
});

export type CoupleInput = z.infer<typeof coupleSchema>;
