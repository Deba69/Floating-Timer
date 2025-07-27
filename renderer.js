const { ipcRenderer } = require('electron');

class Timer {
    constructor() {
        this.running = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.mode = 'stopwatch'; // or 'countdown'
        this.countdownTime = 0;
        
        // Auto-transparency settings
        this.inactivityTimeout = 10000; // 10 seconds
        this.transparencyTimer = null;
        this.isTransparent = false;
        this.normalOpacity = 0.95;
        this.transparentOpacity = 0.3;
        
        // DOM elements
        this.timerDisplay = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.modeBtn = document.getElementById('modeBtn');
        this.timerOptions = document.getElementById('timerOptions');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.container = document.querySelector('.container');
        
        // Timer input elements
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.modeBtn.addEventListener('click', () => this.switchMode());
        this.minimizeBtn.addEventListener('click', () => this.minimize());
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Mouse movement and interaction listeners
        document.addEventListener('mousemove', () => this.handleInteraction());
        document.addEventListener('mousedown', () => this.handleInteraction());
        document.addEventListener('keydown', () => this.handleInteraction());
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setPresetTime(parseInt(btn.dataset.minutes)));
        });
        
        // Input validation
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('change', () => this.validateInput(input));
        });

        // Handle window close
        window.addEventListener('beforeunload', () => {
            this.stop();
        });

        // Start transparency timer
        this.startTransparencyTimer();
    }
    
    handleInteraction() {
        if (this.isTransparent) {
            this.makeOpaque();
        }
        this.resetTransparencyTimer();
    }
    
    startTransparencyTimer() {
        this.resetTransparencyTimer();
    }
    
    resetTransparencyTimer() {
        if (this.transparencyTimer) {
            clearTimeout(this.transparencyTimer);
        }
        this.transparencyTimer = setTimeout(() => {
            this.makeTransparent();
        }, this.inactivityTimeout);
    }
    
    makeTransparent() {
        if (!this.isTransparent) {
            this.isTransparent = true;
            this.container.style.opacity = this.transparentOpacity;
            this.container.style.transition = 'opacity 0.5s ease';
        }
    }
    
    makeOpaque() {
        this.isTransparent = false;
        this.container.style.opacity = this.normalOpacity;
        this.container.style.transition = 'opacity 0.3s ease';
    }
    
    minimize() {
        try {
            ipcRenderer.send('minimize-window');
        } catch (error) {
            console.error('Error minimizing window:', error);
        }
    }
    
    close() {
        try {
            this.stop();
            ipcRenderer.send('close-window');
        } catch (error) {
            console.error('Error closing window:', error);
        }
    }
    
    stop() {
        this.running = false;
        this.startBtn.textContent = 'Start';
    }
    
    validateInput(input) {
        const value = parseInt(input.value);
        const max = parseInt(input.max);
        const min = parseInt(input.min);
        
        if (isNaN(value) || value < min) {
            input.value = min;
        } else if (value > max) {
            input.value = max;
        }
    }
    
    setPresetTime(minutes) {
        this.hoursInput.value = Math.floor(minutes / 60);
        this.minutesInput.value = minutes % 60;
        this.secondsInput.value = 0;
        this.updateCountdownTime();
    }
    
    updateCountdownTime() {
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        
        this.countdownTime = (hours * 3600) + (minutes * 60) + seconds;
        this.timerDisplay.textContent = this.formatTime(this.countdownTime * 1000);
    }
    
    start() {
        if (!this.running) {
            if (this.mode === 'countdown') {
                this.updateCountdownTime();
                if (this.countdownTime === 0) {
                    alert('Please set a valid time for countdown');
                    return;
                }
            }
            
            this.running = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.update();
            this.startBtn.textContent = 'Pause';
        } else {
            this.running = false;
            this.startBtn.textContent = 'Start';
        }
    }
    
    reset() {
        this.running = false;
        this.elapsedTime = 0;
        if (this.mode === 'stopwatch') {
            this.timerDisplay.textContent = '00:00:00';
        } else {
            this.updateCountdownTime();
        }
        this.startBtn.textContent = 'Start';
    }
    
    update() {
        if (this.running) {
            if (this.mode === 'stopwatch') {
                this.elapsedTime = Date.now() - this.startTime;
                const time = this.formatTime(this.elapsedTime);
                this.timerDisplay.textContent = time;
            } else {
                const remaining = this.countdownTime - ((Date.now() - this.startTime) / 1000);
                if (remaining <= 0) {
                    this.running = false;
                    this.timerDisplay.textContent = '00:00:00';
                    this.startBtn.textContent = 'Start';
                    // Play a sound or show notification when timer ends
                    new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU').play();
                    return;
                }
                const time = this.formatTime(remaining * 1000);
                this.timerDisplay.textContent = time;
            }
            requestAnimationFrame(() => this.update());
        }
    }
    
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }
    
    pad(num) {
        return num.toString().padStart(2, '0');
    }
    
    switchMode() {
        if (this.mode === 'stopwatch') {
            this.mode = 'countdown';
            this.timerOptions.classList.add('active');
            this.updateCountdownTime();
        } else {
            this.mode = 'stopwatch';
            this.timerOptions.classList.remove('active');
        }
        this.reset();
    }
}

// Initialize the timer
const timer = new Timer(); 