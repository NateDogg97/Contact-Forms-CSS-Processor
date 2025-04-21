import { html } from "/cp/resources/js/html.module.js";

/**
 * Confirmation Dialog component
 * 
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message/content
 * @param {function} onConfirm - Function to call when confirmed
 * @param {function} onCancel - Function to call when canceled
 * @param {string} confirmText - Text for confirm button (optional)
 * @param {string} cancelText - Text for cancel button (optional)
 * @param {string} confirmButtonClass - CSS class for confirm button (optional)
 */
export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-blue-600 hover:bg-blue-700"
}) {
  if (!isOpen) return null;
  
  return html`
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-component="Confirm Dialog">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-medium mb-2">${title}</h3>
        
        <div class="my-4">
          <p class="text-gray-700">${message}</p>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick=${onCancel}
            class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 whitespace-nowrap"
          >
            ${cancelText}
          </button>
          <button
            type="button"
            onClick=${onConfirm}
            class="px-4 py-2 ${confirmButtonClass} text-white rounded whitespace-nowrap"
          >
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;
}