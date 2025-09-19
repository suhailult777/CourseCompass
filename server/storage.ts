import {
  type CourseType,
  type Course,
  type CourseOffering,
  type StudentRegistration,
  type InsertCourseType,
  type InsertCourse,
  type InsertCourseOffering,
  type InsertStudentRegistration,
  type CourseOfferingWithDetails,
  type StudentRegistrationWithDetails,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCourseTypes(): Promise<CourseType[]>;
  getCourseType(id: string): Promise<CourseType | undefined>;
  createCourseType(courseType: InsertCourseType): Promise<CourseType>;
  updateCourseType(
    id: string,
    courseType: Partial<InsertCourseType>
  ): Promise<CourseType | undefined>;
  deleteCourseType(id: string): Promise<boolean>;

  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(
    id: string,
    course: Partial<InsertCourse>
  ): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<boolean>;

  getCourseOfferings(): Promise<CourseOffering[]>;
  getCourseOfferingsWithDetails(): Promise<CourseOfferingWithDetails[]>;
  getCourseOffering(id: string): Promise<CourseOffering | undefined>;
  getCourseOfferingWithDetails(
    id: string
  ): Promise<CourseOfferingWithDetails | undefined>;
  createCourseOffering(offering: InsertCourseOffering): Promise<CourseOffering>;
  updateCourseOffering(
    id: string,
    offering: Partial<InsertCourseOffering>
  ): Promise<CourseOffering | undefined>;
  deleteCourseOffering(id: string): Promise<boolean>;

  getStudentRegistrations(): Promise<StudentRegistration[]>;
  getStudentRegistrationsWithDetails(): Promise<
    StudentRegistrationWithDetails[]
  >;
  getStudentRegistrationsByOffering(
    offeringId: string
  ): Promise<StudentRegistrationWithDetails[]>;
  createStudentRegistration(
    registration: InsertStudentRegistration
  ): Promise<StudentRegistration>;
  deleteStudentRegistration(id: string): Promise<boolean>;

  getStats(): Promise<{
    courseTypesCount: number;
    coursesCount: number;
    activeOfferingsCount: number;
    totalStudentsCount: number;
  }>;
}

export class MemStorage implements IStorage {
  private courseTypes: Map<string, CourseType> = new Map();
  private courses: Map<string, Course> = new Map();
  private courseOfferings: Map<string, CourseOffering> = new Map();
  private studentRegistrations: Map<string, StudentRegistration> = new Map();

  constructor() {
    this.initializeData().catch(console.error);
  }

  private async initializeData() {
    const individual = await this.createCourseType({ name: "Individual" });
    const group = await this.createCourseType({ name: "Group" });
    const special = await this.createCourseType({ name: "Special" });

    const english = await this.createCourse({
      name: "English Grammar",
      language: "English",
    });
    const hindi = await this.createCourse({
      name: "Hindi Literature",
      language: "Hindi",
    });
    const urdu = await this.createCourse({
      name: "Urdu Poetry",
      language: "Urdu",
    });

    await this.createCourseOffering({
      courseId: english.id,
      courseTypeId: individual.id,
      maxCapacity: 10,
      status: "active",
    });
    await this.createCourseOffering({
      courseId: english.id,
      courseTypeId: group.id,
      maxCapacity: 20,
      status: "active",
    });
    await this.createCourseOffering({
      courseId: hindi.id,
      courseTypeId: individual.id,
      maxCapacity: 15,
      status: "active",
    });
    await this.createCourseOffering({
      courseId: hindi.id,
      courseTypeId: group.id,
      maxCapacity: 25,
      status: "active",
    });
    await this.createCourseOffering({
      courseId: urdu.id,
      courseTypeId: special.id,
      maxCapacity: 12,
      status: "active",
    });
  }

  async getCourseTypes(): Promise<CourseType[]> {
    return Array.from(this.courseTypes.values());
  }

  async getCourseType(id: string): Promise<CourseType | undefined> {
    return this.courseTypes.get(id);
  }

  async createCourseType(
    insertCourseType: InsertCourseType
  ): Promise<CourseType> {
    const id = randomUUID();
    const courseType: CourseType = {
      ...insertCourseType,
      id,
      createdAt: new Date(),
    };
    this.courseTypes.set(id, courseType);
    return courseType;
  }

  async updateCourseType(
    id: string,
    updates: Partial<InsertCourseType>
  ): Promise<CourseType | undefined> {
    const existing = this.courseTypes.get(id);
    if (!existing) return undefined;

    const updated: CourseType = { ...existing, ...updates };
    this.courseTypes.set(id, updated);
    return updated;
  }

