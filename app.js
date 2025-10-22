// التطبيق الرئيسي
class CompanionApp {
    constructor() {
        this.userName = '';
        this.userMood = 'happy';
        this.tasks = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.showWelcomeScreen();
    }

    loadUserData() {
        const savedName = localStorage.getItem('userName');
        const savedTasks = localStorage.getItem('userTasks');
        
        if (savedName) {
            this.userName = savedName;
            this.showChatScreen();
        }
        
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.updateTasksList();
        }
    }

    setupEventListeners() {
        // زر الاستماع
        document.getElementById('listenBtn').addEventListener('click', () => {
            this.startVoiceRecognition();
        });

        // زر التحدث
        document.getElementById('speakBtn').addEventListener('click', () => {
            this.speakMessage(this.getGreeting());
        });

        // إدخال المهام بالإنتر
        document.getElementById('newTask').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }

    showWelcomeScreen() {
        this.showScreen('welcome-screen');
    }

    showChatScreen() {
        this.showScreen('chat-screen');
        this.updateGreeting();
    }

    showScreen(screenId) {
        // إخفاء كل الشاشات
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // إظهار الشاشة المطلوبة
        document.getElementById(screenId).classList.add('active');
        
        // تحديث الأزرار النشطة
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
            this.speakMessage(`مرحباً ${name}!
سعيدة بلقائك! أنا رفيقتك هنا، سأساعدك في تنظيم يومك وأكون معك دائماً. كيف حالك اليوم؟`);
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

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return `صباح الخير ${this.userName}! يومك جميل بإذن الله`;
        if (hour < 18) return `مساء الخير ${this.userName}! كيف كان يومك؟`;
        return `مساء النور ${this.userName}! هل استمتعت بيومك؟`;
    }

    startVoiceRecognition() {
        // محاكاة التعرف على الصوت (سيتم تطويره)
        const message = "سعيدة بالتحدث معك! حالياً أتعلم فهم صوتك، لكن يمكنك الكتابة لي الآن";
        this.addAIMessage(message);
        this.speakMessage(message);
    }

    speakMessage(text) {
        // استخدام Web Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    addAIMessage(text) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addReminder(task) {
        this.tasks.push({
            text: task,
            completed: false,
            time: new Date().toLocaleTimeString()
        });
        this.saveTasks();
        this.updateTasksList();
        
        const message = `أضفت تذكير "${task}" إلى قائمة مهامك`;
        this.addAIMessage(message);
        this.speakMessage(message);
    }

    addTask() {
        const taskInput = document.getElementById('newTask');
        const taskText = taskInput.value.trim();
        
        if (taskText) {
            this.tasks.push({
                text: taskText,
                completed: false,
                time: new Date().toLocaleTimeString()
            });
            taskInput.value = '';
            this.saveTasks();
            this.updateTasksList();
            
            this.speakMessage(`أضفت "${taskText}" إلى مهامك`);
        }
    }

    updateTasksList() {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';
        
        this.tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <button onclick="app.removeTask(${index})">❌</button>
            `;
            tasksList.appendChild(taskItem);
        });
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.updateTasksList();
    }

    saveTasks() {
        localStorage.setItem('userTasks', JSON.stringify(this.tasks));
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

// التطبيقات المساعدة
function showScreen(screenId) {
    window.app.showScreen(screenId);
}

function setUserName() {
    window.app.setUserName();
}

function addReminder(task) {
    window.app.addReminder(task);
}

function addTask() {
    window.app.addTask();
}

function changeMood(mood) {
    window.app.changeMood(mood);
}

// تهيئة التطبيق
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CompanionApp();
    window.app = app;
});
