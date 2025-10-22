class SmartCalendar {
    constructor() {
        this.currentDate = new Date();
        this.tasks = [];
        this.loadTasks();
        this.initCalendar();
    }

    initCalendar() {
        this.renderCalendar();
        this.renderUpcomingTasks();
        this.startReminderChecker();
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const monthYear = document.getElementById('currentMonth');
        
        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                           'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        monthYear.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        calendarGrid.innerHTML = '';
        
        const days = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
        days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `<div class="day-content">${day}</div>`;
            
            const hasTasks = this.hasTasksOnDate(day);
            if (hasTasks) {
                dayElement.classList.add('has-tasks');
                dayElement.innerHTML += '<div class="task-dot">•</div>';
            }
            
            const today = new Date();
            if (day === today.getDate() && 
                this.currentDate.getMonth() === today.getMonth() && 
                this.currentDate.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            dayElement.onclick = () => this.showDayTasks(day);
            calendarGrid.appendChild(dayElement);
        }

        class SmartNotificationSystem {
    constructor() {
        this.pendingNotifications = [];
        this.setupNotificationPermission();
    }
    
    async setupNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('تم تفعيل الإشعارات');
            }
        }
    }
    
    scheduleSmartNotification(task) {
        const taskTime = new Date(task.date);
        const now = new Date();
        const timeUntilTask = taskTime.getTime() - now.getTime();
        
        // إشعارات متعددة حسب الوقت المتبقي
        if (timeUntilTask > 24 * 60 * 60 * 1000) { // أكثر من يوم
            setTimeout(() => {
                this.showNotification(`📅 غداً: ${task.title}`);
            }, timeUntilTask - (24 * 60 * 60 * 1000));
        }
        
        if (timeUntilTask > 60 * 60 * 1000) { // أكثر من ساعة
            setTimeout(() => {
                this.showNotification(`⏰ خلال ساعة: ${task.title}`);
            }, timeUntilTask - (60 * 60 * 1000));
        }
        
        // الإشعار الأساسي
        setTimeout(() => {
            this.showNotification(`🔔 الآن: ${task.title}`);
            this.speakNotification(task.title);
        }, timeUntilTask);
    }
    
    showNotification(message) {
        // إشعار المتصفح
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('رفيقتك الذكية 💫', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌟</text></svg>',
                requireInteraction: true
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
        
        // إشعار داخل التطبيق
        this.showInAppNotification(message);
    }
    
    showInAppNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'smart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">💫</span>
                <div class="notification-text">
                    <div class="notification-title">رفيقتك الذكية</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">✕</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إغلاق عند النقر
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
        
        // إغلاق تلقائي بعد 8 ثواني
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }
    
    speakNotification(message) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`تذكير: ${message}`);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }
}
    }

    hasTasksOnDate(day) {
        const targetDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        return this.tasks.some(task => this.isSameDate(new Date(task.date), targetDate));
    }

    isSameDate(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    addTask(title, dateTime, repeat) {
        const task = {
            id: Date.now(),
            title: title,
            date: dateTime,
            repeat: repeat,
            completed: false
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderCalendar();
        this.renderUpcomingTasks();
        this.scheduleNotification(task);
        
        return task;
    }

    scheduleNotification(task) {
        const taskTime = new Date(task.date);
        const now = new Date();
        
        if (taskTime > now) {
            const timeUntilTask = taskTime.getTime() - now.getTime();
            
            setTimeout(() => {
                this.showNotification(`⏰ تذكير: ${task.title} بعد 15 دقيقة`);
            }, timeUntilTask - (15 * 60 * 1000));
            
            setTimeout(() => {
                this.showNotification(`🔔 حان وقت: ${task.title}`);
                this.speakReminder(task.title);
            }, timeUntilTask);
        }
    }

    showNotification(message) {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('رفيقتك 💫', { body: message });
                }
            });
        }
        
        this.showInAppNotification(message);
    }

    showInAppNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🔔</span>
                <div class="notification-text">${message}</div>
                <button class="notification-close">✕</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    speakReminder(message) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    renderUpcomingTasks() {
        const upcomingTasks = document.getElementById('upcomingTasks');
        const now = new Date();
        
        const upcoming = this.tasks
            .filter(task => new Date(task.date) > now && !task.completed)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
        
        upcomingTasks.innerHTML = '';
        
        if (upcoming.length === 0) {
            upcomingTasks.innerHTML = '<p style="text-align: center; opacity: 0.7;">لا توجد مهام قادمة</p>';
            return;
        }
        
        upcoming.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'upcoming-task';
            taskElement.innerHTML = `
                <div class="task-time">${this.formatTime(new Date(task.date))}</div>
                <div class="task-title">${task.title}</div>
                <button onclick="app.calendar.completeTask(${task.id})">✓</button>
            `;
            upcomingTasks.appendChild(taskElement);
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    }

    startReminderChecker() {
        setInterval(() => {
            this.checkDueTasks();
        }, 60000);
    }

    checkDueTasks() {
        const now = new Date();
        this.tasks.forEach(task => {
            if (!task.completed && new Date(task.date) <= now) {
                this.showNotification(`⏰ ${task.title}`);
                this.completeTask(task.id);
            }
        });
    }

    completeTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].completed = true;
            this.saveTasks();
            this.renderUpcomingTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('calendarTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('calendarTasks');
        if (saved) {
            this.tasks = JSON.parse(saved);
            this.tasks.forEach(task => {
                if (!task.completed && new Date(task.date) > new Date()) {
                    this.scheduleNotification(task);
                }
            });
        }
    }

    showDayTasks(day) {
        const targetDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const dayTasks = this.tasks.filter(task => this.isSameDate(new Date(task.date), targetDate));
        
        if (dayTasks.length > 0) {
            const tasksText = dayTasks.map(task => task.title).join('، ');
            this.showNotification(`المهام في ${day}: ${tasksText}`);
        }
    }
}

    class CompanionApp {
    constructor() {
        this.userName = '';
        this.userMood = 'happy';
        this.calendar = null;
        this.voiceSystem = null;
        this.notificationSystem = null;
        this.progressTracker = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.showWelcomeScreen();
        this.initAllSystems();
    }

    initAllSystems() {
        this.calendar = new SmartCalendar();
        this.voiceSystem = new AdvancedVoiceSystem();
        this.notificationSystem = new SmartNotificationSystem();
        this.progressTracker = new ProgressTracker();
    }
    
    // تحديث دوال التتبع
    completeTask(taskId) {
        this.calendar.completeTask(taskId);
        this.progressTracker.trackTaskCompletion();
    }
    
    addNewTask(title, dateTime, repeat) {
        this.calendar.addTask(title, dateTime, repeat);
        this.progressTracker.trackTaskCreation();
    }
    
    changeMood(mood) {
        this.userMood = mood;
        this.updateWorldScene();
        this.progressTracker.trackMoodChange();
    }
}

    initCalendar() {
        this.calendar = new SmartCalendar();
    }

    loadUserData() {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            this.userName = savedName;
            this.showChatScreen();
        }
    }

    setupEventListeners() {
        document.getElementById('textInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = e.target.value.trim();
                if (text) {
                    this.processUserMessage(text);
                    e.target.value = '';
                }
            }
        });
    }

    showWelcomeScreen() {
        this.showScreen('welcome-screen');
    }

    showChatScreen() {
        this.showScreen('chat-screen');
        this.updateGreeting();
        
        setTimeout(() => {
            this.giveWelcomeGreeting();
        }, 2000);
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    setUserName() {
        const nameInput = document.getElementById('userName');
        const name = nameInput.value.trim();
        
        if (name) {
            this.userName = name;
            localStorage.setItem('userName', name);
            this.showChatScreen();
            this.speakMessage(`مرحباً ${name}! سعيدة بلقائك! كيف حالك اليوم؟`);
        }
    }

    updateGreeting() {
        const greetings = [
            `مرحباً ${this.userName}! كيف حالك اليوم؟`,
            `أهلاً وسهلاً ${this.userName}! ما أخبارك؟`,
            `يا هلا ${this.userName}! كيف كان نومك؟`
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        document.getElementById('greetingMessage').textContent = randomGreeting;
    }

    giveWelcomeGreeting() {
        const greetings = [
            `مرحباً ${this.userName}! 🌸 أتمنى أنك بخير اليوم`,
            `أهلاً وسهلاً ${this.userName}! 💫 كيف حالك هذا اليوم؟`,
            `يا هلا ${this.userName}! 🌟 أتمنى أن يومك جميل`
        ];
        
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        document.getElementById('greetingMessage').textContent = greeting;
        this.speakMessage(greeting);
    }

    startVoiceInteraction() {
        this.addAIMessage("حالياً أتعلم فهم صوتك، يمكنك الكتابة لي في الحقل أدناه 💬");
    }

    processUserMessage(text) {
        this.addUserMessage(text);
        
        setTimeout(() => {
            const responses = [
                "أفهم ما تقولين... هل يمكنك مشاركتي المزيد؟ 💭",
                "شكراً لمشاركتي هذا... أستمع إليك بكل اهتمام 👂",
                "كل كلمة تقولينها تساعدني في فهمك أكثر 🌸"
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.addAIMessage(response);
            this.speakMessage(response);
        }, 1000);
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
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    changeMood(mood) {
        this.userMood = mood;
        this.updateWorldScene();
        
        const moodMessages = {
            happy: "رائع! السعادة تليق بك! 🌞",
            calm: "الهدوء يجلب السلام الداخلي 🕊️"
        };
        
        this.addAIMessage(moodMessages[mood] || "شكراً لمشاركة مشاعرك معي 💕");
    }

    updateWorldScene() {
        const scene = document.getElementById('scene');
        scene.className = `scene ${this.userMood}-scene`;
    }
}

let app;

function showScreen(screenId) {
    app.showScreen(screenId);
}

function setUserName() {
    app.setUserName();
}

function changeMood(mood) {
    app.changeMood(mood);
}

function startVoiceInteraction() {
    app.startVoiceInteraction();
}

class AdvancedVoiceSystem {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.setupVoiceRecognition();
    }

    setupVoiceRecognition() {
        // التحقق من دعم المتصفح للتعرف على الصوت
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'ar-SA';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateListeningUI(true);
                console.log('بدء الاستماع...');
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('تم التعرف على:', transcript);
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
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.log('خطأ في بدء الاستماع:', error);
                this.fallbackToTextInput();
            }
        } else {
            this.fallbackToTextInput();
        }
    }
    
    processVoiceCommand(transcript) {
        app.addUserMessage(transcript);
        
        // معالجة الأوامر الصوتية
        setTimeout(() => {
            const response = this.generateVoiceResponse(transcript);
            app.addAIMessage(response);
            app.speakMessage(response);
        }, 1000);
    }
    
    generateVoiceResponse(text) {
        const lowerText = text.toLowerCase();
        
        // تحليل النص وتوليد رد ذكي
        if (lowerText.includes('مرحبا') || lowerText.includes('اهلا')) {
            return `أهلاً وسهلاً ${app.userName}! 🌸 سعيدة بتحدثك معي`;
        }
        
        if (lowerText.includes('شكرا') || lowerText.includes('ممتاز')) {
            return `العفو يا ${app.userName}! 💫 دائماً سعيدة بمساعدتك`;
        }
        
        if (lowerText.includes('مهمة') || lowerText.includes('تذكير')) {
            return `رائع! يمكنك إضافة المهمة من خلال التقويم 📅`;
        }
        
        if (lowerText.includes('كيف حالك')) {
            return `بخير والحمدلله! 🌟 سعيدة لأنك تسألين عني`;
        }
        
        // ردود عامة
        const generalResponses = [
            "أسمعك بوضوح! 💭 هل يمكنك إعادة ما قلته؟",
            "شكراً للتحدث معي! 🌸 صوتك جميل",
            "أفهم ما تقولين... 👂 هل تريدين مساعدة في شيء محدد؟"
        ];
        
        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
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
        app.addAIMessage("يمكنك الكتابة لي في الحقل أدناه 💬");
    }
}

