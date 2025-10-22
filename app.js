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

class SmartReminderSystem {
    constructor() {
        this.reminders = [];
        this.loadReminders();
    }

    addReminder(text, schedule) {
        const reminder = {
            id: Date.now(),
            text: text,
            schedule: schedule, // 'daily', 'weekly', 'monthly', 'yearly', 'once'
            time: schedule === 'once' ? new Date() : null,
            enabled: true
        };
        
        this.reminders.push(reminder);
        this.saveReminders();
        this.scheduleNotification(reminder);
        
        return reminder;
    }

    scheduleNotification(reminder) {
        if (reminder.schedule === 'once') {
            this.scheduleOneTimeReminder(reminder);
        } else {
            this.scheduleRecurringReminder(reminder);
        }
    }

    scheduleOneTimeReminder(reminder) {
        // تذكير لمرة واحدة
        const now = new Date();
        const reminderTime = new Date(reminder.time);
        
        if (reminderTime > now) {
            const timeout = reminderTime.getTime() - now.getTime();
            setTimeout(() => {
                this.showNotification(reminder.text);
            }, timeout);
        }
    }

    scheduleRecurringReminder(reminder) {
        // تذكير متكرر
        setInterval(() => {
            this.showNotification(reminder.text);
        }, this.getInterval(reminder.schedule));
    }

    getInterval(schedule) {
        const intervals = {
            'daily': 24 * 60 * 60 * 1000,
            'weekly': 7 * 24 * 60 * 60 * 1000,
            'monthly': 30 * 24 * 60 * 60 * 1000,
            'yearly': 365 * 24 * 60 * 60 * 1000
        };
        return intervals[schedule] || intervals.daily;
    }

    showNotification(message) {
        // إشعار المتصفح
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('رفيقتك 💫', {
                body: message,
                icon: '/icon.png'
            });
        }
        
        // إشعار داخل التطبيق
        this.showInAppNotification(message);
    }

    showInAppNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'floating-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🔔</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close">✕</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        // إغلاق التذكير
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
        
        // إغلاق تلقائي بعد 5 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    saveReminders() {
        localStorage.setItem('userReminders', JSON.stringify(this.reminders));
    }

    loadReminders() {
        const saved = localStorage.getItem('userReminders');
        if (saved) {
            this.reminders = JSON.parse(saved);
            this.reminders.forEach(reminder => {
                if (reminder.enabled) {
                    this.scheduleNotification(reminder);
                }

                class CompanionApp {
    // ... الكود السابق ...

    showChatScreen() {
        this.showScreen('chat-screen');
        this.updateGreeting();
        
        // الترحيب الصوتي التلقائي بعد 2 ثانية
        setTimeout(() => {
            this.giveWelcomeGreeting();
        }, 2000);
    }

    giveWelcomeGreeting() {
        const greetings = [
            `مرحباً ${this.userName}! 🌸 أتمنى أنك بخير اليوم`,
            `أهلاً وسهلاً ${this.userName}! 💫 كيف حالك هذا اليوم؟`,
            `يا هلا ${this.userName}! 🌟 أتمنى أن يومك جميل`,
            `مساء الخير ${this.userName}! 🌙 أتمنى أنك تقضين وقتاً جميلاً`
        ];
        
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        // تحديث الواجهة
        document.getElementById('greetingMessage').textContent = greeting;
        
        // التحدث به
        if (this.voiceAssistant) {
            this.voiceAssistant.speakMessage(greeting);
        }
    }
}

// دوال جديدة لإدارة التذكيرات
let currentReminderType = '';

function showReminderDialog(type) {
    currentReminderType = type;
    document.getElementById('reminderDialog').classList.add('active');
}

function closeReminderDialog() {
    document.getElementById('reminderDialog').classList.remove('active');
}

function addNewReminder() {
    const text = document.getElementById('reminderText').value.trim();
    if (text) {
        if (window.app.reminderSystem) {
            window.app.reminderSystem.addReminder(text, currentReminderType);
        }
        document.getElementById('reminderText').value = '';
        closeReminderDialog();
    }
}
            });
        }
    }
}
