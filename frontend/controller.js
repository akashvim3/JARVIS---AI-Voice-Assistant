/**
 * JARVIS Controller - Handles all frontend-backend communication
 * Professional level JavaScript with proper error handling and state management
 */

// State Management
const AppState = {
  currentSection: 'start',
  isListening: false,
  isProcessing: false,
  messageHistory: [],
  settings: {
    voiceRate: 1,
    voicePitch: 1,
    voiceVolume: 1,
    darkMode: true,
    faceAuth: true
  }
};

// DOM Elements Cache
const DOM = {
  start: document.getElementById('Start'),
  oval: document.getElementById('Oval'),
  siriWave: document.getElementById('SiriWave'),
  loader: document.getElementById('Loader'),
  faceAuth: document.getElementById('FaceAuth'),
  faceAuthSuccess: document.getElementById('FaceAuthSuccess'),
  helloGreet: document.getElementById('HelloGreet'),
  wishMessage: document.getElementById('WishMessage'),
  siriMessage: document.getElementById('SiriMessage'),
  chatbox: document.getElementById('chatbox'),
  sendBtn: document.getElementById('SendBtn'),
  micBtn: document.getElementById('MicBtn'),
  chatBtn: document.getElementById('ChatBtn'),
  settingBtn: document.getElementById('SettingBtn'),
  cancelBtn: document.getElementById('CancelBtn'),
  chatCanvasBody: document.getElementById('chat-canvas-body'),
  preloader: document.getElementById('preloader'),
  toast: document.getElementById('notificationToast'),
  toastMessage: document.getElementById('toastMessage'),
  errorAlert: document.getElementById('errorAlert'),
  errorMessage: document.getElementById('errorMessage')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  initializeTextillate();
  loadSettings();
});

/**
 * Initialize the main application
 */
async function initializeApp() {
  try {
    // Check if Eel is available
    if (typeof eel === 'undefined') {
      throw new Error('Eel library not loaded. Please check your connection.');
    }

    // Initialize Eel expose functions
    exposeFunctions();

    // Log successful initialization
    console.log('[JARVIS] Application initialized successfully');

  } catch (error) {
    handleError('Initialization Error', error.message);
  }
}

/**
 * Expose all functions to Python/Eel
 */
