import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CurriculumRow, Standard } from "@shared/schema";
import GradeNavigation from "@/components/grade-navigation";
import SubjectNavigation from "@/components/subject-navigation";
import CurriculumTable from "@/components/curriculum-table";
import StandardsModal from "@/components/standards-modal";
import EditModal from "@/components/edit-modal";

const grades = ["KG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];
const subjects = ["English", "Math", "Science", "History", "Technology", "Art", "PE"];

export default function CurriculumBuilder() {
  const [selectedGrade, setSelectedGrade] = useState("KG");
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CurriculumRow | null>(null);
  const [editingField, setEditingField] = useState<string>("");
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch curriculum rows
  const { data: curriculumRows = [], isLoading: isLoadingRows } = useQuery<CurriculumRow[]>({
    queryKey: ["/api/curriculum", selectedGrade, selectedSubject],
    queryFn: async () => {
      const response = await fetch(`/api/curriculum/${selectedGrade}/${selectedSubject}`);
      if (!response.ok) throw new Error("Failed to fetch curriculum rows");
      return response.json();
    },
  });

  // Fetch standards
  const { data: standards = [], isLoading: isLoadingStandards } = useQuery<Standard[]>({
    queryKey: ["/api/standards"],
    queryFn: async () => {
      const response = await fetch("/api/standards");
      if (!response.ok) throw new Error("Failed to fetch standards");
      return response.json();
    },
  });

  // Create curriculum row mutation
  const createRowMutation = useMutation({
    mutationFn: async (data: Omit<CurriculumRow, "id">) => {
      const response = await apiRequest("POST", "/api/curriculum", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum", selectedGrade, selectedSubject] });
      toast({ title: "Success", description: "Curriculum row created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create curriculum row", variant: "destructive" });
    },
  });

  // Update curriculum row mutation
  const updateRowMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CurriculumRow> }) => {
      const response = await apiRequest("PATCH", `/api/curriculum/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum", selectedGrade, selectedSubject] });
      toast({ title: "Success", description: "Curriculum row updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update curriculum row", variant: "destructive" });
    },
  });

  // Delete curriculum row mutation
  const deleteRowMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/curriculum/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum", selectedGrade, selectedSubject] });
      toast({ title: "Success", description: "Curriculum row deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete curriculum row", variant: "destructive" });
    },
  });

  const handleAddRow = () => {
    const newRow = {
      grade: selectedGrade,
      subject: selectedSubject,
      objectives: "",
      unitPacing: "",
      learningTargets: "",
      standards: [],
    };
    createRowMutation.mutate(newRow);
  };

  const handleEditCell = (row: CurriculumRow, field: string) => {
    setEditingRow(row);
    setEditingField(field);
    setIsEditModalOpen(true);
  };

  const handleEditStandards = (rowId: number) => {
    setEditingRowId(rowId);
    setIsStandardsModalOpen(true);
  };

  const handleDeleteRow = (id: number) => {
    if (confirm("Are you sure you want to delete this curriculum row?")) {
      deleteRowMutation.mutate(id);
    }
  };

  const handleSaveEdit = (value: string) => {
    if (!editingRow) return;
    
    const updateData = { [editingField]: value };
    updateRowMutation.mutate({ id: editingRow.id, data: updateData });
    setIsEditModalOpen(false);
    setEditingRow(null);
    setEditingField("");
  };

  const handleSaveStandards = (selectedStandards: string[]) => {
    if (editingRowId === null) return;
    
    updateRowMutation.mutate({ 
      id: editingRowId, 
      data: { standards: selectedStandards } 
    });
    setIsStandardsModalOpen(false);
    setEditingRowId(null);
  };

  const handleExportData = async () => {
    try {
      const response = await fetch(`/api/export/${selectedGrade}/${selectedSubject}`);
      if (!response.ok) throw new Error("Failed to export data");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `curriculum-${selectedGrade}-${selectedSubject}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({ title: "Success", description: "Data exported successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to export data", variant: "destructive" });
    }
  };

  const currentEditingRowStandards = editingRowId 
    ? curriculumRows.find(row => row.id === editingRowId)?.standards || []
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="edu-header text-white">
        <div className="flex items-center justify-between px-6 py-2 text-sm">
          <div className="flex items-center space-x-4">
            <span><Phone className="inline w-4 h-4 mr-1" /> 425.641.5570</span>
            <span>Contact Us</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Admissions</span>
            <span>Donations</span>
            <span>Athletics</span>
            <span>Portal Login</span>
            <span>A-M Calendar</span>
            <span>Lunch Menu</span>
            <span>Teacher Resources</span>
            <span>A-Ray Coupons</span>
            <span>PTF Coupons</span>
          </div>
        </div>
      </header>

      {/* School Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ECS</span>
                </div>
                <div>
                  <h2 className="font-medium text-lg">Eastside Christian School</h2>
                </div>
              </div>
            </div>
            <GradeNavigation 
              grades={grades}
              selectedGrade={selectedGrade}
              onGradeSelect={setSelectedGrade}
            />
          </div>
        </div>
      </nav>

      {/* Subject Navigation */}
      <SubjectNavigation 
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSubjectSelect={setSelectedSubject}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">
                {selectedSubject.toUpperCase()} {selectedGrade} Curriculum Builder
              </h1>
              <p className="text-gray-600 mt-1">
                School Year: <span>2023-2024</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleAddRow}
                className="edu-button-accent"
                disabled={createRowMutation.isPending}
              >
                Add Curriculum Row
              </Button>
              <Button 
                onClick={handleExportData}
                variant="outline"
              >
                Export JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Curriculum Table */}
        <CurriculumTable
          rows={curriculumRows}
          standards={standards}
          isLoading={isLoadingRows || isLoadingStandards}
          onEditCell={handleEditCell}
          onEditStandards={handleEditStandards}
          onDeleteRow={handleDeleteRow}
        />

        {/* Stats */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {curriculumRows.length} curriculum entries
          </div>
        </div>
      </main>

      {/* Modals */}
      <StandardsModal
        isOpen={isStandardsModalOpen}
        onClose={() => setIsStandardsModalOpen(false)}
        standards={standards}
        selectedStandards={currentEditingRowStandards}
        onSave={handleSaveStandards}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${editingField}`}
        value={editingRow ? (editingRow as any)[editingField] || "" : ""}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
