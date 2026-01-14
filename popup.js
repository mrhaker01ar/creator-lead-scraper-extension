// Popup functionality for AI Creator Lead Scraper

// Load data on popup open
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadLeads();
  loadSettings();
  
  // Event listeners
  document.getElementById('auto-scrape').addEventListener('change', saveSettings);
  document.getElementById('min-followers').addEventListener('change', saveSettings);
  document.getElementById('max-followers').addEventListener('change', saveSettings);
  document.getElementById('export-btn').addEventListener('click', exportToCSV);
  document.getElementById('clear-btn').addEventListener('click', clearAllLeads);
  
  // Refresh every 2 seconds
  setInterval(() => {
    loadStats();
    loadLeads();
  }, 2000);
});

// Load statistics
function loadStats() {
  chrome.storage.local.get(['stats'], (result) => {
    const stats = result.stats || { totalScraped: 0, instagramCount: 0, youtubeCount: 0 };
    
    document.getElementById('total-leads').textContent = stats.totalScraped || 0;
    document.getElementById('instagram-count').textContent = stats.instagramCount || 0;
    document.getElementById('youtube-count').textContent = stats.youtubeCount || 0;
  });
}

// Load leads
function loadLeads() {
  chrome.storage.local.get(['leads'], (result) => {
    const leads = result.leads || [];
    const container = document.getElementById('leads-container');
    
    if (leads.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <p>No leads yet. Browse Instagram or YouTube profiles!</p>
        </div>
      `;
      return;
    }
    
    // Show latest 10 leads
    const recentLeads = leads.slice(-10).reverse();
    
    container.innerHTML = recentLeads.map(lead => {
      const name = lead.username || lead.channelName || 'Unknown';
      const followers = lead.followersText || lead.subscribersText || '0';
      const platform = lead.platform || 'Unknown';
      const url = lead.url || '#';
      const autoTag = lead.autoScraped ? ' 🤖' : '';
      
      return `
        <div class="lead-item">
          <span class="platform">${platform}${autoTag}</span>
          <div class="name">${name}</div>
          <div class="followers">👥 ${followers}</div>
          <a href="${url}" target="_blank">View Profile →</a>
        </div>
      `;
    }).join('');
  });
}

// Load settings
function loadSettings() {
  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || {
      autoScrape: true,
      minFollowers: 1000,
      maxFollowers: 100000
    };
    
    document.getElementById('auto-scrape').checked = settings.autoScrape;
    document.getElementById('min-followers').value = settings.minFollowers;
    document.getElementById('max-followers').value = settings.maxFollowers;
  });
}

// Save settings
function saveSettings() {
  const settings = {
    autoScrape: document.getElementById('auto-scrape').checked,
    minFollowers: parseInt(document.getElementById('min-followers').value) || 1000,
    maxFollowers: parseInt(document.getElementById('max-followers').value) || 100000,
    targetNiches: ['content creator', 'video', 'podcast', 'vlog']
  };
  
  chrome.storage.local.set({ settings }, () => {
    // Show saved indicator
    const autoScrapeToggle = document.querySelector('.toggle');
    const originalBg = autoScrapeToggle.style.background;
    autoScrapeToggle.style.background = '#d4edda';
    setTimeout(() => {
      autoScrapeToggle.style.background = originalBg;
    }, 500);
  });
}

// Export to CSV
function exportToCSV() {
  chrome.storage.local.get(['leads'], (result) => {
    const leads = result.leads || [];
    
    if (leads.length === 0) {
      alert('No leads to export!');
      return;
    }
    
    // Create CSV content
    let csv = 'Platform,Name,Username/Channel,Followers/Subs,Bio/Description,URL,Profile Picture,Scraped At,Auto Scraped\n';
    
    leads.forEach(lead => {
      const platform = lead.platform || '';
      const name = lead.name || '';
      const username = lead.username || lead.channelName || '';
      const followers = lead.followers || lead.subscribers || 0;
      const bio = (lead.bio || lead.description || '').replace(/"/g, '""');
      const url = lead.url || '';
      const picture = lead.profilePicture || lead.channelAvatar || '';
      const scrapedAt = lead.scrapedAt || '';
      const autoScraped = lead.autoScraped ? 'Yes' : 'No';
      
      csv += `"${platform}","${name}","${username}",${followers},"${bio}","${url}","${picture}","${scrapedAt}","${autoScraped}"\n`;
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `creator-leads-${date}.csv`;
    link.click();
    
    // Show success message
    const btn = document.getElementById('export-btn');
    const originalText = btn.textContent;
    btn.textContent = '✅ Exported!';
    btn.style.background = '#28a745';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
  });
}

// Clear all leads
function clearAllLeads() {
  if (confirm(`Are you sure you want to delete all leads?\n\nThis action cannot be undone!`)) {
    chrome.storage.local.set({
      leads: [],
      stats: {
        totalScraped: 0,
        instagramCount: 0,
        youtubeCount: 0,
        lastUpdated: new Date().toISOString()
      }
    }, () => {
      loadStats();
      loadLeads();
      
      // Show success message
      const btn = document.getElementById('clear-btn');
      const originalText = btn.textContent;
      btn.textContent = '✅ Cleared!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  }
}