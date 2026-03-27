/**
 * Navigation Component
 * 
 * A reusable navigation component for the Pastas Post webapp
 * Handles page switching between Home and Postkamer
 */

class Navigation {
    constructor(containerId, onPageChange) {
        this.container = document.getElementById(containerId);
        this.onPageChange = onPageChange;
        this.currentPage = 'home';
        
        this.render();
        this.attachEventListeners();
    }

    render() {
        const navHTML = `
            <nav class="nav-wrapper">
                <div class="nav-item">
                    <button class="nav-button nav-button--home active" data-page="home">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M2.5 10.9384C2.5 9.71422 3.06058 8.55744 4.02142 7.79888L9.52142 3.45677C10.9747 2.30948 13.0253 2.30948 14.4786 3.45677L19.9786 7.79888C20.9394 8.55744 21.5 9.71422 21.5 10.9384V17.5C21.5 19.7091 19.7091 21.5 17.5 21.5H16C15.4477 21.5 15 21.0523 15 20.5V17.5C15 16.3954 14.1046 15.5 13 15.5H11C9.89543 15.5 9 16.3954 9 17.5V20.5C9 21.0523 8.55228 21.5 8 21.5H6.5C4.29086 21.5 2.5 19.7091 2.5 17.5L2.5 10.9384Z" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                        <span class="nav-label">home</span>
                    </button>
                </div>
                <div class="nav-item">
                    <button class="nav-button nav-button--postkamer" data-page="postkamer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="4" width="20" height="16" rx="5" stroke="currentColor" stroke-width="1.5"/>
                          <path d="M6 10L10.8 13.6C11.5111 14.1333 12.4889 14.1333 13.2 13.6L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="nav-label">postbus</span>
                    </button>
                </div>
            </nav>
        `;
        
        this.container.innerHTML = navHTML;
    }

    attachEventListeners() {
        const buttons = this.container.querySelectorAll('.nav-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.setActivePage(page);
            });
        });
    }

    setActivePage(page) {
        if (page === this.currentPage) return;
        
        this.currentPage = page;
        
        // Update button states
        const buttons = this.container.querySelectorAll('.nav-button');
        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.page === page) {
                button.classList.add('active');
            }
        });
        
        // Notify parent component
        if (this.onPageChange) {
            this.onPageChange(page);
        }
    }

    getActivePage() {
        return this.currentPage;
    }
}

export default Navigation;
