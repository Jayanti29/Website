const quizForm = document.getElementById("quizForm");
const quizResult = document.getElementById("quizResult");
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");
const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

quizForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(quizForm);
  const goal = data.get("goal");
  const caffeine = data.get("caffeine");

  let rec = "Focus Leaf";
  if (goal === "calm") rec = "Calm Bloom";
  if (goal === "digestion") rec = "Digest Ease";
  if (goal === "energy") rec = "Morning Lift";
  if (goal === "focus" && caffeine === "none") rec = "Digest Ease";

  quizResult.textContent = `Recommended for you: ${rec}`;
});

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get("name") || "there");
  contactStatus.textContent = `Thanks ${name}, your message was received. Our team will reply soon.`;
  contactForm.reset();
});

chatToggle?.addEventListener("click", () => (chatBox.hidden = false));
chatClose?.addEventListener("click", () => (chatBox.hidden = true));

function addMsg(type, text) {
  const div = document.createElement("div");
  div.className = type;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function localBotReply(input) {
  const q = input.toLowerCase();

  if (q.includes("shipping")) return "Shipping takes 3-6 business days in India. Express delivery is available in metro cities.";
  if (q.includes("return")) return "Returns are accepted within 7 days for unopened packs. Share your order ID and we’ll help.";
  if (q.includes("calm") || q.includes("stress")) return "For stress relief, try Calm Bloom (chamomile + lavender + tulsi).";
  if (q.includes("digestion")) return "For digestion, Digest Ease (ginger + fennel + peppermint) works best.";
  if (q.includes("focus")) return "For focus, try Focus Leaf with low caffeine and fresh herbal notes.";
  if (q.includes("energy")) return "For morning energy, Morning Lift is ideal with medium caffeine.";
  if (q.includes("order")) return "Please share your order ID and email. I can help with tracking and support.";
  return "I can help with tea recommendations, ingredients, shipping, returns, and order support. What do you need?";
}

async function aiReply(input) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
    if (!res.ok) throw new Error("API not available");
    const data = await res.json();
    return data.reply || localBotReply(input);
  } catch {
    return localBotReply(input);
  }
}

chatForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addMsg("user", text);
  chatInput.value = "";

  addMsg("bot", "Typing...");
  const typing = chatMessages.lastElementChild;

  const reply = await aiReply(text);
  typing.textContent = reply;
});
