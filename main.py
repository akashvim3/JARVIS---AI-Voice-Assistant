"""
JARVIS - AI Voice Assistant
Main application entry point
"""

import os
import sys
import webbrowser
import eel

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.auth import recoganize
from backend.auth.recoganize import AuthenticateFace
from backend.feature import play_assistant_sound


def get_browser():
    """
    Get the appropriate browser for the application
    Returns the browser object or None if not found
    """
    browsers = [
        ('edge', webbrowser.get('edge')),
        ('chrome', webbrowser.get('chrome')),
        ('firefox', webbrowser.get('firefox')),
        ('default', webbrowser.get()),
    ]
    
    for name, browser in browsers:
        if browser:
            print(f"[JARVIS] Using browser: {name}")
            return browser
    
    print("[JARVIS] No specific browser found, using default")
    return webbrowser.get()


def start_browser(url):
    """
    Start the web browser with the Jarvis interface
    """
    try:
        # Try to use Edge in app mode
        edge_path = r"start msedge.exe --app=\"{url}\""
        
        # Check if Edge is available
        if os.system("where edge.exe >nul 2>&1") == 0:
            os.system(edge_path.format(url=url))
            print("[JARVIS] Launched Microsoft Edge in app mode")
        else:
            # Fallback to default browser
            browser = get_browser()
            browser.open(url)
            print("[JARVIS] Launched default browser")
            
    except Exception as e:
        print(f"[JARVIS] Browser launch error: {e}")
        # Fallback to default browser
        try:
            webbrowser.open(url)
            print("[JARVIS] Opened URL in default browser")
        except Exception as fallback_error:
            print(f"[JARVIS] Fallback also failed: {fallback_error}")


def start():
    """
    Initialize and start the Jarvis application
    """
    print("[JARVIS] Starting Jarvis AI Assistant...")
    print("[JARVIS] Initializing frontend...")
    
    # Initialize Eel with frontend directory
    eel.init("frontend")
    
    # Play startup sound
    print("[JARVIS] Playing startup sound...")
    try:
        play_assistant_sound()
    except Exception as e:
        print(f"[JARVIS] Warning: Could not play startup sound: {e}")
    
    # Expose initialization function to JavaScript
    @eel.expose
    def init():
        """Initialize the assistant after frontend is ready"""
        try:
            eel.hideLoader()
            eel.DisplayMessage("Welcome to Jarvis")
            eel.DisplayMessage("Ready for Face Authentication")
            
            # Perform face authentication
            print("[JARVIS] Starting face authentication...")
            flag = AuthenticateFace()
            
            if flag == 1:
                print("[JARVIS] Face recognized successfully")
                eel.DisplayMessage("Face recognized successfully")
                eel.hideFaceAuth()
                eel.hideFaceAuthSuccess()
                eel.DisplayMessage("Welcome to Your Assistant")
                eel.hideStart()
                
                # Play success sound
                try:
                    play_assistant_sound()
                except:
                    pass
                    
            else:
                print("[JARVIS] Face not recognized")
                eel.DisplayMessage("Face not recognized. Please try again")
                
        except Exception as e:
            print(f"[JARVIS] Initialization error: {e}")
            eel.DisplayMessage(f"Error: {str(e)}")
    
    # Determine the URL
    url = "http://localhost:8000/index.html"
    
    # Start browser in a new thread (non-blocking)
    import threading
    browser_thread = threading.Thread(target=start_browser, args=(url,), daemon=True)
    browser_thread.start()
    
    print("[JARVIS] Starting web server...")
    print(f"[JARVIS] Jarvis is running at: {url}")
    print("[JARVIS] Press Ctrl+C to stop the server")
    
    # Start Eel server
    try:
        eel.start(
            "index.html",
            mode=None,  # Use default browser (not embedded)
            host="localhost",
            port=8000,
            block=True,
            shutdown_closed=True,
        )
    except KeyboardInterrupt:
        print("\n[JARVIS] Shutting down...")
    except Exception as e:
        print(f"[JARVIS] Server error: {e}")
    finally:
        print("[JARVIS] Jarvis stopped")


if __name__ == "__main__":
    start()
