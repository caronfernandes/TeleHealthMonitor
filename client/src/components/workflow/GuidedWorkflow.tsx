import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Thermometer,
  Stethoscope,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileText,
  Pill,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  X,
} from "lucide-react";
import {
  examinationItems,
  investigationOptions,
  getRedFlags,
} from "@/lib/medical-data";
import { useQuery } from "@tanstack/react-query";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  uhid: string;
}

interface GuidedWorkflowProps {
  patientInfo: Patient;
}

interface WorkflowStep {
  id: string;
  question: string;
  options: { id: string; label: string; next?: string }[];
  type: "single" | "multiple";
  category: string;
  showMore?: boolean;
}

const SYMPTOM_WORKFLOW: Record<string, WorkflowStep[]> = {
  fever: [
    {
      id: "fever_duration",
      question: "How long has the fever been present?",
      options: [
        { id: "<3_days", label: "Less than 3 days", next: "fever_pattern" },
        { id: "3-7_days", label: "3 to 7 days", next: "fever_pattern" },
        { id: ">7_days", label: "More than 7 days", next: "fever_pattern" },
      ],
      type: "single",
      category: "duration",
    },
    {
      id: "fever_pattern",
      question: "What is the pattern of fever?",
      options: [
        {
          id: "continuous",
          label: "Continuous (fever all the time)",
          next: "fever_response",
        },
        {
          id: "intermittent",
          label: "Intermittent (comes and goes)",
          next: "fever_response",
        },
        {
          id: "remittent",
          label: "Fluctuates but never normal",
          next: "fever_response",
        },
      ],
      type: "single",
      category: "pattern",
    },
    {
      id: "fever_response",
      question: "How does the fever respond to medicine?",
      options: [
        {
          id: "responds_well",
          label: "Responds well to paracetamol",
          next: "fever_associated",
        },
        {
          id: "temporary_relief",
          label: "Only temporary relief",
          next: "fever_associated",
        },
        {
          id: "no_relief",
          label: "No relief with medicine",
          next: "fever_associated",
        },
      ],
      type: "single",
      category: "response",
    },
    {
      id: "fever_associated",
      question: "What other symptoms are present with fever?",
      options: [
        { id: "rash", label: "Rash on body", next: "rash_type" },
        { id: "cough", label: "Cough", next: "cough_type" },
        { id: "headache", label: "Headache", next: "examination" },
      ],
      type: "multiple",
      category: "associated",
      showMore: true,
    },
  ],
};

const ASSOCIATED_SYMPTOMS: Record<string, WorkflowStep[]> = {
  rash: [
    {
      id: "rash_type",
      question: "What type of rash is it?",
      options: [
        {
          id: "maculopapular",
          label: "Flat red spots (Maculopapular)",
          next: "examination",
        },
        {
          id: "petechial",
          label: "Small red dots (Petechial)",
          next: "examination",
        },
        {
          id: "vesicular",
          label: "Small blisters (Vesicular)",
          next: "examination",
        },
      ],
      type: "single",
      category: "rash_details",
    },
  ],
  cough: [
    {
      id: "cough_type",
      question: "What type of cough?",
      options: [
        { id: "dry", label: "Dry cough (no phlegm)", next: "examination" },
        {
          id: "productive",
          label: "Productive cough (with phlegm)",
          next: "examination",
        },
        { id: "blood", label: "Cough with blood", next: "examination" },
      ],
      type: "single",
      category: "cough_details",
    },
  ],
};

