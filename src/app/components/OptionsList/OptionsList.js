import { useState, useEffect } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";

/**
 * OptionsList component for managing options in select, radio, and checkbox fields
 * 
 * @param {Array|String} options - Current options (array or comma-separated string)
 * @param {Function} onChange - Called when options are changed
 */
export default function OptionsList({ options = [], onChange }) {
  // Convert options to array if it's a string
  const [optionsList, setOptionsList] = useState([]);
  
  // Initialize options list from props
  useEffect(() => {
    // Handle various formats of incoming options
    if (Array.isArray(options)) {
      setOptionsList(options.map(option => option.trim()).filter(Boolean));
    } else if (typeof options === 'string' && options.trim()) {
      setOptionsList(options.split(',').map(option => option.trim()).filter(Boolean));
    } else {
      setOptionsList([]);
    }
  }, []);

  // Validate if we should show an empty field error for a specific index
  const [validationErrors, setValidationErrors] = useState({});
  
  // Handle adding a new option
  const addOption = () => {
    const newOptionsList = [...optionsList, ''];
    setOptionsList(newOptionsList);
    
    // Reset validation for the new field
    setValidationErrors({});
    
    // Trigger change event with the updated list
    onChange(newOptionsList);
  };
  
  // Handle changing an option
  const updateOption = (index, value) => {
    const newOptionsList = [...optionsList];
    newOptionsList[index] = value;
    setOptionsList(newOptionsList);
    
    // Validate the field
    const newValidationErrors = { ...validationErrors };
    if (!value.trim()) {
      newValidationErrors[index] = 'This field cannot be empty';
    } else {
      delete newValidationErrors[index];
    }
    setValidationErrors(newValidationErrors);
    
    // Trigger change event with the updated list
    if (Object.keys(newValidationErrors).length === 0) {
      onChange(newOptionsList.filter(Boolean));
    }
  };
  
  // Handle removing an option
  const removeOption = (index) => {
    const newOptionsList = [...optionsList];
    newOptionsList.splice(index, 1);
    setOptionsList(newOptionsList);
    
    // Clean up validation errors
    const newValidationErrors = { ...validationErrors };
    delete newValidationErrors[index];
    
    // Reindex validation errors for remaining options
    const reindexedErrors = {};
    Object.keys(newValidationErrors).forEach(key => {
      const keyInt = parseInt(key, 10);
      if (keyInt > index) {
        reindexedErrors[keyInt - 1] = newValidationErrors[key];
      } else {
        reindexedErrors[key] = newValidationErrors[key];
      }
    });
    
    setValidationErrors(reindexedErrors);
    
    // Trigger change event with the updated list
    onChange(newOptionsList.filter(Boolean));
  };
  
  return html`
    <div class="options-list space-y-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Options</label>
      
      ${optionsList.length === 0 ? html`
        <p class="text-sm text-gray-500 italic">No options added yet. Click "Add Option" to begin.</p>
      ` : null}
      
      <div class="space-y-2">
        ${optionsList.map((option, index) => html`
          <div key=${index} class="flex items-center space-x-2">
            <div class="flex-grow relative">
              <input
                type="text"
                value=${option}
                placeholder="Option value"
                onInput=${(e) => updateOption(index, e.target.value)}
                class=${`w-full p-2 border rounded ${validationErrors[index] ? 'border-red-500' : ''}`}
              />
              ${validationErrors[index] && html`
                <p class="absolute text-xs text-red-500 mt-1">${validationErrors[index]}</p>
              `}
            </div>
            <button
              type="button"
              onClick=${() => removeOption(index)}
              class="p-2 text-red-600 hover:text-red-800"
              title="Remove option"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        `)}
      </div>
      
      <button
        type="button"
        onClick=${addOption}
        class="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Add Option</span>
      </button>
    </div>
  `;
}