function showAddTaskModal() {
    document.getElementById('taskModal').classList.add('active');
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('taskDateTime').value = localDateTime;
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
}

function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const dateTime = document.getElementById('taskDateTime').value;
    const repeat = document.getElementById('taskRepeat').value;
    
    if (title && dateTime) {
        app.calendar.addTask(title, dateTime, repeat);
        closeTaskModal();
        app.addAIMessage(`أضفت "${title}" إلى تقويمك 📅`);
    }
}

function changeMonth(direction) {
    app.calendar.currentDate.setMonth(app.calendar.currentDate.getMonth() + direction);
    app.calendar.renderCalendar();
}

document.addEventListener('DOMContentLoaded', () => {
    app = new CompanionApp();
    window.app = app;
});

class ProgressTracker {
    constructor() {
        this.stats = {
            tasksCompleted: 0,
            tasksCreated: 0,
            moodChanges: 0,
            voiceInteractions: 0,
            lastActive: new Date().toISOString()
        };
        this.loadStats();
    }
    
    trackTaskCompletion() {
        this.stats.tasksCompleted++;
        this.stats.lastActive = new Date().toISOString();
        this.saveStats();
        this.checkAchievements();
    }
    
    trackTaskCreation() {
        this.stats.tasksCreated++;
        this.saveStats();
    }
    
