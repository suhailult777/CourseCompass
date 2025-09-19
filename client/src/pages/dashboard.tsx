import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { List, Book, Calendar, Users } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => api.stats.get(),
  });

  const { data: recentRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ["/api/student-registrations"],
    queryFn: () => api.studentRegistrations.getAll(),
    select: (data) => data.slice(-5).reverse(), // Get 5 most recent
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-course-types">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <List className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Course Types</p>
                <p className="text-2xl font-bold text-foreground" data-testid="count-course-types">
                  {stats?.courseTypesCount ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-courses">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Book className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold text-foreground" data-testid="count-courses">
                  {stats?.coursesCount ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-offerings">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Offerings</p>
                <p className="text-2xl font-bold text-foreground" data-testid="count-active-offerings">
                  {stats?.activeOfferingsCount ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-students">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground" data-testid="count-students">
                  {stats?.totalStudentsCount ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {registrationsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentRegistrations && recentRegistrations.length > 0 ? (
            <div className="space-y-3" data-testid="recent-registrations">
              {recentRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="border border-border rounded-lg p-4"
                  data-testid={`registration-${registration.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground" data-testid="student-name">
                        {registration.studentName}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid="student-email">
                        {registration.email}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid="course-info">
                        {registration.courseOffering.courseType.name} - {registration.courseOffering.course.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground" data-testid="registration-date">
                        {new Date(registration.registrationDate).toLocaleDateString()}
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
            <p className="text-muted-foreground text-center py-8" data-testid="no-registrations">
              No registrations yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
