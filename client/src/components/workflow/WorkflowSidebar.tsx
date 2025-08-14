import { User, Save, Printer } from "lucide-react";

interface WorkflowSidebarProps {
  currentStep: number;
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    uhid: string;
  };
  onStepChange: (step: number) => void;
}

export function WorkflowSidebar({ currentStep, patientInfo, onStepChange }: WorkflowSidebarProps) {
  const steps = [
    { id: 1, title: "Chief Complaint", subtitle: "Select primary symptom" },
    { id: 2, title: "Symptom Details", subtitle: "Assessment & associated symptoms" },
    { id: 3, title: "Physical Examination", subtitle: "Vital signs & red flag alerts" },
    { id: 4, title: "Investigations", subtitle: "Lab tests & imaging" },
    { id: 5, title: "Diagnosis", subtitle: "Clinical assessment & diagnosis" },
    { id: 6, title: "Prescription", subtitle: "Treatment plan & medications" },
  ];

  return (
    <div className="w-80 bg-white shadow-lg border-r border-medical-gray-200 flex flex-col">
      {/* Header with Patient Info */}
      <div className="p-6 border-b border-medical-gray-200 bg-medical-blue text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg" data-testid="text-patient-name">
              {patientInfo.name}
            </h2>
            <p className="text-white/80 text-sm">
              {patientInfo.age} years • {patientInfo.gender}
            </p>
            <p className="text-white/80 text-xs">
              UHID: {patientInfo.uhid}
            </p>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex-1 p-6 overflow-y-auto">
        <nav className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                currentStep === step.id
                  ? 'bg-medical-blue text-white'
                  : 'bg-medical-gray-100 text-medical-gray-600 hover:bg-medical-gray-200'
              }`}
              onClick={() => onStepChange(step.id)}
              data-testid={`button-step-${step.id}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                currentStep === step.id ? 'bg-white/20' : 'bg-medical-gray-300 text-white'
              }`}>
                {step.id}
              </div>
              <div className="flex-1">
                <div className="font-medium">{step.title}</div>
                <div className={`text-sm ${
                  currentStep === step.id ? 'text-white/80' : 'text-medical-gray-500'
                }`}>
                  {step.subtitle}
                </div>
              </div>
              {currentStep > step.id && (
                <i className="fas fa-check text-white/60"></i>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-medical-gray-200 space-y-3">
        <button 
          className="w-full bg-medical-green hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          data-testid="button-save-consultation"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Consultation
        </button>
        <button 
          className="w-full bg-medical-gray-200 hover:bg-medical-gray-300 text-medical-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          data-testid="button-print-prescription"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Prescription
        </button>
      </div>
    </div>
  );
}
