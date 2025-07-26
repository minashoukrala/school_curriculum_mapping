import { 
  type CurriculumRow, 
  type InsertCurriculumRow,
  type Standard,
  type InsertStandard
} from "@shared/schema";
import * as fs from 'fs/promises';
import * as path from 'path';
import { sqliteStorage } from './db';

export interface IStorage {
  // Curriculum rows
  getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]>;
  getAllCurriculumRows(): Promise<CurriculumRow[]>;
  createCurriculumRow(row: InsertCurriculumRow): Promise<CurriculumRow>;
  updateCurriculumRow(id: number, row: Partial<InsertCurriculumRow>): Promise<CurriculumRow>;
  deleteCurriculumRow(id: number): Promise<void>;
  
  // Standards
  getAllStandards(): Promise<Standard[]>;
  getStandardsByCategory(category: string): Promise<Standard[]>;
  createStandard(standard: InsertStandard): Promise<Standard>;
  
  // Database operations
  importFullDatabase(data: { curriculumRows: CurriculumRow[]; standards: Standard[]; metadata: any }): Promise<void>;
  
  // Additional utility methods
  getDatabaseStats(): Promise<{
    totalCurriculumRows: number;
    totalStandards: number;
    totalGrades: number;
    totalSubjects: number;
    totalCategories: number;
  }>;
  getGrades(): Promise<string[]>;
  getSubjects(): Promise<string[]>;
  getSubjectsByGrade(grade: string): Promise<string[]>;
  getStandardCategories(): Promise<string[]>;
  searchCurriculumRows(query: string): Promise<CurriculumRow[]>;}

// SQLite Storage Implementation
export class SQLiteStorageAdapter implements IStorage {
  async getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]> {
    return sqliteStorage.getCurriculumRows(grade, subject);
  }

  async getAllCurriculumRows(): Promise<CurriculumRow[]> {
    return sqliteStorage.getAllCurriculumRows();
  }

  async createCurriculumRow(row: InsertCurriculumRow): Promise<CurriculumRow> {
    return sqliteStorage.createCurriculumRow(row);
  }

  async updateCurriculumRow(id: number, row: Partial<InsertCurriculumRow>): Promise<CurriculumRow> {
    return sqliteStorage.updateCurriculumRow(id, row);
  }

  async deleteCurriculumRow(id: number): Promise<void> {
    return sqliteStorage.deleteCurriculumRow(id);
  }

  async getAllStandards(): Promise<Standard[]> {
    return sqliteStorage.getAllStandards();
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    return sqliteStorage.getStandardsByCategory(category);
  }

  async createStandard(standard: InsertStandard): Promise<Standard> {
    return sqliteStorage.createStandard(standard);
  }

  async importFullDatabase(data: { curriculumRows: CurriculumRow[]; standards: Standard[]; metadata: any }): Promise<void> {
    return sqliteStorage.importFullDatabase(data);
  }

  // Additional utility methods
  async getDatabaseStats(): Promise<{
    totalCurriculumRows: number;
    totalStandards: number;
    totalGrades: number;
    totalSubjects: number;
    totalCategories: number;
  }> {
    return sqliteStorage.getDatabaseStats();
  }

  async getGrades(): Promise<string[]> {
    return sqliteStorage.getGrades();
  }

  async getSubjects(): Promise<string[]> {
    return sqliteStorage.getSubjects();
  }

  async getSubjectsByGrade(grade: string): Promise<string[]> {
    return sqliteStorage.getSubjectsByGrade(grade);
  }

  async getStandardCategories(): Promise<string[]> {
    return sqliteStorage.getStandardCategories();
  }

  async searchCurriculumRows(query: string): Promise<CurriculumRow[]> {
    return sqliteStorage.searchCurriculumRows(query);
  }
}

// Migration function to move data from JSON to SQLite
export async function migrateFromJsonToSQLite(): Promise<void> {
  try {
    const jsonPath = path.join(process.cwd(), 'data.json');
    
    // Check if JSON file exists
    try {
      await fs.access(jsonPath);
    } catch {
      console.log('No data.json file found, skipping migration');
      return;
    }

    // Read JSON data
    const jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    
    // Migrate to SQLite
    await sqliteStorage.migrateFromJson(jsonData);
    
    console.log('Migration from JSON to SQLite completed successfully');
    
    // Optionally backup the old JSON file
    const backupPath = path.join(process.cwd(), 'data.json.backup');
    await fs.copyFile(jsonPath, backupPath);
    console.log(`Original data.json backed up to ${backupPath}`);
    
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

// Export the SQLite storage instance
export const storage = new SQLiteStorageAdapter();
