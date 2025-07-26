import { 
  type CurriculumRow, 
  type InsertCurriculumRow,
  type Standard,
  type InsertStandard
} from "@shared/schema";
import * as fs from 'fs/promises';
import * as path from 'path';
import * as lockfile from 'proper-lockfile';

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
}

interface DatabaseData {
  curriculumRows: CurriculumRow[];
  standards: Standard[];
  nextCurriculumId: number;
  nextStandardId: number;
}

export class JsonStorage implements IStorage {
  private dataPath: string;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private lastCacheTime = 0;
  
  constructor() {
    this.dataPath = path.join(process.cwd(), 'data.json');
    this.initializeData();
  }

  private async initializeData() {
    try {
      await fs.access(this.dataPath);
    } catch {
      // File doesn't exist, create it with default data
      const defaultData: DatabaseData = {
        curriculumRows: [
          {
            id: 1,
            grade: "KG",
            subject: "English",
            objectives: "Students will identify letters and sounds",
            unitPacing: "Week 1-2",
            assessments: "",
            materialsAndDifferentiation: "",
            biblical: "",
            standards: ["RF.K.1", "RF.K.2"]
          }
        ],
        standards: [
          // Visual Arts Standards
          { id: 1, code: "VA:Cr2.1.Ka", description: "Through experimentation, build skills in various media and approaches to art-making.", category: "Visual Arts" },
          { id: 2, code: "VA:Re7.1.Ka", description: "Identify uses of art within one's personal environment.", category: "Visual Arts" },
          { id: 3, code: "VA:Cn10.1.Ka", description: "Create art that tells a story about a life experience.", category: "Visual Arts" },
          // Reading Foundational Skills
          { id: 4, code: "RF.K.1", description: "Demonstrate understanding of the organization and basic features of print.", category: "Reading Foundational Skills" },
          { id: 5, code: "RF.K.2", description: "Demonstrate understanding of spoken words, syllables, and sounds (phonemes).", category: "Reading Foundational Skills" },
          { id: 6, code: "RF.K.3", description: "Know and apply grade-level phonics and word analysis skills in decoding words.", category: "Reading Foundational Skills" },
          // Speaking and Listening
          { id: 7, code: "SL.K.1", description: "Participate in collaborative conversations with diverse partners about kindergarten topics and texts.", category: "Speaking and Listening" },
          { id: 8, code: "SL.K.2", description: "Confirm understanding of a text read aloud or information presented orally or through other media.", category: "Speaking and Listening" },
        ],
        nextCurriculumId: 2,
        nextStandardId: 9
      };
      await this.saveData(defaultData);
    }
  }

  private async loadData(): Promise<DatabaseData> {
    const now = Date.now();
    
    // Check cache first
    if (this.cache.has('data') && (now - this.lastCacheTime) < this.cacheTimeout) {
      return this.cache.get('data');
    }
    
    try {
      const fileContent = await fs.readFile(this.dataPath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      // Update cache
      this.cache.set('data', data);
      this.lastCacheTime = now;
      
      return data;
    } catch (error) {
      console.error('Error loading data:', error);
      throw new Error('Failed to load data from JSON file');
    }
  }

  private async saveData(data: DatabaseData): Promise<void> {
    try {
      // Acquire file lock
      const release = await lockfile.lock(this.dataPath, { 
        retries: { retries: 5, factor: 3, minTimeout: 1000, maxTimeout: 5000 }
      });
      
      try {
        await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2), 'utf-8');
        
        // Update cache
        this.cache.set('data', data);
        this.lastCacheTime = Date.now();
      } finally {
        await release();
      }
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data to JSON file');
    }
  }

  async getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]> {
    const data = await this.loadData();
    return data.curriculumRows.filter(row => row.grade === grade && row.subject === subject);
  }

  async getAllCurriculumRows(): Promise<CurriculumRow[]> {
    const data = await this.loadData();
    return data.curriculumRows;
  }

  async importFullDatabase(data: { curriculumRows: CurriculumRow[]; standards: Standard[]; metadata: any }): Promise<void> {
    try {
      // Calculate the next IDs
      const nextCurriculumId = Math.max(...data.curriculumRows.map(row => row.id), 0) + 1;
      const nextStandardId = Math.max(...data.standards.map(standard => standard.id), 0) + 1;
      
      const newData: DatabaseData = {
        curriculumRows: data.curriculumRows,
        standards: data.standards,
        nextCurriculumId,
        nextStandardId
      };
      
      // Save the new data
      await this.saveData(newData);
      
      // Clear the cache to force reload
      this.cache.clear();
      this.lastCacheTime = 0;
      
      console.log(`Database imported successfully: ${data.curriculumRows.length} curriculum rows, ${data.standards.length} standards`);
    } catch (error) {
      console.error('Error importing database:', error);
      throw new Error('Failed to import database');
    }
  }

  async createCurriculumRow(insertRow: InsertCurriculumRow): Promise<CurriculumRow> {
    const data = await this.loadData();
    const newRow: CurriculumRow = {
      id: data.nextCurriculumId,
      ...insertRow
    };
    
    data.curriculumRows.push(newRow);
    data.nextCurriculumId++;
    
    await this.saveData(data);
    return newRow;
  }

  async updateCurriculumRow(id: number, updates: Partial<InsertCurriculumRow>): Promise<CurriculumRow> {
    const data = await this.loadData();
    const rowIndex = data.curriculumRows.findIndex(row => row.id === id);
    
    if (rowIndex === -1) {
      throw new Error(`Curriculum row with id ${id} not found`);
    }
    
    data.curriculumRows[rowIndex] = { ...data.curriculumRows[rowIndex], ...updates };
    // Debug log
    console.log('Updating row:', data.curriculumRows[rowIndex]);
    console.log('Full data before save:', JSON.stringify(data, null, 2));
    await this.saveData(data);
    
    return data.curriculumRows[rowIndex];
  }

  async deleteCurriculumRow(id: number): Promise<void> {
    const data = await this.loadData();
    const rowIndex = data.curriculumRows.findIndex(row => row.id === id);
    
    if (rowIndex === -1) {
      throw new Error(`Curriculum row with id ${id} not found`);
    }
    
    data.curriculumRows.splice(rowIndex, 1);
    await this.saveData(data);
  }

  async getAllStandards(): Promise<Standard[]> {
    const data = await this.loadData();
    return data.standards;
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    const data = await this.loadData();
    return data.standards.filter(standard => standard.category === category);
  }

  async createStandard(insertStandard: InsertStandard): Promise<Standard> {
    const data = await this.loadData();
    const newStandard: Standard = {
      id: data.nextStandardId,
      ...insertStandard
    };
    
    data.standards.push(newStandard);
    data.nextStandardId++;
    
    await this.saveData(data);
    return newStandard;
  }
}

export const storage = new JsonStorage();
