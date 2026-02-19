const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve all static files (CSS, JS, images)
app.use(express.static(__dirname));
app.use(express.json());

app.post("/api/chat", (req, res) => {
  const message = req.body.message?.toLowerCase() || "";

  let reply = "I can help with tea recommendations and orders.";

  if (message.includes("shipping"))
    reply = "Shipping takes 3-6 business days in India.";
  else if (message.includes("return"))
    reply = "Returns are accepted within 7 days for unopened packs.";
  else if (message.includes("calm"))
    reply = "Calm Bloom is perfect for stress relief.";
  else if (message.includes("focus"))
    reply = "Focus Leaf helps with clarity and low caffeine support.";

  res.json({ reply });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
