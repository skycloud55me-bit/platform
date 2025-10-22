class LivingUniverse {
    constructor() {
        this.soulAI = new SoulAI();
        this.init();
    }

    init() {
        this.createMagic();
        this.setupInteractions();
    }

    createMagic() {
        // تأثيرات بصرية إضافية
        this.createFloatingWords();
        this.animatePortal();
    }

    createFloatingWords() {
        const words = ['الحب', 'السلام', 'النمو', 'الفهم', 'الرحمة'];
        const container = document.getElementById('living-universe');
        
        words.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'floating-word';
            wordElement.textContent = word;
            wordElement.style.cssText = `
                position: absolute;
                color: rgba(255,255,255,0.3);
                font-size: 16px;
                top: ${20 + (index * 15)}%;
                left: ${70 + (index * 5)}%;
                animation: floatWord 10s infinite ease-in-out;
                animation-delay: ${index * -2}s;
            `;
            container.appendChild(wordElement);
        });

        // إضافة الأنيميشن للكلمات
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatWord {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
                50% { transform: translateY(-30px) rotate(5deg); opacity: 0.6; }
            }
        `;
        document.head.appendChild(style);
    }

    setupInteractions() {
        const expressBtn = document.getElementById('expressSoul');
        const soulMessage = document.getElementById('soulMessage');

        expressBtn.addEventListener('click', () => this.processSoulExpression());
        
        soulMessage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.processSoulExpression();
            }
        });

        soulMessage.addEventListener('input', () => {
            this.realTimeSoulAnalysis();
        });
    }

    realTimeSoulAnalysis() {
        const text = document.getElementById('soulMessage').value;
        if (text.length > 3) {
            const soulState = this.soulAI.analyzeSoulMessage(text);
            this.soulAI.updateMirror(soulState);
        }
    }

    processSoulExpression() {
        const message = document.getElementById('soulMessage').value.trim();
        
        if (!message) {
            this.showGentleReminder('🖋️ مساحتكِ تنتظر كلماتكِ...');
            return;
        }

        const soulState = this.soulAI.analyzeSoulMessage(message);
        const response = this.soulAI.generateSoulResponse(message, soulState);
        
        this.displaySoulResponse(response);
        this.celebrateExpression();
        
        document.getElementById('soulMessage').value = '';
    }

    displaySoulResponse(response) {
        const container = document.getElementById('soulResponse');
        const responseElement = document.createElement('div');
        responseElement.className = 'soul-response';
        responseElement.innerHTML = `
            <div class="response-content">${response}</div>
            <div class="response-author">رفيق رحلتكِ</div>
        `;
        
        container.appendChild(responseElement);
        responseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // حذف الردود القديمة بعد فترة
        setTimeout(() => {
            if (container.children.length > 3) {
                container.removeChild(container.firstChild);
            }
        }, 10000);
    }

    showGentleReminder(message) {
        const existingReminder = document.querySelector('.gentle-reminder');
        if (existingReminder) existingReminder.remove();

        const reminder = document.createElement('div');
        reminder.className = 'gentle-reminder';
        reminder.textContent = message;
        reminder.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 10000;
            animation: fadeInOut 3s ease;
        `;

        document.body.appendChild(reminder);

        setTimeout(() => {
            reminder.remove();
        }, 3000);
    }

    celebrateExpression() {
        // تأثيرات احتفالية بسيطة
        const btn = document.getElementById('expressSoul');
        btn.style.background = 'linear-gradient(45deg, #4ecdc4, #667eea)';
        
        setTimeout(() => {
            btn.style.background = 'linear-gradient(45deg, #ff6b6b, #ffd93d)';
        }, 1000);
    }

    animatePortal() {
        const portalGlow = document.querySelector('.portal-glow');
        setInterval(() => {
            portalGlow.style.transform = `scale(${1 + Math.random() * 0.1})`;
        }, 2000);
    }
}

// بدء السحر عندما تصبح الصفحة جاهزة
document.addEventListener('DOMContentLoaded', () => {
    window.soulUniverse = new LivingUniverse();
});
