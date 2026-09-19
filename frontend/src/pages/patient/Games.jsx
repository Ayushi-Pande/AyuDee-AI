import {
  BrainCircuit,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
/* Game state intentionally synchronizes timed rounds and persistence through effects. */
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import PatientLayout from "../../components/common/PatientLayout";
import SectionHeader from "../../components/common/SectionHeader";
import { apiService } from "../../services/api";

const GAME_LIBRARY = [
  {
    id: "memory-match",
    name: "Memory Match",
    difficulty: "Easy",
    duration: "2 min",
    description: "Match familiar symbols and strengthen recall.",
    accent: "from-violet-500 to-fuchsia-400",
  },
  {
    id: "pattern-recall",
    name: "Pattern Recall",
    difficulty: "Medium",
    duration: "3 min",
    description: "Watch the pattern and repeat it with confidence.",
    accent: "from-amber-400 to-orange-300",
  },
  {
    id: "quick-quiz",
    name: "Quick Quiz",
    difficulty: "Easy",
    duration: "2 min",
    description: "Answer small everyday memory questions.",
    accent: "from-emerald-500 to-teal-400",
  },
  {
    id: "sequence-tap",
    name: "Sequence Tap",
    difficulty: "Medium",
    duration: "2 min",
    description: "Tap the numbers in order as the sequence grows.",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    id: "color-match",
    name: "Color Match",
    difficulty: "Easy",
    duration: "1 min",
    description: "Choose the color that matches the target prompt.",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    id: "word-recall",
    name: "Word Recall",
    difficulty: "Medium",
    duration: "2 min",
    description: "Read a few everyday words, then recall them gently.",
    accent: "from-teal-500 to-emerald-400",
  },
];

const MEMORY_SYMBOLS = [
  { id: "flower", symbol: "🌼", label: "Flower" },
  { id: "home", symbol: "🏠", label: "Home" },
  { id: "heart", symbol: "💜", label: "Heart" },
  { id: "sun", symbol: "☀️", label: "Sun" },
];

const QUIZ_QUESTIONS = [
  { question: "Which season comes after summer?", options: ["Autumn", "Winter", "Spring", "Morning"], answer: "Autumn" },
  { question: "Which object is used to tell time?", options: ["Clock", "Book", "Spoon", "Lamp"], answer: "Clock" },
  { question: "Which of these is a fruit?", options: ["Apple", "Chair", "Window", "Shoes"], answer: "Apple" },
  { question: "Which day comes after Monday?", options: ["Tuesday", "Thursday", "Sunday", "Friday"], answer: "Tuesday" },
  { question: "What do we usually do before bedtime?", options: ["Brush teeth", "Jump rope", "Wash a car", "Cook lunch"], answer: "Brush teeth" },
];

const PATTERN_COLORS = [
  { id: 0, label: "Violet", value: "violet", className: "bg-violet-500" },
  { id: 1, label: "Rose", value: "rose", className: "bg-rose-400" },
  { id: 2, label: "Amber", value: "amber", className: "bg-amber-400" },
  { id: 3, label: "Emerald", value: "emerald", className: "bg-emerald-500" },
];

const COLOR_OPTIONS = ["Blue", "Teal", "Coral", "Amber"];
const WORD_BANK = ["Garden", "Lantern", "Coffee", "River", "Family", "Morning", "Book", "Music"];

function shuffleSequence(level) {
  return Array.from({ length: level }, (_, index) => index + 1).sort(() => Math.random() - 0.5);
}

function shuffleCards() {
  const pairs = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS]
    .map((item, index) => ({ ...item, key: `${item.id}-${index}` }))
    .sort(() => Math.random() - 0.5);

  return pairs.map((card, index) => ({ ...card, matched: false, reveal: false, index }));
}

