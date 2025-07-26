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
  tableName?: string;
}

export interface Standard {
  id: number;
  code: string;
  description: string;
  category: string;
}

export interface SchoolYear {
  id: number;
  year: string;
  updatedAt: string;
}

// Added for table management feature
export interface NavigationTab {
  id: number;
  name: string;
  displayName: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DropdownItem {
  id: number;
  tabId: number;
  name: string;
  displayName: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TableConfig {
  id: number;
  tabId: number;
  dropdownId: number;
  tableName: string;
  displayName: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  tableName: z.string().optional(),
});

export const insertStandardSchema = z.object({
  code: z.string(),
  description: z.string(),
  category: z.string(),
});

// Added for school year feature
export const updateSchoolYearSchema = z.object({
  year: z.string().min(1, "School year is required"),
});

// Added for table management feature
export const createNavigationTabSchema = z.object({
  name: z.string().min(1, "Tab name is required"),
  displayName: z.string().min(1, "Display name is required"),
  order: z.number().int().min(0, "Order must be a positive integer"),
});

export const updateNavigationTabSchema = z.object({
  name: z.string().min(1, "Tab name is required").optional(),
  displayName: z.string().min(1, "Display name is required").optional(),
  order: z.number().int().min(0, "Order must be a positive integer").optional(),
  isActive: z.boolean().optional(),
});

export const createDropdownItemSchema = z.object({
  tabId: z.number().int().positive("Tab ID is required"),
  name: z.string().min(1, "Item name is required"),
  displayName: z.string().min(1, "Display name is required"),
  order: z.number().int().min(0, "Order must be a positive integer"),
});

export const updateDropdownItemSchema = z.object({
  name: z.string().min(1, "Item name is required").optional(),
  displayName: z.string().min(1, "Display name is required").optional(),
  order: z.number().int().min(0, "Order must be a positive integer").optional(),
  isActive: z.boolean().optional(),
});

export const createTableConfigSchema = z.object({
  tabId: z.number().int().positive("Tab ID is required"),
  dropdownId: z.number().int().positive("Dropdown ID is required"),
  tableName: z.string().min(1, "Table name is required"),
  displayName: z.string().min(1, "Display name is required"),
  order: z.number().int().min(0, "Order must be a positive integer"),
});

export const updateTableConfigSchema = z.object({
  tableName: z.string().min(1, "Table name is required").optional(),
  displayName: z.string().min(1, "Display name is required").optional(),
  order: z.number().int().min(0, "Order must be a positive integer").optional(),
  isActive: z.boolean().optional(),
});

export type InsertCurriculumRow = z.infer<typeof insertCurriculumRowSchema>;
export type InsertStandard = z.infer<typeof insertStandardSchema>;
export type UpdateSchoolYear = z.infer<typeof updateSchoolYearSchema>; // Added

// Added for table management feature
export type CreateNavigationTab = z.infer<typeof createNavigationTabSchema>;
export type UpdateNavigationTab = z.infer<typeof updateNavigationTabSchema>;
export type CreateDropdownItem = z.infer<typeof createDropdownItemSchema>;
export type UpdateDropdownItem = z.infer<typeof updateDropdownItemSchema>;
export type CreateTableConfig = z.infer<typeof createTableConfigSchema>;
export type UpdateTableConfig = z.infer<typeof updateTableConfigSchema>;
