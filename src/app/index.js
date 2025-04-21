import "/cp/resources/js/preact@10.5.13.devtools.module.js";
import { useState, useEffect } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { useGlobalState } from "/cp/resources/js/preactlibs.js";
import { render } from "/cp/resources/js/preact@10.5.13.module.js";
import { html } from "/cp/resources/js/html.module.js";
import { hasFormContent, hasFormChanges } from "./helpers.js";
import FormEditor from "./components/FormEditor.js";
import FormsList from "./components/FormsList.js";
import FormSubmissions from "./components/FormSubmissions.js";
import EntryDetail from "./components/EntryDetail.js";
import ConfirmDialog from "./components/ConfirmDialog/index.js";

// Tab identifiers
const TABS = {
    FORMS: "forms",
    ENTRIES: "entries"
};

function App() {
    const [activeTab, setActiveTab] = useState(TABS.FORMS);
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentForm, setCurrentForm] = useState(null);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [editedFormState, setEditedFormState] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {},
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirmButtonClass: ''
    });

    function fetchForms() {
        setIsLoading(true);
        rpc(
            "contact_forms",     // app name
            "fetchContactForms", // function name
        ).then(response => { 
            setForms(response);
            setIsLoading(false);
        }).catch(error => {
            console.error('Failed to fetch forms:', error);
            setIsLoading(false);
        });
    }

    function handleSaveForm(formData) {
        setIsLoading(true);
        
        if (formData.id) {
            rpc(
                "contact_forms",
                "updateContactForm",
                formData.id,
                formData.name,
                formData.description,
                formData.notify_admin,
                formData.enable_redirect,
                formData.redirect_url 
            )
            .then(() => saveFormFields(formData))
            .then(() => {
                fetchForms();
                handleCloseEditor();
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to update form:', error);
                setIsLoading(false);
            });
        } else {
            rpc(
                "contact_forms",
                "createContactForm",
                formData.name,
                formData.description,
                formData.notify_admin,
                formData.enable_redirect,
                formData.redirect_url 
            )
            .then(newFormId => {
                const updatedFormData = {
                    ...formData,
                    id: newFormId.toString()
                };

                return saveFormFields(updatedFormData);
            })
            .then(() => {
                fetchForms();
                handleCloseEditor();
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to create form:', error);
                setIsLoading(false);
            });
        }
    }

    function saveFormFields(formData) {
        return rpc(
            "contact_forms",
            "saveFormFields",
            formData.id,
            formData.fields.map(field => ({
                ...field,
                options: field.options || null,
                validation_rules: field.validation_rules || null,
                required: Boolean(field.required),
                order: parseInt(field.order, 10)
            }))
        );
    }

    function handleDeleteForm(id) {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Form',
            message: 'Are you sure you want to delete this form? This action cannot be undone.',
            onConfirm: () => {
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                setIsLoading(true);
                rpc(
                    "contact_forms",
                    "deleteContactForm",
                    id
                ).then(() => {
                    fetchForms(); 
                    setIsLoading(false);
                }).catch(error => {
                    console.error('Failed to delete form:', error);
                    setIsLoading(false);
                });
            },
            onCancel: () => {
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            },
            confirmText: 'Delete',
            cancelText: 'Cancel',
            confirmButtonClass: 'bg-red-600 hover:bg-red-700'
        });
    }

    function handleAddNew() {
        setCurrentForm(null);
        setIsEditing(true);
        // Keep the active tab set to FORMS when adding a new form
        setActiveTab(TABS.FORMS);
    }

    function handleEditForm(form) {
        setCurrentForm(form);
        setIsEditing(true);
        // Keep the active tab set to FORMS when editing a form
        setActiveTab(TABS.FORMS);
    }

    function handleCloseEditor() {
        setIsEditing(false);
        setCurrentForm(null);
    }

    function handleViewEntry(entry) {
        setCurrentEntry(entry);
    }

    function handleBackToEntries() {
        setCurrentEntry(null);
    }
    
    function handleTabChange(tab) {
        if (isEditing && activeTab === TABS.FORMS && tab !== TABS.FORMS) {
            const hasChanges = currentForm && editedFormState ? 
                hasFormChanges(editedFormState, currentForm) : 
                editedFormState ? hasFormContent(editedFormState) : false;
                
            if (hasChanges) {
                setConfirmDialog({
                    isOpen: true,
                    title: 'Unsaved Changes',
                    message: 'You have unsaved changes. Are you sure you want to leave?',
                    onConfirm: () => {
                        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                        handleCloseEditor();
                        setActiveTab(tab);
                    },
                    onCancel: () => {
                        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                    },
                    confirmText: 'Leave',
                    cancelText: 'Stay',
                    confirmButtonClass: 'bg-blue-600 hover:bg-blue-700'
                });
            } else {
                handleCloseEditor();
                setActiveTab(tab);
            }
        } else {
            if (tab === TABS.FORMS && isEditing) {
                setActiveTab(tab);
            } else {
                if (isEditing) {
                    handleCloseEditor();
                }
                setActiveTab(tab);
            }
        }
    }

    useEffect(() => {
        fetchForms();
    }, []);

    if (isLoading) {
        return html`
            <div class="content-wrapper p-6">
                <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                    <p class="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        `;
    }

    const renderTabs = () => html`
        <div class="border-b border-gray-200 mb-6">
            <nav class="flex">
                <button 
                    onClick=${() => handleTabChange(TABS.FORMS)}
                    class=${`px-4 py-3 font-medium 
                        ${activeTab === TABS.FORMS 
                            ? 'border-b-2 border-blue-500 text-blue-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    Forms
                </button>
                <button 
                    onClick=${() => handleTabChange(TABS.ENTRIES)}
                    class=${`px-4 py-3 font-medium 
                        ${activeTab === TABS.ENTRIES 
                            ? 'border-b-2 border-blue-500 text-blue-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    Submissions
                </button>
            </nav>
        </div>
    `;

    return html`
        <div class="content-wrapper">
            ${renderTabs()}
            
            ${activeTab === TABS.FORMS && !isEditing && html`
                <div class="page-header mb-6">
                    <div class="flex justify-between items-center">
                        <button 
                            onClick=${handleAddNew}
                            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Add New Form
                        </button>
                    </div>
                </div>
                
                <${FormsList} 
                    forms=${forms}
                    onEdit=${handleEditForm}
                    onDelete=${handleDeleteForm}
                />
            `}

            ${activeTab === TABS.FORMS && isEditing && html`
                <${FormEditor}
                    onSave=${handleSaveForm}
                    onCancel=${handleCloseEditor}
                    initialForm=${currentForm}
                    onFormChange=${setEditedFormState}
                />
            `}

            ${activeTab === TABS.ENTRIES && !currentEntry && html`
                <${FormSubmissions} 
                    onViewEntry=${handleViewEntry}
                />
            `}
            
            ${activeTab === TABS.ENTRIES && currentEntry && html`
                <${EntryDetail}
                    submissionId=${currentEntry.id}
                    onBack=${handleBackToEntries}
                />
            `}
            
            <${ConfirmDialog}
                isOpen=${confirmDialog.isOpen}
                title=${confirmDialog.title}
                message=${confirmDialog.message}
                onConfirm=${confirmDialog.onConfirm}
                onCancel=${confirmDialog.onCancel}
                confirmText=${confirmDialog.confirmText}
                cancelText=${confirmDialog.cancelText}
                confirmButtonClass=${confirmDialog.confirmButtonClass}
            />
        </div>
    `;
}

render(html`<${App} />`, document.getElementById("app"));