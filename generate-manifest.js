#!/usr/bin/env node

/**
 * Generate Manifest Script
 * 
 * Automatically scans the posts/ directory and generates manifest.json
 * Each post includes a "visibleFrom" date set to YYYY-MM-DD so it becomes
 * visible on that date at 00:00
 * 
 * Usage: node generate-manifest.js
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const MANIFEST_PATH = path.join(POSTS_DIR, 'manifest.json');

function generateManifest() {
    try {
        // Get all date folders (format: YYYY-MM-DD)
        const items = fs.readdirSync(POSTS_DIR);
        const dateFolders = items
            .filter(item => {
                // Check if it's a directory and matches date format
                const itemPath = path.join(POSTS_DIR, item);
                return fs.statSync(itemPath).isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(item);
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

        console.log('✅ Manifest generated successfully!');
        console.log(`📅 Total posts: ${posts.length}`);
        console.log(`📍 Date range: ${dateFolders[0]} to ${dateFolders[dateFolders.length - 1]}`);
        console.log(`📁 Saved to: ${MANIFEST_PATH}`);

    } catch (error) {
        console.error('❌ Error generating manifest:', error.message);
        process.exit(1);
    }
}

// Run
generateManifest();