function exposeFunctions() {
  try {
    // Check if eel.expose exists
    if (typeof eel.expose !== 'function') {
      console.warn('[JARVIS] eel.expose not available in current context');
      return;
    }

    // Display message in the assistant interface
    eel.expose(DisplayMessage);
    function DisplayMessage(message) {
      if (!message || typeof message !== 'string') {
        console.warn('[JARVIS] Invalid message received:', message);
        return;
      }

      try {
        DOM.wishMessage.textContent = message;
        DOM.siriMessage.textContent = message;

        // Add to message history
        AppState.messageHistory.push({
          type: 'assistant',
          message: message,
          timestamp: new Date().toISOString()
        });

        // Trigger textillate animation if available
        if (typeof $ !== 'undefined' && $.fn.textillate) {
          $('.siri-message').textillate('start');
        }

        console.log('[JARVIS] Message displayed:', message);
      } catch (error) {
        console.error('[JARVIS] Error displaying message:', error);
      }
    }

    // Show the main interface
    eel.expose(ShowHood);
    function ShowHood() {
      try {
        DOM.oval.hidden = false;
        DOM.siriWave.hidden = true;
        DOM.start.hidden = true;
        AppState.currentSection = 'hood';

        console.log('[JARVIS] Hood section shown');
      } catch (error) {
        console.error('[JARVIS] Error showing hood:', error);
      }
    }

    // Send user message to chat
    eel.expose(senderText);
    function senderText(message) {
      if (!message || typeof message !== 'string') return;

      try {
        message = escapeHtml(message.trim());
        if (message === '') return;

        const messageHtml = `
          <div class="row justify-content-end mb-3">
            <div class="col-auto">
              <div class="sender_message animate__animated animate__fadeInRight">
                ${message}
              </div>
            </div>
          </div>
        `;

        appendToChat(DOM.chatCanvasBody, messageHtml);

        // Add to history
        AppState.messageHistory.push({
          type: 'user',
          message: message,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('[JARVIS] Error adding sender message:', error);
      }
    }

    // Receive assistant message
    eel.expose(receiverText);
    function receiverText(message) {
      if (!message || typeof message !== 'string') return;

      try {
        message = escapeHtml(message.trim());
        if (message === '') return;

        const messageHtml = `
          <div class="row justify-content-start mb-3">
            <div class="col-auto">
              <div class="receiver_message animate__animated animate__fadeInLeft">
                ${message}
              </div>
            </div>
          </div>
        `;

        appendToChat(DOM.chatCanvasBody, messageHtml);

        // Add to history
        AppState.messageHistory.push({
          type: 'assistant',
          message: message,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('[JARVIS] Error adding receiver message:', error);
      }
    }

    // Hide loader and show face auth
    eel.expose(hideLoader);
    function hideLoader() {
      try {
        DOM.loader.hidden = true;
        DOM.faceAuth.hidden = false;

        console.log('[JARVIS] Loader hidden, face auth shown');
      } catch (error) {
        console.error('[JARVIS] Error hiding loader:', error);
      }
    }

    // Hide face auth and show success
    eel.expose(hideFaceAuth);
    function hideFaceAuth() {
      try {
        DOM.faceAuth.hidden = true;
        DOM.faceAuthSuccess.hidden = false;

        console.log('[JARVIS] Face auth hidden, success shown');
      } catch (error) {
        console.error('[JARVIS] Error hiding face auth:', error);
      }
    }

    // Hide success and show greeting
    eel.expose(hideFaceAuthSuccess);
    function hideFaceAuthSuccess() {
      try {
        DOM.faceAuthSuccess.hidden = true;
        DOM.helloGreet.hidden = false;

        console.log('[JARVIS] Face auth success hidden, greeting shown');
      } catch (error) {
        console.error('[JARVIS] Error hiding face auth success:', error);
      }
    }

    // Hide start and show main interface
    eel.expose(hideStart);
    function hideStart() {
      try {
        DOM.start.hidden = true;
        DOM.oval.hidden = false;
        AppState.currentSection = 'main';

        console.log('[JARVIS] Main interface shown');
      } catch (error) {
        console.error('[JARVIS] Error hiding start:', error);
      }
    }

    // Update Siri message
    eel.expose(updateSiriMessage);
    function updateSiriMessage(message) {
      if (message && typeof message === 'string') {
        DOM.siriMessage.textContent = message;
      }
    }

    console.log('[JARVIS] All Eel functions exposed successfully');

  } catch (error) {
    console.error('[JARVIS] Error exposing functions:', error);
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Microphone button
  if (DOM.micBtn) {
    DOM.micBtn.addEventListener('click', handleMicClick);
  }

  // Chat button
  if (DOM.chatBtn) {
    DOM.chatBtn.addEventListener('click', handleChatClick);
  }

  // Settings button
  if (DOM.settingBtn) {
    DOM.settingBtn.addEventListener('click', handleSettingsClick);
  }

  // Send button
  if (DOM.sendBtn) {
    DOM.sendBtn.addEventListener('click', handleSendClick);
  }

  // Cancel button
  if (DOM.cancelBtn) {
    DOM.cancelBtn.addEventListener('click', handleCancelClick);
  }

  // Chatbox input
  if (DOM.chatbox) {
    DOM.chatbox.addEventListener('input', handleChatboxInput);
    DOM.chatbox.addEventListener('keypress', handleChatboxKeypress);
  }

  // Keyboard shortcuts
  document.addEventListener('keyup', handleKeyboardShortcuts);

  // Clear chat button
  const clearChatBtn = document.getElementById('clearChat');
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', handleClearChat);
  }

  // Save settings button
  const saveSettingsBtn = document.getElementById('saveSettings');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', handleSaveSettings);
  }

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      AppState.settings.darkMode = e.target.checked;
      document.body.setAttribute('data-bs-theme', e.target.checked ? 'dark' : 'light');
    });
  }

  console.log('[JARVIS] Event listeners setup complete');
}

/**
 * Handle microphone button click
 */
async function handleMicClick() {
  try {
    if (AppState.isListening) return;

    AppState.isListening = true;
    showToast('Listening...', 'info');

    // Play assistant sound
    if (typeof eel !== 'undefined' && typeof eel.play_assistant_sound === 'function') {
      eel.play_assistant_sound();
    }

    // Hide oval, show Siri wave
    DOM.oval.hidden = true;
    DOM.siriWave.hidden = false;

    // Call Python function
    if (typeof eel !== 'undefined' && typeof eel.takeAllCommands === 'function') {
      await eel.takeAllCommands()();
    }

  } catch (error) {
    handleError('Microphone Error', error.message);
    AppState.isListening = false;
  }
}

/**
 * Handle chat button click
 */
function handleChatClick() {
  // Open chat modal
  const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
  chatModal.show();
}

/**
 * Handle settings button click
 */
function handleSettingsClick() {
  // Open settings modal
  const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
  settingsModal.show();
}

/**
 * Handle send button click
 */
function handleSendClick() {
  const message = DOM.chatbox.value.trim();
  if (message && typeof eel !== 'undefined' && typeof eel.takeAllCommands === 'function') {
    eel.takeAllCommands(message);
    DOM.chatbox.value = '';
    DOM.sendBtn.hidden = true;
    DOM.micBtn.hidden = false;
  }
}

/**
 * Handle cancel button click
 */
function handleCancelClick() {
  DOM.siriWave.hidden = true;
  DOM.oval.hidden = false;
  AppState.isListening = false;
  AppState.isProcessing = false;
}

/**
 * Handle chatbox input
 */
