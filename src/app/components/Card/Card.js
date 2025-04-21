import { html } from "/cp/resources/js/html.module.js";

export default function Card({ 
    children, 
    className = '', 
    onClick,
    title,
    subtitle,
    actions 
}) {
    return html`
        <div class="card ${className}" onClick=${onClick}>
            ${title && html`<div class="card-title">${title}</div>`}
            ${subtitle && html`<div class="card-subtitle">${subtitle}</div>`}
            <div class="card-content">
                ${children}
            </div>
            ${actions && html`<div class="card-actions">${actions}</div>`}
        </div>
    `;
}