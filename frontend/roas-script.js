// ROAS Calculator JavaScript
// Industry Benchmarks (Average ROAS by industry)
const INDUSTRY_BENCHMARKS = {
    general: 4.0,
    ecommerce: 4.5,
    saas: 5.0,
    finance: 3.5,
    realestate: 5.5,
    automotive: 3.0,
    education: 4.0,
    healthcare: 3.5,
    travel: 4.0,
    retail: 4.5,
    b2b: 5.0
};

// Currency symbols
const CURRENCY_SYMBOLS = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹', AUD: 'A$', CAD: 'C$',
    CHF: 'CHF', CNY: '¥', JPY: '¥', SGD: 'S$', NZD: 'NZ$', HKD: 'HK$',
    SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł', CZK: 'Kč', HUF: 'Ft',
    RON: 'lei', TRY: '₺', ZAR: 'R', BRL: 'R$', MXN: '$', AED: 'د.إ',
    SAR: '﷼', THB: '฿', MYR: 'RM', IDR: 'Rp', PHP: '₱', VND: '₫',
    KRW: '₩', ILS: '₪', RUB: '₽', UAH: '₴'
};

// DOM Elements
const currencySelect = document.getElementById('currency');
const adSpendInput = document.getElementById('adSpend');
const revenueInput = document.getElementById('revenue');
const profitMarginInput = document.getElementById('profitMargin');
const conversionsInput = document.getElementById('conversions');
const industrySelect = document.getElementById('industry');
const advancedToggle = document.getElementById('advancedToggle');
const advancedFields = document.getElementById('advancedFields');
const roasForm = document.getElementById('roasForm');
const resultsSection = document.getElementById('resultsSection');
const resetBtn = document.getElementById('resetBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default currency to USD
    updateCurrencySymbols();
    
    // Event Listeners
    currencySelect.addEventListener('change', updateCurrencySymbols);
    advancedToggle.addEventListener('click', toggleAdvancedFields);
    roasForm.addEventListener('submit', calculateROAS);
    resetBtn.addEventListener('click', resetCalculator);
});

// Update currency symbols
function updateCurrencySymbols() {
    const selectedCurrency = currencySelect.value;
    const symbol = CURRENCY_SYMBOLS[selectedCurrency] || '$';
    
    document.getElementById('adSpendSymbol').textContent = symbol;
    document.getElementById('revenueSymbol').textContent = symbol;
}

// Toggle advanced fields
function toggleAdvancedFields(e) {
    e.preventDefault();
    advancedFields.classList.toggle('show');
    advancedToggle.classList.toggle('active');
}

