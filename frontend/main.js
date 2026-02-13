/**
 * JARVIS Main Application - Frontend JavaScript
 * Professional level code with proper structure and error handling
 */

// =====================================================
// Application Configuration
// =====================================================

const CONFIG = {
  siriWave: {
    width: 940,
    height: 200,
    style: 'ios9',
    amplitude: 1,
    speed: 0.30,
    waveColor: '#00AAFF',
    waveOffset: 0,
    rippleEffect: true,
    rippleColor: '#FFFFFF'
  },
  textillate: {
    loop: true,
    speed: 1500,
    sync: true,
    inEffect: 'fadeInUp',
    outEffect: 'fadeOutUp'
  },
  shortcuts: {
    voice: ['j'],
    cancel: ['Escape'],
    submit: ['Enter']
  }
};

// =====================================================
// Global State
// =====================================================

const State = {
  initialized: false,
  siriWave: null,
  isListening: false,
  isSpeaking: false
};

// =====================================================
// DOM Elements
// =====================================================

const Elements = {
  micBtn: null,
  chatBtn: null,
  settingBtn: null,
  sendBtn: null,
  cancelBtn: null,
  chatbox: null,
  siriContainer: null,
  oval: null,
  siriWave: null,
  wishMessage: null,
  preloader: null
};

// =====================================================
// Initialization
// =====================================================

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Cache DOM elements
    cacheElements();

    // Initialize components
    await initializeApp();

    // Setup event listeners
    setupEventListeners();

    // Mark as initialized
    State.initialized = true;
    console.log('[JARVIS] Main application initialized successfully');

  } catch (error) {
    console.error('[JARVIS] Initialization error:', error);
    handleError('Initialization Error', error.message);
  }
});

/**
 * Cache frequently used DOM elements
 */
function cacheElements() {
  Elements.micBtn = document.getElementById('MicBtn');
  Elements.chatBtn = document.getElementById('ChatBtn');
  Elements.settingBtn = document.getElementById('SettingBtn');
  Elements.sendBtn = document.getElementById('SendBtn');
  Elements.cancelBtn = document.getElementById('CancelBtn');
  Elements.chatbox = document.getElementById('chatbox');
  Elements.siriContainer = document.getElementById('siri-container');
  Elements.oval = document.getElementById('Oval');
  Elements.siriWave = document.getElementById('SiriWave');
  Elements.wishMessage = document.getElementById('WishMessage');
  Elements.preloader = document.getElementById('preloader');

  console.log('[JARVIS] DOM elements cached');
}

/**
 * Initialize the main application
 */
async function initializeApp() {
  try {
    // Check Eel availability
    if (typeof eel === 'undefined') {
      console.warn('[JARVIS] Eel not available - running in demo mode');
      return;
    }

    // Call backend initialization
    if (typeof eel.init === 'function') {
      await eel.init()();
    }

    // Initialize Siri Wave
    initializeSiriWave();

    // Initialize textillate
    initializeTextillate();

    // Hide preloader
    if (Elements.preloader) {
      Elements.preloader.classList.add('fade-out');
      setTimeout(() => {
        Elements.preloader.hidden = true;
      }, 500);
    }

  } catch (error) {
    console.error('[JARVIS] App initialization error:', error);
    throw error;
  }
}

/**
 * Initialize Siri Wave animation
 */
function initializeSiriWave() {
  if (!Elements.siriContainer || typeof SiriWave === 'undefined') {
    console.warn('[JARVIS] SiriWave container or library not available');
    return;
  }

  try {
    State.siriWave = new SiriWave({
      container: Elements.siriContainer,
      width: CONFIG.siriWave.width,
      height: CONFIG.siriWave.height,
      style: CONFIG.siriWave.style,
      amplitude: CONFIG.siriWave.amplitude,
      speed: CONFIG.siriWave.speed,
      waveColor: CONFIG.siriWave.waveColor,
      waveOffset: CONFIG.siriWave.waveOffset,
      rippleEffect: CONFIG.siriWave.rippleEffect,
      rippleColor: CONFIG.siriWave.rippleColor,
      autostart: true
    });

    console.log('[JARVIS] SiriWave initialized');

  } catch (error) {
    console.error('[JARVIS] SiriWave initialization error:', error);
  }
}

/**
 * Initialize Textillate animations
 */
function initializeTextillate() {
  if (typeof $ === 'undefined' || typeof $.fn.textillate === 'undefined') {
    console.warn('[JARVIS] jQuery or Textillate not available');
    return;
  }

  try {
    // Main message textillate
    $('.siri-message').textillate({
      loop: CONFIG.textillate.loop,
      speed: CONFIG.textillate.speed,
      sync: CONFIG.textillate.sync,
      in: {
        effect: CONFIG.textillate.inEffect,
        sync: CONFIG.textillate.sync
      },
      out: {
        effect: CONFIG.textillate.outEffect,
        sync: CONFIG.textillate.sync
      }
    });

    console.log('[JARVIS] Textillate initialized');

  } catch (error) {
    console.error('[JARVIS] Textillate initialization error:', error);
  }
}

// =====================================================
// Event Listeners
// =====================================================

function setupEventListeners() {
  // Microphone button click
  if (Elements.micBtn) {
    Elements.micBtn.addEventListener('click', handleMicClick);
  }

  // Send button click
  if (Elements.sendBtn) {
    Elements.sendBtn.addEventListener('click', handleSendClick);
  }

  // Chatbox events
  if (Elements.chatbox) {
    Elements.chatbox.addEventListener('input', handleChatboxInput);
    Elements.chatbox.addEventListener('keypress', handleChatboxKeypress);
  }

  // Keyboard shortcuts
  document.addEventListener('keyup', handleKeyUp);

  console.log('[JARVIS] Event listeners configured');
}

