import React, { useState } from "react";
import { GuidedWorkflow } from "@/components/workflow/GuidedWorkflow";
import type { Patient } from "@shared/schema";

export default function MedicalWorkflow() {
  // Sample patient info - in real app this would come from URL params
  const patientInfo: Patient = {
    id: "sample-patient-id",
    name: 'श्रीमती सुनीता शर्मा',
    age: 35,
    gender: 'Female',
    uhid: 'UH24001234',
    createdAt: new Date()
  };

  return <GuidedWorkflow patientInfo={patientInfo} />;
}
