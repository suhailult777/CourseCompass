import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CourseForm from "@/components/forms/course-form";
import DataTable from "@/components/ui/data-table";
import { Edit, Trash2, Plus } from "lucide-react";
import type { Course } from "@shared/schema";

export default function Courses() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: () => api.courses.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.courses.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCourse(null);
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id" as keyof Course,
      cell: (value: string) => <span className="font-mono text-sm">{value.slice(0, 8)}...</span>,
    },
    {
      header: "Course Name",
      accessorKey: "name" as keyof Course,
      cell: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Language",
      accessorKey: "language" as keyof Course,
      cell: (value: string) => <span className="text-muted-foreground">{value}</span>,
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof Course,
      cell: (value: string, row: Course) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
            data-testid={`edit-course-${value}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(value)}
            data-testid={`delete-course-${value}`}
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
            <CardTitle>Courses Management</CardTitle>
            <Button 
              onClick={() => setIsFormOpen(true)}
              data-testid="add-course-button"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={courses}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No courses found."
            testId="courses-table"
          />
        </CardContent>
      </Card>

      <CourseForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        course={editingCourse}
      />
    </div>
  );
}
