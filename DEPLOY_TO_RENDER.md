# 🚀 Deploy ROAS Calculator to Render

## Quick Deployment Guide

Your ROAS calculator is **ready to deploy** to Render! Everything is already configured.

---

## 📋 Prerequisites

1. **GitHub Account** (to push your code)
2. **Render Account** (free at [render.com](https://render.com))
3. **Git installed** on your computer

---

## 🎯 Step 1: Push Code to GitHub

### Option A: Create New Repository

```bash
# Navigate to project directory
cd /Users/bibhuprashadnayak/linkedin-engagement-extractor

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Add ROAS Calculator with QuickAds design"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Option B: Update Existing Repository

```bash
cd /Users/bibhuprashadnayak/linkedin-engagement-extractor

git add .
git commit -m "Add ROAS Calculator with QuickAds design"
git push origin main
```

---

## 🎯 Step 2: Deploy on Render

### **Method 1: Using render.yaml (Recommended)**

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/

2. **Click "New +"** → **"Blueprint"**

3. **Connect GitHub Repository**
   - Select your repository
   - Render will automatically detect `render.yaml`

4. **Configure Environment Variables** (if needed)
   - `RAPIDAPI_KEY` - Your RapidAPI key (optional for ROAS calculator)
   - `FLASK_DEBUG` - Set to "False"
   - `DEMO_MODE` - Set to "False"

5. **Click "Apply"**
   - Render will build and deploy automatically!

### **Method 2: Manual Setup**

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/

2. **Click "New +"** → **"Web Service"**

3. **Connect Repository**
   - Select your GitHub repository

4. **Configure Service:**
   ```
   Name: roas-calculator
   Environment: Python 3
   Region: Choose closest to you
   Branch: main
   
   Build Command:
   cd backend && pip install -r requirements.txt
   
   Start Command:
   cd backend && gunicorn app:app --bind 0.0.0.0:$PORT
   ```

5. **Environment Variables** (Optional):
   ```
   FLASK_DEBUG=False
   DEMO_MODE=False
   ```

6. **Instance Type:**
   - Select **"Free"** (or paid for better performance)

7. **Click "Create Web Service"**

---

## 🎯 Step 3: Access Your Live ROAS Calculator

### After Deployment (5-10 minutes):

1. **Get Your URL:**
   ```
   https://YOUR-APP-NAME.onrender.com/roas
   ```

2. **Test the Calculator:**
   - Visit the URL
   - Enter sample data
   - Verify calculations work

3. **Main App Also Available:**
   ```
   https://YOUR-APP-NAME.onrender.com/
   ```

---

## 📁 Files Already Configured

Your project includes all necessary deployment files:

### ✅ `render.yaml`
```yaml
services:
  - type: web
    name: linkedin-engagement-extractor
    env: python
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: cd backend && gunicorn app:app --bind 0.0.0.0:$PORT
```

### ✅ `Procfile`
```
web: cd backend && gunicorn app:app --bind 0.0.0.0:$PORT
```

### ✅ `requirements.txt`
```
Flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
python-dotenv==1.0.0
gunicorn==21.2.0
```

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain:

1. **In Render Dashboard:**
   - Go to your service
   - Click "Settings" tab
   - Scroll to "Custom Domain"

2. **Add Domain:**
   - Enter: `roas.yourdomain.com`
   - Follow DNS configuration instructions

3. **Update DNS:**
   - Add CNAME record pointing to Render

---

## 🔧 Configuration Options

### Environment Variables

You can set these in Render Dashboard:

```bash
# Production Mode
FLASK_DEBUG=False

# Demo Mode (for testing without API)
DEMO_MODE=False

# RapidAPI Key (for LinkedIn extractor)
RAPIDAPI_KEY=your_key_here

# Custom Port (Render sets automatically)
PORT=10000
```

---

## 🚀 Deployment Features

### What Render Provides:

✅ **Free HTTPS/SSL Certificate**
- Automatic SSL for your domain
- Secure connections by default

✅ **Automatic Deploys**
- Push to GitHub = Auto deploy
- Continuous deployment enabled

✅ **Auto-Scaling**
- Handles traffic spikes
- Free tier: 750 hours/month

✅ **Built-in Monitoring**
- View logs in real-time
- Monitor performance

✅ **Zero-Downtime Deploys**
- Updates without interruption
- Professional deployment

---

## 📊 After Deployment

### Your Live URLs:

```bash
# ROAS Calculator
https://YOUR-APP-NAME.onrender.com/roas

# LinkedIn Extractor (Main App)
https://YOUR-APP-NAME.onrender.com/

# API Endpoints
https://YOUR-APP-NAME.onrender.com/api/calculate-roas
https://YOUR-APP-NAME.onrender.com/api/health
```

### Share Your Calculator:

```markdown
🎯 Try our ROAS Calculator!
https://YOUR-APP-NAME.onrender.com/roas

Calculate your Return on Ad Spend with:
- 34+ currencies
- Industry benchmarks
- Smart insights
- Actionable recommendations
```

---

## 🔍 Troubleshooting

### Build Fails?

**Check:**
1. All files committed to GitHub
2. `requirements.txt` in backend folder
3. Build command correct in render.yaml

**Fix:**
```bash
# Ensure all files are tracked
git status
git add .
git commit -m "Fix deployment"
git push
```

### App Won't Start?

**Check Logs:**
1. Go to Render Dashboard
2. Click your service
3. View "Logs" tab
4. Look for error messages

**Common Issues:**
- Port binding: Render sets `$PORT` automatically
- Path issues: Commands use `cd backend &&`
- Dependencies: Check `requirements.txt`

### Slow Initial Load?

**Free Tier Behavior:**
- Apps sleep after 15 min inactivity
- First request takes 30-60 seconds
- Upgrade to paid tier for always-on

**Solution:**
- Use Render's paid tier ($7/month)
- Or accept ~30s first load time

---

## 💰 Pricing

### Free Tier (Perfect for ROAS Calculator):
- ✅ 750 hours/month
- ✅ Auto-sleep after 15 min
- ✅ Free SSL
- ✅ Free subdomain
- ⚠️ Slower cold starts

### Starter ($7/month):
- ✅ Always-on
- ✅ Faster performance
- ✅ More resources
- ✅ Priority support

---

## 🎯 Quick Commands Reference

### Deploy Updates:
```bash
git add .
git commit -m "Update ROAS calculator"
git push origin main
# Render auto-deploys in 2-5 minutes
```

### View Logs:
```bash
# In Render Dashboard → Your Service → Logs
# Or use Render CLI
```

### Restart Service:
```bash
# Render Dashboard → Your Service → Manual Deploy → Clear cache & deploy
```

---

## ✅ Deployment Checklist

Before going live, verify:

- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Build completed successfully
- [ ] App starts without errors
- [ ] ROAS calculator accessible at `/roas`
- [ ] Sample calculation works
- [ ] Advanced options work
- [ ] Mobile responsive
- [ ] HTTPS enabled (automatic)
- [ ] Custom domain added (optional)

---

## 🎊 You're Live!

Once deployed, your ROAS calculator will be:

### ✅ **Publicly Accessible**
- Anyone can use it
- Professional URL
- Secure HTTPS

### ✅ **Always Updated**
- Push to GitHub = Auto deploy
- No manual uploads
- Version controlled

### ✅ **Professional Hosting**
- Fast CDN
- Auto-scaling
- Monitored uptime

### ✅ **QuickAds Design**
- Beautiful purple-pink gradients
- Modern professional look
- Mobile optimized

---

## 📞 Need Help?

### Render Support:
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### Common Issues:
1. **Build Fails**: Check build logs in dashboard
2. **App Crashes**: Check runtime logs
3. **Slow Load**: Normal for free tier (30s first load)

---

## 🚀 Next Steps

1. **Deploy Now!**
   ```bash
   git push origin main
   ```

2. **Visit Render:**
   - https://dashboard.render.com/

3. **Connect GitHub & Deploy**
   - Follow Step 2 above

4. **Share Your Live ROAS Calculator!**
   - Send link to clients
   - Add to website
   - Share on social media

---

## 🎁 Bonus: Marketing Your Calculator

### Embed on Website:
```html
<iframe 
  src="https://YOUR-APP-NAME.onrender.com/roas" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

### Social Media Posts:
```
🎯 Free ROAS Calculator!

Calculate your Return on Ad Spend with:
✅ 34+ currencies
✅ Industry benchmarks  
✅ Smart insights
✅ Break-even analysis

Try it: https://YOUR-APP-NAME.onrender.com/roas

#Marketing #ROAS #Advertising
```

---

## 🎉 Ready to Deploy!

Your ROAS calculator with QuickAds design is **100% ready** for Render deployment!

**Start deploying now:** https://dashboard.render.com/

---

*Questions? Check Render's excellent documentation or their support!*

