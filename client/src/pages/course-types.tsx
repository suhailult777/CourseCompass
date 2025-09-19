import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CourseTypeForm from "@/components/forms/course-type-form";
import DataTable from "@/components/ui/data-table";
import { Edit, Trash2, Plus } from "lucide-react";
import type { CourseType } from "@shared/schema";

export default function CourseTypes() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourseType, setEditingCourseType] = useState<CourseType | null>(null);
  const { toast } = useToast();

  const { data: courseTypes = [], isLoading } = useQuery({
    queryKey: ["/api/course-types"],
    queryFn: () => api.courseTypes.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.courseTypes.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Course type deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete course type",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (courseType: CourseType) => {
    setEditingCourseType(courseType);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course type?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCourseType(null);
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id" as keyof CourseType,
      cell: (value: string) => <span className="font-mono text-sm">{value.slice(0, 8)}...</span>,
    },
    {
      header: "Name",
      accessorKey: "name" as keyof CourseType,
      cell: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Created",
      accessorKey: "createdAt" as keyof CourseType,
      cell: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof CourseType,
      cell: (value: string, row: CourseType) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
            data-testid={`edit-course-type-${value}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(value)}
            data-testid={`delete-course-type-${value}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle>Course Types Management</CardTitle>
            <Button 
              onClick={() => setIsFormOpen(true)}
              data-testid="add-course-type-button"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={courseTypes}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No course types found."
            testId="course-types-table"
          />
        </CardContent>
      </Card>

      <CourseTypeForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        courseType={editingCourseType}
      />
    </div>
  );
}
