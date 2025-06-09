import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
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

export default function StandardsModal({
  isOpen,
  onClose,
  standards,
  selectedStandards,
  onSave,
}: StandardsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedStandards, setLocalSelectedStandards] = useState<string[]>(selectedStandards);

  useEffect(() => {
    setLocalSelectedStandards(selectedStandards);
  }, [selectedStandards, isOpen]);

  const filteredStandards = standards.filter(
    (standard) =>
      standard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      standard.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const standardsByCategory = filteredStandards.reduce((acc, standard) => {
    if (!acc[standard.category]) {
      acc[standard.category] = [];
    }
    acc[standard.category].push(standard);
    return acc;
  }, {} as Record<string, Standard[]>);

  const handleStandardToggle = (code: string) => {
    setLocalSelectedStandards(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleCategoryToggle = (category: string) => {
    const categoryStandards = standardsByCategory[category] || [];
    const allSelected = categoryStandards.every(s => localSelectedStandards.includes(s.code));
    
    if (allSelected) {
      // Deselect all in category
      setLocalSelectedStandards(prev =>
        prev.filter(code => !categoryStandards.some(s => s.code === code))
      );
    } else {
      // Select all in category
      const newCodes = categoryStandards.map(s => s.code);
      setLocalSelectedStandards(prev => 
        [...new Set([...prev, ...newCodes])]
      );
    }
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
      <DialogContent className="max-w-4xl mx-4 sm:mx-auto max-h-[90vh] sm:max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Select Standards</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search standards by code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-base"
          />
        </div>

        {/* Standards List */}
        <ScrollArea className="flex-1 max-h-[40vh] sm:max-h-[50vh]">
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(standardsByCategory).map(([category, categoryStandards]) => {
              const allSelected = categoryStandards.every(s => localSelectedStandards.includes(s.code));
              const someSelected = categoryStandards.some(s => localSelectedStandards.includes(s.code));

              return (
                <div key={category} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => handleCategoryToggle(category)}
                      className={`min-w-[20px] min-h-[20px] ${someSelected && !allSelected ? "data-[state=checked]:bg-blue-600" : ""}`}
                    />
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{category}</h4>
                  </div>
                  
                  <div className="pl-4 sm:pl-6 space-y-2">
                    {categoryStandards.map((standard) => (
                      <label
                        key={standard.code}
                        className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded touch-manipulation"
                      >
                        <Checkbox
                          checked={localSelectedStandards.includes(standard.code)}
                          onCheckedChange={() => handleStandardToggle(standard.code)}
                          className="mt-1 min-w-[20px] min-h-[20px]"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{standard.code}</div>
                          <div className="text-xs sm:text-sm text-gray-600">{standard.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0 pt-4 border-t">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            {localSelectedStandards.length} standards selected
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSave} className="edu-button-primary w-full sm:w-auto">
              Apply Standards
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
