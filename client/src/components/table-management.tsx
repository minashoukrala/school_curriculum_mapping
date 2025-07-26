import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { 
  NavigationTab, 
  DropdownItem, 
  TableConfig,
  CreateNavigationTab,
  UpdateNavigationTab,
  CreateDropdownItem,
  UpdateDropdownItem,
  CreateTableConfig,
  UpdateTableConfig
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight } from "lucide-react";

export default function TableManagement() {
  const queryClient = useQueryClient();
  const [expandedTabs, setExpandedTabs] = useState<Set<number>>(new Set());
  const [expandedDropdowns, setExpandedDropdowns] = useState<Set<number>>(new Set());

  // Queries
  const { data: navigationTabs = [], isLoading: isLoadingTabs } = useQuery({
    queryKey: ['navigation-tabs'],
    queryFn: () => apiRequest('GET', '/api/navigation-tabs').then(res => res.json())
  });

  const { data: dropdownItems = [], isLoading: isLoadingDropdowns } = useQuery({
    queryKey: ['dropdown-items'],
    queryFn: () => apiRequest('GET', '/api/dropdown-items').then(res => res.json())
  });

  const { data: tableConfigs = [], isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['table-configs'],
    queryFn: () => apiRequest('GET', '/api/table-configs').then(res => res.json())
  });

  // Mutations
  const createTabMutation = useMutation({
    mutationFn: (data: CreateNavigationTab) => 
      apiRequest('POST', '/api/navigation-tabs', data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-tabs'] });
    }
  });

  const updateTabMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNavigationTab }) => 
      apiRequest('PATCH', `/api/navigation-tabs/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-tabs'] });
    }
  });

  const deleteTabMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/navigation-tabs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-tabs'] });
      queryClient.invalidateQueries({ queryKey: ['dropdown-items'] });
    }
  });

  const createDropdownMutation = useMutation({
    mutationFn: (data: CreateDropdownItem) => 
      apiRequest('POST', '/api/dropdown-items', data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropdown-items'] });
    }
  });

  const updateDropdownMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDropdownItem }) => 
      apiRequest('PATCH', `/api/dropdown-items/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropdown-items'] });
    }
  });

  const deleteDropdownMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/dropdown-items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropdown-items'] });
      queryClient.invalidateQueries({ queryKey: ['table-configs'] });
    }
  });

  const createTableConfigMutation = useMutation({
    mutationFn: (data: CreateTableConfig) => 
      apiRequest('POST', '/api/table-configs', data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-configs'] });
    }
  });

  const updateTableConfigMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTableConfig }) => 
      apiRequest('PATCH', `/api/table-configs/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-configs'] });
    }
  });

  const deleteTableConfigMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/table-configs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-configs'] });
    }
  });

  // State for new items
  const [newTab, setNewTab] = useState({ name: '', displayName: '', order: 0 });
  const [newDropdown, setNewDropdown] = useState({ tabId: 0, name: '', displayName: '', order: 0 });
  const [newTableConfig, setNewTableConfig] = useState({ tabId: 0, dropdownId: 0, tableName: '', displayName: '', order: 0 });

  // Helper functions
  const getDropdownItemsForTab = (tabId: number) => {
    return dropdownItems.filter((item: DropdownItem) => item.tabId === tabId);
  };

  const getTableConfigsForDropdown = (dropdownId: number) => {
    return tableConfigs.filter((config: TableConfig) => config.dropdownId === dropdownId);
  };

  const toggleTabExpansion = (tabId: number) => {
    const newExpanded = new Set(expandedTabs);
    if (newExpanded.has(tabId)) {
      newExpanded.delete(tabId);
    } else {
      newExpanded.add(tabId);
    }
    setExpandedTabs(newExpanded);
  };

  const toggleDropdownExpansion = (dropdownId: number) => {
    const newExpanded = new Set(expandedDropdowns);
    if (newExpanded.has(dropdownId)) {
      newExpanded.delete(dropdownId);
    } else {
      newExpanded.add(dropdownId);
    }
    setExpandedDropdowns(newExpanded);
  };

  if (isLoadingTabs || isLoadingDropdowns || isLoadingConfigs) {
    return <div className="text-center py-8">Loading table management...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation Tabs</h3>
        
        {/* Add new tab */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Tab</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label htmlFor="new-tab-name">Name</Label>
              <Input
                id="new-tab-name"
                value={newTab.name}
                onChange={(e) => setNewTab({ ...newTab, name: e.target.value })}
                placeholder="e.g., Grade 9"
              />
            </div>
            <div>
              <Label htmlFor="new-tab-display">Display Name</Label>
              <Input
                id="new-tab-display"
                value={newTab.displayName}
                onChange={(e) => setNewTab({ ...newTab, displayName: e.target.value })}
                placeholder="e.g., Grade 9"
              />
            </div>
            <div>
              <Label htmlFor="new-tab-order">Order</Label>
              <Input
                id="new-tab-order"
                type="number"
                value={newTab.order}
                onChange={(e) => setNewTab({ ...newTab, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  createTabMutation.mutate(newTab);
                  setNewTab({ name: '', displayName: '', order: 0 });
                }}
                disabled={!newTab.name || !newTab.displayName || createTabMutation.isPending}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tab
              </Button>
            </div>
          </div>
        </div>

        {/* Existing tabs */}
        <div className="space-y-2">
          {navigationTabs.map((tab: NavigationTab) => (
            <NavigationTabItem
              key={tab.id}
              tab={tab}
              dropdownItems={getDropdownItemsForTab(tab.id)}
              tableConfigs={tableConfigs}
              isExpanded={expandedTabs.has(tab.id)}
              onToggleExpansion={() => toggleTabExpansion(tab.id)}
              onUpdate={(data) => updateTabMutation.mutate({ id: tab.id, data })}
              onDelete={() => deleteTabMutation.mutate(tab.id)}
              onCreateDropdown={(data) => createDropdownMutation.mutate(data)}
              onUpdateDropdown={(id, data) => updateDropdownMutation.mutate({ id, data })}
              onDeleteDropdown={(id) => deleteDropdownMutation.mutate(id)}
              onCreateTableConfig={(data) => createTableConfigMutation.mutate(data)}
              onUpdateTableConfig={(id, data) => updateTableConfigMutation.mutate({ id, data })}
              onDeleteTableConfig={(id) => deleteTableConfigMutation.mutate(id)}
              isDropdownExpanded={(dropdownId) => expandedDropdowns.has(dropdownId)}
              onToggleDropdownExpansion={toggleDropdownExpansion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface NavigationTabItemProps {
  tab: NavigationTab;
  dropdownItems: DropdownItem[];
  tableConfigs: TableConfig[];
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onUpdate: (data: UpdateNavigationTab) => void;
  onDelete: () => void;
  onCreateDropdown: (data: CreateDropdownItem) => void;
  onUpdateDropdown: (id: number, data: UpdateDropdownItem) => void;
  onDeleteDropdown: (id: number) => void;
  onCreateTableConfig: (data: CreateTableConfig) => void;
  onUpdateTableConfig: (id: number, data: UpdateTableConfig) => void;
  onDeleteTableConfig: (id: number) => void;
  isDropdownExpanded: (dropdownId: number) => boolean;
  onToggleDropdownExpansion: (dropdownId: number) => void;
}

function NavigationTabItem({
  tab,
  dropdownItems,
  tableConfigs,
  isExpanded,
  onToggleExpansion,
  onUpdate,
  onDelete,
  onCreateDropdown,
  onUpdateDropdown,
  onDeleteDropdown,
  onCreateTableConfig,
  onUpdateTableConfig,
  onDeleteTableConfig,
  isDropdownExpanded,
  onToggleDropdownExpansion
}: NavigationTabItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: tab.name, displayName: tab.displayName, order: tab.order });
  const [newDropdown, setNewDropdown] = useState({ name: '', displayName: '', order: 0 });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ name: tab.name, displayName: tab.displayName, order: tab.order });
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleExpansion}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-24"
              />
              <Input
                value={editData.displayName}
                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                className="w-24"
              />
              <Input
                type="number"
                value={editData.order}
                onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })}
                className="w-16"
              />
              <Button size="sm" onClick={handleSave}>
                <Save className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="font-medium">{tab.displayName}</span>
              <span className="text-sm text-gray-500">({tab.name})</span>
              <span className="text-sm text-gray-500">Order: {tab.order}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Order:</span>
                <Input
                  type="number"
                  value={tab.order}
                  onChange={(e) => onUpdate({ 
                    name: tab.name, 
                    displayName: tab.displayName, 
                    order: parseInt(e.target.value) || 0, 
                    isActive: tab.isActive 
                  })}
                  className="w-16 text-sm"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing && (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-3 h-3" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {/* Add new dropdown item */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <h5 className="text-sm font-medium text-blue-900 mb-2">Add Dropdown Item</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                value={newDropdown.name}
                onChange={(e) => setNewDropdown({ ...newDropdown, name: e.target.value })}
                placeholder="Name"
              />
              <Input
                value={newDropdown.displayName}
                onChange={(e) => setNewDropdown({ ...newDropdown, displayName: e.target.value })}
                placeholder="Display Name"
              />
              <Input
                type="number"
                value={newDropdown.order}
                onChange={(e) => setNewDropdown({ ...newDropdown, order: parseInt(e.target.value) || 0 })}
                placeholder="Order"
              />
              <Button
                size="sm"
                onClick={() => {
                  onCreateDropdown({ ...newDropdown, tabId: tab.id });
                  setNewDropdown({ name: '', displayName: '', order: 0 });
                }}
                disabled={!newDropdown.name || !newDropdown.displayName}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Existing dropdown items */}
          <div className="space-y-2">
            {dropdownItems.map((dropdown) => (
                             <DropdownItemComponent
                 key={dropdown.id}
                 dropdown={dropdown}
                 tableConfigs={tableConfigs.filter((config: TableConfig) => config.dropdownId === dropdown.id)}
                 isExpanded={isDropdownExpanded(dropdown.id)}
                 onToggleExpansion={() => onToggleDropdownExpansion(dropdown.id)}
                 onUpdate={(data) => onUpdateDropdown(dropdown.id, data)}
                 onDelete={() => onDeleteDropdown(dropdown.id)}
                 onCreateTableConfig={(data) => onCreateTableConfig(data)}
                 onUpdateTableConfig={(id, data) => onUpdateTableConfig(id, data)}
                 onDeleteTableConfig={(id) => onDeleteTableConfig(id)}
               />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemComponentProps {
  dropdown: DropdownItem;
  tableConfigs: TableConfig[];
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onUpdate: (data: UpdateDropdownItem) => void;
  onDelete: () => void;
  onCreateTableConfig: (data: CreateTableConfig) => void;
  onUpdateTableConfig: (id: number, data: UpdateTableConfig) => void;
  onDeleteTableConfig: (id: number) => void;
}

function DropdownItemComponent({
  dropdown,
  tableConfigs,
  isExpanded,
  onToggleExpansion,
  onUpdate,
  onDelete,
  onCreateTableConfig,
  onUpdateTableConfig,
  onDeleteTableConfig
}: DropdownItemComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: dropdown.name, displayName: dropdown.displayName, order: dropdown.order });
  const [newTableConfig, setNewTableConfig] = useState({ tableName: '', displayName: '', order: 0 });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ name: dropdown.name, displayName: dropdown.displayName, order: dropdown.order });
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg ml-4">
      <div className="flex items-center justify-between p-3 bg-blue-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleExpansion}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-20"
              />
              <Input
                value={editData.displayName}
                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                className="w-20"
              />
              <Input
                type="number"
                value={editData.order}
                onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })}
                className="w-16"
              />
              <Button size="sm" onClick={handleSave}>
                <Save className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="font-medium">{dropdown.displayName}</span>
              <span className="text-sm text-gray-500">({dropdown.name})</span>
              <span className="text-sm text-gray-500">Order: {dropdown.order}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Order:</span>
                <Input
                  type="number"
                  value={dropdown.order}
                  onChange={(e) => onUpdate({ 
                    name: dropdown.name, 
                    displayName: dropdown.displayName, 
                    order: parseInt(e.target.value) || 0, 
                    isActive: dropdown.isActive 
                  })}
                  className="w-16 text-sm"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing && (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-3 h-3" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 border-t border-gray-200">
          {/* Add new table config */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
            <h6 className="text-xs font-medium text-green-900 mb-1">Add Table Config</h6>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                value={newTableConfig.tableName}
                onChange={(e) => setNewTableConfig({ ...newTableConfig, tableName: e.target.value })}
                placeholder="Table Name"
                className="text-xs"
              />
              <Input
                value={newTableConfig.displayName}
                onChange={(e) => setNewTableConfig({ ...newTableConfig, displayName: e.target.value })}
                placeholder="Display Name"
                className="text-xs"
              />
              <Input
                type="number"
                value={newTableConfig.order}
                onChange={(e) => setNewTableConfig({ ...newTableConfig, order: parseInt(e.target.value) || 0 })}
                placeholder="Order"
                className="text-xs"
              />
              <Button
                size="sm"
                onClick={() => {
                  onCreateTableConfig({ ...newTableConfig, tabId: dropdown.tabId, dropdownId: dropdown.id });
                  setNewTableConfig({ tableName: '', displayName: '', order: 0 });
                }}
                disabled={!newTableConfig.tableName || !newTableConfig.displayName}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Existing table configs */}
          <div className="space-y-1">
            {tableConfigs.map((config) => (
              <TableConfigItem
                key={config.id}
                config={config}
                onUpdate={(data) => onUpdateTableConfig(config.id, data)}
                onDelete={() => onDeleteTableConfig(config.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TableConfigItemProps {
  config: TableConfig;
  onUpdate: (data: UpdateTableConfig) => void;
  onDelete: () => void;
}

function TableConfigItem({ config, onUpdate, onDelete }: TableConfigItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ tableName: config.tableName, displayName: config.displayName, order: config.order });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ tableName: config.tableName, displayName: config.displayName, order: config.order });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded ml-4">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input
            value={editData.tableName}
            onChange={(e) => setEditData({ ...editData, tableName: e.target.value })}
            className="w-20 text-xs"
          />
          <Input
            value={editData.displayName}
            onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
            className="w-20 text-xs"
          />
          <Input
            type="number"
            value={editData.order}
            onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })}
            className="w-12 text-xs"
          />
          <Button size="sm" onClick={handleSave}>
            <Save className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">{config.displayName}</span>
            <span className="text-xs text-gray-500">({config.tableName})</span>
            <span className="text-xs text-gray-500">Order: {config.order}</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Order:</span>
              <Input
                type="number"
                value={config.order}
                onChange={(e) => onUpdate({ 
                  tableName: config.tableName, 
                  displayName: config.displayName, 
                  order: parseInt(e.target.value) || 0, 
                  isActive: config.isActive 
                })}
                className="w-12 text-xs"
                min="0"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={onDelete}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 