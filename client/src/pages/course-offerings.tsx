import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CourseOfferingForm from "@/components/forms/course-offering-form";
import { Edit, Trash2, Plus, Users } from "lucide-react";
import type { CourseOfferingWithDetails } from "@shared/schema";

export default function CourseOfferings() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<CourseOfferingWithDetails | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: offerings = [], isLoading } = useQuery({
    queryKey: ["/api/course-offerings"],
    queryFn: () => api.courseOfferings.getAll(),
  });

  const { data: courseTypes = [] } = useQuery({
    queryKey: ["/api/course-types"],
    queryFn: () => api.courseTypes.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.courseOfferings.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-offerings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Course offering deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete course offering",
        variant: "destructive",
      });
    },
  });

  const filteredOfferings = selectedTypeFilter === "all" 
    ? offerings 
    : offerings.filter(offering => offering.courseTypeId === selectedTypeFilter);

  const handleEdit = (offering: CourseOfferingWithDetails) => {
    setEditingOffering(offering);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course offering?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingOffering(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "full":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle>Course Offerings</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Select value={selectedTypeFilter} onValueChange={setSelectedTypeFilter}>
                <SelectTrigger className="w-[200px]" data-testid="filter-course-type">
                  <SelectValue placeholder="Filter by course type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Course Types</SelectItem>
                  {courseTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => setIsFormOpen(true)}
                data-testid="create-offering-button"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Offering
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOfferings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="course-offerings-grid">
              {filteredOfferings.map((offering) => (
                <div
                  key={offering.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  data-testid={`offering-${offering.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground" data-testid="offering-title">
                        {offering.courseType.name} - {offering.course.name}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid="course-language">
                        Language: {offering.course.language}
                      </p>
                    </div>
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offering.status)}`}
                      data-testid="offering-status"
                    >
                      {offering.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Enrolled Students:</span>
                      <span className="font-medium text-foreground" data-testid="enrollment-count">
                        {offering.currentEnrollment}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Capacity:</span>
                      <span className="font-medium text-foreground" data-testid="max-capacity">
                        {offering.maxCapacity}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      data-testid={`view-students-${offering.id}`}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View Students
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(offering)}
                      data-testid={`edit-offering-${offering.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(offering.id)}
                      data-testid={`delete-offering-${offering.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8" data-testid="no-offerings">
              No course offerings found.
            </p>
          )}
        </CardContent>
      </Card>

      <CourseOfferingForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        offering={editingOffering}
      />
    </div>
  );
}
