// ========== IMPORTS ==========
import Navigation from './components/Navigation.js';
import ContentCard from './components/ContentCard.js';
import DateDisplay from './components/DateDisplay.js';

// ========== STATE MANAGEMENT ==========
const state = {
    currentPage: 'home',
    currentPostkamerPage: 1,
    touchStartX: 0,
    touchEndX: 0,
    detailViewDate: null, // Track date in detail view mode
};

// ========== LOCAL STORAGE KEYS ==========
const STORAGE_KEYS = {
    POSTS: 'pastas_posts',
    LAST_UPLOAD_DATE: 'pastas_last_upload_date',
};

// ========== DOM ELEMENTS ==========
let navigationComponent = null;
let contentCardComponent = null;
let dateDisplayComponent = null;

const domElements = {
    app: document.getElementById('app'),
    navbarContainer: document.getElementById('navbar'),
    contentCardContainer: document.getElementById('contentCardContainer'),
    dateDisplayContainer: document.getElementById('dateDisplayContainer'),
    pages: document.querySelectorAll('.page'),
    homePage: document.getElementById('home-page'),
    postkamerPage: document.getElementById('postkamer-page'),
    calendarGrid: document.getElementById('calendarGrid'),
    dotPagination: document.getElementById('dotPagination'),
    modal: document.getElementById('modal'),
    modalClose: document.getElementById('modalClose'),
    modalFlipCard: document.getElementById('modalFlipCard'),
    modalPhotoImage: document.getElementById('modalPhotoImage'),
    modalStoryText: document.getElementById('modalStoryText'),
    modalFlipCTA: document.getElementById('modalFlipCTA'),
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Initialize Navigation Component
    navigationComponent = new Navigation('navbar', handlePageChange);
    
    // Initialize Content Card Component
    contentCardComponent = new ContentCard('contentCardContainer');
    
    // Initialize Date Display Component
    dateDisplayComponent = new DateDisplay('dateDisplayContainer');
    
    // Register Service Worker for push notifications
    registerServiceWorker();
    
    // Setup push notifications
    setupPushNotifications();
    
    // Load stored posts from manifest.json
    await loadPostsFromStorage();
    
    // Check if it's a new day and reset if needed
    checkAndResetForNewDay();
    
    // Set up event listeners
    setupCalendarEvents();
    setupPaginationEvents();
    setupModalEvents();
    setupSwipeEvents();
    
    // Load today's post if it exists
    await updateHomePageView();
    
    // Generate calendar for postkamer
    await generateCalendarGrid();
}

async function handlePageChange(page, fromNavbar = true) {
    state.currentPage = page;
    
    // Only close detail view/modal if navigating from navbar
    if (fromNavbar) {
        // Close modal immediately (synchronous - no delay)
        domElements.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Exit detail view mode if we were in one
        if (state.detailViewDate !== null) {
            state.detailViewDate = null;
            contentCardComponent.setDetailMode(false);
            contentCardComponent.setState('empty'); // Reset card to empty state
            
            // Reset date display to today when exiting detail view
            dateDisplayComponent.updateDate();
        }
    }
    
    // Update page visibility
    domElements.pages.forEach(p => {
        p.classList.remove('active');
    });
    
    if (page === 'home') {
        domElements.homePage.classList.add('active');
    } else if (page === 'postkamer') {
        domElements.postkamerPage.classList.add('active');
    }
    
    // Reset content card flip when switching pages
    if (contentCardComponent) {
        contentCardComponent.resetFlip();
    }
    
    if (state.currentPage === 'home') {
        await updateHomePageView();
    } else if (state.currentPage === 'postkamer') {
        // Regenerate calendar when coming back to postkamer
        await generateCalendarGrid();
    }
}

// ========== PUSH NOTIFICATIONS ==========

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js', {
                scope: '/'
            });
            console.log('✅ Service Worker geregistreerd:', registration);
            
            // Force update
            registration.update();
        } catch (error) {
            console.warn('⚠️ Service Worker registratie mislukt:', error);
        }
    } else {
        console.warn('⚠️ Service Worker niet ondersteund');
    }
}

