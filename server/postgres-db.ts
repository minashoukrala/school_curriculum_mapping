import { Pool, PoolClient } from 'pg';
import * as path from 'path';
import * as fs from 'fs/promises';
import { 
  type CurriculumRow, 
  type InsertCurriculumRow,
  type Standard,
  type InsertStandard,
  type SchoolYear,
  type NavigationTab,
  type DropdownItem,
  type TableConfig,
  type CreateNavigationTab,
  type UpdateNavigationTab,
  type CreateDropdownItem,
  type UpdateDropdownItem,
  type CreateTableConfig,
  type UpdateTableConfig
} from "@shared/schema";

export class PostgreSQLStorage {
  private pool: Pool;

  constructor() {
    // Get database configuration from environment variables
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'curriculum_crafter',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    console.log(`Connecting to PostgreSQL database: ${config.database} on ${config.host}:${config.port}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    
    this.pool = new Pool(config);
    this.initializeDatabase();
    
    console.log('PostgreSQL database initialized successfully');
  }

  private async initializeDatabase() {
    const client = await this.pool.connect();
    
    try {
      // Create curriculum_rows table
      await client.query(`
        CREATE TABLE IF NOT EXISTS curriculum_rows (
          id SERIAL PRIMARY KEY,
          grade TEXT NOT NULL,
          subject TEXT NOT NULL,
          objectives TEXT NOT NULL DEFAULT '',
          unit_pacing TEXT NOT NULL DEFAULT '',
          assessments TEXT NOT NULL DEFAULT '',
          materials_and_differentiation TEXT NOT NULL DEFAULT '',
          biblical TEXT NOT NULL DEFAULT '',
          materials TEXT NOT NULL DEFAULT '',
          differentiator TEXT NOT NULL DEFAULT '',
          table_name TEXT NOT NULL DEFAULT ''
        )
      `);

      // Create standards table
      await client.query(`
        CREATE TABLE IF NOT EXISTS standards (
          id SERIAL PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL
        )
      `);

      // Create curriculum_standards junction table for many-to-many relationship
      await client.query(`
        CREATE TABLE IF NOT EXISTS curriculum_standards (
          curriculum_id INTEGER NOT NULL,
          standard_code TEXT NOT NULL,
          PRIMARY KEY (curriculum_id, standard_code),
          FOREIGN KEY (curriculum_id) REFERENCES curriculum_rows(id) ON DELETE CASCADE,
          FOREIGN KEY (standard_code) REFERENCES standards(code) ON DELETE CASCADE
        )
      `);

      // Create indexes for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_curriculum_grade_subject 
        ON curriculum_rows(grade, subject)
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_standards_category 
        ON standards(category)
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_curriculum_standards_curriculum_id 
        ON curriculum_standards(curriculum_id)
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_curriculum_standards_standard_code 
        ON curriculum_standards(standard_code)
      `);

      // Create school_year table
      await client.query(`
        CREATE TABLE IF NOT EXISTS school_year (
          id SERIAL PRIMARY KEY,
          year TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default school year if table is empty
      const schoolYearCount = await client.query('SELECT COUNT(*) as count FROM school_year');
      if (parseInt(schoolYearCount.rows[0].count) === 0) {
        await client.query('INSERT INTO school_year (year) VALUES ($1)', ['2025-2026']);
      }

      // Create navigation_tabs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS navigation_tabs (
          id SERIAL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          display_name TEXT NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create dropdown_items table
      await client.query(`
        CREATE TABLE IF NOT EXISTS dropdown_items (
          id SERIAL PRIMARY KEY,
          tab_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          display_name TEXT NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tab_id) REFERENCES navigation_tabs(id) ON DELETE CASCADE
        )
      `);

      // Create table_configs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS table_configs (
          id SERIAL PRIMARY KEY,
          tab_id INTEGER NOT NULL,
          dropdown_id INTEGER NOT NULL,
          table_name TEXT NOT NULL,
          display_name TEXT NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tab_id) REFERENCES navigation_tabs(id) ON DELETE CASCADE,
          FOREIGN KEY (dropdown_id) REFERENCES dropdown_items(id) ON DELETE CASCADE
        )
      `);

