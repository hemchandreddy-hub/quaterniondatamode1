
# Quaternion Bone Control (Three.js)

## Project Overview

This project shows how to **control a 3D character’s bones using quaternions** in **Three.js**.
Using sliders and number inputs, we can smoothly rotate the **right hand** and **right leg** of a 3D model in real time.


* Loading a 3D `.glb` character
* Accessing skeleton bones
* Rotating bones using **quaternions (axis–angle method)**
* Resetting the character to its original pose


## Technologies Used

* **HTML** – Page structure and UI
* **CSS** – Styling and layout
* **JavaScript (ES Modules)** – Logic
* **Three.js** – 3D rendering
* **GLTFLoader** – Loading `.glb` models
* **OrbitControls** – Mouse camera control




## Project Structure

```
/project-folder
│
├── index.html      → HTML structure
├── style.css       → UI styling
├── script.js       → Three.js logic
├── model.glb       → 3D character model
└── README.md       → Project description
```

---

## ▶️ How to Run the Project

1. Place all files in the same folder
2. Make sure `model.glb` exists in the folder
3. Run the project using a local server (recommended):
4. Open the provided localhost URL in a browser

## 📚 Learning Outcome

By studying this project, you will understand:

* How skeletons and bones work in Three.js
* Why quaternions are used instead of Euler rotations
* How to sync UI controls with 3D animations
* How to reset and manage bone poses

## ✅ Conclusion

This project is a beginner-friendly example of **real-time bone manipulation using quaternions**.
It can be extended to control more bones, add animations, or integrate with game engines.
