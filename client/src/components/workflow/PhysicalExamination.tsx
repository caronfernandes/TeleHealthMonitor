import { Stethoscope, AlertTriangle, ArrowRight } from "lucide-react";
import { examinationItems } from "@/lib/medical-data";

interface PhysicalExaminationProps {
  selectedExaminations: Record<string, boolean>;
  examinationValues: Record<string, string>;
  redFlags: Array<{ text: string; critical: boolean; source: string }>;
  onExaminationSelect: (examId: string) => void;
  onExaminationValueChange: (examId: string, value: string) => void;
  onNextStep: () => void;
}

export function PhysicalExamination({
  selectedExaminations,
  examinationValues,
  redFlags,
  onExaminationSelect,
  onExaminationValueChange,
  onNextStep
}: PhysicalExaminationProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-medical-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-medical-gray-900 mb-2 flex items-center">
            <Stethoscope className="h-6 w-6 text-medical-blue mr-3" />
            Physical Examination
          </h2>
          <p className="text-medical-gray-600">Record vital signs and clinical findings</p>
        </div>

        {/* Red Flags Alert */}
        {redFlags.length > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-bold text-red-800">🚨 RED FLAGS DETECTED</span>
            </div>
            <div className="space-y-2">
              {redFlags.map((flag, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 p-2 rounded ${
                    flag.critical ? 'bg-red-100 border border-red-300' : 'bg-yellow-100 border border-yellow-300'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${flag.critical ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                  <span className={`font-medium ${flag.critical ? 'text-red-800' : 'text-yellow-800'}`}>
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
          <h3 className="font-medium text-blue-800 mb-2">Vital Signs (Auto-pulled from reception)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-medical-gray-700">Temperature</div>
              <div className="text-lg text-blue-600">101.2°F</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-medical-gray-700">Pulse</div>
              <div className="text-lg text-blue-600">92/min</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-medical-gray-700">BP</div>
              <div className="text-lg text-blue-600">120/80 mmHg</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-medical-gray-700">RR</div>
              <div className="text-lg text-blue-600">18/min</div>
            </div>
          </div>
        </div>

        {/* Clinical Examination */}
        <div className="space-y-4 mb-8">
          <h3 className="font-medium text-medical-gray-700 text-lg">Clinical Examination</h3>
          
          <div className="grid gap-4">
            {examinationItems.map((exam) => {
              const hasRedFlag = redFlags.some(flag => flag.source === exam.id);
              
              return (
                <div 
                  key={exam.id} 
                  className={`border rounded-lg p-4 ${
                    hasRedFlag ? 'border-red-300 bg-red-50' : 'border-medical-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <input 
                      type="checkbox" 
                      checked={selectedExaminations[exam.id] || false}
                      onChange={() => onExaminationSelect(exam.id)}
                      className="text-green-600 mt-1"
                      data-testid={`checkbox-exam-${exam.id}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-medical-gray-800">{exam.label}</span>
                        {hasRedFlag && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {exam.normalRange && (
                        <div className="text-xs text-medical-gray-500 mt-1">Normal: {exam.normalRange}</div>
                      )}
                    </div>
                  </div>

                  {selectedExaminations[exam.id] && (
                    <div className="mt-3 pl-8">
                      {exam.type === 'input' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder={exam.placeholder}
                            value={examinationValues[exam.id] || ''}
                            onChange={(e) => onExaminationValueChange(exam.id, e.target.value)}
                            className={`flex-1 p-2 border rounded-md text-sm ${
                              hasRedFlag ? 'border-red-300 bg-white' : 'border-medical-gray-300'
                            }`}
                            data-testid={`input-exam-${exam.id}`}
                          />
                          {exam.unit && (
                            <span className="text-sm text-medical-gray-500 font-medium">{exam.unit}</span>
                          )}
                        </div>
                      )}

                      {exam.type === 'select' && (
                        <select
                          value={examinationValues[exam.id] || ''}
                          onChange={(e) => onExaminationValueChange(exam.id, e.target.value)}
                          className={`w-full p-2 border rounded-md text-sm ${
                            hasRedFlag ? 'border-red-300 bg-white' : 'border-medical-gray-300'
                          }`}
                          data-testid={`select-exam-${exam.id}`}
                        >
                          <option value="">Select option...</option>
                          {exam.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}

                      {exam.type === 'textarea' && (
                        <textarea
                          placeholder={exam.placeholder}
                          value={examinationValues[exam.id] || ''}
                          onChange={(e) => onExaminationValueChange(exam.id, e.target.value)}
                          className={`w-full p-2 border rounded-md text-sm h-20 resize-none ${
                            hasRedFlag ? 'border-red-300 bg-white' : 'border-medical-gray-300'
                          }`}
                          data-testid={`textarea-exam-${exam.id}`}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary of Selected Examinations */}
        {Object.keys(selectedExaminations).filter(key => selectedExaminations[key]).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-green-800 mb-2">Examination Summary</h4>
            <div className="space-y-1">
              {Object.keys(selectedExaminations)
                .filter(key => selectedExaminations[key])
                .map(examId => {
                  const exam = examinationItems.find(e => e.id === examId);
                  const value = examinationValues[examId];
                  return (
                    <div key={examId} className="text-sm text-green-700">
                      <strong>{exam?.label}:</strong> {value || 'Not specified'} {exam?.unit || ''}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-medical-gray-200">
          <button 
            className="px-6 py-2 text-medical-gray-600 border border-medical-gray-300 rounded-lg hover:bg-medical-gray-50"
            data-testid="button-previous"
          >
            <i className="fas fa-arrow-left mr-2"></i>Previous
          </button>
          <button
            onClick={onNextStep}
            className="px-8 py-3 bg-medical-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
            data-testid="button-next"
          >
            Continue to Red Flags
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