export function GuidedWorkflow({ patientInfo }: GuidedWorkflowProps) {
  const [currentSymptom, setCurrentSymptom] = useState<string>("");
  const [currentStepId, setCurrentStepId] = useState<string>("initial");
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [workflowPhase, setWorkflowPhase] = useState<
    | "symptom_selection"
    | "symptom_details"
    | "examination"
    | "investigation"
    | "diagnosis"
    | "prescription"
  >("symptom_selection");
  const [showMoreOptions, setShowMoreOptions] = useState<
    Record<string, boolean>
  >({});
  const [selectedExaminations, setSelectedExaminations] = useState<
    Record<string, boolean>
  >({});
  const [examinationValues, setExaminationValues] = useState<
    Record<string, string>
  >({});
  const [investigations, setInvestigations] = useState<string[]>([]);
  const [investigationValues, setInvestigationValues] = useState<
    Record<string, Record<string, string>>
  >({});
  const [investigationStatus, setInvestigationStatus] = useState<
    Record<string, string>
  >({});
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [prescriptionItems, setPrescriptionItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showMoreInvestigations, setShowMoreInvestigations] = useState(false);

  const handleSymptomSelect = (symptom: string) => {
    setCurrentSymptom(symptom);
    setWorkflowPhase("symptom_details");
    setCurrentStepId("fever_duration"); // Start with first question for fever

    // Auto-advance after a short delay for better UX
    setTimeout(() => {
      // This creates a smooth transition effect
    }, 300);
  };

  const handleAnswerSelect = (
    stepId: string,
    answerId: string,
    nextStep?: string,
  ) => {
    // Update answers
    setAnswers((prev) => ({
      ...prev,
      [stepId]: [answerId],
    }));

    // Auto-advance to next step
    if (nextStep) {
      setTimeout(() => {
        if (nextStep === "examination") {
          setWorkflowPhase("examination");
        } else if (ASSOCIATED_SYMPTOMS[nextStep]) {
          // Handle associated symptom workflows
          setCurrentStepId(ASSOCIATED_SYMPTOMS[nextStep][0].id);
        } else {
          setCurrentStepId(nextStep);
        }
      }, 500); // Small delay for user to see their selection
    }
  };

  const handleMultipleAnswerToggle = (stepId: string, answerId: string) => {
    setAnswers((prev) => {
      const currentAnswers = prev[stepId] || [];
      const isSelected = currentAnswers.includes(answerId);

      if (isSelected) {
        return {
          ...prev,
          [stepId]: currentAnswers.filter((id) => id !== answerId),
        };
      } else {
        return {
          ...prev,
          [stepId]: [...currentAnswers, answerId],
        };
      }
    });
  };

  const handleContinueFromMultiple = () => {
    // Check if any associated symptoms were selected
    const selectedAssociated = answers["fever_associated"] || [];
    if (selectedAssociated.length > 0) {
      // Navigate to first associated symptom detail
      const firstAssociated = selectedAssociated[0];
      if (ASSOCIATED_SYMPTOMS[firstAssociated]) {
        setCurrentStepId(ASSOCIATED_SYMPTOMS[firstAssociated][0].id);
        return;
      }
    }

    // If no associated symptoms or no details needed, go to examination
    setTimeout(() => setWorkflowPhase("examination"), 300);
  };

  const getCurrentStep = (): WorkflowStep | null => {
    if (!currentSymptom || !SYMPTOM_WORKFLOW[currentSymptom]) return null;

    return (
      SYMPTOM_WORKFLOW[currentSymptom].find(
        (step) => step.id === currentStepId,
      ) || null
    );
  };

  const getMoreOptions = (baseOptions: any[]) => {
    const moreOptions = [
      { id: "joint_pain", label: "Joint pain" },
      { id: "burning_urination", label: "Burning during urination" },
      { id: "vomiting", label: "Vomiting" },
      { id: "abdominal_pain", label: "Stomach pain" },
      { id: "sore_throat", label: "Sore throat" },
      { id: "weight_loss", label: "Weight loss" },
      { id: "night_sweats", label: "Night sweats" },
    ];
    return moreOptions;
  };

  const renderSymptomSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What is the main problem today?
        </h2>
        <p className="text-gray-600">
          Select the primary symptom the patient is experiencing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            id: "fever",
            label: "Fever",
            icon: Thermometer,
            color: "bg-red-500",
            description: "High body temperature",
          },
          {
            id: "cough",
            label: "Cough",
            icon: Stethoscope,
            color: "bg-blue-500",
            description: "Persistent coughing",
          },
          {
            id: "pain",
            label: "Pain",
            icon: Clock,
            color: "bg-orange-500",
            description: "Body pain or discomfort",
          },
        ].map((symptom) => (
          <Card
            key={symptom.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleSymptomSelect(symptom.id)}
          >
            <CardContent className="p-6 text-center">
              <div
                className={`w-16 h-16 ${symptom.color} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <symptom.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {symptom.label}
              </h3>
              <p className="text-sm text-gray-600">{symptom.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" className="text-gray-600">
          <ChevronDown className="w-4 h-4 mr-2" />
          Show more symptoms
        </Button>
      </div>
    </div>
  );

  const renderQuestionStep = () => {
    const currentStep = getCurrentStep();
    if (!currentStep) {
      // If no current step found, automatically go to examination
      setTimeout(() => setWorkflowPhase("examination"), 100);
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">Moving to examination...</p>
        </div>
      );
    }

    const isMultiple = currentStep.type === "multiple";
    const currentAnswers = answers[currentStep.id] || [];

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="secondary" className="px-3 py-1">
              Step {Object.keys(answers).length + 1}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStep.question}
          </h2>
          {isMultiple && (
            <p className="text-gray-600">You can select multiple options</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentStep.options
            .slice(
              0,
              currentStep.showMore && !showMoreOptions[currentStep.id]
                ? 3
                : undefined,
            )
            .map((option) => {
              const isSelected = currentAnswers.includes(option.id);

              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => {
                    if (isMultiple) {
                      handleMultipleAnswerToggle(currentStep.id, option.id);
                    } else {
                      handleAnswerSelect(
                        currentStep.id,
                        option.id,
                        option.next,
                      );
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-gray-900">
                        {option.label}
                      </span>
                      {!isMultiple && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      {isMultiple && isSelected && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {currentStep.showMore && (
          <div className="text-center">
            {!showMoreOptions[currentStep.id] ? (
              <Button
                variant="outline"
                onClick={() =>
                  setShowMoreOptions((prev) => ({
                    ...prev,
                    [currentStep.id]: true,
                  }))
                }
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Show more options
              </Button>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {getMoreOptions(currentStep.options).map((option) => {
                    const isSelected = currentAnswers.includes(option.id);

                    return (
                      <Card
                        key={option.id}
                        className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                          isSelected
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : "hover:shadow-md"
                        }`}
                        onClick={() =>
                          handleMultipleAnswerToggle(currentStep.id, option.id)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-lg text-gray-900">
                              {option.label}
                            </span>
                            {isSelected && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setShowMoreOptions((prev) => ({
                      ...prev,
                      [currentStep.id]: false,
                    }))
                  }
                >
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show less
                </Button>
              </>
            )}
          </div>
        )}

        {isMultiple && currentAnswers.length > 0 && (
          <div className="text-center pt-6">
            <Button onClick={handleContinueFromMultiple} className="px-8">
              Continue to Examination
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Manual navigation fallback */}
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={() => setWorkflowPhase("examination")}
            className="px-6"
          >
            Skip to Physical Examination
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const redFlags = getRedFlags(examinationValues);

  const handleExaminationSelect = (examId: string) => {
    setSelectedExaminations((prev) => ({
      ...prev,
      [examId]: !prev[examId],
    }));

    if (!selectedExaminations[examId]) {
      setExaminationValues((prev) => ({
        ...prev,
        [examId]: "",
      }));
    } else {
      setExaminationValues((prev) => {
        const newValues = { ...prev };
        delete newValues[examId];
        return newValues;
      });
    }
  };

  const handleExaminationValueChange = (examId: string, value: string) => {
    setExaminationValues((prev) => ({
      ...prev,
      [examId]: value,
    }));
  };

  const renderExamination = () => (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Stethoscope className="h-6 w-6 text-blue-600 mr-3" />
          Physical Examination
        </h2>
        <p className="text-gray-600">
          Record vital signs and clinical findings
        </p>
      </div>

      {/* Red Flags Alert */}
      {redFlags.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-bold text-red-800">
              🚨 RED FLAGS DETECTED
            </span>
          </div>
          <div className="space-y-2">
            {redFlags.map((flag, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-2 rounded ${
                  flag.critical
                    ? "bg-red-100 border border-red-300"
                    : "bg-yellow-100 border border-yellow-300"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full ${flag.critical ? "bg-red-500" : "bg-yellow-500"}`}
                ></span>
                <span
                  className={`font-medium ${flag.critical ? "text-red-800" : "text-yellow-800"}`}
                >
                  {flag.text}
                </span>
                {flag.critical && (
                  <span className="ml-auto bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                    CRITICAL
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto-pulled Vital Signs */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-800 mb-2">
          Vital Signs (Auto-pulled from reception)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700">Temperature</div>
            <div className="text-lg text-blue-600">101.2°F</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700">Pulse</div>
            <div className="text-lg text-blue-600">92/min</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700">BP</div>
            <div className="text-lg text-blue-600">120/80 mmHg</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700">RR</div>
            <div className="text-lg text-blue-600">18/min</div>
          </div>
        </div>
      </div>

      {/* Clinical Examination */}
      <div className="space-y-4 mb-8">
        <h3 className="font-medium text-gray-700 text-lg">
          Clinical Examination
        </h3>

        <div className="grid gap-4">
          {examinationItems.map((exam) => {
            const hasRedFlag = redFlags.some((flag) => flag.source === exam.id);

            return (
              <div
                key={exam.id}
                className={`border rounded-lg p-4 ${
                  hasRedFlag ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedExaminations[exam.id] || false}
                    onChange={() => handleExaminationSelect(exam.id)}
                    className="text-green-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">
                        {exam.label}
                      </span>
                      {hasRedFlag && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    {exam.normalRange && (
                      <div className="text-xs text-gray-500 mt-1">
                        Normal: {exam.normalRange}
                      </div>
                    )}
                  </div>
                </div>

                {selectedExaminations[exam.id] && (
                  <div className="mt-3 pl-8">
                    {exam.type === "input" && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={exam.placeholder}
                          value={examinationValues[exam.id] || ""}
                          onChange={(e) =>
                            handleExaminationValueChange(
                              exam.id,
                              e.target.value,
                            )
                          }
                          className={`flex-1 p-2 border rounded text-sm ${
                            hasRedFlag
                              ? "border-red-400 bg-red-50"
                              : "border-gray-300"
                          }`}
                        />
                        {exam.unit && (
                          <span className="text-gray-500 text-sm font-medium px-2">
                            {exam.unit}
                          </span>
                        )}
                      </div>
                    )}

                    {exam.type === "select" && (
                      <select
                        value={examinationValues[exam.id] || ""}
                        onChange={(e) =>
                          handleExaminationValueChange(exam.id, e.target.value)
                        }
                        className={`w-full p-2 border rounded text-sm ${
                          hasRedFlag
                            ? "border-red-400 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select...</option>
                        {exam.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {exam.type === "textarea" && (
                      <textarea
                        placeholder={exam.placeholder}
                        value={examinationValues[exam.id] || ""}
                        onChange={(e) =>
                          handleExaminationValueChange(exam.id, e.target.value)
                        }
                        className={`w-full p-2 border rounded text-sm h-20 resize-none ${
                          hasRedFlag
                            ? "border-red-400 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center pt-6">
        <Button
          onClick={() => setWorkflowPhase("investigation")}
          className="px-8"
        >
          Continue to Investigations
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Investigation handlers
  const handleInvestigationToggle = (testId: string) => {
    setInvestigations((prev) => {
      if (prev.includes(testId)) {
        const newInvestigations = prev.filter((t) => t !== testId);
        setInvestigationValues((prevValues) => {
          const newValues = { ...prevValues };
          delete newValues[testId];
          return newValues;
        });
        setInvestigationStatus((prevStatus) => {
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
    setInvestigationStatus((prev) => ({
      ...prev,
      [testId]: status,
    }));
  };

  const handleInvestigationValueChange = (
    testId: string,
    valueKey: string,
    value: string,
  ) => {
    setInvestigationValues((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [valueKey]: value,
      },
    }));
  };

  const renderInvestigation = () => {
    const relevantTests = investigationOptions.slice(0, 5);
    const otherTests = investigationOptions.slice(5);

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center mb-4">
          <Button
            variant="outline"
            onClick={() => setWorkflowPhase("examination")}
            className="mr-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Examination
          </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Investigations (जांच करवाएं)
          </h2>
          <p className="text-gray-600">
            Select and configure recommended tests
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-3">
            Recommended for {currentSymptom || "Fever"} (बुखार के लिए सुझाई गई
            जांच)
          </h3>

          {/* Primary 5 investigations */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {relevantTests.map((test) => (
              <button
                key={test.id}
                onClick={() => handleInvestigationToggle(test.id)}
                className={`p-3 rounded border text-sm text-left transition-colors ${
                  investigations.includes(test.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="font-medium">{test.name}</div>
                {test.hasValues && investigations.includes(test.id) && (
                  <div className="text-xs mt-1 opacity-75">
                    Click to configure values
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Show More/Less Toggle */}
          {otherTests.length > 0 && (
            <div className="text-center">
              {!showMoreInvestigations ? (
                <Button
                  variant="outline"
                  onClick={() => setShowMoreInvestigations(true)}
                  className="text-blue-600 border-blue-300"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show more investigations ({otherTests.length})
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {otherTests.map((test) => (
                      <button
                        key={test.id}
                        onClick={() => handleInvestigationToggle(test.id)}
                        className={`p-3 rounded border text-sm text-left transition-colors ${
                          investigations.includes(test.id)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div className="font-medium">{test.name}</div>
                        {test.hasValues && investigations.includes(test.id) && (
                          <div className="text-xs mt-1 opacity-75">
                            Click to configure values
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowMoreInvestigations(false)}
                    className="text-blue-600 border-blue-300"
                  >
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Show less
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Selected Investigations Configuration */}
        {investigations.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-gray-700 text-lg">
              Configure Selected Investigations
            </h3>

            {investigations.map((testId) => {
              const test = investigationOptions.find((t) => t.id === testId);
              const status = investigationStatus[testId] || "todo";

              return (
                <div
                  key={testId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">{test?.name}</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Status:</label>
                        <select
                          value={status}
                          onChange={(e) =>
                            handleInvestigationStatusChange(
                              testId,
                              e.target.value,
                            )
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="todo">To be done</option>
                          <option value="done">Already done</option>
                        </select>
                      </div>

                      {status === "done" && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Done
                        </span>
                      )}
                      {status === "todo" && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          ⏳ To Do
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Values Input */}
                  {status === "done" && test?.hasValues && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Enter Results:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {test.values?.map((valueKey) => (
                          <div key={valueKey}>
                            <label className="block text-xs text-gray-600 mb-1">
                              {valueKey}
                            </label>
                            <input
                              type="text"
                              placeholder={`Enter ${valueKey}`}
                              value={
                                investigationValues[testId]?.[valueKey] || ""
                              }
                              onChange={(e) =>
                                handleInvestigationValueChange(
                                  testId,
                                  valueKey,
                                  e.target.value,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructions for 'todo' investigations */}
                  {status === "todo" && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        📋 This investigation will be prescribed to the patient
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center pt-6">
          <Button
            onClick={() => setWorkflowPhase("diagnosis")}
            className="px-8"
          >
            Continue to Diagnosis
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );

    // Diagnosis data
    const diagnosisCategories = [
      {
        category: "Infectious",
        diagnoses: [
          {
            id: "inf_001",
            code: "A09",
            name: "Gastroenteritis",
            description: "Infectious gastroenteritis",
          },
          {
            id: "inf_002",
            code: "B34.9",
            name: "Viral infection",
            description: "Unspecified viral infection",
          },
          {
            id: "inf_003",
            code: "N39.0",
            name: "Urinary tract infection",
            description: "UTI, site not specified",
          },
          {
            id: "inf_004",
            code: "A50.9",
            name: "Dengue fever",
            description: "Unspecified dengue fever",
          },
          {
            id: "inf_005",
            code: "B50.9",
            name: "Malaria",
            description: "Plasmodium falciparum malaria",
          },
          {
            id: "inf_006",
            code: "A01.0",
            name: "Typhoid fever",
            description: "Typhoid fever",
          },
        ],
      },
      {
        category: "Respiratory",
        diagnoses: [
          {
            id: "resp_001",
            code: "J00",
            name: "Acute nasopharyngitis (common cold)",
            description: "Viral upper respiratory tract infection",
          },
          {
            id: "resp_002",
            code: "J06.9",
            name: "Acute upper respiratory infection",
            description: "Unspecified acute upper respiratory infection",
          },
          {
            id: "resp_003",
            code: "J20.9",
            name: "Acute bronchitis",
            description: "Acute inflammation of bronchi",
          },
          {
            id: "resp_004",
            code: "J18.9",
            name: "Pneumonia",
            description: "Unspecified pneumonia",
          },
        ],
      },
    ];

    const toggleDiagnosis = (diagnosisId: string) => {
      setSelectedDiagnoses((prev) =>
        prev.includes(diagnosisId)
          ? prev.filter((id) => id !== diagnosisId)
          : [...prev, diagnosisId],
      );
    };

    const renderDiagnosis = () => {
      const filteredCategories = diagnosisCategories
        .map((category) => ({
          ...category,
          diagnoses: category.diagnoses.filter(
            (diagnosis) =>
              diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              diagnosis.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
          ),
        }))
        .filter((category) => category.diagnoses.length > 0);

      return (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Navigation */}
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              onClick={() => setWorkflowPhase("investigation")}
              className="mr-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Investigations
            </Button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600 mr-3" />
              Clinical Diagnosis
            </h2>
            <p className="text-gray-600">
              Select the most appropriate diagnosis(es) based on clinical
              findings and investigations.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search diagnoses by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg pr-10"
            />
            <div className="absolute right-3 top-3">
              <div className="w-6 h-6 text-gray-400">🔍</div>
            </div>
          </div>

          {/* Diagnosis Categories */}
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <div
                key={category.category}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <div className="grid gap-3">
                  {category.diagnoses.map((diagnosis) => (
                    <div
                      key={diagnosis.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDiagnoses.includes(diagnosis.id)
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() => toggleDiagnosis(diagnosis.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {diagnosis.name}
                            </span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {diagnosis.code}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {diagnosis.description}
                          </p>
                        </div>
                        {selectedDiagnoses.includes(diagnosis.id) && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ml-4">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6">
            <Button
              onClick={() => setWorkflowPhase("prescription")}
              disabled={selectedDiagnoses.length === 0}
              className="px-8"
            >
              Continue to Prescription
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    };

    // Prescription handlers
    const { data: templates = [] } = useQuery({
      queryKey: ["/api/prescription-templates"],
    });

    const handleTemplateSelect = (template: any) => {
      setSelectedTemplate(template);
      setPrescriptionItems(
        template.medications.map((drug: any, index: number) => ({
          id: Date.now() + index,
          ...drug,
        })),
      );
    };

    const handleEditItem = (item: any) => {
      setEditingItem({ ...item });
      setShowMedicineModal(true);
    };

    const handleDeleteItem = (itemId: string) => {
      setPrescriptionItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const handleAddNewMedicine = () => {
      const newItem = {
        id: Date.now(),
        medicine: "Paracetamol",
        strength: "500mg",
        frequency: "BD",
        duration: "5 Days",
        instructions: "After food",
      };
      setPrescriptionItems((prev) => [...prev, newItem]);
    };

    const renderPrescription = () => (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center mb-4">
          <Button
            variant="outline"
            onClick={() => setWorkflowPhase("diagnosis")}
            className="mr-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Diagnosis
          </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Pill className="h-6 w-6 text-purple-600 mr-3" />
            Prescription Management
          </h2>
          <p className="text-gray-600">
            Create prescription based on diagnosis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates Panel */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Prescription Templates
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 1,
                  name: "Viral Fever",
                  medications: [
                    { medicine: "Paracetamol 500mg" },
                    { medicine: "ORS" },
                  ],
                },
                {
                  id: 2,
                  name: "Bacterial Infection",
                  medications: [
                    { medicine: "Amoxicillin 500mg" },
                    { medicine: "Paracetamol 500mg" },
                  ],
                },
                {
                  id: 3,
                  name: "Common Cold",
                  medications: [
                    { medicine: "Cetirizine 10mg" },
                    { medicine: "Paracetamol 500mg" },
                  ],
                },
              ].map((template: any) => (
                <div
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {template.medications.length} medications
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Editor */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Current Prescription
              </h3>
              <Button onClick={handleAddNewMedicine} className="px-4 py-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            {/* Prescription Items */}
            <div className="space-y-4 mb-6">
              {prescriptionItems.length > 0 ? (
                prescriptionItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.medicine}
                        </h4>
                        <div className="text-sm text-gray-600 mt-1">
                          <span>{item.strength}</span> •
                          <span>{item.frequency}</span> •
                          <span>{item.duration}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.instructions}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No medications added yet</p>
                  <p className="text-sm">
                    Select a template or add medicines manually
                  </p>
                </div>
              )}
            </div>

            {/* Complete Consultation */}
            <div className="text-center pt-6 border-t border-gray-200">
              <Button className="px-8 py-3 text-lg">
                Complete Consultation
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Medicine Edit Modal */}
        {showMedicineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Medicine</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMedicineModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    value={editingItem?.medicine || ""}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, medicine: e.target.value } : null,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g., Paracetamol"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strength
                  </label>
                  <input
                    type="text"
                    value={editingItem?.strength || ""}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, strength: e.target.value } : null,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g., 500mg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={editingItem?.frequency || ""}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, frequency: e.target.value } : null,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select frequency</option>
                    <option value="OD">OD (Once daily)</option>
                    <option value="BD">BD (Twice daily)</option>
                    <option value="TID">TID (Three times daily)</option>
                    <option value="QID">QID (Four times daily)</option>
                    <option value="SOS">SOS (When needed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingItem?.duration || ""}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, duration: e.target.value } : null,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g., 5 Days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <select
                    value={editingItem?.instructions || ""}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, instructions: e.target.value } : null,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select instructions</option>
                    <option value="Before food">Before food</option>
                    <option value="After food">After food</option>
                    <option value="With food">With food</option>
                    <option value="Empty stomach">Empty stomach</option>
                    <option value="At bedtime">At bedtime</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowMedicineModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingItem) {
                      setPrescriptionItems((prev) =>
                        prev.map((item) =>
                          item.id === editingItem.id ? editingItem : item,
                        ),
                      );
                      setShowMedicineModal(false);
                      setEditingItem(null);
                    }
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    const renderCurrentPhase = () => {
      switch (workflowPhase) {
        case "symptom_selection":
          return renderSymptomSelection();
        case "symptom_details":
          return renderQuestionStep();
        case "examination":
          return renderExamination();
        case "investigation":
          return renderInvestigation();
        case "diagnosis":
          return renderDiagnosis();
        case "prescription":
          return renderPrescription();
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Medical Consultation
                </h1>
                <p className="text-sm text-gray-600">
                  Patient: {patientInfo.name} • Age: {patientInfo.age} • UHID:{" "}
                  {patientInfo.uhid}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              {[
                { phase: "symptom_selection", label: "Chief Complaint" },
                { phase: "symptom_details", label: "Symptom Details" },
                { phase: "examination", label: "Examination" },
                { phase: "investigation", label: "Investigations" },
                { phase: "diagnosis", label: "Diagnosis" },
                { phase: "prescription", label: "Prescription" },
              ].map((step, index) => (
                <div key={step.phase} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      workflowPhase === step.phase
                        ? "bg-blue-500 text-white"
                        : Object.keys(answers).length > index
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      workflowPhase === step.phase
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < 5 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentPhase()}
        </div>
      </div>
    );
  };
}
