import { useState } from "react";
import { ArrowRight, ArrowLeft, FileText, Search } from "lucide-react";

interface DiagnosisSelectionProps {
  onPreviousStep: () => void;
  onNextStep: () => void;
}

const diagnosisCategories = [
  {
    category: "Respiratory",
    diagnoses: [
      { id: "resp_001", code: "J00", name: "Acute nasopharyngitis (common cold)", description: "Viral upper respiratory tract infection" },
      { id: "resp_002", code: "J06.9", name: "Acute upper respiratory infection", description: "Unspecified acute upper respiratory infection" },
      { id: "resp_003", code: "J20.9", name: "Acute bronchitis", description: "Acute inflammation of bronchi" },
      { id: "resp_004", code: "J18.9", name: "Pneumonia", description: "Unspecified pneumonia" },
      { id: "resp_005", code: "J45.9", name: "Asthma", description: "Unspecified asthma" },
      { id: "resp_006", code: "A15.9", name: "Pulmonary tuberculosis", description: "Respiratory tuberculosis" }
    ]
  },
  {
    category: "Gastrointestinal",
    diagnoses: [
      { id: "gi_001", code: "K59.1", name: "Diarrhea", description: "Unspecified diarrhea" },
      { id: "gi_002", code: "K30", name: "Functional dyspepsia", description: "Indigestion" },
      { id: "gi_003", code: "K21.9", name: "Gastro-esophageal reflux disease", description: "Without esophagitis" },
      { id: "gi_004", code: "K25.9", name: "Gastric ulcer", description: "Unspecified gastric ulcer" },
      { id: "gi_005", code: "K58.9", name: "Irritable bowel syndrome", description: "Without diarrhea" },
      { id: "gi_006", code: "K92.2", name: "Gastrointestinal bleeding", description: "Unspecified" }
    ]
  },
  {
    category: "Cardiovascular",
    diagnoses: [
      { id: "cv_001", code: "I10", name: "Essential hypertension", description: "Primary hypertension" },
      { id: "cv_002", code: "I25.9", name: "Chronic ischemic heart disease", description: "Unspecified" },
      { id: "cv_003", code: "I48.91", name: "Atrial fibrillation", description: "Unspecified atrial fibrillation" },
      { id: "cv_004", code: "I50.9", name: "Heart failure", description: "Unspecified heart failure" },
      { id: "cv_005", code: "I20.9", name: "Angina pectoris", description: "Unspecified angina pectoris" }
    ]
  },
  {
    category: "Endocrine",
    diagnoses: [
      { id: "endo_001", code: "E11.9", name: "Type 2 diabetes mellitus", description: "Without complications" },
      { id: "endo_002", code: "E10.9", name: "Type 1 diabetes mellitus", description: "Without complications" },
      { id: "endo_003", code: "E03.9", name: "Hypothyroidism", description: "Unspecified" },
      { id: "endo_004", code: "E05.90", name: "Hyperthyroidism", description: "Unspecified" },
      { id: "endo_005", code: "E66.9", name: "Obesity", description: "Unspecified" }
    ]
  },
  {
    category: "Infectious",
    diagnoses: [
      { id: "inf_001", code: "A09", name: "Gastroenteritis", description: "Infectious gastroenteritis" },
      { id: "inf_002", code: "B34.9", name: "Viral infection", description: "Unspecified viral infection" },
      { id: "inf_003", code: "N39.0", name: "Urinary tract infection", description: "UTI, site not specified" },
      { id: "inf_004", code: "A50.9", name: "Dengue fever", description: "Unspecified dengue fever" },
      { id: "inf_005", code: "B50.9", name: "Malaria", description: "Plasmodium falciparum malaria" },
      { id: "inf_006", code: "A01.0", name: "Typhoid fever", description: "Typhoid fever" }
    ]
  },
  {
    category: "Neurological",
    diagnoses: [
      { id: "neuro_001", code: "G43.9", name: "Migraine", description: "Unspecified migraine" },
      { id: "neuro_002", code: "R51", name: "Headache", description: "Unspecified headache" },
      { id: "neuro_003", code: "G40.9", name: "Epilepsy", description: "Unspecified epilepsy" },
      { id: "neuro_004", code: "I64", name: "Stroke", description: "Not specified as hemorrhage or infarction" },
      { id: "neuro_005", code: "F32.9", name: "Depression", description: "Major depressive disorder" }
    ]
  }
];

