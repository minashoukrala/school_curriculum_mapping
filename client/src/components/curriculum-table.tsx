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
        {/* Desktop Loading */}
        <div className="hidden lg:block">
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
        
        {/* Mobile Loading */}
        <div className="lg:hidden p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
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

      {/* Mobile/Tablet Card Layout */}
      <div className="lg:hidden">
        {rows.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No curriculum entries found for this grade and subject.</p>
            <p className="text-sm mt-1">Click "Add Curriculum Row" to get started.</p>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                {/* Card Header with Actions */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Curriculum Entry</h3>
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

                {/* Objectives */}
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Key Course Objectives
                  </label>
                  <div 
                    className="mt-1 p-3 bg-white rounded border border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onEditCell(row, "objectives")}
                  >
                    <span className="text-sm text-gray-900">{row.objectives || "Click to add objectives..."}</span>
                  </div>
                </div>

                {/* Unit Pacing */}
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Unit Pacing
                  </label>
                  <div 
                    className="mt-1 p-3 bg-white rounded border border-gray-200 min-h-[40px] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onEditCell(row, "unitPacing")}
                  >
                    <span className="text-sm text-gray-900">{row.unitPacing || "Click to add pacing..."}</span>
                  </div>
                </div>

                {/* Learning Targets */}
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Essential Learning Targets
                  </label>
                  <div 
                    className="mt-1 p-3 bg-white rounded border border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onEditCell(row, "learningTargets")}
                  >
                    <span className="text-sm text-gray-900">{row.learningTargets || "Click to add targets..."}</span>
                  </div>
                </div>

                {/* Standards */}
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Standards
                  </label>
                  <div className="mt-1 p-3 bg-white rounded border border-gray-200 space-y-2">
                    {row.standards && row.standards.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {row.standards.join(", ")}
                        </div>
                        <div className="text-xs text-gray-600">
                          {row.standards.map(code => standardsMap.get(code)).filter(Boolean).join("; ")}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No standards selected</div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-xs"
                      onClick={() => onEditStandards(row.id)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit Standards
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}