function handleChatboxInput(event) {
  const message = event.target.value.trim();
  showHideButtons(message.length > 0);
}

/**
 * Handle chatbox keypress
 */
function handleChatboxKeypress(event) {
  if (event.key === 'Enter') {
    const message = DOM.chatbox.value.trim();
    if (message && typeof eel !== 'undefined' && typeof eel.takeAllCommands === 'function') {
      eel.takeAllCommands(message);
      DOM.chatbox.value = '';
      showHideButtons(false);
    }
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
  // Ctrl/Cmd + J for voice command
  if ((event.ctrlKey || event.metaKey) && event.key === 'j') {
    event.preventDefault();
    if (!AppState.isListening) {
      handleMicClick();
    }
  }

  // Escape to cancel
  if (event.key === 'Escape') {
    handleCancelClick();
  }
}

/**
 * Handle clear chat
 */
function handleClearChat() {
  if (DOM.chatCanvasBody) {
    DOM.chatCanvasBody.innerHTML = '';
    AppState.messageHistory = [];
    showToast('Chat history cleared', 'success');
  }
}

/**
 * Handle save settings
 */
function handleSaveSettings() {
  try {
    // Save voice settings
    const voiceRate = document.getElementById('voiceRate');
    const voicePitch = document.getElementById('voicePitch');
    const voiceVolume = document.getElementById('voiceVolume');

    if (voiceRate) AppState.settings.voiceRate = parseFloat(voiceRate.value);
    if (voicePitch) AppState.settings.voicePitch = parseFloat(voicePitch.value);
    if (voiceVolume) AppState.settings.voiceVolume = parseFloat(voiceVolume.value);

    // Save to localStorage
    localStorage.setItem('jarvisSettings', JSON.stringify(AppState.settings));

    showToast('Settings saved successfully', 'success');

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    if (modal) modal.hide();

    console.log('[JARVIS] Settings saved:', AppState.settings);

  } catch (error) {
    handleError('Settings Error', error.message);
  }
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
  try {
    const saved = localStorage.getItem('jarvisSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      AppState.settings = { ...AppState.settings, ...settings };

      // Apply settings
      const darkModeToggle = document.getElementById('darkModeToggle');
      if (darkModeToggle) {
        darkModeToggle.checked = AppState.settings.darkMode;
        document.body.setAttribute('data-bs-theme', AppState.settings.darkMode ? 'dark' : 'light');
      }

      const voiceRate = document.getElementById('voiceRate');
      const voicePitch = document.getElementById('voicePitch');
      const voiceVolume = document.getElementById('voiceVolume');

      if (voiceRate) voiceRate.value = AppState.settings.voiceRate;
      if (voicePitch) voicePitch.value = AppState.settings.voicePitch;
      if (voiceVolume) voiceVolume.value = AppState.settings.voiceVolume;

      console.log('[JARVIS] Settings loaded:', AppState.settings);
    }
  } catch (error) {
    console.error('[JARVIS] Error loading settings:', error);
  }
}

/**
 * Initialize Textillate animations
 */
function initializeTextillate() {
  if (typeof $ !== 'undefined' && $.fn.textillate) {
    $('.siri-message').textillate({
      loop: true,
      speed: 1500,
      sync: true,
      in: {
        effect: 'fadeInUp',
        sync: true
      },
      out: {
        effect: 'fadeOutUp',
        sync: true
      }
    });
  }
}

/**
 * Show/hide send/mic buttons based on input
 */
function showHideButtons(hasText) {
  if (DOM.sendBtn && DOM.micBtn) {
    DOM.sendBtn.hidden = !hasText;
    DOM.micBtn.hidden = hasText;
  }
}

/**
 * Append HTML to chat container
 */
function appendToChat(container, html) {
  if (container) {
    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  if (DOM.toast && DOM.toastMessage) {
    DOM.toastMessage.textContent = message;

    // Remove existing color classes
    DOM.toast.classList.remove('text-bg-primary', 'text-bg-success', 'text-bg-danger', 'text-bg-warning');

    // Add appropriate class
    const colorClass = type === 'success' ? 'text-bg-success' :
      type === 'error' ? 'text-bg-danger' :
        type === 'warning' ? 'text-bg-warning' : 'text-bg-primary';
    DOM.toast.classList.add(colorClass);

    // Show toast
    const toast = new bootstrap.Toast(DOM.toast);
    toast.show();
  }
}

/**
 * Handle errors
 */
function handleError(title, message) {
  console.error(`[JARVIS Error] ${title}:`, message);

  // Show error alert
  if (DOM.errorAlert && DOM.errorMessage) {
    DOM.errorMessage.textContent = message;
    DOM.errorAlert.hidden = false;

    // Auto hide after 5 seconds
    setTimeout(() => {
      DOM.errorAlert.hidden = true;
    }, 5000);
  }

  // Show toast
  showToast(`${title}: ${message}`, 'error');
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AppState,
    DOM,
    initializeApp,
    exposeFunctions,
    handleError
  };
}
