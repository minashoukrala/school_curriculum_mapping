import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Standard } from "@shared/schema";

interface StandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  standards: Standard[];
  selectedStandards: string[];
  onSave: (selectedStandards: string[]) => void;
}

interface HierarchicalStandard extends Standard {
  subject: string;
  grade: string;
  subjectArea: string;
}

export default function StandardsModal({
  isOpen,
  onClose,
  standards,
  selectedStandards,
  onSave,
}: StandardsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedStandards, setLocalSelectedStandards] = useState<string[]>(selectedStandards);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLocalSelectedStandards(selectedStandards);
  }, [selectedStandards, isOpen]);

  // Function to parse standards into hierarchical structure
  const parseHierarchicalStandards = (standards: Standard[]): HierarchicalStandard[] => {
    return standards.map(standard => {
      // For Math standards, extract grade and subject area
      if (standard.code.startsWith('K.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'KG',
          subjectArea: standard.category
        };
      }
      
      // For Grade 1 Math standards
      if (standard.code.startsWith('1.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'Grade 1',
          subjectArea: standard.category
        };
      }
      
      // For Grade 2 Math standards
      if (standard.code.startsWith('2.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'Grade 2',
          subjectArea: standard.category
        };
      }
      
      // For Grade 3 Math standards
      if (standard.code.startsWith('3.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'Grade 3',
          subjectArea: standard.category
        };
      }
      
      // For Grade 4 Math standards
      if (standard.code.startsWith('4.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'Grade 4',
          subjectArea: standard.category
        };
      }
      
      // For Grade 5 Math standards
      if (standard.code.startsWith('5.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'Grade 5',
          subjectArea: standard.category
        };
      }
      
      // For Grade 6 Math standards
      if (standard.code.startsWith('6.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'Grade 6',
          subjectArea: standard.category
        };
      }
      
      // For Grade 7 Math standards
      if (standard.code.startsWith('7.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'Grade 7',
          subjectArea: standard.category
        };
      }
      
      // For Grade 8 Math standards
      if (standard.code.startsWith('8.')) {
        return {
          ...standard,
          subject: 'Math',
          grade: 'Grade 8',
          subjectArea: standard.category
        };
      }
      
      // For Mathematical Practices, place them directly under Math (not under KG)
      if (standard.code.startsWith('MP')) {
        return {
          ...standard,
          subject: 'Math',
          grade: '',
          subjectArea: standard.category
        };
      }
      
      // For other standards, use the category as subject
      return {
        ...standard,
        subject: standard.category,
        grade: '',
        subjectArea: ''
      };
    });
  };

  const hierarchicalStandards = parseHierarchicalStandards(standards);

  const filteredStandards = hierarchicalStandards.filter(
    (standard) =>
      standard.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      standard.subjectArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      standard.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group standards by subject
  const standardsBySubject = filteredStandards.reduce((acc, standard) => {
    if (!acc[standard.subject]) {
      acc[standard.subject] = {};
    }
    
    if (standard.grade) {
      // Standards with grade level (like KG, Grade 1, Grade 2)
      if (!acc[standard.subject][standard.grade]) {
        acc[standard.subject][standard.grade] = {};
      }
      
      if (!acc[standard.subject][standard.grade][standard.subjectArea]) {
        acc[standard.subject][standard.grade][standard.subjectArea] = [];
      }
      acc[standard.subject][standard.grade][standard.subjectArea].push(standard);
    } else if (standard.subjectArea) {
      // Standards without grade but with subject area (like Mathematical Practices)
      if (!acc[standard.subject]['subjectAreas']) {
        acc[standard.subject]['subjectAreas'] = {};
      }
      
      if (!acc[standard.subject]['subjectAreas'][standard.subjectArea]) {
        acc[standard.subject]['subjectAreas'][standard.subjectArea] = [];
      }
      acc[standard.subject]['subjectAreas'][standard.subjectArea].push(standard);
    } else {
      // Other standards (non-Math)
      if (!acc[standard.subject]['standards']) {
        acc[standard.subject]['standards'] = [];
      }
      acc[standard.subject]['standards'].push(standard);
    }
    
    return acc;
  }, {} as Record<string, any>);

  const handleStandardToggle = (code: string) => {
    setLocalSelectedStandards(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleSubjectAreaToggle = (standards: Standard[]) => {
    const allSelected = standards.every(s => localSelectedStandards.includes(s.code));
    
    if (allSelected) {
      // Deselect all in subject area
      setLocalSelectedStandards(prev =>
        prev.filter(code => !standards.some(s => s.code === code))
      );
    } else {
      // Select all in subject area
      const newCodes = standards.map(s => s.code);
      setLocalSelectedStandards(prev => 
        Array.from(new Set([...prev, ...newCodes]))
      );
    }
  };



  const toggleSubjectExpanded = (subject: string) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subject)) {
        newSet.delete(subject);
      } else {
        newSet.add(subject);
      }
      return newSet;
    });
  };

  const toggleGradeExpanded = (grade: string) => {
    setExpandedGrades(prev => {
      const newSet = new Set(prev);
      if (newSet.has(grade)) {
        newSet.delete(grade);
      } else {
        newSet.add(grade);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    onSave(localSelectedStandards);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedStandards(selectedStandards);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-4xl mx-2 sm:mx-auto max-h-[95vh] sm:max-h-[80vh] overflow-hidden p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-xl">Select Standards</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by subject, grade, or standard code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-base"
          />
        </div>

        {/* Standards List */}
        <ScrollArea className="flex-1 max-h-[65vh] sm:max-h-[50vh]">
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(standardsBySubject).map(([subject, subjectData]) => {
              const isExpanded = expandedSubjects.has(subject);

              return (
                <div key={subject} className="border border-gray-200 rounded-lg p-2 sm:p-4">
                  {/* Subject Header */}
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <button
                      onClick={() => toggleSubjectExpanded(subject)}
                      className="flex-1 text-left font-semibold text-gray-900 text-sm sm:text-base hover:text-blue-600"
                    >
                      {subject} {isExpanded ? '▼' : '▶'}
                    </button>
                  </div>
                  
                                     {/* Subject Content */}
                   {isExpanded && (
                     <div className="pl-2 sm:pl-6 space-y-3">
                       {(() => {
                         // Sort sections to ensure proper order: KG, Grade 1-8, then others
                         const sortedSections = Object.entries(subjectData).sort(([a], [b]) => {
                           // Extract grade numbers for comparison
                           const getGradeNumber = (str: string) => {
                             if (str === 'KG') return 0;
                             if (str.startsWith('Grade ')) {
                               const num = parseInt(str.replace('Grade ', ''));
                               return isNaN(num) ? 999 : num;
                             }
                             return 999; // Other sections come last
                           };
                           
                           const gradeA = getGradeNumber(a);
                           const gradeB = getGradeNumber(b);
                           
                           return gradeA - gradeB;
                         });
                         
                         return sortedSections.map(([section, sectionData]) => {
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
                       });
                     </div>
                   )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

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
