"""
JARVIS Configuration Module
Contains all configuration settings for the assistant
"""

import os

# =====================================================
# Assistant Configuration
# =====================================================

ASSISTANT_NAME = "jarvis"

# Voice Settings
VOICE_RATE = 174
VOICE_VOLUME = 1.0
VOICE_INDEX = 2  # Index of voice to use (0-based)

# =====================================================
# Face Recognition Configuration
# =====================================================

# Known faces - Add your names here
# Format: {id: "Name"}
# The id should match the label index from training
KNOWN_FACES = {
    1: "User1",
    2: "Ankit",  # Example: id 2 corresponds to "Ankit"
    3: "User3",
}

# Recognition threshold (lower = more strict)
# Values below 100 indicate a match
RECOGNITION_THRESHOLD = 100

# Display confidence percentage on face
FACE_CONFIDENCE_DISPLAY = True

# =====================================================
# Application Paths
# =====================================================

def get_base_dir():
    """Get the base directory of the application"""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_audio_dir():
    """Get the audio files directory"""
    return os.path.join(get_base_dir(), "frontend", "assets", "audio")

def get_trainer_dir():
    """Get the face trainer directory"""
    return os.path.join(get_base_dir(), "backend", "auth", "trainer")

# =====================================================
# Database Configuration
# =====================================================

DB_NAME = "jarvis.db"

# =====================================================
# API Keys (Add your keys here)
# =====================================================

# HugChat API - Cookie path
HUGCHAT_COOKIE_PATH = os.path.join(os.path.dirname(__file__), "auth", "cookie.json")

# =====================================================
# Feature Flags
# =====================================================

FEATURES = {
    "face_authentication": True,
    "voice_commands": True,
    "youtube_integration": True,
    "whatsapp_integration": True,
    "hotword_detection": False,
    "chatbot": True,
}

# =====================================================
# Export settings
# =====================================================

__all__ = [
    "ASSISTANT_NAME",
    "VOICE_RATE",
    "VOICE_VOLUME",
    "VOICE_INDEX",
    "KNOWN_FACES",
    "RECOGNITION_THRESHOLD",
    "FACE_CONFIDENCE_DISPLAY",
    "get_base_dir",
    "get_audio_dir",
    "get_trainer_dir",
    "DB_NAME",
    "HUGCHAT_COOKIE_PATH",
    "FEATURES",
]
