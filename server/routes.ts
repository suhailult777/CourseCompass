import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCourseTypeSchema, 
  insertCourseSchema, 
  insertCourseOfferingSchema, 
  insertStudentRegistrationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Course Types routes
  app.get("/api/course-types", async (req, res) => {
    try {
      const courseTypes = await storage.getCourseTypes();
      res.json(courseTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course types" });
    }
  });

  app.post("/api/course-types", async (req, res) => {
    try {
      const validated = insertCourseTypeSchema.parse(req.body);
      const courseType = await storage.createCourseType(validated);
      res.status(201).json(courseType);
    } catch (error) {
      res.status(400).json({ message: "Invalid course type data" });
    }
  });

  app.put("/api/course-types/:id", async (req, res) => {
    try {
      const validated = insertCourseTypeSchema.partial().parse(req.body);
      const courseType = await storage.updateCourseType(req.params.id, validated);
      if (!courseType) {
        return res.status(404).json({ message: "Course type not found" });
      }
      res.json(courseType);
    } catch (error) {
      res.status(400).json({ message: "Invalid course type data" });
    }
  });

  app.delete("/api/course-types/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCourseType(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Course type not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course type" });
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validated = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validated);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  app.put("/api/courses/:id", async (req, res) => {
    try {
      const validated = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(req.params.id, validated);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCourse(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Course Offerings routes
  app.get("/api/course-offerings", async (req, res) => {
    try {
      const offerings = await storage.getCourseOfferingsWithDetails();
      res.json(offerings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course offerings" });
    }
  });

  app.get("/api/course-offerings/:id", async (req, res) => {
    try {
      const offering = await storage.getCourseOfferingWithDetails(req.params.id);
      if (!offering) {
        return res.status(404).json({ message: "Course offering not found" });
      }
      res.json(offering);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course offering" });
    }
  });

  app.post("/api/course-offerings", async (req, res) => {
    try {
      const validated = insertCourseOfferingSchema.parse(req.body);
      const offering = await storage.createCourseOffering(validated);
      res.status(201).json(offering);
    } catch (error) {
      res.status(400).json({ message: "Invalid course offering data" });
    }
  });

  app.put("/api/course-offerings/:id", async (req, res) => {
    try {
      const validated = insertCourseOfferingSchema.partial().parse(req.body);
      const offering = await storage.updateCourseOffering(req.params.id, validated);
      if (!offering) {
        return res.status(404).json({ message: "Course offering not found" });
      }
      res.json(offering);
    } catch (error) {
      res.status(400).json({ message: "Invalid course offering data" });
    }
  });

  app.delete("/api/course-offerings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCourseOffering(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Course offering not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course offering" });
    }
  });

  // Student Registrations routes
  app.get("/api/student-registrations", async (req, res) => {
    try {
      const registrations = await storage.getStudentRegistrationsWithDetails();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student registrations" });
    }
  });

  app.get("/api/student-registrations/by-offering/:offeringId", async (req, res) => {
    try {
      const registrations = await storage.getStudentRegistrationsByOffering(req.params.offeringId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student registrations" });
    }
  });

  app.post("/api/student-registrations", async (req, res) => {
    try {
      const validated = insertStudentRegistrationSchema.parse(req.body);
      const registration = await storage.createStudentRegistration(validated);
      res.status(201).json(registration);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid registration data" });
    }
  });

  app.delete("/api/student-registrations/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStudentRegistration(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete registration" });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
