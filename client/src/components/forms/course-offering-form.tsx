import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCourseOfferingSchema } from "@shared/schema";
import type { CourseOfferingWithDetails, InsertCourseOffering } from "@shared/schema";

interface CourseOfferingFormProps {
  isOpen: boolean;
  onClose: () => void;
  offering?: CourseOfferingWithDetails | null;
}

export default function CourseOfferingForm({ isOpen, onClose, offering }: CourseOfferingFormProps) {
  const { toast } = useToast();
  const isEdit = !!offering;

  const form = useForm<InsertCourseOffering>({
    resolver: zodResolver(insertCourseOfferingSchema),
    defaultValues: {
      courseId: offering?.courseId ?? "",
      courseTypeId: offering?.courseTypeId ?? "",
      maxCapacity: offering?.maxCapacity ?? 15,
      status: offering?.status ?? "active",
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: () => api.courses.getAll(),
  });

  const { data: courseTypes = [] } = useQuery({
    queryKey: ["/api/course-types"],
    queryFn: () => api.courseTypes.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertCourseOffering) => api.courseOfferings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-offerings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Course offering created successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create course offering",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertCourseOffering) => api.courseOfferings.update(offering!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-offerings"] });
      toast({
        title: "Success",
        description: "Course offering updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update course offering",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCourseOffering) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent data-testid="course-offering-form-modal">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Course Offering" : "Create New Course Offering"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="course-offering-form">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-course">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} ({course.language})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-course-type">
                        <SelectValue placeholder="Select a course type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Capacity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      data-testid="input-max-capacity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-submit"
              >
                {(createMutation.isPending || updateMutation.isPending) 
                  ? "Saving..." 
                  : (isEdit ? "Update" : "Create")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
