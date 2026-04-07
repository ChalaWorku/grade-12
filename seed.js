const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const MONGO_URI = "mongodb://127.0.0.1:27017/quiz_db";

const QuestionSchema = new mongoose.Schema({
  category: String,
  question: String,
  options: [String],
  correct: String,
  explanation: String,
});

const Question = mongoose.model("Question", QuestionSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Question.deleteMany({});

    // Read questions.json
    const rawData = fs.readFileSync(path.join(__dirname, "src", "questions.json"));
    const data = JSON.parse(rawData);

    let allQuestions = [];

    // Flatten data from categories
    for (const category in data) {
      console.log(`Processing category: ${category}`);
      const questionsWithCategory = data[category].map((q) => ({
        ...q,
        category: category,
      }));
      allQuestions = [...allQuestions, ...questionsWithCategory];
    }

    // Insert to MongoDB
    await Question.insertMany(allQuestions);
    console.log(`${allQuestions.length} gaaffiiwwan MongoDB irratti ol-fe'amaniiru! ✅`);

    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
