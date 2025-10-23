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
            
            // إشعار قبل 15 دقيقة
            setTimeout(() => {
                this.showNotification(`⏰ تذكير: ${task.title} بعد 15 دقيقة`);
            }, timeUntilTask - (15 * 60 * 1000));
            
            // إشعار في الوقت المحدد
            setTimeout(() => {
                this.showNotification(`🔔 حان وقت: ${task.title}`);
                this.speakReminder(task.title);
            }, timeUntilTask);
        }
    }

    showNotification(message) {
        // إشعار المتصفح
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('رفيقتك الذكية 💫', { 
                        body: message,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌟</text></svg>'
                    });
                }
            });
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
        
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }

    speakReminder(message) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`تذكير: ${message}`);
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
                <button onclick="app.completeTask(${task.id})">✓</button>
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
            if (window.app && window.app.progressTracker) {
                window.app.progressTracker.trackTaskCompletion();
            }
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

class AdvancedVoiceSystem {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.setupVoiceRecognition();
    }

    setupVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
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
                this.fallbackToTextInput();
            }
        } else {
            this.fallbackToTextInput();
        }
    }
    
    processVoiceCommand(transcript) {
        if (window.app) {
            window.app.addUserMessage(transcript);
            
            setTimeout(() => {
                const response = this.generateVoiceResponse(transcript);
                window.app.addAIMessage(response);
                window.app.speakMessage(response);
                
                if (window.app.progressTracker) {
                    window.app.progressTracker.trackVoiceInteraction();
                }
            }, 1000);
        }
    }
    
    generateVoiceResponse(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('مرحبا') || lowerText.includes('اهلا')) {
            return `أهلاً وسهلاً ${window.app.userName}! 🌸 سعيدة بتحدثك معي`;
        }
        
        if (lowerText.includes('شكرا') || lowerText.includes('ممتاز')) {
            return `العفو يا ${window.app.userName}! 💫 دائماً سعيدة بمساعدتك`;
        }
        
        if (lowerText.includes('مهمة') || lowerText.includes('تذكير')) {
            return `رائع! يمكنك إضافة المهمة من خلال التقويم 📅`;
        }
        
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
        if (window.app) {
            window.app.addAIMessage("يمكنك الكتابة لي في الحقل أدناه 💬");
        }
    }
}

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
        if (this.stats.tasksCompleted >= 5) {
            this.showAchievement('🎯 إنجاز!', 'أكملت 5 مهام بنجاح!');
        }
        
        if (this.stats.tasksCreated >= 10) {
            this.showAchievement('📝 منظمة محترفة', 'أنشأت 10 مهام!');
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
        const completed = this.stats.tasksCompleted;
        const productivity = Math.min(100, (completed / 10) * 100);
        
        return {
            tasksCompleted: completed,
            productivity: productivity,
            recommendation: completed < 5 ? "حاولي إكمال 5 مهام هذا الأسبوع! 🌟" : "أداؤك رائع! استمري في التقدم 💫"
        };
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

class CompanionApp {
    constructor() {
        this.userName = '';
        this.userMood = 'happy';
        this.calendar = null;
        this.voiceSystem = null;
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
        this.progressTracker = new ProgressTracker();
        
        // طلب صلاحية الإشعارات
        if ('Notification' in window) {
            Notification.requestPermission();
        }
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
        if (this.voiceSystem) {
            this.voiceSystem.startListening();
        } else {
            this.addAIMessage("يمكنك الكتابة لي في الحقل أدناه 💬");
        }
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
        
        if (this.progressTracker) {
            this.progressTracker.trackMoodChange();
        }
    }

    updateWorldScene() {
        const scene = document.getElementById('scene');
        scene.className = `scene ${this.userMood}-scene`;
    }

    completeTask(taskId) {
        if (this.calendar) {
            this.calendar.completeTask(taskId);
        }
    }
}

let app;

function showScreen(screenId) {
    if (app) app.showScreen(screenId);
}

function setUserName() {
    if (app) app.setUserName();
}

function changeMood(mood) {
    if (app) app.changeMood(mood);
}

function startVoiceInteraction() {
    if (app) app.startVoiceInteraction();
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
    
    if (title && dateTime && app && app.calendar) {
        app.calendar.addTask(title, dateTime, repeat);
        closeTaskModal();
        app.addAIMessage(`أضفت "${title}" إلى تقويمك 📅`);
        
        if (app.progressTracker) {
            app.progressTracker.trackTaskCreation();
        }
    }
}

function changeMonth(direction) {
    if (app && app.calendar) {
        app.calendar.currentDate.setMonth(app.calendar.currentDate.getMonth() + direction);
        app.calendar.renderCalendar();
    }
}

function showWeeklyReport() {
    if (app && app.progressTracker) {
        const report = app.progressTracker.getWeeklyReport();
        const message = `
📊 تقريرك الأسبوعي:
• المهام المكتملة: ${report.tasksCompleted}
• مستوى الإنتاجية: ${report.productivity}%
• ${report.recommendation}
        `.trim();
        
        app.addAIMessage(message);
        app.speakMessage(`تقريرك الأسبوعي: أكملت ${report.tasksCompleted} مهام، ${report.recommendation}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    app = new CompanionApp();
    window.app = app;
});
