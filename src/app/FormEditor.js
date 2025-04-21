import { useState, useEffect, useRef } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";
import { hasFormContent, hasFormChanges } from "../helpers.js";
import FieldEditModal from "./components/FieldEditModal/index.js";
import Switch from "./components/Switch/index.js";
import ConfirmDialog from "./components/ConfirmDialog/index.js";
import FormPreview from "./components/FormPreview/index.js";
import FieldListItemDraggable from "./components/FieldListItemDraggable/index.js";

export default function FormEditor({ onSave, onCancel, initialForm = null, onFormChange }) {
    const [formState, setFormState] = useState(initialForm || {
        id: null,
        name: '',
        description: '',
        fields: [],
        width: 'full',
        notify_admin: false,
        enable_redirect: true,
        redirect_url: '/contact_thank_you/'
    });

    const [editingField, setEditingField] = useState(null);
    const [editingFieldIndex, setEditingFieldIndex] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isAddingField, setIsAddingField] = useState(false);
    const [showConfirmCancelDialog, setShowConfirmCancelDialog] = useState(false);
    
    // Reference to the sortable container
    const sortableContainerRef = useRef(null);
    const sortableInstanceRef = useRef(null);

    useEffect(() => {
        if (initialForm) {
            setFormState({
                id: initialForm.id,
                name: initialForm.name,
                description: initialForm.description,
                fields: initialForm.fields || [],
                notify_admin: initialForm.notify_admin || false,
                enable_redirect: initialForm.enable_redirect !== undefined ? initialForm.enable_redirect : true,
                redirect_url: initialForm.redirect_url || '/contact_thank_you/'
            });
        }
    }, [initialForm]);
    
    // Initialize Sortable.js
    useEffect(() => {
        if (sortableContainerRef.current && formState.fields.length > 1 && window.Sortable) {
            // Cleanup previous instance if it exists
            if (sortableInstanceRef.current) {
                sortableInstanceRef.current.destroy();
            }
            
            // Create new Sortable instance
            sortableInstanceRef.current = window.Sortable.create(sortableContainerRef.current, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onEnd: function(evt) {
                    const oldIndex = evt.oldIndex;
                    const newIndex = evt.newIndex;
                    
                    if (oldIndex !== newIndex) {
                        setFormState(prev => {
                            const fields = [...prev.fields];
                            const [moved] = fields.splice(oldIndex, 1);
                            fields.splice(newIndex, 0, moved);
                            
                            return {
                                ...prev,
                                fields: fields.map((field, index) => ({
                                    ...field,
                                    order: index
                                }))
                            };
                        });
                    }
                }
            });
        }
        
        // Cleanup function
        return () => {
            if (sortableInstanceRef.current) {
                sortableInstanceRef.current.destroy();
                sortableInstanceRef.current = null;
            }
        };
    }, [formState.fields.length]);

    const updateFormState = (newState) => {
        setFormState(newState);
        // Only call onFormChange if it's provided
        if (typeof onFormChange === 'function') {
            onFormChange(newState);
        }
    };

    useEffect(() => {
        if (initialForm) {
            const initialFormState = {
                id: initialForm.id,
                name: initialForm.name,
                description: initialForm.description,
                fields: initialForm.fields || [],
                notify_admin: initialForm.notify_admin || false,
                enable_redirect: initialForm.enable_redirect !== undefined ? initialForm.enable_redirect : true,
                redirect_url: initialForm.redirect_url || '/contact_thank_you/'
            };
            
            setFormState(initialFormState); // Fixed the lowercase 's'
            // Report initial state to parent
            if (typeof onFormChange === 'function') {
                onFormChange(initialFormState);
            }
        }
    }, [initialForm]);

    function togglePreview() {
        setShowPreview(!showPreview);
    }
    
    function openAddFieldModal() {
        const newEmptyField = {
            label: '',
            field_key: '',
            field_type: 'text',
            required: false,
            order: formState.fields.length,
            placeholder: '',
            options: [],
            width: 'full',
            validation_rules: null
        };
        
        setEditingField(newEmptyField);
        setIsAddingField(true);
    }
    
    function cancelAddField() {
        setEditingField(null);
        setIsAddingField(false);
    }

    function removeField(index) {
        updateFormState(prev => ({
            ...prev,
            fields: prev.fields.filter((_, i) => i !== index)
        }));
    }

    function startEditField(field, index) {
        // Create a copy of the field to edit
        const fieldToEdit = { ...field };
        
        setEditingField(fieldToEdit);
        setEditingFieldIndex(index);
        setIsAddingField(false);
    }

    function cancelEditField() {
        setEditingField(null);
        setEditingFieldIndex(null);
        setIsAddingField(false);
    }
    
    function handleAddField(fieldData) {
        const newField = {
            ...fieldData,
            order: formState.fields.length,
            id: `new_${Date.now()}`
        };
        
        updateFormState(prev => ({
            ...prev,
            fields: [
                ...prev.fields,
                newField
            ]
        }));
        
        setEditingField(null);
        setIsAddingField(false);
    }
    
    function handleEditFieldSave(updatedField) {
        if (!updatedField) return;
        
        if (isAddingField) {
            handleAddField(updatedField);
            
        } else if (editingFieldIndex !== null) {
            updateFormState(prev => {
                const updatedFields = [...prev.fields];
                updatedFields[editingFieldIndex] = updatedField;
                return {
                    ...prev,
                    fields: updatedFields
                };
            });
        }
    
        setEditingField(null);
        setEditingFieldIndex(null);
        setIsAddingField(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        if (!formState.name.trim()) {
            alert('Form name is required');
            return;
        }

        if (!formState.fields.length) {
            alert('Form must have at least one field');
            return;
        }

        const invalidFields = formState.fields.filter(
            field => !field.label.trim() || !field.field_key.trim()
        );

        if (invalidFields.length) {
            alert('All fields must have a label and key');
            return;
        }

        onSave(formState);
    }
    
    function handleCancelClick(e) {
        e.preventDefault();
        
        if (!initialForm && hasFormContent(formState)) {
            setShowConfirmCancelDialog(true);
            return;
        }
        
        if (initialForm && hasFormChanges(formState, initialForm)) {
            setShowConfirmCancelDialog(true);
            return;
        }
        
        onCancel();
    }
    
    function confirmCancel() {
        setShowConfirmCancelDialog(false);
        onCancel();
    }
    
    function cancelDialog() {
        setShowConfirmCancelDialog(false);
    }

    function handleToggleNotifyAdmin() {
        updateFormState(prev => ({
            ...prev,
            notify_admin: !prev.notify_admin
        }));
    }

    return html`
        <form onSubmit=${handleSubmit} class="space-y-6">
            <!-- Form Settings Card -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 class="text-lg font-medium text-gray-900">Form Settings</h2>
                </div>

                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Form Name Field -->
                        <div class="md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Form Name
                                <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter form name"
                                value=${formState.name}
                                onInput=${(e) => updateFormState(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                            />
                            <p class="mt-1 text-sm text-gray-500">This will be displayed as the form title to users</p>
                            
                            <!-- Email Notification Toggle -->
                            <div class="mt-4 flex items-center justify-between">
                                <div>
                                    <h3 class="text-sm font-medium text-gray-700">Email Notifications</h3>
                                    <p class="text-sm text-gray-500 mt-1">
                                        Send form submissions to admin
                                    </p>
                                </div>
                                <${Switch}
                                    checked=${formState.notify_admin}
                                    onChange=${handleToggleNotifyAdmin}
                                />
                            </div>
                            <!-- Redirect Page Toggle -->
                            <div class="mt-6">
                            <h3 class="text-sm font-medium text-gray-700">Form Submission Redirect</h3>
                            <div class="mt-2 flex items-center justify-between">
                                <div>
                                <p class="text-sm text-gray-500">
                                    Redirect users after successful submission
                                </p>
                                </div>
                                <${Switch}
                                checked=${formState.enable_redirect}
                                onChange=${() => updateFormState(prev => ({
                                    ...prev,
                                    enable_redirect: !prev.enable_redirect
                                }))}
                                />
                            </div>
                            
                            ${formState.enable_redirect && html`
                                <div class="mt-3">
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Redirect URL
                                </label>
                                <input
                                    type="text"
                                    class="w-full p-2 border rounded"
                                    placeholder="/contact_thank_you/"
                                    value=${formState.redirect_url || '/contact_thank_you/'}
                                    onInput=${(e) => updateFormState(prev => ({
                                        ...prev,
                                        redirect_url: e.target.value
                                    }))}
                                />
                                <p class="mt-1 text-xs text-gray-500">
                                    Enter a URL path to redirect users after submission
                                </p>
                                </div>
                            `}
                            </div>
                        </div>

                        <!-- Description Field -->
                        <div class="md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter a description for this form (optional)"
                                rows="3"
                                value=${formState.description}
                                onInput=${(e) => updateFormState(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                            ></textarea>
                            <p class="mt-1 text-sm text-gray-500">Provide additional context about the form's purpose</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Fields Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Form Fields</h3>
                    <button
                        type="button"
                        onClick=${openAddFieldModal}
                        class="flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add New Field
                    </button>
                </div>
                
                <div class="p-6">
                    ${formState.fields.length > 1 ? html`
                        <div class="mb-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-md flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            Drag and drop fields to reorder them
                        </div>
                    ` : null}
                
                    <div class="space-y-3" ref=${sortableContainerRef}>
                        ${formState.fields.map((field, index) => html`
                            <${FieldListItemDraggable}
                                key=${field.id || index}
                                field=${field}
                                index=${index}
                                onEdit=${startEditField}
                                onDelete=${removeField}
                            />
                        `)}
                    </div>
                    
                    ${formState.fields.length === 0 && html`
                        <div class="p-12 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto text-gray-400 mb-3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <p class="text-gray-500 mb-2">No fields added yet</p>
                            <button
                                type="button"
                                onClick=${openAddFieldModal}
                                class="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Your First Field
                            </button>
                        </div>
                    `}
                </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick=${togglePreview}
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Preview Form
                    </div>
                </button>
                <button
                    type="button"
                    onClick=${handleCancelClick}
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    Save Form
                </button>
            </div>
            
            <${FieldEditModal} 
                field=${editingField}
                onSave=${handleEditFieldSave}
                onCancel=${cancelEditField}
                isNewField=${isAddingField}
            />
            
            <${ConfirmDialog}
                isOpen=${showConfirmCancelDialog}
                title="Discard Changes"
                message="Are you sure you want to cancel? Any unsaved changes will be lost."
                onConfirm=${confirmCancel}
                onCancel=${cancelDialog}
                confirmText="Discard Changes"
                cancelText="Continue Editing"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
            
            ${showPreview && html`
                <${FormPreview}
                    form=${formState}
                    isOpen=${showPreview}
                    onClose=${togglePreview}
                />
            `}
        </form>
    `;
}