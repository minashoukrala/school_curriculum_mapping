import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

import { Standard } from '../../../database/shared/schema';

interface StandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedStandards: string[]) => void;
  selectedStandards: string[];
}

interface HierarchicalStandard extends Standard {
  subject: string;
  grade: string;
  subjectArea: string;
}

export function StandardsModal({ isOpen, onClose, onSave, selectedStandards }: StandardsModalProps) {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [localSelectedStandards, setLocalSelectedStandards] = useState<string[]>(selectedStandards);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchStandards();
      setLocalSelectedStandards(selectedStandards);
    }
  }, [isOpen, selectedStandards]);

  const fetchStandards = async () => {
    try {
      const response = await fetch('/api/standards');
      if (response.ok) {
        const data = await response.json();
        setStandards(data);
      }
    } catch (error) {
      console.error('Error fetching standards:', error);
    }
  };

  const parseHierarchicalStandards = (standards: Standard[]): HierarchicalStandard[] => {
    return standards.map(standard => {
      let subject = 'Other';
      let grade = '';
      let subjectArea = standard.category;

      // Parse Math standards
      if (standard.code.startsWith('K.')) {
        subject = 'Math';
        grade = 'KG';
      } else if (standard.code.startsWith('1.')) {
        subject = 'Math';
        grade = 'Grade 1';
      } else if (standard.code.startsWith('2.')) {
        subject = 'Math';
        grade = 'Grade 2';
      } else if (standard.code.startsWith('3.')) {
        subject = 'Math';
        grade = 'Grade 3';
      } else if (standard.code.startsWith('4.')) {
        subject = 'Math';
        grade = 'Grade 4';
      } else if (standard.code.startsWith('5.')) {
        subject = 'Math';
        grade = 'Grade 5';
      } else if (standard.code.startsWith('6.')) {
        subject = 'Math';
        grade = 'Grade 6';
      } else if (standard.code.startsWith('7.')) {
        subject = 'Math';
        grade = 'Grade 7';
      } else if (standard.code.startsWith('8.')) {
        subject = 'Math';
        grade = 'Grade 8';
      } else if (standard.code.startsWith('MP')) {
        subject = 'Math';
        grade = '';
        subjectArea = 'Mathematical Practices';
      }
      
      // Parse Science standards
      if (standard.code.startsWith('K-')) {
        subject = 'Science';
        grade = 'KG';
      } else if (standard.code.startsWith('1-')) {
        subject = 'Science';
        grade = 'Grade 1';
      } else if (standard.code.startsWith('2-')) {
        subject = 'Science';
        grade = 'Grade 2';
      } else if (standard.code.startsWith('3-')) {
        subject = 'Science';
        grade = 'Grade 3';
      } else if (standard.code.startsWith('4-')) {
        subject = 'Science';
        grade = 'Grade 4';
      } else if (standard.code.startsWith('5-')) {
        subject = 'Science';
        grade = 'Grade 5';
      } else if (standard.code.startsWith('MS-')) {
        subject = 'Science';
        grade = 'MS';
      } else if (standard.code.startsWith('SSS')) {
        subject = 'Social Studies';
        // Extract grade from SSS code (e.g., SSS1.K.1 -> K, SSS1.1.1 -> 1, SSS1.6-8.1 -> MS)
        const gradeMatch = standard.code.match(/SSS\d+\.([K1-5]|6-8)\./);
        if (gradeMatch) {
          const gradeNum = gradeMatch[1];
          if (gradeNum === 'K') {
            grade = 'KG';
          } else if (gradeNum === '6-8') {
            grade = 'MS';
          } else {
            grade = `Grade ${gradeNum}`;
          }
        }
        // Set subjectArea to Social Studies Skills
        subjectArea = 'Social Studies Skills';
      } else if (standard.code.startsWith('C')) {
        subject = 'Social Studies';
        // Extract grade from C code (e.g., C1.K.1 -> K, C1.1.1 -> 1, C1.6-8.1 -> MS)
        const gradeMatch = standard.code.match(/C\d+\.([K1-5]|6-8)\./);
        if (gradeMatch) {
          const gradeNum = gradeMatch[1];
          if (gradeNum === 'K') {
            grade = 'KG';
          } else if (gradeNum === '6-8') {
            grade = 'MS';
          } else {
            grade = `Grade ${gradeNum}`;
          }
        }
        // Set subjectArea to Civics
        subjectArea = 'Civics';
      } else if (standard.code.startsWith('E')) {
        subject = 'Social Studies';
        // Extract grade from E code (e.g., E1.K.1 -> K, E1.1.1 -> 1, E1.6-8.1 -> MS)
        const gradeMatch = standard.code.match(/E\d+\.([K1-5]|6-8)\./);
        if (gradeMatch) {
          const gradeNum = gradeMatch[1];
          if (gradeNum === 'K') {
            grade = 'KG';
          } else if (gradeNum === '6-8') {
            grade = 'MS';
          } else {
            grade = `Grade ${gradeNum}`;
          }
        }
        // Set subjectArea to Economy
        subjectArea = 'Economy';
      } else if (standard.code.startsWith('H')) {
        subject = 'Social Studies';
        // Extract grade from H code (e.g., H1.K.1 -> K, H1.1.1 -> 1, H1.6-8.1 -> MS)
        const gradeMatch = standard.code.match(/H\d+\.([K1-5]|6-8)\./);
        if (gradeMatch) {
          const gradeNum = gradeMatch[1];
          if (gradeNum === 'K') {
            grade = 'KG';
          } else if (gradeNum === '6-8') {
            grade = 'MS';
          } else {
            grade = `Grade ${gradeNum}`;
          }
        }
        // Set subjectArea to History
        subjectArea = 'History';
      } else if (standard.code.startsWith('G')) {
        subject = 'Social Studies';
        // Extract grade from G code (e.g., G1.K.1 -> K, G1.1.1 -> 1, G1.6-8.1 -> MS)
        const gradeMatch = standard.code.match(/G\d+\.([K1-5]|6-8)\./);
        if (gradeMatch) {
          const gradeNum = gradeMatch[1];
          if (gradeNum === 'K') {
            grade = 'KG';
          } else if (gradeNum === '6-8') {
            grade = 'MS';
          } else {
            grade = `Grade ${gradeNum}`;
          }
        }
        // Set subjectArea to Geography
        subjectArea = 'Geography';
      } else if (standard.code.startsWith('WA.ELA-LITERACY.RML')) {
        subject = 'English Language Arts';
        // Extract grade from WA.ELA-LITERACY.RML code (e.g., WA.ELA-LITERACY.RML1st.1 -> 1st, WA.ELA-LITERACY.RMLK.1 -> K, WA.ELA-LITERACY.RML6th.1 -> 6th)
        const gradeMatch = standard.code.match(/WA\.ELA-LITERACY\.RML(\d+[a-z]+|K)\./);
        if (gradeMatch) {
          const gradeText = gradeMatch[1];
          if (gradeText === 'K') {
            grade = 'KG';
          } else if (gradeText === '1st') {
            grade = 'Grade 1';
          } else if (gradeText === '2nd') {
            grade = 'Grade 2';
          } else if (gradeText === '3rd') {
            grade = 'Grade 3';
          } else if (gradeText === '4th') {
            grade = 'Grade 4';
          } else if (gradeText === '5th') {
            grade = 'Grade 5';
          } else if (gradeText === '6th') {
            grade = 'Grade 6';
          } else if (gradeText === '7th') {
            grade = 'Grade 7';
          } else if (gradeText === '8th') {
            grade = 'Grade 8';
          }
        }
        // Set subjectArea to Research & Media Literacy
        subjectArea = 'Research & Media Literacy';
      } else if (standard.code.startsWith('WA.ELA-LITERACY.R')) {
        subject = 'English Language Arts';
        // Extract grade from WA.ELA-LITERACY.R code (e.g., WA.ELA-LITERACY.R1st.1 -> 1st, WA.ELA-LITERACY.RK.1 -> K, WA.ELA-LITERACY.R6th.1 -> 6th)
        const gradeMatch = standard.code.match(/WA\.ELA-LITERACY\.R(\d+[a-z]+|K)\./);
        if (gradeMatch) {
          const gradeText = gradeMatch[1];
          if (gradeText === 'K') {
            grade = 'KG';
          } else if (gradeText === '1st') {
            grade = 'Grade 1';
          } else if (gradeText === '2nd') {
            grade = 'Grade 2';
          } else if (gradeText === '3rd') {
            grade = 'Grade 3';
          } else if (gradeText === '4th') {
            grade = 'Grade 4';
          } else if (gradeText === '5th') {
            grade = 'Grade 5';
          } else if (gradeText === '6th') {
            grade = 'Grade 6';
          } else if (gradeText === '7th') {
            grade = 'Grade 7';
          } else if (gradeText === '8th') {
            grade = 'Grade 8';
          }
        }
        // Set subjectArea to Reading
        subjectArea = 'Reading';
      } else if (standard.code.startsWith('WA.ELA-LITERACY.W')) {
        subject = 'English Language Arts';
        // Extract grade from WA.ELA-LITERACY.W code (e.g., WA.ELA-LITERACY.W1st.1 -> 1st, WA.ELA-LITERACY.WK.1 -> K, WA.ELA-LITERACY.W6th.1 -> 6th)
        const gradeMatch = standard.code.match(/WA\.ELA-LITERACY\.W(\d+[a-z]+|K)\./);
        if (gradeMatch) {
          const gradeText = gradeMatch[1];
          if (gradeText === 'K') {
            grade = 'KG';
          } else if (gradeText === '1st') {
            grade = 'Grade 1';
          } else if (gradeText === '2nd') {
            grade = 'Grade 2';
          } else if (gradeText === '3rd') {
            grade = 'Grade 3';
          } else if (gradeText === '4th') {
            grade = 'Grade 4';
          } else if (gradeText === '5th') {
            grade = 'Grade 5';
          } else if (gradeText === '6th') {
            grade = 'Grade 6';
          } else if (gradeText === '7th') {
            grade = 'Grade 7';
          } else if (gradeText === '8th') {
            grade = 'Grade 8';
          }
        }
        // Set subjectArea to Writing
        subjectArea = 'Writing';
      } else if (standard.code.startsWith('WA.ELA-LITERACY.SLDF')) {
        subject = 'English Language Arts';
        // Extract grade from WA.ELA-LITERACY.SLDF code (e.g., WA.ELA-LITERACY.SLDF1st.1 -> 1st, WA.ELA-LITERACY.SLDFK.1 -> K, WA.ELA-LITERACY.SLDF6th.1 -> 6th)
        const gradeMatch = standard.code.match(/WA\.ELA-LITERACY\.SLDF(\d+[a-z]+|K)\./);
        if (gradeMatch) {
          const gradeText = gradeMatch[1];
          if (gradeText === 'K') {
            grade = 'KG';
          } else if (gradeText === '1st') {
            grade = 'Grade 1';
          } else if (gradeText === '2nd') {
            grade = 'Grade 2';
          } else if (gradeText === '3rd') {
            grade = 'Grade 3';
          } else if (gradeText === '4th') {
            grade = 'Grade 4';
          } else if (gradeText === '5th') {
            grade = 'Grade 5';
          } else if (gradeText === '6th') {
            grade = 'Grade 6';
          } else if (gradeText === '7th') {
            grade = 'Grade 7';
          } else if (gradeText === '8th') {
            grade = 'Grade 8';
          }
        }
        // Set subjectArea to Speaking/Listening
        subjectArea = 'Speaking/Listening';
      } else if (standard.code.startsWith('WA.ELA-LITERACY.L')) {
        subject = 'English Language Arts';
        // Extract grade from WA.ELA-LITERACY.L code (e.g., WA.ELA-LITERACY.L1st.1 -> 1st, WA.ELA-LITERACY.LK.1 -> K, WA.ELA-LITERACY.L6th.1 -> 6th)
        const gradeMatch = standard.code.match(/WA\.ELA-LITERACY\.L(\d+[a-z]+|K)\./);
        if (gradeMatch) {
          const gradeText = gradeMatch[1];
          if (gradeText === 'K') {
            grade = 'KG';
          } else if (gradeText === '1st') {
            grade = 'Grade 1';
          } else if (gradeText === '2nd') {
            grade = 'Grade 2';
          } else if (gradeText === '3rd') {
            grade = 'Grade 3';
          } else if (gradeText === '4th') {
            grade = 'Grade 4';
          } else if (gradeText === '5th') {
            grade = 'Grade 5';
          } else if (gradeText === '6th') {
            grade = 'Grade 6';
          } else if (gradeText === '7th') {
            grade = 'Grade 7';
          } else if (gradeText === '8th') {
            grade = 'Grade 8';
          }
        }
        // Set subjectArea to Language
        subjectArea = 'Language';
      }

      return {
        ...standard,
        subject,
        grade,
        subjectArea
      };
    });
  };

  const filteredStandards = standards.filter(standard =>
    standard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hierarchicalStandards = parseHierarchicalStandards(filteredStandards);

  const standardsBySubject = hierarchicalStandards.reduce((acc, standard) => {
    if (!acc[standard.subject]) {
      acc[standard.subject] = {};
    }

    // Special handling for Social Studies and English Language Arts to organize by category first
    if (standard.subject === 'Social Studies') {
      if (!acc[standard.subject][standard.subjectArea]) {
        acc[standard.subject][standard.subjectArea] = {};
      }
      if (standard.grade) {
        if (!acc[standard.subject][standard.subjectArea][standard.grade]) {
          acc[standard.subject][standard.subjectArea][standard.grade] = {};
        }
        // Use the original category for the final grouping
        const originalCategory = standard.category;
        if (!acc[standard.subject][standard.subjectArea][standard.grade][originalCategory]) {
          acc[standard.subject][standard.subjectArea][standard.grade][originalCategory] = [];
        }
        acc[standard.subject][standard.subjectArea][standard.grade][originalCategory].push(standard);
      }
    } else if (standard.subject === 'English Language Arts') {
      // For ELA, organize by subjectArea (category) first, then grade, then standards directly
      if (!acc[standard.subject][standard.subjectArea]) {
        acc[standard.subject][standard.subjectArea] = {};
      }
      if (standard.grade) {
        if (!acc[standard.subject][standard.subjectArea][standard.grade]) {
          acc[standard.subject][standard.subjectArea][standard.grade] = [];
        }
        acc[standard.subject][standard.subjectArea][standard.grade].push(standard);
      }
    } else {
      // Original logic for other subjects
      if (standard.grade) {
        // Grade level standards
        if (!acc[standard.subject][standard.grade]) {
          acc[standard.subject][standard.grade] = {};
        }
        if (!acc[standard.subject][standard.grade][standard.subjectArea]) {
          acc[standard.subject][standard.grade][standard.subjectArea] = [];
        }
        acc[standard.subject][standard.grade][standard.subjectArea].push(standard);
      } else if (standard.subjectArea) {
        // Subject areas without grade (like Mathematical Practices)
        if (!acc[standard.subject].subjectAreas) {
          acc[standard.subject].subjectAreas = {};
        }
        if (!acc[standard.subject].subjectAreas[standard.subjectArea]) {
          acc[standard.subject].subjectAreas[standard.subjectArea] = [];
        }
        acc[standard.subject].subjectAreas[standard.subjectArea].push(standard);
      } else {
        // Direct standards
        if (!acc[standard.subject].standards) {
          acc[standard.subject].standards = [];
        }
        acc[standard.subject].standards.push(standard);
      }
    }

    return acc;
  }, {} as Record<string, any>);

  const toggleSubjectExpanded = (subject: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedSubjects(newExpanded);
  };

  const toggleGradeExpanded = (grade: string) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(grade)) {
      newExpanded.delete(grade);
    } else {
      newExpanded.add(grade);
    }
    setExpandedGrades(newExpanded);
  };

  const handleStandardToggle = (code: string) => {
    const newSelected = new Set(localSelectedStandards);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setLocalSelectedStandards(Array.from(newSelected));
  };

  const handleSubjectAreaToggle = (standards: Standard[]) => {
    const standardCodes = standards.map(s => s.code);
    const allSelected = standardCodes.every(code => localSelectedStandards.includes(code));
    
    const newSelected = new Set(localSelectedStandards);
    if (allSelected) {
      standardCodes.forEach(code => newSelected.delete(code));
    } else {
      standardCodes.forEach(code => newSelected.add(code));
    }
    setLocalSelectedStandards(Array.from(newSelected));
  };

  const handleCancel = () => {
    setLocalSelectedStandards(selectedStandards);
    onClose();
  };

  const handleSave = () => {
    onSave(localSelectedStandards);
    onClose();
  };

  const getGradeNumber = (str: string) => {
    if (str === 'KG') return 0;
    if (str === 'MS') return 6; // MS comes after Grade 5
    if (str.startsWith('Grade ')) {
      const num = parseInt(str.replace('Grade ', ''));
      return isNaN(num) ? 999 : num;
    }
    return 999;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Standards</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search standards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Standards List */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3 sm:space-y-4 p-4">
            {Object.entries(standardsBySubject).map(([subject, subjectData]) => {
              const isExpanded = expandedSubjects.has(subject);
              
              // Special sorting for Social Studies (by category first)
              let sortedSections;
              if (subject === 'Social Studies') {
                // For Social Studies, sort by category first, then by grade
                sortedSections = Object.entries(subjectData).sort(([a], [b]) => {
                  // Define category order
                  const categoryOrder = ['Social Studies Skills', 'Civics', 'Economy', 'Geography', 'History'];
                  const indexA = categoryOrder.indexOf(a);
                  const indexB = categoryOrder.indexOf(b);
                  return indexA - indexB;
                });
              } else {
                // For other subjects, sort by grade
                sortedSections = Object.entries(subjectData).sort(([a], [b]) => {
                  const gradeA = getGradeNumber(a);
                  const gradeB = getGradeNumber(b);
                  return gradeA - gradeB;
                });
              }

              return (
                <div key={subject} className="border border-gray-200 rounded-lg">
                  {/* Subject Header */}
                  <div className="flex items-center space-x-2 p-3 bg-gray-50">
                    <button
                      onClick={() => toggleSubjectExpanded(subject)}
                      className="flex items-center space-x-2 text-left font-semibold text-gray-800 hover:text-blue-600"
                    >
                      <span>{subject}</span>
                      <span>{isExpanded ? '▼' : '▶'}</span>
                    </button>
                  </div>
                  
                  {/* Subject Content */}
                  {isExpanded && (
                    <div className="p-3 space-y-3">
                      {sortedSections.map(([section, sectionData]) => {
                        if (section === 'standards') {
                          // Direct standards (non-Math)
                          const standards = sectionData as Standard[];
                          return (
                            <div key="standards" className="space-y-2">
                              {standards.map((standard) => (
                                <label
                                  key={standard.code}
                                  className="flex items-start space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded touch-manipulation"
                                >
                                  <Checkbox
                                    checked={localSelectedStandards.includes(standard.code)}
                                    onCheckedChange={() => handleStandardToggle(standard.code)}
                                    className="mt-1 min-w-[18px] min-h-[18px] sm:min-w-[20px] sm:min-h-[20px]"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm sm:text-sm break-words">{standard.code}</div>
                                    <div className="text-sm text-gray-600 break-words">{standard.description}</div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          );
                        }

                        if (section === 'subjectAreas') {
                          // Subject areas without grade (like Mathematical Practices)
                          const subjectAreas = sectionData as Record<string, Standard[]>;
                          return (
                            <div key="subjectAreas" className="space-y-3">
                              {Object.entries(subjectAreas).map(([subjectArea, standards]) => {
                                const allSelected = standards.every(s => localSelectedStandards.includes(s.code));
                                const someSelected = standards.some(s => localSelectedStandards.includes(s.code));

                                return (
                                  <div key={subjectArea} className="border border-gray-100 rounded p-2">
                                    {/* Subject Area Header */}
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={() => handleSubjectAreaToggle(standards)}
                                        className={`min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                                      />
                                      <h5 className="font-medium text-gray-700 text-sm">{subjectArea}</h5>
                                    </div>
                                    
                                    {/* Standards */}
                                    <div className="pl-4 space-y-1">
                                      {standards.map((standard) => (
                                        <label
                                          key={standard.code}
                                          className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded touch-manipulation"
                                        >
                                          <Checkbox
                                            checked={localSelectedStandards.includes(standard.code)}
                                            onCheckedChange={() => handleStandardToggle(standard.code)}
                                            className="mt-1 min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px]"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-xs sm:text-sm break-words">{standard.code}</div>
                                            <div className="text-xs text-gray-600 break-words">{standard.description}</div>
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }

                        // Handle different structures based on subject
                        if (subject === 'Social Studies') {
                          // Social Studies: Category -> Grade -> Subject Areas -> Standards
                          const categoryData = sectionData as Record<string, Record<string, Standard[]>>;
                          const isCategoryExpanded = expandedGrades.has(section);
                          const allCategoryStandards = Object.values(categoryData).flatMap(gradeData => 
                            Object.values(gradeData).flat()
                          );
                          const allSelected = allCategoryStandards.every(s => localSelectedStandards.includes(s.code));
                          const someSelected = allCategoryStandards.some(s => localSelectedStandards.includes(s.code));

                          return (
                            <div key={section} className="border-l-2 border-gray-200 pl-3">
                              {/* Category Header */}
                              <div className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={() => handleSubjectAreaToggle(allCategoryStandards)}
                                  className={`min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                                />
                                <button
                                  onClick={() => toggleGradeExpanded(section)}
                                  className="flex items-center space-x-2 text-left font-medium text-gray-800 text-sm sm:text-base hover:text-blue-600"
                                >
                                  <span>{section}</span>
                                  <span>{isCategoryExpanded ? '▼' : '▶'}</span>
                                </button>
                              </div>
                              
                              {/* Category Content */}
                              {isCategoryExpanded && (
                                <div className="space-y-3">
                                  {Object.entries(categoryData)
                                    .sort(([a], [b]) => {
                                      const gradeA = getGradeNumber(a);
                                      const gradeB = getGradeNumber(b);
                                      return gradeA - gradeB;
                                    })
                                    .map(([grade, gradeData]) => {
                                    const isGradeExpanded = expandedGrades.has(`${section}-${grade}`);
                                    const allGradeStandards = Object.values(gradeData).flat();
                                    const allSelected = allGradeStandards.every(s => localSelectedStandards.includes(s.code));
                                    const someSelected = allGradeStandards.some(s => localSelectedStandards.includes(s.code));

                                    return (
                                      <div key={grade} className="border-l-2 border-gray-200 pl-3">
                                        {/* Grade Header */}
                                        <div className="flex items-center space-x-2 mb-2">
                                          <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={() => handleSubjectAreaToggle(allGradeStandards)}
                                            className={`min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                                          />
                                          <button
                                            onClick={() => toggleGradeExpanded(`${section}-${grade}`)}
                                            className="flex items-center space-x-2 text-left font-medium text-gray-800 text-sm hover:text-blue-600"
                                          >
                                            <span>{grade}</span>
                                            <span>{isGradeExpanded ? '▼' : '▶'}</span>
                                          </button>
                                        </div>
                                        
                                        {/* Grade Content */}
                                        {isGradeExpanded && (
                                          <div className="space-y-3">
                                            {Object.entries(gradeData).map(([subjectArea, standards]) => {
                                              const allSelected = standards.every(s => localSelectedStandards.includes(s.code));
                                              const someSelected = standards.some(s => localSelectedStandards.includes(s.code));

                                              return (
                                                <div key={subjectArea} className="border border-gray-100 rounded p-2">
                                                  {/* Subject Area Header */}
                                                  <div className="flex items-center space-x-2 mb-2">
                                                    <Checkbox
                                                      checked={allSelected}
                                                      onCheckedChange={() => handleSubjectAreaToggle(standards)}
                                                      className={`min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                                                    />
                                                    <h5 className="font-medium text-gray-700 text-sm">{subjectArea}</h5>
                                                  </div>
                                                  
                                                  {/* Standards */}
                                                  <div className="pl-4 space-y-1">
                                                    {standards.map((standard) => (
                                                      <label
                                                        key={standard.code}
                                                        className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded touch-manipulation"
                                                      >
                                                        <Checkbox
                                                          checked={localSelectedStandards.includes(standard.code)}
                                                          onCheckedChange={() => handleStandardToggle(standard.code)}
                                                          className="mt-1 min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px]"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                          <div className="font-medium text-xs sm:text-sm break-words">{standard.code}</div>
                                                          <div className="text-xs text-gray-600 break-words">{standard.description}</div>
                                                        </div>
                                                      </label>
                                                    ))}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        } else if (subject === 'English Language Arts') {
                          // English Language Arts: Category -> Grade -> Standards
                          const categoryData = sectionData as Record<string, Standard[]>;
                          const isCategoryExpanded = expandedGrades.has(section);
                          const allCategoryStandards = Object.values(categoryData).flat();
                          const allSelected = allCategoryStandards.every(s => localSelectedStandards.includes(s.code));
                          const someSelected = allCategoryStandards.some(s => localSelectedStandards.includes(s.code));

                          return (
                            <div key={section} className="border-l-2 border-gray-200 pl-3">
                              {/* Category Header */}
                              <div className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={() => handleSubjectAreaToggle(allCategoryStandards)}
                                  className={`min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                                />
                                <button
                                  onClick={() => toggleGradeExpanded(section)}
                                  className="flex items-center space-x-2 text-left font-medium text-gray-800 text-sm sm:text-base hover:text-blue-600"
                                >
                                  <span>{section}</span>
                                  <span>{isCategoryExpanded ? '▼' : '▶'}</span>
                                </button>
                              </div>
                              
                              {/* Category Content */}
                              {isCategoryExpanded && (
                                <div className="space-y-3">
                                  {Object.entries(categoryData)
                                    .sort(([a], [b]) => {
                                      const gradeA = getGradeNumber(a);
                                      const gradeB = getGradeNumber(b);
                                      return gradeA - gradeB;
                                    })
                                    .map(([grade, standards]) => {
                                    const isGradeExpanded = expandedGrades.has(`${section}-${grade}`);
                                    const allSelected = standards.every(s => localSelectedStandards.includes(s.code));
                                    const someSelected = standards.some(s => localSelectedStandards.includes(s.code));

                                    return (
                                      <div key={grade} className="border-l-2 border-gray-200 pl-3">
                                        {/* Grade Header */}
                                        <div className="flex items-center space-x-2 mb-2">
                                          <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={() => handleSubjectAreaToggle(standards)}
                                            className={`min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                                          />
                                          <button
                                            onClick={() => toggleGradeExpanded(`${section}-${grade}`)}
                                            className="flex items-center space-x-2 text-left font-medium text-gray-800 text-sm hover:text-blue-600"
                                          >
                                            <span>{grade}</span>
                                            <span>{isGradeExpanded ? '▼' : '▶'}</span>
                                          </button>
                                        </div>
                                        
                                        {/* Grade Content */}
                                        {isGradeExpanded && (
                                          <div className="space-y-1">
                                            {standards.map((standard) => (
                                              <label
                                                key={standard.code}
                                                className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded touch-manipulation"
                                              >
                                                <Checkbox
                                                  checked={localSelectedStandards.includes(standard.code)}
                                                  onCheckedChange={() => handleStandardToggle(standard.code)}
                                                  className="mt-1 min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px]"
                                                />
                                                <div className="flex-1 min-w-0">
                                                  <div className="font-medium text-xs sm:text-sm break-words">{standard.code}</div>
                                                  <div className="text-xs text-gray-600 break-words">{standard.description}</div>
                                                </div>
                                              </label>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          // Grade level (Math, Science, etc.)
                          const gradeStandards = sectionData as Record<string, Standard[]>;
                          const isGradeExpanded = expandedGrades.has(section);
                          const allGradeStandards = Object.values(gradeStandards).flat();
                          const allSelected = allGradeStandards.every(s => localSelectedStandards.includes(s.code));
                          const someSelected = allGradeStandards.some(s => localSelectedStandards.includes(s.code));

                          return (
                            <div key={section} className="border-l-2 border-gray-200 pl-3">
                              {/* Grade Header */}
                              <div className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={() => handleSubjectAreaToggle(allGradeStandards)}
                                  className={`min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                                />
                                <button
                                  onClick={() => toggleGradeExpanded(section)}
                                  className="flex items-center space-x-2 text-left font-medium text-gray-800 text-sm sm:text-base hover:text-blue-600"
                                >
                                  <span>{section}</span>
                                  <span>{isGradeExpanded ? '▼' : '▶'}</span>
                                </button>
                              </div>
                              
                              {/* Grade Content */}
                              {isGradeExpanded && (
                                <div className="space-y-3">
                                  {Object.entries(gradeStandards).map(([subjectArea, standards]) => {
                                    const allSelected = standards.every(s => localSelectedStandards.includes(s.code));
                                    const someSelected = standards.some(s => localSelectedStandards.includes(s.code));

                                    return (
                                      <div key={subjectArea} className="border border-gray-100 rounded p-2">
                                        {/* Subject Area Header */}
                                        <div className="flex items-center space-x-2 mb-2">
                                          <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={() => handleSubjectAreaToggle(standards)}
                                            className={`min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                                          />
                                          <h5 className="font-medium text-gray-700 text-sm">{subjectArea}</h5>
                                        </div>
                                        
                                        {/* Standards */}
                                        <div className="pl-4 space-y-1">
                                          {standards.map((standard) => (
                                            <label
                                              key={standard.code}
                                              className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded touch-manipulation"
                                            >
                                              <Checkbox
                                                checked={localSelectedStandards.includes(standard.code)}
                                                onCheckedChange={() => handleStandardToggle(standard.code)}
                                                className="mt-1 min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px]"
                                              />
                                              <div className="flex-1 min-w-0">
                                                <div className="font-medium text-xs sm:text-sm break-words">{standard.code}</div>
                                                <div className="text-xs text-gray-600 break-words">{standard.description}</div>
                                              </div>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-2 sm:space-y-0 pt-3 sm:pt-4 border-t">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            {localSelectedStandards.length} standards selected
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-4 py-2">
              Cancel
            </Button>
            <Button onClick={handleSave} className="edu-button-primary w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-4 py-2">
              Apply Standards
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
