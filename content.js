// Content script for additional tracking functionality
(function() {
  'use strict';

  let isActive = true;
  let lastActivity = Date.now();

  // Track user activity (mouse movements, clicks, scrolling)
  function trackActivity() {
    lastActivity = Date.now();
    if (!isActive) {
      isActive = true;
      // Notify background script that user is active
      chrome.runtime.sendMessage({ type: 'USER_ACTIVE' });
    }
  }

  // Add event listeners for user activity
  document.addEventListener('mousemove', trackActivity);
  document.addEventListener('click', trackActivity);
  document.addEventListener('keypress', trackActivity);
  document.addEventListener('scroll', trackActivity);

  // Check for user inactivity every 30 seconds
  setInterval(() => {
    const now = Date.now();
    if (now - lastActivity > 30000 && isActive) { // 30 seconds of inactivity
      isActive = false;
      chrome.runtime.sendMessage({ type: 'USER_INACTIVE' });
    }
  }, 30000);

  // Send initial activity status
  chrome.runtime.sendMessage({ type: 'CONTENT_LOADED', url: window.location.href });
})();