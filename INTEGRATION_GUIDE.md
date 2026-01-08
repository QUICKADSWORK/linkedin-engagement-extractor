# 🚀 ROAS Calculator - Integration Guide for Developers

## Overview
This guide helps you integrate the ROAS Calculator into your main website.

---

## 📦 What You're Getting

A fully-functional **ROAS (Return on Ad Spend) Calculator** with:
- ✅ QuickAds-inspired design (purple-pink gradients)
- ✅ 34+ currency support
- ✅ Industry benchmarks (11+ industries)
- ✅ Comprehensive educational content
- ✅ Mobile-responsive
- ✅ No external dependencies (pure HTML/CSS/JS)

---

## 📁 Files Needed

### **Option 1: Standalone Version (Recommended)**

Download these 3 files from GitHub:

```
frontend/roas-calculator.html
frontend/roas-styles.css
frontend/roas-script.js
```

**GitHub Repository:**
```
https://github.com/QUICKADSWORK/linkedin-engagement-extractor
```

### **Option 2: With Backend API**

If you want advanced analytics API:

```
backend/app.py          (Flask backend)
backend/requirements.txt (Python dependencies)
```

---

## 🎯 Integration Methods

### **Method 1: Standalone Page**

Simply upload the 3 files to your server:

```
your-site.com/
  ├── roas-calculator.html
  ├── roas-styles.css
  └── roas-script.js
```

**Access at:** `https://your-site.com/roas-calculator.html`

**That's it!** The calculator works completely standalone.

---

### **Method 2: Embed in Existing Page**

To embed the calculator in an existing page:

#### **Step 1: Copy the HTML content**

From `roas-calculator.html`, copy everything between `<main class="main-content">` and `</main>`.

#### **Step 2: Include the CSS**

Add to your page's `<head>`:

```html
<link rel="stylesheet" href="path/to/roas-styles.css">
<!-- OR include inline -->
<style>
  /* Paste contents of roas-styles.css here */
</style>
```

#### **Step 3: Include the JavaScript**

Add before closing `</body>`:

```html
<script src="path/to/roas-script.js"></script>
<!-- OR include inline -->
<script>
  // Paste contents of roas-script.js here
</script>
```

#### **Step 4: Add Inter font**

Add to `<head>` if not already using:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

---

### **Method 3: iFrame Embed**

Host the calculator and embed anywhere:

```html
<iframe 
  src="https://your-site.com/roas-calculator.html"
  width="100%"
  height="1200px"
  style="border: none; border-radius: 16px;"
  title="ROAS Calculator">
</iframe>
```

---

## 🎨 Customization Options

### **Change Colors (Brand Matching)**

Edit in `roas-styles.css`:

```css
:root {
    /* Change these colors */
    --primary-color: #8b5cf6;        /* Main purple */
    --primary-dark: #7c3aed;         /* Dark purple */
    --accent-color: #ec4899;         /* Pink accent */
    --bg-gradient-start: #8b5cf6;    /* Gradient start */
    --bg-gradient-end: #ec4899;      /* Gradient end */
}
```

### **Update Branding**

In `roas-calculator.html`, find and update:

```html
<!-- Footer section -->
<footer class="footer">
    <p>Built by YOUR COMPANY NAME</p>
</footer>
```

### **Add Analytics**

Add your tracking code to `roas-calculator.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

### **Add More Currencies**

In `roas-script.js`, find `CURRENCY_SYMBOLS` object and add:

```javascript
const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    YOUR_CURRENCY: 'SYMBOL',  // Add here
    // ...
};
```

Then add to HTML select in `roas-calculator.html`:

```html
<option value="YOUR_CODE" data-symbol="SYMBOL">🏳️ Your Currency Name</option>
```

### **Add More Industries**

In `roas-script.js`, update `INDUSTRY_BENCHMARKS`:

```javascript
const INDUSTRY_BENCHMARKS = {
    general: 4.0,
    ecommerce: 4.5,
    your_industry: 5.0,  // Add here
    // ...
};
```

Then add to HTML select in `roas-calculator.html`.

---

## 🔌 Backend API Integration (Optional)

If you want to use the advanced analytics API:

### **Deploy Backend:**

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Run Flask app
python backend/app.py
```

### **API Endpoint:**

```
POST /api/calculate-roas

Request Body:
{
  "ad_spend": 1000,
  "revenue": 4500,
  "profit_margin": 40,
  "conversions": 45,
  "industry": "ecommerce",
  "currency": "USD"
}

Response:
{
  "success": true,
  "data": {
    "roas": 4.5,
    "rating": {...},
    "metrics": {...},
    "insights": [...],
    "recommendations": [...]
  }
}
```

### **Update API URL:**

In `roas-script.js`, if you want to use backend API, add:

```javascript
// Optional: Call backend API for advanced insights
async function getAdvancedInsights(data) {
    const response = await fetch('https://your-api.com/api/calculate-roas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}
```

---

## 📱 Mobile Optimization

The calculator is fully responsive out of the box:

- **Desktop (> 992px):** Two-column layout (content left, calculator right)
- **Tablet (768px - 992px):** Stacked layout (calculator top, content bottom)
- **Mobile (< 768px):** Full-width stacked with optimized spacing

No additional work needed!

---

## 🎯 SEO Optimization

### **Add Meta Tags:**

In `roas-calculator.html` `<head>`:

