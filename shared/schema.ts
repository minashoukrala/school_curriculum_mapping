import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const curriculumRows = pgTable("curriculum_rows", {
  id: serial("id").primaryKey(),
  grade: text("grade").notNull(),
  subject: text("subject").notNull(),
  objectives: text("objectives").notNull(),
  unitPacing: text("unit_pacing").notNull(),
  learningTargets: text("learning_targets").notNull(),
  standards: json("standards").$type<string[]>().notNull().default([]),
});

export const standards = pgTable("standards", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
});

export const insertCurriculumRowSchema = createInsertSchema(curriculumRows).omit({
  id: true,
});

export const insertStandardSchema = createInsertSchema(standards).omit({
  id: true,
});

export type InsertCurriculumRow = z.infer<typeof insertCurriculumRowSchema>;
export type CurriculumRow = typeof curriculumRows.$inferSelect;
export type InsertStandard = z.infer<typeof insertStandardSchema>;
export type Standard = typeof standards.$inferSelect;
