require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./database/db");
const morgan = require("morgan");
const port = process.env.PORT || 3000;
const setupSocket = require("./socket");
const http = require("http");

const cors = require("cors");

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/businessDoc", express.static("businessDoc"));

const adminRouter = require("./routes/login");
const userRouter = require("./routes/user");
const attendenceRouter = require("./routes/attendence");
const leaveRouter = require("./routes/leaveApp");
const dailyReportRouter = require("./routes/dailyReport");
const salaryRouter = require("./routes/salary");
const cvRouter = require("./routes/cv-manage");
const meetingNotiRouter = require("./routes/meetingNoti");
const projectRouter = require("./routes/project");
const businessDocRouter = require("./routes/businessDoc");
const estimationRouter = require("./routes/estimationForm");
const notificationRouter = require("./routes/notification.routes");
const announcementRouter = require("./routes/Announcement.routes");
const schedulerRouter = require("./routes/Scheduler.routes");

app.use("/api/v2", adminRouter);
app.use("/api/v2", userRouter);
app.use("/api/v2", adminRouter);
app.use("/api/v2", userRouter);
app.use("/api/v2", attendenceRouter);
app.use("/api/v2", leaveRouter);
app.use("/api/v2", dailyReportRouter);
app.use("/api/v2", salaryRouter);
app.use("/api/v2", cvRouter);
app.use("/api/v2", meetingNotiRouter);
app.use("/api/v2", projectRouter);
app.use("/api/v2", businessDocRouter);
app.use("/api/v2", estimationRouter);
app.use("/api/v2", notificationRouter);
app.use("/api/v2", announcementRouter);
app.use("/api/v2", schedulerRouter);

app.get("/", (req, res) => {
  res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; height: 200px'>Welcome To Office Management System!</h1>"
  );
});

const server = http.createServer(app);

setupSocket(server);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};

start();
server.listen(port, () => {
  console.log(`Listening port ${port}`);
});
