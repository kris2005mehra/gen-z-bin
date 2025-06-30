# ♻️ GenZ Bin – Smart Waste Classification

A modern, AI-powered web for classifying waste using machine learning and image recognition.
Built using React + Tailwind CSS + Lucide Icons

---

# 🧠 Overview

GenZ Bin is a smart web-based waste classifier that helps users identify and categorize different types of waste using a trained machine learning model. The system offers both camera capture and image upload functionalities, and provides confidence scores for predictions in real time.


---

# 🎯 Features

✅ Real-time waste classification using Firebase-deployed ML model

📸 Upload or capture images via webcam

📊 Displays waste category & confidence level

🧠 Interactive visual references for waste types

⚡ Clean, responsive UI with animated feedback

💾 Firebase integration for model loading and processing (Optional)


---

# 🛠️ Tech Stack

Layer	Technology

Frontend	React + TypeScript + Tailwind CSS

Icons	Lucide React

ML	TensorFlow/Keras (converted to TFLite), served via Firebase ML
Backend	Firebase Realtime Database (optional)

Others	Hooks, Ref-based image processing, Lazy model loading



---

# 🔍 Waste Types Supported

Type	Example

Plastic	Bottles, containers, wrappers
Metal	Cans, utensils
Glass	Bottles, jars
Paper	Newspapers, cardboard
E-Waste	Phones, cables, batteries
Trash	Mixed/unknown waste


Each class is associated with a visual reference for learning and validation.


---

# 🚀 Getting Started

1. Clone & Install

git clone https://github.com/your-username/genz-bin.git
cd genz-bin
npm install

2. Run the App

npm run dev



---

# 🧠 ML Model

Architecture: CNN with ~85%+ accuracy

Trained on: Recyclable Household Waste Dataset (Kaggle)

Classes: plastic, metal, glass, paper, ewaste, trash

Deployment: Firebase ML Kit / TensorFlow Lite Web


You can improve model performance by collecting user feedback and retraining regularly.




---

# 📸 Demo Screenshots

<img width="1440" alt="Screenshot 2025-06-29 at 3 36 16 AM" src="https://github.com/user-attachments/assets/49aa5013-fa85-451c-a057-fc4fb7e94ce2" />
<img width="1440" alt="Screenshot 2025-06-29 at 3 36 39 AM" src="https://github.com/user-attachments/assets/67cc52a8-c9ef-4946-a542-4c550545b420" />
<img width="1440" alt="Screenshot 2025-06-29 at 3 37 17 AM" src="https://github.com/user-attachments/assets/f388ed5e-5a89-4034-bf92-24dc86f21f18" />
<img width="1440" alt="Screenshot 2025-06-29 at 3 37 50 AM" src="https://github.com/user-attachments/assets/45930722-9ac3-4fda-b4cc-96fada0dc1ce" />
<img width="1440" alt="Screenshot 2025-06-29 at 3 38 02 AM" src="https://github.com/user-attachments/assets/6e281f44-9de2-4cd4-a2fd-05d16be890c6" />






---

#💡 Future Plans

🔁 Feedback-based model improvement

🌐 Multilingual voice guidance

🗃️ Firebase Storage for uploaded waste images

📱 Convert to PWA for mobile devices




---

# ⭐ Support & Contribute

If you found this helpful, please ⭐ star the repo
Feel free to fork, contribute, or raise issues


---

# 📜 License

This project is open source under the MIT License.
