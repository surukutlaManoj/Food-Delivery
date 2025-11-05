# Deploy Food Delivery Backend to Render

## Prerequisites
1. MongoDB Atlas account (for cloud database)
2. Render account (free tier works)
3. Git repository with your code

## Step-by-Step Deployment

### 1. Set Up MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or sign in
3. Create a new cluster (Free M0 tier)
4. Wait for cluster to be created (~5 minutes)
5. Click "Connect" on your cluster
6. Add connection IP: Click "Add Your Current IP Address" OR use `0.0.0.0/0` (allow from anywhere)
7. Create a database user:
   - Username: `fooddelivery_user`
   - Password: (generate secure password - save it!)
8. Click "Choose a connection method" → "Connect your application"
9. Copy the connection string, it looks like:
   ```
   mongodb+srv://fooddelivery_user:<password>@cluster0.xxxxx.mongodb.net/fooddelivery?retryWrites=true&w=majority
   ```
10. Replace `<password>` with your actual password
11. Save this connection string - you'll need it!

### 2. Deploy Backend to Render

#### Option A: Using GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   cd server-js
   git init
   git add .
   git commit -m "Initial commit - Food Delivery Backend"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com and sign in
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server-js` directory
   - Configure:
     - **Name**: `food-delivery-api`
     - **Environment**: `Node`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: `server-js` (if not in root)
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables:**
   Click "Environment" tab and add:
   - `MONGODB_URI`: (paste your MongoDB Atlas connection string)
   - `JWT_SECRET`: (generate random string, e.g., `your-super-secret-jwt-key-change-in-production`)
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`

4. Click "Create Web Service"

5. Wait for deployment (~5 minutes)

6. Your API will be live at: `https://food-delivery-api.onrender.com`

#### Option B: Manual Deploy (Alternative)

If you don't want to use GitHub:

1. Go to Render dashboard
2. Click "New +" → "Web Service"
3. Choose "Deploy from Git" or "Deploy manually"
4. Upload your `server-js` folder
5. Follow the same configuration steps above

### 3. Seed Your Database

After deployment, seed the database with sample restaurants:

**Method 1: Using Render Shell**
1. Go to your service dashboard
2. Click "Shell" tab
3. Run: `node seed-restaurants.js`

**Method 2: Run locally pointing to production DB**
1. Update your local `.env` with the Atlas connection string
2. Run: `node seed-restaurants.js`

### 4. Test Your Deployment

Test your live API:

```bash
# Health check
curl https://food-delivery-api.onrender.com/health

# Get restaurants
curl https://food-delivery-api.onrender.com/restaurants/featured?limit=6

# Register user
curl -X POST https://food-delivery-api.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 5. Important Notes

**Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after inactivity takes ~30 seconds to wake up
- 750 hours/month free (enough for one service)

**Custom Domain (Optional):**
- Go to "Settings" tab
- Add custom domain
- Update DNS records as shown

**Monitoring:**
- Check logs in "Logs" tab
- View metrics in "Metrics" tab
- Set up health checks in "Settings"

### 6. Environment Variables Reference

Required environment variables:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fooddelivery
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
```

### 7. Troubleshooting

**Service won't start:**
- Check logs for errors
- Verify MongoDB connection string
- Ensure all dependencies in package.json

**Database connection fails:**
- Check MongoDB Atlas IP whitelist (should have 0.0.0.0/0)
- Verify username/password in connection string
- Check if cluster is active

**API endpoints return 404:**
- Verify routes are correctly defined
- Check start command is `npm start`
- Review deployment logs

### 8. Update Your Frontend

Once backend is deployed, update your frontend to use the production API:

Create `client-js/.env.production`:
```env
REACT_APP_API_URL=https://food-delivery-api.onrender.com
```

---

## Success! 🎉

Your backend API is now live at:
- **API URL**: `https://food-delivery-api.onrender.com`
- **Health Check**: `https://food-delivery-api.onrender.com/health`
- **Restaurants**: `https://food-delivery-api.onrender.com/restaurants`

Next: Deploy your frontend to Render or Vercel!
