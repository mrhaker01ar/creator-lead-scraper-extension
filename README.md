# 🤖 AI Creator Lead Scraper - Chrome Extension

**Automatically collect Instagram & YouTube creator data in real-time as you browse!**

This Chrome extension uses AI-powered filtering to automatically scrape and save creator profiles that match your target criteria. Perfect for video editors, agencies, and anyone looking to build a client list.

---

## ✨ Features

- ✅ **Auto-Scraping**: Automatically collects data as you browse Instagram/YouTube
- ✅ **Smart Filtering**: Only saves creators within your follower/subscriber range
- ✅ **Niche Targeting**: Filters by keywords in bio/description
- ✅ **Real-time Notifications**: Get notified when new leads are saved
- ✅ **Manual Save Button**: Click to save any profile manually
- ✅ **CSV Export**: Export all leads to spreadsheet
- ✅ **Duplicate Detection**: Prevents saving the same creator twice
- ✅ **Beautiful Dashboard**: View stats and recent leads

---

## 🚀 Installation

### Step 1: Download the Extension

**Option A: Clone from GitHub**
```bash
git clone https://github.com/mrhaker01ar/creator-lead-scraper-extension.git
```

**Option B: Download ZIP**
1. Click the green "Code" button above
2. Select "Download ZIP"
3. Extract the ZIP file to a folder

### Step 2: Add Icons (Required)

Create 3 icon files in the extension folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

**Quick way:** Use any logo/icon and resize it, or use this free tool:
- Go to https://www.favicon-generator.org/
- Upload any image
- Download all sizes
- Rename them to match above

### Step 3: Install in Chrome

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the folder containing the extension files
5. Done! 🎉

---

## 📖 How to Use

### Auto-Scraping Mode (Recommended)

1. **Configure Settings**:
   - Click the extension icon in Chrome toolbar
   - Set your target follower/subscriber range (default: 1K-100K)
   - Make sure "Auto-Scrape" is ON (enabled by default)

2. **Browse Normally**:
   - Go to Instagram or YouTube
   - Visit any creator profile
   - Extension automatically detects and saves qualifying leads
   - You'll see a notification when a lead is saved

3. **View Your Leads**:
   - Click extension icon to see dashboard
   - View total leads, Instagram count, YouTube count
   - See recent leads with profile links

4. **Export Data**:
   - Click "📥 Export CSV" button
   - Opens in Excel/Google Sheets
   - Contains: Platform, Name, Followers, Bio, URL, etc.

### Manual Save Mode

If you prefer manual control:

1. Turn OFF "Auto-Scrape" in settings
2. Browse Instagram/YouTube profiles
3. Click the **"💾 Save Lead"** button (appears on every profile)
4. Lead is saved instantly

---

## ⚙️ Settings

### Min/Max Followers
- **Default**: 1,000 - 100,000
- **Purpose**: Only save creators within this range
- **Example**: Set 5K-50K for mid-tier creators

### Auto-Scrape Toggle
- **ON**: Automatically saves qualifying profiles
- **OFF**: Only saves when you click "Save Lead" button

### Target Niches (in code)
Edit `background.js` line 12 to customize:
```javascript
targetNiches: ['content creator', 'video', 'podcast', 'vlog', 'tutorial']
```

---

## 📊 What Data is Collected?

### Instagram Profiles
- Username
- Full Name
- Follower Count
- Bio
- Post Count
- Verification Status
- Profile Picture URL
- Profile URL

### YouTube Channels
- Channel Name
- Handle (@username)
- Subscriber Count
- Description
- Video Count (if available)
- Channel Avatar URL
- Channel URL

---

## 💡 Pro Tips

### Finding Quality Leads

**Instagram:**
1. Search hashtags: `#contentcreator` `#smallyoutuber` `#videocreator`
2. Click "Recent" tab
3. Browse profiles - extension auto-saves qualifying ones
4. Aim for 20-30 profiles per session

**YouTube:**
1. Search: "podcast" or "vlog" or your niche
2. Filter by "This week" or "This month"
3. Click on channels from video results
4. Extension auto-saves channels in your range

### Best Practices

- **Set realistic ranges**: 1K-100K is ideal for video editing clients
- **Check daily**: Browse 15-20 profiles per day
- **Export weekly**: Download CSV and add to your CRM
- **Follow up fast**: Contact leads within 24-48 hours
- **Personalize outreach**: Use the bio/description data for personalized DMs

---

## 🔧 Troubleshooting

### Extension not working?

1. **Refresh the page** after installing
2. **Check Developer mode** is enabled
3. **Reload extension**: Go to `chrome://extensions/` → Click reload icon
4. **Check console**: Right-click extension icon → Inspect popup → Check for errors

### Not auto-saving leads?

1. Make sure **Auto-Scrape is ON** in settings
2. Check if profile is **within your follower range**
3. Wait **2-3 seconds** after page loads
4. Try **manual save button** to test

### Button not appearing?

1. **Refresh the page**
2. **Wait 2-3 seconds** for page to fully load
3. Check if you're on a **profile page** (not feed/search)

---

## 📈 Expected Results

### Week 1
- Browse 20 profiles/day
- Collect 10-15 qualified leads
- Export to spreadsheet

### Week 2-4
- Build list of 100+ leads
- Start outreach campaigns
- Track responses in CRM

### Month 2+
- 300+ leads collected
- 5-10 discovery calls booked
- 2-4 new clients closed

---

## 🛡️ Privacy & Ethics

- ✅ Only collects **publicly available** data
- ✅ No passwords or private information
- ✅ Data stored **locally** in your browser
- ✅ You control what gets saved
- ✅ Respects platform terms of service

**Important**: Use responsibly and follow Instagram/YouTube terms of service. Don't spam or harass creators.

---

## 🔄 Updates

### Version 1.0.0 (Current)
- ✅ Auto-scraping for Instagram & YouTube
- ✅ Smart filtering by followers/subscribers
- ✅ Niche targeting
- ✅ CSV export
- ✅ Beautiful dashboard

### Planned Features
- 🔜 Email finder integration
- 🔜 Bulk export to Google Sheets
- 🔜 Advanced filtering (engagement rate, post frequency)
- 🔜 Auto-DM templates
- 🔜 CRM integration

---

## 🤝 Support

**Issues?** Open an issue on GitHub: https://github.com/mrhaker01ar/creator-lead-scraper-extension/issues

**Questions?** Contact: mimrhacker@gmail.com

---

## 📄 License

MIT License - Free to use and modify

---

## 🎯 Next Steps

1. ✅ Install the extension
2. ✅ Configure your settings
3. ✅ Browse 20 profiles today
4. ✅ Export your first CSV
5. ✅ Start reaching out to leads!

**Happy lead hunting! 🚀**