import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CurriculumRow, Standard } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CurriculumTable from "./curriculum-table";
import EditModal from "./edit-modal";
import StandardsModal from "./standards-modal";
import { useState } from "react";

interface SpecialistGradeTableProps {
  grade: string;
  subject: string;
}

export default function SpecialistGradeTable({ grade, subject }: SpecialistGradeTableProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CurriculumRow | null>(null);
  const [editingField, setEditingField] = useState<string>("");
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch curriculum rows for this specific grade and subject
  const { data: curriculumRows = [], isLoading: isLoadingRows } = useQuery<CurriculumRow[]>({
    queryKey: ["/api/curriculum", grade, subject],
    queryFn: async () => {
      const response = await fetch(`/api/curriculum/${grade}/${subject}`);
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
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum", grade, subject] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum", grade, subject] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum", grade, subject] });
      toast({ title: "Success", description: "Curriculum row deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete curriculum row", variant: "destructive" });
    },
  });

  const handleAddRow = () => {
    const newRow = {
      grade,
      subject,
      objectives: "",
      unitPacing: "",
      assessments: "",
      materialsAndDifferentiation: "",
      biblical: "",
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

  const handleSaveEdit = (value: string) => {
    if (!editingRow) return;
    const updatedRow = { ...editingRow, [editingField]: value };
    updateRowMutation.mutate({ id: editingRow.id, data: updatedRow });
    setIsEditModalOpen(false);
    setEditingRow(null);
    setEditingField("");
  };

  const handleSaveStandards = (selectedStandards: string[]) => {
    if (editingRowId === null) return;
    updateRowMutation.mutate({
      id: editingRowId,
      data: { standards: selectedStandards },
    });
    setIsStandardsModalOpen(false);
    setEditingRowId(null);
  };

  const currentEditingRowStandards = editingRowId
    ? curriculumRows.find((row) => row.id === editingRowId)?.standards || []
    : [];

  const handleDeleteRow = (id: number) => {
    if (confirm("Are you sure you want to delete this curriculum row?")) {
      deleteRowMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Row Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {curriculumRows.length} curriculum entries
        </div>
        <Button
          onClick={handleAddRow}
          className="edu-button-accent text-sm px-3 py-1"
          disabled={createRowMutation.isPending}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Row
        </Button>
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

      {/* Modals */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${editingField}`}
        value={editingRow ? (editingRow as any)[editingField] || "" : ""}
        onSave={handleSaveEdit}
      />

      <StandardsModal
        isOpen={isStandardsModalOpen}
        onClose={() => setIsStandardsModalOpen(false)}
        standards={standards}
        selectedStandards={currentEditingRowStandards}
        onSave={handleSaveStandards}
      />
    </div>
  );
} 