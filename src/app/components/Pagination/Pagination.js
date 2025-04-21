import { html } from "/cp/resources/js/html.module.js";

/**
 * Pagination component for navigating through pages
 * Only renders pagination controls when there are multiple pages.
 * 
 * @param {number} currentPage - The current active page
 * @param {number} totalPages - Total number of pages available
 * @param {function} onPageChange - Callback function when page is changed
 * @param {number} displayedPages - Number of page buttons to display (default: 5)
 * @param {string} displayStyle - Display style: "compact" or "centered" (default: "compact")
 * @param {number} totalItems - Optional total number of items
 */
export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange,
    displayedPages = 5,
    displayStyle = "compact", // compact or centered
    totalItems = null
}) {
    function getPageNumbers() {
        const pageNumbers = [];
        const maxPagesToShow = Math.min(displayedPages, totalPages);
        
        if (totalPages <= displayedPages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else if (currentPage <= Math.ceil(displayedPages / 2)) {
            for (let i = 1; i <= maxPagesToShow; i++) {
                pageNumbers.push(i);
            }
        } else if (currentPage >= totalPages - Math.floor(displayedPages / 2)) {
            for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const offset = Math.floor(displayedPages / 2);
            for (let i = currentPage - offset; i <= currentPage + offset; i++) {
                if (pageNumbers.length < maxPagesToShow) {
                    pageNumbers.push(i);
                }
            }
        }
        
        return pageNumbers;
    }
    
    // Don't render pagination controls if there's only one page or no pages
    if (totalPages <= 1) {
        return null;
    }
    
    const pageNumbers = getPageNumbers();
    const itemsPerPage = 20; // Default items per page
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const calculatedTotalItems = totalItems || totalPages * itemsPerPage; // Use provided total or estimate
    const endItem = Math.min(currentPage * itemsPerPage, calculatedTotalItems);
    
    // Different layouts based on display style
    if (displayStyle === "compact") {
        return html`
            <div class="flex items-center">
                <div class="text-sm text-gray-500 mr-3 hidden md:block">
                    ${startItem}-${endItem}
                </div>
                <div class="flex items-center space-x-1">
                    <button
                        onClick=${() => onPageChange(1)}
                        disabled=${currentPage === 1}
                        class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        aria-label="First page"
                        title="First page"
                    >
                        «
                    </button>
                    
                    <button
                        onClick=${() => onPageChange(currentPage - 1)}
                        disabled=${currentPage === 1}
                        class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        aria-label="Previous page"
                        title="Previous page"
                    >
                        ‹
                    </button>
                    
                    ${pageNumbers.map(pageNum => html`
                        <button
                            key=${pageNum}
                            onClick=${() => onPageChange(pageNum)}
                            class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === pageNum 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'hover:bg-gray-100'}`}
                            aria-label=${`Page ${pageNum}`}
                            aria-current=${currentPage === pageNum ? 'page' : 'false'}
                        >
                            ${pageNum}
                        </button>
                    `)}
                    
                    <button
                        onClick=${() => onPageChange(currentPage + 1)}
                        disabled=${currentPage === totalPages}
                        class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        aria-label="Next page"
                        title="Next page"
                    >
                        ›
                    </button>
                    
                    <button
                        onClick=${() => onPageChange(totalPages)}
                        disabled=${currentPage === totalPages}
                        class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        aria-label="Last page"
                        title="Last page"
                    >
                        »
                    </button>
                </div>
            </div>
        `;
    } else {
        return html`
            <div class="flex flex-col items-center">
                <div class="text-sm text-gray-500 mb-3">
                    Showing entries ${startItem}-${endItem} of ${calculatedTotalItems}
                </div>

                <div class="flex items-center space-x-1">
                    <button
                        onClick=${() => onPageChange(1)}
                        disabled=${currentPage === 1}
                        class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        aria-label="First page"
                        title="First page"
                    >
                        «
                    </button>
                    
                    <button
                        onClick=${() => onPageChange(currentPage - 1)}
                        disabled=${currentPage === 1}
                        class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        aria-label="Previous page"
                        title="Previous page"
                    >
                        ‹
                    </button>
                    
                    ${pageNumbers.map(pageNum => html`
                        <button
                            key=${pageNum}
                            onClick=${() => onPageChange(pageNum)}
                            class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === pageNum 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'hover:bg-gray-100'}`}
                            aria-label=${`Page ${pageNum}`}
                            aria-current=${currentPage === pageNum ? 'page' : 'false'}
                        >
                            ${pageNum}
                        </button>
                    `)}
                    
                    <button
                        onClick=${() => onPageChange(currentPage + 1)}
                        disabled=${currentPage === totalPages}
                        class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        aria-label="Next page"
                        title="Next page"
                    >
                        ›
                    </button>
                    
                    <button
                        onClick=${() => onPageChange(totalPages)}
                        disabled=${currentPage === totalPages}
                        class=${`w-7 h-7 flex items-center justify-center text-sm border rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        aria-label="Last page"
                        title="Last page"
                    >
                        »
                    </button>
                </div>
            </div>
        `;
    }
}