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
        
        // إنشاء محتوى اليوم
        const dayContent = document.createElement('div');
        dayContent.className = 'day-content';
        dayContent.textContent = day;
        dayElement.appendChild(dayContent);
        
        // التحقق من المهام
        const hasTasks = this.hasTasksOnDate(day);
        if (hasTasks) {
            dayElement.classList.add('has-tasks');
            const taskDot = document.createElement('div');
            taskDot.className = 'task-dot';
            taskDot.textContent = '•';
            dayElement.appendChild(taskDot);
        }
        
        // تمييز اليوم الحالي
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
        } else {
            this.showNotification(`لا توجد مهام في ${day}`);
        }
    }
}

    class CompanionApp {
    constructor() {
        this.userName = '';
        this.userMood = 'happy';
        this.calendar = null;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.init();
    }

    init() {
        this.detectDeviceType();
        this.loadUserData();
        this.setupEventListeners();
        this.showWelcomeScreen();
        this.initCalendar();
    }

    detectDeviceType() {
        // إضافة كلاس للجسم حسب نوع الجهاز
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
            console.log('📱 تم الكشف عن جهاز محمول');
        } else {
            document.body.classList.add('desktop-device');
            console.log('💻 تم الكشف عن حاسوب');
        }
        
        // تحسين للشاشات الصغيرة
        if (window.innerWidth < 480) {
            document.body.classList.add('very-small-screen');
            console.log('📱 شاشة صغيرة جداً');
        }
        
        // إضافة حجم الشاشة ككلاس
        if (window.innerWidth < 768) {
            document.body.classList.add('small-screen');
        } else if (window.innerWidth < 1024) {
            document.body.classList.add('medium-screen');
        } else {
            document.body.classList.add('large-screen');
        }
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
        document.getElementById('listenBtn').addEventListener('click', () => {
            this.startVoiceInteraction();
        });

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
            this.speakMessage(`مرحباً ${name}! سعيدة بلقائك! أنا رفيقتك هنا، سأساعدك في تنظيم يومك وأكون معك دائماً. كيف حالك اليوم؟`);
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
        
        if (this.voiceAssistant) {
            this.speakMessage(greeting);
        }
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
            calm: "الهدوء يجلب السلام الداخلي 🕊️",
            peaceful: "الطمأنينة تجعل كل شيء أجمل 🌸"
        };
        
        this.addAIMessage(moodMessages[mood] || "شكراً لمشاركة مشاعرك معي 💕");
    }

    updateWorldScene() {
        const scene = document.getElementById('scene');
        scene.className = `scene ${this.userMood}-scene`;
    }
}

// الدوال العامة
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

function showAddTaskModal() {
    document.getElementById('taskModal').classList.add('active');
    // تعيين التاريخ الحالي كقيمة افتراضية
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

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    app = new CompanionApp();
    window.app = app;
});
