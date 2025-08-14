import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { symptoms } from "@/lib/medical-data";

interface SymptomDetailsProps {
  selectedSymptom: string;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

export function SymptomDetails({ selectedSymptom, onPreviousStep, onNextStep }: SymptomDetailsProps) {
  const selectedSymptomData = symptoms.find(s => s.id === selectedSymptom);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [selectedResponse, setSelectedResponse] = useState('');
  const [selectedOnset, setSelectedOnset] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTiming, setSelectedTiming] = useState('');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [associatedSymptomDetails, setAssociatedSymptomDetails] = useState<Record<string, any>>({});

  const toggleAssociatedSymptom = (symptom: string) => {
    setAssociatedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const updateAssociatedSymptomDetail = (symptom: string, field: string, value: string) => {
    setAssociatedSymptomDetails(prev => ({
      ...prev,
      [symptom]: {
        ...prev[symptom],
        [field]: value
      }
    }));
  };

  if (!selectedSymptomData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-medical-gray-600">No symptom selected. Please go back and select a symptom.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-medical-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-16 h-16 ${selectedSymptomData.color} rounded-full flex items-center justify-center`}>
              <i className={`${selectedSymptomData.icon} text-white text-2xl`}></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-medical-gray-900">{selectedSymptomData.label}</h2>
              <p className="text-medical-gray-600">{selectedSymptomData.description}</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">Complete the detailed clinical assessment based on IC4 medical guidelines</p>
          </div>
        </div>

        {/* Primary Symptom Details */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-medical-gray-900 mb-6 flex items-center">
            <i className={`${selectedSymptomData.icon} text-medical-blue mr-3`}></i>
            Primary Symptom Assessment
          </h3>

          {/* Fever Details */}
          {selectedSymptom === 'fever' && (
            <>
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

          {/* Cough Details */}
          {selectedSymptom === 'cough' && (
            <>
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

              <div className="mb-6">
                <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                  Timing
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {selectedSymptomData?.details?.timing?.map((timing) => (
                    <button
                      key={timing}
                      onClick={() => setSelectedTiming(timing)}
                      className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                        selectedTiming === timing
                          ? 'border-medical-blue bg-medical-blue text-white font-medium'
                          : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
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

          {/* Weight Change Details */}
          {selectedSymptom === 'weight_change' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                  Type of Weight Change
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
                      data-testid={`button-weight-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                  Onset
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedSymptomData?.details?.onset?.map((onset) => (
                    <button
                      key={onset}
                      onClick={() => setSelectedOnset(onset)}
                      className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                        selectedOnset === onset
                          ? 'border-medical-blue bg-medical-blue text-white font-medium'
                          : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
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
        </div>

        {/* Associated Symptoms Selection */}
        {selectedSymptomData?.details?.associated && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-medical-gray-900 mb-4">
              Associated Symptoms
            </h3>
            <p className="text-medical-gray-600 mb-4">
              Select any associated symptoms present with the primary complaint:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
              {selectedSymptomData.details.associated.map((symptom) => (
                <label 
                  key={symptom}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    associatedSymptoms.includes(symptom)
                      ? 'border-medical-green bg-medical-green/10'
                      : 'border-medical-gray-200 hover:border-medical-green hover:bg-green-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="mr-2 text-medical-green rounded"
                    checked={associatedSymptoms.includes(symptom)}
                    onChange={() => toggleAssociatedSymptom(symptom)}
                    data-testid={`checkbox-symptom-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <span className="text-sm font-medium">{symptom}</span>
                </label>
              ))}
            </div>

            {/* Associated Symptoms Details */}
            {associatedSymptoms.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-md font-semibold text-medical-gray-900 border-b border-gray-300 pb-2">
                  Detailed Assessment for Associated Symptoms
                </h4>
                {associatedSymptoms.map((symptom) => (
                  <div key={symptom} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-medical-gray-900 mb-3 flex items-center">
                      <i className="fas fa-circle text-medical-green mr-2 text-xs"></i>
                      {symptom} Details
                    </h5>
                    
                    {/* Duration for associated symptom */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-medical-gray-700 mb-2">
                        Duration
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['<24 hours', '1-3 days', '>3 days'].map((duration) => (
                          <button
                            key={duration}
                            onClick={() => updateAssociatedSymptomDetail(symptom, 'duration', duration)}
                            className={`p-2 text-xs border rounded transition-colors ${
                              associatedSymptomDetails[symptom]?.duration === duration
                                ? 'border-medical-green bg-medical-green text-white'
                                : 'border-gray-200 hover:border-medical-green'
                            }`}
                          >
                            {duration}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Severity for associated symptom */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-medical-gray-700 mb-2">
                        Severity
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Mild', 'Moderate', 'Severe'].map((severity) => (
                          <button
                            key={severity}
                            onClick={() => updateAssociatedSymptomDetail(symptom, 'severity', severity)}
                            className={`p-2 text-xs border rounded transition-colors ${
                              associatedSymptomDetails[symptom]?.severity === severity
                                ? 'border-medical-green bg-medical-green text-white'
                                : 'border-gray-200 hover:border-medical-green'
                            }`}
                          >
                            {severity}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional notes */}
                    <div>
                      <label className="block text-sm font-medium text-medical-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-200 rounded text-sm"
                        rows={2}
                        placeholder={`Additional details about ${symptom.toLowerCase()}...`}
                        value={associatedSymptomDetails[symptom]?.notes || ''}
                        onChange={(e) => updateAssociatedSymptomDetail(symptom, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-medical-gray-200">
          <button 
            onClick={onPreviousStep}
            className="px-6 py-3 text-medical-gray-600 font-medium hover:text-medical-gray-900 flex items-center transition-colors" 
            data-testid="button-previous"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous: Symptom Selection
          </button>
          <button
            onClick={onNextStep}
            className="px-8 py-3 bg-medical-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
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