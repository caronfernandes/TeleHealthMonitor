import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Thermometer, Stethoscope, Clock, ChevronDown, ChevronUp } from 'lucide-react';

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
  type: 'single' | 'multiple';
  category: string;
  showMore?: boolean;
}

const SYMPTOM_WORKFLOW: Record<string, WorkflowStep[]> = {
  fever: [
    {
      id: 'fever_duration',
      question: 'How long has the fever been present?',
      options: [
        { id: '<3_days', label: 'Less than 3 days', next: 'fever_pattern' },
        { id: '3-7_days', label: '3 to 7 days', next: 'fever_pattern' },
        { id: '>7_days', label: 'More than 7 days', next: 'fever_pattern' }
      ],
      type: 'single',
      category: 'duration'
    },
    {
      id: 'fever_pattern',
      question: 'What is the pattern of fever?',
      options: [
        { id: 'continuous', label: 'Continuous (fever all the time)', next: 'fever_response' },
        { id: 'intermittent', label: 'Intermittent (comes and goes)', next: 'fever_response' },
        { id: 'remittent', label: 'Fluctuates but never normal', next: 'fever_response' }
      ],
      type: 'single',
      category: 'pattern'
    },
    {
      id: 'fever_response',
      question: 'How does the fever respond to medicine?',
      options: [
        { id: 'responds_well', label: 'Responds well to paracetamol', next: 'fever_associated' },
        { id: 'temporary_relief', label: 'Only temporary relief', next: 'fever_associated' },
        { id: 'no_relief', label: 'No relief with medicine', next: 'fever_associated' }
      ],
      type: 'single',
      category: 'response'
    },
    {
      id: 'fever_associated',
      question: 'What other symptoms are present with fever?',
      options: [
        { id: 'rash', label: 'Rash on body', next: 'rash_type' },
        { id: 'cough', label: 'Cough', next: 'cough_type' },
        { id: 'headache', label: 'Headache', next: 'examination' }
      ],
      type: 'multiple',
      category: 'associated',
      showMore: true
    }
  ]
};

const ASSOCIATED_SYMPTOMS: Record<string, WorkflowStep[]> = {
  rash: [
    {
      id: 'rash_type',
      question: 'What type of rash is it?',
      options: [
        { id: 'maculopapular', label: 'Flat red spots (Maculopapular)', next: 'examination' },
        { id: 'petechial', label: 'Small red dots (Petechial)', next: 'examination' },
        { id: 'vesicular', label: 'Small blisters (Vesicular)', next: 'examination' }
      ],
      type: 'single',
      category: 'rash_details'
    }
  ],
  cough: [
    {
      id: 'cough_type',
      question: 'What type of cough?',
      options: [
        { id: 'dry', label: 'Dry cough (no phlegm)', next: 'examination' },
        { id: 'productive', label: 'Productive cough (with phlegm)', next: 'examination' },
        { id: 'blood', label: 'Cough with blood', next: 'examination' }
      ],
      type: 'single',
      category: 'cough_details'
    }
  ]
};

