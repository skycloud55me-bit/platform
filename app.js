// التطبيق الرئيسي المحدث
class CompanionApp {
    constructor() {
        this.userName = '';
        this.userMood = 'happy';
        this.tasks = [];
        this.voiceAssistant = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.showWelcomeScreen();
        this.initVoiceAssistant();
    }

    initVoiceAssistant() {
        this.voiceAssistant = new AdvancedVoiceAssistant();
    }

    setupEventListeners() {
        // زر الاستماع - محدث
        document.getElementById('listenBtn').addEventListener('click', () => {
            this.startVoiceInteraction();
        });

        // زر التحدث - محدث
        document.getElementById('speakBtn').addEventListener('click', () => {
            this.giveDailyMotivation();
        });

        // إدخال نصي للمحادثة
        this.setupTextInput();
    }

    setupTextInput() {
        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.placeholder = 'اكتبي رسالتك هنا...';
        userInput.style.cssText = `
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid var(--primary);
            border-radius: 8px;
            background: rgba(255,255,255,0.1);
            color: var(--text);
        `;
        
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = userInput.value.trim();
                if (text) {
                    this.voiceAssistant.addUserMessage(text);
                    setTimeout(() => {
                        const response = this.voiceAssistant.generateSmartResponse(text);
                        this.voiceAssistant.addAIMessage(response);
                        this.voiceAssistant.speakMessage(response);
                    }, 1000);
                    userInput.value = '';
                }
            }
        });

        document.querySelector('.voice-controls').appendChild(userInput);
    }

    startVoiceInteraction() {
        if (this.voiceAssistant) {
            this.voiceAssistant.startListening();
        }
    }

    giveDailyMotivation() {
        const motivations = [
            "أنتِ شخص مذهل وقادر على تحقيق كل ما تحلمين به! 🌟",
            "اليوم هو فرصتك الجديدة لصنع المعجزات! 🌈",
            "لا تستهيني بقوتك الداخلية... أنتِ أقوى مما تتخيلين! 💪",
            "كل خطوة تخطينها تقربك من حلمك... استمري! 🚀"
        ];
        
        const motivation = motivations[Math.floor(Math.random() * motivations.length)];
        this.voiceAssistant.addAIMessage(motivation);
        this.voiceAssistant.speakMessage(motivation);
    }

    // باقي الدوال تبقى كما هي مع تحسينات بسيطة...
}
