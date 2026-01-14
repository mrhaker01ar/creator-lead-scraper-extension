// Instagram Auto-Scraper - Collects data in real-time

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
  console.log('Instagram Auto-Scraper initialized');
  
  // Check if we're on a profile page
  if (window.location.pathname.match(/^\/[^\/]+\/?$/)) {
    setTimeout(() => {
      scrapeProfile();
    }, 2000);
  }
  
  // Add manual save button
  addSaveButton();
  
  // Monitor for navigation changes
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (url.match(/^https:\/\/www\.instagram\.com\/[^\/]+\/?$/)) {
        setTimeout(() => {
          if (settings.autoScrape) {
            scrapeProfile();
          }
        }, 2000);
      }
    }
  }).observe(document, { subtree: true, childList: true });
}

// Scrape Instagram profile
function scrapeProfile() {
  if (isProcessing) return;
  isProcessing = true;
  
  try {
    const username = window.location.pathname.split('/')[1];
    
    // Extract follower count
    const followersElement = document.querySelector('a[href*="followers"] span') || 
                            document.querySelector('meta[property="og:description"]');
    let followersText = followersElement?.textContent || followersElement?.content || '0';
    const followers = parseFollowerCount(followersText);
    
    // Check if within target range
    if (followers < settings.minFollowers || followers > settings.maxFollowers) {
      console.log(`Skipped: ${username} (${followers} followers - outside range)`);
      isProcessing = false;
      return;
    }
    
    // Extract other data
    const nameElement = document.querySelector('header section h2') || 
                       document.querySelector('h1');
    const bioElement = document.querySelector('header section div span') ||
                      document.querySelector('div._aa_c span');
    const postsElement = document.querySelector('header section ul li span');
    const isVerified = document.querySelector('svg[aria-label="Verified"]') !== null;
    
    const leadData = {
      platform: 'Instagram',
      username: username,
      name: nameElement?.textContent || '',
      followers: followers,
      followersText: followersText,
      bio: bioElement?.textContent || '',
      posts: postsElement?.textContent || '0',
      isVerified: isVerified,
      url: window.location.href,
      profilePicture: document.querySelector('img[alt*="profile picture"]')?.src || '',
      scrapedAt: new Date().toISOString(),
      autoScraped: true
    };
    
    // Check if bio matches target niches
    const bioLower = leadData.bio.toLowerCase();
    const matchesNiche = settings.targetNiches.some(niche => 
      bioLower.includes(niche.toLowerCase())
    );
    
    if (matchesNiche || settings.targetNiches.length === 0) {
      // Save lead
      chrome.runtime.sendMessage({
        action: 'saveLead',
        data: leadData
      }, (response) => {
        if (response.success) {
          console.log('✅ Auto-saved:', username);
          showNotification('✅ Lead Saved!', username);
        }
      });
    } else {
      console.log(`Skipped: ${username} (niche doesn't match)`);
    }
    
  } catch (error) {
    console.error('Scraping error:', error);
  }
  
  isProcessing = false;
}

// Parse follower count (handles K, M, etc.)
function parseFollowerCount(text) {
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
    scrapeProfile();
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