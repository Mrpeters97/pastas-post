/**
 * Date Display Component
 * 
 * Shows the current date based on user's timezone
 * Displays in format: "Dag, DD Maand YYYY"
 */

class DateDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
    }

    render() {
        const dateHTML = `
            <div class="date-display">
                <p class="date-text" id="dateText"></p>
            </div>
        `;
        
        this.container.innerHTML = dateHTML;
        this.updateDate();
    }

    updateDate(date = null) {
        const dateText = document.getElementById('dateText');
        const displayDate = date || new Date();
        
        const options = { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        const formatter = new Intl.DateTimeFormat('nl-NL', options);
        const formattedDate = formatter.format(displayDate);
        
        // Capitalize first letter
        const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        
        dateText.textContent = capitalizedDate;
    }

    setDate(date) {
        this.updateDate(date);
    }
}

export default DateDisplay;
