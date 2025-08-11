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

// Helper function to convert display name to system table name
const convertToSystemName = (displayName: string): string => {
  return displayName
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export default function TableManagement() {
  const queryClient = useQueryClient();
  const [expandedTabs, setExpandedTabs] = useState<Set<number>>(new Set());
  const [expandedDropdowns, setExpandedDropdowns] = useState<Set<number>>(new Set());

  // Queries
  const { data: navigationTabs = [], isLoading: isLoadingTabs } = useQuery({
    queryKey: ['navigation-tabs', 'all'],
    queryFn: () => apiRequest('GET', '/api/navigation-tabs').then(res => res.json()),
    staleTime: 0, // Always consider data stale
    retry: false,
    // Prevent React Query from automatically refetching individual items
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: dropdownItems = [], isLoading: isLoadingDropdowns } = useQuery({
    queryKey: ['dropdown-items', 'all'],
    queryFn: () => apiRequest('GET', '/api/dropdown-items').then(res => res.json()),
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on component mount
  });

  const { data: tableConfigs = [], isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['table-configs', 'all'],
    queryFn: () => apiRequest('GET', '/api/table-configs', undefined, true).then(res => res.json()),
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates (reduced frequency)
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnMount: true, // Always refetch on component mount
  });

  // Function to invalidate all navigation-related queries with cache busting
  const invalidateNavigationCache = () => {
    // Clear ALL table config related queries completely
    queryClient.removeQueries({
      queryKey: ['table-configs'],
      exact: false
    });
    queryClient.removeQueries({
      queryKey: ['table-configs', 'subject'],
      exact: false
    });

    // Invalidate ALL navigation-related queries (including subject-specific ones)
    queryClient.invalidateQueries({
      queryKey: ['navigation-tabs'],
      exact: false
    });
    queryClient.invalidateQueries({
      queryKey: ['dropdown-items'],
      exact: false
    });
    queryClient.invalidateQueries({
      queryKey: ['table-configs'],
      exact: false
    });

    // Also invalidate any subject-specific table config queries
    queryClient.invalidateQueries({
      queryKey: ['table-configs', 'subject'],
      exact: false
    });

    // Force immediate refetch of all table config queries
    queryClient.refetchQueries({
      queryKey: ['table-configs'],
      exact: false
    });
    queryClient.refetchQueries({
      queryKey: ['table-configs', 'subject'],
      exact: false
    });

    // Refetch the main queries
    queryClient.refetchQueries({
      queryKey: ['navigation-tabs', 'all'],
      exact: true
    });
    queryClient.refetchQueries({
      queryKey: ['navigation-tabs', 'active'],
      exact: true
    });
    queryClient.refetchQueries({
      queryKey: ['dropdown-items', 'all'],
      exact: true
    });
    queryClient.refetchQueries({
      queryKey: ['table-configs', 'all'],
      exact: true
    });
  };

  // Mutations
  const createTabMutation = useMutation({
    mutationFn: (data: CreateNavigationTab) =>
      apiRequest('POST', '/api/navigation-tabs', data).then(res => res.json()),
    onSuccess: () => {
      invalidateNavigationCache();
    }
  });

  const updateTabMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNavigationTab }) =>
      apiRequest('PATCH', `/api/navigation-tabs/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      invalidateNavigationCache();
    },
    // Prevent automatic refetching of individual items
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['navigation-tabs'] });
      await queryClient.cancelQueries({ queryKey: ['navigation-tabs', 'active'] });
      await queryClient.cancelQueries({ queryKey: ['dropdown-items'] });
      await queryClient.cancelQueries({ queryKey: ['table-configs'] });
    },
  });

  const deleteTabMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest('DELETE', `/api/navigation-tabs/${id}`),
    onSuccess: () => {
      invalidateNavigationCache();
    }
  });

  const createDropdownMutation = useMutation({
    mutationFn: (data: CreateDropdownItem) =>
      apiRequest('POST', '/api/dropdown-items', data).then(res => res.json()),
    onSuccess: () => {
      invalidateNavigationCache();
    }
  });

  const updateDropdownMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDropdownItem }) =>
      apiRequest('PATCH', `/api/dropdown-items/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      invalidateNavigationCache();
    },
    // Prevent automatic refetching of individual items
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['navigation-tabs'] });
      await queryClient.cancelQueries({ queryKey: ['navigation-tabs', 'active'] });
      await queryClient.cancelQueries({ queryKey: ['dropdown-items'] });
      await queryClient.cancelQueries({ queryKey: ['table-configs'] });
    },
  });

  const deleteDropdownMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest('DELETE', `/api/dropdown-items/${id}`),
    onSuccess: () => {
      invalidateNavigationCache();
    }
  });

  const createTableConfigMutation = useMutation({
    mutationFn: (data: CreateTableConfig) =>
      apiRequest('POST', '/api/table-configs', data).then(res => res.json()),
    onSuccess: () => {
      invalidateNavigationCache();
      // Force immediate refetch of all table config queries
      queryClient.refetchQueries({
        queryKey: ['table-configs'],
        exact: false
      });
      queryClient.refetchQueries({
        queryKey: ['table-configs', 'subject'],
        exact: false
      });
    }
  });

  const updateTableConfigMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTableConfig }) =>
      apiRequest('PATCH', `/api/table-configs/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      invalidateNavigationCache();
      // Force immediate refetch of all table config queries
      queryClient.refetchQueries({
        queryKey: ['table-configs'],
        exact: false
      });
      queryClient.refetchQueries({
        queryKey: ['table-configs', 'subject'],
        exact: false
      });
    },
    // Prevent automatic refetching of individual items
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['navigation-tabs'] });
      await queryClient.cancelQueries({ queryKey: ['navigation-tabs', 'active'] });
      await queryClient.cancelQueries({ queryKey: ['dropdown-items'] });
      await queryClient.cancelQueries({ queryKey: ['table-configs'] });
    },
  });

  const deleteTableConfigMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest('DELETE', `/api/table-configs/${id}`),
    onSuccess: () => {
      // Clear ALL table config queries immediately
      queryClient.removeQueries({
        queryKey: ['table-configs'],
        exact: false
      });
      queryClient.removeQueries({
        queryKey: ['table-configs', 'subject'],
        exact: false
      });
      
      invalidateNavigationCache();
      
      // Force immediate refetch of all table config queries
      queryClient.refetchQueries({
        queryKey: ['table-configs'],
        exact: false
      });
      queryClient.refetchQueries({
        queryKey: ['table-configs', 'subject'],
        exact: false
      });
    }
  });

  // State for new items
  const [newTab, setNewTab] = useState({ name: '', order: 0 });
  const [newDropdown, setNewDropdown] = useState({ tabId: 0, name: '', order: 0 });
  const [newTableConfig, setNewTableConfig] = useState({ tabId: 0, dropdownId: 0, tableName: '', order: 0 });

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
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Table Management</h2>
      </div>

      {/* Add new navigation tab */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Add Navigation Tab</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            value={newTab.name}
            onChange={(e) => setNewTab({ ...newTab, name: e.target.value })}
            placeholder="Tab Name"
          />
          <Input
            type="number"
            value={newTab.order}
            onChange={(e) => setNewTab({ ...newTab, order: parseInt(e.target.value) || 0 })}
            placeholder="Order"
          />
          <Button
            onClick={() => {
              createTabMutation.mutate({
                name: newTab.name,
                displayName: newTab.name,
                order: newTab.order
              });
              setNewTab({ name: '', order: 0 });
            }}
            disabled={!newTab.name}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tab
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Navigation Tabs</h3>
        {navigationTabs
          .filter((tab: NavigationTab) => tab.name !== 'Admin') // Filter out Admin tab from editable list
          .map((tab: NavigationTab) => (
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
        
        {/* Admin tab - read-only display */}
        {navigationTabs.find((tab: NavigationTab) => tab.name === 'Admin') && (
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4 bg-gray-50">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTabExpansion(navigationTabs.find((t: NavigationTab) => t.name === 'Admin')!.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedTabs.has(navigationTabs.find((t: NavigationTab) => t.name === 'Admin')!.id) ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </button>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-600">Admin</span>
                  <span className="text-sm text-gray-400">(Read-only)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">Immutable</span>
              </div>
            </div>

            {expandedTabs.has(navigationTabs.find((t: NavigationTab) => t.name === 'Admin')!.id) && (
              <div className="p-4 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-4">
                  The Admin tab is system-managed and cannot be modified. It always appears as the last tab in the navigation.
                </div>
                {/* Show Admin dropdown items in read-only mode */}
                <div className="space-y-2">
                  {getDropdownItemsForTab(navigationTabs.find((t: NavigationTab) => t.name === 'Admin')!.id).map((dropdown: DropdownItem) => (
                    <div key={dropdown.id} className="border border-gray-200 rounded p-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-600">{dropdown.name}</span>
                        <span className="text-xs text-gray-400">System-managed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
  const [editData, setEditData] = useState({ name: tab.name, order: tab.order });
  const [newDropdown, setNewDropdown] = useState({ name: '', order: 0 });

  const handleSave = () => {
    onUpdate({ name: editData.name, displayName: editData.name, order: editData.order });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ name: tab.name, order: tab.order });
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
              <span className="font-medium">{tab.name}</span>
              <span className="text-sm text-gray-500">Order: {tab.order}</span>
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
          {/* Add new dropdown */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <h5 className="text-sm font-medium text-yellow-900 mb-2">Add Dropdown Item</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                value={newDropdown.name}
                onChange={(e) => setNewDropdown({ ...newDropdown, name: e.target.value })}
                placeholder="Dropdown Name"
                className="text-sm"
              />
              <Input
                type="number"
                value={newDropdown.order}
                onChange={(e) => setNewDropdown({ ...newDropdown, order: parseInt(e.target.value) || 0 })}
                placeholder="Order"
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={() => {
                  onCreateDropdown({
                    tabId: tab.id,
                    name: newDropdown.name,
                    displayName: newDropdown.name,
                    order: newDropdown.order
                  });
                  setNewDropdown({ name: '', order: 0 });
                }}
                disabled={!newDropdown.name}
                className="text-sm"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Existing dropdowns */}
          <div className="space-y-2">
            {dropdownItems.map((dropdown: DropdownItem) => (
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
  const [editData, setEditData] = useState({ name: dropdown.name, order: dropdown.order });
  const [newTableConfig, setNewTableConfig] = useState({ tableName: '', order: 0 });

  const handleSave = () => {
    onUpdate({ name: editData.name, displayName: editData.name, order: editData.order });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ name: dropdown.name, order: dropdown.order });
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
              <span className="font-medium">{dropdown.name}</span>
              <span className="text-sm text-gray-500">Order: {dropdown.order}</span>
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
                placeholder="Display name (e.g., Science Y)"
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
                  const systemName = convertToSystemName(newTableConfig.tableName);
                  onCreateTableConfig({
                    tabId: dropdown.tabId,
                    dropdownId: dropdown.id,
                    tableName: systemName,
                    displayName: newTableConfig.tableName,
                    order: newTableConfig.order
                  });
                  setNewTableConfig({ tableName: '', order: 0 });
                }}
                disabled={!newTableConfig.tableName}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Existing table configs */}
          <div className="space-y-1">
            {tableConfigs.map((config: TableConfig) => (
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
  const [editData, setEditData] = useState({ displayName: config.displayName, order: config.order });

  const handleSave = () => {
    const systemName = convertToSystemName(editData.displayName);
    onUpdate({ tableName: systemName, displayName: editData.displayName, order: editData.order });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ displayName: config.displayName, order: config.order });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded ml-4">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input
            value={editData.displayName}
            onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
            className="w-20 text-xs"
          />
          <Input
            type="number"
            value={editData.order}
            onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })}
            className="w-16 text-xs"
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
            <div className="flex flex-col">
              <span className="text-sm font-medium">{config.displayName}</span>
              <span className="text-xs text-gray-400">System: {config.tableName}</span>
            </div>
            <span className="text-xs text-gray-500">Order: {config.order}</span>
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