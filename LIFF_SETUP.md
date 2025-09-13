# LIFF (LINE Front-end Framework) Setup Guide

This DApp now includes LIFF integration for native LINE app support.

## What is LIFF?

LIFF (LINE Front-end Framework) is a platform that allows you to develop web apps that run inside the LINE app. It provides:

- Native LINE app integration
- Seamless authentication with LINE accounts
- Access to LINE's native features
- Better user experience within LINE

## Setup Instructions

### 1. Create a LINE Login Channel

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Click "Create a new channel"
3. Select "LINE Login"
4. Fill in the required information:
   - Channel name: "LINE DApp"
   - Channel description: "A decentralized application for LINE users"
   - Category: "Finance"
   - Subcategory: "Other"

### 2. Configure LIFF App

1. In your LINE Login channel, go to the "LIFF" tab
2. Click "Add" to create a new LIFF app
3. Configure the LIFF app:
   - **LIFF app name**: "LINE DApp"
   - **Size**: Full
   - **Endpoint URL**: `https://yourdomain.com` (or `http://localhost:3000` for development)
   - **Scope**: 
     - ✅ `profile` - Get user's basic profile information
     - ✅ `openid` - Get user's LINE user ID
   - **Bot link feature**: Optional (for future bot integration)

### 3. Get LIFF ID

1. After creating the LIFF app, you'll get a **LIFF ID**
2. Copy this LIFF ID - you'll need it for configuration

### 4. Environment Configuration

Create a `.env.local` file in the web directory:

```bash
# LIFF Configuration
NEXT_PUBLIC_LIFF_ID=your_liff_id_here

# Optional: LINE Login OAuth (for fallback)
NEXT_PUBLIC_LINE_CLIENT_ID=your_line_client_id_here
NEXT_PUBLIC_LINE_REDIRECT_URI=http://localhost:3000/auth/callback
LINE_CLIENT_SECRET=your_client_secret_here
```

### 5. Update LIFF Configuration

Update `src/services/liff.ts` with your actual LIFF ID:

```typescript
export const LIFF_CONFIG = {
  liffId: process.env.NEXT_PUBLIC_LIFF_ID || 'your_actual_liff_id_here',
};
```

## Testing LIFF Integration

### 1. Development Testing

1. Start your development server: `npm run dev`
2. Open the app in a regular browser - it will show fallback authentication
3. To test LIFF features, you need to access the app through LINE

### 2. LINE App Testing

1. **Method 1: Share LIFF URL**
   - Get your LIFF URL from the LINE Developers Console
   - Share this URL in a LINE chat
   - Tap the link to open the app in LINE

2. **Method 2: QR Code**
   - Generate a QR code with your LIFF URL
   - Scan with LINE app to open the DApp

3. **Method 3: Bot Integration** (Advanced)
   - Create a bot and add LIFF app
   - Users can access the DApp through the bot

## LIFF Features Available

### Authentication
- ✅ Automatic login with LINE account
- ✅ User profile access
- ✅ Secure token management

### Native LINE Features
- ✅ Share content to LINE chats
- ✅ Open external URLs
- ✅ Close LIFF app
- ✅ Send messages (if bot is configured)

### Platform Detection
- ✅ Detect if running in LINE app
- ✅ Detect if running in LINE browser
- ✅ Different UI for different platforms

## Production Deployment

### 1. Update LIFF Endpoint URL

1. Go to LINE Developers Console
2. Edit your LIFF app
3. Update the endpoint URL to your production domain
4. Save the changes

### 2. Environment Variables

Update your production environment variables:

```bash
NEXT_PUBLIC_LIFF_ID=your_production_liff_id
NEXT_PUBLIC_LINE_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_LINE_REDIRECT_URI=https://yourdomain.com/auth/callback
LINE_CLIENT_SECRET=your_production_client_secret
```

### 3. HTTPS Required

LIFF apps require HTTPS in production. Make sure your production domain has a valid SSL certificate.

## Troubleshooting

### Common Issues

1. **LIFF initialization fails**
   - Check if LIFF ID is correct
   - Ensure the app is accessible via HTTPS (production)
   - Check browser console for errors

2. **Authentication not working**
   - Verify LIFF app configuration
   - Check if scopes are correctly set
   - Ensure user has granted permissions

3. **App not opening in LINE**
   - Use the correct LIFF URL
   - Test with QR code or direct link sharing
   - Check if LIFF app is published

### Debug Mode

Enable debug mode by adding this to your browser console:

```javascript
localStorage.setItem('liff.debug', 'true');
```

## Additional Resources

- [LINE Developers Documentation](https://developers.line.biz/en/docs/)
- [LIFF API Reference](https://developers.line.biz/en/reference/liff/)
- [LINE Login Documentation](https://developers.line.biz/en/docs/line-login/)
- [LIFF Sample Apps](https://github.com/line/line-liff-v2-starter)

## Support

For issues related to LIFF integration, check:
1. LINE Developers Console for app status
2. Browser console for JavaScript errors
3. Network tab for API call failures
4. LINE Developers documentation for API changes
