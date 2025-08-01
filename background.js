// Background service worker for time tracking
class TimeTracker {
  constructor() {
    this.currentTab = null;
    this.startTime = null;
    this.isTracking = false;
    this.init();
  }

  init() {
    // Listen for tab changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabChange(activeInfo.tabId);
    });

    // Listen for tab updates (URL changes)
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.active) {
        this.handleTabChange(tabId);
      }
    });

    // Listen for window focus changes
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        this.stopTracking();
      } else {
        chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
          if (tabs[0]) {
            this.handleTabChange(tabs[0].id);
          }
        });
      }
    });

    // Get current active tab on startup
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        this.handleTabChange(tabs[0].id);
      }
    });
  }

  async handleTabChange(tabId) {
    // Stop tracking current tab
    await this.stopTracking();
    
    // Start tracking new tab
    chrome.tabs.get(tabId, (tab) => {
      if (tab && tab.url && !tab.url.startsWith('chrome://')) {
        this.startTracking(tab);
      }
    });
  }

  startTracking(tab) {
    this.currentTab = tab;
    this.startTime = Date.now();
    this.isTracking = true;
  }

  async stopTracking() {
    if (!this.isTracking || !this.currentTab || !this.startTime) {
      return;
    }

    const endTime = Date.now();
    const timeSpent = endTime - this.startTime;
    const domain = this.extractDomain(this.currentTab.url);

    // Only track if time spent is more than 1 second
    if (timeSpent > 1000) {
      await this.saveTimeData(domain, timeSpent, this.currentTab.title);
    }

    this.isTracking = false;
    this.currentTab = null;
    this.startTime = null;
  }

  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  }

  async saveTimeData(domain, timeSpent, title) {
    const today = new Date().toDateString();
    
    // Get existing data
    const result = await chrome.storage.local.get(['timeData', 'dailyData']);
    const timeData = result.timeData || {};
    const dailyData = result.dailyData || {};

    // Update total time for domain
    if (!timeData[domain]) {
      timeData[domain] = {
        totalTime: 0,
        visits: 0,
        lastVisit: Date.now(),
        title: title,
        category: this.categorizeWebsite(domain)
      };
    }

    timeData[domain].totalTime += timeSpent;
    timeData[domain].visits += 1;
    timeData[domain].lastVisit = Date.now();
    if (title) timeData[domain].title = title;

    // Update daily data
    if (!dailyData[today]) {
      dailyData[today] = {};
    }
    if (!dailyData[today][domain]) {
      dailyData[today][domain] = 0;
    }
    dailyData[today][domain] += timeSpent;

    // Save updated data
    await chrome.storage.local.set({ timeData, dailyData });
  }

  categorizeWebsite(domain) {
    const productiveCategories = {
      'github.com': 'Development',
      'stackoverflow.com': 'Development',
      'developer.mozilla.org': 'Development',
      'codepen.io': 'Development',
      'leetcode.com': 'Development',
      'hackerrank.com': 'Development',
      'docs.google.com': 'Productivity',
      'notion.so': 'Productivity',
      'trello.com': 'Productivity',
      'asana.com': 'Productivity',
      'slack.com': 'Communication',
      'zoom.us': 'Communication',
      'teams.microsoft.com': 'Communication',
      'gmail.com': 'Communication',
      'coursera.org': 'Learning',
      'udemy.com': 'Learning',
      'khanacademy.org': 'Learning',
      'edx.org': 'Learning'
    };

    const unproductiveCategories = {
      'facebook.com': 'Social Media',
      'instagram.com': 'Social Media',
      'twitter.com': 'Social Media',
      'tiktok.com': 'Social Media',
      'linkedin.com': 'Social Media',
      'youtube.com': 'Entertainment',
      'netflix.com': 'Entertainment',
      'twitch.tv': 'Entertainment',
      'reddit.com': 'Entertainment',
      'buzzfeed.com': 'Entertainment'
    };

    if (productiveCategories[domain]) {
      return { type: 'productive', category: productiveCategories[domain] };
    } else if (unproductiveCategories[domain]) {
      return { type: 'unproductive', category: unproductiveCategories[domain] };
    } else {
      return { type: 'neutral', category: 'Other' };
    }
  }
}

// Initialize time tracker
const timeTracker = new TimeTracker();

// Handle extension startup and shutdown
chrome.runtime.onStartup.addListener(() => {
  console.log('ProductiveFocus extension started');
});

chrome.runtime.onSuspend.addListener(() => {
  timeTracker.stopTracking();
});