    trackMoodChange() {
        this.stats.moodChanges++;
        this.saveStats();
    }
    
    trackVoiceInteraction() {
        this.stats.voiceInteractions++;
        this.saveStats();
    }
    
    checkAchievements() {
        if (this.stats.tasksCompleted >= 10) {
            this.showAchievement('🎯 إنجاز!', 'أكملت 10 مهام بنجاح!');
        }
        
        if (this.stats.tasksCreated >= 20) {
            this.showAchievement('📝 منظمة محترفة', 'أنشأت 20 مهمة!');
        }
        
        if (this.stats.voiceInteractions >= 5) {
            this.showAchievement('🎤 متحدثة بارعة', 'استخدمت الصوت 5 مرات!');
        }
    }
    
    showAchievement(title, message) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-notification';
        achievement.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <div class="achievement-title">${title}</div>
                    <div class="achievement-message">${message}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(achievement);
        
        setTimeout(() => {
            if (achievement.parentElement) {
                achievement.remove();
            }
        }, 5000);
    }
    
    getWeeklyReport() {
        const completedThisWeek = this.stats.tasksCompleted; // سيتم تطويره
        return {
            tasksCompleted: completedThisWeek,
            productivity: Math.min(100, (completedThisWeek / 10) * 100),
            mood: 'إيجابي', // سيتم تطويره
            recommendation: this.generateRecommendation()
        };
    }
    
    generateRecommendation() {
        if (this.stats.tasksCompleted < 5) {
            return "حاولي إكمال 5 مهام هذا الأسبوع! 🌟";
        }
        return "أداؤك رائع! استمري في التقدم 💫";
    }
    
    saveStats() {
        localStorage.setItem('userStats', JSON.stringify(this.stats));
    }
    
    loadStats() {
        const saved = localStorage.getItem('userStats');
        if (saved) {
            this.stats = JSON.parse(saved);
        }
    }
}
