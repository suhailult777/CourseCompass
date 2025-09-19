import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCourseTypeSchema } from "@shared/schema";
import type { CourseType, InsertCourseType } from "@shared/schema";

interface CourseTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  courseType?: CourseType | null;
}

export default function CourseTypeForm({ isOpen, onClose, courseType }: CourseTypeFormProps) {
  const { toast } = useToast();
  const isEdit = !!courseType;

  const form = useForm<InsertCourseType>({
    resolver: zodResolver(insertCourseTypeSchema),
    defaultValues: {
      name: courseType?.name ?? "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertCourseType) => api.courseTypes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Course type created successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create course type",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertCourseType) => api.courseTypes.update(courseType!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-types"] });
      toast({
        title: "Success",
        description: "Course type updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update course type",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCourseType) => {
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
      <DialogContent data-testid="course-type-form-modal">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Course Type" : "Add New Course Type"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="course-type-form">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Type Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Individual, Group, Special"
                      {...field}
                      data-testid="input-course-type-name"
                    />
                  </FormControl>
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
