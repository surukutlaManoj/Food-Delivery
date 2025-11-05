# 🚀 Render Deployment Checklist

## ✅ Quick Start Guide

### Part 1: Backend Deployment (15 minutes)

1. **[ ] Set up MongoDB Atlas**
   - Create account: https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Whitelist IP: 0.0.0.0/0

2. **[ ] Deploy Backend to Render**
   - Sign up: https://render.com
   - New Web Service
   - Connect GitHub repo (or upload code)
   - Set Root Directory: `server-js`
   - Build Command: `npm install`
   - Start Command: `npm start`
   
3. **[ ] Add Environment Variables**
   - `MONGODB_URI`: (your Atlas connection string)
   - `JWT_SECRET`: (random 32+ character string)
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`

4. **[ ] Seed Database**
   - Use Render Shell: `node seed-restaurants.js`
   - Or run locally with production DB

5. **[ ] Test Backend**
   ```bash
   curl https://YOUR-SERVICE.onrender.com/health
   curl https://YOUR-SERVICE.onrender.com/restaurants/featured?limit=6
   ```

### Part 2: Frontend Deployment (10 minutes)

1. **[ ] Update Frontend Config**
   - Edit `client-js/.env.production`
   - Set `REACT_APP_API_URL` to your backend URL

2. **[ ] Deploy Frontend to Render**
   - New Static Site
   - Connect GitHub repo
   - Set Root Directory: `client-js`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

3. **[ ] Add Environment Variable**
   - `REACT_APP_API_URL`: `https://your-backend.onrender.com`

4. **[ ] Update Backend CORS**
   - Add frontend URL to CORS whitelist
   - Commit and push to redeploy

5. **[ ] Test Full App**
   - Visit your frontend URL
   - Register account
   - Login
   - Browse restaurants
   - Place order

---

## 📋 Environment Variables Reference

### Backend (`server-js`)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fooddelivery
JWT_SECRET=your-random-secret-min-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Frontend (`client-js`)
```
REACT_APP_API_URL=https://your-backend-api.onrender.com
```

---

## 🔗 Important URLs

After deployment, save these:

- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
- **Render Dashboard**: https://dashboard.render.com
- **Backend API**: https://_____.onrender.com
- **Frontend App**: https://_____.onrender.com

---

## ⚠️ Common Issues

### Backend won't start
- Check MongoDB connection string format
- Verify IP whitelist includes 0.0.0.0/0
- Review logs in Render dashboard

### Frontend can't reach API
- Verify REACT_APP_API_URL is correct
- Check backend CORS includes frontend domain
- Ensure backend is not spun down (free tier sleeps)

### Database is empty
- Run seed script: `node seed-restaurants.js`
- Check MongoDB Atlas cluster is active

---

## 💡 Tips

1. **Free tier sleeps after 15 min** - First request takes ~30 seconds
2. **Use MongoDB Atlas free tier** - M0 cluster (512MB)
3. **Monitor logs** - Check for errors in Render dashboard
4. **Custom domains** - Available in Render settings
5. **Automatic deploys** - Push to GitHub = auto deploy

---

## 📚 Detailed Guides

- Backend: See `server-js/RENDER_DEPLOY.md`
- Frontend: See `client-js/RENDER_DEPLOY.md`

---

## ✅ Deployment Complete!

Once both are deployed:

✅ Backend API running on Render  
✅ Frontend app running on Render  
✅ MongoDB Atlas database connected  
✅ Sample restaurants loaded  
✅ Full authentication working  
✅ Orders can be placed  

**Your Food Delivery app is LIVE! 🎉**
