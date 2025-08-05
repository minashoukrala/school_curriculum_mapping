import Database from 'better-sqlite3';
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

export class SQLiteStorage {
  private db: Database.Database;
  private dbPath: string;

  constructor() {
    // Use current working directory which definitely exists
    this.dbPath = path.join(process.cwd(), 'curriculum.db');
    this.db = new Database(this.dbPath);
    this.initializeDatabase();
    
    // Log database path for debugging
    console.log(`Database initialized at: ${this.dbPath}`);
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
        differentiator TEXT NOT NULL DEFAULT '',
        table_name TEXT NOT NULL DEFAULT ''
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

    // Create school_year table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS school_year (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default school year if table is empty
    const schoolYearCount = this.db.prepare('SELECT COUNT(*) as count FROM school_year').get() as { count: number };
    if (schoolYearCount.count === 0) {
      this.db.prepare('INSERT INTO school_year (year) VALUES (?)').run('2025-2026');
    }

    // Create navigation_tabs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS navigation_tabs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create dropdown_items table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS dropdown_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tab_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tab_id) REFERENCES navigation_tabs(id) ON DELETE CASCADE
      )
    `);

    // Create table_configs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS table_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tab_id INTEGER NOT NULL,
        dropdown_id INTEGER NOT NULL,
        table_name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tab_id) REFERENCES navigation_tabs(id) ON DELETE CASCADE,
        FOREIGN KEY (dropdown_id) REFERENCES dropdown_items(id) ON DELETE CASCADE
      )
    `);

    // Insert default navigation structure if tables are empty
    const tabCount = this.db.prepare('SELECT COUNT(*) as count FROM navigation_tabs').get() as { count: number };
    if (tabCount.count === 0) {
      this.insertDefaultNavigationStructure();
    }
  }

  // Added: Insert default navigation structure
  private insertDefaultNavigationStructure() {
    // Insert default tabs
    const insertTab = this.db.prepare(`
      INSERT INTO navigation_tabs (name, display_name, order_index, is_active) 
      VALUES (?, ?, ?, ?)
    `);

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

    tabs.forEach(tab => {
      insertTab.run(tab.name, tab.displayName, tab.order, 1);
    });

    // Insert default dropdown items
    const insertDropdown = this.db.prepare(`
      INSERT INTO dropdown_items (tab_id, name, display_name, order_index, is_active) 
      VALUES (?, ?, ?, ?, ?)
    `);

    // Get tab IDs
    const tabIds = this.db.prepare('SELECT id, name FROM navigation_tabs').all() as { id: number, name: string }[];
    const tabIdMap = new Map(tabIds.map(t => [t.name, t.id]));

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

    Object.entries(subjects).forEach(([tabName, subjectList]) => {
      const tabId = tabIdMap.get(tabName);
      if (tabId) {
        subjectList.forEach((subject, index) => {
          insertDropdown.run(tabId, subject, subject, index, 1);
        });
      }
    });
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
        cr.table_name as tableName,
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
      standards: row.standards ? row.standards.split(',') : [],
      materials: row.materials,
      differentiator: row.differentiator,
      tableName: row.tableName
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
        cr.table_name as tableName,
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
      standards: row.standards ? row.standards.split(',') : [],
      materials: row.materials,
      differentiator: row.differentiator,
      tableName: row.tableName
    }));
  }

  async createCurriculumRow(row: InsertCurriculumRow): Promise<CurriculumRow> {
    const insertStmt = this.db.prepare(`
      INSERT INTO curriculum_rows (
        grade, subject, objectives, unit_pacing, assessments, 
        materials_and_differentiation, biblical, materials, differentiator, table_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      row.differentiator || '',
      row.tableName || ''
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
      standards: row.standards || [],
      materials: row.materials || '',
      differentiator: row.differentiator || '',
      tableName: row.tableName || ''
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
    if (row.tableName !== undefined) {
      updates.push('table_name = ?');
      values.push(row.tableName || '');
    }

    // Only update curriculum_rows table if there are fields to update
    if (updates.length > 0) {
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
    } else {
      // If no curriculum fields to update, verify the row exists
      const checkStmt = this.db.prepare('SELECT id FROM curriculum_rows WHERE id = ?');
      const row = checkStmt.get(id);
      if (!row) {
        throw new Error('Curriculum row not found');
      }
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
        cr.table_name as tableName,
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
      standards: updatedRow.standards ? updatedRow.standards.split(',') : [],
      materials: updatedRow.materials,
      differentiator: updatedRow.differentiator,
      tableName: updatedRow.tableName
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
  async importFullDatabase(data: { 
    curriculumRows: CurriculumRow[]; 
    standards: Standard[]; 
    navigationTabs?: NavigationTab[];
    dropdownItems?: DropdownItem[];
    tableConfigs?: TableConfig[];
    schoolYear?: SchoolYear;
    metadata: any 
  }): Promise<void> {
    const transaction = this.db.transaction(() => {
      // Clear existing data
      this.db.prepare('DELETE FROM curriculum_standards').run();
      this.db.prepare('DELETE FROM curriculum_rows').run();
      this.db.prepare('DELETE FROM standards').run();
      
      // Clear navigation data if provided
      if (data.navigationTabs || data.dropdownItems || data.tableConfigs) {
        this.db.prepare('DELETE FROM table_configs').run();
        this.db.prepare('DELETE FROM dropdown_items').run();
        this.db.prepare('DELETE FROM navigation_tabs').run();
      }

      // Insert navigation tabs if provided
      if (data.navigationTabs && data.navigationTabs.length > 0) {
        const navigationTabStmt = this.db.prepare(`
          INSERT INTO navigation_tabs (id, name, display_name, order_index, is_active, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        for (const tab of data.navigationTabs) {
          navigationTabStmt.run(
            tab.id,
            tab.name,
            tab.displayName,
            tab.order,
            tab.isActive,
            tab.createdAt,
            tab.updatedAt
          );
        }
      }

      // Insert dropdown items if provided
      if (data.dropdownItems && data.dropdownItems.length > 0) {
        const dropdownItemStmt = this.db.prepare(`
          INSERT INTO dropdown_items (id, tab_id, name, display_name, order_index, is_active, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        for (const item of data.dropdownItems) {
          dropdownItemStmt.run(
            item.id,
            item.tabId,
            item.name,
            item.displayName,
            item.order,
            item.isActive,
            item.createdAt,
            item.updatedAt
          );
        }
      }

      // Insert table configs if provided
      if (data.tableConfigs && data.tableConfigs.length > 0) {
        const tableConfigStmt = this.db.prepare(`
          INSERT INTO table_configs (id, tab_id, dropdown_id, table_name, display_name, order_index, is_active, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        for (const config of data.tableConfigs) {
          tableConfigStmt.run(
            config.id,
            config.tabId,
            config.dropdownId,
            config.tableName,
            config.displayName,
            config.order,
            config.isActive,
            config.createdAt,
            config.updatedAt
          );
        }
      }

      // Update school year if provided
      if (data.schoolYear) {
        this.db.prepare('DELETE FROM school_year').run();
        const schoolYearStmt = this.db.prepare(`
          INSERT INTO school_year (id, year, updated_at) VALUES (?, ?, ?)
        `);
        schoolYearStmt.run(
          data.schoolYear.id,
          data.schoolYear.year,
          data.schoolYear.updatedAt
        );
      }

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
          materials_and_differentiation, biblical, materials, differentiator, table_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          row.differentiator || '',
          row.tableName || ''
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

  // School year methods
  async getSchoolYear(): Promise<SchoolYear> {
    const stmt = this.db.prepare('SELECT id, year, updated_at as updatedAt FROM school_year ORDER BY id DESC LIMIT 1');
    const row = stmt.get() as any;
    
    if (!row) {
      // If no school year exists, create a default one
      const insertStmt = this.db.prepare('INSERT INTO school_year (year) VALUES (?)');
      const result = insertStmt.run('2025-2026');
      
      return {
        id: result.lastInsertRowid as number,
        year: '2025-2026',
        updatedAt: new Date().toISOString()
      };
    }
    
    return {
      id: row.id,
      year: row.year,
      updatedAt: row.updatedAt
    };
  }

  async updateSchoolYear(year: string): Promise<SchoolYear> {
    // Delete all existing school year records (we only want one)
    this.db.prepare('DELETE FROM school_year').run();
    
    // Insert the new school year
    const stmt = this.db.prepare('INSERT INTO school_year (year) VALUES (?)');
    const result = stmt.run(year);
    
    return {
      id: result.lastInsertRowid as number,
      year: year,
      updatedAt: new Date().toISOString()
    };
  }

  // Added: Navigation tab methods
  async getAllNavigationTabs(): Promise<NavigationTab[]> {
    const stmt = this.db.prepare(`
      SELECT id, name, display_name as displayName, order_index as "order", 
             is_active as isActive, created_at as createdAt, updated_at as updatedAt
      FROM navigation_tabs 
      ORDER BY 
        CASE WHEN name = 'Admin' THEN 1 ELSE 0 END,
        order_index
    `);
    return stmt.all() as NavigationTab[];
  }

  async getActiveNavigationTabs(): Promise<NavigationTab[]> {
    const stmt = this.db.prepare(`
      SELECT id, name, display_name as displayName, order_index as "order", 
             is_active as isActive, created_at as createdAt, updated_at as updatedAt
      FROM navigation_tabs 
      WHERE is_active = 1
      ORDER BY 
        CASE WHEN name = 'Admin' THEN 1 ELSE 0 END,
        order_index
    `);
    return stmt.all() as NavigationTab[];
  }

  async getNavigationTabById(id: number): Promise<NavigationTab | null> {
    const stmt = this.db.prepare(`
      SELECT id, name, display_name as displayName, order_index as "order", 
             is_active as isActive, created_at as createdAt, updated_at as updatedAt
      FROM navigation_tabs 
      WHERE id = ?
    `);
    const result = stmt.get(id) as NavigationTab | undefined;
    return result || null;
  }

  async createNavigationTab(data: CreateNavigationTab): Promise<NavigationTab> {
    // Prevent creating tabs with order 100 or higher (reserved for Admin)
    if (data.order >= 100) {
      throw new Error('Order index 100 and above are reserved for system tabs');
    }
    
    const stmt = this.db.prepare(`
      INSERT INTO navigation_tabs (name, display_name, order_index, is_active)
      VALUES (?, ?, ?, 1)
    `);
    const result = stmt.run(data.name, data.displayName, data.order);
    
    return {
      id: result.lastInsertRowid as number,
      name: data.name,
      displayName: data.displayName,
      order: data.order,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateNavigationTab(id: number, data: UpdateNavigationTab): Promise<NavigationTab | null> {
    const current = this.db.prepare('SELECT * FROM navigation_tabs WHERE id = ?').get(id) as any;
    if (!current) return null;
    
    // Prevent modification of Admin tab
    if (current.name === 'Admin') {
      throw new Error('Cannot modify the Admin tab - it is system-managed');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.displayName !== undefined) {
      updates.push('display_name = ?');
      values.push(data.displayName);
    }
    if (data.order !== undefined) {
      // Prevent setting order to 100 or higher (reserved for Admin)
      if (data.order >= 100) {
        throw new Error('Order index 100 and above are reserved for system tabs');
      }
      updates.push('order_index = ?');
      values.push(data.order);
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(data.isActive ? 1 : 0);
    }

    if (updates.length === 0) return null;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE navigation_tabs 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);

    return this.getNavigationTabById(id);
  }

  async deleteNavigationTab(id: number): Promise<boolean> {
    // Prevent deletion of Admin tab
    const tab = this.db.prepare('SELECT name FROM navigation_tabs WHERE id = ?').get(id) as any;
    if (tab && tab.name === 'Admin') {
      throw new Error('Cannot delete the Admin tab - it is system-managed');
    }
    
    // Use a transaction to ensure all operations succeed or fail together
    const transaction = this.db.transaction(() => {
      // 1. Get all dropdown items for this tab
      const dropdownItems = this.db.prepare(`
        SELECT id FROM dropdown_items WHERE tab_id = ?
      `).all(id) as any[];
      
      // 2. For each dropdown item, get all table configs
      const tableConfigs: any[] = [];
      for (const dropdown of dropdownItems) {
        const configs = this.db.prepare(`
          SELECT table_name FROM table_configs WHERE dropdown_id = ?
        `).all(dropdown.id) as any[];
        tableConfigs.push(...configs);
      }
      
      // 3. Delete all curriculum rows that belong to these table configs
      for (const config of tableConfigs) {
        this.db.prepare(`
          DELETE FROM curriculum_rows WHERE table_name = ?
        `).run(config.table_name);
      }
      
      // 4. Delete all table configs for this tab's dropdown items
      this.db.prepare(`
        DELETE FROM table_configs WHERE dropdown_id IN (
          SELECT id FROM dropdown_items WHERE tab_id = ?
        )
      `).run(id);
      
      // 5. Delete all dropdown items for this tab
      this.db.prepare(`
        DELETE FROM dropdown_items WHERE tab_id = ?
      `).run(id);
      
      // 6. Finally, delete the navigation tab itself
      const result = this.db.prepare('DELETE FROM navigation_tabs WHERE id = ?').run(id);
      
      return {
        tabDeleted: result.changes,
        dropdownItemsDeleted: dropdownItems.length,
        tableConfigsDeleted: tableConfigs.length,
        curriculumRowsDeleted: tableConfigs.length // Each table config had at least one curriculum row
      };
    });
    
    const result = transaction();
    return result.tabDeleted > 0;
  }

  // Added: Dropdown item methods
  async getDropdownItemsByTabId(tabId: number): Promise<DropdownItem[]> {
    const stmt = this.db.prepare(`
      SELECT id, tab_id as tabId, name, display_name as displayName, order_index as "order",
             is_active as isActive, created_at as createdAt, updated_at as updatedAt
      FROM dropdown_items 
      WHERE tab_id = ? AND is_active = 1
      ORDER BY order_index
    `);
    return stmt.all(tabId) as DropdownItem[];
  }

  async getAllDropdownItems(): Promise<DropdownItem[]> {
    const stmt = this.db.prepare(`
      SELECT id, tab_id as tabId, name, display_name as displayName, order_index as "order",
             is_active as isActive, created_at as createdAt, updated_at as updatedAt
      FROM dropdown_items 
      ORDER BY tab_id, order_index
    `);
    return stmt.all() as DropdownItem[];
  }

  async createDropdownItem(data: CreateDropdownItem): Promise<DropdownItem> {
    const stmt = this.db.prepare(`
      INSERT INTO dropdown_items (tab_id, name, display_name, order_index, is_active)
      VALUES (?, ?, ?, ?, 1)
    `);
    const result = stmt.run(data.tabId, data.name, data.displayName, data.order);
    
    return {
      id: result.lastInsertRowid as number,
      tabId: data.tabId,
      name: data.name,
      displayName: data.displayName,
      order: data.order,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateDropdownItem(id: number, data: UpdateDropdownItem): Promise<DropdownItem | null> {
    const current = this.db.prepare('SELECT * FROM dropdown_items WHERE id = ?').get(id) as any;
    if (!current) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.displayName !== undefined) {
      updates.push('display_name = ?');
      values.push(data.displayName);
    }
    if (data.order !== undefined) {
      updates.push('order_index = ?');
      values.push(data.order);
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(data.isActive ? 1 : 0);
    }

    if (updates.length === 0) return null;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE dropdown_items 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);

    return this.getDropdownItemById(id);
  }

  async deleteDropdownItem(id: number): Promise<boolean> {
    // Use a transaction to ensure all operations succeed or fail together
    const transaction = this.db.transaction(() => {
      // 1. Get all table configs for this dropdown item
      const tableConfigs = this.db.prepare(`
        SELECT table_name FROM table_configs WHERE dropdown_id = ?
      `).all(id) as any[];
      
      // 2. Delete all curriculum rows that belong to these table configs
      for (const config of tableConfigs) {
        this.db.prepare(`
          DELETE FROM curriculum_rows WHERE table_name = ?
        `).run(config.table_name);
      }
      
      // 3. Delete all table configs for this dropdown item
      this.db.prepare(`
        DELETE FROM table_configs WHERE dropdown_id = ?
      `).run(id);
      
      // 4. Finally, delete the dropdown item itself
      const result = this.db.prepare('DELETE FROM dropdown_items WHERE id = ?').run(id);
      
      return {
        dropdownItemDeleted: result.changes,
        tableConfigsDeleted: tableConfigs.length,
        curriculumRowsDeleted: tableConfigs.length
      };
    });
    
    const result = transaction();
    return result.dropdownItemDeleted > 0;
  }

  async getDropdownItemById(id: number): Promise<DropdownItem | null> {
    const stmt = this.db.prepare(`
      SELECT id, tab_id as tabId, name, display_name as displayName, order_index as "order",
             is_active as isActive, created_at as createdAt, updated_at as updatedAt
      FROM dropdown_items 
      WHERE id = ?
    `);
    const row = stmt.get(id) as any;
    return row || null;
  }

  // Added: Table config methods
  async getTableConfigsByDropdownId(dropdownId: number): Promise<TableConfig[]> {
    const stmt = this.db.prepare(`
      SELECT id, tab_id as tabId, dropdown_id as dropdownId, table_name as tableName, 
             display_name as displayName, order_index as "order", is_active as isActive,
             created_at as createdAt, updated_at as updatedAt
      FROM table_configs 
      WHERE dropdown_id = ? AND is_active = 1
      ORDER BY order_index
    `);
    return stmt.all(dropdownId) as TableConfig[];
  }

  async getAllTableConfigs(): Promise<TableConfig[]> {
    const stmt = this.db.prepare(`
      SELECT id, tab_id as tabId, dropdown_id as dropdownId, table_name as tableName, 
             display_name as displayName, order_index as "order", is_active as isActive,
             created_at as createdAt, updated_at as updatedAt
      FROM table_configs 
      ORDER BY tab_id, dropdown_id, order_index
    `);
    return stmt.all() as TableConfig[];
  }

  async createTableConfig(data: CreateTableConfig): Promise<TableConfig> {
    const stmt = this.db.prepare(`
      INSERT INTO table_configs (tab_id, dropdown_id, table_name, display_name, order_index, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `);
    const result = stmt.run(data.tabId, data.dropdownId, data.tableName, data.displayName, data.order);
    
    return {
      id: result.lastInsertRowid as number,
      tabId: data.tabId,
      dropdownId: data.dropdownId,
      tableName: data.tableName,
      displayName: data.displayName,
      order: data.order,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateTableConfig(id: number, data: UpdateTableConfig): Promise<TableConfig | null> {
    const current = this.db.prepare('SELECT * FROM table_configs WHERE id = ?').get(id) as any;
    if (!current) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (data.tableName !== undefined) {
      updates.push('table_name = ?');
      values.push(data.tableName);
    }
    if (data.displayName !== undefined) {
      updates.push('display_name = ?');
      values.push(data.displayName);
    }
    if (data.order !== undefined) {
      updates.push('order_index = ?');
      values.push(data.order);
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(data.isActive ? 1 : 0);
    }

    if (updates.length === 0) return null;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE table_configs 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);

    return this.getTableConfigById(id);
  }

  async deleteTableConfig(id: number): Promise<boolean> {
    // First, get the table config to know which table_name to delete
    const tableConfig = await this.getTableConfigById(id);
    if (!tableConfig) return false;
    
    // Use a transaction to ensure both operations succeed or fail together
    const transaction = this.db.transaction(() => {
      // Delete all curriculum rows that belong to this table
      const deleteCurriculumStmt = this.db.prepare(`
        DELETE FROM curriculum_rows 
        WHERE table_name = ?
      `);
      const curriculumResult = deleteCurriculumStmt.run(tableConfig.tableName);
      
      // Delete the table config itself
      const deleteTableConfigStmt = this.db.prepare('DELETE FROM table_configs WHERE id = ?');
      const tableConfigResult = deleteTableConfigStmt.run(id);
      
      return {
        curriculumRowsDeleted: curriculumResult.changes,
        tableConfigDeleted: tableConfigResult.changes
      };
    });
    
    const result = transaction();
    return result.tableConfigDeleted > 0;
  }

  async getTableConfigById(id: number): Promise<TableConfig | null> {
    const stmt = this.db.prepare(`
      SELECT id, tab_id as tabId, dropdown_id as dropdownId, table_name as tableName, 
             display_name as displayName, order_index as "order", is_active as isActive,
             created_at as createdAt, updated_at as updatedAt
      FROM table_configs 
      WHERE id = ?
    `);
    const row = stmt.get(id) as any;
    return row || null;
  }

  // Utility method to clean up orphaned curriculum rows
  async cleanupOrphanedCurriculumRows(): Promise<number> {
    const stmt = this.db.prepare(`
      DELETE FROM curriculum_rows 
      WHERE table_name NOT IN (SELECT table_name FROM table_configs)
    `);
    const result = stmt.run();
    return result.changes;
  }
}

// Export singleton instance
export const sqliteStorage = new SQLiteStorage();