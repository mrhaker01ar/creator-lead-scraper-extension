// Background service worker for AI Creator Lead Scraper

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Creator Lead Scraper installed');
  
  // Set default settings
  chrome.storage.local.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.local.set({
        settings: {
          autoScrape: true,
          minFollowers: 1000,
          maxFollowers: 100000,
          targetNiches: ['content creator', 'video', 'podcast', 'vlog'],
          autoExport: false
        },
        leads: [],
        stats: {
          totalScraped: 0,
          instagramCount: 0,
          youtubeCount: 0,
          lastUpdated: new Date().toISOString()
        }
      });
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveLead') {
    saveLead(request.data);
    sendResponse({ success: true });
  } else if (request.action === 'getSettings') {
    chrome.storage.local.get(['settings'], (result) => {
      sendResponse({ settings: result.settings });
    });
    return true;
  } else if (request.action === 'updateStats') {
    updateStats(request.platform);
    sendResponse({ success: true });
  }
});

// Save lead to storage
function saveLead(leadData) {
  chrome.storage.local.get(['leads', 'stats'], (result) => {
    const leads = result.leads || [];
    const stats = result.stats || { totalScraped: 0, instagramCount: 0, youtubeCount: 0 };
    
    // Check for duplicates
    const isDuplicate = leads.some(lead => 
      lead.url === leadData.url || 
      (lead.username && lead.username === leadData.username)
    );
    
    if (!isDuplicate) {
      leads.push(leadData);
      stats.totalScraped++;
      
      if (leadData.platform === 'Instagram') {
        stats.instagramCount++;
      } else if (leadData.platform === 'YouTube') {
        stats.youtubeCount++;
      }
      
      stats.lastUpdated = new Date().toISOString();
      
      chrome.storage.local.set({ leads, stats });
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'New Lead Saved!',
        message: `${leadData.platform}: ${leadData.username || leadData.channelName}`,
        priority: 1
      });
    }
  });
}

// Update statistics
function updateStats(platform) {
  chrome.storage.local.get(['stats'], (result) => {
    const stats = result.stats || { totalScraped: 0, instagramCount: 0, youtubeCount: 0 };
    stats.lastUpdated = new Date().toISOString();
    chrome.storage.local.set({ stats });
  });
}