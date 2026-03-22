/* ============================================
   CHEMISTRY 12 — INTERACTIVITY
   Scroll animations, Quiz, Mobile menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true },
                { left: '$$', right: '$$', display: true },
            ],
            throwOnError: false,
        });
    }

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---- Mobile menu toggle ----
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const toggleIcon = toggle.querySelector('.material-symbols-outlined');

    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        toggleIcon.textContent = isOpen ? 'close' : 'menu';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggleIcon.textContent = 'menu';
        });
    });

    // ---- Intersection Observer for scroll animations ----
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation
                    const delay = entry.target.style.animationDelay
                        ? parseFloat(entry.target.style.animationDelay) * 1000
                        : 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ---- QUIZ ----
    const quizDataOriginal = [
        {
            q: 'Nguyên tắc chung để tách kim loại từ hợp chất là gì?',
            options: [
                'Oxi hoá ion kim loại thành kim loại tự do',
                'Khử ion kim loại thành kim loại tự do',
                'Hoà tan kim loại trong axit',
                'Nung nóng hợp chất kim loại',
            ],
            answer: 1,
            explain: 'Nguyên tắc chung: khử ion kim loại \\(M^{n+}\\) thành kim loại tự do \\(M\\) bằng cách cung cấp electron.'
        },
        {
            q: 'Phương pháp phổ biến để tách các kim loại: Na, Mg, Ca, Al,… là?',
            options: [
                'Nhiệt luyện',
                'Thuỷ luyện',
                'Điện phân nóng chảy',
                'Điện phân dung dịch',
            ],
            answer: 2,
            explain: 'Các kim loại trên có tính khử rất mạnh, chỉ có thể dùng dòng điện để khử ion trong muối nóng chảy.'
        },
        {
            q: 'Trong phương pháp nhiệt luyện, chất nào KHÔNG được dùng làm chất khử?',
            options: ['C (carbon)', 'CO', 'Au', '\\(H_2\\)'],
            answer: 2,
            explain: 'Vàng (Au) không được dùng làm chất khử vì nó có tính khử rất yếu.'
        },
        {
            q: 'Tái chế nhôm tiết kiệm bao nhiêu phần trăm năng lượng so với sản xuất từ quặng?',
            options: ['50%', '75%', '85%', '95%'],
            answer: 3,
            explain: 'Tái chế nhôm tiết kiệm đến 95% năng lượng so với điện phân nóng chảy \\(Al_2O_3\\) từ quặng bauxite.'
        },
        {
            q: 'Phản ứng nào sau đây là phản ứng nhiệt nhôm?',
            options: [
                '\\(Fe_2O_3 + 3CO \\xrightarrow{t°} 2Fe + 3CO_2\\)',
                '\\(Fe_2O_3 + 2Al \\xrightarrow{t°} 2Fe + Al_2O_3\\)',
                '\\(CuSO_4 + Fe \\rightarrow FeSO_4 + Cu\\)',
                '\\(2NaCl \\xrightarrow{đpnc} 2Na + Cl_2\\)',
            ],
            answer: 1,
            explain: 'Phản ứng nhiệt nhôm dùng Al làm chất khử để khử oxit kim loại ở nhiệt độ cao.'
        },
        {
            q: 'Cryolite \\(Na_3AlF_6\\) được thêm vào khi điện phân nóng chảy \\(Al_2O_3\\) nhằm mục đích gì?',
            options: [
                'Tăng độ tinh khiết của Al',
                'Tăng tính dẫn điện và hạ nhiệt độ nóng chảy',
                'Tạo chất khử mạnh hơn',
                'Ngăn Al bị oxi hoá',
            ],
            answer: 1,
            explain: 'Cryolite giúp hạ nhiệt độ nóng chảy của \\(Al_2O_3\\) từ ~2050°C xuống ~960°C, đồng thời bảo vệ nhôm lỏng không bị oxi hoá thành \\(Al_2O_3\\).'
        },
    ];

    // ---- Shuffle utility (Fisher-Yates) ----
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // ---- Build shuffled quiz: shuffle questions AND options ----
    let quizData = [];

    function buildShuffledQuiz() {
        const shuffledQuestions = shuffle(quizDataOriginal);
        quizData = shuffledQuestions.map(q => {
            // Build index map: pair each option with whether it's the correct one
            const paired = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.answer }));
            const shuffledPaired = shuffle(paired);
            const newAnswer = shuffledPaired.findIndex(p => p.isCorrect);
            return {
                q: q.q,
                options: shuffledPaired.map(p => p.text),
                answer: newAnswer,
                explain: q.explain,
            };
        });
    }

    let currentQ = 0;
    let score = 0;
    let answered = false;

    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const feedbackEl = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('quizNext');
    const progressBar = document.getElementById('quizProgressBar');
    const resultEl = document.getElementById('quizResult');
    const resultTitle = document.getElementById('quizResultTitle');
    const resultDesc = document.getElementById('quizResultDesc');
    const restartBtn = document.getElementById('quizRestart');

    function renderQuestion() {
        answered = false;
        const q = quizData[currentQ];
        progressBar.style.width = ((currentQ) / quizData.length * 100) + '%';
        questionEl.innerHTML = `Câu ${currentQ + 1}/${quizData.length}: ${q.q}`;
        optionsEl.innerHTML = '';
        feedbackEl.className = 'quiz-feedback';
        feedbackEl.textContent = '';
        nextBtn.style.display = 'none';

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.innerHTML = opt;
            btn.addEventListener('click', () => selectAnswer(i, btn));
            optionsEl.appendChild(btn);
        });

        // Re-render KaTeX for dynamically created elements (question + options)
        if (window.renderMathInElement) {
            renderMathInElement(document.getElementById('quizContainer'), {
                delimiters: [
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true },
                ],
                throwOnError: false,
            });
        }
    }

    function selectAnswer(index, btn) {
        if (answered) return;
        answered = true;

        const q = quizData[currentQ];
        const allBtns = optionsEl.querySelectorAll('.quiz-option');
        allBtns.forEach(b => b.classList.add('disabled'));

        if (index === q.answer) {
            btn.classList.add('correct');
            feedbackEl.className = 'quiz-feedback show correct-fb';
            feedbackEl.innerHTML = '✓ Chính xác! ' + q.explain;
            score++;
        } else {
            btn.classList.add('wrong');
            allBtns[q.answer].classList.add('correct');
            feedbackEl.className = 'quiz-feedback show wrong-fb';
            feedbackEl.innerHTML = '✗ Sai rồi! ' + q.explain;
        }

        // Re-render KaTeX in feedback
        if (window.renderMathInElement) {
            renderMathInElement(feedbackEl, {
                delimiters: [
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true },
                ],
                throwOnError: false,
            });
        }

        if (currentQ < quizData.length - 1) {
            nextBtn.textContent = '';
            const icon = document.createElement('span');
            icon.className = 'material-symbols-outlined';
            icon.textContent = 'arrow_forward';
            nextBtn.appendChild(icon);
            nextBtn.appendChild(document.createTextNode(' Câu tiếp theo'));
            nextBtn.style.display = 'inline-flex';
        } else {
            // Last question: show "Kết quả" button instead of auto-transitioning
            nextBtn.textContent = '';
            const icon = document.createElement('span');
            icon.className = 'material-symbols-outlined';
            icon.textContent = 'emoji_events';
            nextBtn.appendChild(icon);
            nextBtn.appendChild(document.createTextNode(' Kết quả'));
            nextBtn.style.display = 'inline-flex';
        }
    }

    function showResult() {
        progressBar.style.width = '100%';
        questionEl.style.display = 'none';
        optionsEl.style.display = 'none';
        feedbackEl.style.display = 'none';
        nextBtn.style.display = 'none';
        resultEl.style.display = 'block';

        const pct = Math.round((score / quizData.length) * 100);
        if (pct >= 80) {
            resultTitle.textContent = `Xuất sắc! ${score}/${quizData.length}`;
            resultDesc.textContent = `Bạn đạt ${pct}% — kiến thức rất vững!`;
        } else if (pct >= 50) {
            resultTitle.textContent = `Khá tốt! ${score}/${quizData.length}`;
            resultDesc.textContent = `Bạn đạt ${pct}% — hãy ôn lại những phần còn thiếu nhé.`;
        } else {
            resultTitle.textContent = `Cần cố gắng! ${score}/${quizData.length}`;
            resultDesc.textContent = `Bạn đạt ${pct}% — hãy đọc lại bài và thử lại.`;
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentQ >= quizData.length - 1) {
            // Last question answered, show result
            showResult();
        } else {
            currentQ++;
            renderQuestion();
        }
    });

    restartBtn.addEventListener('click', () => {
        currentQ = 0;
        score = 0;
        questionEl.style.display = '';
        optionsEl.style.display = '';
        feedbackEl.style.display = '';
        resultEl.style.display = 'none';
        buildShuffledQuiz();
        renderQuestion();
    });

    // Initial build
    buildShuffledQuiz();
    renderQuestion();

    // ---- Wait for KaTeX to load then re-render ----
    const katexScript = document.querySelector('script[src*="auto-render"]');
    if (katexScript) {
        katexScript.addEventListener('load', () => {
            if (window.renderMathInElement) {
                renderMathInElement(document.body, {
                    delimiters: [
                        { left: '\\(', right: '\\)', display: false },
                        { left: '\\[', right: '\\]', display: true },
                        { left: '$$', right: '$$', display: true },
                    ],
                    throwOnError: false,
                });
            }
        });
    }

    // ---- FUN FACTS PLAYER ----
    const ffCards = document.querySelectorAll('.funfact-card');
    const ffIndicators = document.querySelectorAll('.funfact-indicator');
    const ffPrev = document.getElementById('funfactPrev');
    const ffNext = document.getElementById('funfactNext');
    const ffPlayBtn = document.getElementById('funfactPlayBtn');
    const ffPlayIcon = document.getElementById('funfactPlayIcon');
    const ffCounter = document.getElementById('funfactCurrent');
    const ffPlayer = document.querySelector('.funfact-player');
    const TOTAL_FACTS = ffCards.length;
    const AUTO_INTERVAL = 5000; // 5 seconds per card

    let ffCurrent = 0;
    let ffPlaying = true;
    let ffTimer = null;

    function goToFact(index) {
        // Clamp index
        if (index < 0) index = TOTAL_FACTS - 1;
        if (index >= TOTAL_FACTS) index = 0;

        // Update cards
        ffCards.forEach(c => c.classList.remove('active'));
        ffCards[index].classList.add('active');

        // Update indicators
        ffIndicators.forEach((ind, i) => {
            ind.classList.remove('active', 'done');
            if (i < index) ind.classList.add('done');
            if (i === index) ind.classList.add('active');
        });

        // Update counter
        ffCurrent = index;
        ffCounter.textContent = index + 1;

        // Restart auto-play timer
        resetTimer();
    }

    function nextFact() { goToFact(ffCurrent + 1); }
    function prevFact() { goToFact(ffCurrent - 1); }

    function resetTimer() {
        clearTimeout(ffTimer);
        if (ffPlaying) {
            // Re-trigger the indicator animation by removing & re-adding the class
            const activeInd = ffIndicators[ffCurrent];
            activeInd.classList.remove('active');
            void activeInd.offsetWidth; // Force reflow
            activeInd.classList.add('active');

            ffTimer = setTimeout(nextFact, AUTO_INTERVAL);
        }
    }

    function togglePlay() {
        ffPlaying = !ffPlaying;
        ffPlayIcon.textContent = ffPlaying ? 'pause' : 'play_arrow';
        ffPlayer.classList.toggle('paused', !ffPlaying);

        if (ffPlaying) {
            resetTimer();
        } else {
            clearTimeout(ffTimer);
        }
    }

    // Event listeners
    ffPrev.addEventListener('click', prevFact);
    ffNext.addEventListener('click', nextFact);
    ffPlayBtn.addEventListener('click', togglePlay);

    ffIndicators.forEach(ind => {
        ind.addEventListener('click', () => {
            goToFact(parseInt(ind.dataset.index, 10));
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const funfactsSection = document.getElementById('funfacts');
        const rect = funfactsSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowLeft') prevFact();
        if (e.key === 'ArrowRight') nextFact();
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            togglePlay();
        }
    });

    // Start auto-play
    resetTimer();
});
