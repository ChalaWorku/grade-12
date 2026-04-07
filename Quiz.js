import React, { useState } from "react";
import questionData from './src/questions.json';

export default function App() {
  const [subject, setSubject] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = subject ? (questionData[subject] || []) : [];

  const handleAnswer = (opt) => {
    if (isAnswered) return;
    setSelected(opt);
    setIsAnswered(true);
    if (opt === questions[current].correct) {
      setScore(score + 1);
    } else {
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    setSelected("");
    setIsAnswered(false);
    setShowExplanation(false);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      alert(`Quiz xumurame! Score: ${score}/${questions.length}`);
      setSubject("");
      setCurrent(0);
      setScore(0);
    }
  };

  if (!subject) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>Subject Filadhu</h1>
        {Object.keys(questionData).map(s => (
          <button key={s} onClick={() => setSubject(s)} style={{ margin: "10px", padding: "10px 20px" }}>
            {s}
          </button>
        ))}
      </div>
    );
  }

  const currentQuestion = questions[current];

  return (
    <div style={{ padding: "20px", textAlign: "center", maxWidth: "600px", margin: "auto" }}>
      <h2>{subject}: Gaaffii {current + 1}</h2>
      <p>{currentQuestion?.question}</p>

      {currentQuestion?.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(opt)}
          disabled={isAnswered}
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "100%",
            background: isAnswered ? (opt === currentQuestion.correct ? "lightgreen" : (selected === opt ? "salmon" : "#eee")) : "#eee"
          }}
        >
          {opt}
        </button>
      ))}

      {isAnswered && (
        <div style={{ marginTop: "20px" }}>
          {showExplanation && <p style={{ color: "red" }}>{currentQuestion.explanation}</p>}
          <button onClick={nextQuestion} style={{ padding: "10px 20px" }}>
            {current + 1 < questions.length ? "Itti fuf" : "Xumuri"}
          </button>
        </div>
      )}
    </div>
  );
}
