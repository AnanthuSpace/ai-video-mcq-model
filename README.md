#  MCQ Assignment App

This is a fully functional **Multiple Choice Quiz Assignment** app built using **React**, **TypeScript**, **ShadCN UI**, **Tailwind CSS**, and **Radix UI**. It allows users to take an MCQ-based quiz, view results with feedback and explanations, and track their score and progress visually.

##  Features

-  Dynamic MCQ rendering with question-by-question navigation
-  Live progress bar for assignment completion
-  Custom accessible radio buttons using Radix UI and Lucide icons
-  Ability to return to the upload section from results
-  Score summary with percentage and color-coded feedback
-  Explanation for each question after submission
-  Modular, reusable components for radio buttons, cards, buttons, and alerts

##  Tech Stack

| Tech                    | Purpose                                                   |
|-------------------------|-----------------------------------------------------------|
| **React + TypeScript**  | Frontend development and typed component logic            |
| **Tailwind CSS**        | Utility-first CSS framework for responsive UI styling     |
| **ShadCN UI**           | Prebuilt modern and accessible UI components              |
| **Radix UI**            | Low-level UI primitives like RadioGroup, Tabs, etc.       |
| **Lucide Icons**        | Lightweight and customizable SVG icon library             |
| **Node.js + Express.js**| Backend API server for routing, processing, and file handling |
| **TypeScript (Backend)**| Ensures type safety and scalability for backend logic     |
| **MongoDB**             | NoSQL database to store transcripts, questions, metadata  |
| **Python + FastAPI**    | Hosts local AI endpoints (e.g., transcription and LLMs)   |
| **Whisper**             | Local speech-to-text transcription (open-source model)    |
| **Ollama + LLaMA/Mistral** | Local LLMs for generating MCQs using transcript chunks |


---

##  Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/mcq-assignment.git
   cd mcq-assignment


2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Navigate to the app**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Usage Instructions

1. Upload a video and generate MCQs from it (assumed backend integration).
2. The MCQ assignment appears with the first question.
3. Select an answer and use the navigation buttons or question map to move.
4. Submit when all questions are answered.
5. View score and detailed feedback with explanations.
6. Click "Complete Assignment" to finalize the process.
7. 
---

## 📌 Future Improvements

* Add timer functionality for each question
* Allow user login and saving progress
* Integrate backend for saving quiz data and results
* Dark mode support
* MCQ tagging and difficulty levels

---

## 🧑‍💻 Author

**Ananthu Mohan**
[GitHub]([https://github.com/your-username](https://github.com/AnanthuSpace))
[LinkedIn]([https://linkedin.com/in/your-profile](https://www.linkedin.com/in/ananthu-mohan-b3b1021a1/))

