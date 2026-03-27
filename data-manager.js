/**
 * Data Management Script
 * 
 * Use this to easily add/update daily posts
 * 
 * Instructions:
 * 1. Run this file to add posts to localStorage
 * 2. Open the webapp to see your posts
 * 
 * Example usage:
 * - Convert your photo to base64
 * - Add entry to the postsData object below
 * - Run this script
 * - Posts will be saved to localStorage
 */

// Example post data structure:
// {
//   "2024-03-25": {
//     "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
//     "story": "Today was a great day!"
//   }
// }

const postsData = {
    // Add your daily posts here in this format:
    // "YYYY-MM-DD": {
    //     "photo": "data:image/jpeg;base64,YOUR_BASE64_STRING_HERE",
    //     "story": "Your story text here"
    // },
    
    // Example for today:
    "2026-03-25": {
        "photo": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%2397BC87' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle'%3EPastas Post%3C/text%3E%3C/svg%3E",
        "story": "Dit is een voorbeeld post. Je kunt hier je eigen foto en verhaal toevoegen!"
    }
};

// Function to add posts to localStorage
function addPostsToLocalStorage() {
    try {
        // Get existing posts
        const existing = JSON.parse(localStorage.getItem('pastas_posts') || '{}');
        
        // Merge with new posts
        const merged = { ...existing, ...postsData };
        
        // Save to localStorage
        localStorage.setItem('pastas_posts', JSON.stringify(merged));
        
        console.log('✅ Posts successfully added to localStorage!');
        console.log('Posts added:', Object.keys(postsData));
        console.log('Total posts in storage:', Object.keys(merged).length);
        
        return true;
    } catch (error) {
        console.error('❌ Error adding posts:', error);
        return false;
    }
}

// Function to view all stored posts
function viewStoredPosts() {
    try {
        const posts = JSON.parse(localStorage.getItem('pastas_posts') || '{}');
        console.log('📋 All stored posts:', posts);
        return posts;
    } catch (error) {
        console.error('❌ Error viewing posts:', error);
        return {};
    }
}

// Function to clear all posts (be careful!)
function clearAllPosts() {
    if (confirm('Are you sure you want to delete ALL posts? This cannot be undone.')) {
        localStorage.removeItem('pastas_posts');
        localStorage.removeItem('pastas_last_upload_date');
        console.log('✅ All posts cleared');
    }
}

// Function to delete a specific post
function deletePost(dateKey) {
    try {
        const posts = JSON.parse(localStorage.getItem('pastas_posts') || '{}');
        delete posts[dateKey];
        localStorage.setItem('pastas_posts', JSON.stringify(posts));
        console.log(`✅ Post for ${dateKey} deleted`);
    } catch (error) {
        console.error('❌ Error deleting post:', error);
    }
}

// Run on script load
console.log('🐱 Pastas Post - Data Manager');
console.log('=====================================');
console.log('Available functions:');
console.log('- addPostsToLocalStorage()    : Add posts from postsData object');
console.log('- viewStoredPosts()           : View all stored posts');
console.log('- deletePost("YYYY-MM-DD")    : Delete a specific post');
console.log('- clearAllPosts()             : Clear all posts (warning!)');
console.log('');
console.log('To use:');
console.log('1. Edit postsData object with your posts');
console.log('2. Run: addPostsToLocalStorage()');
console.log('3. Open the webapp to see your posts');
console.log('');

// Auto-run on load
addPostsToLocalStorage();

export { addPostsToLocalStorage, viewStoredPosts, deletePost, clearAllPosts };
