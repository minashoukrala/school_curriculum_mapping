import { Button } from "@/components/ui/button";

interface GradeNavigationProps {
  grades: string[];
  selectedGrade: string;
  onGradeSelect: (grade: string) => void;
}

export default function GradeNavigation({ grades, selectedGrade, onGradeSelect }: GradeNavigationProps) {
  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {grades.map((grade) => (
        <Button
          key={grade}
          variant={selectedGrade === grade ? "default" : "ghost"}
          size="sm"
          className={
            selectedGrade === grade
              ? "bg-white shadow-sm border border-gray-200 text-gray-900"
              : "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm"
          }
          onClick={() => onGradeSelect(grade)}
        >
          {grade}
        </Button>
      ))}
    </div>
  );
}
