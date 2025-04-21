import { useState, useEffect } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";
import DateRangePicker from "../DateRangePicker/index.js";

/**
 * Simplified EntriesFilter component with automatic filter application
 * 
 * @param {Object} filters - Current active filters
 * @param {Function} onFilterChange - Callback when filters should be applied
 * @param {Array} formsList - List of available forms for filtering
 */
export default function EntriesFilters({ filters, onFilterChange, formsList }) {
    // Keep track of active filters for visual feedback
    const [activeFilters, setActiveFilters] = useState([]);
    
    // Update active filters display whenever filters change
    useEffect(() => {
        const newActiveFilters = [];
        
        if (filters.status !== 'all') {
            newActiveFilters.push({
                type: 'status',
                label: filters.status,
                value: filters.status
            });
        }
        
        if (filters.formId !== 'all') {
            const formName = formsList.find(f => f.id === filters.formId)?.name || 'Unknown form';
            newActiveFilters.push({
                type: 'form',
                label: formName,
                value: filters.formId
            });
        }
        
        if (filters.startDate) {
            const dateLabel = filters.endDate 
                ? `${new Date(filters.startDate).toLocaleDateString()} to ${new Date(filters.endDate).toLocaleDateString()}`
                : new Date(filters.startDate).toLocaleDateString();
            
            newActiveFilters.push({
                type: 'date',
                label: dateLabel,
                value: { startDate: filters.startDate, endDate: filters.endDate }
            });
        }
        
        setActiveFilters(newActiveFilters);
    }, [filters, formsList]);
    
    // Handle changes to select filters (status and form)
    function handleFilterChange(filterType, value) {
        const updatedFilters = { ...filters };
        
        switch(filterType) {
            case 'status':
                updatedFilters.status = value;
                break;
            case 'form':
                updatedFilters.formId = value;
                break;
            default:
                return;
        }
        
        onFilterChange(updatedFilters);
    }
    
    // Handle date range changes
    function handleDateRangeChange(dateRange) {
        const updatedFilters = {
            ...filters,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        };
        
        if (
            (!dateRange.startDate && !dateRange.endDate) || 
            (dateRange.startDate && dateRange.endDate)
        ) {
            onFilterChange(updatedFilters);
        }
    }
    
    // Reset all filters to default
    function resetFilters() {
        const defaultFilters = {
            status: 'all',
            formId: 'all',
            startDate: '',
            endDate: ''
        };
        
        onFilterChange(defaultFilters);
    }
    
    // Remove a specific filter
    function removeFilter(filterType) {
        const updatedFilters = { ...filters };
        
        switch(filterType) {
            case 'status':
                updatedFilters.status = 'all';
                break;
            case 'form':
                updatedFilters.formId = 'all';
                break;
            case 'date':
                updatedFilters.startDate = '';
                updatedFilters.endDate = '';
                break;
            default:
                return;
        }
        
        onFilterChange(updatedFilters);
    }
    
    const hasActiveFilters = activeFilters.length > 0;
    
    return html`
        <div class="bg-gray-50 p-4 rounded border mb-4">
            <div class="flex justify-between items-center mb-3">
                ${hasActiveFilters && html`
                    <button 
                        onClick=${resetFilters}
                        class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reset All
                    </button>
                `}
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        value=${filters.status}
                        onChange=${e => handleFilterChange('status', e.target.value)}
                        class="w-full border rounded p-2 h-[40px]"
                    >
                        <option value="all">All Active</option>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Form</label>
                    <select 
                        value=${filters.formId}
                        onChange=${e => handleFilterChange('form', e.target.value)}
                        class="w-full border rounded p-2 h-[40px]"
                    >
                        <option value="all">All Forms</option>
                        ${formsList.map(form => html`
                            <option key=${form.id} value=${form.id}>${form.name}</option>
                        `)}
                    </select>
                </div>
                
                <div class="md:col-span-1">
                    <${DateRangePicker}
                        value=${{
                            startDate: filters.startDate,
                            endDate: filters.endDate
                        }}
                        onChange=${handleDateRangeChange}
                    />
                </div>
            </div>
            
            ${hasActiveFilters && html`
                <div class="mt-4 pt-3 border-t border-gray-200">
                    <div class="flex flex-wrap gap-2">
                        ${activeFilters.map(filter => html`
                            <span 
                                key=${filter.type} 
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                ${filter.label}
                                <button 
                                    onClick=${() => removeFilter(filter.type)}
                                    class="ml-1.5 text-blue-600 hover:text-blue-800"
                                    aria-label=${`Remove ${filter.type} filter`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </span>
                        `)}
                    </div>
                </div>
            `}
        </div>
    `;
}