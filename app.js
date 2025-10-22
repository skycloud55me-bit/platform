let chosenAvatar = null;

window.onload = function() {
  document.getElementById("start-screen").style.display = "block";
};

function chooseAvatar(type) {
  chosenAvatar = type;
  alert("تم اختيار شخصية " + (type === "male" ? "ذكر" : "أنثى"));
}

function startChat() {
  if (!chosenAvatar) {
    alert("الرجاء اختيار الشخصية أولاً 🧍‍♀️🧍‍♂️");
    return;
  }
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("chat-screen").style.display = "block";
}

async function analyzeMood() {
  const input = document.getElementById('user-input').value.trim();
  const responseBox = document.getElementById('ai-response');

  if (!input) {
    responseBox.textContent = "من فضلك عبّر عن شعورك أولاً 🌼";
    return;
  }

  if (!window.Security.checkInput(input)) {
    responseBox.textContent = "⚠️ تم حظر بعض الكلمات غير المسموح بها.";
    return;
  }

  let mood = detectMood(input);
  let reply = generateResponse(mood);
  responseBox.textContent = reply;
  enterWorld(mood, chosenAvatar);
}

function detectMood(text) {
  const sadness = ["حزين", "محبط", "يائس", "متعب", "ضائع"];
  const happiness = ["سعيد", "فرحان", "مرتاح", "متحمس"];
  const anger = ["غاضب", "عصبي", "مستاء", "مقهور"];
  const anxiety = ["قلق", "خائف", "متوتر"];

  if (sadness.some(w => text.includes(w))) return "sad";
  if (happiness.some(w => text.includes(w))) return "happy";
  if (anger.some(w => text.includes(w))) return "angry";
  if (anxiety.some(w => text.includes(w))) return "anxious";
  return "neutral";
}

function generateResponse(mood) {
  switch (mood) {
    case "sad":
      return "يبدو أنك تمر بيوم صعب 💔. امنح نفسك الراحة والوقت، فالغد قد يحمل لك ابتسامة.";
    case "happy":
      return "جميل جدًا! 😊 استمتع بلحظتك وشارك البهجة مع من حولك.";
    case "angry":
      return "خذ لحظة للهدوء 😌، الغضب مؤقت لكن الوعي دائم.";
    case "anxious":
      return "تنفس ببطء 🌸، أنت أقوى من أفكارك المقلقة.";
    default:
      return "أنا هنا لأستمع إليك 🌿. أخبرني أكثر عن شعورك؟";
  }
}