  async deleteCourseType(id: string): Promise<boolean> {
    return this.courseTypes.delete(id);
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      ...insertCourse,
      id,
      createdAt: new Date(),
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(
    id: string,
    updates: Partial<InsertCourse>
  ): Promise<Course | undefined> {
    const existing = this.courses.get(id);
    if (!existing) return undefined;

    const updated: Course = { ...existing, ...updates };
    this.courses.set(id, updated);
    return updated;
  }

  async deleteCourse(id: string): Promise<boolean> {
    return this.courses.delete(id);
  }

  async getCourseOfferings(): Promise<CourseOffering[]> {
    return Array.from(this.courseOfferings.values());
  }

  async getCourseOfferingsWithDetails(): Promise<CourseOfferingWithDetails[]> {
    const offerings = Array.from(this.courseOfferings.values());
    const offeringsWithDetails: CourseOfferingWithDetails[] = [];

    for (const offering of offerings) {
      const course = this.courses.get(offering.courseId);
      const courseType = this.courseTypes.get(offering.courseTypeId);

      if (course && courseType) {
        offeringsWithDetails.push({
          ...offering,
          course,
          courseType,
        });
      }
    }

    return offeringsWithDetails;
  }

  async getCourseOffering(id: string): Promise<CourseOffering | undefined> {
    return this.courseOfferings.get(id);
  }

  async getCourseOfferingWithDetails(
    id: string
  ): Promise<CourseOfferingWithDetails | undefined> {
    const offering = this.courseOfferings.get(id);
    if (!offering) return undefined;

    const course = this.courses.get(offering.courseId);
    const courseType = this.courseTypes.get(offering.courseTypeId);

    if (!course || !courseType) return undefined;

    return {
      ...offering,
      course,
      courseType,
    };
  }

  async createCourseOffering(
    insertOffering: InsertCourseOffering
  ): Promise<CourseOffering> {
    const id = randomUUID();
    const offering: CourseOffering = {
      ...insertOffering,
      id,
      currentEnrollment: 0,
      maxCapacity: insertOffering.maxCapacity ?? 15,
      status: insertOffering.status ?? "active",
      createdAt: new Date(),
    };
    this.courseOfferings.set(id, offering);
    return offering;
  }

  async updateCourseOffering(
    id: string,
    updates: Partial<InsertCourseOffering>
  ): Promise<CourseOffering | undefined> {
    const existing = this.courseOfferings.get(id);
    if (!existing) return undefined;

    const updated: CourseOffering = { ...existing, ...updates };
    this.courseOfferings.set(id, updated);
    return updated;
  }

  async deleteCourseOffering(id: string): Promise<boolean> {
    return this.courseOfferings.delete(id);
  }

  async getStudentRegistrations(): Promise<StudentRegistration[]> {
    return Array.from(this.studentRegistrations.values());
  }

  async getStudentRegistrationsWithDetails(): Promise<
    StudentRegistrationWithDetails[]
  > {
    const registrations = Array.from(this.studentRegistrations.values());
    const registrationsWithDetails: StudentRegistrationWithDetails[] = [];

    for (const registration of registrations) {
      const offeringWithDetails = await this.getCourseOfferingWithDetails(
        registration.courseOfferingId
      );

      if (offeringWithDetails) {
        registrationsWithDetails.push({
          ...registration,
          courseOffering: offeringWithDetails,
        });
      }
    }

    return registrationsWithDetails;
  }

  async getStudentRegistrationsByOffering(
    offeringId: string
  ): Promise<StudentRegistrationWithDetails[]> {
    const allRegistrations = await this.getStudentRegistrationsWithDetails();
    return allRegistrations.filter(
      (reg) => reg.courseOfferingId === offeringId
    );
  }

  async createStudentRegistration(
    insertRegistration: InsertStudentRegistration
  ): Promise<StudentRegistration> {
    const id = randomUUID();

    const offering = this.courseOfferings.get(
      insertRegistration.courseOfferingId
    );
    if (!offering) {
      throw new Error("Course offering not found");
    }

    const status =
      offering.currentEnrollment < offering.maxCapacity
        ? "confirmed"
        : "waitlisted";

    const registration: StudentRegistration = {
      ...insertRegistration,
      id,
      status,
      phone: insertRegistration.phone ?? null,
      registrationDate: new Date(),
    };

    this.studentRegistrations.set(id, registration);

    if (status === "confirmed") {
      offering.currentEnrollment += 1;
      offering.status =
        offering.currentEnrollment >= offering.maxCapacity ? "full" : "active";
      this.courseOfferings.set(offering.id, offering);
    }

    return registration;
  }

  async deleteStudentRegistration(id: string): Promise<boolean> {
    const registration = this.studentRegistrations.get(id);
    if (!registration) return false;

    const deleted = this.studentRegistrations.delete(id);

    if (deleted && registration.status === "confirmed") {
      const offering = this.courseOfferings.get(registration.courseOfferingId);
      if (offering) {
        offering.currentEnrollment = Math.max(
          0,
          offering.currentEnrollment - 1
        );
        offering.status =
          offering.currentEnrollment >= offering.maxCapacity
            ? "full"
            : "active";
        this.courseOfferings.set(offering.id, offering);
      }
    }

    return deleted;
  }

  async getStats(): Promise<{
    courseTypesCount: number;
    coursesCount: number;
    activeOfferingsCount: number;
    totalStudentsCount: number;
  }> {
    const activeOfferings = Array.from(this.courseOfferings.values()).filter(
      (o) => o.status === "active" || o.status === "full"
    );

    return {
      courseTypesCount: this.courseTypes.size,
      coursesCount: this.courses.size,
      activeOfferingsCount: activeOfferings.length,
      totalStudentsCount: this.studentRegistrations.size,
    };
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
