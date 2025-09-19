import { apiRequest } from "./queryClient";
import type {
  CourseType,
  Course,
  CourseOfferingWithDetails,
  StudentRegistrationWithDetails,
  InsertCourseType,
  InsertCourse,
  InsertCourseOffering,
  InsertStudentRegistration,
} from "@shared/schema";

export const api = {
  // Course Types
  courseTypes: {
    getAll: async (): Promise<CourseType[]> => {
      const response = await apiRequest("GET", "/api/course-types");
      return response.json();
    },
    create: async (data: InsertCourseType): Promise<CourseType> => {
      const response = await apiRequest("POST", "/api/course-types", data);
      return response.json();
    },
    update: async (id: string, data: Partial<InsertCourseType>): Promise<CourseType> => {
      const response = await apiRequest("PUT", `/api/course-types/${id}`, data);
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await apiRequest("DELETE", `/api/course-types/${id}`);
    },
  },

  // Courses
  courses: {
    getAll: async (): Promise<Course[]> => {
      const response = await apiRequest("GET", "/api/courses");
      return response.json();
    },
    create: async (data: InsertCourse): Promise<Course> => {
      const response = await apiRequest("POST", "/api/courses", data);
      return response.json();
    },
    update: async (id: string, data: Partial<InsertCourse>): Promise<Course> => {
      const response = await apiRequest("PUT", `/api/courses/${id}`, data);
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await apiRequest("DELETE", `/api/courses/${id}`);
    },
  },

  // Course Offerings
  courseOfferings: {
    getAll: async (): Promise<CourseOfferingWithDetails[]> => {
      const response = await apiRequest("GET", "/api/course-offerings");
      return response.json();
    },
    create: async (data: InsertCourseOffering): Promise<CourseOfferingWithDetails> => {
      const response = await apiRequest("POST", "/api/course-offerings", data);
      return response.json();
    },
    update: async (id: string, data: Partial<InsertCourseOffering>): Promise<CourseOfferingWithDetails> => {
      const response = await apiRequest("PUT", `/api/course-offerings/${id}`, data);
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await apiRequest("DELETE", `/api/course-offerings/${id}`);
    },
  },

  // Student Registrations
  studentRegistrations: {
    getAll: async (): Promise<StudentRegistrationWithDetails[]> => {
      const response = await apiRequest("GET", "/api/student-registrations");
      return response.json();
    },
    getByOffering: async (offeringId: string): Promise<StudentRegistrationWithDetails[]> => {
      const response = await apiRequest("GET", `/api/student-registrations/by-offering/${offeringId}`);
      return response.json();
    },
    create: async (data: InsertStudentRegistration): Promise<StudentRegistrationWithDetails> => {
      const response = await apiRequest("POST", "/api/student-registrations", data);
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await apiRequest("DELETE", `/api/student-registrations/${id}`);
    },
  },

  // Stats
  stats: {
    get: async (): Promise<{
      courseTypesCount: number;
      coursesCount: number;
      activeOfferingsCount: number;
      totalStudentsCount: number;
    }> => {
      const response = await apiRequest("GET", "/api/stats");
      return response.json();
    },
  },
};
