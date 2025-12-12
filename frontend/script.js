/**
 * LinkedIn Engagement Extractor - Frontend Script
 * Handles form submission, API calls, and UI interactions
 */

// Configuration - Use relative URL for deployed version, localhost for development
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api',
    DEBOUNCE_DELAY: 300
};

// State
let currentProfiles = [];
let currentFilter = 'all';

// DOM Elements
const elements = {
    form: document.getElementById('extractForm'),
    postUrl: document.getElementById('postUrl'),
    submitBtn: document.getElementById('submitBtn'),
    messageSection: document.getElementById('messageSection'),
    messageBox: document.getElementById('messageBox'),
    resultsSection: document.getElementById('resultsSection'),
    resultsBody: document.getElementById('resultsBody'),
    totalCount: document.getElementById('totalCount'),
    reactionCount: document.getElementById('reactionCount'),
    commentCount: document.getElementById('commentCount'),
    downloadCsvBtn: document.getElementById('downloadCsvBtn'),
    copyAllBtn: document.getElementById('copyAllBtn'),
    searchInput: document.getElementById('searchInput'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    emptyState: document.getElementById('emptyState'),
    toast: document.getElementById('toast')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

/**
 * Set up all event listeners
 */
function initializeEventListeners() {
    // Form submission
    elements.form.addEventListener('submit', handleFormSubmit);
    
    // Download CSV
    elements.downloadCsvBtn.addEventListener('click', handleDownloadCsv);
    
    // Copy all URLs
    elements.copyAllBtn.addEventListener('click', handleCopyAllUrls);
    
    // Search filtering
    elements.searchInput.addEventListener('input', debounce(handleSearch, CONFIG.DEBOUNCE_DELAY));
    
    // Filter buttons
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilterChange(btn));
    });
    
    // URL input validation
    elements.postUrl.addEventListener('input', handleUrlInput);
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const postUrl = elements.postUrl.value.trim();
    
    if (!postUrl) {
        showMessage('Please enter a LinkedIn post URL', 'error');
        return;
    }
    
    // Set loading state
    setLoadingState(true);
    hideMessage();
    hideResults();
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/extract`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post_url: postUrl })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to extract engagement data');
        }
        
        if (data.success) {
            currentProfiles = data.data.profiles || [];
            displayResults(data.data);
            
            if (currentProfiles.length === 0) {
                showMessage(data.message || 'No engagement data found for this post.', 'warning');
            } else {
                if (data.demo_mode) {
                    showMessage('Demo Mode: Showing sample profiles. The actual API may require a different subscription tier for this post.', 'warning');
                }
                showToast(`Successfully extracted ${currentProfiles.length} profiles!`, 'success');
            }
        } else {
            throw new Error(data.error || 'Failed to extract data');
        }
        
    } catch (error) {
        console.error('Extraction error:', error);
        showMessage(error.message || 'An error occurred while extracting data', 'error');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Display extraction results
 */
function displayResults(data) {
    const { profiles, total_count, reaction_count, comment_count } = data;
    
    // Update stats
    updateStat(elements.totalCount, total_count || 0);
    updateStat(elements.reactionCount, reaction_count || 0);
    updateStat(elements.commentCount, comment_count || 0);
    
    // Show results section
    elements.resultsSection.style.display = 'block';
    
    // Render profiles
    renderProfiles(profiles);
}

/**
 * Animate stat number update
 */
function updateStat(element, value) {
    const valueEl = element.querySelector('.stat-value');
    animateNumber(valueEl, 0, value, 500);
}

/**
 * Animate number counting
 */
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const current = Math.round(start + range * easeProgress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Render profiles to table
 */
function renderProfiles(profiles) {
    elements.resultsBody.innerHTML = '';
    
    const filteredProfiles = filterProfiles(profiles);
    
    if (filteredProfiles.length === 0) {
        elements.emptyState.style.display = 'block';
        return;
    }
    
    elements.emptyState.style.display = 'none';
    
    filteredProfiles.forEach((profile, index) => {
        const row = createProfileRow(profile, index);
        elements.resultsBody.appendChild(row);
    });
}

/**
 * Create a table row for a profile
 */
function createProfileRow(profile, index) {
    const row = document.createElement('tr');
    row.style.animationDelay = `${index * 0.03}s`;
    row.classList.add('fade-in-row');
    
    const initials = getInitials(profile.name);
    const avatarContent = profile.profile_picture 
        ? `<img src="${escapeHtml(profile.profile_picture)}" alt="${escapeHtml(profile.name)}" onerror="this.parentElement.innerHTML='${initials}'">`
        : initials;
    
    const engagementIcon = profile.engagement_type === 'comment' 
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>';
    
    row.innerHTML = `
        <td class="col-avatar">
            <div class="profile-avatar">${avatarContent}</div>
        </td>
        <td class="col-name">
            <div class="profile-name">
                <a href="${escapeHtml(profile.profile_url)}" target="_blank" rel="noopener noreferrer">
                    ${escapeHtml(profile.name) || 'Unknown'}
                </a>
            </div>
        </td>
        <td class="col-headline">
            <div class="profile-headline" title="${escapeHtml(profile.headline)}">
                ${escapeHtml(profile.headline) || '-'}
            </div>
        </td>
        <td class="col-type">
            <span class="type-badge ${profile.engagement_type}">
                ${engagementIcon}
                ${profile.engagement_type === 'comment' ? 'Comment' : profile.reaction_type || 'Like'}
            </span>
        </td>
        <td class="col-actions">
            <div class="table-actions">
                <button class="icon-btn" onclick="copyToClipboard('${escapeHtml(profile.profile_url)}')" title="Copy URL">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                </button>
                <a href="${escapeHtml(profile.profile_url)}" target="_blank" rel="noopener noreferrer" class="icon-btn" title="Open Profile">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                </a>
            </div>
        </td>
    `;
    
    return row;
}

/**
 * Filter profiles based on search and filter type
 */
function filterProfiles(profiles) {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    
    return profiles.filter(profile => {
        // Filter by type
        if (currentFilter !== 'all' && profile.engagement_type !== currentFilter) {
            return false;
        }
        
        // Filter by search term
        if (searchTerm) {
            const searchableText = [
                profile.name,
                profile.headline,
                profile.profile_url,
                profile.comment_text
            ].filter(Boolean).join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm);
        }
        
        return true;
    });
}

/**
 * Handle search input
 */
function handleSearch() {
    renderProfiles(currentProfiles);
}

/**
 * Handle filter button click
 */
function handleFilterChange(btn) {
    elements.filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderProfiles(currentProfiles);
}

/**
 * Handle CSV download
 */
async function handleDownloadCsv() {
    if (currentProfiles.length === 0) {
        showToast('No profiles to download', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/download/csv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profiles: currentProfiles })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate CSV');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `linkedin_engagement_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        showToast('CSV downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        
        // Fallback: generate CSV client-side
        downloadCsvClientSide();
    }
}

