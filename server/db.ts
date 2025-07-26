import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs/promises';
import { 
  type CurriculumRow, 
  type InsertCurriculumRow,
  type Standard,
  type InsertStandard
} from "@shared/schema";

export class SQLiteStorage {
  private db: Database.Database;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'curriculum.db');
    this.db = new Database(this.dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');

    // Create curriculum_rows table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS curriculum_rows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        grade TEXT NOT NULL,
        subject TEXT NOT NULL,
        objectives TEXT NOT NULL DEFAULT '',
        unit_pacing TEXT NOT NULL DEFAULT '',
        assessments TEXT NOT NULL DEFAULT '',
        materials_and_differentiation TEXT NOT NULL DEFAULT '',
        biblical TEXT NOT NULL DEFAULT '',
        materials TEXT NOT NULL DEFAULT '',
        differentiator TEXT NOT NULL DEFAULT ''
      )
    `);

    // Create standards table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS standards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL
      )
    `);

    // Create curriculum_standards junction table for many-to-many relationship
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS curriculum_standards (
        curriculum_id INTEGER NOT NULL,
        standard_code TEXT NOT NULL,
        PRIMARY KEY (curriculum_id, standard_code),
        FOREIGN KEY (curriculum_id) REFERENCES curriculum_rows(id) ON DELETE CASCADE,
        FOREIGN KEY (standard_code) REFERENCES standards(code) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_curriculum_grade_subject 
      ON curriculum_rows(grade, subject)
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_standards_category 
      ON standards(category)
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_curriculum_standards_curriculum_id 
      ON curriculum_standards(curriculum_id)
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_curriculum_standards_standard_code 
      ON curriculum_standards(standard_code)
    `);
  }

  // Curriculum rows methods
  async getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]> {
    const stmt = this.db.prepare(`
      SELECT 
        cr.id,
        cr.grade,
        cr.subject,
        cr.objectives,
        cr.unit_pacing,
        cr.assessments,
        cr.materials_and_differentiation,
        cr.biblical,
        cr.materials,
        cr.differentiator,
        GROUP_CONCAT(cs.standard_code) as standards
      FROM curriculum_rows cr
      LEFT JOIN curriculum_standards cs ON cr.id = cs.curriculum_id
      WHERE cr.grade = ? AND cr.subject = ?
      GROUP BY cr.id
      ORDER BY cr.id
    `);

    const rows = stmt.all(grade, subject) as any[];
    
    return rows.map(row => ({
      id: row.id,
      grade: row.grade,
      subject: row.subject,
      objectives: row.objectives,
      unitPacing: row.unit_pacing,
      assessments: row.assessments,
      materialsAndDifferentiation: row.materials_and_differentiation,
      biblical: row.biblical,
      standards: row.standards ? row.standards.split(',') : []
    }));
  }

  async getAllCurriculumRows(): Promise<CurriculumRow[]> {
    const stmt = this.db.prepare(`
      SELECT 
        cr.id,
        cr.grade,
        cr.subject,
        cr.objectives,
        cr.unit_pacing,
        cr.assessments,
        cr.materials_and_differentiation,
        cr.biblical,
        cr.materials,
        cr.differentiator,
        GROUP_CONCAT(cs.standard_code) as standards
      FROM curriculum_rows cr
      LEFT JOIN curriculum_standards cs ON cr.id = cs.curriculum_id
      GROUP BY cr.id
      ORDER BY cr.grade, cr.subject, cr.id
    `);

    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      grade: row.grade,
      subject: row.subject,
      objectives: row.objectives,
      unitPacing: row.unit_pacing,
      assessments: row.assessments,
      materialsAndDifferentiation: row.materials_and_differentiation,
      biblical: row.biblical,
      standards: row.standards ? row.standards.split(',') : []
    }));
  }

  async createCurriculumRow(row: InsertCurriculumRow): Promise<CurriculumRow> {
    const insertStmt = this.db.prepare(`
      INSERT INTO curriculum_rows (
        grade, subject, objectives, unit_pacing, assessments, 
        materials_and_differentiation, biblical, materials, differentiator
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      row.grade,
      row.subject,
      row.objectives,
      row.unitPacing,
      row.assessments,
      row.materialsAndDifferentiation,
      row.biblical,
      row.materials || '',
      row.differentiator || ''
    );

    const newId = result.lastInsertRowid as number;

    // Insert standards if provided
    if (row.standards && row.standards.length > 0) {
      const standardStmt = this.db.prepare(`
        INSERT INTO curriculum_standards (curriculum_id, standard_code) VALUES (?, ?)
      `);
      
      for (const standardCode of row.standards) {
        standardStmt.run(newId, standardCode);
      }
    }

    return {
      id: newId,
      grade: row.grade,
      subject: row.subject,
      objectives: row.objectives,
      unitPacing: row.unitPacing,
      assessments: row.assessments,
      materialsAndDifferentiation: row.materialsAndDifferentiation,
      biblical: row.biblical,
      standards: row.standards || []
    };
  }

  async updateCurriculumRow(id: number, row: Partial<InsertCurriculumRow>): Promise<CurriculumRow> {
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];

    if (row.grade !== undefined) {
      updates.push('grade = ?');
      values.push(row.grade);
    }
    if (row.subject !== undefined) {
      updates.push('subject = ?');
      values.push(row.subject);
    }
    if (row.objectives !== undefined) {
      updates.push('objectives = ?');
      values.push(row.objectives);
    }
    if (row.unitPacing !== undefined) {
      updates.push('unit_pacing = ?');
      values.push(row.unitPacing);
    }
    if (row.assessments !== undefined) {
      updates.push('assessments = ?');
      values.push(row.assessments);
    }
    if (row.materialsAndDifferentiation !== undefined) {
      updates.push('materials_and_differentiation = ?');
      values.push(row.materialsAndDifferentiation);
    }
    if (row.biblical !== undefined) {
      updates.push('biblical = ?');
      values.push(row.biblical);
    }
    if (row.materials !== undefined) {
      updates.push('materials = ?');
      values.push(row.materials);
    }
    if (row.differentiator !== undefined) {
      updates.push('differentiator = ?');
      values.push(row.differentiator);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const updateStmt = this.db.prepare(`
      UPDATE curriculum_rows 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);

    const result = updateStmt.run(...values);

    if (result.changes === 0) {
      throw new Error('Curriculum row not found');
    }

    // Update standards if provided
    if (row.standards !== undefined) {
      // Delete existing standards
      const deleteStmt = this.db.prepare('DELETE FROM curriculum_standards WHERE curriculum_id = ?');
      deleteStmt.run(id);

      // Insert new standards
      if (row.standards.length > 0) {
        const standardStmt = this.db.prepare(`
          INSERT INTO curriculum_standards (curriculum_id, standard_code) VALUES (?, ?)
        `);
        
        for (const standardCode of row.standards) {
          standardStmt.run(id, standardCode);
        }
      }
    }

    // Return the updated row
    const getStmt = this.db.prepare(`
      SELECT 
        cr.id,
        cr.grade,
        cr.subject,
        cr.objectives,
        cr.unit_pacing,
        cr.assessments,
        cr.materials_and_differentiation,
        cr.biblical,
        cr.materials,
        cr.differentiator,
        GROUP_CONCAT(cs.standard_code) as standards
      FROM curriculum_rows cr
      LEFT JOIN curriculum_standards cs ON cr.id = cs.curriculum_id
      WHERE cr.id = ?
      GROUP BY cr.id
    `);

    const updatedRow = getStmt.get(id) as any;
    
    return {
      id: updatedRow.id,
      grade: updatedRow.grade,
      subject: updatedRow.subject,
      objectives: updatedRow.objectives,
      unitPacing: updatedRow.unit_pacing,
      assessments: updatedRow.assessments,
      materialsAndDifferentiation: updatedRow.materials_and_differentiation,
      biblical: updatedRow.biblical,
      standards: updatedRow.standards ? updatedRow.standards.split(',') : []
    };
  }

  async deleteCurriculumRow(id: number): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM curriculum_rows WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      throw new Error('Curriculum row not found');
    }
  }

  // Standards methods
  async getAllStandards(): Promise<Standard[]> {
    const stmt = this.db.prepare('SELECT id, code, description, category FROM standards ORDER BY category, code');
    return stmt.all() as Standard[];
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    const stmt = this.db.prepare('SELECT id, code, description, category FROM standards WHERE category = ? ORDER BY code');
    return stmt.all(category) as Standard[];
  }

  async createStandard(standard: InsertStandard): Promise<Standard> {
    const stmt = this.db.prepare(`
      INSERT INTO standards (code, description, category) VALUES (?, ?, ?)
    `);

    const result = stmt.run(standard.code, standard.description, standard.category);
    
    return {
      id: result.lastInsertRowid as number,
      code: standard.code,
      description: standard.description,
      category: standard.category
    };
  }

  // Database operations
  async importFullDatabase(data: { curriculumRows: CurriculumRow[]; standards: Standard[]; metadata: any }): Promise<void> {
    const transaction = this.db.transaction(() => {
      // Clear existing data
      this.db.prepare('DELETE FROM curriculum_standards').run();
      this.db.prepare('DELETE FROM curriculum_rows').run();
      this.db.prepare('DELETE FROM standards').run();

      // Insert standards
      const standardStmt = this.db.prepare(`
        INSERT INTO standards (id, code, description, category) VALUES (?, ?, ?, ?)
      `);
      
      for (const standard of data.standards) {
        standardStmt.run(standard.id, standard.code, standard.description, standard.category);
      }

      // Insert curriculum rows
      const curriculumStmt = this.db.prepare(`
        INSERT INTO curriculum_rows (
          id, grade, subject, objectives, unit_pacing, assessments, 
          materials_and_differentiation, biblical, materials, differentiator
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const row of data.curriculumRows) {
        curriculumStmt.run(
          row.id,
          row.grade,
          row.subject,
          row.objectives,
          row.unitPacing,
          row.assessments,
          row.materialsAndDifferentiation,
          row.biblical,
          row.materials || '',
          row.differentiator || ''
        );
      }

      // Insert curriculum-standards relationships
      const relationshipStmt = this.db.prepare(`
        INSERT INTO curriculum_standards (curriculum_id, standard_code) VALUES (?, ?)
      `);

      for (const row of data.curriculumRows) {
        for (const standardCode of row.standards) {
          relationshipStmt.run(row.id, standardCode);
        }
      }
    });

    transaction();
    console.log(`Database imported successfully: ${data.curriculumRows.length} curriculum rows, ${data.standards.length} standards`);
  }



  // Close database connection
  close(): void {
    this.db.close();
  }

  // Additional utility methods
  async getGrades(): Promise<string[]> {
    const stmt = this.db.prepare('SELECT DISTINCT grade FROM curriculum_rows ORDER BY grade');
    const rows = stmt.all() as any[];
    return rows.map(row => row.grade);
  }

  async getSubjects(): Promise<string[]> {
    const stmt = this.db.prepare('SELECT DISTINCT subject FROM curriculum_rows ORDER BY subject');
    const rows = stmt.all() as any[];
    return rows.map(row => row.subject);
  }

  async getSubjectsByGrade(grade: string): Promise<string[]> {
    const stmt = this.db.prepare('SELECT DISTINCT subject FROM curriculum_rows WHERE grade = ? ORDER BY subject');
    const rows = stmt.all(grade) as any[];
    return rows.map(row => row.subject);
  }

  async getStandardCategories(): Promise<string[]> {
    const stmt = this.db.prepare('SELECT DISTINCT category FROM standards ORDER BY category');
    const rows = stmt.all() as any[];
    return rows.map(row => row.category);
  }

  async searchCurriculumRows(query: string): Promise<CurriculumRow[]> {
    const searchTerm = `%${query}%`;
    const stmt = this.db.prepare(`
      SELECT 
        cr.id,
        cr.grade,
        cr.subject,
        cr.objectives,
        cr.unit_pacing,
        cr.assessments,
        cr.materials_and_differentiation,
        cr.biblical,
        cr.materials,
        cr.differentiator,
        GROUP_CONCAT(cs.standard_code) as standards
      FROM curriculum_rows cr
      LEFT JOIN curriculum_standards cs ON cr.id = cs.curriculum_id
      WHERE cr.objectives LIKE ? OR cr.assessments LIKE ? OR cr.materials_and_differentiation LIKE ? OR cr.biblical LIKE ?
      GROUP BY cr.id
      ORDER BY cr.grade, cr.subject, cr.id
    `);

    const rows = stmt.all(searchTerm, searchTerm, searchTerm, searchTerm) as any[];
    
    return rows.map(row => ({
      id: row.id,
      grade: row.grade,
      subject: row.subject,
      objectives: row.objectives,
      unitPacing: row.unit_pacing,
      assessments: row.assessments,
      materialsAndDifferentiation: row.materials_and_differentiation,
      biblical: row.biblical,
      standards: row.standards ? row.standards.split(',') : []
    }));
  }

  async getDatabaseStats(): Promise<{
    totalCurriculumRows: number;
    totalStandards: number;
    totalGrades: number;
    totalSubjects: number;
    totalCategories: number;
  }> {
    const curriculumCount = this.db.prepare('SELECT COUNT(*) as count FROM curriculum_rows').get() as any;
    const standardsCount = this.db.prepare('SELECT COUNT(*) as count FROM standards').get() as any;
    const gradesCount = this.db.prepare('SELECT COUNT(DISTINCT grade) as count FROM curriculum_rows').get() as any;
    const subjectsCount = this.db.prepare('SELECT COUNT(DISTINCT subject) as count FROM curriculum_rows').get() as any;
    const categoriesCount = this.db.prepare('SELECT COUNT(DISTINCT category) as count FROM standards').get() as any;

    return {
      totalCurriculumRows: curriculumCount.count,
      totalStandards: standardsCount.count,
      totalGrades: gradesCount.count,
      totalSubjects: subjectsCount.count,
      totalCategories: categoriesCount.count
    };
  }
}

// Export singleton instance
export const sqliteStorage = new SQLiteStorage();