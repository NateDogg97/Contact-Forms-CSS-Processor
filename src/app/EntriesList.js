import { html } from "/cp/resources/js/html.module.js";
import EntryListItem from "./components/EntryListItem/index.js";
import Pagination from "./components/Pagination/index.js";

export default function EntriesList({ 
    entries, 
    selectedEntries, 
    isLoading, 
    error,
    onViewEntry, 
    onSelectEntry, 
    onSelectAll,
    pagination,
    filters,
    onRetry
}) {
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
                    onClick=${onRetry} 
                    class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        `;
    }

    return html`
        <div>
            ${entries.length > 0 ? html`
                <div>
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 px-4 py-3 bg-gray-100 rounded shadow-sm hover:bg-gray-50 transition-colors">
                        <div class="flex items-center mb-3 md:mb-0">
                            <label class="flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked=${selectedEntries.length === entries.length && entries.length > 0}
                                    onChange=${() => onSelectAll(entries)}
                                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-colors"
                                />
                                <span class="font-medium ml-3">Select All</span>
                            </label>
                            <span class="ml-4 text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                                ${selectedEntries.length} of ${entries.length} selected
                            </span>
                        </div>
                        
                        ${pagination.totalPages > 1 ? html`
                            <div class="flex items-center self-end md:self-auto">
                                <${Pagination}
                                    currentPage=${pagination.currentPage}
                                    totalPages=${pagination.totalPages}
                                    onPageChange=${pagination.onPageChange}
                                    totalItems=${pagination.totalItems}
                                />
                            </div>
                        ` : null}
                    </div>
                    <div class="space-y-2">
                        ${entries.map(entry => html`
                            <div class="flex items-center" key=${entry.id}>
                                <label class="flex items-center mr-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked=${selectedEntries.includes(entry.id)}
                                        onChange=${() => onSelectEntry(entry.id)}
                                        class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-colors"
                                    />
                                    <span class="sr-only">Select entry</span>
                                </label>
                                <div class="flex-1">
                                    <${EntryListItem} 
                                        entry=${entry}
                                        onClick=${onViewEntry}
                                    />
                                </div>
                            </div>
                        `)}
                    </div>
                </div>
            ` : html`
                <div class="p-6 text-center">
                    <p class="text-gray-500 mb-4">
                        No ${filters.status !== 'all' ? filters.status : 'active'} submissions found.
                    </p>
                    ${Object.values(filters).some(value => value !== 'all' && value !== '') && html`
                        <button 
                            onClick=${() => onRetry && typeof onRetry === 'function' ? onRetry({ resetFilters: true }) : null}
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors inline-flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear Filters
                        </button>
                    `}
                </div>
            `}
            
            ${entries.length > 0 && pagination.totalPages > 1 && html`
                <div class="mt-6 flex justify-center">
                    <${Pagination}
                        currentPage=${pagination.currentPage}
                        totalPages=${pagination.totalPages}
                        onPageChange=${pagination.onPageChange}
                        displayStyle="centered"
                        totalItems=${pagination.totalItems}
                    />
                </div>
            `}
        </div>
    `;
}