# 🕒 ProductiveFocus - Chrome Extension for Time Tracking and Productivity Analytics

A comprehensive Chrome extension that tracks time spent on websites and provides detailed productivity analytics with weekly reports.

## 📸 Screenshots
> 🧩 Popup View  
![Popup Screenshot](screenshots/popup-screenshot.png)

>> 📊 Dashboard Analytics  
![Dashboard Screenshot](screenshots/dashboard-screenshot.png)

## 🌟 Features

### Core Functionality
- **Real-time Website Tracking**: Automatically tracks time spent on all websites
- **Smart Categorization**: Classifies websites as productive, unproductive, or neutral
- **Activity Detection**: Detects user activity to ensure accurate time tracking
- **Local Data Storage**: All data stored locally using Chrome's storage API

### Analytics Dashboard
- **Daily/Weekly/Monthly Views**: Flexible time range analysis
- **Interactive Charts**: Visual representation of usage patterns
- **Productivity Scoring**: Calculate and track productivity percentages
- **Category Breakdown**: Detailed analysis by website categories
- **Top Sites Tracking**: Monitor most visited websites

### Productivity Insights
- **Focus Session Detection**: Identifies productive work sessions
- **Weekly Reports**: Comprehensive productivity summaries
- **Personalized Recommendations**: AI-driven suggestions for improvement
- **Trend Analysis**: Track productivity changes over time

### User Interface
- **Clean Popup Interface**: Quick access to daily stats
- **Comprehensive Dashboard**: Full-featured analytics page
- **Export Functionality**: Download data in JSON format
- **Responsive Design**: Works on all screen sizes

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your Chrome toolbar

## Usage

### Quick Access (Popup)
- Click the extension icon in the toolbar
- View today's productivity summary
- See current session information
- Access quick actions (dashboard, export)

### Full Dashboard
- Click "View Dashboard" in the popup
- Or right-click the extension icon and select "Options"
- Explore detailed analytics and reports
- Generate weekly productivity reports

### Data Export
- Click "Export Data" to download your tracking data
- Data is exported in JSON format for further analysis
- Includes all historical data and categorizations

## Website Categories

### Productive Categories
- **Development**: GitHub, Stack Overflow, MDN, CodePen, LeetCode
- **Productivity**: Google Docs, Notion, Trello, Asana
- **Communication**: Slack, Zoom, Microsoft Teams, Gmail
- **Learning**: Coursera, Udemy, Khan Academy, edX

### Unproductive Categories
- **Social Media**: Facebook, Instagram, Twitter, TikTok, LinkedIn
- **Entertainment**: YouTube, Netflix, Twitch, Reddit, BuzzFeed

### Neutral
- All other websites are categorized as "Other"

## Privacy

- **Local Storage Only**: All data is stored locally on your device
- **No Data Transmission**: No data is sent to external servers
- **User Control**: You have complete control over your data
- **Export/Delete**: Easily export or delete your data anytime

## Technical Details

### Files Structure
- `manifest.json`: Extension configuration
- `background.js`: Service worker for time tracking
- `content.js`: Content script for activity detection
- `popup.html/css/js`: Quick access interface
- `dashboard.html/css/js`: Full analytics dashboard

### Permissions Used
- `activeTab`: Track current active tab
- `storage`: Store tracking data locally
- `tabs`: Monitor tab changes
- `background`: Run background tracking

### Browser Compatibility
- Chrome 88+ (Manifest V3)
- Chromium-based browsers (Edge, Brave, etc.)

## Development

### Prerequisites
- Chrome browser
- Basic knowledge of HTML, CSS, JavaScript
- Understanding of Chrome Extension APIs

### Local Development
1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Key Components

#### Background Service Worker
- Tracks active tabs and time spent
- Handles tab switching and window focus
- Categorizes websites automatically
- Stores data using Chrome storage API

#### Content Script
- Detects user activity (mouse, keyboard, scroll)
- Reports activity status to background script
- Ensures accurate time tracking

#### Popup Interface
- Quick daily summary
- Current session information
- Easy access to main dashboard

#### Analytics Dashboard
- Comprehensive data visualization
- Interactive charts using Chart.js
- Detailed website statistics
- Weekly report generation

## Future Enhancements

- [ ] Focus mode with website blocking
- [ ] Goal setting and tracking
- [ ] Team productivity comparison
- [ ] Advanced AI insights
- [ ] Calendar integration
- [ ] Mobile app companion
- [ ] Cloud sync (optional)
- [ ] Custom categories and rules
