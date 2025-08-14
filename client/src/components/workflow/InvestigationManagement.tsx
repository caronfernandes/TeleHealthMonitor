import { ArrowRight } from "lucide-react";
import { investigationOptions } from "@/lib/medical-data";

interface InvestigationManagementProps {
  investigations: string[];
  investigationValues: Record<string, Record<string, string>>;
  investigationStatus: Record<string, string>;
  onInvestigationToggle: (testId: string) => void;
  onInvestigationStatusChange: (testId: string, status: string) => void;
  onInvestigationValueChange: (testId: string, valueKey: string, value: string) => void;
  onNextStep: () => void;
}

export function InvestigationManagement({
  investigations,
  investigationValues,
  investigationStatus,
  onInvestigationToggle,
  onInvestigationStatusChange,
  onInvestigationValueChange,
  onNextStep
}: InvestigationManagementProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-medical-gray-200 p-8">
        <h2 className="text-xl font-bold text-medical-gray-900 mb-6">
          Investigations (जांच करवाएं)
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-3">
            Recommended for Fever (बुखार के लिए सुझाई गई जांच)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {investigationOptions.map((test) => (
              <button
                key={test.id}
                onClick={() => onInvestigationToggle(test.id)}
                className={`p-3 rounded border text-sm text-left transition-colors ${
                  investigations.includes(test.id) 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                }`}
                data-testid={`button-investigation-${test.id}`}
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
        </div>

        {/* Selected Investigations Configuration */}
        {investigations.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-medical-gray-700 text-lg">Configure Selected Investigations</h3>
            
            {investigations.map((testId) => {
              const test = investigationOptions.find(t => t.id === testId);
              const status = investigationStatus[testId] || 'todo';
              
              return (
                <div key={testId} className="border border-medical-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-medical-gray-800">{test?.name}</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-medical-gray-600">Status:</label>
                        <select
                          value={status}
                          onChange={(e) => onInvestigationStatusChange(testId, e.target.value)}
                          className="text-sm border border-medical-gray-300 rounded px-2 py-1"
                          data-testid={`select-status-${testId}`}
                        >
                          <option value="todo">To be done</option>
                          <option value="done">Already done</option>
                        </select>
                      </div>
                      
                      {status === 'done' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Done
                        </span>
                      )}
                      {status === 'todo' && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          ⏳ To Do
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Values Input */}
                  {status === 'done' && test?.hasValues && (
                    <div className="mt-4 p-4 bg-medical-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-medical-gray-700 mb-3">Enter Results:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {test.values?.map((valueKey) => (
                          <div key={valueKey}>
                            <label className="block text-xs text-medical-gray-600 mb-1">{valueKey}</label>
                            <input
                              type="text"
                              placeholder={`Enter ${valueKey}`}
                              value={investigationValues[testId]?.[valueKey] || ''}
                              onChange={(e) => onInvestigationValueChange(testId, valueKey, e.target.value)}
                              className="w-full p-2 border border-medical-gray-300 rounded text-sm"
                              data-testid={`input-${testId}-${valueKey.replace(/\s+/g, '-').toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructions for 'todo' investigations */}
                  {status === 'todo' && (
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

        {/* Summary */}
        {investigations.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-green-800 mb-2">Investigation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-green-700 mb-1">
                  ✅ Already Done ({investigations.filter(id => investigationStatus[id] === 'done').length})
                </h5>
                <ul className="text-sm text-green-600 space-y-1">
                  {investigations
                    .filter(id => investigationStatus[id] === 'done')
                    .map(id => {
                      const test = investigationOptions.find(t => t.id === id);
                      return <li key={id}>• {test?.name}</li>;
                    })}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-green-700 mb-1">
                  📋 To be Prescribed ({investigations.filter(id => investigationStatus[id] !== 'done').length})
                </h5>
                <ul className="text-sm text-green-600 space-y-1">
                  {investigations
                    .filter(id => investigationStatus[id] !== 'done')
                    .map(id => {
                      const test = investigationOptions.find(t => t.id === id);
                      return <li key={id}>• {test?.name}</li>;
                    })}
                </ul>
              </div>
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
            Continue to Diagnosis
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
