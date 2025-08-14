import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Search, Save, Pill } from "lucide-react";
import { frequencyOptions, durationOptions, instructionOptions } from "@/lib/medical-data";

interface MedicineModalProps {
  editingItem: any;
  medicineSearch: string;
  onMedicineSearchChange: (search: string) => void;
  onUpdateItem: (item: any) => void;
  onClose: () => void;
}

export function MedicineModal({
  editingItem,
  medicineSearch,
  onMedicineSearchChange,
  onUpdateItem,
  onClose
}: MedicineModalProps) {
  const [formData, setFormData] = useState(editingItem || {});

  const { data: medicines = [] } = useQuery({
    queryKey: ['/api/medicines', medicineSearch],
    enabled: medicineSearch.length > 0,
  });

  useEffect(() => {
    setFormData(editingItem || {});
  }, [editingItem]);

  const handleSave = () => {
    if (formData.medicine && formData.strength && formData.frequency && formData.duration) {
      onUpdateItem(formData);
    }
  };

  const selectMedicine = (medicine: any) => {
    setFormData(prev => ({
      ...prev,
      medicine: medicine.name
    }));
    onMedicineSearchChange('');
  };

  const getStrengthOptions = (medicineName: string) => {
    const medicine = medicines.find(m => m.name === medicineName);
    return medicine?.strengths || ['5mg', '10mg', '25mg', '50mg', '100mg', '250mg', '500mg', '1g'];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-medical-gray-200">
          <h3 className="text-lg font-semibold text-medical-gray-900 flex items-center">
            <Pill className="h-5 w-5 text-medical-green mr-2" />
            Add/Edit Medicine
          </h3>
          <button 
            className="text-medical-gray-400 hover:text-medical-gray-600 text-xl"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* Medicine Search */}
            <div>
              <label className="block text-sm font-medium text-medical-gray-700 mb-2">
                Medicine Name
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full p-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue pl-10"
                  placeholder="Search medicine..."
                  value={formData.medicine || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, medicine: e.target.value }));
                    onMedicineSearchChange(e.target.value);
                  }}
                  data-testid="input-medicine-search"
                />
                <Search className="h-4 w-4 absolute left-3 top-4 text-medical-gray-400" />
              </div>
              
              {/* Medicine Suggestions */}
              {medicineSearch && medicines.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-medical-gray-200 rounded-lg">
                  {medicines.map((medicine: any) => (
                    <div 
                      key={medicine.id}
                      className="p-3 hover:bg-medical-gray-50 cursor-pointer border-b border-medical-gray-100 last:border-b-0" 
                      onClick={() => selectMedicine(medicine)}
                      data-testid={`medicine-option-${medicine.id}`}
                    >
                      <span className="text-sm">{medicine.name}</span>
                      {medicine.genericName && (
                        <span className="text-xs text-medical-gray-500 ml-2">({medicine.genericName})</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strength */}
            <div>
              <label className="block text-sm font-medium text-medical-gray-700 mb-2">
                Strength
              </label>
              <select 
                className="w-full p-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue" 
                value={formData.strength || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value }))}
                data-testid="select-strength"
              >
                <option value="">Select strength</option>
                {getStrengthOptions(formData.medicine).map((strength: string) => (
                  <option key={strength} value={strength}>{strength}</option>
                ))}
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-medical-gray-700 mb-2">
                Frequency
              </label>
              <select 
                className="w-full p-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue" 
                value={formData.frequency || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                data-testid="select-frequency"
              >
                <option value="">Select frequency</option>
                {frequencyOptions.map((freq: any) => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-medical-gray-700 mb-2">
                Duration
              </label>
              <select 
                className="w-full p-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue" 
                value={formData.duration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                data-testid="select-duration"
              >
                <option value="">Select duration</option>
                {durationOptions.map((duration: string) => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-medical-gray-700 mb-2">
                Instructions
              </label>
              <textarea 
                className="w-full p-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue h-20 resize-none"
                placeholder="After meals, with plenty of water..."
                value={formData.instructions || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                data-testid="textarea-instructions"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {instructionOptions.map((instruction: string) => (
                  <button
                    key={instruction}
                    type="button"
                    className="text-xs bg-medical-gray-100 hover:bg-medical-gray-200 text-medical-gray-700 px-2 py-1 rounded transition-colors"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      instructions: prev.instructions ? `${prev.instructions}, ${instruction}` : instruction 
                    }))}
                    data-testid={`button-instruction-${instruction.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {instruction}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-medical-gray-200">
          <button 
            className="px-6 py-2 text-medical-gray-600 border border-medical-gray-300 rounded-lg hover:bg-medical-gray-50 transition-colors"
            onClick={onClose}
            data-testid="button-cancel"
          >
            Cancel
          </button>
          <button 
            className="px-6 py-2 bg-medical-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
            onClick={handleSave}
            disabled={!formData.medicine || !formData.strength || !formData.frequency || !formData.duration}
            data-testid="button-save-medicine"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Medicine
          </button>
        </div>
      </div>
    </div>
  );
}
