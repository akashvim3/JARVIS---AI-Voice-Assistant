from sys import flags
import time
import cv2
import pyautogui as p
import os

# Configuration - Modify these values as needed
RECOGNITION_THRESHOLD = 100  # Lower is more strict
FACE_CONFIDENCE_DISPLAY = True

# Load known faces from config or use defaults
try:
    from backend.config import KNOWN_FACES
    names = [''] + list(KNOWN_FACES.values())
except ImportError:
    # Default known faces (add your names here)
    names = ['', '', 'Ankit']  # Index 1 = User 1, Index 2 = User 2, etc.


def AuthenticateFace():
    flag = ""
    # Local Binary Patterns Histograms
    recognizer = cv2.face.LBPHFaceRecognizer_create()

    # Use relative path for trainer file
    trainer_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                 'auth', 'trainer', 'trainer.yml')
    recognizer.read(trainer_path)
    
    # Use relative path for cascade file
    cascade_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                                 'haarcascade_frontalface_default.xml')
    faceCascade = cv2.CascadeClassifier(cascade_path)

    font = cv2.FONT_HERSHEY_SIMPLEX

    cam = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cam.set(3, 640)
    cam.set(4, 480)

    minW = 0.1 * cam.get(3)
    minH = 0.1 * cam.get(4)

    print("[JARVIS] Starting face authentication...")
    print("[JARVIS] Look at the camera. Press ESC to cancel.")
    
    while True:
        ret, img = cam.read()
        if not ret:
            print("[JARVIS] Failed to capture frame")
            break
            
        converted_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        faces = faceCascade.detectMultiScale(
            converted_image,
            scaleFactor=1.2,
            minNeighbors=5,
            minSize=(int(minW), int(minH)),
        )

        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

            id, accuracy = recognizer.predict(converted_image[y:y+h, x:x+w])

            if accuracy < RECOGNITION_THRESHOLD:
                if 0 <= id < len(names):
                    id = names[id]
                else:
                    id = "unknown"
                accuracy_text = "  {0}%".format(round(100 - accuracy))
                flag = 1
            else:
                id = "unknown"
                accuracy_text = "  {0}%".format(round(100 - accuracy))
                flag = 0

            cv2.putText(img, str(id), (x+5, y-5), font, 1, (255, 255, 255), 2)
            if FACE_CONFIDENCE_DISPLAY:
                cv2.putText(img, str(accuracy_text), (x+5, y+h-5),
                           font, 1, (255, 255, 0), 1)

        cv2.imshow('camera', img)

        k = cv2.waitKey(10) & 0xff
        if k == 27:  # ESC key
            print("[JARVIS] Face authentication cancelled by user")
            flag = 0
            break
        if flag == 1:
            print(f"[JARVIS] Face recognized: {id}")
            break

    cam.release()
    cv2.destroyAllWindows()
    return flag
 