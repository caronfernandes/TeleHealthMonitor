import { type User, type InsertUser, type Patient, type InsertPatient, type Consultation, type InsertConsultation, type Medicine, type InsertMedicine, type PrescriptionTemplate, type InsertPrescriptionTemplate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByUhid(uhid: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  
  getConsultation(id: string): Promise<Consultation | undefined>;
  getConsultationsByPatient(patientId: string): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: string, consultation: Partial<Consultation>): Promise<Consultation | undefined>;
  
  getMedicines(): Promise<Medicine[]>;
  searchMedicines(query: string): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  
  getPrescriptionTemplates(): Promise<PrescriptionTemplate[]>;
  getPrescriptionTemplate(id: string): Promise<PrescriptionTemplate | undefined>;
  createPrescriptionTemplate(template: InsertPrescriptionTemplate): Promise<PrescriptionTemplate>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private patients: Map<string, Patient>;
  private consultations: Map<string, Consultation>;
  private medicines: Map<string, Medicine>;
  private prescriptionTemplates: Map<string, PrescriptionTemplate>;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.consultations = new Map();
    this.medicines = new Map();
    this.prescriptionTemplates = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample patient
    const patient: Patient = {
      id: randomUUID(),
      name: "श्रीमती सुनीता शर्मा",
      age: 35,
      gender: "Female",
      uhid: "UH24001234",
      createdAt: new Date(),
    };
    this.patients.set(patient.id, patient);

    // Sample medicines
    const medicines = [
      { name: "Paracetamol", genericName: "Acetaminophen", strengths: ["500mg", "650mg", "1g"], category: "Analgesic" },
      { name: "Ibuprofen", genericName: "Ibuprofen", strengths: ["200mg", "400mg", "600mg"], category: "NSAID" },
      { name: "Amoxicillin", genericName: "Amoxicillin", strengths: ["250mg", "500mg", "875mg"], category: "Antibiotic" },
      { name: "Azithromycin", genericName: "Azithromycin", strengths: ["250mg", "500mg"], category: "Antibiotic" },
      { name: "Metformin", genericName: "Metformin", strengths: ["500mg", "850mg", "1000mg"], category: "Antidiabetic" },
      { name: "Amlodipine", genericName: "Amlodipine", strengths: ["2.5mg", "5mg", "10mg"], category: "Antihypertensive" },
      { name: "Omeprazole", genericName: "Omeprazole", strengths: ["20mg", "40mg"], category: "PPI" },
      { name: "Cetirizine", genericName: "Cetirizine", strengths: ["5mg", "10mg"], category: "Antihistamine" },
    ];

    medicines.forEach(med => {
      const medicine: Medicine = {
        id: randomUUID(),
        ...med,
        interactions: [],
      };
      this.medicines.set(medicine.id, medicine);
    });

    // Sample prescription templates
    const templates = [
      {
        name: "Viral Fever",
        condition: "fever",
        medications: [
          { medicine: "Paracetamol", strength: "650mg", frequency: "TDS", duration: "5 days", instructions: "After meals" },
          { medicine: "ORS", strength: "1 sachet", frequency: "As needed", duration: "5 days", instructions: "With water" }
        ]
      },
      {
        name: "Bacterial Infection",
        condition: "infection",
        medications: [
          { medicine: "Amoxicillin", strength: "500mg", frequency: "TDS", duration: "7 days", instructions: "After meals" },
          { medicine: "Paracetamol", strength: "650mg", frequency: "SOS", duration: "5 days", instructions: "For fever" }
        ]
      },
      {
        name: "UTI Protocol",
        condition: "uti",
        medications: [
          { medicine: "Nitrofurantoin", strength: "100mg", frequency: "BD", duration: "7 days", instructions: "After meals" },
          { medicine: "Plenty of fluids", strength: "", frequency: "Throughout day", duration: "10 days", instructions: "At least 3L per day" }
        ]
      }
    ];

    templates.forEach(template => {
      const prescriptionTemplate: PrescriptionTemplate = {
        id: randomUUID(),
        ...template,
        doctorId: null,
        isPublic: true,
      };
      this.prescriptionTemplates.set(prescriptionTemplate.id, prescriptionTemplate);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByUhid(uhid: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.uhid === uhid,
    );
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = { ...insertPatient, id, createdAt: new Date() };
    this.patients.set(id, patient);
    return patient;
  }

  async getConsultation(id: string): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async getConsultationsByPatient(patientId: string): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.patientId === patientId,
    );
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = randomUUID();
    const consultation: Consultation = { 
      ...insertConsultation, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updated: Consultation = { 
      ...consultation, 
      ...updates, 
      updatedAt: new Date()
    };
    this.consultations.set(id, updated);
    return updated;
  }

  async getMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async searchMedicines(query: string): Promise<Medicine[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.medicines.values()).filter(
      (medicine) => 
        medicine.name.toLowerCase().includes(lowerQuery) ||
        medicine.genericName?.toLowerCase().includes(lowerQuery)
    );
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const id = randomUUID();
    const medicine: Medicine = { ...insertMedicine, id };
    this.medicines.set(id, medicine);
    return medicine;
  }

  async getPrescriptionTemplates(): Promise<PrescriptionTemplate[]> {
    return Array.from(this.prescriptionTemplates.values());
  }

  async getPrescriptionTemplate(id: string): Promise<PrescriptionTemplate | undefined> {
    return this.prescriptionTemplates.get(id);
  }

  async createPrescriptionTemplate(insertTemplate: InsertPrescriptionTemplate): Promise<PrescriptionTemplate> {
    const id = randomUUID();
    const template: PrescriptionTemplate = { ...insertTemplate, id };
    this.prescriptionTemplates.set(id, template);
    return template;
  }
}

export const storage = new MemStorage();
