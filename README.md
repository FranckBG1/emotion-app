# 🎭 Emotion App — Real-Time Emotion Detection

> Browser-based emotion detection module, designed to be embedded as an iframe
> within the [Zenflow](https://github.com/FranckBG1/agentic-ia-agent) mental health chatbot.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat&logo=tensorflow&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)

---

## 📌 Context

Emotion App is a standalone front-end module built as part of the **Zenflow** project —
a multi-agent mental health chatbot developed during the
**GCPU Agentic AI Hackathon (Google Cloud, 2025)**.

The module captures the user's emotional state in real time via the browser camera,
and feeds the detected emotion as an input parameter to Zenflow's `CollectionAgent`,
removing the need for the user to manually describe how they feel.

It runs **entirely client-side** — the model is loaded and executed directly in the
browser using TensorFlow.js, with no server round-trip, minimizing latency.

---

## ✨ Features

- 📷 **Real-time webcam capture** — live video stream processed frame by frame
- 🧠 **On-device inference** — emotion detection model runs locally in the browser
- 🎯 **7 emotion classes** — Happy, Sad, Angry, Fearful, Disgusted, Surprised, Neutral
- 🔌 **Embeddable** — designed to be used as an `<iframe>` in any web or mobile interface
- ⚡ **Zero latency** — no backend call required for inference
- 🔒 **Privacy-first** — no video data is sent to any server

---

## 🏗️ Architecture

emotion-frontend/
├── index.html            # Entry point — camera permission & model loader
├── emotion-capture.html  # Capture page — live inference loop & result output
└── models/               # Pre-trained TensorFlow.js model (weights + topology)



**Flow:**

Browser Camera → Canvas frame extraction → TensorFlow.js model inference
→ Detected emotion label → Exposed to parent window (Zenflow)



The detected emotion is communicated to the parent Zenflow interface via
`window.postMessage`, enabling seamless integration without tight coupling.

---

## 🛠️ Tech Stack

| Layer      | Technology          | Role                                 |
|------------|---------------------|--------------------------------------|
| Frontend   | HTML5 / JavaScript  | UI, camera access, inference loop    |
| ML Engine  | TensorFlow.js       | On-device emotion model execution    |
| Model      | Custom CNN (`.json` + weights) | Facial expression classification |
| Backend*   | Python / Flask      | Optional API layer & model serving   |
| Vision*    | OpenCV              | Frame preprocessing (server-side)    |

*\*Used during model training and optional server-side fallback.*

---

## 🚀 Getting Started

### Prerequisites

- A modern browser with **camera access** (Chrome / Firefox / Edge)
- A local server (required — `getUserMedia` does not work over `file://`)

### Run locally

```bash
# Clone the repo
git clone https://github.com/FranckBG1/emotion-app.git
cd emotion-app/emotion-frontend

# Serve with Python (simplest)
python -m http.server 8080

# Then open:
# http://localhost:8080
Allow camera permissions when prompted. The model loads automatically from the
/models directory.

🔌 Embedding in Zenflow (iframe)

<!-- In Zenflow's mobile interface -->
<iframe
  src="http://your-emotion-app-url/emotion-capture.html"
  allow="camera"
  width="320"
  height="240"
  frameborder="0"
  id="emotionFrame"
/>

<script>
  // Listen for detected emotion from the iframe
  window.addEventListener("message", (event) => {
    if (event.data.type === "emotion") {
      console.log("Detected emotion:", event.data.emotion);
      // → Pass to Zenflow's CollectionAgent
    }
  });
</script>
