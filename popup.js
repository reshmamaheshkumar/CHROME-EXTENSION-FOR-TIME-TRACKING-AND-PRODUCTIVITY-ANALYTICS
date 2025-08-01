class PopupManager {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadTodayData();
    this.setupEventListeners();
    this.startCurrentSessionTimer();
  }

  async loadTodayData() {
    try {
      const result = await chrome.storage.local.get(['dailyData', 'timeData']);
      const today = new Date().toDateString();
      const todayData = result.dailyData?.[today] || {};
      const timeData = result.timeData || {};

      this.displaySummaryStats(todayData, timeData);
      this.displayTopSites(todayData, timeData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  displaySummaryStats(todayData, timeData) {
    let productiveTime = 0;
    let unproductiveTime = 0;
    let totalTime = 0;

    Object.entries(todayData).forEach(([domain, time]) => {
      totalTime += time;
      const category = timeData[domain]?.category;
      
      if (category?.type === 'productive') {
        productiveTime += time;
      } else if (category?.type === 'unproductive') {
        unproductiveTime += time;
      }
    });

    // Update UI
    document.getElementById('productiveTime').textContent = this.formatTime(productiveTime);
    document.getElementById('unproductiveTime').textContent = this.formatTime(unproductiveTime);

    // Calculate productivity score
    const score = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;
    document.getElementById('scoreValue').textContent = `${score}%`;
    document.getElementById('scoreFill').style.width = `${score}%`;
  }

  displayTopSites(todayData, timeData) {
    const sitesContainer = document.getElementById('topSites');
    
    // Sort sites by time spent
    const sortedSites = Object.entries(todayData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    if (sortedSites.length === 0) {
      sitesContainer.innerHTML = '<div class="loading">No activity today</div>';
      return;
    }

    sitesContainer.innerHTML = sortedSites.map(([domain, time]) => {
      const siteData = timeData[domain] || {};
      const category = siteData.category || { type: 'neutral', category: 'Other' };
      
      return `
        <div class="site-item">
          <div class="site-info">
            <img class="site-favicon" src="https://www.google.com/s2/favicons?domain=${domain}" alt="${domain}">
            <div>
              <div class="site-name">${this.formatDomain(domain)}</div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span class="site-category ${category.type}">${category.category}</span>
            <span class="site-time">${this.formatTime(time)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  setupEventListeners() {
    document.getElementById('viewDashboard').addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });

    document.getElementById('exportData').addEventListener('click', async () => {
      await this.exportData();
    });
  }

  async exportData() {
    try {
      const result = await chrome.storage.local.get(['timeData', 'dailyData']);
      const dataBlob = new Blob([JSON.stringify(result, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `productivity-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }

  startCurrentSessionTimer() {
    const updateCurrentSession = async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0] && tabs[0].url && !tabs[0].url.startsWith('chrome://')) {
          const domain = this.extractDomain(tabs[0].url);
          document.getElementById('currentSite').textContent = this.formatDomain(domain);
        } else {
          document.getElementById('currentSite').textContent = 'No active site';
        }
      } catch (error) {
        document.getElementById('currentSite').textContent = 'Unknown';
      }
    };

    updateCurrentSession();
    setInterval(updateCurrentSession, 1000);

    // Update session timer
    let sessionSeconds = 0;
    setInterval(() => {
      sessionSeconds++;
      const minutes = Math.floor(sessionSeconds / 60);
      const seconds = sessionSeconds % 60;
      document.getElementById('sessionTime').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  }

  formatDomain(domain) {
    return domain.charAt(0).toUpperCase() + domain.slice(1).replace(/\..+/, '');
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${totalSeconds}s`;
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});