import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
const app = express();
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { response: null });
});

app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question;

  if (!userQuestion) {
    return res.render("index", { response: "Please provide a question!!!." });
  }

  try {
    const result = await model.generateContent(userQuestion);

    res.render("index", { response: result.response.text() });
  } catch (err) {
    console.error("Error from API:", err.message);
    res.render("index", {
      response: "Sorry, something went wrong. Try again later.",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
