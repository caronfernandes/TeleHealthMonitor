import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertConsultationSchema, insertMedicineSchema, insertPrescriptionTemplateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Patient routes
  app.get("/api/patients/:uhid", async (req, res) => {
    try {
      const patient = await storage.getPatientByUhid(req.params.uhid);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ message: "Invalid patient data" });
    }
  });

  // Consultation routes
  app.get("/api/consultations/:id", async (req, res) => {
    try {
      const consultation = await storage.getConsultation(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      res.json(consultation);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/patients/:patientId/consultations", async (req, res) => {
    try {
      const consultations = await storage.getConsultationsByPatient(req.params.patientId);
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);
      res.status(201).json(consultation);
    } catch (error) {
      res.status(400).json({ message: "Invalid consultation data" });
    }
  });

  app.patch("/api/consultations/:id", async (req, res) => {
    try {
      const consultation = await storage.updateConsultation(req.params.id, req.body);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      res.json(consultation);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Medicine routes
  app.get("/api/medicines", async (req, res) => {
    try {
      const query = req.query.search as string;
      if (query) {
        const medicines = await storage.searchMedicines(query);
        res.json(medicines);
      } else {
        const medicines = await storage.getMedicines();
        res.json(medicines);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/medicines", async (req, res) => {
    try {
      const validatedData = insertMedicineSchema.parse(req.body);
      const medicine = await storage.createMedicine(validatedData);
      res.status(201).json(medicine);
    } catch (error) {
      res.status(400).json({ message: "Invalid medicine data" });
    }
  });

  // Prescription template routes
  app.get("/api/prescription-templates", async (req, res) => {
    try {
      const templates = await storage.getPrescriptionTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/prescription-templates/:id", async (req, res) => {
    try {
      const template = await storage.getPrescriptionTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/prescription-templates", async (req, res) => {
    try {
      const validatedData = insertPrescriptionTemplateSchema.parse(req.body);
      const template = await storage.createPrescriptionTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
