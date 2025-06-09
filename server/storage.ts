import { 
  curriculumRows, 
  standards,
  type CurriculumRow, 
  type InsertCurriculumRow,
  type Standard,
  type InsertStandard
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private curriculumRows: Map<number, CurriculumRow>;
  private standards: Map<number, Standard>;
  private currentCurriculumId: number;
  private currentStandardId: number;

  constructor() {
    this.curriculumRows = new Map();
    this.standards = new Map();
    this.currentCurriculumId = 1;
    this.currentStandardId = 1;
    
    // Initialize with default standards
    this.initializeStandards();
  }

  private initializeStandards() {
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

    defaultStandards.forEach(standard => {
      const id = this.currentStandardId++;
      const standardWithId: Standard = { ...standard, id };
      this.standards.set(id, standardWithId);
    });
  }

  async getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]> {
    return Array.from(this.curriculumRows.values()).filter(
      row => row.grade === grade && row.subject === subject
    );
  }

  async createCurriculumRow(insertRow: InsertCurriculumRow): Promise<CurriculumRow> {
    const id = this.currentCurriculumId++;
    const row: CurriculumRow = { 
      ...insertRow, 
      id,
      standards: insertRow.standards || []
    };
    this.curriculumRows.set(id, row);
    return row;
  }

  async updateCurriculumRow(id: number, updates: Partial<InsertCurriculumRow>): Promise<CurriculumRow> {
    const existingRow = this.curriculumRows.get(id);
    if (!existingRow) {
      throw new Error(`Curriculum row with id ${id} not found`);
    }
    
    const updatedRow: CurriculumRow = { ...existingRow, ...updates };
    this.curriculumRows.set(id, updatedRow);
    return updatedRow;
  }

  async deleteCurriculumRow(id: number): Promise<void> {
    if (!this.curriculumRows.has(id)) {
      throw new Error(`Curriculum row with id ${id} not found`);
    }
    this.curriculumRows.delete(id);
  }

  async getAllStandards(): Promise<Standard[]> {
    return Array.from(this.standards.values());
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    return Array.from(this.standards.values()).filter(
      standard => standard.category === category
    );
  }

  async createStandard(insertStandard: InsertStandard): Promise<Standard> {
    const id = this.currentStandardId++;
    const standard: Standard = { ...insertStandard, id };
    this.standards.set(id, standard);
    return standard;
  }
}

export const storage = new MemStorage();
