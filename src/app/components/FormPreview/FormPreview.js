import { html } from "/cp/resources/js/html.module.js";
import { useState } from "/cp/resources/js/preact@10.5.13.hooks.module.js";

/**
 * A component that provides a real-time preview of how a form will appear to users
 * 
 * @param {Object} form - The form data to preview
 * @param {boolean} isOpen - Whether the preview modal is open
 * @param {Function} onClose - Callback when preview is closed
 */
export default function FormPreview({ form, isOpen, onClose }) {
  const [demoData, setDemoData] = useState({});
  
  if (!isOpen || !form) return null;
  
  const renderField = (field) => {
    const fieldId = `preview_${field.field_key}`;
    const isRequired = field.required;
    const widthClass = getWidthClass(field.width);
    
    const handleChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setDemoData(prev => ({
        ...prev,
        [field.field_key]: value
      }));
    };

    switch (field.field_type) {
      case 'text':
        return html`
          <div class=${`form-field ${widthClass}`}>
            <label for=${fieldId}>
              ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
            </label>
            <input 
              type="text" 
              id=${fieldId} 
              name=${field.field_key} 
              placeholder=${field.placeholder || ''} 
              value=${demoData[field.field_key] || ''}
              onChange=${handleChange}
              required=${isRequired}
            />
          </div>
        `;

      case 'email':
        return html`
          <div class=${`form-field ${widthClass}`}>
            <label for=${fieldId}>
              ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
            </label>
            <input 
              type="email" 
              id=${fieldId} 
              name=${field.field_key} 
              placeholder=${field.placeholder || ''} 
              value=${demoData[field.field_key] || ''}
              onChange=${handleChange}
              required=${isRequired}
            />
          </div>
        `;

      case 'textarea':
        return html`
          <div class=${`form-field ${widthClass}`}>
            <label for=${fieldId}>
              ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
            </label>
            <textarea 
              id=${fieldId} 
              name=${field.field_key} 
              placeholder=${field.placeholder || ''} 
              value=${demoData[field.field_key] || ''}
              onChange=${handleChange}
              required=${isRequired}
            ></textarea>
          </div>
        `;

      case 'select':
        const options = Array.isArray(field.options) 
          ? field.options 
          : typeof field.options === 'string'
            ? field.options.split(',').map(opt => opt.trim())
            : [];
            
        return html`
          <div class=${`form-field ${widthClass}`}>
            <label for=${fieldId}>
              ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
            </label>
            <select 
              id=${fieldId} 
              name=${field.field_key} 
              value=${demoData[field.field_key] || ''}
              onChange=${handleChange}
              required=${isRequired}
            >
              <option value="">Please select</option>
              ${options.map(option => html`
                <option value=${option}>${option}</option>
              `)}
            </select>
          </div>
        `;

      case 'checkbox':
        if (!field.options || getOptionsArray(field.options).length === 0) {
          // Single checkbox
          return html`
            <div class=${`form-field checkbox-field ${widthClass}`}>
              <input 
                type="checkbox" 
                id=${fieldId} 
                name=${field.field_key} 
                checked=${demoData[field.field_key] || false}
                onChange=${handleChange}
                required=${isRequired}
              />
              <label for=${fieldId}>
                ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
              </label>
            </div>
          `;
        } else {
          // Checkbox group
          const checkboxOptions = getOptionsArray(field.options);
          
          return html`
            <div class=${`form-field checkbox-group ${widthClass}`}>
              <label class="group-label">
                ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
              </label>
              ${checkboxOptions.map((option, i) => html`
                <div class="checkbox-option" key=${i}>
                  <input 
                    type="checkbox" 
                    id=${`${fieldId}_${i}`} 
                    name=${`${field.field_key}[]`} 
                    value=${option}
                    checked=${demoData[`${field.field_key}_${i}`] || false}
                    onChange=${(e) => setDemoData(prev => ({
                      ...prev,
                      [`${field.field_key}_${i}`]: e.target.checked
                    }))}
                    required=${isRequired && i === 0 ? true : false}
                  />
                  <label for=${`${fieldId}_${i}`}>${option}</label>
                </div>
              `)}
            </div>
          `;
        }

      case 'radio':
        const radioOptions = getOptionsArray(field.options);
        
        return html`
          <div class=${`form-field radio-group ${widthClass}`}>
            <label class="group-label">
              ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
            </label>
            ${radioOptions.map((option, i) => html`
              <div class="radio-option" key=${i}>
                <input 
                  type="radio" 
                  id=${`${fieldId}_${i}`} 
                  name=${field.field_key} 
                  value=${option}
                  checked=${demoData[field.field_key] === option}
                  onChange=${handleChange}
                  required=${isRequired}
                />
                <label for=${`${fieldId}_${i}`}>${option}</label>
              </div>
            `)}
          </div>
        `;

      case 'date':
        return html`
          <div class=${`form-field ${widthClass}`}>
            <label for=${fieldId}>
              ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
            </label>
            <input 
              type="date" 
              id=${fieldId} 
              name=${field.field_key} 
              value=${demoData[field.field_key] || ''}
              onChange=${handleChange}
              required=${isRequired}
            />
          </div>
        `;

      case 'number':
        return html`
          <div class=${`form-field ${widthClass}`}>
            <label for=${fieldId}>
              ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
            </label>
            <input 
              type="number" 
              id=${fieldId} 
              name=${field.field_key} 
              placeholder=${field.placeholder || ''} 
              value=${demoData[field.field_key] || ''}
              onChange=${handleChange}
              required=${isRequired}
              min=${field.min || ''}
              max=${field.max || ''}
              step=${field.step || ''}
            />
          </div>
        `;

      default:
        return html`
          <div class=${`form-field ${widthClass}`}>
            <label for=${fieldId}>
              ${field.label} ${isRequired ? html`<span class="required">*</span>` : ''}
            </label>
            <input 
              type="text" 
              id=${fieldId} 
              name=${field.field_key} 
              placeholder=${field.placeholder || ''} 
              value=${demoData[field.field_key] || ''}
              onChange=${handleChange}
              required=${isRequired}
            />
          </div>
        `;
    }
  };

  function getWidthClass(width) {
    switch (width) {
      case 'half': return 'col-span-6';
      case 'third': return 'col-span-4';
      case 'quarter': return 'col-span-3';
      default: return 'col-span-12';
    }
  }
  
  function getOptionsArray(options) {
    if (!options) return [];
    
    if (Array.isArray(options)) {
      return options;
    }
    
    if (typeof options === 'string') {
      return options.split(',').map(opt => opt.trim()).filter(Boolean);
    }
    
    return [];
  }

  return html`
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-xl container max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-medium">Form Preview: ${form.name}</h2>
          <button 
            type="button"
            onClick=${onClose}
            class="text-gray-500 hover:text-gray-700"
            aria-label="Close preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <!-- We use contact-form class to apply the CSS styles -->
          <form id="dynamic_form_preview" class="dynamic-form" onSubmit=${e => e.preventDefault()}>
            <h2>${form.name}</h2>
            ${form.description && html`<p class="form-description">${form.description}</p>`}
            
            <!-- Grid for fields -->
            <div class="grid grid-cols-12 gap-4">
              ${form.fields.map(field => renderField(field))}
            </div>
            
            <div class="form-actions">
              <button type="submit" class="submit-button">
                Submit
              </button>
            </div>
            
            <div class="text-sm text-gray-500 mt-2">
              This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
              <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
            </div>
          </form>
        </div>
        
        <div class="border-t p-4 bg-gray-50">
          <p class="text-sm text-gray-500">
            This is a preview of how your form will appear. Form submissions are disabled in preview mode.
          </p>
        </div>
      </div>
    </div>
  `;
}