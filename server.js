const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000" 
}));

app.post("/run-prediction", (req, res) => {
  const csvData = req.body.csvData;

  const inputCsvPath = path.join(__dirname, "public", "updated_data.csv");
  fs.writeFileSync(inputCsvPath, csvData, "utf8");

  const scriptPath = path.join(__dirname, "public", "predict_timeseries.py");
  exec(`python ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${stderr}`);
      return res.status(500).json({ error: "Failed to run prediction script." });
    }
    console.log(`Script output: ${stdout}`);
    res.status(200).json({ message: "Prediction updated successfully!" });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