// Calculate ROAS
function calculateROAS(e) {
    e.preventDefault();
    
    // Get form values
    const currency = currencySelect.value;
    const symbol = CURRENCY_SYMBOLS[currency];
    const adSpend = parseFloat(adSpendInput.value) || 0;
    const revenue = parseFloat(revenueInput.value) || 0;
    const profitMargin = parseFloat(profitMarginInput.value) || 0;
    const conversions = parseInt(conversionsInput.value) || 0;
    const industry = industrySelect.value;
    
    // Validate inputs
    if (adSpend <= 0 || revenue < 0) {
        alert('Please enter valid numbers for Ad Spend and Revenue.');
        return;
    }
    
    // Calculate ROAS
    const roas = revenue / adSpend;
    
    // Calculate additional metrics
    const profit = profitMargin > 0 ? revenue * (profitMargin / 100) - adSpend : null;
    const cpa = conversions > 0 ? adSpend / conversions : null;
    const breakEvenRoas = profitMargin > 0 ? 100 / profitMargin : 1.0;
    
    // Display results
    displayResults({
        roas,
        revenue,
        adSpend,
        profit,
        cpa,
        conversions,
        breakEvenRoas,
        profitMargin,
        industry,
        symbol
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Display results
function displayResults(data) {
    const { roas, revenue, adSpend, profit, cpa, conversions, breakEvenRoas, profitMargin, industry, symbol } = data;
    
    // Show results section
    resultsSection.style.display = 'grid';
    
    // Update ROAS value
    document.getElementById('roasValue').textContent = roas.toFixed(2);
    
    // Update score description
    const scoreDescription = document.getElementById('scoreDescription');
    scoreDescription.textContent = `You're earning ${symbol}${roas.toFixed(2)} for every ${symbol}1 spent on ads`;
    
    // Update rating
    updateRating(roas);
    
    // Update metrics
    document.getElementById('totalRevenue').textContent = formatCurrency(revenue, symbol);
    document.getElementById('totalAdSpend').textContent = formatCurrency(adSpend, symbol);
    
    // Show/hide optional metrics
    if (profit !== null) {
        document.getElementById('profitCard').style.display = 'flex';
        document.getElementById('estimatedProfit').textContent = formatCurrency(profit, symbol);
    } else {
        document.getElementById('profitCard').style.display = 'none';
    }
    
    if (cpa !== null) {
        document.getElementById('cpaCard').style.display = 'flex';
        document.getElementById('cpaValue').textContent = formatCurrency(cpa, symbol);
    } else {
        document.getElementById('cpaCard').style.display = 'none';
    }
    
    // Update break-even ROAS
    document.getElementById('breakEvenValue').textContent = breakEvenRoas.toFixed(2);
    const breakEvenNote = document.getElementById('breakEvenNote');
    if (profitMargin > 0) {
        if (roas > breakEvenRoas) {
            breakEvenNote.textContent = '✅ Above break-even';
            breakEvenNote.style.color = 'var(--success-color)';
        } else {
            breakEvenNote.textContent = '⚠️ Below break-even';
            breakEvenNote.style.color = 'var(--danger-color)';
        }
    } else {
        breakEvenNote.textContent = 'Add profit margin to calculate';
        breakEvenNote.style.color = 'var(--text-secondary)';
    }
    
    // Generate insights
    generateInsights(data);
    
    // Always show benchmark (will show general if no specific industry selected)
    displayBenchmark(roas, industry || 'general');
    
    // Generate action items
    generateActionItems(data);
}

// Update rating
function updateRating(roas) {
    let rating, badge, percentage;
    
    if (roas < 1) {
        rating = 'Poor';
        badge = 'Needs Improvement';
        percentage = (roas / 1) * 20;
    } else if (roas < 2) {
        rating = 'Fair';
        badge = 'Fair';
        percentage = 20 + ((roas - 1) / 1) * 20;
    } else if (roas < 3) {
        rating = 'Good';
        badge = 'Good';
        percentage = 40 + ((roas - 2) / 1) * 20;
    } else if (roas < 4) {
        rating = 'Great';
        badge = 'Great';
        percentage = 60 + ((roas - 3) / 1) * 20;
    } else {
        rating = 'Excellent';
        badge = 'Excellent';
        percentage = 80 + Math.min(((roas - 4) / 4) * 20, 20);
    }
    
    document.getElementById('scoreBadge').textContent = badge;
    document.getElementById('ratingFill').style.width = `${Math.min(percentage, 100)}%`;
}

// Generate insights
function generateInsights(data) {
    const { roas, revenue, adSpend, profit, profitMargin, breakEvenRoas } = data;
    const insightsList = document.getElementById('insightsList');
    insightsList.innerHTML = '';
    
    const insights = [];
    
    // ROAS Performance Insight
    if (roas >= 4) {
        insights.push({
            icon: '🎉',
            title: 'Excellent Performance',
            description: `Your ROAS of ${roas.toFixed(2)} is outstanding! Your campaigns are highly profitable and efficient.`,
            type: 'success'
        });
    } else if (roas >= 2) {
        insights.push({
            icon: '👍',
            title: 'Good Performance',
            description: `Your ROAS of ${roas.toFixed(2)} is solid. There's room for optimization to increase returns.`,
            type: 'success'
        });
    } else if (roas >= 1) {
        insights.push({
            icon: '⚠️',
            title: 'Breaking Even',
            description: `Your ROAS of ${roas.toFixed(2)} means you're close to break-even. Focus on improving conversion rates and reducing costs.`,
            type: 'warning'
        });
    } else {
        insights.push({
            icon: '❌',
            title: 'Losing Money',
            description: `Your ROAS of ${roas.toFixed(2)} indicates you're spending more than you're earning. Immediate optimization is needed.`,
            type: 'danger'
        });
    }
    
    // Profitability Insight
    if (profitMargin > 0 && profit !== null) {
        if (roas > breakEvenRoas) {
            const profitPercent = ((profit / adSpend) * 100).toFixed(1);
            insights.push({
                icon: '💰',
                title: 'Profitable Campaign',
                description: `After considering your ${profitMargin}% profit margin, you're making a ${profitPercent}% return on your ad investment.`,
                type: 'success'
            });
        } else {
            insights.push({
                icon: '📉',
                title: 'Below Profit Threshold',
                description: `Your current ROAS (${roas.toFixed(2)}) is below your break-even ROAS (${breakEvenRoas.toFixed(2)}). You're not yet profitable after costs.`,
                type: 'danger'
            });
        }
    }
    
    // Efficiency Insight
    if (revenue > adSpend * 5) {
        insights.push({
            icon: '🚀',
            title: 'Highly Efficient Campaigns',
            description: 'Your campaigns are generating 5x or more revenue than spend. Consider scaling up your budget to maximize returns.',
            type: 'success'
        });
    }
    
    // Scale Recommendation
    if (roas >= 3 && roas < 10) {
        insights.push({
            icon: '📈',
            title: 'Scale Opportunity',
            description: 'Your ROAS is strong. Consider gradually increasing your ad spend by 20-30% to capture more revenue while maintaining efficiency.',
            type: 'success'
        });
    } else if (roas > 10) {
        insights.push({
            icon: '🎯',
            title: 'Untapped Potential',
            description: 'Your extremely high ROAS suggests you may be under-spending. There could be significant opportunity to scale and capture more market share.',
            type: 'success'
        });
    }
    
    // Render insights
    insights.forEach(insight => {
        const insightElement = document.createElement('div');
        insightElement.className = `insight-item ${insight.type}`;
        insightElement.innerHTML = `
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-description">${insight.description}</div>
            </div>
        `;
        insightsList.appendChild(insightElement);
    });
}

// Display benchmark
function displayBenchmark(roas, industry) {
    const benchmarkCard = document.getElementById('benchmarkCard');
    const industryRoas = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.general;
    
    benchmarkCard.style.display = 'block';
    
    // Always update with actual ROAS value
    document.getElementById('yourRoasBenchmark').textContent = roas.toFixed(1);
    document.getElementById('industryRoasBenchmark').textContent = industryRoas.toFixed(1);
    
    const benchmarkNote = document.getElementById('benchmarkNote');
    const difference = ((roas - industryRoas) / industryRoas * 100).toFixed(1);
    
    if (roas > industryRoas) {
        benchmarkNote.innerHTML = `<strong>Great job!</strong> You're performing ${Math.abs(difference)}% above the ${getIndustryName(industry)} industry average.`;
        benchmarkNote.style.background = 'rgba(16, 185, 129, 0.1)';
        benchmarkNote.style.color = 'var(--success-color)';
    } else if (roas === industryRoas) {
        benchmarkNote.innerHTML = `You're performing at the ${getIndustryName(industry)} industry average.`;
        benchmarkNote.style.background = 'var(--bg-secondary)';
        benchmarkNote.style.color = 'var(--text-secondary)';
    } else {
        benchmarkNote.innerHTML = `You're performing ${Math.abs(difference)}% below the ${getIndustryName(industry)} industry average. There's room for improvement.`;
        benchmarkNote.style.background = 'rgba(245, 158, 11, 0.1)';
        benchmarkNote.style.color = 'var(--warning-color)';
    }
}

// Get industry name
function getIndustryName(industry) {
    const names = {
        general: 'General',
        ecommerce: 'E-commerce',
        saas: 'SaaS',
        finance: 'Finance & Insurance',
        realestate: 'Real Estate',
        automotive: 'Automotive',
        education: 'Education',
        healthcare: 'Healthcare',
        travel: 'Travel & Hospitality',
        retail: 'Retail',
        b2b: 'B2B Services'
    };
    return names[industry] || 'General';
}

// Generate action items
function generateActionItems(data) {
    const { roas, profitMargin, conversions, cpa } = data;
    const actionsList = document.getElementById('actionsList');
    actionsList.innerHTML = '';
    
    const actions = [];
    
    if (roas < 2) {
        actions.push({
            icon: '🎯',
            title: 'Improve Targeting',
            description: 'Review your audience targeting. Focus on high-intent audiences and exclude underperforming segments.'
        });
        actions.push({
            icon: '✍️',
            title: 'Optimize Ad Creative',
            description: 'Test new ad copy and visuals. A/B test different messaging to improve click-through and conversion rates.'
        });
        actions.push({
            icon: '💰',
            title: 'Review Bidding Strategy',
            description: 'Adjust your bidding strategy. Consider switching to target ROAS or value-based bidding.'
        });
    } else if (roas < 4) {
        actions.push({
            icon: '🔄',
            title: 'Optimize Conversion Funnel',
            description: 'Analyze your landing pages and checkout process. Remove friction points to increase conversion rates.'
        });
        actions.push({
            icon: '📱',
            title: 'Expand to High-Performing Channels',
            description: 'Identify your best-performing ad channels and consider allocating more budget to them.'
        });
    } else {
        actions.push({
            icon: '📈',
            title: 'Scale Winning Campaigns',
            description: 'Your campaigns are performing well. Gradually increase budget on top performers to maximize returns.'
        });
        actions.push({
            icon: '🧪',
            title: 'Test New Audiences',
            description: 'Experiment with lookalike audiences or new demographics to expand your reach while maintaining efficiency.'
        });
    }
    
    // Always include these
    actions.push({
        icon: '📊',
        title: 'Track & Measure',
        description: 'Continuously monitor your ROAS. Set up automated reports and alerts for significant changes in performance.'
    });
    
    if (!profitMargin || profitMargin === 0) {
        actions.push({
            icon: '💡',
            title: 'Calculate True Profitability',
            description: 'Add your profit margin in the advanced options to understand your true return after costs.'
        });
    }
    
    if (!conversions || conversions === 0) {
        actions.push({
            icon: '🎯',
            title: 'Track Conversions',
            description: 'Add conversion tracking in the advanced options to calculate your Cost Per Acquisition (CPA).'
        });
    }
    
    // Render actions
    actions.forEach(action => {
        const actionElement = document.createElement('div');
        actionElement.className = 'action-item';
        actionElement.innerHTML = `
            <div class="action-icon">${action.icon}</div>
            <div class="action-content">
                <div class="action-title">${action.title}</div>
                <div class="action-description">${action.description}</div>
            </div>
        `;
        actionsList.appendChild(actionElement);
    });
}

// Format currency
function formatCurrency(amount, symbol) {
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Reset calculator
function resetCalculator() {
    roasForm.reset();
    resultsSection.style.display = 'none';
    advancedFields.classList.remove('show');
    advancedToggle.classList.remove('active');
    updateCurrencySymbols();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add input formatting for better UX
[adSpendInput, revenueInput].forEach(input => {
    input.addEventListener('input', function(e) {
        // Remove any non-numeric characters except decimal point
        let value = e.target.value.replace(/[^\d.]/g, '');
        
        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        e.target.value = value;
    });
});

// Add keyboard shortcut for quick calculation (Enter)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT') {
            e.preventDefault();
            roasForm.dispatchEvent(new Event('submit'));
        }
    }
});

