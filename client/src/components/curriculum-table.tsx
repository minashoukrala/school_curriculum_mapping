import { Pencil, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CurriculumRow, Standard } from "@shared/schema";

interface CurriculumTableProps {
  rows: CurriculumRow[];
  standards: Standard[];
  isLoading: boolean;
  onEditCell: (row: CurriculumRow, field: string) => void;
  onEditStandards: (rowId: number) => void;
  onDeleteRow: (id: number) => void;
}

export default function CurriculumTable({
  rows,
  standards,
  isLoading,
  onEditCell,
  onEditStandards,
  onDeleteRow,
}: CurriculumTableProps) {
  const standardsMap = new Map(standards.map(s => [s.code, s.description]));

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="curriculum-table-header">
          <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-700">
            <div className="col-span-4">KEY COURSE OBJECTIVES / ENDURING UNDERSTANDINGS</div>
            <div className="col-span-2">UNIT PACING</div>
            <div className="col-span-3">ESSENTIAL LEARNING TARGETS</div>
            <div className="col-span-2">STANDARDS</div>
            <div className="col-span-1">ACTIONS</div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-12 gap-4">
              <Skeleton className="col-span-4 h-20" />
              <Skeleton className="col-span-2 h-20" />
              <Skeleton className="col-span-3 h-20" />
              <Skeleton className="col-span-2 h-20" />
              <Skeleton className="col-span-1 h-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="curriculum-table-header">
        <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-700">
          <div className="col-span-4">KEY COURSE OBJECTIVES / ENDURING UNDERSTANDINGS</div>
          <div className="col-span-2">UNIT PACING</div>
          <div className="col-span-3">ESSENTIAL LEARNING TARGETS</div>
          <div className="col-span-2">STANDARDS</div>
          <div className="col-span-1">ACTIONS</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No curriculum entries found for this grade and subject.</p>
            <p className="text-sm mt-1">Click "Add Curriculum Row" to get started.</p>
          </div>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-4 p-3 hover:bg-gray-50 transition-colors">
              {/* Objectives */}
              <div className="col-span-4">
                <div 
                  className="editable-cell"
                  onClick={() => onEditCell(row, "objectives")}
                >
                  <span className="text-sm">{row.objectives || "Click to add objectives..."}</span>
                </div>
              </div>

              {/* Unit Pacing */}
              <div className="col-span-2">
                <div 
                  className="editable-cell"
                  onClick={() => onEditCell(row, "unitPacing")}
                >
                  <span className="text-sm">{row.unitPacing || "Click to add pacing..."}</span>
                </div>
              </div>

              {/* Learning Targets */}
              <div className="col-span-3">
                <div 
                  className="editable-cell"
                  onClick={() => onEditCell(row, "learningTargets")}
                >
                  <span className="text-sm">{row.learningTargets || "Click to add targets..."}</span>
                </div>
              </div>

              {/* Standards */}
              <div className="col-span-2">
                <div className="p-2">
                  {row.standards && row.standards.length > 0 ? (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        {row.standards.join(", ")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {row.standards.map(code => standardsMap.get(code)).filter(Boolean).join("; ")}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No standards selected</div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                    onClick={() => onEditStandards(row.id)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit Standards
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                    onClick={() => onEditCell(row, "objectives")}
                    title="Edit Row"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                    onClick={() => onDeleteRow(row.id)}
                    title="Delete Row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
