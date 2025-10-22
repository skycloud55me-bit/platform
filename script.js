async function analyzeMood() {
  const input = document.getElementById('user-input').value.trim();
  const responseBox = document.getElementById('ai-response');

  if (!input) {
    responseBox.textContent = "من فضلك عبّر عن شعورك أولاً 🌼";
    return;
  }

  // تحليل المشاعر
  let mood = detectMood(input);

  // توليد رد ذكي
  let reply = generateResponse(mood);
  responseBox.textContent = reply;

  // عرض العالم الافتراضي المناسب
  enterWorld(mood);
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
      return "يبدو أنك تمر بيوم صعب 💔. اسمح لنفسك بالراحة، فالغد قد يحمل لك ابتسامة.";
    case "happy":
      return "جميل جدًا! 😊 استمتع بلحظتك وشارك البهجة من حولك!";
    case "angry":
      return "خذ لحظة وهدّئ نفسك 😌. الغضب مؤقت، لكن الحكمة دائمة.";
    case "anxious":
      return "تنفس ببطء 🌸، وتذكر أنك تتحكم في خطواتك القادمة.";
    default:
      return "أنا هنا لأستمع إليك 🌿. أخبرني أكثر عن شعورك؟";
  }
}
