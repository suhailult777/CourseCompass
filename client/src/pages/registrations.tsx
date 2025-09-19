import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import StudentRegistrationForm from "@/components/forms/student-registration-form";

export default function Registrations() {
  const { data: recentRegistrations = [], isLoading } = useQuery({
    queryKey: ["/api/student-registrations"],
    queryFn: () => api.studentRegistrations.getAll(),
    select: (data) => data.slice(-10).reverse(),
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Register New Student</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentRegistrationForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recentRegistrations.length > 0 ? (
              <div
                className="space-y-3"
                data-testid="recent-registrations-list"
              >
                {recentRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="border border-border rounded-lg p-4"
                    data-testid={`registration-item-${registration.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4
                          className="font-medium text-foreground"
                          data-testid="student-name"
                        >
                          {registration.studentName}
                        </h4>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid="student-email"
                        >
                          {registration.email}
                        </p>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid="course-info"
                        >
                          {registration.courseOffering.courseType.name} -{" "}
                          {registration.courseOffering.course.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-xs text-muted-foreground"
                          data-testid="registration-date"
                        >
                          {new Date(
                            registration.registrationDate
                          ).toLocaleDateString()}
                        </span>
                        <div className="mt-1">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              registration.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                            data-testid="registration-status"
                          >
                            {registration.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="text-muted-foreground text-center py-8"
                data-testid="no-registrations"
              >
                No registrations yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
