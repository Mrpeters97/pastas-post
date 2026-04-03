#!/usr/bin/env node

/**
 * Watch Manifest Script
 * 
 * Monitors the posts/ directory and automatically regenerates manifest.json
 * whenever date folders are added or removed
 * 
 * Usage: node watch-manifest.js
 * 
 * Press Ctrl+C to stop watching
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const MANIFEST_PATH = path.join(POSTS_DIR, 'manifest.json');

let debounceTimer = null;

function generateManifest() {
    try {
        // Get all date folders (format: YYYY-MM-DD)
        const items = fs.readdirSync(POSTS_DIR);
        const dateFolders = items
            .filter(item => {
                // Check if it's a directory and matches date format
                const itemPath = path.join(POSTS_DIR, item);
                try {
                    return fs.statSync(itemPath).isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(item);
                } catch {
                    return false;
                }
            })
            .sort(); // Sort chronologically

        if (dateFolders.length === 0) {
            console.warn('⚠️  No date folders found in posts/');
            return;
        }

        // Build posts array
        const posts = dateFolders.map(dateFolder => ({
            date: dateFolder,
            photo: `posts/${dateFolder}/photo.jpg`,
            story: `posts/${dateFolder}/story.txt`,
            title: `posts/${dateFolder}/title.txt`,
            visibleFrom: dateFolder // Makes it visible on that date at 00:00
        }));

        // Write manifest.json
        fs.writeFileSync(
            MANIFEST_PATH,
            JSON.stringify({ posts }, null, 2)
        );

        const timestamp = new Date().toLocaleTimeString('nl-NL');
        console.log(`✅ [${timestamp}] Manifest updated: ${dateFolders.length} posts`);

    } catch (error) {
        console.error('❌ Error generating manifest:', error.message);
    }
}

function startWatching() {
    console.log('👀 Watching posts/ directory for changes...');
    console.log('Press Ctrl+C to stop\n');

    // Watch the posts directory
    fs.watch(POSTS_DIR, { recursive: false }, (eventType, filename) => {
        // Debounce to avoid multiple rapid updates
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            generateManifest();
        }, 500);
    });

    // Also watch subdirectories for file changes
    fs.watch(POSTS_DIR, { recursive: true }, (eventType, filename) => {
        // Regenerate if files are added/removed within date folders
        if (filename && !filename.startsWith('.')) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                generateManifest();
            }, 500);
        }
    });
}

// Generate manifest immediately on start
generateManifest();

// Start watching
startWatching();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Watch stopped. Goodbye!');
    process.exit(0);
});
