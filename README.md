# 🤖 JARVIS - AI Voice Assistant

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white" alt="Python Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey" alt="Platform">
  <img src="https://img.shields.io/github/stars/yourusername/jarvis-ai?style=social" alt="GitHub Stars">
</p>

<p align="center">
  <em>Your intelligent personal assistant powered by artificial intelligence</em>
</p>

---

## 🌟 Features

### 🔐 Advanced Security
- **Face Recognition Authentication** - Secure access with facial biometrics
- **Multi-user Support** - Recognize and authenticate multiple users
- **Privacy Controls** - Toggle authentication features on/off

### 🎙️ Intelligent Voice Interaction
- **Speech-to-Text** - Accurate voice command recognition
- **Text-to-Speech** - Natural voice responses with configurable settings
- **Hotword Detection** - Wake word activation ("Jarvis", "Alexa")
- **Continuous Listening** - Hands-free operation mode

### 💬 Smart Capabilities
- **AI-Powered Chatbot** - Conversational intelligence using HuggingChat
- **Web Search Integration** - YouTube playback and web browsing
- **Application Control** - Open apps and websites via voice commands
- **WhatsApp Automation** - Send messages, make calls, and video calls

### 🎨 Modern Interface
- **Responsive Web UI** - Beautiful dark-themed interface
- **Real-time Animations** - Siri-like waveform visualization
- **Particle Effects** - Dynamic background particles
- **Customizable Themes** - Multiple background options
- **Progressive Web App** - Installable on devices

### ⚙️ Advanced Features
- **Cross-platform Compatibility** - Works on Windows, Linux, macOS
- **Modular Architecture** - Extensible plugin system
- **Database Integration** - SQLite for contacts and commands
- **Keyboard Shortcuts** - Efficient navigation and control

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Python 3.8 or higher**
- **Windows/Linux/macOS**
- **Microphone** for voice commands
- **Webcam** for face recognition
- **Internet Connection** for AI features

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/akashvim3/jarvis-ai.git
cd jarvis-ai
```

### 2. Set Up Virtual Environment

```bash
# Windows
python -m venv envJarvis
envJarvis\Scripts\activate

# Linux/macOS
python3 -m venv envJarvis
source envJarvis/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Face Recognition

1. Navigate to `backend/auth/`
2. Run the sample collection script:
   ```bash
   python sample.py
   ```
3. Train the model:
   ```bash
   python trainer.py
   ```

### 5. Set Up HuggingChat (Optional)

1. Create a `cookie.json` file in `backend/auth/`
2. Add your HuggingChat session cookies for AI chat functionality

## ▶️ Usage

### Starting the Assistant

```bash
# Method 1: Direct start
python main.py

# Method 2: With hotword detection
python run.py
```

### Voice Commands

Once activated, you can use natural language commands:

#### Application Control
- "Open Chrome"
- "Open Spotify"
- "Open calculator"

#### Media & Entertainment
- "Play [song/video] on YouTube"
- "Search for [topic]"

#### Communication
- "Send message to [contact]"
- "Call [contact]"
- "Video call [contact]"

#### System Functions
- "What time is it?"
- "What's the weather?"
- "Take a screenshot"

### Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl + J` | Activate voice command |
| `Enter` | Send text message |
| `Escape` | Cancel/Back |

## 🛠️ Configuration

### Voice Settings
Adjust voice parameters in `backend/config.py`:

```python
VOICE_RATE = 174        # Speech speed
VOICE_VOLUME = 1.0      # Volume level
VOICE_INDEX = 2         # Voice selection
```

### Face Recognition
Configure known faces:

```python
KNOWN_FACES = {
    1: "Your Name",
    2: "Another User",
}
```

### Feature Toggles
Enable/disable features:

```python
FEATURES = {
    "face_authentication": True,
    "voice_commands": True,
    "youtube_integration": True,
    "whatsapp_integration": True,
    "hotword_detection": True,
}
```

## 📁 Project Structure

```
jarvis-ai/
├── backend/                 # Core Python backend
│   ├── auth/               # Authentication system
│   │   ├── sample.py       # Face sample collection
│   │   ├── trainer.py      # Model training
│   │   └── recoganize.py   # Face recognition
│   ├── command.py          # Voice command processing
│   ├── config.py           # Configuration settings
│   ├── db.py               # Database operations
│   ├── feature.py          # Core features
│   └── helper.py           # Utility functions
├── frontend/               # Web interface
│   ├── assets/             # Static assets
│   ├── index.html          # Main HTML
│   ├── main.js             # Frontend logic
│   ├── controller.js       # UI controllers
│   ├── script.js           # Animation scripts
│   └── style.css           # Styling
├── envJarvis/              # Virtual environment
├── main.py                 # Main application entry
├── run.py                  # Multiprocess launcher
└── README.md               # This file
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 coding standards
- Write clear, documented code
- Test thoroughly before submitting
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Face Recognition Not Working**
- Ensure proper lighting conditions
- Check webcam permissions
- Retrain the model with better samples

**Voice Commands Not Recognized**
- Check microphone connection
- Adjust ambient noise settings
- Speak clearly and at moderate pace

**Application Not Starting**
- Verify Python version >= 3.8
- Check all dependencies are installed
- Ensure virtual environment is activated

### Need Help?

- Check the [Issues](https://github.com/yourusername/jarvis-ai/issues) section
- Submit a new issue with detailed information
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Eel](https://github.com/ChrisKnott/Eel) - Python library for creating desktop applications
- [OpenCV](https://opencv.org/) - Computer vision library for face recognition
- [Pyttsx3](https://github.com/nateshmbhat/pyttsx3) - Text-to-speech conversion
- [SpeechRecognition](https://github.com/Uberi/speech_recognition) - Speech recognition library
- [Bootstrap](https://getbootstrap.com/) - Frontend framework
- [HuggingChat](https://huggingface.co/chat/) - AI chatbot integration

## 📞 Contact

- **Project Link**: [https://github.com/akashvim3/jarvis-ai](https://github.com/akashvim3/jarvis-ai)
- **Developer**: Akash Vimal
- **Email**: your.email@example.com

## ⭐ Show Your Support

If you like this project, please give it a star! ⭐

---

<p align="center">
  <strong>Made with ❤️ by Developers for Developers</strong>
</p>
