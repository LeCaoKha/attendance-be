const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/classes", require("./routes/class.route"));
app.use("/api/children", require("./routes/child.route"));
app.use("/api/attendance", require("./routes/attendance.route"));

module.exports = app;