// =====================================================
// Event Handlers
// =====================================================

/**
 * Handle microphone button click
 */
async function handleMicClick() {
  if (State.isListening) return;

  try {
    State.isListening = true;
    console.log('[JARVIS] Microphone activated');

    // Play assistant sound
    if (typeof eel !== 'undefined' && typeof eel.play_assistant_sound === 'function') {
      eel.play_assistant_sound();
    }

    // Switch UI state
    if (Elements.oval) Elements.oval.hidden = true;
    if (Elements.siriWave) Elements.siriWave.hidden = false;

    // Start voice recognition
    if (typeof eel !== 'undefined' && typeof eel.takeAllCommands === 'function') {
      await eel.takeAllCommands()();
    }

  } catch (error) {
    console.error('[JARVIS] Microphone error:', error);
    handleError('Voice Recognition Error', error.message);
    State.isListening = false;

    // Reset UI
    if (Elements.oval) Elements.oval.hidden = false;
    if (Elements.siriWave) Elements.siriWave.hidden = true;
  }
}

/**
 * Handle send button click
 */
function handleSendClick() {
  const message = Elements.chatbox?.value.trim();
  if (message && typeof eel !== 'undefined' && typeof eel.takeAllCommands === 'function') {
    eel.takeAllCommands(message);
    Elements.chatbox.value = '';
    updateButtonStates(false);

    console.log('[JARVIS] Message sent:', message);
  } else if (!message) {
    console.warn('[JARVIS] Empty message not sent');
  }
}

/**
 * Handle chatbox input
 */
function handleChatboxInput(event) {
  const message = event.target.value.trim();
  updateButtonStates(message.length > 0);
}

/**
 * Handle chatbox keypress
 */
function handleChatboxKeypress(event) {
  if (event.key === 'Enter') {
    const message = Elements.chatbox.value.trim();
    if (message && typeof eel !== 'undefined' && typeof eel.takeAllCommands === 'function') {
      eel.takeAllCommands(message);
      Elements.chatbox.value = '';
      updateButtonStates(false);

      console.log('[JARVIS] Message sent via Enter:', message);
    }
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyUp(event) {
  // Ctrl/Cmd + J for voice command
  if ((event.ctrlKey || event.metaKey) &&
    CONFIG.shortcuts.voice.includes(event.key.toLowerCase())) {
    event.preventDefault();

    if (!State.isListening) {
      handleMicClick();
    }
  }

  // Escape to cancel
  if (event.key === CONFIG.shortcuts.cancel[0]) {
    handleCancel();
  }
}

/**
 * Handle cancel action
 */
function handleCancel() {
  if (State.isListening) {
    State.isListening = false;

    if (Elements.siriWave) Elements.siriWave.hidden = true;
    if (Elements.oval) Elements.oval.hidden = false;

    console.log('[JARVIS] Voice command cancelled');
  }
}

// =====================================================
// UI Functions
// =====================================================

/**
 * Update button visibility states
 */
function updateButtonStates(hasText) {
  if (Elements.sendBtn && Elements.micBtn) {
    Elements.sendBtn.hidden = !hasText;
    Elements.micBtn.hidden = hasText;
  }
}

/**
 * Play assistant with message
 */
function playAssistant(message) {
  if (!message || typeof message !== 'string') {
    console.warn('[JARVIS] Invalid message for playback');
    return;
  }

  try {
    if (Elements.oval) Elements.oval.hidden = true;
    if (Elements.siriWave) Elements.siriWave.hidden = false;

    if (typeof eel !== 'undefined' && typeof eel.takeAllCommands === 'function') {
      eel.takeAllCommands(message);
    }

    if (Elements.chatbox) Elements.chatbox.value = '';
    updateButtonStates(false);

    console.log('[JARVIS] Playing assistant:', message);

  } catch (error) {
    console.error('[JARVIS] Play assistant error:', error);
  }
}

/**
 * Switch to voice mode
 */
function switchToVoiceMode() {
  if (Elements.oval) Elements.oval.hidden = true;
  if (Elements.siriWave) Elements.siriWave.hidden = false;
  State.isListening = true;
}

/**
 * Switch to normal mode
 */
function switchToNormalMode() {
  if (Elements.siriWave) Elements.siriWave.hidden = true;
  if (Elements.oval) Elements.oval.hidden = false;
  State.isListening = false;
}

/**
 * Show/hide buttons based on message
 */
function showHideButton(message) {
  if (Elements.micBtn && Elements.sendBtn) {
    if (message.length === 0) {
      Elements.micBtn.hidden = false;
      Elements.sendBtn.hidden = true;
    } else {
      Elements.micBtn.hidden = true;
      Elements.sendBtn.hidden = false;
    }
  }
}

// =====================================================
// Error Handling
// =====================================================

/**
 * Handle errors
 */
function handleError(title, message) {
  console.error(`[JARVIS Error] ${title}:`, message);

  // Show error toast if possible
  showNotification(`${title}: ${message}`, 'danger');

  // Reset UI state
  State.isListening = false;
  switchToNormalMode();
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const toast = document.getElementById('notificationToast');
  const toastMessage = document.getElementById('toastMessage');

  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.className = `toast align-items-center text-bg-${type} border-0`;

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  }
}

// =====================================================
// Utility Functions
// =====================================================

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate unique ID
 */
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Format timestamp
 */
function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// =====================================================
// Export (for module systems)
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG,
    State,
    Elements,
    initializeApp,
    handleMicClick,
    playAssistant,
    handleError,
    showNotification,
    debounce,
    throttle,
    generateId,
    formatTimestamp
  };
}
