// المساعد الصوتي المتقدم
class AdvancedVoiceAssistant {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.setupSpeechRecognition();
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'ar-SA';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateListeningUI(true);
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.log('خطأ في التعرف على الصوت:', event.error);
                this.isListening = false;
                this.updateListeningUI(false);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateListeningUI(false);
            };
        }
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
        } else {
            this.fallbackToTextInput();
        }
    }

    processVoiceCommand(transcript) {
        const command = transcript.toLowerCase();
        
        // إضافة رسالة المستخدم
        this.addUserMessage(transcript);
        
        // معالجة الأوامر
        setTimeout(() => {
            const response = this.generateSmartResponse(command);
            this.addAIMessage(response);
            this.speakMessage(response);
        }, 1000);
    }

    generateSmartResponse(command) {
        // تحليل المشاعر والنية
        const mood = this.analyzeMood(command);
        const intent = this.analyzeIntent(command);
        
        // مكتبة ردود ذكية
        const responses = {
            greeting: [
                `أهلاً وسهلاً ${app.userName}! 🌸 سعيدة بتواجدك معي`,
                `مرحباً حبيبتي ${app.userName}! 💫 كيف يمكنني مساعدتك اليوم؟`,
                `يا هلا ${app.userName}! 🌟 يومك جميل بإذن الله`
            ],
            
            mood_happy: [
                "رائع! السعادة تليق بك! 🌈",
                "أرى البهجة في كلماتك! هذا يجعلني سعيدة أيضاً 🌸",
                "فرحك معدٍ! شاركيني ما الذي أسعدك اليوم؟ ☀️"
            ],
            
            mood_sad: [
                "أسمع الحزن في صوتك... كل المشاعر مقبولة هنا 🫂",
                "لا بأس في أن تشعري بهذا... أنا هنا معك دائماً 🌙",
                "أحياناً نحتاج لبعض الحزن لنقدر الفرح... تحدثي معي 💕"
            ],
            
            task_request: [
                "حسناً! سأضيفها إلى مهامك 📝",
                "تمت الإضافة! هل تريدين تذكيراً خاصاً بهذه المهمة؟ ⏰",
                "اهتمام رائع! سأساعدك في تحقيق هذا الهدف 🌟"
            ],
            
            default: [
                "أفهم ما تقولين... هل يمكنك مشاركتي المزيد؟ 💭",
                "شكراً لمشاركتي هذا... أستمع إليك بكل اهتمام 👂",
                "كل كلمة تقولينها تساعدني في فهمك أكثر 🌸"
            ]
        };

        return this.selectResponse(intent, mood, responses);
    }

    analyzeMood(text) {
        const happyWords = ['سعيدة', 'فرح', 'مبسوطة', 'رائع', 'جميل', 'تمام'];
        const sadWords = ['حزينة', 'تعبانة', 'متضايقة', 'زعلان', 'محتاجة'];
        
        if (happyWords.some(word => text.includes(word))) return 'happy';
        if (sadWords.some(word => text.includes(word))) return 'sad';
        return 'neutral';
    }

    analyzeIntent(text) {
        if (text.includes('مرحبا') || text.includes('اهلا') || text.includes('سلام')) return 'greeting';
        if (text.includes('اضيف') || text.includes('مهمة') || text.includes('تذكير')) return 'task_request';
        if (text.includes('سعيدة') || text.includes('حزينة') || text.includes('مزاج')) return 'mood';
        return 'default';
    }

    selectResponse(intent, mood, responses) {
        const key = mood !== 'neutral' ? `mood_${mood}` : intent;
        const availableResponses = responses[key] || responses.default;
        return availableResponses[Math.floor(Math.random() * availableResponses.length)];
    }

    addUserMessage(text) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = `أنت: ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addAIMessage(text) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.textContent = `الرفيقة: ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    speakMessage(text) {
        if ('speechSynthesis' in window) {
            // إيقاف أي كلام سابق
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // محاولة تحسين النطق العربي
            utterance.onboundary = (event) => {
                console.log('الكلام يعمل بشكل صحيح');
            };
            
            speechSynthesis.speak(utterance);
        }
    }

    updateListeningUI(listening) {
        const listenBtn = document.getElementById('listenBtn');
        if (listening) {
            listenBtn.innerHTML = '<span>🔴</span> أستمع إليك...';
            listenBtn.style.background = 'var(--accent)';
        } else {
            listenBtn.innerHTML = '<span>🎤</span> تحدثي معي';
            listenBtn.style.background = 'var(--primary)';
        }
    }

    fallbackToTextInput() {
        this.addAIMessage("لم أتمكن من تفعيل الصوت، لكن يمكنك الكتابة لي في الحقل أدناه 💬");
    }
}
