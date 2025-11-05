# Deploy Food Delivery Frontend to Render

## Prerequisites
1. Backend API deployed and running (see server-js/RENDER_DEPLOY.md)
2. Render account
3. Git repository with your code

## Step-by-Step Deployment

### 1. Prepare Frontend for Production

1. **Create production environment file:**
   
   Create `client-js/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-backend-api.onrender.com
   ```
   Replace `your-backend-api` with your actual backend service name.

2. **Update package.json build script** (already correct):
   ```json
   "scripts": {
     "start": "craco start",
     "build": "craco build",
     "test": "craco test"
   }
   ```

### 2. Deploy Frontend to Render

#### Option A: Using GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   cd client-js
   git init
   git add .
   git commit -m "Initial commit - Food Delivery Frontend"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `food-delivery-app`
     - **Branch**: `main`
     - **Root Directory**: `client-js` (if not in root)
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`

3. **Add Environment Variables:**
   - Click "Environment" tab
   - Add: `REACT_APP_API_URL` = `https://your-backend-api.onrender.com`

4. Click "Create Static Site"

5. Wait for build (~3-5 minutes)

6. Your app will be live at: `https://food-delivery-app.onrender.com`

#### Option B: Deploy to Vercel (Alternative - Faster)

Vercel is often faster for React apps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client-js
   vercel
   ```

3. **Follow prompts:**
   - Set up and deploy: Yes
   - Which scope: (your account)
   - Link to existing project: No
   - Project name: food-delivery-app
   - Directory: `./`
   - Override settings: No

4. **Add environment variable:**
   ```bash
   vercel env add REACT_APP_API_URL production
   ```
   Enter your backend URL when prompted

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### 3. Configure CORS on Backend

Update your backend to allow requests from your frontend:

In `server-js/index.js`, update CORS configuration:

```javascript
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://food-delivery-app.onrender.com', // Add your Render frontend URL
    'https://your-custom-domain.com' // Add any custom domains
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Commit and push changes to redeploy backend.

### 4. Test Your Deployment

1. Visit your frontend URL
2. Try these features:
   - View featured restaurants
   - Register a new account
   - Login
   - Browse restaurants
   - Add items to cart
   - Place an order

### 5. Custom Domain (Optional)

**On Render:**
1. Go to your static site settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

**On Vercel:**
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS as instructed

### 6. Troubleshooting

**Build Fails:**
- Check build logs for specific errors
- Verify all dependencies are in package.json
- Ensure build command is correct

**API Calls Fail:**
- Check REACT_APP_API_URL is set correctly
- Verify backend CORS allows your frontend domain
- Check backend is running (not spun down)

**Blank Page:**
- Check browser console for errors
- Verify build directory is set to `build`
- Check routing configuration

**Images Don't Load:**
- Verify public folder assets are included
- Check image URLs are relative
- Ensure manifest.json is correct

### 7. Performance Optimization

**Enable Caching:**
- Render automatically caches static assets
- Set proper cache headers

**Compress Assets:**
- Build automatically minifies JS/CSS
- Images are optimized during build

**Monitor Performance:**
- Use Render analytics
- Check Lighthouse scores
- Monitor API response times

---

## Success! 🎉

Your Food Delivery app is now live!

**URLs:**
- **Frontend**: `https://food-delivery-app.onrender.com`
- **Backend API**: `https://food-delivery-api.onrender.com`

**What's Working:**
✅ Browse restaurants
✅ User authentication
✅ Shopping cart
✅ Order placement
✅ Order history
✅ User profiles

**Next Steps:**
- Add custom domain
- Set up monitoring
- Enable analytics
- Add SSL certificate (automatic on Render)
- Configure email notifications (optional)

Enjoy your deployed Food Delivery app! 🍕🚀
