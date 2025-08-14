import { useState } from "react";
import { Thermometer, ArrowRight } from "lucide-react";
import { symptoms } from "@/lib/medical-data";

interface SymptomSelectionProps {
  selectedSymptom: string;
  onSymptomSelect: (symptom: string) => void;
  onNextStep: () => void;
}

export function SymptomSelection({ selectedSymptom, onSymptomSelect, onNextStep }: SymptomSelectionProps) {
  const selectedSymptomData = symptoms.find(s => s.id === selectedSymptom);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [selectedResponse, setSelectedResponse] = useState('');
  const [selectedOnset, setSelectedOnset] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);

  const toggleAssociatedSymptom = (symptom: string) => {
    setAssociatedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-medical-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-medical-gray-900 mb-2">
            Select Primary Symptom
          </h2>
          <p className="text-medical-gray-600 mb-4">
            Choose the main complaint that brought the patient to you today. After selecting, a detailed assessment form will appear below.
          </p>
          {selectedSymptom && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm font-medium">
                ✓ {selectedSymptomData?.label} selected. Scroll down to complete the detailed clinical assessment.
              </p>
            </div>
          )}
        </div>

        {/* Symptom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {symptoms.map((symptom) => (
            <div
              key={symptom.id}
              className={`p-6 border-2 rounded-xl cursor-pointer hover:shadow-md transition-all ${
                selectedSymptom === symptom.id
                  ? 'border-medical-blue bg-medical-blue/5'
                  : 'border-medical-gray-200 hover:border-medical-blue'
              }`}
              onClick={() => onSymptomSelect(symptom.id)}
              data-testid={`card-symptom-${symptom.id}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 ${symptom.color} rounded-full flex items-center justify-center`}>
                  <i className={`${symptom.icon} text-white text-xl`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-medical-gray-900">{symptom.label}</h3>
                  <p className="text-sm text-medical-gray-600">{symptom.description}</p>
                </div>
              </div>
              <div className="text-xs text-medical-gray-500">{symptom.note}</div>
            </div>
          ))}
        </div>

        {/* Symptom Details (shown when a symptom is selected) */}
        {selectedSymptom && selectedSymptomData && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-8 mb-8 shadow-lg">
            <div className="bg-white rounded-lg p-4 mb-6 border-l-4 border-medical-blue">
              <h3 className="text-xl font-bold text-medical-gray-900 mb-2 flex items-center">
                <i className={`${selectedSymptomData.icon} text-medical-blue mr-3 text-2xl`}></i>
                {selectedSymptomData.label} - Detailed Clinical Assessment
              </h3>
              <p className="text-medical-gray-600">Complete the detailed symptom evaluation below based on IC4 medical guidelines.</p>
            </div>
            
            {/* Render different detail sections based on symptom type */}
            {selectedSymptom === 'fever' && (
              <>
                {/* Duration */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Duration of Fever
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedSymptomData?.details?.duration?.map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          selectedDuration === duration
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
                        }`}
                        data-testid={`button-duration-${duration.replace(/[<>&\s]/g, '-')}`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pattern */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Fever Pattern
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedSymptomData?.details?.pattern?.map((pattern) => (
                      <button
                        key={pattern}
                        onClick={() => setSelectedPattern(pattern)}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          selectedPattern === pattern
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
                        }`}
                        data-testid={`button-pattern-${pattern.toLowerCase()}`}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response to Antipyretics */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Response to Antipyretics
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {selectedSymptomData?.details?.response?.map((response) => (
                      <button
                        key={response}
                        onClick={() => setSelectedResponse(response)}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          selectedResponse === response
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
                        }`}
                        data-testid={`button-response-${response.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {response}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedSymptom === 'cough' && (
              <>
                {/* Onset */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Onset of Cough
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {selectedSymptomData?.details?.onset?.map((onset) => (
                      <button
                        key={onset}
                        onClick={() => setSelectedOnset(onset)}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          selectedOnset === onset
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
                        }`}
                        data-testid={`button-onset-${onset.toLowerCase().replace(/[<>()&\s]/g, '-')}`}
                      >
                        {onset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Type of Cough
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSymptomData?.details?.type?.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          selectedType === type
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
                        }`}
                        data-testid={`button-type-${type.toLowerCase()}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timing */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Timing
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {selectedSymptomData?.details?.timing?.map((timing, index) => (
                      <button
                        key={timing}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          index === 0 
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue'
                        }`}
                        data-testid={`button-timing-${timing.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {timing}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedSymptom === 'weight_change' && (
              <>
                {/* Type of Weight Change */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Type of Weight Change
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSymptomData?.details?.type?.map((type, index) => (
                      <button
                        key={type}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          index === 0 
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue'
                        }`}
                        data-testid={`button-weight-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Onset */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Onset
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSymptomData?.details?.onset?.map((onset, index) => (
                      <button
                        key={onset}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          index === 0 
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue'
                        }`}
                        data-testid={`button-weight-onset-${onset.toLowerCase()}`}
                      >
                        {onset}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Associated Symptoms - Common for all symptom types */}
            {selectedSymptomData?.details?.associated && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                  Associated Symptoms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {selectedSymptomData.details.associated.map((symptom) => (
                    <label 
                      key={symptom}
                      className="flex items-center p-3 border border-medical-gray-200 rounded-lg hover:bg-medical-gray-50 cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        className="mr-2 text-medical-blue rounded"
                        checked={associatedSymptoms.includes(symptom)}
                        onChange={() => toggleAssociatedSymptom(symptom)}
                        data-testid={`checkbox-symptom-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <span className="text-sm">{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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
            onClick={onNextStep}
            disabled={!selectedSymptom}
            className="px-8 py-3 bg-medical-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            data-testid="button-next"
          >
            Next: Physical Examination
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
