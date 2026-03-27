/**
 * Content Card Component
 * 
 * Displays the main content card with flip animation
 * Two states: 'empty' and 'filled'
 */

class ContentCard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.state = 'empty'; // 'empty' or 'filled'
        this.isFlipped = false;
        this.currentPost = null;
        this.currentDate = null; // Track current date for navigation
        this.onFlipClick = null;
        this.onClose = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.render();
    }

    render() {
        const cardHTML = `
            <div class="content-card">
                <!-- Close Button (for detail view) -->
                <button class="card-close-cta" id="cardCloseCTA" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M16.5059 1L1 16.5059M1 1L16.5059 16.5059" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="card-flip-container">
                    <div class="card-flip" id="cardFlip">
                        <!-- Front (Empty State) -->
                        <div class="card-front empty-state" id="emptyState">
                            <div class="empty-content">
                                <img src="Styling/placeholder.png" alt="Placeholder" class="empty-placeholder">
                                <p class="empty-text">nog even geduld...<br>pasta's post in onderweg</p>
                            </div>
                        </div>

                        <!-- Front (Filled State) -->
                        <div class="card-front filled-state" id="filledState" style="display: none;">
                            <img id="cardPhoto" src="" alt="Post foto" class="card-photo">
                            <button class="card-flip-cta" id="cardFlipCTA">
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                  <path d="M22.5468 10.2132H8.71946C6.17392 10.2132 4.11035 12.2768 4.11035 14.8223C4.11035 17.3678 6.17392 19.4314 8.71946 19.4314H13.3286M22.5468 10.2132L18.4498 6.11621M22.5468 10.2132L18.4498 14.3102" stroke="black" stroke-width="1.61559" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Back (Story) -->
                        <div class="card-back story-state" id="storyState">
                            <div class="story-content">
                                <h3 class="story-title" id="cardStoryTitle">Verhaal van vandaag</h3>
                                <p class="story-text" id="cardStoryText">Vandaag heb ik heerlijk bij Tjappie en Maya op de bank gelegen. Vannacht heb ik heerlijk op de bak gepoept en lekker gegeten. Ik heb het hier heel erg naar m'n zin en wil hier nooit meer weg. Ik hoop dat papa zich ondertussen goed vermaakt in het vliegtuig

xx luf joe

pasta</p>
                            </div>
                            <button class="card-flip-cta story-flip-cta" id="storyFlipCTA">
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                  <path d="M4.11044 10.2132H17.9378C20.4833 10.2132 22.5469 12.2768 22.5469 14.8223C22.5469 17.3678 20.4833 19.4314 17.9378 19.4314H13.3287M4.11044 10.2132L8.20743 6.11621M4.11044 10.2132L8.20743 14.3102" stroke="black" stroke-width="1.61559" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = cardHTML;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const flipBtn = document.getElementById('cardFlipCTA');
        const storyFlipBtn = document.getElementById('storyFlipCTA');
        const closeBtn = document.getElementById('cardCloseCTA');
        const container = this.container;
        
        if (flipBtn) {
            flipBtn.addEventListener('click', () => this.toggleFlip());
        }
        
        if (storyFlipBtn) {
            storyFlipBtn.addEventListener('click', () => this.toggleFlip());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (this.onClose) {
                    this.onClose();
                }
            });
        }
        
        // Touch events for swipe navigation
        if (container) {
            container.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });
            
            container.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        }
    }

    handleSwipe() {
        const threshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        // Only handle swipes if in detail mode (onSwipeNext/onSwipePrev are set)
        if (!this.onSwipeNext && !this.onSwipePrev) return;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left - next day
                this.playSwipeAnimation('left');
                if (this.onSwipeNext) {
                    this.onSwipeNext();
                }
            } else {
                // Swiped right - previous day
                this.playSwipeAnimation('right');
                if (this.onSwipePrev) {
                    this.onSwipePrev();
                }
            }
        }
    }

    playSwipeAnimation(direction) {
        const card = this.container.querySelector('.content-card');
        if (!card) return;
        
        card.classList.add(`swipe-${direction}`);
        setTimeout(() => {
            card.classList.remove(`swipe-${direction}`);
        }, 300);
    }

    setState(state) {
        this.state = state;
        const emptyState = document.getElementById('emptyState');
        const filledState = document.getElementById('filledState');
        const flipBtn = document.getElementById('cardFlipCTA');
        
        if (state === 'empty') {
            emptyState.style.display = 'flex';
            filledState.style.display = 'none';
            if (flipBtn) {
                flipBtn.style.display = 'none';
            }
        } else if (state === 'filled') {
            emptyState.style.display = 'none';
            filledState.style.display = 'flex';
        }
        
        this.resetFlip();
    }

    setContent(post, date = null) {
        if (!post) {
            this.setState('empty');
            this.currentPost = null;
            this.currentDate = date;
            return;
        }
        
        this.currentPost = post;
        this.currentDate = date;
        const photoImg = document.getElementById('cardPhoto');
        const storyTitle = document.getElementById('cardStoryTitle');
        const storyText = document.getElementById('cardStoryText');
        const flipBtn = document.getElementById('cardFlipCTA');
        
        photoImg.src = post.photo;
        
        // Set title if it exists, otherwise use default
        if (storyTitle) {
            storyTitle.textContent = post.title || 'Verhaal van vandaag';
        }
        
        storyText.textContent = post.story;
        
        // Only show flip CTA if both photo and story exist
        if (post.photo && post.story) {
            if (flipBtn) {
                flipBtn.style.display = 'flex';
            }
        } else {
            if (flipBtn) {
                flipBtn.style.display = 'none';
            }
        }
        
        this.setState('filled');
    }

    // Set close button visibility and callbacks for detail view
    setDetailMode(isDetailMode, onClose = null, onSwipeNext = null, onSwipePrev = null) {
        const closeBtn = document.getElementById('cardCloseCTA');
        if (closeBtn) {
            closeBtn.style.display = isDetailMode ? 'flex' : 'none';
        }
        this.onClose = onClose;
        this.onSwipeNext = onSwipeNext;
        this.onSwipePrev = onSwipePrev;
    }

    toggleFlip() {
        const cardFlip = document.getElementById('cardFlip');
        this.isFlipped = !this.isFlipped;
        cardFlip.classList.toggle('flipped');
    }

    resetFlip() {
        const cardFlip = document.getElementById('cardFlip');
        this.isFlipped = false;
        cardFlip.classList.remove('flipped');
    }

    getState() {
        return this.state;
    }

    getContent() {
        return this.currentPost;
    }
}

export default ContentCard;