export default function PatientGames() {
  const [selectedGame, setSelectedGame] = useState(GAME_LIBRARY[0]);
  const [memoryCards, setMemoryCards] = useState(() => shuffleCards());
  const [selectedCards, setSelectedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [memoryComplete, setMemoryComplete] = useState(false);
  const [memoryTime, setMemoryTime] = useState(0);
  const [memoryBest, setMemoryBest] = useState(() => Number(localStorage.getItem("ayudee-memory-best") || 0));
  const [patternSequence, setPatternSequence] = useState([]);
  const [patternInput, setPatternInput] = useState([]);
  const [patternRound, setPatternRound] = useState(1);
  const [patternBest, setPatternBest] = useState(0);
  const [patternMessage, setPatternMessage] = useState("Watch the pattern and repeat it.");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState("");
  const [sequenceLevel, setSequenceLevel] = useState(3);
  const [sequenceOrder, setSequenceOrder] = useState(() => shuffleSequence(3));
  const [sequenceNext, setSequenceNext] = useState(1);
  const [sequenceMessage, setSequenceMessage] = useState("Tap 1, then 2, then 3.");
  const [sequenceBest, setSequenceBest] = useState(() => Number(localStorage.getItem("ayudee-sequence-best") || 0));
  const [colorTarget, setColorTarget] = useState("Blue");
  const [colorScore, setColorScore] = useState(0);
  const [colorMessage, setColorMessage] = useState("Choose the matching color.");
  const [wordWords, setWordWords] = useState([]);
  const [wordChoices, setWordChoices] = useState([]);
  const [wordVisible, setWordVisible] = useState(false);
  const [wordSelected, setWordSelected] = useState([]);
  const [wordScore, setWordScore] = useState(0);
  const [wordMessage, setWordMessage] = useState("Watch the words, then choose what you remember.");
  useEffect(() => {
    const saved = Number(localStorage.getItem("ayudee-pattern-best") || 0);
    setPatternBest(saved);
  }, []);

  useEffect(() => {
    if (!selectedGame || selectedGame.id !== "memory-match") return;

    const timer = window.setInterval(() => {
      setMemoryTime((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [selectedGame, memoryComplete]);

  useEffect(() => {
    if (selectedCards.length !== 2) return;

    const [firstCard, secondCard] = selectedCards;
    if (firstCard.id !== secondCard.id) {
      setMoves((current) => current + 1);
      window.setTimeout(() => {
        setMemoryCards((current) =>
          current.map((card) => {
            if (card.key === firstCard.key || card.key === secondCard.key) {
              return { ...card, reveal: false };
            }
            return card;
          }),
        );
      }, 700);
      return;
    }

    setMatches((current) => current + 1);
    setMemoryCards((current) =>
      current.map((card) => (card.key === firstCard.key || card.key === secondCard.key ? { ...card, matched: true, reveal: true } : card)),
    );
    setSelectedCards([]);
  }, [selectedCards]);

  useEffect(() => {
    if (matches === 4 && !memoryComplete) {
      setMemoryComplete(true);
      const score = Math.max(0, 1000 - moves * 50 - memoryTime * 5);
      if (score > memoryBest) {
        setMemoryBest(score);
        localStorage.setItem("ayudee-memory-best", String(score));
      }
      apiService.createGameResult({
        patient_id: "patient-001",
        game_name: "Memory Match",
        score: 1,
        attempts: moves || 1,
        completed: true,
      }).catch(() => undefined);
    }
  }, [matches, moves, memoryBest, memoryTime, memoryComplete]);

  const resetMemoryGame = () => {
    setMemoryCards(shuffleCards());
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setMemoryComplete(false);
    setMemoryTime(0);
  };

  const startPatternRound = (nextRound = patternRound) => {
    const sequence = Array.from({ length: nextRound }, () => Math.floor(Math.random() * PATTERN_COLORS.length));
    setPatternSequence(sequence);
    setPatternInput([]);
    setPatternMessage("Watch carefully...");

    sequence.forEach((value, index) => {
      window.setTimeout(() => {
        const button = document.getElementById(`pattern-${value}`);
        if (button) {
          button.classList.add("scale-110", "ring-4", "ring-white");
          window.setTimeout(() => button.classList.remove("scale-110", "ring-4", "ring-white"), 350);
        }
      }, index * 550);
    });

    window.setTimeout(() => setPatternMessage("Your turn — repeat the pattern."), sequence.length * 550 + 150);
  };

  useEffect(() => {
    if (selectedGame.id === "pattern-recall" && patternSequence.length === 0) {
      startPatternRound(1);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (selectedGame.id === "word-recall" && wordWords.length === 0) {
      startWordRound();
    }
  }, [selectedGame]);

  function startWordRound() {
    const words = [...WORD_BANK].sort(() => Math.random() - 0.5).slice(0, 4);
    const choices = [...words, ...WORD_BANK.filter((word) => !words.includes(word)).slice(0, 2)].sort(() => Math.random() - 0.5);
    setWordWords(words);
    setWordChoices(choices);
    setWordSelected([]);
    setWordVisible(true);
    setWordMessage("Remember these words...");
    window.setTimeout(() => { setWordVisible(false); setWordMessage("Which words did you see?"); }, 3500);
  }

  const handleWordChoice = async (word) => {
    if (wordSelected.includes(word) || wordVisible) return;
    const nextSelected = [...wordSelected, word];
    setWordSelected(nextSelected);
    if (wordWords.includes(word)) {
      const nextScore = wordScore + 1;
      setWordScore(nextScore);
      setWordMessage(`${nextScore} remembered so far.`);
      if (nextSelected.length === wordWords.length) {
        await apiService.createGameResult({ patient_id: "patient-001", game_name: "Word Recall", score: nextScore, attempts: wordWords.length, completed: true }).catch(() => undefined);
      }
    } else {
      setWordMessage("That word was not in this round. Keep exploring.");
    }
  };

  const handleColorChoice = async (color) => {
    if (color === colorTarget) {
      const nextScore = colorScore + 1;
      setColorScore(nextScore);
      setColorMessage("Great match. Find the next one.");
      setColorTarget(COLOR_OPTIONS[(colorScore + 1) % COLOR_OPTIONS.length]);
      await apiService.createGameResult({ patient_id: "patient-001", game_name: "Color Match", score: nextScore, attempts: nextScore, completed: false }).catch(() => undefined);
    } else {
      setColorMessage("Not quite. Take another look at the target.");
    }
  };

  const handlePatternChoice = (choice) => {
    const nextPatternInput = [...patternInput, choice];
    setPatternInput(nextPatternInput);

    const expected = patternSequence[nextPatternInput.length - 1];
    if (choice !== expected) {
      setPatternMessage("Almost! Let’s try that pattern again.");
      setPatternRound(1);
      window.setTimeout(() => startPatternRound(1), 1200);
      setPatternInput([]);
      return;
    }

    if (nextPatternInput.length === patternSequence.length) {
      const nextRound = patternRound + 1;
      const newBest = Math.max(patternBest, nextRound - 1);
      setPatternBest(newBest);
      localStorage.setItem("ayudee-pattern-best", String(newBest));
      setPatternRound(nextRound);
      setPatternMessage("Great job! Next round is starting.");
      window.setTimeout(() => startPatternRound(nextRound), 800);
    }
  };

  const handleMemoryCardClick = (card) => {
    if (card.matched || card.reveal || selectedCards.some((selected) => selected.key === card.key)) return;
    setMemoryCards((current) => current.map((item) => (item.key === card.key ? { ...item, reveal: true } : item)));
    setSelectedCards((current) => [...current, card]);
  };

  const handleQuizAnswer = async (option) => {
    const currentQuestion = QUIZ_QUESTIONS[quizIndex];
    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) {
      setQuizScore((current) => current + 1);
    }

    const nextQuestion = quizIndex + 1;
    if (nextQuestion < QUIZ_QUESTIONS.length) {
      setQuizIndex(nextQuestion);
      return;
    }

    const finalScore = isCorrect ? quizScore + 1 : quizScore;
    setQuizResults(`Wonderful! You scored ${finalScore} out of ${QUIZ_QUESTIONS.length}.`);
    await apiService.createGameResult({
      patient_id: "patient-001",
      game_name: "Quick Quiz",
      score: finalScore,
      attempts: QUIZ_QUESTIONS.length,
      completed: true,
    }).catch(() => undefined);
  };

  const handleSequenceTap = async (value) => {
    if (value !== sequenceNext) {
      setSequenceMessage("Almost. Start the sequence again when you are ready.");
      setSequenceNext(1);
      return;
    }
    if (sequenceNext === sequenceLevel) {
      const nextLevel = sequenceLevel + 1;
      setSequenceLevel(nextLevel);
      if (nextLevel > sequenceBest) {
        setSequenceBest(nextLevel);
        localStorage.setItem("ayudee-sequence-best", String(nextLevel));
      }
      setSequenceOrder(shuffleSequence(nextLevel));
      setSequenceNext(1);
      setSequenceMessage(`Great work. Now tap 1 through ${nextLevel}.`);
      await apiService.createGameResult({ patient_id: "patient-001", game_name: "Sequence Tap", score: nextLevel, attempts: nextLevel, completed: true }).catch(() => undefined);
      return;
    }
    setSequenceNext((current) => current + 1);
  };

  const renderGameContent = () => {
    if (selectedGame.id === "memory-match") {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-4">
            {memoryCards.map((card) => (
              <button
                key={card.key}
                type="button"
                onClick={() => handleMemoryCardClick(card)}
                className={`flex aspect-square items-center justify-center rounded-2xl text-3xl font-black transition ${
                  card.reveal || card.matched
                    ? "bg-violet-100 text-violet-700 shadow-inner"
                    : "bg-slate-100 text-slate-500 hover:bg-violet-50"
                } ${card.matched ? "ring-2 ring-emerald-300" : ""}`}
              >
                {card.reveal || card.matched ? card.symbol : "?"}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Moves</p><p className="mt-2 text-2xl font-black text-slate-800">{moves}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Matches</p><p className="mt-2 text-2xl font-black text-slate-800">{matches}/4</p></div>
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Time</p><p className="mt-2 text-2xl font-black text-slate-800">{memoryTime}s</p></div>
          </div>

          {memoryComplete ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <p className="mt-1 text-sm">Completed in {moves} moves and {memoryTime} seconds.</p>
            </div>
          ) : null}

          <div className="flex gap-3">
            <button type="button" onClick={resetMemoryGame} className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 font-semibold text-white"><RotateCcw size={16} /> Play Again</button>
            <button type="button" onClick={() => setSelectedGame(GAME_LIBRARY[0])} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700">Back to Games</button>
          </div>
        </div>
      );
    }

    if (selectedGame.id === "pattern-recall") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl bg-violet-50 p-4 text-sm text-violet-800 ring-1 ring-violet-100">{patternMessage}</div>
          <div className="grid grid-cols-2 gap-3">
            {PATTERN_COLORS.map((color) => (
              <button
                key={color.id}
                id={`pattern-${color.id}`}
                type="button"
                onClick={() => handlePatternChoice(color.id)}
                className={`h-20 rounded-2xl ${color.className} text-lg font-black text-white shadow-sm transition`}
              >
                {color.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Round</p><p className="mt-2 text-2xl font-black text-slate-800">{patternRound}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Best</p><p className="mt-2 text-2xl font-black text-slate-800">{patternBest}</p></div>
          </div>

          <button type="button" onClick={() => startPatternRound(patternRound)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700"><RotateCcw size={16} /> Replay pattern</button>
        </div>
      );
    }

    if (selectedGame.id === "sequence-tap") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl bg-cyan-50 p-4 text-sm font-medium text-[#0369A1]">{sequenceMessage}</div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {sequenceOrder.map((value) => <button key={value} type="button" onClick={() => handleSequenceTap(value)} className="flex aspect-square items-center justify-center rounded-2xl bg-[#082F49] text-2xl font-black text-white transition hover:bg-[#0369A1]">{value}</button>)}
          </div>
          <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Level</p><p className="mt-2 text-2xl font-black text-[#082F49]">{sequenceLevel - 2}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next</p><p className="mt-2 text-2xl font-black text-[#082F49]">{sequenceNext}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Best</p><p className="mt-2 text-2xl font-black text-[#082F49]">{sequenceBest}</p></div></div>
          <button type="button" onClick={() => { setSequenceLevel(3); setSequenceOrder(shuffleSequence(3)); setSequenceNext(1); setSequenceMessage("Tap 1, then 2, then 3."); }} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700"><RotateCcw size={16} /> Restart sequence</button>
        </div>
      );
    }

    if (selectedGame.id === "color-match") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl bg-cyan-50 p-4 text-sm font-medium text-[#0369A1]">{colorMessage}</div>
          <div className="rounded-2xl bg-[#082F49] p-6 text-center text-white"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Target color</p><p className="mt-3 text-4xl font-black">{colorTarget}</p><p className="mt-2 text-sm text-sky-100/70">Score {colorScore}</p></div>
          <div className="grid grid-cols-2 gap-3">{COLOR_OPTIONS.map((color) => <button key={color} type="button" onClick={() => handleColorChoice(color)} className={`min-h-16 rounded-2xl font-black text-white ${color === "Blue" ? "bg-blue-500" : color === "Teal" ? "bg-teal-500" : color === "Coral" ? "bg-rose-400" : "bg-amber-400"}`}>{color}</button>)}</div>
          <button type="button" onClick={() => { setColorScore(0); setColorTarget("Blue"); setColorMessage("Choose the matching color."); }} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700"><RotateCcw size={16} /> Restart color match</button>
        </div>
      );
    }

    if (selectedGame.id === "word-recall") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{wordMessage}</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{(wordVisible ? wordWords : wordChoices).map((word) => <button key={word} type="button" onClick={() => handleWordChoice(word)} disabled={wordVisible || wordSelected.includes(word)} className={`min-h-16 rounded-2xl border px-3 py-3 font-black transition ${wordVisible ? "border-emerald-200 bg-emerald-100 text-emerald-800" : wordSelected.includes(word) ? "border-slate-200 bg-slate-100 text-slate-400" : "border-emerald-100 bg-white text-[#062A45] hover:border-emerald-300"}`}>{word}</button>)}</div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span className="text-sm font-bold text-slate-500">Remembered</span><span className="text-2xl font-black text-[#062A45]">{wordScore}/{wordWords.length || 4}</span></div>
          <button type="button" onClick={startWordRound} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700"><RotateCcw size={16} /> New word round</button>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100">
          Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
        </div>

        {quizResults ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <p className="text-lg font-black">{quizResults}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-800">{QUIZ_QUESTIONS[quizIndex].question}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {QUIZ_QUESTIONS[quizIndex].options.map((option) => (
                <button key={option} type="button" onClick={() => handleQuizAnswer(option)} className="rounded-2xl border border-violet-100 bg-[#fffdf7] px-4 py-4 text-left text-base font-semibold text-slate-700 hover:border-violet-200 hover:bg-violet-50">
                  {option}
                </button>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Score</p><p className="mt-2 text-2xl font-black text-slate-800">{quizScore}</p></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PatientLayout title="Brain Studio" subtitle="Small daily activities to keep your mind active.">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#041F33,#087EA4)] p-7 text-white shadow-[0_22px_50px_rgba(4,31,51,0.2)]">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[38px] border-[#20B7D8]/20" />
          <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#8be6f2]">Brain Studio</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">Train gently. Grow steadily.</h2><p className="mt-3 max-w-xl text-sky-100/75">Small activities, meaningful progress, and a pace that belongs to you.</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[500px]"><GameStat label="Streak" value="4 days" /><GameStat label="Points" value="1,240" /><GameStat label="Level" value="6" /><GameStat label="Daily goal" value="2/3" /></div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="premium-card p-5">
            <SectionHeader title="Choose an activity" subtitle="Four ways to keep your attention engaged." />
            <div className="space-y-3">
              {GAME_LIBRARY.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setSelectedGame(game)}
                  className={`w-full rounded-[22px] border p-4 text-left transition ${
                    selectedGame.id === game.id
                      ? "border-violet-200 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${game.accent} text-white`}>
                      <BrainCircuit size={22} />
                    </div>
                    <div className="rounded-full border border-violet-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">
                      {game.difficulty}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-black">{game.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{game.description}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <span>{game.duration}</span>
                    <span>•</span>
                    <span>Best score: {game.id === "pattern-recall" ? patternBest : game.id === "memory-match" ? memoryBest : game.id === "sequence-tap" ? sequenceBest : game.id === "color-match" ? colorScore : game.id === "word-recall" ? wordScore : quizResults ? "5/5" : "0"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="premium-card p-5">
            <SectionHeader title={selectedGame.name} subtitle={selectedGame.description} />
            {renderGameContent()}
          </div>
        </div>

        <div className="rounded-[28px] bg-[#DDF7F5] p-6 shadow-[0_12px_28px_rgba(8,126,164,0.1)]">
          <div className="flex items-center gap-3 text-[#087EA4]">
            <Trophy size={22} />
            <h3 className="text-xl font-black">Gentle progress</h3>
          </div>
          <p className="mt-2 text-base text-slate-600">Small, steady wins build confidence. Keep going at a pace that feels calm and comfortable.</p>
        </div>
      </div>
    </PatientLayout>
  );
}

function GameStat({ label, value }) {
  return <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><p className="text-2xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-sky-100/70">{label}</p></div>;
}
