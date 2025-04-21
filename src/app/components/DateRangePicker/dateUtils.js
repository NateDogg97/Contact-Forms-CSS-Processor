/**
 * Format a date to a user-friendly string (e.g., "Jan 1, 2023")
 * @param {Date|null} date - The date to format
 * @returns {string} Formatted date string or empty string if no date
 */
export function formatDisplayDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Format a date to ISO format string (YYYY-MM-DD)
 * @param {Date|null} date - The date to format
 * @returns {string} ISO formatted date string or empty string if no date
 */
export function formatDateForISO(date) {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Format a date to ISO date string without time components for comparison
 * @param {Date|null} date - The date to format
 * @returns {string|null} ISO date string or null if no date
 */
export function formatDateForComparison(date) {
  return date ? date.toISOString().split('T')[0] : null;
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date to compare
 * @param {Date} date2 - Second date to compare
 * @returns {boolean} True if dates represent the same day
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}