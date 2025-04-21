import { useState } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";
import ConfirmDialog from "../ConfirmDialog/index.js";

/**
 * FieldListItem component displays a single form field in the form editor
 * 
 * @param {Object} field - The field data to display
 * @param {Number} index - The index of the field in the form
 * @param {Number} totalFields - Total number of fields in the form
 * @param {Function} onEdit - Callback when Edit button is clicked
 * @param {Function} onMoveUp - Callback when Move Up button is clicked
 * @param {Function} onMoveDown - Callback when Move Down button is clicked
 * @param {Function} onDelete - Callback when Delete button is clicked
 */
export default function FieldListItem({ 
  field, 
  index, 
  totalFields, 
  onEdit, 
  onMoveUp, 
  onMoveDown, 
  onDelete 
}) {
  // State for managing the confirmation dialog
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Helper function to format options display
  const formatOptions = (options) => {
    if (Array.isArray(options)) {
      return options.join(', ');
    } else if (typeof options === 'string') {
      return options;
    }
    return '';
  };

  // Check if field has options
  const hasOptions = field.field_type === 'select' || 
                     field.field_type === 'radio' || 
                     field.field_type === 'checkbox';
  
  const showOptions = hasOptions && field.options && 
                      (Array.isArray(field.options) ? field.options.length > 0 : field.options !== '');
  
  // Handle delete button click
  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };
  
  // Handle confirm delete action
  const confirmDelete = () => {
    setShowConfirmDelete(false);
    onDelete(index);
  };
  
  // Handle cancel delete action
  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return html`
    <div class="grid grid-cols-5 items-center space-x-4 p-4 border rounded bg-white hover:bg-gray-50 transition-colors">
      <div class="grid col-span-4 grid-cols-4 gap-4">
        <div>
          <span class="font-medium">Label:</span> ${field.label}
        </div>
        <div>
          <span class="font-medium">Type:</span> ${field.field_type}
        </div>
        <div>
          <span class="font-medium">Width:</span> 
          ${field.width === 'full' ? 'Full Width' : 
            field.width === 'half' ? 'Half Width' : 
            field.width === 'third' ? 'Third Width' : 
            field.width === 'quarter' ? 'Quarter Width' : 'Full Width'}
        </div>
        <div>
          ${field.required 
            ? html`<span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Required</span>` 
            : html`<span class="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">Optional</span>`}
        </div>
        
        ${showOptions && html`
          <div class="col-span-4 text-sm text-gray-600 mt-1">
            <span class="font-medium">Options:</span> 
            ${formatOptions(field.options)}
          </div>
        `}
        
        ${field.placeholder && html`
          <div class="col-span-4 text-sm text-gray-600">
            <span class="font-medium">Placeholder:</span> ${field.placeholder}
          </div>
        `}
      </div>
      
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          onClick=${() => onEdit(field, index)}
          class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
          title="Edit field"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
        
        ${index > 0 && html`
          <button
            type="button"
            onClick=${() => onMoveUp(index)}
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Move up"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        `}
        
        ${index < totalFields - 1 && html`
          <button
            type="button"
            onClick=${() => onMoveDown(index)}
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Move down"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        `}
        
        <button
          type="button"
          onClick=${handleDeleteClick}
          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
          title="Delete field"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
      
      <${ConfirmDialog}
        isOpen=${showConfirmDelete}
        title="Delete Field"
        message=${`Are you sure you want to delete the field "${field.label}"?`}
        onConfirm=${confirmDelete}
        onCancel=${cancelDelete}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  `;
}