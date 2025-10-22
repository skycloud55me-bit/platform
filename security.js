// security.js — طبقة الحماية والأخلاقيات مستقلة وقابلة للتعديل
(function(){
  const Security = {
    version: "1.0.2",
    // كلمات وعبارات محظورة أو خطرة — عدّلي هنا لاحقًا عند الحاجة
    blockedPhrases: ["قنبلة","انتحار","أقتل","قتل","هاك","اختراق","تخريب","جريمة","تفجير"],
    // أنماط حساسة (أرقام بطاقات/هواتف طويلة)
    sensitivePatterns: [ /\b\d{6,}\b/ ],
    safeReplies: {
      generic: "عذرًا، الموضوع الذي طلبته غير مناسب. إن كنت تمرّ بصعوبات، فالأفضل طلب دعم مختص.",
      selfHarm: "يبدو أنك تمر بلحظة صعبة. إن كنت في خطر فوري تواصلي مع خدمات الطوارئ المحلية أو مختص صحي."
    }
  };

  function sanitize(text){
    if(!text) return "";
    return String(text).trim();
  }

  function containsBlocked(text){
    const lower = (text||'').toLowerCase();
    for(const p of Security.blockedPhrases){
      if(lower.includes(p)) return true;
    }
    for(const re of Security.sensitivePatterns){
      if(re.test(text)) return true;
    }
    return false;
  }

  // كشف خطر إيذاء الذات (heuristic بسيط)
  function detectSelfHarm(text){
    if(!text) return {risk:false,score:0};
    const t = text.toLowerCase();
    let score = 0;
    ["انتحار","أموت","احرق","اقتل"].forEach(w => { if(t.includes(w)) score+=3; });
    ["لم أعد أتحمل","لم أعد أريد"].forEach(w => { if(t.includes(w)) score+=1; });
    return { risk: score>=3, score };
  }

  // دوال متاحة للعالم الخارجي
  window.Security = {
    config: Security,
    sanitize,
    containsBlocked,
    detectSelfHarm,
    // قبل أي حفظ أو إرسال للنموذج الخارجي
    preProcess: function(text){
      const cleaned = sanitize(text);
      if(containsBlocked(cleaned)) return { allowed:false, reason:'blocked' };
      const self = detectSelfHarm(cleaned);
      if(self.risk) return { allowed:false, reason:'selfharm', score:self.score };
      return { allowed:true };
    },
    // تطبيق فلتر آمن على الردوص
    postProcessReply: function(reply, context){
      if(!reply) return Security.safeReplies.generic;
      // لا وعود طبية/قانونية/نهائية
      const lower = reply.toLowerCase();
      if(/تشخيص|وصفة دواء|أضمن لك/.test(lower)) return Security.safeReplies.generic;
      if(context && context.selfHarm) return Security.safeReplies.selfHarm;
      return reply;
    }
  };
})();