export function DiagnosisSelection({ onPreviousStep, onNextStep }: DiagnosisSelectionProps) {
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleDiagnosis = (diagnosisId: string) => {
    setSelectedDiagnoses(prev => 
      prev.includes(diagnosisId)
        ? prev.filter(id => id !== diagnosisId)
        : [...prev, diagnosisId]
    );
  };

  const getSelectedDiagnosisDetails = () => {
    const selected: any[] = [];
    diagnosisCategories.forEach(category => {
      category.diagnoses.forEach(diagnosis => {
        if (selectedDiagnoses.includes(diagnosis.id)) {
          selected.push({ ...diagnosis, category: category.category });
        }
      });
    });
    return selected;
  };

  const filteredCategories = diagnosisCategories.map(category => ({
    ...category,
    diagnoses: category.diagnoses.filter(diagnosis =>
      diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    selectedCategory === 'All' || category.category === selectedCategory
  ).filter(category => category.diagnoses.length > 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-medical-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-medical-gray-900 mb-2 flex items-center">
            <FileText className="h-6 w-6 text-medical-blue mr-3" />
            Clinical Diagnosis
          </h2>
          <p className="text-medical-gray-600">
            Select the most appropriate diagnosis(es) based on clinical findings and investigations.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search diagnoses by name, ICD code, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue"
                data-testid="input-diagnosis-search"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue"
              data-testid="select-diagnosis-category"
            >
              <option value="All">All Categories</option>
              {diagnosisCategories.map(category => (
                <option key={category.category} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Diagnoses Summary */}
        {selectedDiagnoses.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-800 mb-3">
              Selected Diagnoses ({selectedDiagnoses.length})
            </h3>
            <div className="space-y-2">
              {getSelectedDiagnosisDetails().map(diagnosis => (
                <div key={diagnosis.id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-medical-gray-900">{diagnosis.name}</span>
                      <span className="bg-medical-blue text-white text-xs px-2 py-1 rounded">{diagnosis.code}</span>
                      <span className="text-xs text-medical-gray-500 bg-gray-100 px-2 py-1 rounded">{diagnosis.category}</span>
                    </div>
                    <p className="text-sm text-medical-gray-600 mt-1">{diagnosis.description}</p>
                  </div>
                  <button
                    onClick={() => toggleDiagnosis(diagnosis.id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                    data-testid={`button-remove-${diagnosis.id}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnosis Categories */}
        <div className="space-y-6 mb-8">
          {filteredCategories.map(category => (
            <div key={category.category} className="border border-medical-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-medical-gray-900 mb-4 text-lg">
                {category.category} Conditions
              </h3>
              <div className="grid gap-3">
                {category.diagnoses.map(diagnosis => (
                  <div
                    key={diagnosis.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedDiagnoses.includes(diagnosis.id)
                        ? 'border-medical-green bg-green-50'
                        : 'border-medical-gray-200 hover:border-medical-blue hover:bg-blue-50'
                    }`}
                    onClick={() => toggleDiagnosis(diagnosis.id)}
                    data-testid={`card-diagnosis-${diagnosis.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedDiagnoses.includes(diagnosis.id)}
                            onChange={() => toggleDiagnosis(diagnosis.id)}
                            className="text-medical-green rounded"
                            data-testid={`checkbox-diagnosis-${diagnosis.id}`}
                          />
                          <span className="font-medium text-medical-gray-900">{diagnosis.name}</span>
                          <span className="bg-medical-blue text-white text-xs px-2 py-1 rounded font-mono">
                            {diagnosis.code}
                          </span>
                        </div>
                        <p className="text-sm text-medical-gray-600 ml-6">
                          {diagnosis.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-medical-gray-500">No diagnoses found matching "{searchTerm}"</p>
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
            Previous: Investigations
          </button>
          <button
            onClick={onNextStep}
            disabled={selectedDiagnoses.length === 0}
            className="px-8 py-3 bg-medical-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            data-testid="button-next"
          >
            Next: Prescription ({selectedDiagnoses.length} selected)
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}