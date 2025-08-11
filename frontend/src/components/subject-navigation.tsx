import { Button } from "@/components/ui/button";

interface SubjectNavigationProps {
  subjects: string[];
  selectedSubject: string;
  onSubjectSelect: (subject: string) => void;
}

export default function SubjectNavigation({ subjects, selectedSubject, onSubjectSelect }: SubjectNavigationProps) {
  return (
    <div className="edu-nav border-b">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center space-x-6">
          {subjects.map((subject) => (
            <Button
              key={subject}
              variant="ghost"
              size="sm"
              className={
                selectedSubject === subject
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white rounded-t font-medium"
                  : "text-gray-600 hover:text-blue-600 font-medium"
              }
              onClick={() => onSubjectSelect(subject)}
            >
              {subject}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
