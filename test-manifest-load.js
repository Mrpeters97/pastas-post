// Quick test to see if manifest loads posts correctly
const fetch = require('node-fetch');

async function test() {
    try {
        console.log('Loading manifest.json...');
        const response = await fetch('file:///Users/jesse.peters/Desktop/Prototypes/Pastas-post/posts/manifest.json');
        const data = await response.json();
        console.log('✅ Manifest loaded');
        console.log('Posts count:', data.posts.length);
        
        // Find 2026-04-03
        const todayPost = data.posts.find(p => p.date === '2026-04-03');
        console.log('\n2026-04-03 entry:', JSON.stringify(todayPost, null, 2));
        
        if (todayPost) {
            // Try to fetch the photo
            console.log('\nTrying to fetch photo...');
            const photoResponse = await fetch(`file:///Users/jesse.peters/Desktop/Prototypes/Pastas-post/${todayPost.photo}`);
            console.log('Photo response ok:', photoResponse.ok);
            console.log('Photo response status:', photoResponse.status);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

test();
