#!/usr/bin/env node

/**
 * Debug script to check manifest loading
 */

const fs = require('fs');

// Simulate getTodayKey from script.js
function getTodayKey() {
    const today = new Date('2026-04-03'); // Force today to be 2026-04-03
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// Load manifest
try {
    const manifest = JSON.parse(fs.readFileSync('./posts/manifest.json', 'utf8'));
    
    console.log('📋 Manifest loaded');
    console.log('Total posts:', manifest.posts.length);
    
    const todayKey = getTodayKey();
    console.log('\n🔍 Today key:', todayKey);
    
    // Find today's post
    const todayPost = manifest.posts.find(p => p.date === todayKey);
    console.log('\n📅 Post for', todayKey, ':', todayPost);
    
    if (todayPost) {
        // Check files exist
        console.log('\n📁 Checking files:');
        const files = ['photo', 'story', 'title'];
        files.forEach(type => {
            const key = type === 'photo' ? 'photo' : type;
            const path = todayPost[key];
            const fullPath = `./${path}`;
            const exists = fs.existsSync(fullPath);
            const size = exists ? fs.statSync(fullPath).size : 0;
            console.log(`  ${key}: ${exists ? '✅' : '❌'} (${path}) - ${size} bytes`);
        });
        
        // Check visibleFrom
        console.log('\n🔐 Visibility:');
        console.log('  visibleFrom:', todayPost.visibleFrom);
        const visibleDate = new Date(todayPost.visibleFrom);
        const today = new Date(todayKey);
        today.setHours(0, 0, 0, 0);
        visibleDate.setHours(0, 0, 0, 0);
        console.log('  Today date:', today.toISOString().split('T')[0]);
        console.log('  Visible from:', visibleDate.toISOString().split('T')[0]);
        console.log('  Should be visible:', today >= visibleDate ? '✅ YES' : '❌ NO');
    } else {
        console.log('\n❌ Post not found in manifest!');
        console.log('Available dates:', manifest.posts.map(p => p.date).join(', '));
    }
} catch (error) {
    console.error('❌ Error:', error.message);
}
