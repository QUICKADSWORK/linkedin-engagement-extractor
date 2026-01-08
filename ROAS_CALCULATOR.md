# ROAS Calculator

A comprehensive, modern Return on Ad Spend (ROAS) calculator with advanced features and beautiful UI.

## Features

### ✨ Core Features
- **Simple ROAS Calculation**: Revenue ÷ Ad Spend
- **Multi-Currency Support**: 34+ currencies including USD, EUR, GBP, INR, JPY, and more
- **Real-time Calculations**: Instant results as you input data
- **Beautiful Modern UI**: Clean, responsive design with smooth animations

### 📊 Advanced Features
- **Profit Margin Analysis**: Calculate true profitability after costs
- **Break-Even ROAS**: Understand minimum ROAS needed to be profitable
- **Cost Per Acquisition (CPA)**: Track cost per conversion
- **Industry Benchmarks**: Compare against 11+ industry averages
- **Performance Rating**: Get instant rating from Poor to Excellent

### 💡 Intelligent Insights
- **Automated Insights**: AI-powered analysis of your ROAS performance
- **Actionable Recommendations**: Specific steps to improve your campaigns
- **Industry Comparison**: See how you stack up against competitors
- **Scaling Suggestions**: Know when and how to scale your campaigns

## How to Use

### Basic Calculation
1. Select your currency
2. Enter your Ad Spend
3. Enter your Revenue from Ads
4. Click "Calculate ROAS"

### Advanced Options
1. Click "⚙️ Advanced Options" to expand
2. Add **Profit Margin** for true profitability analysis
3. Add **Number of Conversions** to calculate CPA
4. Select your **Industry** for benchmark comparison

## Understanding ROAS

### Formula
```
ROAS = Revenue from Ads ÷ Ad Spend
```

### Example
- Ad Spend: $1,000
- Revenue: $4,500
- ROAS: 4.5 (or 4.5:1)
- Meaning: You earn $4.50 for every $1 spent

### ROAS Rating Scale

| ROAS  | Rating    | Status                           |
|-------|-----------|----------------------------------|
| < 1.0 | Poor      | Losing money - urgent action needed |
| 1.0-2.0 | Fair    | Breaking even - needs optimization |
| 2.0-3.0 | Good    | Profitable - room for improvement |
| 3.0-4.0 | Great   | Strong performance - consider scaling |
| > 4.0 | Excellent | Outstanding - scale with confidence |

### Break-Even ROAS

Break-Even ROAS = 100 ÷ Profit Margin %

**Example:**
- Product costs $60, sells for $100
- Profit Margin: 40%
- Break-Even ROAS: 100 ÷ 40 = 2.5
- You need at least 2.5 ROAS to be profitable

## Industry Benchmarks

Average ROAS by industry:

| Industry               | Average ROAS |
|-----------------------|--------------|
| E-commerce            | 4.5          |
| SaaS                  | 5.0          |
| Real Estate           | 5.5          |
| B2B Services          | 5.0          |
| Retail                | 4.5          |
| General/Other         | 4.0          |
| Education             | 4.0          |
| Travel & Hospitality  | 4.0          |
| Finance & Insurance   | 3.5          |
| Healthcare            | 3.5          |
| Automotive            | 3.0          |

*Note: These are general benchmarks. Your optimal ROAS depends on your specific business model and profit margins.*

## Supported Currencies

🌍 **34 Currencies Supported:**

- 🇺🇸 US Dollar (USD)
- 🇪🇺 Euro (EUR)
- 🇬🇧 UK Pound (GBP)
- 🇮🇳 India Rupee (INR)
- 🇯🇵 Japan Yen (JPY)
- 🇨🇳 China Yuan (CNY)
- 🇦🇺 Australia Dollar (AUD)
- 🇨🇦 Canada Dollar (CAD)
- And 26 more...

## Tips for Improving ROAS

### 1. Optimize Targeting
- Focus on high-intent audiences
- Use lookalike audiences based on best customers
- Exclude underperforming segments

### 2. Improve Ad Creative
- A/B test headlines and visuals
- Use social proof and testimonials
- Create urgency with limited-time offers

### 3. Enhance Landing Pages
- Match ad messaging to landing page
- Simplify checkout/conversion process
- Add trust signals and guarantees

### 4. Adjust Bidding Strategy
- Use target ROAS bidding
- Bid higher on high-converting times/days
- Adjust for device performance

### 5. Track and Monitor
- Set up conversion tracking
- Monitor ROAS daily/weekly
- Create automated alerts for significant changes

## API Documentation

### POST `/api/calculate-roas`

Calculate ROAS with advanced analytics.

**Request Body:**
```json
{
  "ad_spend": 1000,
  "revenue": 4500,
  "profit_margin": 40,
  "conversions": 45,
  "industry": "ecommerce",
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roas": 4.5,
    "rating": {
      "level": "Excellent",
      "color": "success",
      "score": 5
    },
    "metrics": {
      "revenue": 4500,
      "ad_spend": 1000,
      "profit": 1800,
      "net_profit": 800,
      "roi": 80,
      "cpa": 22.22,
      "break_even_roas": 2.5,
      "conversions": 45
    },
    "benchmark": {
      "industry": "ecommerce",
      "industry_average": 4.5,
      "performance_vs_industry": 0
    },
    "insights": [...],
    "recommendations": [...]
  }
}
```

## Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python Flask
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Animations**: CSS animations and transitions
- **Design**: Mobile-first responsive design

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Access the Calculator

### Local Development
```bash
# Start the Flask server
cd backend
python app.py

# Visit in browser
http://localhost:5001/roas
```

### Production
Access at: `https://your-domain.com/roas`

## Screenshots

The calculator features:
- Clean, modern interface
- Gradient background
- Smooth animations
- Card-based layout
- Responsive design
- Visual rating bars
- Color-coded insights
- Interactive elements

## Why This Calculator is Better

Compared to existing ROAS calculators:

✅ **More Comprehensive**
- Includes break-even analysis
- Profit margin calculations
- CPA tracking
- Industry benchmarks

✅ **Better UX**
- Beautiful modern UI
- Real-time calculations
- Visual feedback
- Smooth animations
- Mobile-optimized

✅ **More Intelligent**
- Automated insights
- Actionable recommendations
- Performance rating
- Scaling suggestions

✅ **More Flexible**
- 34+ currencies
- 11+ industries
- Optional advanced fields
- API access

## Support

For questions or issues:
1. Check this documentation
2. Review the inline tooltips (ⓘ icons)
3. Refer to the insights and recommendations provided

## License

Built with ❤️ to help you maximize your advertising ROI.

---

**Version**: 1.0.0  
**Last Updated**: January 2026

