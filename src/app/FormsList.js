import { html } from "/cp/resources/js/html.module.js";
import { useState } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import Card from "./components/Card/index.js";
import FormPreview from "./components/FormPreview/index.js";

export default function FormsList({ forms, onEdit, onDelete }) {
    const [previewForm, setPreviewForm] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    if (!forms.length) {
        return html`<div>No forms available</div>`;
    }

    const handlePreview = (form) => {
        setPreviewForm(form);
        setIsPreviewOpen(true);
    };
    
    const closePreview = () => {
        setIsPreviewOpen(false);
    };

    return html`
        <div>
            <div class="forms-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${forms.map(form => html`
                    <${Card}
                        key=${form.id}
                        className="card-outlined bg-white p-4"
                    >
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-semibold">${form.name}</h3>
                                <p class="text-sm text-gray-600">${form.created_at}</p>
                            </div>
                            <div class="flex gap-2">
                                <button 
                                    onClick=${() => handlePreview(form)}
                                    class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                    title="Preview form"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178-.07-.207-.07-.431 0-.639C3.423 7.51 7.36 4.5 12 4.5z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick=${() => onEdit(form)}
                                    class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick=${() => onDelete(form.id)}
                                    class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <p class="text-gray-700">${form.description}</p>
                            <div class="border-t pt-3">
                                <p class="text-sm font-medium text-gray-600">Fields: ${form.fields?.length || 0}</p>
                                <div class="mt-2 flex flex-wrap gap-2">
                                    ${form.fields?.map(field => html`
                                        <span 
                                            key=${field.id}
                                            class="px-2 py-1 text-xs bg-gray-100 rounded-full"
                                        >
                                            ${field.label}
                                            ${field.required ? ' *' : ''}
                                        </span>
                                    `)}
                                </div>
                            </div>
                        </div>
                    <//>
                `)}
            </div>
            
            ${isPreviewOpen && html`
                <${FormPreview}
                    form=${previewForm}
                    isOpen=${isPreviewOpen}
                    onClose=${closePreview}
                />
            `}
        </div>
    `;
}