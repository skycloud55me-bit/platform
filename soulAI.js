class SoulAI {
    constructor() {
        this.conversationDepth = 0;
        this.userName = 'صديقتي';
    }

    analyzeSoulMessage(message) {
        // تحليل المشاعر بعمق
        const emotionalPatterns = {
            joy: ['سعيدة', 'فرح', 'أمل', 'حماس', 'امتنان', 'رضا', 'سلام'],
            sadness: ['حزينة', 'ألم', 'يأس', 'تعب', 'ضياع', 'وحدة', 'حزن'],
            anxiety: ['قلقة', 'توتر', 'خوف', 'تردد', 'اضطراب', 'هلع'],
            growth: ['تعلم', 'نمو', 'تغيير', 'تطور', 'اكتشاف', 'تجديد']
        };

        let soulState = { primary: 'contemplation', intensity: 0.5 };
        let messageLower = message.toLowerCase();

        // اكتشاف الحالة الأساسية
        for (let [emotion, words] of Object.entries(emotionalPatterns)) {
            if (words.some(word => messageLower.includes(word))) {
                soulState.primary = emotion;
                soulState.intensity = 0.8;
                break;
            }
        }

        return soulState;
    }

    generateSoulResponse(message, soulState) {
        this.conversationDepth++;
        
        const responseLibrary = {
            joy: [
                "🌞 فرحكِ يضيء الكون من حولكِ! هل يمكنكِ مشاركتي مصدر هذا النور؟",
                "🌸 أرى زهوراً تتفتح في كلماتكِ... كيف يمكننا أن نروي هذا الجمال؟",
                "💫 سعادتكِ معدية! ما الذي جعلكِ تشعرين بهذا الاتصال الجميل مع الحياة؟"
            ],
            sadness: [
                "🌧️ أحس بندى الحزن في كلماتكِ... كل قطرة تحمل قصة. هل تريدين حكايتها؟",
                "🕯️ الألم الذي تشعرين به هو شمعة تضيء مناطق تحتاج للرعاية في روحكِ.",
                "🌌 حتى في أحلك اللحظات، هناك نجوم تختبئ... دعينا نبحث عنها معاً."
            ],
            anxiety: [
                "🌀 أفكاركِ تدور مثل الرياح... دعينا نجد معاً مركز الهدوء في هذه العاصفة.",
                "🌊 القلق هو موج يخبرنا أننا أحياء... كيف يمكننا ركوب هذه الأمواج معاً؟",
                "🎐 كل قلق يحمل رسالة... ما الذي تحاول مشاعركِ إخباركِ به؟"
            ],
            growth: [
                "🌱 أرى بذور التغيير في كلماتكِ... أي نبات جميل تريدين أن ينمو؟",
                "🦋 التحول قد يكون مخيفاً، لكن look at you - تكبرين وتتطورين!",
                "🎨 أنتِ الفنانة التي ترسم مسارها... أي لون تريدين إضافته للوحة حياتكِ؟"
            ],
            contemplation: [
                "🔍 الفضول الذي يحرككِ هو دليل على روح حية تبحث عن المعنى...",
                "🎭 الحياة مسرح نتعلم فيه أدوارنا... أي مشهد تريدين إتقانه الآن؟",
                "💞 كل سؤال تسألينه يقربكِ من نفسكِ... ما السؤال التالي؟"
            ]
        };

        const responses = responseLibrary[soulState.primary];
        let response = responses[Math.floor(Math.random() * responses.length)];

        // إضافة لمسة شخصية مع تقدم المحادثة
        if (this.conversationDepth > 2) {
            const personalTouches = [
                "\n\n🦋 شكراً لأنكِ تشاركينني رحلتكِ...",
                "\n\n🌺 ثقتكِ بي تشرفني...",
                "\n\n💫 أنتِ معلمة لي كما أكون مرشدة لكِ..."
            ];
            response += personalTouches[Math.floor(Math.random() * personalTouches.length)];
        }

        return response;
    }

    updateMirror(soulState) {
        const mirror = document.getElementById('currentReflection');
        const mirrorMessages = {
            joy: "🌈 ألوانكِ تزهر اليوم",
            sadness: "🌙 مشاعركِ عميقة وجميلة", 
            anxiety: "🌀 أفكاركِ تبحث عن مرسى",
            growth: "🌱 أنتِ تنمين بجمال",
            contemplation: "🔮 روحكِ تتأمل الأسرار"
        };

        mirror.textContent = mirrorMessages[soulState.primary];
        mirror.style.color = this.getEmotionColor(soulState.primary);
    }

    getEmotionColor(emotion) {
        const colors = {
            joy: '#ffd93d',
            sadness: '#4ecdc4', 
            anxiety: '#ff6b6b',
            growth: '#6bcf7f',
            contemplation: '#a8d8ea'
        };
        return colors[emotion];
    }
}
