import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq, desc, and } from "drizzle-orm";
import {
  courseTypes,
  courses,
  courseOfferings,
  studentRegistrations,
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
import type { IStorage } from "./storage";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export class DatabaseStorage implements IStorage {
  async getCourseTypes(): Promise<CourseType[]> {
    return await db
      .select()
      .from(courseTypes)
      .orderBy(desc(courseTypes.createdAt));
  }

  async getCourseType(id: string): Promise<CourseType | undefined> {
    const result = await db
      .select()
      .from(courseTypes)
      .where(eq(courseTypes.id, id));
    return result[0];
  }

  async createCourseType(courseType: InsertCourseType): Promise<CourseType> {
    const result = await db.insert(courseTypes).values(courseType).returning();
    return result[0];
  }

  async updateCourseType(
    id: string,
    updates: Partial<InsertCourseType>
  ): Promise<CourseType | undefined> {
    const result = await db
      .update(courseTypes)
      .set(updates)
      .where(eq(courseTypes.id, id))
      .returning();
    return result[0];
  }

  async deleteCourseType(id: string): Promise<boolean> {
    const result = await db.delete(courseTypes).where(eq(courseTypes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id));
    return result[0];
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  async updateCourse(
    id: string,
    updates: Partial<InsertCourse>
  ): Promise<Course | undefined> {
    const result = await db
      .update(courses)
      .set(updates)
      .where(eq(courses.id, id))
      .returning();
    return result[0];
  }

  async deleteCourse(id: string): Promise<boolean> {
    const result = await db.delete(courses).where(eq(courses.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getCourseOfferings(): Promise<CourseOffering[]> {
    return await db
      .select()
      .from(courseOfferings)
      .orderBy(desc(courseOfferings.createdAt));
  }

  async getCourseOfferingsWithDetails(): Promise<CourseOfferingWithDetails[]> {
    const result = await db
      .select()
      .from(courseOfferings)
      .leftJoin(courses, eq(courseOfferings.courseId, courses.id))
      .leftJoin(courseTypes, eq(courseOfferings.courseTypeId, courseTypes.id))
      .orderBy(desc(courseOfferings.createdAt));

    return result.map((row) => ({
      ...row.course_offerings,
      course: row.courses!,
      courseType: row.course_types!,
    }));
  }

  async getCourseOffering(id: string): Promise<CourseOffering | undefined> {
    const result = await db
      .select()
      .from(courseOfferings)
      .where(eq(courseOfferings.id, id));
    return result[0];
  }

  async getCourseOfferingWithDetails(
    id: string
  ): Promise<CourseOfferingWithDetails | undefined> {
    const result = await db
      .select()
      .from(courseOfferings)
      .leftJoin(courses, eq(courseOfferings.courseId, courses.id))
      .leftJoin(courseTypes, eq(courseOfferings.courseTypeId, courseTypes.id))
      .where(eq(courseOfferings.id, id));

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.course_offerings,
      course: row.courses!,
      courseType: row.course_types!,
    };
  }

  async createCourseOffering(
    offering: InsertCourseOffering
  ): Promise<CourseOffering> {
    const result = await db
      .insert(courseOfferings)
      .values(offering)
      .returning();
    return result[0];
  }

  async updateCourseOffering(
    id: string,
    updates: Partial<InsertCourseOffering>
  ): Promise<CourseOffering | undefined> {
    const result = await db
      .update(courseOfferings)
      .set(updates)
      .where(eq(courseOfferings.id, id))
      .returning();
    return result[0];
  }

  async deleteCourseOffering(id: string): Promise<boolean> {
    const result = await db
      .delete(courseOfferings)
      .where(eq(courseOfferings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getStudentRegistrations(): Promise<StudentRegistration[]> {
    return await db
      .select()
      .from(studentRegistrations)
      .orderBy(desc(studentRegistrations.registrationDate));
  }

  async getStudentRegistrationsWithDetails(): Promise<
    StudentRegistrationWithDetails[]
  > {
    const result = await db
      .select()
      .from(studentRegistrations)
      .leftJoin(
        courseOfferings,
        eq(studentRegistrations.courseOfferingId, courseOfferings.id)
      )
      .leftJoin(courses, eq(courseOfferings.courseId, courses.id))
      .leftJoin(courseTypes, eq(courseOfferings.courseTypeId, courseTypes.id))
      .orderBy(desc(studentRegistrations.registrationDate));

    return result.map((row) => ({
      ...row.student_registrations,
      courseOffering: {
        ...row.course_offerings!,
        course: row.courses!,
        courseType: row.course_types!,
      },
    }));
  }

  async getStudentRegistrationsByOffering(
    offeringId: string
  ): Promise<StudentRegistrationWithDetails[]> {
    const result = await db
      .select()
      .from(studentRegistrations)
      .leftJoin(
        courseOfferings,
        eq(studentRegistrations.courseOfferingId, courseOfferings.id)
      )
      .leftJoin(courses, eq(courseOfferings.courseId, courses.id))
      .leftJoin(courseTypes, eq(courseOfferings.courseTypeId, courseTypes.id))
      .where(eq(studentRegistrations.courseOfferingId, offeringId))
      .orderBy(desc(studentRegistrations.registrationDate));

    return result.map((row) => ({
      ...row.student_registrations,
      courseOffering: {
        ...row.course_offerings!,
        course: row.courses!,
        courseType: row.course_types!,
      },
    }));
  }

  async createStudentRegistration(
    registration: InsertStudentRegistration
  ): Promise<StudentRegistration> {
    const currentOffering = await db
      .select()
      .from(courseOfferings)
      .where(eq(courseOfferings.id, registration.courseOfferingId));

    if (currentOffering.length === 0) {
      throw new Error("Course offering not found");
    }

    await db
      .update(courseOfferings)
      .set({
        currentEnrollment: currentOffering[0].currentEnrollment + 1,
      })
      .where(eq(courseOfferings.id, registration.courseOfferingId));

    const result = await db
      .insert(studentRegistrations)
      .values(registration)
      .returning();
    return result[0];
  }

  async deleteStudentRegistration(id: string): Promise<boolean> {
    const registration = await db
      .select()
      .from(studentRegistrations)
      .where(eq(studentRegistrations.id, id));

    if (registration.length === 0) return false;

    const currentOffering = await db
      .select()
      .from(courseOfferings)
      .where(eq(courseOfferings.id, registration[0].courseOfferingId));

    const result = await db
      .delete(studentRegistrations)
      .where(eq(studentRegistrations.id, id));

    if ((result.rowCount ?? 0) > 0 && currentOffering.length > 0) {
      await db
        .update(courseOfferings)
        .set({
          currentEnrollment: currentOffering[0].currentEnrollment - 1,
        })
        .where(eq(courseOfferings.id, registration[0].courseOfferingId));
    }

    return (result.rowCount ?? 0) > 0;
  }

  async getStats(): Promise<{
    courseTypesCount: number;
    coursesCount: number;
    activeOfferingsCount: number;
    totalStudentsCount: number;
  }> {
    const [courseTypesResult, coursesResult, offeringsResult, studentsResult] =
      await Promise.all([
        db.select().from(courseTypes),
        db.select().from(courses),
        db
          .select()
          .from(courseOfferings)
          .where(eq(courseOfferings.status, "active")),
        db.select().from(studentRegistrations),
      ]);

    return {
      courseTypesCount: courseTypesResult.length,
      coursesCount: coursesResult.length,
      activeOfferingsCount: offeringsResult.length,
      totalStudentsCount: studentsResult.length,
    };
  }
}
