class DashboardManager {
  constructor() {
    this.timeRange = 'week';
    this.categoryFilter = 'all';
    this.charts = {};
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.initializeCharts();
    this.generateInsights();
  }

  async loadData() {
    try {
      const result = await chrome.storage.local.get(['timeData', 'dailyData']);
      this.timeData = result.timeData || {};
      this.dailyData = result.dailyData || {};
      
      this.updateDashboard();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  setupEventListeners() {
    // Time range selector
    document.getElementById('timeRange').addEventListener('change', (e) => {
      this.timeRange = e.target.value;
      this.updateDashboard();
    });

    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      this.categoryFilter = e.target.value;
      this.updateWebsitesList();
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportData();
    });

    // Generate report button
    document.getElementById('generateReport').addEventListener('click', () => {
      this.generateWeeklyReport();
    });

    // Chart toggles
    document.querySelectorAll('.chart-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        document.querySelectorAll('.chart-toggle').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.updateDailyChart(e.target.dataset.chart);
      });
    });

    // Modal controls
    document.querySelector('.modal-close').addEventListener('click', () => {
      document.getElementById('reportModal').style.display = 'none';
    });

    document.getElementById('downloadReport').addEventListener('click', () => {
      this.downloadReport();
    });

    document.getElementById('shareReport').addEventListener('click', () => {
      this.shareReport();
    });
  }

  updateDashboard() {
    const filteredData = this.getFilteredData();
    this.updateStats(filteredData);
    this.updateWebsitesList();
    this.updateCharts(filteredData);
  }

  getFilteredData() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let startDate;
    switch (this.timeRange) {
      case 'today':
        startDate = today;
        break;
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    const filtered = {};
    Object.entries(this.dailyData).forEach(([date, sites]) => {
      const dateObj = new Date(date);
      if (dateObj >= startDate) {
        filtered[date] = sites;
      }
    });

    return filtered;
  }

  updateStats(filteredData) {
    let totalTime = 0;
    let productiveTime = 0;
    let focusSessions = 0;

    // Calculate stats from filtered data
    Object.values(filteredData).forEach(dailySites => {
      Object.entries(dailySites).forEach(([domain, time]) => {
        totalTime += time;
        const category = this.timeData[domain]?.category;
        
        if (category?.type === 'productive') {
          productiveTime += time;
        }

        // Count focus sessions (25+ minutes)
        if (time >= 25 * 60 * 1000) {
          focusSessions++;
        }
      });
    });

    // Update UI
    document.getElementById('totalTime').textContent = this.formatTime(totalTime);
    document.getElementById('productiveTime').textContent = this.formatTime(productiveTime);
    document.getElementById('focusSessions').textContent = focusSessions;

    // Calculate weekly score
    const score = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;
    document.getElementById('weeklyScore').textContent = `${score}%`;

    // Update trend (mock data for demo)
    const trend = Math.random() > 0.5 ? '+' : '-';
    const trendValue = Math.floor(Math.random() * 10) + 1;
    document.getElementById('weeklyTrend').textContent = `${trend}${trendValue}%`;
  }

  updateWebsitesList() {
    const container = document.getElementById('websitesList');
    
    // Aggregate data across all time periods
    const siteStats = {};
    Object.values(this.dailyData).forEach(dailySites => {
      Object.entries(dailySites).forEach(([domain, time]) => {
        if (!siteStats[domain]) {
          siteStats[domain] = { totalTime: 0, visits: 0 };
        }
        siteStats[domain].totalTime += time;
        siteStats[domain].visits += 1;
      });
    });

    // Filter by category if needed
    let filteredSites = Object.entries(siteStats);
    if (this.categoryFilter !== 'all') {
      filteredSites = filteredSites.filter(([domain]) => {
        const category = this.timeData[domain]?.category;
        return category?.type === this.categoryFilter;
      });
    }

    // Sort by total time
    filteredSites.sort(([,a], [,b]) => b.totalTime - a.totalTime);

    if (filteredSites.length === 0) {
      container.innerHTML = '<div class="loading">No websites found</div>';
      return;
    }

    container.innerHTML = filteredSites.slice(0, 10).map(([domain, stats]) => {
      const siteData = this.timeData[domain] || {};
      const category = siteData.category || { type: 'neutral', category: 'Other' };
      
      return `
        <div class="website-item">
          <div class="website-info">
            <img class="website-favicon" src="https://www.google.com/s2/favicons?domain=${domain}" alt="${domain}">
            <div class="website-details">
              <h4>${this.formatDomain(domain)}</h4>
              <p>
                <span class="category-badge ${category.type}">${category.category}</span>
              </p>
            </div>
          </div>
          <div class="website-stats">
            <div class="website-time">${this.formatTime(stats.totalTime)}</div>
            <div class="website-visits">${stats.visits} visits</div>
          </div>
        </div>
      `;
    }).join('');
  }

  initializeCharts() {
    // Daily Activity Chart
    const dailyCtx = document.getElementById('dailyChart').getContext('2d');
    this.charts.daily = new Chart(dailyCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Time Spent',
          data: [],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => this.formatTime(value * 60000)
            }
          }
        }
      }
    });

    // Category Breakdown Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    this.charts.category = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#10B981',
            '#EF4444',
            '#6B7280',
            '#F59E0B',
            '#8B5CF6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  updateCharts(filteredData) {
    this.updateDailyChart('time');
    this.updateCategoryChart(filteredData);
  }

  updateDailyChart(type) {
    const last7Days = [];
    const data = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toDateString();
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

      const dayData = this.dailyData[dateStr] || {};
      let dayTotal = 0;
      let dayProductive = 0;

      Object.entries(dayData).forEach(([domain, time]) => {
        dayTotal += time;
        const category = this.timeData[domain]?.category;
        if (category?.type === 'productive') {
          dayProductive += time;
        }
      });

      if (type === 'time') {
        data.push(Math.round(dayTotal / 60000)); // Convert to minutes
      } else {
        const score = dayTotal > 0 ? (dayProductive / dayTotal) * 100 : 0;
        data.push(Math.round(score));
      }
    }

    this.charts.daily.data.labels = last7Days;
    this.charts.daily.data.datasets[0].data = data;
    this.charts.daily.data.datasets[0].label = type === 'time' ? 'Time Spent (minutes)' : 'Productivity Score (%)';
    this.charts.daily.update();
  }

  updateCategoryChart(filteredData) {
    const categories = {};
    
    Object.values(filteredData).forEach(dailySites => {
      Object.entries(dailySites).forEach(([domain, time]) => {
        const category = this.timeData[domain]?.category?.category || 'Other';
        categories[category] = (categories[category] || 0) + time;
      });
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories).map(time => Math.round(time / 60000)); // Convert to minutes

    this.charts.category.data.labels = labels;
    this.charts.category.data.datasets[0].data = data;
    this.charts.category.update();
  }

  generateInsights() {
    const insights = this.calculateInsights();
    const container = document.getElementById('insightsGrid');
    
    if (insights.length === 0) {
      container.innerHTML = '<div class="loading">Not enough data for insights</div>';
      return;
    }

    container.innerHTML = insights.map(insight => `
      <div class="insight-card">
        <h4>${insight.title}</h4>
        <p>${insight.description}</p>
      </div>
    `).join('');
  }

  calculateInsights() {
    const insights = [];
    
    // Calculate total time and productive time
    let totalTime = 0;
    let productiveTime = 0;
    const siteTimes = {};

    Object.values(this.dailyData).forEach(dailySites => {
      Object.entries(dailySites).forEach(([domain, time]) => {
        totalTime += time;
        siteTimes[domain] = (siteTimes[domain] || 0) + time;
        
        const category = this.timeData[domain]?.category;
        if (category?.type === 'productive') {
          productiveTime += time;
        }
      });
    });

    if (totalTime === 0) return insights;

    // Insight 1: Most used site
    const topSite = Object.entries(siteTimes).sort(([,a], [,b]) => b - a)[0];
    if (topSite) {
      insights.push({
        title: 'Most Visited Site',
        description: `You spend the most time on ${this.formatDomain(topSite[0])}, averaging ${this.formatTime(topSite[1])} per session.`
      });
    }

    // Insight 2: Productivity score
    const productivityScore = Math.round((productiveTime / totalTime) * 100);
    let scoreMessage = '';
    if (productivityScore >= 70) {
      scoreMessage = 'Excellent! You maintain high productivity levels.';
    } else if (productivityScore >= 50) {
      scoreMessage = 'Good productivity, but there\'s room for improvement.';
    } else {
      scoreMessage = 'Consider focusing more time on productive activities.';
    }

    insights.push({
      title: 'Productivity Analysis',
      description: `Your productivity score is ${productivityScore}%. ${scoreMessage}`
    });

    // Insight 3: Peak usage time (mock data for demo)
    insights.push({
      title: 'Peak Activity Time',
      description: 'You\'re most active between 2 PM - 4 PM. Consider scheduling important tasks during this time.'
    });

    // Insight 4: Weekly pattern
    const days = Object.keys(this.dailyData).length;
    if (days >= 7) {
      insights.push({
        title: 'Weekly Pattern',
        description: 'Your screen time is consistent throughout the week, with slightly higher usage on weekdays.'
      });
    }

    return insights;
  }

  generateWeeklyReport() {
    const report = this.createWeeklyReportData();
    const modalContent = document.getElementById('modalReportContent');
    
    modalContent.innerHTML = `
      <div class="report-summary">
        <h4>Weekly Summary</h4>
        <div class="report-stats">
          <div class="report-stat">
            <span class="report-label">Total Screen Time</span>
            <span class="report-value">${this.formatTime(report.totalTime)}</span>
          </div>
          <div class="report-stat">
            <span class="report-label">Productive Time</span>
            <span class="report-value">${this.formatTime(report.productiveTime)}</span>
          </div>
          <div class="report-stat">
            <span class="report-label">Productivity Score</span>
            <span class="report-value">${report.productivityScore}%</span>
          </div>
        </div>
      </div>
      
      <div class="report-section">
        <h4>Top Categories</h4>
        <div class="report-categories">
          ${report.topCategories.map(cat => `
            <div class="report-category">
              <span class="category-name">${cat.name}</span>
              <span class="category-time">${this.formatTime(cat.time)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="report-section">
        <h4>Recommendations</h4>
        <ul class="report-recommendations">
          ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    `;
    
    document.getElementById('reportModal').style.display = 'block';
  }

  createWeeklyReportData() {
    const last7Days = this.getLastNDaysData(7);
    let totalTime = 0;
    let productiveTime = 0;
    const categories = {};

    Object.values(last7Days).forEach(dailySites => {
      Object.entries(dailySites).forEach(([domain, time]) => {
        totalTime += time;
        const category = this.timeData[domain]?.category;
        
        if (category) {
          categories[category.category] = (categories[category.category] || 0) + time;
          if (category.type === 'productive') {
            productiveTime += time;
          }
        }
      });
    });

    const productivityScore = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;
    const topCategories = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, time]) => ({ name, time }));

    const recommendations = this.generateRecommendations(productivityScore, totalTime);

    return {
      totalTime,
      productiveTime,
      productivityScore,
      topCategories,
      recommendations
    };
  }

  generateRecommendations(score, totalTime) {
    const recommendations = [];
    
    if (score < 50) {
      recommendations.push('Consider using website blockers during work hours to reduce distractions.');
      recommendations.push('Try the Pomodoro Technique: 25 minutes of focused work followed by 5-minute breaks.');
    }
    
    if (totalTime > 8 * 60 * 60 * 1000) { // More than 8 hours
      recommendations.push('Your screen time is quite high. Consider taking regular breaks to rest your eyes.');
    }
    
    if (score >= 70) {
      recommendations.push('Great job maintaining high productivity! Keep up the good work.');
    }
    
    recommendations.push('Set specific times for checking social media to maintain focus.');
    recommendations.push('Use the dashboard regularly to track your progress and stay motivated.');

    return recommendations;
  }

  getLastNDaysData(n) {
    const data = {};
    const now = new Date();
    
    for (let i = 0; i < n; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toDateString();
      if (this.dailyData[dateStr]) {
        data[dateStr] = this.dailyData[dateStr];
      }
    }
    
    return data;
  }

  async exportData() {
    try {
      const data = {
        timeData: this.timeData,
        dailyData: this.dailyData,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `productivity-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }

  downloadReport() {
    // Mock PDF download functionality
    console.log('PDF download functionality would be implemented here');
    alert('PDF download feature coming soon!');
  }

  shareReport() {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Weekly Productivity Report',
        text: 'Check out my productivity stats from ProductiveFocus!',
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText('Check out my productivity report from ProductiveFocus!');
      alert('Report link copied to clipboard!');
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DashboardManager();
});