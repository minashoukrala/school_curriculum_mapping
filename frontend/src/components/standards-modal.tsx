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
    const newSelected = localSelectedStandards.includes(code)
      ? localSelectedStandards.filter(s => s !== code)
      : [...localSelectedStandards, code];
    setLocalSelectedStandards(newSelected);
  };

  const handleSubjectAreaToggle = (standards: Standard[]) => {
    const allSelected = standards.every(s => localSelectedStandards.includes(s.code));
    const newSelected = allSelected
      ? localSelectedStandards.filter(s => !standards.some(standard => standard.code === s))
      : [...localSelectedStandards, ...standards.map(s => s.code).filter(code => !localSelectedStandards.includes(code))];
    setLocalSelectedStandards(newSelected);
  };

  const handleSave = () => {
    onSave(localSelectedStandards);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedStandards(selectedStandards);
    onClose();
  };

  const getGradeNumber = (str: string) => {
    if (str === 'KG') return 0;
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
              
              // Sort sections: KG, Grade 1-8, then others
              const sortedSections = Object.entries(subjectData).sort(([a], [b]) => {
                const gradeA = getGradeNumber(a);
                const gradeB = getGradeNumber(b);
                return gradeA - gradeB;
              });

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

                        // Grade level (Math)
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
