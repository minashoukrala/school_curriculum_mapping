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

  const isLongText = title.includes("objectives") || title.includes("learningTargets") || title.includes("targets");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
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
                className="w-full resize-none"
                placeholder="Enter content..."
              />
            ) : (
              <Input
                id="editContent"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full"
                placeholder="Enter content..."
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="edu-button-primary">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
