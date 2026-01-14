// YouTube Auto-Scraper - Collects channel data in real-time

let settings = {};
let isProcessing = false;

// Get settings from storage
chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
  settings = response.settings || {};
  if (settings.autoScrape) {
    initAutoScraper();
  }
});

// Initialize auto-scraper
function initAutoScraper() {
  console.log('YouTube Auto-Scraper initialized');
  
  // Check if we're on a channel page
  if (window.location.pathname.includes('/@') || window.location.pathname.includes('/channel/')) {
    setTimeout(() => {
      scrapeChannel();
    }, 3000);
  }
  
  // Add manual save button
  addSaveButton();
  
  // Monitor for navigation changes
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (url.includes('/@') || url.includes('/channel/')) {
        setTimeout(() => {
          if (settings.autoScrape) {
            scrapeChannel();
          }
        }, 3000);
      }
    }
  }).observe(document, { subtree: true, childList: true });
}

// Scrape YouTube channel
function scrapeChannel() {
  if (isProcessing) return;
  isProcessing = true;
  
  try {
    // Extract channel name
    const channelNameElement = document.querySelector('#channel-name #text') ||
                               document.querySelector('ytd-channel-name #text') ||
                               document.querySelector('#text.ytd-channel-name');
    const channelName = channelNameElement?.textContent?.trim() || '';
    
    // Extract subscriber count
    const subsElement = document.querySelector('#subscriber-count') ||
                       document.querySelector('yt-formatted-string#subscriber-count');
    let subsText = subsElement?.textContent?.trim() || '0';
    const subscribers = parseSubscriberCount(subsText);
    
    // Check if within target range
    if (subscribers < settings.minFollowers || subscribers > settings.maxFollowers) {
      console.log(`Skipped: ${channelName} (${subscribers} subs - outside range)`);
      isProcessing = false;
      return;
    }
    
    // Extract other data
    const descElement = document.querySelector('#description') ||
                       document.querySelector('yt-formatted-string.description');
    const handleElement = document.querySelector('#channel-handle') ||
                         document.querySelector('yt-formatted-string#channel-handle');
    
    // Get video count from about page or estimate
    const videoCountElement = document.querySelector('yt-formatted-string[aria-label*="video"]');
    
    const leadData = {
      platform: 'YouTube',
      channelName: channelName,
      handle: handleElement?.textContent?.trim() || '',
      subscribers: subscribers,
      subscribersText: subsText,
      description: descElement?.textContent?.trim() || '',
      videoCount: videoCountElement?.textContent?.trim() || 'Unknown',
      url: window.location.href,
      channelAvatar: document.querySelector('#avatar img')?.src || '',
      scrapedAt: new Date().toISOString(),
      autoScraped: true
    };
    
    // Check if description matches target niches
    const descLower = leadData.description.toLowerCase();
    const matchesNiche = settings.targetNiches.some(niche => 
      descLower.includes(niche.toLowerCase()) || 
      channelName.toLowerCase().includes(niche.toLowerCase())
    );
    
    if (matchesNiche || settings.targetNiches.length === 0) {
      // Save lead
      chrome.runtime.sendMessage({
        action: 'saveLead',
        data: leadData
      }, (response) => {
        if (response.success) {
          console.log('✅ Auto-saved:', channelName);
          showNotification('✅ Lead Saved!', channelName);
        }
      });
    } else {
      console.log(`Skipped: ${channelName} (niche doesn't match)`);
    }
    
  } catch (error) {
    console.error('Scraping error:', error);
  }
  
  isProcessing = false;
}

// Parse subscriber count (handles K, M, etc.)
function parseSubscriberCount(text) {
  if (!text) return 0;
  
  const match = text.match(/[\d,\.]+[KMB]?/i);
  if (!match) return 0;
  
  let num = match[0].replace(/,/g, '');
  const multiplier = num.slice(-1).toUpperCase();
  
  if (multiplier === 'K') {
    return parseFloat(num) * 1000;
  } else if (multiplier === 'M') {
    return parseFloat(num) * 1000000;
  } else if (multiplier === 'B') {
    return parseFloat(num) * 1000000000;
  }
  
  return parseFloat(num) || 0;
}

// Add manual save button
function addSaveButton() {
  if (document.getElementById('ai-scraper-btn')) return;
  
  const button = document.createElement('button');
  button.id = 'ai-scraper-btn';
  button.innerHTML = '💾 Save Lead';
  button.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
  `;
  
  button.onmouseover = () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
  };
  
  button.onmouseout = () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
  };
  
  button.onclick = () => {
    scrapeChannel();
    button.innerHTML = '✅ Saved!';
    setTimeout(() => {
      button.innerHTML = '💾 Save Lead';
    }, 2000);
  };
  
  document.body.appendChild(button);
}

// Show notification
function showNotification(title, message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    border-left: 4px solid #667eea;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `
    <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${title}</div>
    <div style="color: #666; font-size: 14px;">${message}</div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);