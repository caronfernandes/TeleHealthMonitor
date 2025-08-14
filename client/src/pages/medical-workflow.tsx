import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { SymptomSelection } from "@/components/workflow/SymptomSelectionSimple";
import { SymptomDetails } from "@/components/workflow/SymptomDetails";
import { PhysicalExamination } from "@/components/workflow/PhysicalExamination";
import { InvestigationManagement } from "@/components/workflow/InvestigationManagement";
import { PrescriptionManagement } from "@/components/workflow/PrescriptionManagement";
import { MedicineModal } from "@/components/workflow/MedicineModal";
import { getRedFlags } from "@/lib/medical-data";
import type { Patient, Consultation } from "@shared/schema";

export default function MedicalWorkflow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSymptom, setSelectedSymptom] = useState('fever');
  const [symptomDetails, setSymptomDetails] = useState({});
  const [examinationFindings, setExaminationFindings] = useState({});
  const [selectedExaminations, setSelectedExaminations] = useState({});
  const [examinationValues, setExaminationValues] = useState({});
  const [investigations, setInvestigations] = useState([]);
  const [investigationValues, setInvestigationValues] = useState({});
  const [investigationStatus, setInvestigationStatus] = useState({});
  const [diagnosis, setDiagnosis] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [medicineSearch, setMedicineSearch] = useState('');

  // Sample patient info - in real app this would come from URL params
  const patientInfo = {
    id: "sample-patient-id",
    name: 'श्रीमती सुनीता शर्मा',
    age: 35,
    gender: 'Female',
    uhid: 'UH24001234'
  };

  const redFlags = getRedFlags(examinationValues);

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
    setCurrentStep(2); // Move to symptom details step
  };

  const handleSymptomDetailsComplete = () => {
    setCurrentStep(3); // Move to physical examination
  };

  const handleExaminationSelect = (examId: string) => {
    setSelectedExaminations(prev => ({
      ...prev,
      [examId]: !prev[examId]
    }));
    
    if (!selectedExaminations[examId]) {
      setExaminationValues(prev => ({
        ...prev,
        [examId]: ''
      }));
    } else {
      setExaminationValues(prev => {
        const newValues = { ...prev };
        delete newValues[examId];
        return newValues;
      });
    }
  };

  const handleExaminationValueChange = (examId: string, value: string) => {
    setExaminationValues(prev => ({
      ...prev,
      [examId]: value
    }));
  };

  const handleInvestigationToggle = (testId: string) => {
    setInvestigations(prev => {
      if (prev.includes(testId)) {
        const newInvestigations = prev.filter(t => t !== testId);
        setInvestigationValues(prevValues => {
          const newValues = { ...prevValues };
          delete newValues[testId];
          return newValues;
        });
        setInvestigationStatus(prevStatus => {
          const newStatus = { ...prevStatus };
          delete newStatus[testId];
          return newStatus;
        });
        return newInvestigations;
      } else {
        return [...prev, testId];
      }
    });
  };

  const handleInvestigationStatusChange = (testId: string, status: string) => {
    setInvestigationStatus(prev => ({
      ...prev,
      [testId]: status
    }));
  };

  const handleInvestigationValueChange = (testId: string, valueKey: string, value: string) => {
    setInvestigationValues(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [valueKey]: value
      }
    }));
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setPrescriptionItems(template.medications.map((drug: any, index: number) => ({
      id: Date.now() + index,
      ...drug
    })));
  };

  const handleEditItem = (item: any) => {
    setEditingItem({...item});
    setShowMedicineModal(true);
  };

  const handleUpdateItem = (updatedItem: any) => {
    if (updatedItem.id) {
      setPrescriptionItems(prev => 
        prev.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    } else {
      setPrescriptionItems(prev => [...prev, { ...updatedItem, id: Date.now() }]);
    }
    setEditingItem(null);
    setShowMedicineModal(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setPrescriptionItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddNewMedicine = () => {
    const newItem = {
      id: null,
      medicine: '',
      strength: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setEditingItem(newItem);
    setShowMedicineModal(true);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SymptomSelection
            onNextStep={handleSymptomSelect}
          />
        );
      case 2:
        return (
          <SymptomDetails
            selectedSymptom={selectedSymptom}
            onPreviousStep={() => setCurrentStep(1)}
            onNextStep={handleSymptomDetailsComplete}
          />
        );
      case 3:
        return (
          <PhysicalExamination
            selectedExaminations={selectedExaminations}
            examinationValues={examinationValues}
            redFlags={redFlags}
            onExaminationSelect={handleExaminationSelect}
            onExaminationValueChange={handleExaminationValueChange}
            onNextStep={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <InvestigationManagement
            investigations={investigations}
            investigationValues={investigationValues}
            investigationStatus={investigationStatus}
            onInvestigationToggle={handleInvestigationToggle}
            onInvestigationStatusChange={handleInvestigationStatusChange}
            onInvestigationValueChange={handleInvestigationValueChange}
            onNextStep={() => setCurrentStep(5)}
          />
        );
      case 5:
        return (
          <PrescriptionManagement
            selectedTemplate={selectedTemplate}
            prescriptionItems={prescriptionItems}
            onTemplateSelect={handleTemplateSelect}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onAddNewMedicine={handleAddNewMedicine}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-medical-gray-50">
      <WorkflowSidebar
        currentStep={currentStep}
        patientInfo={patientInfo}
        onStepChange={setCurrentStep}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="bg-white border-b border-medical-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-medical-gray-900">
                Medical Consultation Workflow
              </h1>
              <p className="text-medical-gray-600">
                Step {currentStep}: {currentStep === 1 ? 'Chief Complaint Selection' : 
                                   currentStep === 2 ? 'Symptom Details' :
                                   currentStep === 3 ? 'Physical Examination' :
                                   currentStep === 4 ? 'Investigations' :
                                   'Prescription'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-medical-gray-500">
                <i className="fas fa-clock mr-1"></i>
                {new Date().toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit', 
                  hour12: true 
                })}
              </div>
              <div className="text-sm text-medical-gray-500">
                <i className="fas fa-calendar mr-1"></i>
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          {renderCurrentStep()}
        </div>
      </div>

      {showMedicineModal && (
        <MedicineModal
          editingItem={editingItem}
          medicineSearch={medicineSearch}
          onMedicineSearchChange={setMedicineSearch}
          onUpdateItem={handleUpdateItem}
          onClose={() => setShowMedicineModal(false)}
        />
      )}
    </div>
  );
}
