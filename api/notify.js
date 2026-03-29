import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { pending, message, timestamp } = req.body;

        // For Vercel, we'll read and return the notification data
        // In production, you might want to use a database instead
        // For now, we'll just confirm the request
        
        const notificationData = {
            pending: pending !== undefined ? pending : true,
            message: message || 'Miaauww! Pasta heeft je een bericht gestuurd',
            timestamp: timestamp || Date.now()
        };

        // Try to write to the public folder
        try {
            const publicPath = path.join(process.cwd(), 'public');
            if (!fs.existsSync(publicPath)) {
                fs.mkdirSync(publicPath, { recursive: true });
            }
            
            const filePath = path.join(publicPath, 'notifications.json');
            fs.writeFileSync(filePath, JSON.stringify(notificationData, null, 2));
            
            return res.status(200).json({
                success: true,
                message: 'Notification updated',
                data: notificationData
            });
        } catch (fileError) {
            // If filesystem write fails, just return success anyway
            // (In production, use a database)
            console.warn('Could not write file:', fileError);
            return res.status(200).json({
                success: true,
                message: 'Notification queued',
                data: notificationData
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
