import { useState, useEffect, useRef } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";
import { 
  formatDisplayDate, 
  formatDateForISO, 
  formatDateForComparison, 
  isSameDay 
} from './dateUtils.js';

/**
 * Improved DateRangePicker with better state management and explicit value control
 * Fixed timezone-related date selection issues
 * 
 * @param {Object} value - Current date range value object with startDate and endDate
 * @param {Function} onChange - Called when date range is changed (for temporary state)
 * @param {Function} onApply - Called when user explicitly applies a date range selection
 */
export default function DateRangePicker({ 
  value = { startDate: '', endDate: '' }, 
  onChange,
  onApply,
  disabled = false
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [localDateRange, setLocalDateRange] = useState({
    startDate: value.startDate ? new Date(value.startDate) : null,
    endDate: value.endDate ? new Date(value.endDate) : null
  });
  const [selectionMode, setSelectionMode] = useState('start');
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Handle clicks outside the calendar and input
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        calendarRef.current && 
        !calendarRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync component state with incoming props
  useEffect(() => {
    const newStartDate = value.startDate ? new Date(value.startDate) : null;
    const newEndDate = value.endDate ? new Date(value.endDate) : null;
    
    const datesChanged = 
      formatDateForComparison(newStartDate) !== formatDateForComparison(localDateRange.startDate) || 
      formatDateForComparison(newEndDate) !== formatDateForComparison(localDateRange.endDate);
    
    if (datesChanged) {
      setLocalDateRange({ startDate: newStartDate, endDate: newEndDate });
      setHasChanges(false);
    }
  }, [value.startDate, value.endDate]);
  
  function getDisplayText() {
    if (localDateRange.startDate && localDateRange.endDate) {
      return `${formatDisplayDate(localDateRange.startDate)} to ${formatDisplayDate(localDateRange.endDate)}`;
    } else if (localDateRange.startDate) {
      return `${formatDisplayDate(localDateRange.startDate)} → Select end date`;
    } else {
      return 'Select date range';
    }
  }
  
  function handleDateSelect(date) {
    if (selectionMode === 'start' || (!localDateRange.startDate && !localDateRange.endDate)) {
      const newRange = {
        startDate: date,
        endDate: null
      };
      setLocalDateRange(newRange);
      setSelectionMode('end');
      setHasChanges(true);
      
      if (onChange) {
        onChange({
          startDate: formatDateForISO(date),
          endDate: ''
        });
      }
    } else {
      if (date >= localDateRange.startDate) {
        const newRange = {
          startDate: localDateRange.startDate,
          endDate: date
        };
        setLocalDateRange(newRange);
        setSelectionMode('start');
        setIsCalendarOpen(false);
        setHasChanges(true);
        
        if (onChange) {
          onChange({
            startDate: formatDateForISO(newRange.startDate),
            endDate: formatDateForISO(newRange.endDate)
          });
        }
      } else {
        const newRange = {
          startDate: date,
          endDate: null
        };
        setLocalDateRange(newRange);
        setSelectionMode('end');
        setHasChanges(true);
        
        if (onChange) {
          onChange({
            startDate: formatDateForISO(date),
            endDate: ''
          });
        }
      }
    }
  }
  
  function applyDateRange() {
    if (onApply) {
      onApply({
        startDate: formatDateForISO(localDateRange.startDate),
        endDate: formatDateForISO(localDateRange.endDate)
      });
    }
    setHasChanges(false);
    setIsCalendarOpen(false);
  }
  
  function handleDateHover(date) {
    setHoveredDate(date);
  }
  
  function toggleCalendar() {
    if (disabled) return;
    
    setIsCalendarOpen(!isCalendarOpen);
    
    if (!isCalendarOpen) {
      setSelectionMode(localDateRange.startDate && !localDateRange.endDate ? 'end' : 'start');
      
      if (localDateRange.startDate) {
        setCurrentMonth(new Date(localDateRange.startDate));
      } else {
        setCurrentMonth(new Date());
      }
    }
  }
  
  function clearDates() {
    const emptyRange = { startDate: null, endDate: null };
    setLocalDateRange(emptyRange);
    setSelectionMode('start');
    setHasChanges(true);
    
    if (onChange) {
      onChange({ startDate: '', endDate: '' });
    }
  }
  
  function prevMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }
  
  function nextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }
  
  function isStartDate(date) {
    return localDateRange.startDate && isSameDay(date, localDateRange.startDate);
  }
  
  function isEndDate(date) {
    return localDateRange.endDate && isSameDay(date, localDateRange.endDate);
  }
  
  function isInRange(date) {
    if (!localDateRange.startDate) return false;
    
    if (localDateRange.endDate) {
      return date > localDateRange.startDate && date < localDateRange.endDate;
    } else if (hoveredDate && selectionMode === 'end') {
      return (
        date > localDateRange.startDate && 
        date < hoveredDate && 
        hoveredDate > localDateRange.startDate
      );
    }
    
    return false;
  }
  
  function renderMonth(monthOffset = 0) {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const monthName = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); 
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), i));
    }
    
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    return html`
      <div class="calendar-month">
        <div class="calendar-month-header">${monthName}</div>
        <div class="calendar-days-header">
          ${dayNames.map(day => html`
            <div class="calendar-day-name">${day}</div>
          `)}
        </div>
        <div class="calendar-days-grid">
          ${days.map(day => day === null 
            ? html`<div class="calendar-day empty"></div>`
            : html`
                <button
                  type="button"
                  class=${`calendar-day 
                    ${isStartDate(day) ? 'start-date' : ''} 
                    ${isEndDate(day) ? 'end-date' : ''} 
                    ${isInRange(day) ? 'in-range' : ''} 
                    ${isStartDate(day) && isEndDate(day) ? 'single-date' : ''}
                  `}
                  onClick=${() => handleDateSelect(day)}
                  onMouseEnter=${() => handleDateHover(day)}
                >
                  ${day.getDate()}
                </button>
              `
          )}
        </div>
      </div>
    `;
  }
  
  return html`
    <div class="date-range-picker">
      <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
      
      <div class="relative">
        <div 
          ref=${inputRef}
          class=${`date-range-input flex items-center justify-between w-full border rounded p-2 cursor-pointer bg-white ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick=${toggleCalendar}
        >
          <div class=${`date-display ${!localDateRange.startDate ? 'text-gray-500' : ''}`}>
            ${getDisplayText()}
          </div>
          <div class="flex items-center">
            ${(localDateRange.startDate || localDateRange.endDate) && !disabled && html`
              <button 
                type="button"
                onClick=${(e) => {
                  e.stopPropagation();
                  clearDates();
                }}
                class="mr-2 text-gray-400 hover:text-gray-700"
                title="Clear dates"
              >
                ×
              </button>
            `}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
          </div>
        </div>
        
        ${isCalendarOpen && html`
          <div 
            ref=${calendarRef}
            class="calendar-popup absolute end-[0px] mt-1 bg-white border rounded shadow-lg z-10"
          >
            <div class="calendar-header flex justify-between items-center p-2 border-b">
              <button 
                type="button"
                onClick=${prevMonth}
                class="text-gray-600 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div class="text-sm font-medium">
                ${selectionMode === 'start' ? 'Select start date' : 'Select end date'}
              </div>
              <button 
                type="button"
                onClick=${nextMonth}
                class="text-gray-600 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            <div class="calendar-months-container flex">
              ${renderMonth(0)}
              ${renderMonth(1)}
            </div>
            <div class="calendar-footer border-t p-3 flex justify-end">
              <button 
                type="button"
                onClick=${applyDateRange}
                disabled=${!localDateRange.startDate}
                class="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}