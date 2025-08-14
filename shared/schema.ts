import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  uhid: text("uhid").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  doctorId: varchar("doctor_id").references(() => users.id).notNull(),
  chiefComplaint: text("chief_complaint"),
  symptomDetails: jsonb("symptom_details"),
  examinationFindings: jsonb("examination_findings"),
  investigations: jsonb("investigations"),
  diagnosis: text("diagnosis"),
  prescription: jsonb("prescription"),
  redFlags: jsonb("red_flags"),
  status: text("status").default("in_progress"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicines = pgTable("medicines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  strengths: jsonb("strengths"),
  category: text("category"),
  interactions: jsonb("interactions"),
});

export const prescriptionTemplates = pgTable("prescription_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  condition: text("condition"),
  medications: jsonb("medications"),
  doctorId: varchar("doctor_id").references(() => users.id),
  isPublic: boolean("is_public").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPatientSchema = createInsertSchema(patients).pick({
  name: true,
  age: true,
  gender: true,
  uhid: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).pick({
  patientId: true,
  doctorId: true,
  chiefComplaint: true,
  symptomDetails: true,
  examinationFindings: true,
  investigations: true,
  diagnosis: true,
  prescription: true,
  redFlags: true,
  status: true,
});

export const insertMedicineSchema = createInsertSchema(medicines).pick({
  name: true,
  genericName: true,
  strengths: true,
  category: true,
  interactions: true,
});

export const insertPrescriptionTemplateSchema = createInsertSchema(prescriptionTemplates).pick({
  name: true,
  condition: true,
  medications: true,
  doctorId: true,
  isPublic: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = typeof medicines.$inferSelect;
export type InsertPrescriptionTemplate = z.infer<typeof insertPrescriptionTemplateSchema>;
export type PrescriptionTemplate = typeof prescriptionTemplates.$inferSelect;
