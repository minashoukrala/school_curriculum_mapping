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
import { sqliteStorage } from './db';

export interface IStorage {
  // Curriculum methods
  getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]>;
  getAllCurriculumRows(): Promise<CurriculumRow[]>;
  createCurriculumRow(data: InsertCurriculumRow): Promise<CurriculumRow>;
  updateCurriculumRow(id: number, data: Partial<InsertCurriculumRow>): Promise<CurriculumRow>;
  deleteCurriculumRow(id: number): Promise<void>;

  // Standards methods
  getAllStandards(): Promise<Standard[]>;
  getStandardsByCategory(category: string): Promise<Standard[]>;
  createStandard(data: InsertStandard): Promise<Standard>;

  // Database operations
  importFullDatabase(data: { 
    curriculumRows: CurriculumRow[]; 
    standards: Standard[]; 
    navigationTabs?: NavigationTab[];
    dropdownItems?: DropdownItem[];
    tableConfigs?: TableConfig[];
    schoolYear?: SchoolYear;
    metadata: any 
  }): Promise<void>;

  // Additional utility methods
  getDatabaseStats(): Promise<{ totalCurriculumRows: number; totalStandards: number; totalGrades: number; totalSubjects: number; totalCategories: number }>;
  getGrades(): Promise<string[]>;
  getSubjects(): Promise<string[]>;
  getSubjectsByGrade(grade: string): Promise<string[]>;
  getStandardCategories(): Promise<string[]>;
  searchCurriculumRows(query: string): Promise<CurriculumRow[]>;

  // School year methods
  getSchoolYear(): Promise<SchoolYear>;
  updateSchoolYear(year: string): Promise<SchoolYear>;

  // Navigation tab methods
  getAllNavigationTabs(): Promise<NavigationTab[]>;
  getActiveNavigationTabs(): Promise<NavigationTab[]>;
  getNavigationTabById(id: number): Promise<NavigationTab | null>;
  createNavigationTab(data: CreateNavigationTab): Promise<NavigationTab>;
  updateNavigationTab(id: number, data: UpdateNavigationTab): Promise<NavigationTab | null>;
  deleteNavigationTab(id: number): Promise<boolean>;
  getNavigationTabById(id: number): Promise<NavigationTab | null>;

  // Dropdown item methods
  getDropdownItemsByTabId(tabId: number): Promise<DropdownItem[]>;
  getAllDropdownItems(): Promise<DropdownItem[]>;
  createDropdownItem(data: CreateDropdownItem): Promise<DropdownItem>;
  updateDropdownItem(id: number, data: UpdateDropdownItem): Promise<DropdownItem | null>;
  deleteDropdownItem(id: number): Promise<boolean>;
  getDropdownItemById(id: number): Promise<DropdownItem | null>;

  // Table config methods
  getTableConfigsByDropdownId(dropdownId: number): Promise<TableConfig[]>;
  getAllTableConfigs(): Promise<TableConfig[]>;
  createTableConfig(data: CreateTableConfig): Promise<TableConfig>;
  updateTableConfig(id: number, data: UpdateTableConfig): Promise<TableConfig | null>;
  deleteTableConfig(id: number): Promise<boolean>;
  getTableConfigById(id: number): Promise<TableConfig | null>;
}

export class SQLiteStorageAdapter implements IStorage {
  // Curriculum methods
  async getCurriculumRows(grade: string, subject: string): Promise<CurriculumRow[]> {
    return sqliteStorage.getCurriculumRows(grade, subject);
  }

  async getAllCurriculumRows(): Promise<CurriculumRow[]> {
    return sqliteStorage.getAllCurriculumRows();
  }

  async createCurriculumRow(data: InsertCurriculumRow): Promise<CurriculumRow> {
    return sqliteStorage.createCurriculumRow(data);
  }

  async updateCurriculumRow(id: number, data: Partial<InsertCurriculumRow>): Promise<CurriculumRow> {
    return sqliteStorage.updateCurriculumRow(id, data);
  }

  async deleteCurriculumRow(id: number): Promise<void> {
    return sqliteStorage.deleteCurriculumRow(id);
  }

  // Standards methods
  async getAllStandards(): Promise<Standard[]> {
    return sqliteStorage.getAllStandards();
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    return sqliteStorage.getStandardsByCategory(category);
  }

  async createStandard(data: InsertStandard): Promise<Standard> {
    return sqliteStorage.createStandard(data);
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
    return sqliteStorage.importFullDatabase(data);
  }

  // Additional utility methods
  async getDatabaseStats(): Promise<{ totalCurriculumRows: number; totalStandards: number; totalGrades: number; totalSubjects: number; totalCategories: number }> {
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

  // School year methods
  async getSchoolYear(): Promise<SchoolYear> {
    return sqliteStorage.getSchoolYear();
  }

  async updateSchoolYear(year: string): Promise<SchoolYear> {
    return sqliteStorage.updateSchoolYear(year);
  }

  // Navigation tab methods
  async getAllNavigationTabs(): Promise<NavigationTab[]> {
    return sqliteStorage.getAllNavigationTabs();
  }

  async getActiveNavigationTabs(): Promise<NavigationTab[]> {
    return sqliteStorage.getActiveNavigationTabs();
  }

  async getNavigationTabById(id: number): Promise<NavigationTab | null> {
    return sqliteStorage.getNavigationTabById(id);
  }

  async createNavigationTab(data: CreateNavigationTab): Promise<NavigationTab> {
    return sqliteStorage.createNavigationTab(data);
  }

  async updateNavigationTab(id: number, data: UpdateNavigationTab): Promise<NavigationTab | null> {
    return sqliteStorage.updateNavigationTab(id, data);
  }

  async deleteNavigationTab(id: number): Promise<boolean> {
    return sqliteStorage.deleteNavigationTab(id);
  }

  // Dropdown item methods
  async getDropdownItemsByTabId(tabId: number): Promise<DropdownItem[]> {
    return sqliteStorage.getDropdownItemsByTabId(tabId);
  }

  async getAllDropdownItems(): Promise<DropdownItem[]> {
    return sqliteStorage.getAllDropdownItems();
  }

  async createDropdownItem(data: CreateDropdownItem): Promise<DropdownItem> {
    return sqliteStorage.createDropdownItem(data);
  }

  async updateDropdownItem(id: number, data: UpdateDropdownItem): Promise<DropdownItem | null> {
    return sqliteStorage.updateDropdownItem(id, data);
  }

  async deleteDropdownItem(id: number): Promise<boolean> {
    return sqliteStorage.deleteDropdownItem(id);
  }

  async getDropdownItemById(id: number): Promise<DropdownItem | null> {
    return sqliteStorage.getDropdownItemById(id);
  }

  // Table config methods
  async getTableConfigsByDropdownId(dropdownId: number): Promise<TableConfig[]> {
    return sqliteStorage.getTableConfigsByDropdownId(dropdownId);
  }

  async getAllTableConfigs(): Promise<TableConfig[]> {
    return sqliteStorage.getAllTableConfigs();
  }

  async createTableConfig(data: CreateTableConfig): Promise<TableConfig> {
    return sqliteStorage.createTableConfig(data);
  }

  async updateTableConfig(id: number, data: UpdateTableConfig): Promise<TableConfig | null> {
    return sqliteStorage.updateTableConfig(id, data);
  }

  async deleteTableConfig(id: number): Promise<boolean> {
    return sqliteStorage.deleteTableConfig(id);
  }

  async getTableConfigById(id: number): Promise<TableConfig | null> {
    return sqliteStorage.getTableConfigById(id);
  }
}

export const storage = new SQLiteStorageAdapter();

