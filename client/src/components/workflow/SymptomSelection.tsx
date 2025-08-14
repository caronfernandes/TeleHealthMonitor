import { Thermometer, ArrowRight } from "lucide-react";
import { symptoms } from "@/lib/medical-data";

interface SymptomSelectionProps {
  selectedSymptom: string;
  onSymptomSelect: (symptom: string) => void;
  onNextStep: () => void;
}

export function SymptomSelection({ selectedSymptom, onSymptomSelect, onNextStep }: SymptomSelectionProps) {
  const selectedSymptomData = symptoms.find(s => s.id === selectedSymptom);
  
  console.log('Selected symptom:', selectedSymptom);
  console.log('Selected symptom data:', selectedSymptomData);
  console.log('Symptoms available:', symptoms.map(s => s.id));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-medical-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-medical-gray-900 mb-2">
            Select Primary Symptom
          </h2>
          <p className="text-medical-gray-600">
            Choose the main complaint that brought the patient to you today.
          </p>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-medical-gray-900 mb-4 flex items-center">
              <i className={`${selectedSymptomData.icon} text-medical-blue mr-2`}></i>
              {selectedSymptomData.label} - Detailed Assessment
            </h3>
            
            {/* Render different detail sections based on symptom type */}
            {selectedSymptom === 'fever' && (
              <>
                {/* Duration */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                    Duration of Fever
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedSymptomData?.details?.duration?.map((duration, index) => (
                      <button
                        key={duration}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          index === 0 
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue'
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
                    {selectedSymptomData?.details?.pattern?.map((pattern, index) => (
                      <button
                        key={pattern}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          pattern === 'Step-ladder'
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue'
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
                    {selectedSymptomData?.details?.response?.map((response, index) => (
                      <button
                        key={response}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          index === 0 
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue'
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
                    {selectedSymptomData?.details?.onset?.map((onset, index) => (
                      <button
                        key={onset}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          index === 0 
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue'
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
                    {selectedSymptomData?.details?.type?.map((type, index) => (
                      <button
                        key={type}
                        className={`p-3 text-left border-2 rounded-lg text-sm transition-colors ${
                          index === 0 
                            ? 'border-medical-blue bg-medical-blue text-white font-medium'
                            : 'border-medical-gray-200 hover:border-medical-blue'
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
                        defaultChecked={['Rash', 'Headache', 'Night sweats'].includes(symptom)}
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