export function GuidedWorkflow({ patientInfo }: GuidedWorkflowProps) {
  const [currentSymptom, setCurrentSymptom] = useState<string>('');
  const [currentStepId, setCurrentStepId] = useState<string>('initial');
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [workflowPhase, setWorkflowPhase] = useState<'symptom_selection' | 'symptom_details' | 'examination' | 'investigation' | 'diagnosis' | 'prescription'>('symptom_selection');
  const [showMoreOptions, setShowMoreOptions] = useState<Record<string, boolean>>({});
  const [selectedExaminations, setSelectedExaminations] = useState<string[]>([]);
  const [examinationValues, setExaminationValues] = useState<Record<string, string>>({});

  const handleSymptomSelect = (symptom: string) => {
    setCurrentSymptom(symptom);
    setWorkflowPhase('symptom_details');
    setCurrentStepId('fever_duration'); // Start with first question for fever
    
    // Auto-advance after a short delay for better UX
    setTimeout(() => {
      // This creates a smooth transition effect
    }, 300);
  };

  const handleAnswerSelect = (stepId: string, answerId: string, nextStep?: string) => {
    // Update answers
    setAnswers(prev => ({
      ...prev,
      [stepId]: [answerId]
    }));

    // Auto-advance to next step
    if (nextStep) {
      setTimeout(() => {
        if (nextStep === 'examination') {
          setWorkflowPhase('examination');
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
    setAnswers(prev => {
      const currentAnswers = prev[stepId] || [];
      const isSelected = currentAnswers.includes(answerId);
      
      if (isSelected) {
        return {
          ...prev,
          [stepId]: currentAnswers.filter(id => id !== answerId)
        };
      } else {
        return {
          ...prev,
          [stepId]: [...currentAnswers, answerId]
        };
      }
    });
  };

  const handleContinueFromMultiple = () => {
    // Check if any associated symptoms were selected
    const selectedAssociated = answers['fever_associated'] || [];
    if (selectedAssociated.length > 0) {
      // Navigate to first associated symptom detail
      const firstAssociated = selectedAssociated[0];
      if (ASSOCIATED_SYMPTOMS[firstAssociated]) {
        setCurrentStepId(ASSOCIATED_SYMPTOMS[firstAssociated][0].id);
        return;
      }
    }
    
    // If no associated symptoms or no details needed, go to examination
    setWorkflowPhase('examination');
  };

  const getCurrentStep = (): WorkflowStep | null => {
    if (!currentSymptom || !SYMPTOM_WORKFLOW[currentSymptom]) return null;
    
    return SYMPTOM_WORKFLOW[currentSymptom].find(step => step.id === currentStepId) || null;
  };

  const getMoreOptions = (baseOptions: any[]) => {
    const moreOptions = [
      { id: 'joint_pain', label: 'Joint pain' },
      { id: 'burning_urination', label: 'Burning during urination' },
      { id: 'vomiting', label: 'Vomiting' },
      { id: 'abdominal_pain', label: 'Stomach pain' },
      { id: 'sore_throat', label: 'Sore throat' },
      { id: 'weight_loss', label: 'Weight loss' },
      { id: 'night_sweats', label: 'Night sweats' }
    ];
    return moreOptions;
  };

  const renderSymptomSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What is the main problem today?
        </h2>
        <p className="text-gray-600">Select the primary symptom the patient is experiencing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { id: 'fever', label: 'Fever', icon: Thermometer, color: 'bg-red-500', description: 'High body temperature' },
          { id: 'cough', label: 'Cough', icon: Stethoscope, color: 'bg-blue-500', description: 'Persistent coughing' },
          { id: 'pain', label: 'Pain', icon: Clock, color: 'bg-orange-500', description: 'Body pain or discomfort' }
        ].map((symptom) => (
          <Card
            key={symptom.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleSymptomSelect(symptom.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 ${symptom.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <symptom.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{symptom.label}</h3>
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
    if (!currentStep) return null;

    const isMultiple = currentStep.type === 'multiple';
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
          {currentStep.options.slice(0, currentStep.showMore && !showMoreOptions[currentStep.id] ? 3 : undefined).map((option) => {
            const isSelected = currentAnswers.includes(option.id);
            
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => {
                  if (isMultiple) {
                    handleMultipleAnswerToggle(currentStep.id, option.id);
                  } else {
                    handleAnswerSelect(currentStep.id, option.id, option.next);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">{option.label}</span>
                    {!isMultiple && <ChevronRight className="w-5 h-5 text-gray-400" />}
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
                onClick={() => setShowMoreOptions(prev => ({ ...prev, [currentStep.id]: true }))}
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
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                        }`}
                        onClick={() => handleMultipleAnswerToggle(currentStep.id, option.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-lg text-gray-900">{option.label}</span>
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
                  onClick={() => setShowMoreOptions(prev => ({ ...prev, [currentStep.id]: false }))}
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
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderExamination = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Physical Examination
        </h2>
        <p className="text-gray-600">Record key examination findings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'temperature', label: 'Temperature', placeholder: '98.6°F', unit: '°F' },
          { id: 'pulse', label: 'Pulse Rate', placeholder: '72', unit: '/min' },
          { id: 'bp', label: 'Blood Pressure', placeholder: '120/80', unit: 'mmHg' },
          { id: 'respiratory_rate', label: 'Breathing Rate', placeholder: '16', unit: '/min' }
        ].map((exam) => (
          <Card key={exam.id}>
            <CardContent className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {exam.label}
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder={exam.placeholder}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={examinationValues[exam.id] || ''}
                  onChange={(e) => setExaminationValues(prev => ({
                    ...prev,
                    [exam.id]: e.target.value
                  }))}
                />
                <span className="ml-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-md">
                  {exam.unit}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6">
        <Button onClick={() => setWorkflowPhase('investigation')} className="px-8">
          Continue to Investigations
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderCurrentPhase = () => {
    switch (workflowPhase) {
      case 'symptom_selection':
        return renderSymptomSelection();
      case 'symptom_details':
        return renderQuestionStep();
      case 'examination':
        return renderExamination();
      case 'investigation':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Investigations</h2>
            <p className="text-gray-600">Investigation module coming soon...</p>
          </div>
        );
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
              <h1 className="text-xl font-semibold text-gray-900">Medical Consultation</h1>
              <p className="text-sm text-gray-600">
                Patient: {patientInfo.name} • Age: {patientInfo.age} • UHID: {patientInfo.uhid}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
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
              { phase: 'symptom_selection', label: 'Chief Complaint' },
              { phase: 'symptom_details', label: 'Symptom Details' },
              { phase: 'examination', label: 'Examination' },
              { phase: 'investigation', label: 'Investigations' },
              { phase: 'diagnosis', label: 'Diagnosis' },
              { phase: 'prescription', label: 'Prescription' }
            ].map((step, index) => (
              <div key={step.phase} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    workflowPhase === step.phase
                      ? 'bg-blue-500 text-white'
                      : Object.keys(answers).length > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    workflowPhase === step.phase ? 'text-blue-600' : 'text-gray-600'
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
}