import { useState, useEffect } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";
import EntriesList from "./EntriesList.js";
import EntriesFilter from "./components/EntriesFilter/index.js";
import ConfirmDialog from "./components/ConfirmDialog/index.js";

export default function FormSubmissions({ onViewEntry }) {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        formId: 'all',
        startDate: '',
        endDate: ''
    });
    const [formsList, setFormsList] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0
    });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: null,
        actionData: null
    });
    const [isFiltering, setIsFiltering] = useState(false);
    const [actionableCounts, setActionableCounts] = useState({ toRead: 0, toArchive: 0 });

    useEffect(() => {
        fetchForms();
        fetchEntries();
    }, []);

    useEffect(() => {
        fetchEntries();
        setSelectedEntries([]);
    }, [filters.status, filters.formId, filters.startDate, filters.endDate, pagination.page]);

    useEffect(() => {
        setActionableCounts(getActionableCounts(selectedEntries, entries));
    }, [selectedEntries, entries]);

    function fetchForms() {
        rpc(
            "contact_forms",
            "fetchContactForms"
        ).then(response => {
            setFormsList(response || []);
        }).catch(err => {
            console.error("Error fetching forms list:", err);
        });
    }

    function fetchEntries(options = {}) {
        setIsLoading(true);
        setIsFiltering(true);
        
        if (options.resetFilters) {
            const defaultFilters = {
                status: 'all',
                formId: 'all',
                startDate: '',
                endDate: ''
            };
            setFilters(defaultFilters);
            
            setPagination(prev => ({
                ...prev,
                page: 1
            }));
            
            rpc(
                "contact_forms",
                "fetchFormSubmissions",
                {
                    status: null,
                    formId: null,
                    startDate: null,
                    endDate: null,
                    page: 1,
                    limit: pagination.limit
                }
            ).then(handleFetchResponse)
            .catch(handleFetchError);
            
            return;
        }
        
        rpc(
            "contact_forms",
            "fetchFormSubmissions",
            {
                status: filters.status !== 'all' ? filters.status : null,
                formId: filters.formId !== 'all' ? filters.formId : null,
                startDate: filters.startDate || null,
                endDate: filters.endDate || null,
                page: pagination.page,
                limit: pagination.limit
            }
        ).then(handleFetchResponse)
        .catch(handleFetchError);
    }
    
    function handleFetchResponse(response) {
        if (response && typeof response === 'object') {
            const entriesData = response.data || [];
            setEntries(entriesData);
            
            // Just store the total from the API response
            // We'll calculate the actual pagination in the render function
            // based on the filtered entries
            setPagination(prev => ({
                ...prev,
                total: response.total || 0
            }));
        } else {
            setEntries([]);
        }
        setIsLoading(false);
        setIsFiltering(false);
    }
    
    function handleFetchError(err) {
        console.error("Error fetching form submissions:", err);
        setError("Failed to load form submissions");
        setIsLoading(false);
        setIsFiltering(false);
    }

    function handleFilterChange(newFilters) {
        setPagination(prev => ({
            ...prev,
            page: 1
        }));
        setFilters(newFilters);
    }
    
    function handlePageChange(newPage) {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    }

    function handleSelectEntry(id) {
        setSelectedEntries(prev => {
            if (prev.includes(id)) {
                return prev.filter(entryId => entryId !== id);
            } else {
                return [...prev, id];
            }
        });
    }
    
    function handleSelectAll(filteredEntries) {
        if (selectedEntries.length === filteredEntries.length) {
            setSelectedEntries([]);
        } else {
            setSelectedEntries(filteredEntries.map(entry => entry.id));
        }
    }
    
    function handleBatchAction(action) {
        if (selectedEntries.length === 0) {
            alert('Please select at least one submission.');
            return;
        }
        
        const actionText = action === 'archive' ? 'archive' : 'mark as read';
        
        setConfirmDialog({
            isOpen: true,
            title: `Confirm ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
            message: `Are you sure you want to ${actionText} ${selectedEntries.length} selected submission(s)?`,
            action: action,
            actionData: selectedEntries
        });
    }

    function getActionableCounts(selectedIds, entries) {
        const counts = {
          toRead: 0,
          toArchive: 0
        };
        
        const selectedEntries = entries.filter(entry => selectedIds.includes(entry.id));
        
        counts.toRead = selectedEntries.filter(entry => entry.status === 'new').length;
        
        counts.toArchive = selectedEntries.filter(entry => 
          entry.status === 'new' || entry.status === 'read'
        ).length;
        
        return counts;
    }
    
    function executeBatchAction(action, submissionIds) {
        setActionInProgress(true);
        
        rpc(
            "contact_forms",
            "batchUpdateSubmissionStatus",
            submissionIds,
            action === 'archive' ? 'archived' : 'read'
        ).then(() => {
            setEntries(prev => 
                prev.map(entry => 
                    submissionIds.includes(entry.id)
                        ? { ...entry, status: action === 'archive' ? 'archived' : 'read' }
                        : entry
                )
            );
            setSelectedEntries([]);
            setActionInProgress(false);
            alert(`Selected submissions have been ${action === 'archive' ? 'archived' : 'marked as read'}.`);
        }).catch(err => {
            console.error(`Error performing batch ${action}:`, err);
            alert(`Failed to ${action === 'archive' ? 'archive' : 'mark as read'} submissions: ` + err.message);
            setActionInProgress(false);
        });
    }
    
    function handleConfirmDialogAction() {
        executeBatchAction(confirmDialog.action, confirmDialog.actionData);
        closeConfirmDialog();
    }
    
    function closeConfirmDialog() {
        setConfirmDialog(prev => ({
            ...prev,
            isOpen: false
        }));
    }
    
    // Filter entries client-side based on status
    const filteredEntries = entries.filter(entry => {
        if (filters.status === 'archived') {
            return entry.status === 'archived';
        }
        else if (filters.status !== 'all') {
            return entry.status === filters.status;
        }
        else {
            // When 'all' is selected, show everything EXCEPT archived
            return entry.status !== 'archived';
        }
    });

    const totalItems = filters.status === 'all' ? 
          entries.filter(entry => entry.status !== 'archived').length : 
          pagination.total;

    const totalPages = Math.ceil(totalItems / pagination.limit);

    return html`
        <div class="mb-4">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                    <h2 class="text-xl my-0 font-medium">Form Submissions</h2>
                    ${(() => {
                        const unreadCount = entries.filter(entry => entry.status === 'new').length;
                        if (unreadCount > 0) {
                            return html`
                                <div class="ml-3 px-2.5 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full flex items-center">
                                    <span class="inline-block w-2 h-2 bg-blue-600 rounded-full mr-1.5 animate-pulse"></span>
                                    ${unreadCount} new ${unreadCount === 1 ? 'message' : 'messages'}
                                </div>
                            `;
                        }
                        return null;
                    })()}
                </div>
                ${pagination.total > 0 && html`
                    <div class="text-sm text-gray-500">
                        Total: ${filteredEntries.length} submission${pagination.total !== 1 ? 's' : ''}
                    </div>
                `}
            </div>
            
            <${EntriesFilter}
                filters=${filters}
                onFilterChange=${handleFilterChange}
                formsList=${formsList}
            />
            
            <div class="flex justify-between items-center mt-4 mb-2">
                <div class="text-sm text-gray-500">
                    ${isFiltering 
                        ? 'Filtering submissions...' 
                        : filteredEntries.length === 0 
                            ? 'No submissions found' 
                            : `Showing ${filteredEntries.length} submission${filteredEntries.length !== 1 ? 's' : ''}`}
                </div>
                
                <div class="flex space-x-2">
                    <button 
                        onClick=${() => handleBatchAction('read')}
                        disabled=${actionInProgress || selectedEntries.length === 0 || actionableCounts.toRead === 0}
                        class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:opacity-50 transition-all"
                        title=${selectedEntries.length === 0 ? 
                        "Select submissions to mark as read" : 
                        actionableCounts.toRead === 0 ? 
                            "No selected submissions can be marked as read" : 
                            `Mark ${actionableCounts.toRead} selected submissions as read`}
                    >
                        <div class="flex items-center">
                        ${actionableCounts.toRead > 0 ? html`
                            <span class="bg-white text-blue-600 text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center mr-1">
                            ${actionableCounts.toRead}
                            </span>
                        ` : ''}
                        Mark as Read
                        </div>
                    </button>
                    
                    <button 
                        onClick=${() => handleBatchAction('archive')}
                        disabled=${actionInProgress || selectedEntries.length === 0 || actionableCounts.toArchive === 0}
                        class="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:opacity-50 transition-all"
                        title=${selectedEntries.length === 0 ? 
                        "Select submissions to archive" : 
                        actionableCounts.toArchive === 0 ? 
                            "No selected submissions can be archived" : 
                            `Archive ${actionableCounts.toArchive} selected submissions`}
                    >
                        <div class="flex items-center">
                            ${actionableCounts.toArchive > 0 ? html`
                                <span class="bg-white text-orange-600 text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center mr-1">
                                ${actionableCounts.toArchive}
                                </span>
                            ` : ''}
                            Archive
                        </div>
                    </button>
                </div>
            </div>
            
            <${EntriesList}
                entries=${filteredEntries}
                selectedEntries=${selectedEntries}
                isLoading=${isLoading}
                error=${error}
                onViewEntry=${onViewEntry}
                onSelectEntry=${handleSelectEntry}
                onSelectAll=${(entries) => handleSelectAll(entries)}
                pagination=${{
                    currentPage: pagination.page,
                    totalPages: totalPages,
                    onPageChange: handlePageChange,
                    totalItems: totalItems
                }}
                filters=${filters}
                onRetry=${fetchEntries}
            />
            
            <${ConfirmDialog}
                isOpen=${confirmDialog.isOpen}
                title=${confirmDialog.title}
                message=${confirmDialog.message}
                onConfirm=${handleConfirmDialogAction}
                onCancel=${closeConfirmDialog}
                confirmText=${confirmDialog.action === 'archive' ? 'Archive' : 'Mark as Read'}
                confirmButtonClass=${confirmDialog.action === 'archive' 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-blue-600 hover:bg-blue-700'}
            />
        </div>
    `;
}