import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { symptoms } from "@/lib/medical-data";

interface SymptomSelectionProps {
  onNextStep: (symptom: string) => void;
}

export function SymptomSelection({ onNextStep }: SymptomSelectionProps) {
  const [selectedSymptom, setSelectedSymptom] = useState('');

  const handleSymptomSelect = (symptomId: string) => {
    setSelectedSymptom(symptomId);
  };

  const handleNext = () => {
    if (selectedSymptom) {
      onNextStep(selectedSymptom);
    }
  };

  const selectedSymptomData = symptoms.find(s => s.id === selectedSymptom);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-medical-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-medical-gray-900 mb-2">
            Chief Complaint Selection
          </h2>
          <p className="text-medical-gray-600">
            Select the primary symptom that brought the patient to the clinic today.
          </p>
        </div>

        {/* Symptom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {symptoms.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => handleSymptomSelect(symptom.id)}
              className={`p-6 text-left border-2 rounded-xl transition-all hover:shadow-md ${
                selectedSymptom === symptom.id
                  ? 'border-medical-blue bg-blue-50 shadow-lg'
                  : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
              }`}
              data-testid={`card-symptom-${symptom.id}`}
            >
              <div className="flex items-center mb-3">
                <div className={`w-12 h-12 ${symptom.color} rounded-full flex items-center justify-center mr-4`}>
                  <i className={`${symptom.icon} text-white text-xl`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-medical-gray-900 mb-1">
                    {symptom.label}
                  </h3>
                  {selectedSymptom === symptom.id && (
                    <div className="text-medical-blue text-sm font-medium">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-medical-gray-600 mb-3">
                {symptom.description}
              </p>
              <div className="text-xs text-medical-gray-500">
                Common Symptom
              </div>
            </button>
          ))}
        </div>

        {/* Selected Symptom Preview */}
        {selectedSymptom && selectedSymptomData && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${selectedSymptomData.color} rounded-full flex items-center justify-center`}>
                <i className={`${selectedSymptomData.icon} text-white text-2xl`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-medical-gray-900 mb-1">
                  Selected: {selectedSymptomData.label}
                </h3>
                <p className="text-medical-gray-600 mb-2">{selectedSymptomData.description}</p>
                <p className="text-green-700 text-sm font-medium">
                  ✓ Ready for detailed assessment. Click "Next" to continue with symptom details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-medical-gray-200">
          <button 
            className="px-6 py-2 text-medical-gray-500 font-medium" 
            disabled
            data-testid="button-previous"
          >
            <i className="fas fa-arrow-left mr-2"></i>Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedSymptom}
            className="px-8 py-3 bg-medical-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            data-testid="button-next"
          >
            Next: Symptom Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}