/**
 * Generate and download CSV on client side (fallback)
 */
function downloadCsvClientSide() {
    const headers = ['Profile URL', 'Name', 'Headline', 'Engagement Type', 'Reaction Type', 'Comment'];
    const rows = currentProfiles.map(p => [
        p.profile_url || '',
        p.name || '',
        p.headline || '',
        p.engagement_type || '',
        p.reaction_type || '',
        p.comment_text || ''
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin_engagement_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    
    showToast('CSV downloaded successfully!', 'success');
}

/**
 * Copy all profile URLs to clipboard
 */
function handleCopyAllUrls() {
    if (currentProfiles.length === 0) {
        showToast('No URLs to copy', 'error');
        return;
    }
    
    const urls = currentProfiles.map(p => p.profile_url).join('\n');
    copyToClipboard(urls, true);
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text, showSuccessMessage = true) {
    try {
        await navigator.clipboard.writeText(text);
        if (showSuccessMessage) {
            showToast('Copied to clipboard!', 'success');
        }
    } catch (error) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        
        if (showSuccessMessage) {
            showToast('Copied to clipboard!', 'success');
        }
    }
}

/**
 * Handle URL input validation
 */
function handleUrlInput() {
    const value = elements.postUrl.value.trim();
    const isLinkedIn = /linkedin\.com\/(posts|feed|pulse)/i.test(value);
    
    if (value && !isLinkedIn) {
        elements.postUrl.style.borderColor = 'var(--warning)';
    } else {
        elements.postUrl.style.borderColor = '';
    }
}

/**
 * Show message in message section
 */
function showMessage(text, type = 'info') {
    const iconMap = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    };
    
    elements.messageBox.className = `message ${type}`;
    elements.messageBox.innerHTML = `
        <span class="message-icon">${iconMap[type] || ''}</span>
        <span class="message-text">${escapeHtml(text)}</span>
    `;
    elements.messageSection.style.display = 'block';
}

/**
 * Hide message section
 */
function hideMessage() {
    elements.messageSection.style.display = 'none';
}

/**
 * Hide results section
 */
function hideResults() {
    elements.resultsSection.style.display = 'none';
    currentProfiles = [];
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = elements.toast;
    toast.querySelector('.toast-message').textContent = message;
    toast.className = `toast ${type}`;
    
    // Trigger reflow for animation
    toast.offsetHeight;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Set loading state on submit button
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        elements.submitBtn.classList.add('loading');
        elements.submitBtn.disabled = true;
    } else {
        elements.submitBtn.classList.remove('loading');
        elements.submitBtn.disabled = false;
    }
}

/**
 * Get initials from name
 */
function getInitials(name) {
    if (!name) return '?';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in-row {
        animation: fadeInRow 0.3s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes fadeInRow {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

