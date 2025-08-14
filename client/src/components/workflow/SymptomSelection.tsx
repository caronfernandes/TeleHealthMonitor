import { Thermometer, ArrowRight } from "lucide-react";

interface SymptomSelectionProps {
  selectedSymptom: string;
  onSymptomSelect: (symptom: string) => void;
  onNextStep: () => void;
}

export function SymptomSelection({ selectedSymptom, onSymptomSelect, onNextStep }: SymptomSelectionProps) {
  const symptoms = [
    { id: 'fever', label: 'Fever', icon: 'fas fa-thermometer-half', color: 'bg-medical-blue', description: 'Pyrexia', note: 'Most common presentation' },
    { id: 'oa', label: 'OA', icon: 'fas fa-bone', color: 'bg-medical-green', description: 'Osteoarthritis', note: 'Joint degenerative disease' },
    { id: 'multifocal_pain', label: 'Multifocal Pain', icon: 'fas fa-hand-dots', color: 'bg-purple-500', description: 'Multiple joint pain', note: 'Widespread pain syndrome' },
    { id: 'degen_spine', label: 'Degen Spine', icon: 'fas fa-spine', color: 'bg-medical-orange', description: 'Degenerative spine', note: 'Spinal degeneration' },
    { id: 'ctd', label: 'CTD', icon: 'fas fa-dna', color: 'bg-medical-red', description: 'Connective Tissue Disease', note: 'Autoimmune conditions' },
    { id: 'spa', label: 'SpA', icon: 'fas fa-joints', color: 'bg-indigo-500', description: 'Spondyloarthritis', note: 'Inflammatory arthritis' },
  ];

  const feverDetails = {
    duration: ['<3 days', '3–7 days', '> 7 days', 'Intermittent', 'Persistent', 'Recurrent'],
    pattern: ['Continuous', 'Intermittent', 'Remittent', 'Quotidian', 'Step-ladder', 'Relapsing'],
    associated: ['Rash', 'Cough', 'Headache', 'Joint pain', 'Burning micturition', 'Vomiting', 'Abdominal pain', 'Sore throat', 'Weight loss', 'Night sweats']
  };

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

        {/* Fever Details (shown when fever is selected) */}
        {selectedSymptom === 'fever' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-medical-gray-900 mb-4 flex items-center">
              <Thermometer className="h-5 w-5 text-medical-blue mr-2" />
              Fever - Detailed Assessment
            </h3>
            
            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                Duration of Fever
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {feverDetails.duration.map((duration, index) => (
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
                {feverDetails.pattern.map((pattern, index) => (
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

            {/* Associated Symptoms */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-medical-gray-700 mb-3">
                Associated Symptoms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {feverDetails.associated.map((symptom) => (
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
