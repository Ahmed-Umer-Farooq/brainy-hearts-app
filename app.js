/**
 * Brainy Hearts - A Multifunctional App
 * @version 18.0.0 FINAL
 */
const brainyHeartsApp = {
    // --- 1. CONFIGURATION & STATE ---
    config: {
        typewriterSpeed: 25
    },
    elements: {}, content: {}, iqScore: 0, currentIQQuestionIndex: 0, iqTimer: null, currentShuffledIQ: [], installPromptEvent: null,

    // --- 2. INITIALIZATION ---
    async init() {
        this.cacheDOMElements();
        this.bindEvents();
        await this.loadContent();
        this.handleSplashScreen();
        this.loadTheme();
    },

    async loadContent() {
        try {
            const response = await fetch('questions.json');
            this.content = await response.json();
        } catch (error) {
            console.error("Failed to load questions.json:", error);
            this.content = { iqQuestions: [{ question: "Error loading questions. Please refresh.", options: ["OK"], correct: "OK" }], lifeAdvice: ["The journey of a thousand miles begins with a single step."], poetry: ["The woods are lovely, dark and deep."], urduPoetry: [{ author: "Mirza Ghalib", text: "Hazaaron khwahishen aisi ke har khwahish pe dam nikle..." }]};
        }
    },

    handleSplashScreen() { const splashScreen = this.elements.splashScreen; if (splashScreen) { window.addEventListener('load', () => { splashScreen.classList.add('hidden'); setTimeout(() => { splashScreen.style.display = 'none'; }, 750); }); } },
    cacheDOMElements() { this.elements = { splashScreen: document.getElementById('splash-screen'), startScreen: document.getElementById('start-screen'), installAppBtn: document.getElementById('installAppBtn'), startSoulmatesBtn: document.getElementById('startSoulmatesBtn'), startIQBtn: document.getElementById('startIQBtn'), loveModeScreen: document.getElementById('love-mode-screen'), loveModeHomeBtn: document.getElementById('love-mode-home-btn'), selectCommittedBtn: document.getElementById('selectCommittedBtn'), selectOneSidedBtn: document.getElementById('selectOneSidedBtn'), committedScreen: document.getElementById('committed-screen'), oneSidedScreen: document.getElementById('one-sided-screen'), iqTestScreen: document.getElementById('iq-test-screen'), iqResultScreen: document.getElementById('iq-result-screen'), committedHomeBtn: document.getElementById('committed-home-btn'), oneSidedHomeBtn: document.getElementById('one-sided-home-btn'), iqQuitBtn: document.getElementById('iq-quit-btn'), iqBackToHomeBtn: document.getElementById('iq-back-to-home-btn'), c_name1: document.getElementById("c_name1"), c_bday1: document.getElementById("c_bday1"), c_name2: document.getElementById("c_name2"), c_bday2: document.getElementById("c_bday2"), os_name1: document.getElementById('os_name1'), os_bday1: document.getElementById('os_bday1'), os_name2: document.getElementById('os_name2'), calculateCommittedBtn: document.getElementById("calculateCommittedBtn"), calculateOneSidedBtn: document.getElementById('calculateOneSidedBtn'), resetCommittedBtn: document.getElementById('resetCommittedBtn'), resetOneSidedBtn: document.getElementById('resetOneSidedBtn'), committedResult: document.getElementById("committed-result"), oneSidedResult: document.getElementById('one-sided-result'), committedThemeToggle: document.getElementById("committed-theme-toggle"), oneSidedThemeToggle: document.getElementById('one-sided-theme-toggle'), iqThemeToggle: document.getElementById("iq-theme-toggle"), rewardRevealModal: document.getElementById('reward-reveal-modal'), closeRewardBtn: document.getElementById('closeRewardBtn'), rewardTitle: document.getElementById('reward-title'), rewardEmoji: document.getElementById('reward-emoji'), rewardText: document.getElementById('reward-text'), installModal: document.getElementById('install-modal'), closeInstallBtn: document.getElementById('closeInstallBtn'), iqQuestionCounter: document.getElementById('iq-question-counter'), iqTimerDisplay: document.getElementById('iq-timer'), iqQuestionText: document.getElementById('iq-question-text'), iqOptionsContainer: document.getElementById('iq-options-container'), iqFinalScore: document.getElementById('iq-final-score'), iqResultMessage: document.getElementById('iq-result-message'), brainAnalysis: document.getElementById('brain-analysis'), brainAnalysisEmoji: document.getElementById('brain-analysis-emoji'), brainAnalysisText: document.getElementById('brain-analysis-text'), iqRestartBtn: document.getElementById('iq-restart-btn'), clickSound: document.getElementById("clickSound"), celebrationSound: document.getElementById("celebrationSound"), perfectMatchSound: document.getElementById("perfectMatchSound"), rewardUnlockSound: document.getElementById("rewardUnlockSound") }; },
    bindEvents() {
        window.addEventListener('beforeinstallprompt', this.handleInstallPrompt.bind(this));
        window.addEventListener('appinstalled', this.handleAppInstalled.bind(this));
        this.elements.installAppBtn.addEventListener('click', this.handleInstallClick.bind(this));
        this.elements.startSoulmatesBtn.addEventListener('click', () => this.showScreen('love-mode-screen'));
        this.elements.startIQBtn.addEventListener('click', () => this.startIQTest());
        this.elements.selectCommittedBtn.addEventListener('click', () => this.showScreen('committed-screen'));
        this.elements.selectOneSidedBtn.addEventListener('click', () => this.showScreen('one-sided-screen'));
        [this.elements.loveModeHomeBtn, this.elements.committedHomeBtn, this.elements.oneSidedHomeBtn, this.elements.iqQuitBtn, this.elements.iqBackToHomeBtn].forEach(btn => btn.addEventListener('click', () => this.showScreen('start-screen')));
        [this.elements.committedThemeToggle, this.elements.oneSidedThemeToggle, this.elements.iqThemeToggle].forEach(btn => { if (btn) btn.addEventListener('click', this.toggleDarkMode.bind(this)) });
        this.elements.calculateCommittedBtn.addEventListener('click', () => this.handleCalculateClick('committed'));
        this.elements.calculateOneSidedBtn.addEventListener('click', () => this.handleCalculateClick('oneSided'));
        this.elements.resetCommittedBtn.addEventListener('click', () => this.resetCalculator('committed'));
        this.elements.resetOneSidedBtn.addEventListener('click', () => this.resetCalculator('oneSided'));
        this.elements.closeRewardBtn.addEventListener('click', this.closeRewardModal.bind(this));
        this.elements.rewardRevealModal.addEventListener('click', (e) => { if (e.target === this.elements.rewardRevealModal) this.closeRewardModal(); });
        this.elements.closeInstallBtn.addEventListener('click', () => this.elements.installModal.classList.add('hidden'));
        this.elements.installModal.addEventListener('click', (e) => { if (e.target === this.elements.installModal) this.elements.installModal.classList.add('hidden'); });
        this.elements.iqRestartBtn.addEventListener('click', () => this.startIQTest());
    },

    // --- 3. PWA INSTALL PROMPT LOGIC ---
    handleInstallPrompt(e) { e.preventDefault(); this.installPromptEvent = e; this.elements.installAppBtn.classList.remove('hidden'); },
    handleInstallClick() {
        if (this.installPromptEvent) {
            this.installPromptEvent.prompt();
        } else {
            this.elements.installModal.classList.remove('hidden');
        }
    },
    handleAppInstalled() {
        this.elements.installAppBtn.classList.add('hidden');
        console.log('PWA was installed');
    },

    // --- 4. SCREEN & FLOW MANAGEMENT ---
    showScreen(screenId) { this.playSound(this.elements.clickSound); clearInterval(this.iqTimer); ['start-screen', 'love-mode-screen', 'committed-screen', 'one-sided-screen', 'iq-test-screen', 'iq-result-screen'].forEach(id => { if(document.getElementById(id)) document.getElementById(id).classList.add('hidden'); }); document.getElementById(screenId).classList.remove('hidden'); },
    
    // --- 5. IQ TEST LOGIC ---
    shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; },
    startIQTest() { this.showScreen('iq-test-screen'); this.iqScore = 0; this.currentIQQuestionIndex = 0; this.currentShuffledIQ = this.shuffleArray([...this.content.iqQuestions]).slice(0, 5); this.displayNextIQQuestion(); },
    displayNextIQQuestion() { if (this.currentIQQuestionIndex >= this.currentShuffledIQ.length) { this.showIQResults(); return; } const question = this.currentShuffledIQ[this.currentIQQuestionIndex]; this.elements.iqQuestionCounter.textContent = `Question ${this.currentIQQuestionIndex + 1}/${this.currentShuffledIQ.length}`; this.elements.iqQuestionText.textContent = question.question; this.elements.iqOptionsContainer.innerHTML = ''; question.options.forEach(option => { const button = document.createElement('button'); button.textContent = option; button.className = 'iq-option-btn'; button.addEventListener('click', () => this.handleIQAnswer(option, button)); this.elements.iqOptionsContainer.appendChild(button); }); this.startIQTimer(); },
    startIQTimer() { clearInterval(this.iqTimer); let timeLeft = 15; this.elements.iqTimerDisplay.textContent = `${timeLeft}s`; this.iqTimer = setInterval(() => { timeLeft--; this.elements.iqTimerDisplay.textContent = `${timeLeft}s`; if (timeLeft <= 0) { clearInterval(this.iqTimer); this.handleIQAnswer(null); } }, 1000); },
    handleIQAnswer(selectedOption, clickedButton) { clearInterval(this.iqTimer); const question = this.currentShuffledIQ[this.currentIQQuestionIndex]; Array.from(this.elements.iqOptionsContainer.children).forEach(button => { button.disabled = true; if (button.textContent === question.correct) { button.classList.add('correct'); } }); if (selectedOption === question.correct) { this.iqScore++; } else if (clickedButton) { clickedButton.classList.add('incorrect'); } setTimeout(() => { this.currentIQQuestionIndex++; this.displayNextIQQuestion(); }, 1500); },
    showIQResults() { this.showScreen('iq-result-screen'); const scorePercent = (this.iqScore / this.currentShuffledIQ.length) * 100; this.elements.iqFinalScore.textContent = `${scorePercent}%`; let message, brainType, brainEmoji; if (scorePercent === 100) { message = "Perfect Score! Certified Genius!"; brainType = "A Perfectly Balanced Brain!"; brainEmoji = "🧠"; setTimeout(() => this.revealReward('einstein'), 500); } else if (scorePercent >= 80) { message = "Excellent! Very Sharp!"; brainType = "A Dominantly Logical Left-Brain!"; brainEmoji = "🧩"; } else if (scorePercent >= 40) { message = "Good effort! A Solid Thinker."; brainType = "A Wonderfully Creative Right-Brain!"; brainEmoji = "🎨"; } else { message = "Nice try! Keep practicing!"; brainType = "A Mind Full of Potential!"; brainEmoji = "🌱"; } this.elements.iqResultMessage.textContent = message; this.elements.brainAnalysisEmoji.textContent = brainEmoji; this.elements.brainAnalysisText.textContent = brainType; },

    // --- 6. SOULMATES CALCULATOR LOGIC ---
    handleCalculateClick(mode) { this.playSound(this.elements.clickSound); const inputs = this.getInputs(mode); if (!this.validateInputs(inputs, mode)) { this.showError(`Please fill in all required fields! 😅`, mode); return; } this.elements[`calculate${mode.charAt(0).toUpperCase() + mode.slice(1)}Btn`].disabled = true; this.startCountdown(inputs, mode); },
    getInputs(mode) {
        if (mode === 'committed') {
            return {
                name1: this.elements.c_name1.value.trim(),
                bday1: this.elements.c_bday1.value,
                name2: this.elements.c_name2.value.trim(),
                bday2: this.elements.c_bday2.value
            };
        } else {
            // For one-sided, treat like committed: require both names and your birthdate
            return {
                name1: this.elements.os_name1.value.trim(),
                bday1: this.elements.os_bday1.value,
                name2: this.elements.os_name2.value.trim(),
                bday2: null // No second birthdate for one-sided
            };
        }
    },
    validateInputs(inputs, mode) {
        // Both modes require name1, name2, and bday1
        return inputs.name1 && inputs.name2 && inputs.bday1;
    },
    closeRewardModal() { this.elements.rewardRevealModal.classList.add('hidden'); },
    revealReward(rewardType) {
        let title, emoji, content;
        try {
            if (rewardType === 'advice') {
                title = 'Life Advice';
                emoji = '💡';
                content = (this.content.lifeAdvice && this.content.lifeAdvice.length) ? this.content.lifeAdvice[Math.floor(Math.random() * this.content.lifeAdvice.length)] : 'Keep loving and keep learning!';
            } else if (rewardType === 'famousPoetry') {
                title = 'A Verse for the Heart!';
                emoji = '✒️';
                if (this.content.famousPoetry && this.content.famousPoetry.length) {
                    const p = this.content.famousPoetry[Math.floor(Math.random() * this.content.famousPoetry.length)];
                    content = `"${p.text}"<br><br>- ${p.author}`;
                } else {
                    content = 'Love is the poetry of the senses.';
                }
            } else if (rewardType === 100) {
                title = 'A Poetic Masterpiece!';
                emoji = '📜';
                if (this.content.urduPoetry && this.content.urduPoetry.length) {
                    const famousQuote = this.content.urduPoetry[Math.floor(Math.random() * this.content.urduPoetry.length)];
                    content = `"${famousQuote.text}"<br><br>- ${famousQuote.author}`;
                } else {
                    content = 'محبت سب سے بڑی شاعری ہے';
                }
            } else if (rewardType === 'einstein') {
                title = 'A Spark of Genius!';
                emoji = '💡';
                content = `"The true sign of intelligence is not knowledge but imagination."<br><br>- Albert Einstein`;
            } else {
                // fallback
                if (this.content.lifeAdvice && this.content.lifeAdvice.length && Math.random() > 0.5) {
                    title = 'A Spark of Wisdom!';
                    emoji = '💡';
                    content = this.content.lifeAdvice[Math.floor(Math.random() * this.content.lifeAdvice.length)];
                } else if (this.content.poetry && this.content.poetry.length) {
                    title = 'A Verse for the Heart!';
                    emoji = '✒️';
                    content = this.content.poetry[Math.floor(Math.random() * this.content.poetry.length)];
                } else {
                    title = 'Reward';
                    emoji = '🎁';
                    content = 'You are awesome!';
                }
            }
        } catch (e) {
            title = 'Reward';
            emoji = '🎁';
            content = 'Something went wrong. Please try again.';
            console.error('Reward modal error:', e);
        }
        this.elements.rewardTitle.textContent = title;
        this.elements.rewardEmoji.textContent = emoji;
        this.elements.rewardText.innerHTML = content;
        this.elements.rewardRevealModal.classList.remove('hidden');
        this.playSound(this.elements.rewardUnlockSound);
    },
    getZodiacSign(dateString) { if (!dateString) return "❓"; const date = new Date(dateString); const month = date.getMonth() + 1; const day = date.getDate(); if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "♒"; if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "♓"; if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "♈"; if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "♉"; if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "♊"; if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "♋"; if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♌"; if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♍"; if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "♎"; if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "♏"; if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "♐"; return "♑"; },
    getLoveResult(name1, name2) { const n1Lower = name1.toLowerCase(); const n2Lower = name2.toLowerCase(); if ((n1Lower === "nooh" && n2Lower === "huma") || (n1Lower === "huma" && n2Lower === "nooh")) { return { score: 100, message: "A match written in the stars! 💍", emoji: "💍" }; } const combined = (name1 + name2).toLowerCase().replace(/\s/g, ''); let seed = 0; for (let i = 0; i < combined.length; i++) { seed = (seed + combined.charCodeAt(i) * (i + 1)) % 101; } const score = Math.floor(seed * 0.6) + 40; if (score > 80) return { score, message: "A Perfect Match! 🔥 You two are inseparable!", emoji: "💘" }; if (score >= 60) return { score, message: "Looks very promising! 💖 Keep the flame alive.", emoji: "💖" }; if (score < 50) return { score, message: "A connection to work on... 💔", emoji: "💔" }; return { score, message: "There's potential... with a little work. 😉", emoji: "🤔" }; },
    getResultContainerId(mode) {
        // Map mode to correct result container ID
        if (mode === 'oneSided') return 'one-sided-result-container';
        if (mode === 'committed') return 'committed-result-container';
        return '';
    },
    resetCalculator(mode) {
        const fields = (mode === 'committed') ? ['c_name1', 'c_bday1', 'c_country1', 'c_sport1', 'c_name2', 'c_bday2', 'c_country2', 'c_sport2'] : ['os_name1', 'os_bday1', 'os_name2', 'os_looks', 'os_dress', 'os_like'];
        fields.forEach(id => { if(this.elements[id]) this.elements[id].value = ''; });
        const resultDiv = document.getElementById(this.getResultContainerId(mode));
        if (resultDiv) resultDiv.innerHTML = "";
        this.elements[`calculate${mode.charAt(0).toUpperCase() + mode.slice(1)}Btn`].disabled = false;
        this.playSound(this.elements.clickSound);
    },
    startCountdown(inputs, mode) {
        if (this._countdownInterval) clearInterval(this._countdownInterval);
        const resultDiv = document.getElementById(this.getResultContainerId(mode));
        if (!resultDiv) {
            console.error('Result container not found for mode:', mode);
            return;
        }
        let count = 3;
        resultDiv.innerHTML = `<h2>Calculating...</h2>`;
        this._countdownInterval = setInterval(() => {
            if (count > 0) {
                resultDiv.innerHTML = `<h2 style="font-size: 3em; animation: pulse 0.5s ease-out;">${count}</h2>`;
                count--;
            } else {
                clearInterval(this._countdownInterval);
                this._countdownInterval = null;
                const result = this.getLoveResult(inputs.name1, inputs.name2);
                this.displayResult(inputs, result, mode);
            }
        }, 1000);
    },
    displayResult(inputs, result, mode) {
        const resultDiv = document.getElementById(this.getResultContainerId(mode));
        if (!resultDiv) {
            console.error('Result container not found for mode:', mode);
            return;
        }
        const sign1 = this.getZodiacSign(inputs.bday1);
        const sign2 = inputs.bday2 ? this.getZodiacSign(inputs.bday2) : null;
        const partnerText = sign2 ? `& <strong>${inputs.name2}</strong> (${sign2})` : `& <strong>${inputs.name2}</strong>`;
        resultDiv.innerHTML = `
            <p><strong>${inputs.name1}</strong> (${sign1}) ${partnerText}</p>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${result.score}%;"></div>
            </div>
            <span class="progress-percentage" style="opacity:1;">${result.score}%</span>
            <p class="result-message" style="opacity:1;">${result.emoji} ${result.score}% - ${result.message}</p>
            <div class="reward-prompt"></div>
        `;
        const rewardPromptDiv = resultDiv.querySelector('.reward-prompt');
        this.elements[`calculate${mode.charAt(0).toUpperCase() + mode.slice(1)}Btn`].disabled = false;
        // Reward logic
        if (result.score === 100) {
            this.playSound(this.elements.perfectMatchSound);
            this.launchConfetti();
            this.explodeHearts();
            rewardPromptDiv.innerHTML = `<p>You have won a special reward!</p><button class="open-reward-btn">Click to Open</button>`;
            rewardPromptDiv.querySelector('.open-reward-btn').addEventListener('click', () => this.revealReward(100));
        } else if (result.score >= 60 && result.score < 90) {
            this.playSound(this.elements.celebrationSound);
            rewardPromptDiv.innerHTML = `<p>You have won a reward!</p><button class="open-reward-btn">Click to Open</button>`;
            rewardPromptDiv.querySelector('.open-reward-btn').addEventListener('click', () => this.revealReward('advice'));
        } else if (result.score > 90 && result.score < 100) {
            this.playSound(this.elements.celebrationSound);
            rewardPromptDiv.innerHTML = `<p>You have won a reward!</p><button class="open-reward-btn">Click to Open</button>`;
            rewardPromptDiv.querySelector('.open-reward-btn').addEventListener('click', () => this.revealReward('famousPoetry'));
        } else if (result.score < 50) {
            rewardPromptDiv.innerHTML = `<p class="sorry-message">Sorry, no reward this time. Try for a higher score!</p>`;
        }
    },
    showError(message, mode) {
        const resultDiv = document.getElementById(this.getResultContainerId(mode));
        if (resultDiv) resultDiv.innerHTML = `<p style="color: red;">${message}</p>`;
    },
    typeWriter(element, text, callback) { if (!element) return; element.style.opacity = 1; element.innerHTML = ''; let i = 0; const type = () => { if (i < text.length) { element.innerHTML += text.charAt(i); i++; setTimeout(type, this.config.typewriterSpeed); } else if (callback) { callback(); } }; type(); },

    // --- 7. THEME MANAGEMENT & UTILITIES ---
    toggleDarkMode() { const isDark = document.body.classList.toggle("dark-mode"); const newIcon = isDark ? "☀️" : "🌙"; [this.elements.committedThemeToggle, this.elements.oneSidedThemeToggle, this.elements.iqThemeToggle].forEach(btn => { if(btn) btn.textContent = newIcon; }); localStorage.setItem('theme', isDark ? 'dark' : 'light'); },
    loadTheme() { if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-mode'); [this.elements.committedThemeToggle, this.elements.oneSidedThemeToggle, this.elements.iqThemeToggle].forEach(btn => { if(btn) btn.textContent = "☀️"; }); } },
    playSound(sound) { if (sound) { sound.currentTime = 0; sound.play().catch(e => console.error("Audio playback failed:", e)); } },
    launchConfetti() { if (typeof confetti === 'function') { confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } }); } },
    explodeHearts() { for (let i = 0; i < 30; i++) { const heart = document.createElement("div"); heart.innerHTML = ["❤️", "💖", "💕", "💗"][Math.floor(Math.random() * 4)]; heart.className = 'heart'; heart.style.left = Math.random() * 100 + "vw"; heart.style.animationDuration = Math.random() * 2 + 3 + "s"; heart.style.fontSize = Math.random() * 20 + 15 + "px"; document.body.appendChild(heart); setTimeout(() => heart.remove(), 5000); } },
};

brainyHeartsApp.init();
