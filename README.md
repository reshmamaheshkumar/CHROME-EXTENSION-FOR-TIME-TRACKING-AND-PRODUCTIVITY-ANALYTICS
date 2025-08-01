**COMPANY**: CODTECH IT SOLUTIONS

**NAME**: RESHMA M

**INTERN ID**: CT04DH1296

**DOMAIN**: FULL STACK WEB DEVELOPMENT

**DURATION**:4 WEEEKS

**MENTOR**: NEELA SANTOSH


# 🕒 ProductiveFocus - Chrome Extension for Time Tracking and Productivity Analytics

A comprehensive Chrome extension that tracks time spent on websites and provides detailed productivity analytics with weekly reports.

---

## 📝 Description
ProductiveFocus is a feature-rich, privacy-conscious Chrome Extension designed to help users track time spent on websites, measure productivity, and develop healthier digital habits. Built with modern web technologies (HTML, CSS, JavaScript, Chrome Extension APIs), the tool runs seamlessly in the browser, providing real-time tracking, insightful analytics, and weekly reports—all while storing data locally for complete user privacy.

This extension was developed as a solo project with the aim to address one of the most common productivity challenges: time leakage due to unconscious web browsing. ProductiveFocus monitors active browser tabs, categorizes websites intelligently (e.g., productive, unproductive, or neutral), and generates clear, interactive analytics—helping users visualize how their time is distributed across platforms like GitHub, Stack Overflow, YouTube, and social media.

Unlike many productivity tools that require cloud sync or signup, ProductiveFocus is fully local-first. It uses Chrome’s local storage and avoids third-party trackers, making it ideal for privacy-focused users. The tracking is done in the background using a lightweight service worker (background.js), while a content.js script detects user interaction (mouse, keyboard, scrolling) to ensure accurate active-time tracking.

The popup UI offers a quick glance at daily stats—such as focus time, distractions, and active sessions—while the dashboard.html page provides in-depth visualizations using Chart.js. Users can view trends by day, week, or month, filter by categories, and even export their activity data in JSON format.

The productivity scoring system dynamically calculates user focus based on time allocation, and delivers personalized productivity insights that evolve as the user’s habits change. The app also highlights top distracting websites, enables goal-setting, and tracks improvements over time.

Key Highlights:

🔹 Built using Chrome Manifest V3 for performance and compatibility

🔹 Tracks active tab usage using Chrome Extension APIs

🔹 Categorizes websites using predefined rules (editable in code)

🔹 Features a fully responsive analytics dashboard

🔹 Allows data export for personal archiving or analysis

🔹 No user account or login required

🔹 Clean UI with popup and full dashboard views

🔹 100% offline-first and privacy-respecting

Target Users:

This extension is built for:

Students looking to optimize their study hours

Developers who want to reduce time on distracting sites

Remote workers and freelancers monitoring their focus

Productivity enthusiasts and quantified-self users

Real-World Applications:

Portfolio Demonstration: Showcases mastery of browser APIs and frontend UX

Behavioral Analytics: Visualize focus trends and distractions

Time Management Coaching: Can serve as a self-feedback tool

Extension Development: Demonstrates experience with Manifest V3 and Chrome's service worker model

This project reflects strong problem-solving ability, end-to-end product thinking, and the ability to integrate front-end and background logic effectively. The development required practical skills in event-based programming, data visualization, browser extension architecture, and UX design

---

## 📸 Screenshots


> 🧩 Popup View – Daily Productivity Snapshot  
<img src="https://github.com/user-attachments/assets/58b88836-bdc4-4a14-9e0d-7ab9d06055e7" width="400" />



> 📊 Dashboard View – Weekly Productivity Report  
<img src="https://github.com/user-attachments/assets/578f1f7f-4316-44e7-8086-3d3fbbedc5c2" width="600" />



> 📈 Tracking Results – Categorized Website Usage  
<img src="https://github.com/user-attachments/assets/fd255dee-c189-4bd7-a3c5-9113fb6ac858" width="600" />

---

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

---

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your Chrome toolbar

---

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

---

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

---

## Privacy

- **Local Storage Only**: All data is stored locally on your device
- **No Data Transmission**: No data is sent to external servers
- **User Control**: You have complete control over your data
- **Export/Delete**: Easily export or delete your data anytime

---

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

---

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

---

## Future Enhancements

- [ ] Focus mode with website blocking
- [ ] Goal setting and tracking
- [ ] Team productivity comparison
- [ ] Advanced AI insights
- [ ] Calendar integration
- [ ] Mobile app companion
- [ ] Cloud sync (optional)
- [ ] Custom categories and rules

---
