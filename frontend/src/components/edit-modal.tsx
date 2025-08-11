import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onSave: (value: string) => void;
}

export default function EditModal({
  isOpen,
  onClose,
  title,
  value,
  onSave,
}: EditModalProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value, isOpen]);

  const handleSave = () => {
    onSave(localValue);
    onClose();
  };

  const handleCancel = () => {
    setLocalValue(value);
    onClose();
  };

  // Use textarea for long text fields
  const isLongText = ["objectives", "assessments", "materials", "biblical", "differentiator"].some(f => title.toLowerCase().includes(f));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm mx-auto my-4 max-h-[90vh] rounded-lg p-2 sm:max-w-2xl sm:mx-4 sm:my-0 sm:p-6 sm:rounded-lg sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-xl">
            {title.charAt(0).toUpperCase() + title.slice(1).replace(/([A-Z])/g, ' $1')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="editContent" className="text-sm font-medium text-gray-700 mb-2 block">
              Content
            </Label>
            {isLongText ? (
              <Textarea
                id="editContent"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                rows={6}
                className="w-full resize-none text-sm sm:text-base"
                placeholder="Enter content..."
              />
            ) : (
              <Input
                id="editContent"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full text-sm sm:text-base"
                placeholder="Enter content..."
              />
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-4 py-2">
            Cancel
          </Button>
          <Button onClick={handleSave} className="edu-button-primary w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-4 py-2">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
