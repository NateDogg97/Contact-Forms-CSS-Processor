import { useState, useEffect } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";
import ConfirmDialog from "./components/ConfirmDialog/index.js";

export default function EntryDetail({ submissionId, onBack }) {
    const [entry, setEntry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [archiveInProgress, setArchiveInProgress] = useState(false);
    const [showConfirmArchive, setShowConfirmArchive] = useState(false);

    useEffect(() => {
        if (submissionId) {
            fetchEntryDetails();
        }
    }, [submissionId]);

    function fetchEntryDetails() {
        setIsLoading(true);
        rpc(
            "contact_forms",
            "getSubmissionDetails",
            submissionId
        ).then(response => {
            setEntry(response);
            setIsLoading(false);
        }).catch(err => {
            console.error("Error fetching submission details:", err);
            setError("Failed to load submission details");
            setIsLoading(false);
        });
    }

    function handleArchive(id) {
        setShowConfirmArchive(true);
    }
    
    function confirmArchive() {
        setArchiveInProgress(true);
        rpc(
            "contact_forms",
            "archiveSubmission",
            entry.id
        ).then(response => {
            if (response) {
                // Update the local state to show the new status
                setEntry(prev => ({
                    ...prev,
                    status: 'archived'
                }));
                alert('Submission has been archived.');
            }
            setArchiveInProgress(false);
            setShowConfirmArchive(false);
        }).catch(err => {
            console.error("Error archiving submission:", err);
            alert('Failed to archive submission: ' + err.message);
            setArchiveInProgress(false);
            setShowConfirmArchive(false);
        });
    }
    
    function cancelArchive() {
        setShowConfirmArchive(false);
    }

    if (isLoading) {
        return html`
            <div class="flex justify-center p-6">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            </div>
        `;
    }

    if (error) {
        return html`
            <div class="p-6 text-red-600 text-center">
                ${error}
                <button 
                    onClick=${fetchEntryDetails} 
                    class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        `;
    }

    if (!entry) {
        return html`
            <div class="p-6 text-center text-gray-500">
                No submission details found.
                <button 
                    onClick=${onBack} 
                    class="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Back to List
                </button>
            </div>
        `;
    }

    // Parse submission data
    const submissionData = entry.submission_data ? JSON.parse(entry.submission_data) : {};

    return html`
        <div class="p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-medium">Submission Details</h2>
                <div class="flex space-x-2">
                    ${entry.status !== 'archived' && html`
                        <button 
                            onClick=${() => handleArchive(entry.id)}
                            disabled=${archiveInProgress}
                            class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
                        >
                            Archive
                        </button>
                    `}
                    <button 
                        onClick=${onBack} 
                        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Back to List
                    </button>
                </div>
            </div>
            
            <div class="bg-white border rounded-lg shadow-sm p-6 mb-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-medium">${entry.form_name}</h3>
                        <p class="text-sm text-gray-500">${formatDate(entry.created_at)}</p>
                    </div>
                    <span class=${`px-2 py-1 text-xs rounded ${entry.status === 'new' ? 'bg-blue-100 text-blue-800' : entry.status === 'archived' ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                        ${entry.status === 'new' ? 'New' : entry.status === 'archived' ? 'Archived' : 'Read'}
                    </span>
                </div>

                
                ${entry.form_description && html`
                    <div class="mb-4 text-sm text-gray-600 italic">
                        Form Description: ${entry.form_description}
                    </div>
                `}
                
                <div class="mt-4 border-t pt-4">
                    <div class="text-sm text-gray-500 mb-2">IP Address: ${entry.ip_address}</div>
                    <h4 class="font-medium mb-2">Submission Data:</h4>
                    <div class="grid gap-4">
                        ${Object.entries(submissionData).map(([key, value]) => html`
                            <div key=${key} class="border-b pb-2">
                                <div class="font-medium">${formatFieldName(key)}</div>
                                <div class="text-gray-700 whitespace-pre-wrap">${value}</div>
                            </div>
                        `)}
                    </div>
                </div>
            </div>

            <${ConfirmDialog}
                isOpen=${showConfirmArchive}
                title="Confirm Archive"
                message="Are you sure you want to archive this submission? Archived submissions will be hidden from the active submissions list."
                onConfirm=${confirmArchive}
                onCancel=${cancelArchive}
                confirmText="Archive"
                confirmButtonClass="bg-orange-600 hover:bg-orange-700"
            />
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function formatFieldName(key) {
    // Convert field_name or field-name to Field Name
    return key
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}