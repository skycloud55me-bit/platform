// script.js — منطق الذكاء الوجودي وتحليل الحالة

let selectedAvatar = null;
const responseBox = document.getElementById("ai-response");
const inputField = document.getElementById("user-input");
const startScreen = document.getElementById("start-screen");
const chatScreen = document.getElementById("chat-screen");

// اختيار الشخصية
function chooseAvatar(type) {
  selectedAvatar = type;
  document.querySelectorAll(".avatar").forEach((a) => {
    a.classList.remove("active");
  });
  const chosen = document.querySelector(`.avatar[data-avatar="${type}"]`);
  if (chosen) chosen.classList.add("active");
}

// بدء الرحلة
function startChat() {
  if (!selectedAvatar) {
    alert("من فضلك اختر شخصيتك أولاً 🌌");
    return;
  }
  startScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
  responseBox.textContent = "مرحبًا بك في رحلتك الداخلية 💫 كيف تشعر اليوم؟";
}

// العودة للاختيار
function goBack() {
  chatScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

// تحليل المشاعر الأساسية
function analyzeMood() {
  const text = inputField.value.trim();
  if (!text) return;

  const check = window.Security.preProcess(text);
  if (!check.allowed) {
    if (check.reason === "selfharm") {
      responseBox.textContent = window.Security.postProcessReply("", { selfHarm: true });
    } else {
      responseBox.textContent = window.Security.safeReplies.generic;
    }
    return;
  }

  const mood = detectMood(text);
  world.applyMood(mood);

  const reply = generateReply(mood);
  responseBox.textContent = window.Security.postProcessReply(reply);
  inputField.value = "";
}

// كشف الحالة بناءً على كلمات بسيطة
function detectMood(text) {
  const t = text.toLowerCase();
  if (/(حزين|دموع|مكتئب|وحيد)/.test(t)) return "sad";
  if (/(سعيد|فرح|مسرور|ممتن)/.test(t)) return "happy";
  if (/(غاضب|عصبي|منفعل)/.test(t)) return "angry";
  if (/(قلق|خائف|متوتر)/.test(t)) return "anxious";
  return "neutral";
}

// توليد الردود الذكية حسب الحالة
function generateReply(mood) {
  const replies = {
    sad: "أشعر بك تمامًا... أحيانًا الحزن لا يحتاج لحل، فقط لمساحة آمنة. خذ نفسًا عميقًا، أنت لست وحدك 🌧️",
    happy: "رائع! احتفل بهذه اللحظة كما هي، السعادة لا تحتاج تفسيرًا. دعها تملأك بالامتنان 🌞",
    angry: "الغضب طاقة قوية... حاول توجيهها نحو ما تستحقه لا ضد نفسك. كن رحيمًا بذاتك 🔥",
    anxious: "خذ لحظة تنفس ببطء، ركّز على ما يمكنك التحكم به الآن فقط. الهدوء لا يعني غياب القلق بل القدرة على السير معه 🌿",
    neutral: "أحيانًا الحياد هو بداية اكتشاف أعمق. ما رأيك أن تخبرني أكثر عما تفكر به الآن؟ 🌙",
  };
  return replies[mood] || replies.neutral;
}

// عند الضغط على Enter
inputField?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") analyzeMood();
});
