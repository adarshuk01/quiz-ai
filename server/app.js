const express = require("express");
const cors = require("cors");
const pdfRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const dashboardRoutes = require("./routes/dashBoardRoutes");
const groupRoutes = require("./routes/groupRoutes");



const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/questionsets", pdfRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/group", groupRoutes);





app.use(errorHandler);

module.exports = app;
