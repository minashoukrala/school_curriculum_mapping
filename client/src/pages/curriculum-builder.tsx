import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Phone, Mail, Landmark, Calendar, Facebook, Instagram, Youtube, X as XIcon, BookOpen, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { CurriculumRow, Standard } from "@shared/schema";
import GradeNavigation from "@/components/grade-navigation";
import SubjectNavigation from "@/components/subject-navigation";
import CurriculumTable from "@/components/curriculum-table";
import SpecialistGradeTable from "@/components/specialist-grade-table";
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
  "Specialists",
  "Admin",
];
  const getSpecialistSubjects = () => {
    return [
      "Art",
      "Spanish", 
      "Music",
      "Technology",
      "PE"
    ];
  };

  const getSubjectsForGrade = (grade: string) => {
  if (grade === "KG") {
    return [
      "Bible Study",
      "Reading",
      "Math",
      "Science",
      "Social Studies",
      "Visual Art"
    ];
  }
  if (grade === "Grade 1") {
    return [
      "Bible Study",
      "Reading",
      "Writing",
      "Math",
      "Social Studies",
      "Science"
    ];
  }
  if (grade === "Grade 2") {
    return [
      "Bible Study",
      "Reading",
      "Writing",
      "Math",
      "Social Studies",
      "Science"
    ];
  }
  if (grade === "Grade 3" || grade === "Grade 4" || grade === "Grade 5") {
    return [
      "Bible Study",
      "Reading",
      "Writing",
      "Math",
      "Social Studies",
      "Science"
    ];
  }
  if (grade === "Grade 6" || grade === "Grade 7" || grade === "Grade 8") {
    return [
      "Bible Study",
      "English",
      "Math",
      "Science",
      "History"
    ];
  }
  if (grade === "Specialists") {
    return [
      "Art",
      "Spanish",
      "Music",
      "Technology",
      "PE"
    ];
  }
  if (grade === "Admin") {
    return [
      "Database Export"
    ];
  }
  return [
    "English",
    "Math",
    "Science",
    "History",
    "Technology",
    "Art",
    "PE",
  ];
};

