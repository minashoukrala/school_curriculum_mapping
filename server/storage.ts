import { 
  curriculumRows, 
  standards,
  type CurriculumRow, 
  type InsertCurriculumRow,
  type Standard,
  type InsertStandard
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Curriculum rows
  getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]>;
  createCurriculumRow(row: InsertCurriculumRow): Promise<CurriculumRow>;
  updateCurriculumRow(id: number, row: Partial<InsertCurriculumRow>): Promise<CurriculumRow>;
  deleteCurriculumRow(id: number): Promise<void>;
  
  // Standards
  getAllStandards(): Promise<Standard[]>;
  getStandardsByCategory(category: string): Promise<Standard[]>;
  createStandard(standard: InsertStandard): Promise<Standard>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with default standards if they don't exist
    this.initializeStandards();
  }

  private async initializeStandards() {
    try {
      // Check if standards already exist
      const existingStandards = await db.select().from(standards).limit(1);
      if (existingStandards.length > 0) return;

      const defaultStandards: InsertStandard[] = [
        // Visual Arts Standards
        { code: "VA:Cr2.1.Ka", description: "Through experimentation, build skills in various media and approaches to art-making.", category: "Visual Arts" },
        { code: "VA:Re7.1.Ka", description: "Identify uses of art within one's personal environment.", category: "Visual Arts" },
        { code: "VA:Cn10.1.Ka", description: "Create art that tells a story about a life experience.", category: "Visual Arts" },
        
        // Reading Foundational Skills
        { code: "RF.K.1", description: "Demonstrate understanding of the organization and basic features of print.", category: "Reading Foundational Skills" },
        { code: "RF.K.2", description: "Demonstrate understanding of spoken words, syllables, and sounds (phonemes).", category: "Reading Foundational Skills" },
        { code: "RF.K.3", description: "Know and apply grade-level phonics and word analysis skills in decoding words.", category: "Reading Foundational Skills" },
      
      // Speaking and Listening
      { code: "SL.K.1", description: "Participate in collaborative conversations with diverse partners about kindergarten topics and texts.", category: "Speaking and Listening" },
      { code: "SL.K.2", description: "Confirm understanding of a text read aloud or information presented orally or through other media.", category: "Speaking and Listening" },
    ];

      // Insert standards into database
      await db.insert(standards).values(defaultStandards);
    } catch (error) {
      console.error('Error initializing standards:', error);
    }
  }

  async getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]> {
    return await db.select().from(curriculumRows)
      .where(and(eq(curriculumRows.grade, grade), eq(curriculumRows.subject, subject)));
  }

  async createCurriculumRow(insertRow: InsertCurriculumRow): Promise<CurriculumRow> {
    const [row] = await db.insert(curriculumRows).values(insertRow).returning();
    return row;
  }

  async updateCurriculumRow(id: number, updates: Partial<InsertCurriculumRow>): Promise<CurriculumRow> {
    const [row] = await db.update(curriculumRows)
      .set(updates)
      .where(eq(curriculumRows.id, id))
      .returning();
    
    if (!row) {
      throw new Error(`Curriculum row with id ${id} not found`);
    }
    
    return row;
  }

  async deleteCurriculumRow(id: number): Promise<void> {
    await db.delete(curriculumRows).where(eq(curriculumRows.id, id));
  }

  async getAllStandards(): Promise<Standard[]> {
    return await db.select().from(standards);
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    return await db.select().from(standards).where(eq(standards.category, category));
  }

  async createStandard(insertStandard: InsertStandard): Promise<Standard> {
    const [standard] = await db.insert(standards).values(insertStandard).returning();
    return standard;
  }
}

export const storage = new DatabaseStorage();
