const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

// CORS config - allow all for local dev
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// MongoDB connection string (127.0.0.1 is more stable than localhost on Windows)
const MONGO_URI = "mongodb+srv://workuchala739_db_user:8Ud9JpsNMTON9zzN@cluster0.8wkptwr.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB waliin walitti hidhameera! ✅");
    const count = await Question.countDocuments();
    console.log(`Database keessatti gaaffiiwwan ${count} argamaniiru.`);
  })
  .catch((err) => {
    console.error("MongoDB waliin walitti hidhuun hin danda'amne! ❌");
    console.error("MAALOO: MongoDB kompiitara kee irratti 'Start' gochuu kee mirkaneessi.");
    console.error("Error detail:", err.message);
  });

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Schema uumuuf (Gaaffiiwwan store gochuuf)
const QuestionSchema = new mongoose.Schema({
  category: String,
  question: String,
  options: [String],
  correct: String,
  explanation: String,
});

const Question = mongoose.model("Question", QuestionSchema);

// Gaaffiiwwan hunda fiduuf
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Category'n fiduuf
app.get("/api/questions/:category", async (req, res) => {
  const category = req.params.category;
  console.log(`Fetching questions for category: ${category}`);
  try {
    const questions = await Question.find({ category: category });
    console.log(`Found ${questions.length} questions for ${category}`);
    res.json(questions);
  } catch (err) {
    console.error(`Error fetching questions for ${category}:`, err);
    res.status(500).json({ message: err.message });
  }
});

// Gaaffii haaraa dabaluuf
app.post("/api/questions", async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server hojjachaa jira...");
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n==================================================`);
  console.log(`  SERVER HOJJACHAA JIRA! ✅`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Teessoo: http://127.0.0.1:${PORT}`);
  console.log(`==================================================\n`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ RAKKOO: Port ${PORT} duraan banamee jira!`);
    console.error(`Maaloo terminal hunda cufii 'npm run all' irra deebi'ii barreessi.\n`);
  } else {
    console.error(`❌ Server error:`, err);
  }
  process.exit(1);
});