function setupPushNotifications() {
    // Make sendNotification globally available for manual triggering
    window.sendNotification = sendPushNotification;
    
    // Request notification permission
    if ('Notification' in window) {
        console.log('📋 Notification permission status:', Notification.permission);
        
        if (Notification.permission === 'default') {
            Notification.requestPermission()
                .then(permission => {
                    console.log('📋 Permission response:', permission);
                })
                .catch(err => {
                    console.error('⚠️ Permission request failed:', err);
                });
        }
    } else {
        console.warn('⚠️ Notifications niet ondersteund');
    }
}

async function sendPushNotification() {
    try {
        console.log('🔔 Notification permission:', Notification.permission);
        
        // Check if notifications are supported
        if (!('Notification' in window)) {
            throw new Error('Notificaties niet ondersteund op dit apparaat');
        }
        
        // Check permission
        if (Notification.permission === 'denied') {
            throw new Error('Notificaties zijn uitgeschakeld. Schakel ze in in Instellingen.');
        }
        
        // Request permission if needed
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('Notificaties toestemming geweigerd');
            }
        }
        
        // Get Service Worker registration
        let registration = null;
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            registration = await navigator.serviceWorker.ready;
            console.log('✅ Service Worker ready:', registration);
        }
        
        // Show notification
        if (registration) {
            console.log('📤 Sturen via Service Worker...');
            await registration.showNotification('Miaauww!', {
                body: 'Pasta heeft je een bericht gestuurd',
                icon: 'https://pastas-post.vercel.app/Styling/Logo.svg',
                badge: 'https://pastas-post.vercel.app/Styling/Logo.svg',
                tag: 'pasta-notification',
                requireInteraction: false,
                vibrate: [200, 100, 200],
            });
        } else {
            // Fallback to simple Notification API
            console.log('📤 Sturen via Notification API (fallback)...');
            new Notification('Miaauww!', {
                body: 'Pasta heeft je een bericht gestuurd',
                icon: 'https://pastas-post.vercel.app/Styling/Logo.svg',
            });
        }
        
        console.log('✅ Pushmelding verzonden!');
        
    } catch (error) {
        console.error('❌ Fout bij verzenden notificatie:', error);
        console.error('Details:', error.message);
    }
}

// ========== POST STORAGE ==========
// Cache for loaded posts
let postsCache = null;

async function loadPostsFromStorage() {
    // Return cached posts if already loaded
    if (postsCache !== null) {
        return postsCache;
    }
    
    try {
        const response = await fetch('posts/manifest.json');
        const data = await response.json();
        
        // Build posts object from manifest
        postsCache = {};
        const loadPromises = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        
        for (const entry of data.posts) {
            try {
                // Check if post should be visible yet (visibleFrom date control)
                if (entry.visibleFrom) {
                    const visibleFromDate = new Date(entry.visibleFrom);
                    visibleFromDate.setHours(0, 0, 0, 0); // Normalize to start of day
                    
                    // Skip this post if today is before visibleFrom date
                    if (today < visibleFromDate) {
                        console.info(`Post ${entry.date} not yet visible (visibleFrom: ${entry.visibleFrom})`);
                        continue;
                    }
                }
                
                const photoResponse = await fetch(entry.photo);
                const storyResponse = await fetch(entry.story);
                const titleResponse = await fetch(entry.title || `posts/${entry.date}/title.txt`);
                
                if (photoResponse.ok && storyResponse.ok) {
                    const photoBlob = await photoResponse.blob();
                    const storyText = await storyResponse.text();
                    let titleText = ''; // Default empty if title doesn't exist
                    
                    // Try to load title if it exists
                    if (titleResponse.ok) {
                        titleText = await titleResponse.text();
                    }
                    
                    // Convert blob to data URL with Promise wrapper
                    const loadPromise = new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            postsCache[entry.date] = {
                                photo: event.target.result,
                                title: titleText.trim(),
                                story: storyText.trim(),
                                date: entry.date
                            };
                            resolve();
                        };
                        reader.readAsDataURL(photoBlob);
                    });
                    
                    loadPromises.push(loadPromise);
                }
            } catch (error) {
                console.warn(`Could not load post for ${entry.date}:`, error);
            }
        }
        
        // Wait for all photo conversions to complete
        await Promise.all(loadPromises);
        
        return postsCache;
    } catch (error) {
        console.warn('Could not load from manifest.json, falling back to empty:', error);
        postsCache = {};
        return postsCache;
    }
}

