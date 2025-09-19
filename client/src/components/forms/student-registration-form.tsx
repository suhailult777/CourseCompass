import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertStudentRegistrationSchema } from "@shared/schema";
import type { InsertStudentRegistration } from "@shared/schema";

export default function StudentRegistrationForm() {
  const [selectedCourseType, setSelectedCourseType] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<InsertStudentRegistration>({
    resolver: zodResolver(insertStudentRegistrationSchema),
    defaultValues: {
      studentName: "",
      email: "",
      phone: "",
      courseOfferingId: "",
    },
  });

  const { data: courseTypes = [] } = useQuery({
    queryKey: ["/api/course-types"],
    queryFn: () => api.courseTypes.getAll(),
  });

  const { data: allOfferings = [] } = useQuery({
    queryKey: ["/api/course-offerings"],
    queryFn: () => api.courseOfferings.getAll(),
  });

  const availableOfferings = selectedCourseType
    ? allOfferings.filter(
        (offering) => 
          offering.courseTypeId === selectedCourseType && 
          offering.status !== "inactive"
      )
    : allOfferings.filter(offering => offering.status !== "inactive");

  const registrationMutation = useMutation({
    mutationFn: (data: InsertStudentRegistration) => api.studentRegistrations.create(data),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({ queryKey: ["/api/student-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/course-offerings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      const statusMessage = registration.status === "confirmed" 
        ? "Student registered successfully!" 
        : "Student added to waitlist.";
      
      toast({
        title: "Registration Complete",
        description: statusMessage,
      });
      
      form.reset();
      setSelectedCourseType("");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register student",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStudentRegistration) => {
    registrationMutation.mutate(data);
  };

  const handleCourseTypeChange = (value: string) => {
    setSelectedCourseType(value);
    form.setValue("courseOfferingId", ""); // Reset course offering selection
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="student-registration-form">
        <FormField
          control={form.control}
          name="studentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter student name"
                  {...field}
                  data-testid="input-student-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  {...field}
                  data-testid="input-email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  {...field}
                  value={field.value || ""}
                  data-testid="input-phone"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Course Type *
          </label>
          <Select value={selectedCourseType} onValueChange={handleCourseTypeChange}>
            <SelectTrigger data-testid="select-course-type">
              <SelectValue placeholder="Select course type" />
            </SelectTrigger>
            <SelectContent>
              {courseTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FormField
          control={form.control}
          name="courseOfferingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Course Offerings *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-course-offering">
                    <SelectValue placeholder="Select course offering" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableOfferings.map((offering) => (
                    <SelectItem 
                      key={offering.id} 
                      value={offering.id}
                      disabled={offering.currentEnrollment >= offering.maxCapacity}
                    >
                      {offering.courseType.name} - {offering.course.name} 
                      ({offering.currentEnrollment}/{offering.maxCapacity} enrolled)
                      {offering.currentEnrollment >= offering.maxCapacity && " - Full"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={registrationMutation.isPending}
          data-testid="button-register-student"
        >
          {registrationMutation.isPending ? "Registering..." : "Register Student"}
        </Button>
      </form>
    </Form>
  );
}