export default function CurriculumBuilder() {
  // URL state management functions
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      grade: urlParams.get('grade') || 'KG',
      subject: urlParams.get('subject') || 'Bible Study'
    };
  };

  const updateUrl = (grade: string, subject: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('grade', grade);
    url.searchParams.set('subject', subject);
    window.history.replaceState({}, '', url.toString());
  };

  const [selectedGrade, setSelectedGrade] = useState(() => getUrlParams().grade);
  const [selectedSubject, setSelectedSubject] = useState(() => getUrlParams().subject);
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  // Update URL when state changes
  useEffect(() => {
    updateUrl(selectedGrade, selectedSubject);
  }, [selectedGrade, selectedSubject]);

  // Wrapper functions to update both state and URL
  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    // Reset subject to first available subject for the new grade
    const subjects = getSubjectsForGrade(grade);
    setSelectedSubject(subjects[0]);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
  };
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CurriculumRow | null>(null);
  const [editingField, setEditingField] = useState<string>("");
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // const { toast } = useToast();
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
    enabled: selectedGrade !== "Admin", // Don't fetch for Admin section
  });

  // Fetch all curriculum rows for admin section
  const { data: allCurriculumRows = [] } = useQuery<CurriculumRow[]>({
    queryKey: ["/api/curriculum/all"],
    queryFn: async () => {
      const response = await fetch(`/api/curriculum/all`);
      if (!response.ok) throw new Error("Failed to fetch all curriculum rows");
      return response.json();
    },
    enabled: selectedGrade === "Admin", // Only fetch when in Admin section
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
    onSuccess: (newRow) => {
      // Simple invalidation approach - more reliable
      queryClient.invalidateQueries({
        queryKey: ["/api/curriculum"],
      });
      console.log("Success: Curriculum row created successfully", newRow);
    },
    onError: () => {
      console.log("Error: Failed to create curriculum row");
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
        queryKey: ["/api/curriculum"],
      });
      console.log("Success: Curriculum row updated successfully");
    },
    onError: () => {
      console.log("Error: Failed to update curriculum row");
    },
  });

  // Delete curriculum row mutation
  const deleteRowMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/curriculum/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/curriculum"],
      });
      console.log("Success: Curriculum row deleted successfully");
    },
    onError: () => {
      console.log("Error: Failed to delete curriculum row");
    },
  });

  const handleAddRow = () => {
    const newRow = {
      grade: selectedGrade,
      subject: selectedSubject,
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

  const handleDeleteRow = (id: number) => {
    if (confirm("Are you sure you want to delete this curriculum row?")) {
      deleteRowMutation.mutate(id);
    }
  };

  const handleSaveEdit = (value: string) => {
    if (!editingRow) return;

    // Merge the new value into the full row
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



  const handleExportFullDatabase = async () => {
    try {
      console.log('Starting full database export...');
      
      // Use a direct download approach - no JSON parsing
      const downloadLink = document.createElement("a");
      downloadLink.href = '/api/export/full-database';
      downloadLink.download = `full-curriculum-database-${new Date().toISOString().split('T')[0]}.json`;
      downloadLink.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(downloadLink);
      }, 100);
      
      console.log('Export completed successfully');
      console.log("Success: Full database exported successfully");
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Error: Failed to export full database: ${errorMessage}`);
    }
  };

  const handleImportDatabase = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate file type
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        console.log("Error: Please select a valid JSON file");
        return;
      }

      // Read the file
      const text = await file.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.log("Error: Invalid JSON format. Please check your file.");
        return;
      }

      // Comprehensive validation
      const validationResult = validateImportData(data);
      if (!validationResult.isValid) {
        console.log("Error: " + validationResult.error);
        return;
      }

      // Show detailed confirmation dialog
      const confirmed = window.confirm(
        `Database Import Validation Successful!\n\n` +
        `✅ File format: Valid JSON\n` +
        `✅ Data structure: Valid\n` +
        `✅ Required fields: Present\n` +
        `✅ Data integrity: Verified\n\n` +
        `Import Summary:\n` +
        `- ${data.curriculumRows.length} curriculum entries\n` +
        `- ${data.standards.length} standards\n` +
        `- ${validationResult.gradeCount} different grades\n` +
        `- ${validationResult.subjectCount} different subjects\n\n` +
        `Are you sure you want to replace the current database?\n` +
        `This action cannot be undone!`
      );

      if (!confirmed) {
        event.target.value = '';
        return;
      }

      // Upload the data
      const response = await fetch('/api/import/full-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to import database');
      }

      // Invalidate all queries to refresh the data
      queryClient.invalidateQueries();

      console.log("Success: Database imported successfully");

      // Clear the file input
      event.target.value = '';
    } catch (error) {
      console.error('Import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Error: Failed to import database: ${errorMessage}`);
      event.target.value = '';
    }
  };

  // Comprehensive validation function
  const validateImportData = (data: any) => {
    // Check top-level structure
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: "Invalid data format: not an object" };
    }

    if (!data.curriculumRows || !Array.isArray(data.curriculumRows)) {
      return { isValid: false, error: "Missing or invalid curriculumRows array" };
    }

    if (!data.standards || !Array.isArray(data.standards)) {
      return { isValid: false, error: "Missing or invalid standards array" };
    }

    if (!data.metadata || typeof data.metadata !== 'object') {
      return { isValid: false, error: "Missing or invalid metadata object" };
    }

    // Validate curriculum rows
    const requiredCurriculumFields = ['id', 'grade', 'subject', 'objectives', 'unitPacing', 'assessments', 'materialsAndDifferentiation', 'biblical', 'standards'];
    const grades = new Set();
    const subjects = new Set();

    for (let i = 0; i < data.curriculumRows.length; i++) {
      const row = data.curriculumRows[i];
      
      // Check if row is an object
      if (!row || typeof row !== 'object') {
        return { isValid: false, error: `Curriculum row ${i + 1} is not a valid object` };
      }

      // Check required fields
      for (const field of requiredCurriculumFields) {
        if (!(field in row)) {
          return { isValid: false, error: `Curriculum row ${i + 1} missing required field: ${field}` };
        }
      }

      // Validate field types
      if (typeof row.id !== 'number' || row.id <= 0) {
        return { isValid: false, error: `Curriculum row ${i + 1} has invalid ID: must be a positive number` };
      }

      if (typeof row.grade !== 'string' || row.grade.trim() === '') {
        return { isValid: false, error: `Curriculum row ${i + 1} has invalid grade: must be a non-empty string` };
      }

      if (typeof row.subject !== 'string' || row.subject.trim() === '') {
        return { isValid: false, error: `Curriculum row ${i + 1} has invalid subject: must be a non-empty string` };
      }

      if (!Array.isArray(row.standards)) {
        return { isValid: false, error: `Curriculum row ${i + 1} has invalid standards: must be an array` };
      }

      // Track unique grades and subjects
      grades.add(row.grade);
      subjects.add(row.subject);
    }

    // Validate standards
    const requiredStandardFields = ['id', 'code', 'description', 'category'];
    
    for (let i = 0; i < data.standards.length; i++) {
      const standard = data.standards[i];
      
      // Check if standard is an object
      if (!standard || typeof standard !== 'object') {
        return { isValid: false, error: `Standard ${i + 1} is not a valid object` };
      }

      // Check required fields
      for (const field of requiredStandardFields) {
        if (!(field in standard)) {
          return { isValid: false, error: `Standard ${i + 1} missing required field: ${field}` };
        }
      }

      // Validate field types
      if (typeof standard.id !== 'number' || standard.id <= 0) {
        return { isValid: false, error: `Standard ${i + 1} has invalid ID: must be a positive number` };
      }

      if (typeof standard.code !== 'string' || standard.code.trim() === '') {
        return { isValid: false, error: `Standard ${i + 1} has invalid code: must be a non-empty string` };
      }

      if (typeof standard.description !== 'string') {
        return { isValid: false, error: `Standard ${i + 1} has invalid description: must be a string` };
      }

      if (typeof standard.category !== 'string' || standard.category.trim() === '') {
        return { isValid: false, error: `Standard ${i + 1} has invalid category: must be a non-empty string` };
      }
    }

    // Check for duplicate IDs
    const curriculumIds = data.curriculumRows.map((row: any) => row.id);
    const standardIds = data.standards.map((standard: any) => standard.id);
    
    if (new Set(curriculumIds).size !== curriculumIds.length) {
      return { isValid: false, error: "Duplicate curriculum row IDs found" };
    }

    if (new Set(standardIds).size !== standardIds.length) {
      return { isValid: false, error: "Duplicate standard IDs found" };
    }

    // Validate metadata
    if (!data.metadata.totalCurriculumEntries || typeof data.metadata.totalCurriculumEntries !== 'number') {
      return { isValid: false, error: "Invalid metadata: totalCurriculumEntries must be a number" };
    }

    if (!data.metadata.totalStandards || typeof data.metadata.totalStandards !== 'number') {
      return { isValid: false, error: "Invalid metadata: totalStandards must be a number" };
    }

    if (data.metadata.totalCurriculumEntries !== data.curriculumRows.length) {
      return { isValid: false, error: "Metadata totalCurriculumEntries doesn't match actual curriculum rows count" };
    }

    if (data.metadata.totalStandards !== data.standards.length) {
      return { isValid: false, error: "Metadata totalStandards doesn't match actual standards count" };
    }

    return { 
      isValid: true, 
      error: null,
      gradeCount: grades.size,
      subjectCount: subjects.size
    };
  };

  const currentEditingRowStandards = editingRowId
    ? curriculumRows.find((row) => row.id === editingRowId)?.standards || []
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Bar */}
      <div className="bg-[#172153] text-white w-full">
        <div className="max-w-full px-0.5 sm:px-2 lg:px-12 py-0 sm:py-2 flex items-center justify-between text-[8px] sm:text-sm">
          {/* Left side: contact info */}
          <div className="flex items-center space-x-0 sm:space-x-6">
            <a href="tel:425.641.5570" className="flex items-center space-x-0 hover:opacity-80 transition-opacity">
              <Phone className="w-2 h-2 sm:w-4 sm:h-4" /><span>425.641.5570</span>
            </a>
            <a href="mailto:info@ecswa.org" className="flex items-center space-x-0 hover:opacity-80 transition-opacity">
              <Mail className="w-2 h-2 sm:w-4 sm:h-4" /><span>Contact Us</span>
            </a>
            <a href="https://ecswa.org/new-student-inquiry/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-0 hover:opacity-80 transition-opacity">
              <Landmark className="w-2 h-2 sm:w-4 sm:h-4" /><span>Schedule A Tour</span>
            </a>
            <a href="https://www.ecswa.org/events/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-0 hover:opacity-80 transition-opacity">
              <Calendar className="w-2 h-2 sm:w-4 sm:h-4" /><span>Calendar</span>
            </a>
          </div>
          <div className="flex items-center space-x-0 sm:space-x-4 text-[10px] sm:text-lg">
            <a href="https://www.facebook.com/ECSWA/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Facebook className="w-2 h-2 sm:w-5 sm:h-5" />
            </a>
            <a href="https://www.instagram.com/ecsbellevue/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Instagram className="w-2 h-2 sm:w-5 sm:h-5" />
            </a>
            <a href="https://www.youtube.com/channel/UCCuXOVeXSVDQp1ElLE-HSNA" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Youtube className="w-2 h-2 sm:w-5 sm:h-5" />
            </a>
            <a href="https://x.com/ECSBellevue_" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/x.png" alt="X" className="w-2 h-2 sm:w-5 sm:h-5 object-contain" />
            </a>
            <a href="https://ecswa.org/good-things-at-ecs/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/blogging.png" alt="Blogger" className="w-4 h-4 sm:w-7 sm:h-7 object-contain" />
            </a>
            <a href="https://www.ecswa.org/myecs/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <User className="w-2 h-2 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="px-2 sm:px-4 py-2 w-full flex items-center">
          <a href="https://www.ecswa.org/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="/ECSLogo.png" alt="Eastside Christian School Logo" className="h-10 w-auto mr-6" />
          </a>
          <a href="https://www.ecswa.org/" target="_blank" rel="noopener noreferrer" className="text-[#2d4a7b] font-medium text-sm hover:text-[#1e3a8a] transition-all duration-200 mr-6">
            Home
          </a>
          <div className="hidden lg:flex items-center space-x-4 flex-1">
            {grades.map((grade) => (
              <div
                key={grade}
                className="relative group"
                onMouseEnter={() => setHoveredGrade(grade)}
                onMouseLeave={() => setHoveredGrade(null)}
              >
                <button
                  onClick={() => handleGradeChange(grade)}
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
                      {getSubjectsForGrade(grade).map((subject) => (
                        <button
                          key={subject}
                          onClick={() => {
                            handleGradeChange(grade);
                            handleSubjectChange(subject);
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
          {/* Right side: Hamburger and Current Page (mobile and desktop) */}
          <div className="flex items-center ml-auto space-x-2">
            {/* Hamburger for Mobile */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setMobileNavOpen(true)} className="p-2 focus:outline-none">
                <Menu className="w-7 h-7 text-[#2d4a7b]" />
              </button>
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
        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
            <div className="bg-white w-64 h-full shadow-lg p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-[#2d4a7b] text-lg">Navigation</span>
                <button onClick={() => setMobileNavOpen(false)} className="p-1">
                  <X className="w-6 h-6 text-[#2d4a7b]" />
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-xs text-gray-500 mb-1">Grades</span>
                {grades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => {
                      handleGradeChange(grade);
                      setMobileNavOpen(false);
                    }}
                    className={`text-[#2d4a7b] font-medium text-sm uppercase tracking-wide text-left py-2 px-2 rounded hover:bg-blue-50 ${
                      selectedGrade === grade ? "bg-blue-100" : ""
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              <div className="flex flex-col space-y-2 mt-6">
                <span className="text-xs text-gray-500 mb-1">Subjects</span>
                {getSubjectsForGrade(selectedGrade).map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      handleSubjectChange(subject);
                      setMobileNavOpen(false);
                    }}
                    className={`text-[#2d4a7b] font-medium text-sm tracking-wide text-left py-2 px-2 rounded hover:bg-blue-50 ${
                      selectedSubject === subject ? "bg-blue-100" : ""
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}
      </nav>

      {/* Mobile Subject Selection */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200">
        <div className="px-2 sm:px-4 w-full">
          <div className="flex items-center space-x-2 py-2 overflow-x-auto scrollbar-hide">
            {getSubjectsForGrade(selectedGrade).map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectChange(subject)}
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
      <main className="px-1 sm:px-4 lg:px-6 py-4 sm:py-6 w-full max-w-none">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                {selectedGrade === "Specialists" 
                  ? `${selectedSubject} Specialists` 
                  : `${selectedSubject} ${selectedGrade}`}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                School Year: <span>2025-2026</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Only show buttons for regular subjects, not specialists or admin */}
              {selectedGrade !== "Specialists" && selectedGrade !== "Admin" && (
                <Button
                  onClick={handleAddRow}
                  className="edu-button-accent text-sm px-4 py-2"
                  disabled={createRowMutation.isPending}
                >
                  Add Curriculum Row
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Specialist Grade Tables */}
        {selectedGrade === "Specialists" && !selectedSubject.includes("Grade") && (
          <div className="space-y-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Specialist Curriculum: {selectedSubject}</h2>
            
            {[1, 2, 3, 4, 5].map((gradeNum) => (
              <div key={gradeNum} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Grade {gradeNum}</h3>
                <SpecialistGradeTable 
                  grade={`Grade ${gradeNum}`}
                  subject={selectedSubject}
                />
              </div>
            ))}
          </div>
        )}

        {/* Admin Section */}
        {selectedGrade === "Admin" && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Database Administration</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Export Full Database</h3>
                  <p className="text-blue-700 mb-4">
                    Download the complete curriculum database including all grades, subjects, and standards.
                  </p>
                  <Button
                    onClick={handleExportFullDatabase}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
                    Export Complete Database
                  </Button>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Import Database</h3>
                  <p className="text-orange-700 mb-4">
                    Replace the current database with a new JSON file. This will completely overwrite all existing data.
                  </p>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportDatabase}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>
                  <p className="text-xs text-orange-600 mt-2">
                    ⚠️ Warning: This action will permanently replace all current data. Make sure to export a backup first.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Database Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Total Curriculum Entries:</span>
                      <span className="ml-2 text-gray-900">{allCurriculumRows.length}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Standards:</span>
                      <span className="ml-2 text-gray-900">{standards.length}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Grades Available:</span>
                      <span className="ml-2 text-gray-900">KG, Grade 1-8, Specialists</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Export:</span>
                      <span className="ml-2 text-gray-900">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Table for Regular Subjects */}
        {selectedGrade !== "Specialists" && selectedGrade !== "Admin" && (
          <div className="w-full">
            <CurriculumTable
              rows={curriculumRows}
              standards={standards}
              isLoading={isLoadingRows || isLoadingStandards}
              onEditCell={handleEditCell}
              onEditStandards={handleEditStandards}
              onDeleteRow={handleDeleteRow}
            />
          </div>
        )}

        {/* Stats for Regular Subjects */}
        {selectedGrade !== "Specialists" && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {curriculumRows.length} curriculum entries
            </div>
          </div>
        )}
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
