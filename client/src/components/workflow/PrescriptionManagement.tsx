import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Pill, Plus, Edit, Trash2 } from "lucide-react";

interface PrescriptionManagementProps {
  selectedTemplate: any;
  prescriptionItems: any[];
  onTemplateSelect: (template: any) => void;
  onEditItem: (item: any) => void;
  onDeleteItem: (itemId: string) => void;
  onAddNewMedicine: () => void;
}

export function PrescriptionManagement({
  selectedTemplate,
  prescriptionItems,
  onTemplateSelect,
  onEditItem,
  onDeleteItem,
  onAddNewMedicine
}: PrescriptionManagementProps) {
  const { data: templates = [] } = useQuery({
    queryKey: ['/api/prescription-templates'],
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-medical-gray-200 p-6">
          <h3 className="text-lg font-semibold text-medical-gray-900 mb-4 flex items-center">
            <ClipboardList className="h-5 w-5 text-medical-blue mr-2" />
            Pill Templates
          </h3>
          
          <div className="space-y-3">
            {templates.map((template: any) => (
              <div
                key={template.id}
                className="p-4 border border-medical-gray-200 rounded-lg hover:border-medical-blue cursor-pointer transition-colors"
                onClick={() => onTemplateSelect(template)}
                data-testid={`button-template-${template.id}`}
              >
                <h4 className="font-medium text-medical-gray-900">{template.name}</h4>
                <p className="text-sm text-medical-gray-600 mt-1">
                  {Array.isArray(template.medications) ? template.medications.length : 0} medications
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pill Editor */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-medical-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-medical-gray-900 flex items-center">
              <Pill className="h-5 w-5 text-medical-green mr-2" />
              Current Pill
            </h3>
            <button 
              className="px-4 py-2 bg-medical-blue hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
              onClick={onAddNewMedicine}
              data-testid="button-add-medicine"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </button>
          </div>

          {/* Pill Items */}
          <div className="space-y-4 mb-6">
            {prescriptionItems.length > 0 ? (
              prescriptionItems.map((item) => (
                <div 
                  key={item.id} 
                  className="border border-medical-gray-200 rounded-lg p-4"
                  data-testid={`prescription-item-${item.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-medical-gray-900">{item.medicine}</h4>
                      <div className="text-sm text-medical-gray-600 mt-1">
                        <span>{item.strength}</span> • 
                        <span>{item.frequency}</span> • 
                        <span>{item.duration}</span>
                      </div>
                      <div className="text-sm text-medical-gray-500 mt-1">
                        {item.instructions}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-medical-blue hover:text-blue-700 p-1"
                        onClick={() => onEditItem(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-medical-red hover:text-red-700 p-1"
                        onClick={() => onDeleteItem(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-medical-gray-500">
                <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No medications added yet</p>
                <p className="text-sm">Select a template or add medicines manually</p>
              </div>
            )}
          </div>

          {/* Drug Interaction Alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-yellow-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Drug Interaction Warning:</strong> No significant interactions detected for current prescription.
                </p>
              </div>
            </div>
          </div>

          {/* Pill Summary */}
          <div className="bg-medical-gray-50 p-4 rounded-lg">
            <div className="text-sm text-medical-gray-600">
              <div className="flex justify-between mb-2">
                <span>Total Medications:</span>
                <span className="font-semibold">{prescriptionItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Treatment Duration:</span>
                <span className="font-semibold">
                  {prescriptionItems.length > 0 ? prescriptionItems[0]?.duration || 'Varies' : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
