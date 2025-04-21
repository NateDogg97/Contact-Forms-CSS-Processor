import { html } from "/cp/resources/js/html.module.js";

/**
 * Switch component - A stylized switch that replaces standard checkboxes
 * @param {boolean} checked - Current state of the switch
 * @param {function} onChange - Function to call when switch state changes
 * @param {string} label - Label text for the switch (optional)
 * @param {string} labelActive - Text to show when active (optional, defaults to "Active")
 * @param {string} labelInactive - Text to show when inactive (optional, defaults to "Inactive")
 * @param {boolean} showLabel - Whether to show the status label (optional, defaults to true)
 */
export default function Switch({ 
  checked = false, 
  onChange, 
  label = ""
}) {
  return html`
    <div class="switch-container">
      ${label && html`<span class="switch-label">${label}</span>`}
      <label class="switch">
        <input
          type="checkbox"
          checked=${checked}
          onChange=${onChange} 
        />
        <span class="slider"></span>
      </label>
    </div>
  `;
}