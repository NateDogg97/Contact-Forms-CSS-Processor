import { html } from "/cp/resources/js/html.module.js";

export default function EntryListItem({ entry, onClick }) {
    function getStatusStyles(status) {
        switch(status) {
            case 'new':
                return 'bg-blue-50 border-blue-200';
            case 'archived':
                return 'bg-gray-100 border-gray-300 text-gray-600';
            default: // 'read'
                return 'bg-white';
        }
    }
    
    function getStatusBadge(status) {
        switch(status) {
            case 'new':
                return html`<span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>`;
            case 'read':
                return html`<span class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Read</span>`;
            case 'archived':
                return html`<span class="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">Archived</span>`;
            default:
                return null;
        }
    }

    return html`
        <div 
            class="p-4 border rounded cursor-pointer hover:bg-gray-50 transition-colors ${getStatusStyles(entry.status)} ${entry.status === 'new' ? 'font-semibold' : ''}"
            onClick=${() => onClick(entry)}
        >
            <div class="flex justify-between items-center">
                <div class="text-lg">${entry.form_name}</div>
                <div class="flex items-center space-x-2">
                    ${getStatusBadge(entry.status)}
                    <div class="text-sm text-gray-500">${formatDate(entry.created_at)}</div>
                </div>
            </div>
            <div class="text-sm text-gray-600 mt-1 truncate">
                ${getSubmissionSummary(entry)}
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function getSubmissionSummary(entry) {
    // Try to extract a name and email from the submission data
    const data = entry.submission_data ? JSON.parse(entry.submission_data) : {};
    const keys = Object.keys(data);
    
    // Look for name field
    const nameField = keys.find(key => 
        /name|full[-_]?name|first[-_]?name/i.test(key)
    );
    
    // Look for email field
    const emailField = keys.find(key => 
        /email/i.test(key)
    );
    
    let summary = '';
    
    if (nameField) {
        summary += data[nameField];
    }
    
    if (emailField) {
        if (summary) summary += ' - ';
        summary += data[emailField];
    }
    
    // If we couldn't find a name or email, just show the first field
    if (!summary && keys.length > 0) {
        const firstKey = keys[0];
        summary = `${firstKey}: ${data[firstKey]}`;
    }
    
    return summary || 'No details available';
}