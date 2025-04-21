import { useState, useEffect } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";
import Switch from "../Switch/index.js";
import OptionsList from "../OptionsList/index.js";

export default function FieldEditModal({ field, onSave, onCancel, isNewField = false }) {
    // Create local state for editing to avoid directly modifying the passed field
    const [editingField, setEditingField] = useState({
        label: '',
        field_key: '',
        field_type: 'text',
        required: false,
        placeholder: '',
        options: '',
        validation_rules: null,
        width: 'full'
    });
    
    useEffect(() => {
        if (field) {
            // Create a deep copy of the field object
            const fieldCopy = { ...field };
            
            // Convert options array to comma-separated string for editing if needed
            if (Array.isArray(fieldCopy.options)) {
                fieldCopy.options = fieldCopy.options;
            } else if (fieldCopy.options === null || fieldCopy.options === undefined) {
                fieldCopy.options = [];
            }
            
            setEditingField(fieldCopy);
        }
    }, [field]);
    
    if (!field) return null;
    
    const handleLabelChange = (e) => {
        const newLabel = e.target.value;
        // Only auto-update field_key if it's empty or matches the transformed version of the previous label
        // This allows manual edits to field_key to persist if the user changes it
        setEditingField(prev => {
            const previousAutoKey = prev.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const newAutoKey = newLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const shouldUpdateKey = !prev.field_key || prev.field_key === previousAutoKey;
            
            return {
                ...prev,
                label: newLabel,
                field_key: shouldUpdateKey ? newAutoKey : prev.field_key
            };
        });
    };
    
    const handleOptionsChange = (options) => {
        setEditingField(prev => ({
            ...prev,
            options: options
        }));
    };
    
    const handleSave = () => {
        // Validate fields before saving
        if (!editingField.label.trim()) {
            alert('Field label is required');
            return;
        }
        
        if (!editingField.field_key.trim()) {
            alert('Field key is required');
            return;
        }
        
        onSave(editingField);
    };

    const modalTitle = isNewField ? "Add New Field" : "Edit Field";
    const buttonText = isNewField ? "Add Field" : "Save Changes";

    return html`
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h3 class="text-lg font-medium mb-4">${modalTitle}</h3>
                
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Field Label</label>
                            <input
                                type="text"
                                class="w-full p-2 border rounded"
                                value=${editingField.label}
                                onInput=${handleLabelChange}
                            />
                        </div>
                        
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Field Key</label>
                            <input
                                type="text"
                                class="w-full p-2 border rounded"
                                value=${editingField.field_key}
                                onInput=${(e) => setEditingField(prev => ({
                                    ...prev,
                                    field_key: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_')
                                }))}
                            />
                        </div>
                        
                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Field Type</label>
                            <select
                                class="w-full p-2 border rounded"
                                value=${editingField.field_type}
                                onChange=${(e) => setEditingField(prev => ({
                                    ...prev,
                                    field_type: e.target.value
                                }))}
                            >
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="textarea">Textarea</option>
                                <option value="select">Select</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="radio">Radio</option>
                                <option value="date">Date</option>
                                <option value="number">Number</option>
                            </select>
                        </div>
                        
                        <div class="flex flex-col">
                            <label class="block font-medium text-gray-700 mb-1">Required</label>
                            <div class="flex flex-1 items-center h-10">
                                <${Switch}
                                    checked=${editingField.required}
                                    onChange=${(e) => setEditingField(prev => ({
                                        ...prev,
                                        required: e.target.checked
                                    }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block font-medium text-gray-700 mb-1">Field Width</label>
                            <select
                                class="w-full p-2 border rounded"
                                value=${editingField.width || 'full'}
                                onChange=${(e) => setEditingField(prev => ({
                                ...prev,
                                width: e.target.value
                                }))}
                            >
                                <option value="full">Full Width</option>
                                <option value="half">Half Width</option>
                                <option value="third">Third Width</option>
                                <option value="quarter">Quarter Width</option>
                            </select>
                        </div>
                                                
                        <div class="col-span-2">
                            <label class="block font-medium text-gray-700 mb-1">Placeholder</label>
                            <input
                                type="text"
                                class="w-full p-2 border rounded"
                                placeholder="Placeholder (optional)"
                                value=${editingField.placeholder || ''}
                                onInput=${(e) => setEditingField(prev => ({
                                    ...prev,
                                    placeholder: e.target.value
                                }))}
                            />
                        </div>
                        
                        ${(editingField.field_type === 'select' || editingField.field_type === 'radio' || editingField.field_type === 'checkbox') && html`
                            <div class="col-span-2">
                                <${OptionsList}
                                    options=${editingField.options}
                                    onChange=${handleOptionsChange}
                                />
                            </div>
                        `}
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick=${onCancel}
                        class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick=${handleSave}
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        ${buttonText}
                    </button>
                </div>
            </div>
        </div>
    `;
}