function savePostsToStorage(posts) {
    // Note: Saving to storage is not supported with file-based system
    // To add posts: Upload photo and story files, then update posts/manifest.json
    console.log('📝 To add/update posts:');
    console.log('1. Upload photo to posts/YYYY-MM-DD/photo.jpg');
    console.log('2. Update posts/YYYY-MM-DD/story.txt');
    console.log('3. Update posts/manifest.json');
}

function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

async function getTodayPost() {
    const posts = await loadPostsFromStorage();
    return posts[getTodayKey()];
}

function savePost(photo, story) {
    console.log('📝 To save a post via files:');
    console.log('1. Upload photo and story to posts/YYYY-MM-DD/');
    console.log('2. Update posts/manifest.json to register the new post');
}

// ========== DAILY CHECK & RESET ==========
function checkAndResetForNewDay() {
    const lastDateKey = localStorage.getItem(STORAGE_KEYS.LAST_UPLOAD_DATE);
    const today = getTodayKey();
    
    // If it's a new day, store it and ensure fresh state
    if (lastDateKey !== today) {
        localStorage.setItem(STORAGE_KEYS.LAST_UPLOAD_DATE, today);
    }
}

// ========== HOME PAGE VIEW ==========
async function updateHomePageView() {
    const todayPost = await getTodayPost();
    
    if (todayPost) {
        contentCardComponent.setContent(todayPost);
    } else {
        contentCardComponent.setState('empty');
    }
}

// ========== CALENDAR SETUP ==========
function setupCalendarEvents() {
    // Recalculate layout on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(async () => {
            // Reset to page 1 when resizing, as items per page has changed
            state.currentPostkamerPage = 1;
            await generateCalendarGrid();
        }, 250);
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', async () => {
        state.currentPostkamerPage = 1;
        await generateCalendarGrid();
    });
}

// Calculate items that fit on one page based on viewport size
// Always 3 columns, NO overlapping allowed - even 1px = move to next page
function calculateItemsPerPage() {
    const columns = 3;
    const gap = 16; // Must match CSS gap
    
    // Fixed header/nav heights (from CSS)
    const headerHeight = 80;
    const navbarHeight = 60; // Navigation bar
    const contentPaddingTop = 20; // Must match CSS padding
    const contentPaddingBottom = 20; // Must match CSS padding
    const gapBetweenGrid = 20; // Gap between grid and pagination
    
    // Exact available height for grid content
    const totalFixedHeight = headerHeight + navbarHeight + contentPaddingTop + contentPaddingBottom + gapBetweenGrid;
    const fullHeight = window.innerHeight;
    const availableHeight = fullHeight - totalFixedHeight;
    
    // Exact available width for grid
    const contentPaddingLeft = 20; // Must match CSS padding
    const contentPaddingRight = 20; // Must match CSS padding
    const availableWidth = window.innerWidth - contentPaddingLeft - contentPaddingRight;
    
    // Item size (square, so width = height)
    const totalGapWidth = (columns - 1) * gap; // gaps between columns
    const itemSize = (availableWidth - totalGapWidth) / columns;
    
    // Find maximum rows that fit WITHOUT ANY OVERLAP
    // Formula: totalHeight = rows * itemSize + (rows - 1) * gap
    // This must be <= availableHeight (with no room for even 1px overlap)
    let rows = 0;
    let testRows = 1;
    
    while (true) {
        const totalGapHeight = (testRows - 1) * gap;
        const totalHeight = testRows * itemSize + totalGapHeight;
        
        // If this fits with some margin, it's valid
        if (totalHeight <= availableHeight - 5) { // 5px buffer for safety
            rows = testRows;
            testRows++;
        } else {
            break;
        }
    }
    
    rows = Math.max(1, rows);
    return columns * rows;
}

