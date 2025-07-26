import { z } from "zod";

// Type definitions for our data models
export interface CurriculumRow {
  id: number;
  grade: string;
  subject: string;
  objectives: string;
  unitPacing: string;
  assessments: string;
  materialsAndDifferentiation: string;
  biblical: string;
  standards: string[];
  materials?: string;
  differentiator?: string;
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
  assessments: z.string(),
  materialsAndDifferentiation: z.string(),
  biblical: z.string(),
  standards: z.array(z.string()).default([]),
  materials: z.string().optional(),
  differentiator: z.string().optional(),
});

export const insertStandardSchema = z.object({
  code: z.string(),
  description: z.string(),
  category: z.string(),
});

export type InsertCurriculumRow = z.infer<typeof insertCurriculumRowSchema>;
export type InsertStandard = z.infer<typeof insertStandardSchema>;