```html
<meta name="description" content="Free ROAS Calculator - Calculate your Return on Ad Spend with 34+ currencies, industry benchmarks, and smart insights.">
<meta name="keywords" content="ROAS calculator, return on ad spend, advertising ROI, marketing metrics">

<!-- Open Graph -->
<meta property="og:title" content="ROAS Calculator - Calculate Return on Ad Spend">
<meta property="og:description" content="Free ROAS Calculator with 34+ currencies and industry benchmarks">
<meta property="og:image" content="https://your-site.com/roas-preview.png">
<meta property="og:url" content="https://your-site.com/roas-calculator">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="ROAS Calculator">
<meta name="twitter:description" content="Free ROAS Calculator with advanced features">
<meta name="twitter:image" content="https://your-site.com/roas-preview.png">
```

### **Add Schema Markup:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ROAS Calculator",
  "description": "Calculate your Return on Ad Spend with advanced features",
  "url": "https://your-site.com/roas-calculator",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

---

## 🔧 Technical Requirements

### **Browser Support:**
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **Server Requirements:**
- ✅ Any web server (Apache, Nginx, etc.)
- ✅ No special server-side processing needed
- ✅ Static hosting works perfectly (Netlify, Vercel, GitHub Pages)

### **Dependencies:**
- ✅ None! Pure HTML/CSS/JS
- ✅ Google Fonts (Inter) - loads from CDN
- ✅ No jQuery, no React, no frameworks

---

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Download Files**

```bash
# Clone repository
git clone https://github.com/QUICKADSWORK/linkedin-engagement-extractor.git

# Navigate to frontend folder
cd linkedin-engagement-extractor/frontend
```

### **Step 2: Copy Files to Your Server**

```bash
# Copy the 3 files
cp roas-calculator.html /path/to/your/website/
cp roas-styles.css /path/to/your/website/
cp roas-script.js /path/to/your/website/
```

### **Step 3: Test**

Visit: `https://your-site.com/roas-calculator.html`

**Done!** ✅

---

## 🎨 Design Specifications

### **Color Palette:**
- Primary Purple: `#8b5cf6`
- Accent Pink: `#ec4899`
- Dark Purple: `#7c3aed`
- Success Green: `#10b981`
- Warning Orange: `#f59e0b`
- Danger Red: `#ef4444`

### **Typography:**
- Font Family: Inter
- Weights: 300, 400, 500, 600, 700, 800
- Base Size: 16px
- Line Height: 1.6

### **Spacing:**
- Border Radius: 12px (cards), 16px (large cards)
- Padding: 2rem (desktop), 1.5rem (mobile)
- Gaps: 2rem (sections), 1rem (elements)

---

## 📊 Performance

- **Load Time:** < 2 seconds
- **File Sizes:**
  - HTML: ~30 KB
  - CSS: ~15 KB
  - JS: ~10 KB
- **Total:** ~55 KB (very lightweight!)

---

## 🔒 Security

- ✅ No user data stored
- ✅ No cookies used
- ✅ No external API calls (unless you add backend)
- ✅ Client-side calculations only
- ✅ No form submissions
- ✅ GDPR compliant

---

## 🐛 Troubleshooting

### **Issue: Styles not loading**
- Check CSS file path is correct
- Ensure CSS file is in same directory or update path
- Check browser console for 404 errors

### **Issue: Calculator not working**
- Check JavaScript file is loaded
- Open browser console for errors
- Ensure no conflicts with existing JS libraries

### **Issue: Layout broken on mobile**
- Ensure viewport meta tag is present:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```

### **Issue: Fonts not loading**
- Check Google Fonts link is present
- Try loading from local fonts if needed

---

## 📞 Support

### **GitHub Repository:**
```
https://github.com/QUICKADSWORK/linkedin-engagement-extractor
```

### **Files Location:**
```
/frontend/roas-calculator.html
/frontend/roas-styles.css
/frontend/roas-script.js
```

### **Documentation:**
- User Guide: `/ROAS_CALCULATOR.md`
- Feature Overview: `/ROAS_SUMMARY.md`
- Quick Start: `/QUICK_START.md`

---

## ✅ Checklist for Integration

Before going live:

- [ ] Downloaded all 3 files (HTML, CSS, JS)
- [ ] Updated branding/footer
- [ ] Added analytics tracking
- [ ] Tested on desktop browser
- [ ] Tested on mobile device
- [ ] Verified all calculations work
- [ ] Checked all 34 currencies load
- [ ] Tested advanced options
- [ ] Added meta tags for SEO
- [ ] Configured domain/URL
- [ ] Tested page load speed

---

## 🎁 Features Included

### **Calculator Features:**
- [x] Basic ROAS calculation
- [x] 34+ currencies
- [x] Break-even analysis
- [x] Profit margin calculations
- [x] Cost per acquisition
- [x] ROI calculations
- [x] Industry benchmarks (11+)
- [x] Performance rating
- [x] Smart insights
- [x] Actionable recommendations

### **Content Features:**
- [x] What is ROAS guide
- [x] How to calculate ROAS
- [x] What is good ROAS
- [x] How to use guide
- [x] Influencing factors
- [x] Comprehensive FAQs
- [x] Table of contents
- [x] Smooth scroll navigation

### **Design Features:**
- [x] QuickAds purple-pink theme
- [x] Two-column layout (desktop)
- [x] Sticky sidebar
- [x] Gradient backgrounds
- [x] Professional typography
- [x] Smooth animations
- [x] Mobile responsive
- [x] Touch-friendly

---

## 🚀 You're Ready!

The calculator is **production-ready** and easy to integrate. 

**Simplest Integration:**
1. Download 3 files
2. Upload to your server
3. Access the page
4. Done! ✅

**Questions?** Check the documentation files in the repository.

---

*Built with ❤️ - Ready to calculate thousands of ROAS!*