async function generateCalendarGrid() {
    const posts = await loadPostsFromStorage();
    const totalDays = 31;
    const itemsPerPage = calculateItemsPerPage();
    const pageStart = (state.currentPostkamerPage - 1) * itemsPerPage;
    const pageEnd = pageStart + itemsPerPage;
    
    domElements.calendarGrid.innerHTML = '';
    
    // Generate dates from 24 maart to 24 april (31 days)
    let allDates = [];
    const startDate = new Date(2026, 2, 24); // 24 maart 2026
    const endDate = new Date(2026, 3, 24);  // 24 april 2026
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d));
    }
    
    // Get items for current page
    const pageItems = allDates.slice(pageStart, pageEnd);
    
    pageItems.forEach(date => {
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const post = posts[dateKey];
        
        const item = document.createElement('div');
        item.className = 'calendar-item';
        
        if (post) {
            item.classList.add('has-post');
            const img = document.createElement('img');
            img.src = post.photo;
            img.alt = `Post from ${dateKey}`;
            item.appendChild(img);
            
            // Add date overlay on top of photo
            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            
            const dayText = document.createElement('div');
            dayText.className = 'day-text';
            dayText.textContent = date.getDate();
            
            const monthText = document.createElement('div');
            monthText.className = 'month-text';
            monthText.textContent = date.toLocaleDateString('nl-NL', { month: 'long' });
            
            dayLabel.appendChild(dayText);
            dayLabel.appendChild(monthText);
            item.appendChild(dayLabel);
            
            // Add click handler to open in detail view
            item.addEventListener('click', () => {
                openDetailView(date);
            });
        } else {
            item.classList.add('empty-day');
            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            
            const dayText = document.createElement('div');
            dayText.className = 'day-text';
            dayText.textContent = date.getDate();
            
            const monthText = document.createElement('div');
            monthText.className = 'month-text';
            monthText.textContent = date.toLocaleDateString('nl-NL', { month: 'long' });
            
            dayLabel.appendChild(dayText);
            dayLabel.appendChild(monthText);
            item.appendChild(dayLabel);
        }
        
        domElements.calendarGrid.appendChild(item);
    });
    
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalDays = 31;
    const itemsPerPage = calculateItemsPerPage();
    const totalPages = Math.ceil(totalDays / itemsPerPage);
    
    // Clear existing dots
    domElements.dotPagination.innerHTML = '';
    
    // Only show pagination if there's more than one page
    if (totalPages <= 1) {
        domElements.dotPagination.style.display = 'none';
        return;
    }
    
    domElements.dotPagination.style.display = 'flex';
    
    // Create dots for each page
    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i === state.currentPostkamerPage ? 'active' : 'inactive'}`;
        dot.addEventListener('click', async () => {
            state.currentPostkamerPage = i;
            await generateCalendarGrid();
        });
        domElements.dotPagination.appendChild(dot);
    }
}

// ========== PAGINATION ==========
function setupPaginationEvents() {
    // Pagination handled by dot clicks in updatePaginationControls
}

// ========== MODAL ==========
function setupModalEvents() {
    domElements.modalClose.addEventListener('click', () => {
        closeModal();
    });
    
    domElements.modal.addEventListener('click', (e) => {
        if (e.target === domElements.modal) {
            closeModal();
        }
    });
    
    domElements.modalFlipCTA.addEventListener('click', () => {
        domElements.modalFlipCard.classList.toggle('flipped');
    });
}

function openModal(post) {
    domElements.modalPhotoImage.src = post.photo;
    domElements.modalStoryText.textContent = post.story;
    domElements.modalFlipCard.classList.remove('flipped');
    domElements.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    domElements.modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ========== SWIPE HANDLING ==========
function setupSwipeEvents() {
    domElements.postkamerPage.addEventListener('touchstart', (e) => {
        state.touchStartX = e.changedTouches[0].screenX;
    });
    
    domElements.postkamerPage.addEventListener('touchend', (e) => {
        state.touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const threshold = 50;
    const diff = state.touchStartX - state.touchEndX;
    
    if (Math.abs(diff) > threshold) {
        const swipeDirection = diff > 0 ? 1 : -1; // 1 = left (next), -1 = right (prev)
        const totalDays = 31;
        const itemsPerPage = calculateItemsPerPage();
        const totalPages = Math.ceil(totalDays / itemsPerPage);
        
        if (diff > 0) {
            // Swiped left - next page
            if (state.currentPostkamerPage < totalPages) {
                state.currentPostkamerPage++;
                animateCalendarSwipe(swipeDirection);
            }
        } else {
            // Swiped right - previous page
            if (state.currentPostkamerPage > 1) {
                state.currentPostkamerPage--;
                animateCalendarSwipe(swipeDirection);
            }
        }
    }
}

async function animateCalendarSwipe(swipeDirection) {
    const grid = domElements.calendarGrid;
    
    // Position old grid absolutely so new one can appear behind it
    grid.style.position = 'absolute';
    grid.style.top = '0';
    grid.style.left = '0';
    grid.style.right = '0';
    grid.style.bottom = '0';
    
    // Apply exit animation
    const exitAnimation = swipeDirection === 1 ? 'gridSwipeOutLeft' : 'gridSwipeOutRight';
    grid.style.animation = `${exitAnimation} 0.3s ease-in forwards`;
    
    // Generate new calendar immediately (no wait)
    await generateCalendarGrid();
    
    // Apply entry animation
    const enterAnimation = swipeDirection === 1 ? 'gridSwipeInFromRight' : 'gridSwipeInFromLeft';
    const newGrid = domElements.calendarGrid;
    newGrid.style.position = 'relative';
    newGrid.style.animation = `${enterAnimation} 0.3s ease-out`;
    
    setTimeout(() => {
        newGrid.style.animation = '';
    }, 300);
}

// ========== DETAIL VIEW ==========
async function openDetailView(date) {
    state.detailViewDate = new Date(date);
    
    // Switch to home page (without closing detail view)
    await handlePageChange('home', false);
    
    // Clear calendar grid to "empty" postkamer
    domElements.calendarGrid.innerHTML = '';
    
    // Load and display post for this date
    await displayDetailPost(state.detailViewDate);
    
    // Set up detail mode with navigation
    contentCardComponent.setDetailMode(
        true,
        closeDetailView,
        () => navigateDetailView(1),  // Next day
        () => navigateDetailView(-1)  // Previous day
    );
}

async function displayDetailPost(date, swipeDirection = null) {
    const posts = await loadPostsFromStorage();
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const post = posts[dateKey];
    
    const card = domElements.contentCardContainer.querySelector('.content-card');
    
    // If coming from a swipe action, position old card absolutely so new one can appear behind it
    if (swipeDirection !== null && card) {
        card.style.position = 'absolute';
        card.style.top = '0';
        card.style.left = '0';
        card.style.right = '0';
        card.style.bottom = '0';
        
        const exitAnimation = swipeDirection === 1 ? 'swipeOutLeft' : 'swipeOutRight';
        card.style.animation = `${exitAnimation} 0.3s ease-in forwards`;
    }
    
    // Show post if exists, otherwise show placeholder
    contentCardComponent.setContent(post, date);
    
    // Update date display
    dateDisplayComponent.setDate(date);
    
    // Add entry animation immediately
    const newCard = domElements.contentCardContainer.querySelector('.content-card');
    if (newCard && swipeDirection !== null) {
        newCard.style.position = 'relative';
        const enterAnimation = swipeDirection === 1 ? 'swipeInFromRight' : 'swipeInFromLeft';
        newCard.style.animation = `${enterAnimation} 0.3s ease-out`;
        
        setTimeout(() => {
            newCard.style.animation = '';
        }, 300);
    }
}

async function navigateDetailView(dayOffset) {
    if (!state.detailViewDate) return;
    
    const newDate = new Date(state.detailViewDate);
    newDate.setDate(newDate.getDate() + dayOffset);
    
    // Check if date is within valid range (24 maart to 24 april)
    const startDate = new Date(2026, 2, 24);
    const endDate = new Date(2026, 3, 24);
    
    // Don't allow swiping past boundaries
    if (newDate < startDate || newDate > endDate) {
        return;
    }
    
    state.detailViewDate = newDate;
    // Pass direction: 1 = next (swipe left), -1 = previous (swipe right)
    await displayDetailPost(newDate, dayOffset);
}

async function closeDetailView() {
    state.detailViewDate = null;
    contentCardComponent.setDetailMode(false);
    contentCardComponent.setState('empty'); // Reset card to empty state
    
    // Reset date display to today
    dateDisplayComponent.updateDate();
    
    // Explicitly make home page inactive
    domElements.homePage.classList.remove('active');
    
    // Switch back to postkamer page
    await handlePageChange('postkamer', false);
    
    // Reload postkamer calendar
    await generateCalendarGrid();
}