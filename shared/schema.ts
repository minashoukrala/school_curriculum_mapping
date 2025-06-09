import { z } from "zod";

// Type definitions for our data models
export interface CurriculumRow {
  id: number;
  grade: string;
  subject: string;
  objectives: string;
  unitPacing: string;
  learningTargets: string;
  standards: string[];
}

export interface Standard {
  id: number;
  code: string;
  description: string;
  category: string;
}

// Zod schemas for validation
export const insertCurriculumRowSchema = z.object({
  grade: z.string(),
  subject: z.string(),
  objectives: z.string(),
  unitPacing: z.string(),
  learningTargets: z.string(),
  standards: z.array(z.string()).default([]),
});

export const insertStandardSchema = z.object({
  code: z.string(),
  description: z.string(),
  category: z.string(),
});

export type InsertCurriculumRow = z.infer<typeof insertCurriculumRowSchema>;
export type InsertStandard = z.infer<typeof insertStandardSchema>;
