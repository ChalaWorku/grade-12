"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState([]); // Save user answers for final review
  const [isFinished, setIsFinished] = useState(false);

  const subjects = ["Mathematics", "Biology", "Chemistry", "Physics", "English"];

  const handleLogin = (e) => {
    e.preventDefault();
    if (user.name && user.email) {
      setIsLoggedIn(true);
    }
  };

  const startQuiz = async (sub) => {
    setSubject(sub);
    setLoading(true);
    setError("");
    try {
      // 1. First check if backend is alive
      const healthCheck = await fetch("/api/health").catch(() => null);
      if (!healthCheck) {
        throw new Error("SERVER_DOWN");
      }

      // 2. Fetch questions
      const response = await fetch(`/api/questions/${sub}`);
      if (!response.ok) throw new Error("FETCH_ERROR");
      
      const data = await response.json();
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.message === "SERVER_DOWN") {
        setError("Backend (server.js) hojjachaa hin jiru! Terminal irratti 'npm run server' barreessi.");
      } else {
        setError("Gaaffiiwwan fiduu irratti rakkoon uumameera. Maaloo irra deebi'ii yaali.");
      }
      setLoading(false);
    }
  };

  const handleAnswer = (opt) => {
    setSelected(opt);
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    const isCorrect = selected === questions[current].correct;
    const newAnswers = [...answers, { 
      question: questions[current].question, 
      selected, 
      correct: questions[current].correct,
      explanation: questions[current].explanation,
      isCorrect 
    }];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected("");
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setSubject("");
    setQuestions([]);
    setCurrent(0);
    setScore(0);
    setAnswers([]);
    setIsFinished(false);
    setSelected("");
    setIsAnswered(false);
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-700">Chala Worku Center</h1>
            <p className="text-gray-500 mt-2">Maaloo maqaa fi email kee galchi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Maqaa kee"
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email (Gmail) kee"
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Seeni
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (!subject) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-lg text-gray-800">
            <div>
              <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Chala Worku Center</h1>
              <p className="text-gray-500">Baga nagaan dhufte, <span className="font-bold text-blue-600">{user.name}</span>!</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center overflow-hidden">
               <span className="text-blue-700 font-bold uppercase">{user.name[0]}</span>
            </div>
          </header>
          <h2 className="text-xl font-bold mb-6 text-gray-700 uppercase tracking-widest">Subject tokko filadhu:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => startQuiz(sub)}
                className="bg-white p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition">📚</div>
                <h3 className="text-xl font-bold text-gray-800">{sub}</h3>
                <p className="text-sm text-gray-500 mt-2 font-medium italic">Grade 12 Questions</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isFinished) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="bg-blue-700 text-white p-8 rounded-2xl shadow-lg mb-8 text-center">
            <h1 className="text-3xl font-bold uppercase">Qorumas Xumurame!</h1>
            <p className="mt-2 text-xl font-bold text-blue-100">Qabxii Kee: {score} / {questions.length}</p>
          </header>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Deebiiwwan Kee Mirkaneessi:</h2>
            {answers.map((ans, idx) => (
              <div key={idx} className={`p-6 rounded-2xl shadow-md border-l-8 bg-white ${ans.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <p className="text-lg font-bold text-gray-800 mb-2">{idx + 1}. {ans.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                  <p className="p-2 rounded-lg bg-gray-50 text-gray-800">Deebii Kee: <span className={ans.isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{ans.selected || "Deebii hin filanne"}</span></p>
                  <p className="p-2 rounded-lg bg-green-50 text-green-800">Deebii Sirrii: <span className="font-bold">{ans.correct}</span></p>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-gray-700 border border-blue-100">
                  <p className="font-bold text-blue-800 mb-1 uppercase text-xs tracking-wider">Ibsa (Explanation):</p>
                  {ans.explanation}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button onClick={restartQuiz} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-bold shadow-xl transform active:scale-95 transition-all text-xl">
              Gara Subject-filatutti Deebi'i
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-2xl font-bold animate-pulse text-blue-600">Gaaffiiwwan fidaa jira...</p></div>;
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-red-500 text-center max-w-md">
        <p className="text-xl font-bold text-red-600 mb-4 uppercase">Rakkoon uumameera! ❌</p>
        <p className="text-gray-700 mb-6">{error}</p>
        <button onClick={() => setSubject("")} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold">Irra deebi'ii yaali</button>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-yellow-500 max-w-md">
        <p className="text-2xl font-bold text-yellow-600 mb-4 uppercase">Gaaffiin hin argamne! ⚠️</p>
        <p className="text-gray-600 mb-6">Database keessa gaaffiiwwan subject "{subject}" hin jiran. Maaloo terminal irratti 'npm run seed' godhiitii yaali.</p>
        <button onClick={() => setSubject("")} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold">Duubatti Deebi'i</button>
      </div>
    </div>
  );

  const currentQuestion = questions[current];

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="bg-blue-700 text-white p-6 rounded-xl shadow-lg mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wide">Qorumas {subject}</h1>
            <p className="text-blue-100 text-sm font-medium">Barataa: {user.name}</p>
          </div>
          <div className="text-right">
             <p className="text-xs text-blue-200">{user.email}</p>
             <p className="font-bold text-xl">Score: {score}</p>
          </div>
        </header>
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
             <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${((current + 1) / questions.length) * 100}%` }}></div>
          </div>
          <div className="flex justify-between items-center mb-8 mt-2">
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter text-gray-800">Gaaffii {current + 1} / {questions.length}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 leading-tight">{currentQuestion.question}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selected === opt;
              let buttonStyle = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 text-lg font-bold flex items-center ";
              if (isSelected) {
                buttonStyle += "border-blue-600 bg-blue-50 text-blue-900 shadow-inner ring-4 ring-blue-100 transform scale-[1.02]";
              } else {
                buttonStyle += "border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer text-gray-700 shadow-sm";
              }
              return (
                <button key={i} onClick={() => handleAnswer(opt)} className={buttonStyle}>
                  <span className={`mr-4 w-10 h-10 rounded-xl flex items-center justify-center text-base font-black transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-12 flex justify-between items-center border-t pt-8">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Chala Worku Center</p>
            {isAnswered && (
              <button onClick={nextQuestion} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl transform active:scale-95 transition-all flex items-center uppercase tracking-widest text-sm">
                {current + 1 < questions.length ? "Itti fuf →" : "Submit (Xumuri)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
