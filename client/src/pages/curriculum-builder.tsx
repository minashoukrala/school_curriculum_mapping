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


const grades = [
  "KG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
];
const subjects = [
  "English",
  "Math",
  "Science",
  "History",
  "Technology",
  "Art",
  "PE",
];

export default function CurriculumBuilder() {
  const [selectedGrade, setSelectedGrade] = useState("KG");
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CurriculumRow | null>(null);
  const [editingField, setEditingField] = useState<string>("");
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch curriculum rows
  const { data: curriculumRows = [], isLoading: isLoadingRows } = useQuery<
    CurriculumRow[]
  >({
    queryKey: ["/api/curriculum", selectedGrade, selectedSubject],
    queryFn: async () => {
      const response = await fetch(
        `/api/curriculum/${selectedGrade}/${selectedSubject}`,
      );
      if (!response.ok) throw new Error("Failed to fetch curriculum rows");
      return response.json();
    },
  });

  // Fetch standards
  const { data: standards = [], isLoading: isLoadingStandards } = useQuery<
    Standard[]
  >({
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
      queryClient.invalidateQueries({
        queryKey: ["/api/curriculum", selectedGrade, selectedSubject],
      });
      toast({
        title: "Success",
        description: "Curriculum row created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create curriculum row",
        variant: "destructive",
      });
    },
  });

  // Update curriculum row mutation
  const updateRowMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CurriculumRow>;
    }) => {
      const response = await apiRequest("PATCH", `/api/curriculum/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/curriculum", selectedGrade, selectedSubject],
      });
      toast({
        title: "Success",
        description: "Curriculum row updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update curriculum row",
        variant: "destructive",
      });
    },
  });

  // Delete curriculum row mutation
  const deleteRowMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/curriculum/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/curriculum", selectedGrade, selectedSubject],
      });
      toast({
        title: "Success",
        description: "Curriculum row deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete curriculum row",
        variant: "destructive",
      });
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
      data: { standards: selectedStandards },
    });
    setIsStandardsModalOpen(false);
    setEditingRowId(null);
  };

  const handleExportData = async () => {
    try {
      const response = await fetch(
        `/api/export/${selectedGrade}/${selectedSubject}`,
      );
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
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const currentEditingRowStandards = editingRowId
    ? curriculumRows.find((row) => row.id === editingRowId)?.standards || []
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Bar */}
      <div className="bg-[#2d4a7b] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              <span className="flex items-center">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">425.641.5570</span>
              </span>
              <span className="hidden md:inline">Contact Us</span>
              <span className="hidden lg:inline">Schedule A Tour</span>
              <span className="hidden lg:inline">Calendar</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span>f</span>
              <span>@</span>
              <span>▶</span>
              <span>X</span>
              <span>✉</span>
              <span>⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 flex-1">
              {grades.map((grade) => (
                <div
                  key={grade}
                  className="relative group"
                  onMouseEnter={() => setHoveredGrade(grade)}
                  onMouseLeave={() => setHoveredGrade(null)}
                >
                  <button
                    onClick={() => setSelectedGrade(grade)}
                    className={`text-[#2d4a7b] font-medium text-xs uppercase tracking-wide hover:text-[#1e3a8a] transition-all duration-200 py-3 px-2 whitespace-nowrap ${
                      selectedGrade === grade
                        ? "text-[#1e3a8a] border-b-2 border-[#1e3a8a]"
                        : ""
                    }`}
                  >
                    {grade}
                  </button>
                  {hoveredGrade === grade && (
                    <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 z-50 min-w-[180px] rounded-sm">
                      <div className="py-2">
                        {subjects.map((subject) => (
                          <button
                            key={subject}
                            onClick={() => {
                              setSelectedGrade(grade);
                              setSelectedSubject(subject);
                              setHoveredGrade(null);
                            }}
                            className={`block w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors ${
                              selectedSubject === subject &&
                              selectedGrade === grade
                                ? "bg-blue-50 text-[#1e3a8a] border-l-3 border-[#1e3a8a]"
                                : "text-gray-700 hover:text-[#2d4a7b]"
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Navigation */}
            <div className="flex lg:hidden items-center justify-between w-full">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
                {grades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`text-[#2d4a7b] font-medium text-xs uppercase tracking-wide hover:text-[#1e3a8a] transition-all duration-200 py-2 px-1.5 whitespace-nowrap flex-shrink-0 ${
                      selectedGrade === grade
                        ? "text-[#1e3a8a] border-b-2 border-[#1e3a8a]"
                        : ""
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Selection Indicator */}
            <div className="bg-gray-50 px-2 sm:px-3 py-1 rounded-full text-xs ml-2">
              <span className="text-gray-600 hidden sm:inline">Current:</span>
              <span className="ml-0 sm:ml-1 font-semibold text-[#2d4a7b]">
                <span className="sm:hidden">{selectedGrade}</span>
                <span className="hidden sm:inline">{selectedGrade} • {selectedSubject}</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Subject Selection */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center space-x-2 py-2 overflow-x-auto scrollbar-hide">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 transition-colors ${
                  selectedSubject === subject
                    ? "bg-[#2d4a7b] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                {selectedSubject.toUpperCase()} {selectedGrade} Curriculum Builder
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                School Year: <span>2023-2024</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={handleAddRow}
                className="edu-button-accent text-sm px-4 py-2"
                disabled={createRowMutation.isPending}
              >
                Add Curriculum Row
              </Button>
              <Button onClick={handleExportData} variant="outline" className="text-sm px-4 py-2">
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