      // Insert default navigation structure if tables are empty
      const tabCount = await client.query('SELECT COUNT(*) as count FROM navigation_tabs');
      if (parseInt(tabCount.rows[0].count) === 0) {
        await this.insertDefaultNavigationStructure(client);
      }

    } finally {
      client.release();
    }
  }

  // Added: Insert default navigation structure
  private async insertDefaultNavigationStructure(client: PoolClient) {
    // Insert default tabs
    const tabs = [
      { name: 'KG', displayName: 'KG', order: 0 },
      { name: 'Grade 1', displayName: 'Grade 1', order: 1 },
      { name: 'Grade 2', displayName: 'Grade 2', order: 2 },
      { name: 'Grade 3', displayName: 'Grade 3', order: 3 },
      { name: 'Grade 4', displayName: 'Grade 4', order: 4 },
      { name: 'Grade 5', displayName: 'Grade 5', order: 5 },
      { name: 'Grade 6', displayName: 'Grade 6', order: 6 },
      { name: 'Grade 7', displayName: 'Grade 7', order: 7 },
      { name: 'Grade 8', displayName: 'Grade 8', order: 8 },
      { name: 'Specialists', displayName: 'Specialists', order: 9 },
      { name: 'Admin', displayName: 'Admin', order: 10 }
    ];

    for (const tab of tabs) {
      await client.query(`
        INSERT INTO navigation_tabs (name, display_name, order_index, is_active) 
        VALUES ($1, $2, $3, $4)
      `, [tab.name, tab.displayName, tab.order, true]);
    }

    // Insert default dropdown items
    // Get tab IDs
    const tabIds = await client.query('SELECT id, name FROM navigation_tabs');
    const tabIdMap = new Map(tabIds.rows.map(t => [t.name, t.id]));

    // Default subjects for each grade
    const subjects = {
      'KG': ['Bible Study', 'Reading', 'Math', 'Science', 'Social Studies', 'Visual Art'],
      'Grade 1': ['Bible Study', 'Reading', 'Writing', 'Math', 'Social Studies', 'Science'],
      'Grade 2': ['Bible Study', 'Reading', 'Writing', 'Math', 'Social Studies', 'Science'],
      'Grade 3': ['Bible Study', 'Reading', 'Writing', 'Math', 'Social Studies', 'Science'],
      'Grade 4': ['Bible Study', 'Reading', 'Writing', 'Math', 'Social Studies', 'Science'],
      'Grade 5': ['Bible Study', 'Reading', 'Writing', 'Math', 'Social Studies', 'Science'],
      'Grade 6': ['Bible Study', 'English', 'Math', 'Science', 'History'],
      'Grade 7': ['Bible Study', 'English', 'Math', 'Science', 'History'],
      'Grade 8': ['Bible Study', 'English', 'Math', 'Science', 'History'],
      'Specialists': ['Art', 'Spanish', 'Music', 'Technology', 'PE'],
      'Admin': ['Database Export', 'Table Management']
    };

    for (const [tabName, subjectList] of Object.entries(subjects)) {
      const tabId = tabIdMap.get(tabName);
      if (tabId) {
        for (let index = 0; index < subjectList.length; index++) {
          await client.query(`
            INSERT INTO dropdown_items (tab_id, name, display_name, order_index, is_active) 
            VALUES ($1, $2, $3, $4, $5)
          `, [tabId, subjectList[index], subjectList[index], index, true]);
        }
      }
    }
  }

  // Curriculum rows methods
  async getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
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
          cr.table_name as "tableName",
          STRING_AGG(cs.standard_code, ',') as standards
        FROM curriculum_rows cr
        LEFT JOIN curriculum_standards cs ON cr.id = cs.curriculum_id
        WHERE cr.grade = $1 AND cr.subject = $2
        GROUP BY cr.id, cr.grade, cr.subject, cr.objectives, cr.unit_pacing, cr.assessments, 
                 cr.materials_and_differentiation, cr.biblical, cr.materials, cr.differentiator, cr.table_name
        ORDER BY cr.id
      `, [grade, subject]);
      
      return result.rows.map(row => ({
        id: row.id,
        grade: row.grade,
        subject: row.subject,
        objectives: row.objectives,
        unitPacing: row.unit_pacing,
        assessments: row.assessments,
        materialsAndDifferentiation: row.materials_and_differentiation,
        biblical: row.biblical,
        standards: row.standards ? row.standards.split(',') : [],
        materials: row.materials,
        differentiator: row.differentiator,
        tableName: row.tableName
      }));
    } finally {
      client.release();
    }
  }

  async getAllCurriculumRows(): Promise<CurriculumRow[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
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
          cr.table_name as "tableName",
          STRING_AGG(cs.standard_code, ',') as standards
        FROM curriculum_rows cr
        LEFT JOIN curriculum_standards cs ON cr.id = cs.curriculum_id
        GROUP BY cr.id, cr.grade, cr.subject, cr.objectives, cr.unit_pacing, cr.assessments, 
                 cr.materials_and_differentiation, cr.biblical, cr.materials, cr.differentiator, cr.table_name
        ORDER BY cr.grade, cr.subject, cr.id
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        grade: row.grade,
        subject: row.subject,
        objectives: row.objectives,
        unitPacing: row.unit_pacing,
        assessments: row.assessments,
        materialsAndDifferentiation: row.materials_and_differentiation,
        biblical: row.biblical,
        standards: row.standards ? row.standards.split(',') : [],
        materials: row.materials,
        differentiator: row.differentiator,
        tableName: row.tableName
      }));
    } finally {
      client.release();
    }
  }

  async createCurriculumRow(row: InsertCurriculumRow): Promise<CurriculumRow> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const result = await client.query(`
        INSERT INTO curriculum_rows (
          grade, subject, objectives, unit_pacing, assessments, 
          materials_and_differentiation, biblical, materials, differentiator, table_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        row.grade,
        row.subject,
        row.objectives,
        row.unitPacing,
        row.assessments,
        row.materialsAndDifferentiation,
        row.biblical,
        row.materials || '',
        row.differentiator || '',
        row.tableName || ''
      ]);

      const newId = result.rows[0].id;

      // Insert standards if provided
      if (row.standards && row.standards.length > 0) {
        for (const standardCode of row.standards) {
          await client.query(`
            INSERT INTO curriculum_standards (curriculum_id, standard_code) VALUES ($1, $2)
          `, [newId, standardCode]);
        }
      }

      await client.query('COMMIT');

      return {
        id: newId,
        grade: row.grade,
        subject: row.subject,
        objectives: row.objectives,
        unitPacing: row.unitPacing,
        assessments: row.assessments,
        materialsAndDifferentiation: row.materialsAndDifferentiation,
        biblical: row.biblical,
        standards: row.standards || [],
        materials: row.materials || '',
        differentiator: row.differentiator || '',
        tableName: row.tableName || ''
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateCurriculumRow(id: number, row: Partial<InsertCurriculumRow>): Promise<CurriculumRow> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Build dynamic update query
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (row.grade !== undefined) {
        updates.push(`grade = $${paramIndex++}`);
        values.push(row.grade);
      }
      if (row.subject !== undefined) {
        updates.push(`subject = $${paramIndex++}`);
        values.push(row.subject);
      }
      if (row.objectives !== undefined) {
        updates.push(`objectives = $${paramIndex++}`);
        values.push(row.objectives);
      }
      if (row.unitPacing !== undefined) {
        updates.push(`unit_pacing = $${paramIndex++}`);
        values.push(row.unitPacing);
      }
      if (row.assessments !== undefined) {
        updates.push(`assessments = $${paramIndex++}`);
        values.push(row.assessments);
      }
      if (row.materialsAndDifferentiation !== undefined) {
        updates.push(`materials_and_differentiation = $${paramIndex++}`);
        values.push(row.materialsAndDifferentiation);
      }
      if (row.biblical !== undefined) {
        updates.push(`biblical = $${paramIndex++}`);
        values.push(row.biblical);
      }
      if (row.materials !== undefined) {
        updates.push(`materials = $${paramIndex++}`);
        values.push(row.materials);
      }
      if (row.differentiator !== undefined) {
        updates.push(`differentiator = $${paramIndex++}`);
        values.push(row.differentiator);
      }
      if (row.tableName !== undefined) {
        updates.push(`table_name = $${paramIndex++}`);
        values.push(row.tableName || '');
      }

      // Only update curriculum_rows table if there are fields to update
      if (updates.length > 0) {
        values.push(id);
        const updateStmt = `
          UPDATE curriculum_rows 
          SET ${updates.join(', ')} 
          WHERE id = $${paramIndex}
        `;

        const result = await client.query(updateStmt, values);

        if (result.rowCount === 0) {
          throw new Error('Curriculum row not found');
        }
      } else {
        // If no curriculum fields to update, verify the row exists
        const checkResult = await client.query('SELECT id FROM curriculum_rows WHERE id = $1', [id]);
        if (checkResult.rowCount === 0) {
          throw new Error('Curriculum row not found');
        }
      }

      // Update standards if provided
      if (row.standards !== undefined) {
        // Delete existing standards
        await client.query('DELETE FROM curriculum_standards WHERE curriculum_id = $1', [id]);

        // Insert new standards
        if (row.standards.length > 0) {
          for (const standardCode of row.standards) {
            await client.query(`
              INSERT INTO curriculum_standards (curriculum_id, standard_code) VALUES ($1, $2)
            `, [id, standardCode]);
          }
        }
      }

      await client.query('COMMIT');

      // Return the updated row
      const getResult = await client.query(`
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
          cr.table_name as "tableName",
          STRING_AGG(cs.standard_code, ',') as standards
        FROM curriculum_rows cr
        LEFT JOIN curriculum_standards cs ON cr.id = cs.curriculum_id
        WHERE cr.id = $1
        GROUP BY cr.id, cr.grade, cr.subject, cr.objectives, cr.unit_pacing, cr.assessments, 
                 cr.materials_and_differentiation, cr.biblical, cr.materials, cr.differentiator, cr.table_name
      `, [id]);

      const updatedRow = getResult.rows[0];
      
      return {
        id: updatedRow.id,
        grade: updatedRow.grade,
        subject: updatedRow.subject,
        objectives: updatedRow.objectives,
        unitPacing: updatedRow.unit_pacing,
        assessments: updatedRow.assessments,
        materialsAndDifferentiation: updatedRow.materials_and_differentiation,
        biblical: updatedRow.biblical,
        standards: updatedRow.standards ? updatedRow.standards.split(',') : [],
        materials: updatedRow.materials,
        differentiator: updatedRow.differentiator,
        tableName: updatedRow.tableName
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteCurriculumRow(id: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('DELETE FROM curriculum_rows WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        throw new Error('Curriculum row not found');
      }
    } finally {
      client.release();
    }
  }

  // Standards methods
  async getAllStandards(): Promise<Standard[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('SELECT id, code, description, category FROM standards ORDER BY category, code');
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('SELECT id, code, description, category FROM standards WHERE category = $1 ORDER BY code', [category]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createStandard(standard: InsertStandard): Promise<Standard> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO standards (code, description, category) VALUES ($1, $2, $3)
        RETURNING id, code, description, category
      `, [standard.code, standard.description, standard.category]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Close database connection
  async close(): Promise<void> {
    await this.pool.end();
  }

  // Database operations
  async importFullDatabase(data: { 
    curriculumRows: CurriculumRow[]; 
    standards: Standard[]; 
    navigationTabs?: NavigationTab[];
    dropdownItems?: DropdownItem[];
    tableConfigs?: TableConfig[];
    schoolYear?: SchoolYear;
    metadata: any 
  }): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Clear existing data
      await client.query('DELETE FROM curriculum_standards');
      await client.query('DELETE FROM curriculum_rows');
      await client.query('DELETE FROM standards');
      
      // Clear navigation data if provided
      if (data.navigationTabs || data.dropdownItems || data.tableConfigs) {
        await client.query('DELETE FROM table_configs');
        await client.query('DELETE FROM dropdown_items');
        await client.query('DELETE FROM navigation_tabs');
      }

      // Insert navigation tabs if provided
      if (data.navigationTabs && data.navigationTabs.length > 0) {
        for (const tab of data.navigationTabs) {
          await client.query(`
            INSERT INTO navigation_tabs (id, name, display_name, order_index, is_active, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [tab.id, tab.name, tab.displayName, tab.order, tab.isActive, tab.createdAt, tab.updatedAt]);
        }
      }

      // Insert dropdown items if provided
      if (data.dropdownItems && data.dropdownItems.length > 0) {
        for (const item of data.dropdownItems) {
          await client.query(`
            INSERT INTO dropdown_items (id, tab_id, name, display_name, order_index, is_active, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [item.id, item.tabId, item.name, item.displayName, item.order, item.isActive, item.createdAt, item.updatedAt]);
        }
      }

      // Insert table configs if provided
      if (data.tableConfigs && data.tableConfigs.length > 0) {
        for (const config of data.tableConfigs) {
          await client.query(`
            INSERT INTO table_configs (id, tab_id, dropdown_id, table_name, display_name, order_index, is_active, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [config.id, config.tabId, config.dropdownId, config.tableName, config.displayName, config.order, config.isActive, config.createdAt, config.updatedAt]);
        }
      }

      // Update school year if provided
      if (data.schoolYear) {
        await client.query('DELETE FROM school_year');
        await client.query(`
          INSERT INTO school_year (id, year, updated_at) VALUES ($1, $2, $3)
        `, [data.schoolYear.id, data.schoolYear.year, data.schoolYear.updatedAt]);
      }

      // Insert standards
      for (const standard of data.standards) {
        await client.query(`
          INSERT INTO standards (id, code, description, category) VALUES ($1, $2, $3, $4)
        `, [standard.id, standard.code, standard.description, standard.category]);
      }

      // Insert curriculum rows
      for (const row of data.curriculumRows) {
        await client.query(`
          INSERT INTO curriculum_rows (
            id, grade, subject, objectives, unit_pacing, assessments, 
            materials_and_differentiation, biblical, materials, differentiator, table_name
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          row.id,
          row.grade,
          row.subject,
          row.objectives,
          row.unitPacing,
          row.assessments,
          row.materialsAndDifferentiation,
          row.biblical,
          row.materials || '',
          row.differentiator || '',
          row.tableName || ''
        ]);
      }

      // Insert curriculum-standards relationships
      for (const row of data.curriculumRows) {
        for (const standardCode of row.standards) {
          await client.query(`
            INSERT INTO curriculum_standards (curriculum_id, standard_code) VALUES ($1, $2)
          `, [row.id, standardCode]);
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Additional utility methods
  async getDatabaseStats(): Promise<{
    totalCurriculumRows: number;
    totalStandards: number;
    totalGrades: number;
    totalSubjects: number;
    totalCategories: number;
  }> {
    const client = await this.pool.connect();
    
    try {
      const curriculumCount = await client.query('SELECT COUNT(*) as count FROM curriculum_rows');
      const standardsCount = await client.query('SELECT COUNT(*) as count FROM standards');
      const gradesCount = await client.query('SELECT COUNT(DISTINCT grade) as count FROM curriculum_rows');
      const subjectsCount = await client.query('SELECT COUNT(DISTINCT subject) as count FROM curriculum_rows');
      const categoriesCount = await client.query('SELECT COUNT(DISTINCT category) as count FROM standards');

      return {
        totalCurriculumRows: parseInt(curriculumCount.rows[0].count),
        totalStandards: parseInt(standardsCount.rows[0].count),
        totalGrades: parseInt(gradesCount.rows[0].count),
        totalSubjects: parseInt(subjectsCount.rows[0].count),
        totalCategories: parseInt(categoriesCount.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  async getGrades(): Promise<string[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('SELECT DISTINCT grade FROM curriculum_rows ORDER BY grade');
      return result.rows.map(row => row.grade);
    } finally {
      client.release();
    }
  }

  async getSubjects(): Promise<string[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('SELECT DISTINCT subject FROM curriculum_rows ORDER BY subject');
      return result.rows.map(row => row.subject);
    } finally {
      client.release();
    }
  }

  async getSubjectsByGrade(grade: string): Promise<string[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('SELECT DISTINCT subject FROM curriculum_rows WHERE grade = $1 ORDER BY subject', [grade]);
      return result.rows.map(row => row.subject);
    } finally {
      client.release();
    }
  }

  async getStandardCategories(): Promise<string[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('SELECT DISTINCT category FROM standards ORDER BY category');
      return result.rows.map(row => row.category);
    } finally {
      client.release();
    }
  }

  async searchCurriculumRows(query: string): Promise<CurriculumRow[]> {
    const client = await this.pool.connect();
    
    try {
      const searchTerm = `%${query}%`;
      const result = await client.query(`
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
          STRING_AGG(cs.standard_code, ',') as standards
        FROM curriculum_rows cr
        LEFT JOIN curriculum_standards cs ON cr.id = cs.curriculum_id
        WHERE cr.objectives ILIKE $1 OR cr.assessments ILIKE $1 OR cr.materials_and_differentiation ILIKE $1 OR cr.biblical ILIKE $1
        GROUP BY cr.id, cr.grade, cr.subject, cr.objectives, cr.unit_pacing, cr.assessments, 
                 cr.materials_and_differentiation, cr.biblical, cr.materials, cr.differentiator
        ORDER BY cr.grade, cr.subject, cr.id
      `, [searchTerm]);
      
      return result.rows.map(row => ({
        id: row.id,
        grade: row.grade,
        subject: row.subject,
        objectives: row.objectives,
        unitPacing: row.unit_pacing,
        assessments: row.assessments,
        materialsAndDifferentiation: row.materials_and_differentiation,
        biblical: row.biblical,
        standards: row.standards ? row.standards.split(',') : [],
        materials: row.materials,
        differentiator: row.differentiator,
        tableName: row.table_name
      }));
    } finally {
      client.release();
    }
  }

  // School year methods
  async getSchoolYear(): Promise<SchoolYear> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query('SELECT id, year, updated_at as "updatedAt" FROM school_year ORDER BY id DESC LIMIT 1');
      
      if (result.rows.length === 0) {
        // If no school year exists, create a default one
        const insertResult = await client.query('INSERT INTO school_year (year) VALUES ($1) RETURNING id, year, updated_at as "updatedAt"', ['2025-2026']);
        
        return {
          id: insertResult.rows[0].id,
          year: insertResult.rows[0].year,
          updatedAt: insertResult.rows[0].updatedAt
        };
      }
      
      return {
        id: result.rows[0].id,
        year: result.rows[0].year,
        updatedAt: result.rows[0].updatedAt
      };
    } finally {
      client.release();
    }
  }

  async updateSchoolYear(year: string): Promise<SchoolYear> {
    const client = await this.pool.connect();
    
    try {
      // Delete all existing school year records (we only want one)
      await client.query('DELETE FROM school_year');
      
      // Insert the new school year
      const result = await client.query('INSERT INTO school_year (year) VALUES ($1) RETURNING id, year, updated_at as "updatedAt"', [year]);
      
      return {
        id: result.rows[0].id,
        year: result.rows[0].year,
        updatedAt: result.rows[0].updatedAt
      };
    } finally {
      client.release();
    }
  }

  // Navigation tab methods
  async getAllNavigationTabs(): Promise<NavigationTab[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, name, display_name as "displayName", order_index as "order", 
               is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
        FROM navigation_tabs 
        ORDER BY 
          CASE WHEN name = 'Admin' THEN 1 ELSE 0 END,
          order_index
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getActiveNavigationTabs(): Promise<NavigationTab[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, name, display_name as "displayName", order_index as "order", 
               is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
        FROM navigation_tabs 
        WHERE is_active = true
        ORDER BY 
          CASE WHEN name = 'Admin' THEN 1 ELSE 0 END,
          order_index
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getNavigationTabById(id: number): Promise<NavigationTab | null> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, name, display_name as "displayName", order_index as "order", 
               is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
        FROM navigation_tabs 
        WHERE id = $1
      `, [id]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  async createNavigationTab(data: CreateNavigationTab): Promise<NavigationTab> {
    const client = await this.pool.connect();
    
    try {
      // Prevent creating tabs with order 100 or higher (reserved for Admin)
      if (data.order >= 100) {
        throw new Error('Order index 100 and above are reserved for system tabs');
      }
      
      const result = await client.query(`
        INSERT INTO navigation_tabs (name, display_name, order_index, is_active)
        VALUES ($1, $2, $3, true)
        RETURNING id, name, display_name as "displayName", order_index as "order", 
                  is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
      `, [data.name, data.displayName, data.order]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateNavigationTab(id: number, data: UpdateNavigationTab): Promise<NavigationTab | null> {
    const client = await this.pool.connect();
    
    try {
      const current = await client.query('SELECT * FROM navigation_tabs WHERE id = $1', [id]);
      if (current.rows.length === 0) return null;
      
      // Prevent modification of Admin tab
      if (current.rows[0].name === 'Admin') {
        throw new Error('Cannot modify the Admin tab - it is system-managed');
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (data.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(data.name);
      }
      if (data.displayName !== undefined) {
        updates.push(`display_name = $${paramIndex++}`);
        values.push(data.displayName);
      }
      if (data.order !== undefined) {
        // Prevent setting order to 100 or higher (reserved for Admin)
        if (data.order >= 100) {
          throw new Error('Order index 100 and above are reserved for system tabs');
        }
        updates.push(`order_index = $${paramIndex++}`);
        values.push(data.order);
      }
      if (data.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(data.isActive);
      }

      if (updates.length === 0) return null;

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const stmt = `
        UPDATE navigation_tabs 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
      `;
      await client.query(stmt, values);

      return this.getNavigationTabById(id);
    } finally {
      client.release();
    }
  }

  async deleteNavigationTab(id: number): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      // Prevent deletion of Admin tab
      const tab = await client.query('SELECT name FROM navigation_tabs WHERE id = $1', [id]);
      if (tab.rows.length > 0 && tab.rows[0].name === 'Admin') {
        throw new Error('Cannot delete the Admin tab - it is system-managed');
      }
      
      await client.query('BEGIN');
      
      // 1. Get all dropdown items for this tab
      const dropdownItems = await client.query(`
        SELECT id FROM dropdown_items WHERE tab_id = $1
      `, [id]);
      
      // 2. For each dropdown item, get all table configs
      const tableConfigs: any[] = [];
      for (const dropdown of dropdownItems.rows) {
        const configs = await client.query(`
          SELECT table_name FROM table_configs WHERE dropdown_id = $1
        `, [dropdown.id]);
        tableConfigs.push(...configs.rows);
      }
      
      // 3. Delete all curriculum rows that belong to these table configs
      for (const config of tableConfigs) {
        await client.query(`
          DELETE FROM curriculum_rows WHERE table_name = $1
        `, [config.table_name]);
      }
      
      // 4. Delete all table configs for this tab's dropdown items
      await client.query(`
        DELETE FROM table_configs WHERE dropdown_id IN (
          SELECT id FROM dropdown_items WHERE tab_id = $1
        )
      `, [id]);
      
      // 5. Delete all dropdown items for this tab
      await client.query(`
        DELETE FROM dropdown_items WHERE tab_id = $1
      `, [id]);
      
      // 6. Finally, delete the navigation tab itself
      const result = await client.query('DELETE FROM navigation_tabs WHERE id = $1', [id]);
      
      await client.query('COMMIT');
      
      return result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Dropdown item methods
  async getDropdownItemsByTabId(tabId: number): Promise<DropdownItem[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, tab_id as "tabId", name, display_name as "displayName", order_index as "order",
               is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
        FROM dropdown_items 
        WHERE tab_id = $1 AND is_active = true
        ORDER BY order_index
      `, [tabId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getAllDropdownItems(): Promise<DropdownItem[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, tab_id as "tabId", name, display_name as "displayName", order_index as "order",
               is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
        FROM dropdown_items 
        ORDER BY tab_id, order_index
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createDropdownItem(data: CreateDropdownItem): Promise<DropdownItem> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO dropdown_items (tab_id, name, display_name, order_index, is_active)
        VALUES ($1, $2, $3, $4, true)
        RETURNING id, tab_id as "tabId", name, display_name as "displayName", order_index as "order",
                  is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
      `, [data.tabId, data.name, data.displayName, data.order]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateDropdownItem(id: number, data: UpdateDropdownItem): Promise<DropdownItem | null> {
    const client = await this.pool.connect();
    
    try {
      const current = await client.query('SELECT * FROM dropdown_items WHERE id = $1', [id]);
      if (current.rows.length === 0) return null;

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (data.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(data.name);
      }
      if (data.displayName !== undefined) {
        updates.push(`display_name = $${paramIndex++}`);
        values.push(data.displayName);
      }
      if (data.order !== undefined) {
        updates.push(`order_index = $${paramIndex++}`);
        values.push(data.order);
      }
      if (data.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(data.isActive);
      }

      if (updates.length === 0) return null;

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const stmt = `
        UPDATE dropdown_items 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
      `;
      await client.query(stmt, values);

      return this.getDropdownItemById(id);
    } finally {
      client.release();
    }
  }

  async deleteDropdownItem(id: number): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Get all table configs for this dropdown item
      const tableConfigs = await client.query(`
        SELECT table_name FROM table_configs WHERE dropdown_id = $1
      `, [id]);
      
      // 2. Delete all curriculum rows that belong to these table configs
      for (const config of tableConfigs.rows) {
        await client.query(`
          DELETE FROM curriculum_rows WHERE table_name = $1
        `, [config.table_name]);
      }
      
      // 3. Delete all table configs for this dropdown item
      await client.query(`
        DELETE FROM table_configs WHERE dropdown_id = $1
      `, [id]);
      
      // 4. Finally, delete the dropdown item itself
      const result = await client.query('DELETE FROM dropdown_items WHERE id = $1', [id]);
      
      await client.query('COMMIT');
      
      return result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getDropdownItemById(id: number): Promise<DropdownItem | null> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, tab_id as "tabId", name, display_name as "displayName", order_index as "order",
               is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
        FROM dropdown_items 
        WHERE id = $1
      `, [id]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  // Table config methods
  async getTableConfigsByDropdownId(dropdownId: number): Promise<TableConfig[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, tab_id as "tabId", dropdown_id as "dropdownId", table_name as "tableName", 
               display_name as "displayName", order_index as "order", is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt"
        FROM table_configs 
        WHERE dropdown_id = $1 AND is_active = true
        ORDER BY order_index
      `, [dropdownId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getAllTableConfigs(): Promise<TableConfig[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, tab_id as "tabId", dropdown_id as "dropdownId", table_name as "tableName", 
               display_name as "displayName", order_index as "order", is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt"
        FROM table_configs 
        ORDER BY tab_id, dropdown_id, order_index
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createTableConfig(data: CreateTableConfig): Promise<TableConfig> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO table_configs (tab_id, dropdown_id, table_name, display_name, order_index, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING id, tab_id as "tabId", dropdown_id as "dropdownId", table_name as "tableName",
                  display_name as "displayName", order_index as "order", is_active as "isActive",
                  created_at as "createdAt", updated_at as "updatedAt"
      `, [data.tabId, data.dropdownId, data.tableName, data.displayName, data.order]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateTableConfig(id: number, data: UpdateTableConfig): Promise<TableConfig | null> {
    const client = await this.pool.connect();
    
    try {
      const current = await client.query('SELECT * FROM table_configs WHERE id = $1', [id]);
      if (current.rows.length === 0) return null;

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (data.tableName !== undefined) {
        updates.push(`table_name = $${paramIndex++}`);
        values.push(data.tableName);
      }
      if (data.displayName !== undefined) {
        updates.push(`display_name = $${paramIndex++}`);
        values.push(data.displayName);
      }
      if (data.order !== undefined) {
        updates.push(`order_index = $${paramIndex++}`);
        values.push(data.order);
      }
      if (data.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(data.isActive);
      }

      if (updates.length === 0) return null;

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const stmt = `
        UPDATE table_configs 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
      `;
      await client.query(stmt, values);

      return this.getTableConfigById(id);
    } finally {
      client.release();
    }
  }

  async deleteTableConfig(id: number): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      // First, get the table config to know which table_name to delete
      const tableConfig = await this.getTableConfigById(id);
      if (!tableConfig) return false;
      
      await client.query('BEGIN');
      
      // Delete all curriculum rows that belong to this table
      const deleteCurriculumResult = await client.query(`
        DELETE FROM curriculum_rows 
        WHERE table_name = $1
      `, [tableConfig.tableName]);
      
      // Delete the table config itself
      const deleteTableConfigResult = await client.query('DELETE FROM table_configs WHERE id = $1', [id]);
      
      await client.query('COMMIT');
      
      return deleteTableConfigResult.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getTableConfigById(id: number): Promise<TableConfig | null> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT id, tab_id as "tabId", dropdown_id as "dropdownId", table_name as "tableName", 
               display_name as "displayName", order_index as "order", is_active as "isActive",
               created_at as "createdAt", updated_at as "updatedAt"
        FROM table_configs 
        WHERE id = $1
      `, [id]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  // Utility method to clean up orphaned curriculum rows
  async cleanupOrphanedCurriculumRows(): Promise<number> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        DELETE FROM curriculum_rows 
        WHERE table_name NOT IN (SELECT table_name FROM table_configs)
      `);
      return result.rowCount;
    } finally {
      client.release();
    }
  }
}
