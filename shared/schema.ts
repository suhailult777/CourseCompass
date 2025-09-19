import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const courseTypes = pgTable("course_types", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  language: text("language").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courseOfferings = pgTable("course_offerings", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar("course_id")
    .references(() => courses.id)
    .notNull(),
  courseTypeId: varchar("course_type_id")
    .references(() => courseTypes.id)
    .notNull(),
  maxCapacity: integer("max_capacity").notNull().default(15),
  currentEnrollment: integer("current_enrollment").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentRegistrations = pgTable("student_registrations", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentName: text("student_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  courseOfferingId: varchar("course_offering_id")
    .references(() => courseOfferings.id)
    .notNull(),
  status: text("status").notNull().default("confirmed"),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
});

export const insertCourseTypeSchema = createInsertSchema(courseTypes).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertCourseOfferingSchema = createInsertSchema(
  courseOfferings
).omit({
  id: true,
  createdAt: true,
  currentEnrollment: true,
});

export const insertStudentRegistrationSchema = createInsertSchema(
  studentRegistrations
).omit({
  id: true,
  registrationDate: true,
  status: true,
});

export type CourseType = typeof courseTypes.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseOffering = typeof courseOfferings.$inferSelect;
export type StudentRegistration = typeof studentRegistrations.$inferSelect;

export type InsertCourseType = z.infer<typeof insertCourseTypeSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertCourseOffering = z.infer<typeof insertCourseOfferingSchema>;
export type InsertStudentRegistration = z.infer<
  typeof insertStudentRegistrationSchema
>;

export type CourseOfferingWithDetails = CourseOffering & {
  course: Course;
  courseType: CourseType;
};

export type StudentRegistrationWithDetails = StudentRegistration & {
  courseOffering: CourseOfferingWithDetails;
};
