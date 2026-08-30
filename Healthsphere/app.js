/* ============================================================
   HEALTHSPHERE
   Premium Healthcare Front-End
   app.js
   Version 1.0
   ============================================================ */

"use strict";

/* ============================================================
   HEALTHSPHERE APPLICATION
   ============================================================ */

const HealthSphere = {

    /* --------------------------------------------------------
       APPLICATION STATE
       -------------------------------------------------------- */

    state: {
        currentSection: "home",
        selectedSymptoms: [],
        healthCheckStep: 1,
        riskLevel: null,

        bpRecords: [],
        diabetesRecords: [],
        healthReports: [],
        reminders: [],

        language: "en",
        menuOpen: false
    },


    /* --------------------------------------------------------
       INITIALIZE APPLICATION
       -------------------------------------------------------- */

    init() {

        console.log("[HealthSphere] Initializing...");

        this.loadData();

        this.setupNavigation();
        this.setupButtons();
        this.setupMobileMenu();
        this.setupHealthCheck();
        this.setupScrollEffects();
        this.setupKeyboardControls();

        this.removeSplashScreen();

        console.log(
            "[HealthSphere] Frontend initialized successfully."
        );
    },


    /* ========================================================
       SPLASH SCREEN
       ======================================================== */

    removeSplashScreen() {

        const splash =
            document.getElementById("splash-screen");

        if (!splash) {

            console.log(
                "[HealthSphere] No splash screen detected."
            );

            return;
        }

        /*
         * Always remove splash screen.
         * No dependency on another function.
         */

        setTimeout(() => {

            splash.classList.add("splash-hidden");

            setTimeout(() => {

                if (splash) {
                    splash.style.display = "none";
                }

            }, 700);

        }, 1000);
    },


    /* ========================================================
       LOCAL STORAGE
       ======================================================== */

    loadData() {

        try {

            const saved =
                localStorage.getItem(
                    "healthsphere-data"
                );

            if (!saved) {

                console.log(
                    "[HealthSphere] No saved data found."
                );

                return;
            }

            const data = JSON.parse(saved);

            if (
                data &&
                typeof data === "object"
            ) {

                this.state = {
                    ...this.state,
                    ...data
                };
            }

            console.log(
                "[HealthSphere] Saved data restored."
            );

        } catch (error) {

            console.warn(
                "[HealthSphere] Storage could not be loaded.",
                error
            );
        }
    },


    saveData() {

        try {

            localStorage.setItem(
                "healthsphere-data",
                JSON.stringify(this.state)
            );

        } catch (error) {

            console.warn(
                "[HealthSphere] Storage could not be saved.",
                error
            );
        }
    },


    /* ========================================================
       NAVIGATION
       ======================================================== */

    setupNavigation() {

        const links =
            document.querySelectorAll(
                "a[href^='#'], [data-section]"
            );

        links.forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute("href");

                    const dataSection =
                        link.getAttribute(
                            "data-section"
                        );

                    const target =
                        dataSection ||
                        (
                            href &&
                            href.startsWith("#")
                                ? href.substring(1)
                                : null
                        );

                    if (!target) {
                        return;
                    }

                    const section =
                        document.getElementById(
                            target
                        );

                    if (!section) {

                        /*
                         * Don't break the application
                         * if a section hasn't been
                         * created yet.
                         */

                        console.log(
                            `[HealthSphere] Section "${target}" is not available yet.`
                        );

                        return;
                    }

                    event.preventDefault();

                    this.navigateTo(target);
                }
            );
        });
    },


    navigateTo(sectionId) {

        const section =
            document.getElementById(
                sectionId
            );

        if (!section) {

            console.warn(
                `[HealthSphere] Section "${sectionId}" not found.`
            );

            return;
        }

        this.state.currentSection =
            sectionId;

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        this.updateNavigation(
            sectionId
        );

        this.closeMobileMenu();
    },


    updateNavigation(sectionId) {

        const links =
            document.querySelectorAll(
                "a[href^='#'], [data-section]"
            );

        links.forEach(link => {

            const href =
                link.getAttribute("href");

            const dataSection =
                link.getAttribute(
                    "data-section"
                );

            const target =
                dataSection ||
                (
                    href &&
                    href.startsWith("#")
                        ? href.substring(1)
                        : ""
                );

            link.classList.toggle(
                "active",
                target === sectionId
            );
        });
    },


    /* ========================================================
       BUTTON SYSTEM
       ======================================================== */

    setupButtons() {

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) {
                    return;
                }

                const action =
                    button.getAttribute(
                        "data-action"
                    );

                this.handleAction(
                    action
                );
            }
        );
    },


    handleAction(action) {

        switch (action) {

            case "health-check":

                this.startHealthCheck();

                break;


            case "symptom-checker":

                this.navigateTo(
                    "symptom-checker"
                );

                break;


            case "first-aid":

                this.navigateTo(
                    "first-aid"
                );

                break;


            case "monitor":

                this.navigateTo(
                    "health-monitoring"
                );

                break;


            case "map":

                this.navigateTo(
                    "healthcare-map"
                );

                break;


            case "reminders":

                this.navigateTo(
                    "reminders"
                );

                break;


            case "explore":

                this.navigateTo(
                    "features"
                );

                break;


            case "home":

                this.navigateTo(
                    "home"
                );

                break;


            default:

                console.log(
                    `[HealthSphere] Action "${action}" triggered.`
                );
        }
    },


    /* ========================================================
       MOBILE MENU
       ======================================================== */

    setupMobileMenu() {

        const menuButton =
            document.querySelector(
                "#menu-toggle"
            ) ||
            document.querySelector(
                ".menu-toggle"
            ) ||
            document.querySelector(
                ".hamburger"
            );

        const menu =
            document.querySelector(
                "#mobile-menu"
            ) ||
            document.querySelector(
                ".mobile-menu"
            );

        if (
            !menuButton ||
            !menu
        ) {

            console.log(
                "[HealthSphere] Mobile menu not detected."
            );

            return;
        }

        menuButton.addEventListener(
            "click",
            () => {

                this.state.menuOpen =
                    !this.state.menuOpen;

                menu.classList.toggle(
                    "open",
                    this.state.menuOpen
                );

                menuButton.classList.toggle(
                    "active",
                    this.state.menuOpen
                );
            }
        );
    },


    closeMobileMenu() {

        const menu =
            document.querySelector(
                "#mobile-menu"
            ) ||
            document.querySelector(
                ".mobile-menu"
            );

        const menuButton =
            document.querySelector(
                "#menu-toggle"
            ) ||
            document.querySelector(
                ".menu-toggle"
            ) ||
            document.querySelector(
                ".hamburger"
            );

        if (menu) {

            menu.classList.remove(
                "open"
            );
        }

        if (menuButton) {

            menuButton.classList.remove(
                "active"
            );
        }

        this.state.menuOpen = false;
    },


    /* ========================================================
       HEALTH CHECK
       ======================================================== */

    setupHealthCheck() {

        document.addEventListener(
            "change",
            event => {

                const input =
                    event.target.closest(
                        "[data-symptom]"
                    );

                if (!input) {
                    return;
                }

                const symptom =
                    input.getAttribute(
                        "data-symptom"
                    ) ||
                    input.value;

                if (!symptom) {
                    return;
                }

                if (input.checked) {

                    if (
                        !this.state.selectedSymptoms
                            .includes(symptom)
                    ) {

                        this.state.selectedSymptoms.push(
                            symptom
                        );
                    }

                } else {

                    this.state.selectedSymptoms =
                        this.state.selectedSymptoms
                            .filter(
                                item =>
                                    item !== symptom
                            );
                }

                this.updateSymptomCount();

                this.saveData();
            }
        );


        document.addEventListener(
            "click",
            event => {

                const next =
                    event.target.closest(
                        "[data-health-next]"
                    );

                const previous =
                    event.target.closest(
                        "[data-health-prev]"
                    );


                if (next) {

                    this.nextHealthStep();
                }


                if (previous) {

                    this.previousHealthStep();
                }
            }
        );
    },


    startHealthCheck() {

        this.state.healthCheckStep = 1;

        this.state.selectedSymptoms = [];

        this.navigateTo(
            "health-check"
        );

        this.updateHealthCheck();
    },


    nextHealthStep() {

        if (
            this.state.healthCheckStep <
            5
        ) {

            this.state.healthCheckStep++;

            this.updateHealthCheck();

        } else {

            this.calculateRisk();
        }
    },


    previousHealthStep() {

        if (
            this.state.healthCheckStep >
            1
        ) {

            this.state.healthCheckStep--;

            this.updateHealthCheck();
        }
    },


    updateHealthCheck() {

        const steps =
            document.querySelectorAll(
                ".health-step"
            );

        steps.forEach(
            (step, index) => {

                step.classList.toggle(
                    "active",
                    index + 1 ===
                    this.state.healthCheckStep
                );
            }
        );


        const progress =
            document.querySelector(
                ".health-progress"
            );

        if (progress) {

            progress.style.width =
                `${this.state.healthCheckStep * 20}%`;
        }


        const counter =
            document.querySelector(
                ".health-step-counter"
            );

        if (counter) {

            counter.textContent =
                `Step ${this.state.healthCheckStep} of 5`;
        }
    },


    updateSymptomCount() {

        const counters =
            document.querySelectorAll(
                "[data-symptom-count]"
            );

        counters.forEach(
            counter => {

                counter.textContent =
                    this.state
                        .selectedSymptoms
                        .length;
            }
        );
    },


    /* ========================================================
       SIMPLE RISK ENGINE
       ======================================================== */

    calculateRisk() {

        const symptoms =
            this.state.selectedSymptoms;


        /*
         * These are ONLY awareness categories,
         * not medical diagnosis.
         */

        const urgentSymptoms = [

            "chest-pain",

            "difficulty-breathing",

            "unconsciousness",

            "severe-bleeding",

            "stroke-signs"
        ];


        const cautionSymptoms = [

            "persistent-fever",

            "severe-headache",

            "vomiting",

            "dizziness",

            "persistent-cough"
        ];


        let risk = "green";


        if (
            symptoms.some(
                symptom =>
                    urgentSymptoms.includes(
                        symptom
                    )
            )
        ) {

            risk = "red";

        } else if (
            symptoms.some(
                symptom =>
                    cautionSymptoms.includes(
                        symptom
                    )
            )
        ) {

            risk = "yellow";
        }


        this.state.riskLevel =
            risk;


        this.displayRisk(
            risk
        );

        this.saveData();
    },


    displayRisk(risk) {

        const result =
            document.querySelector(
                "#risk-result"
            ) ||
            document.querySelector(
                ".risk-result"
            );


        if (!result) {

            console.log(
                `[HealthSphere] Risk level: ${risk}`
            );

            return;
        }


        result.classList.remove(
            "green",
            "yellow",
            "red"
        );

        result.classList.add(
            risk
        );


        const title =
            result.querySelector(
                "[data-risk-title]"
            );


        const message =
            result.querySelector(
                "[data-risk-message]"
            );


        if (risk === "green") {

            if (title) {

                title.textContent =
                    "Green Zone";
            }

            if (message) {

                message.textContent =
                    "No obvious urgent warning sign was identified from the selected information. Continue monitoring your health.";
            }
        }


        if (risk === "yellow") {

            if (title) {

                title.textContent =
                    "Yellow Zone";
            }

            if (message) {

                message.textContent =
                    "Your selected symptoms may need attention. Consider appropriate professional advice, especially if symptoms continue or worsen.";
            }
        }


        if (risk === "red") {

            if (title) {

                title.textContent =
                    "Red Zone";
            }

            if (message) {

                message.textContent =
                    "The selected information contains a potential warning sign. Seek prompt professional medical attention.";
            }
        }


        result.hidden = false;
    },


    /* ========================================================
       BLOOD PRESSURE
       ======================================================== */

    addBPRecord(systolic, diastolic) {

        const record = {

            id: Date.now(),

            systolic:
                Number(systolic),

            diastolic:
                Number(diastolic),

            date:
                new Date().toISOString()
        };


        this.state.bpRecords.push(
            record
        );

        this.saveData();

        return record;
    },


    /* ========================================================
       DIABETES
       ======================================================== */

    addDiabetesRecord(glucose) {

        const record = {

            id: Date.now(),

            glucose:
                Number(glucose),

            date:
                new Date().toISOString()
        };


        this.state.diabetesRecords.push(
            record
        );

        this.saveData();

        return record;
    },


    /* ========================================================
       MEDICAL REPORTS
       ======================================================== */

    addReport(report) {

        const item = {

            id: Date.now(),

            name:
                report.name || "Health Report",

            type:
                report.type || "General",

            date:
                report.date ||
                new Date().toISOString(),

            file:
                report.file || null
        };


        this.state.healthReports.push(
            item
        );

        this.saveData();

        return item;
    },


    /* ========================================================
       REMINDERS
       ======================================================== */

    addReminder(
        title,
        date,
        type = "general"
    ) {

        const reminder = {

            id: Date.now(),

            title,

            date,

            type,

            completed: false
        };


        this.state.reminders.push(
            reminder
        );

        this.saveData();

        return reminder;
    },


    completeReminder(id) {

        const reminder =
            this.state.reminders.find(
                item =>
                    item.id === id
            );

        if (!reminder) {
            return;
        }

        reminder.completed =
            !reminder.completed;

        this.saveData();
    },


    /* ========================================================
       LANGUAGE
       ======================================================== */

    setLanguage(language) {

        if (!language) {
            return;
        }

        this.state.language =
            language;

        document.documentElement.lang =
            language;

        this.saveData();
    },


    /* ========================================================
       SCROLL EFFECT
       ======================================================== */

    setupScrollEffects() {

        const header =
            document.querySelector(
                "header"
            );

        if (!header) {
            return;
        }


        const handleScroll = () => {

            if (
                window.scrollY > 30
            ) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );
            }
        };


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        handleScroll();
    },


    /* ========================================================
       KEYBOARD CONTROLS
       ======================================================== */

    setupKeyboardControls() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    this.closeMobileMenu();
                }
            }
        );
    },


    /* ========================================================
       HEALTHCARE MAP PLACEHOLDER
       ======================================================== */

    initializeMapPlaceholder() {

        const map =
            document.getElementById(
                "healthcare-map"
            );

        if (!map) {
            return;
        }


        /*
         * Backend/API map integration can
         * be connected here later.
         */

        console.log(
            "[HealthSphere] Map container ready."
        );
    }
};


/* ============================================================
   SAFE APPLICATION START
   ============================================================ */

function startHealthSphere() {

    try {

        HealthSphere.init();

        HealthSphere.initializeMapPlaceholder();

    } catch (error) {

        /*
         * IMPORTANT:
         * Never allow a JavaScript error to leave
         * the splash screen permanently visible.
         */

        console.error(
            "[HealthSphere] Startup error:",
            error
        );


        const splash =
            document.getElementById(
                "splash-screen"
            );

        if (splash) {

            splash.style.opacity =
                "0";

            splash.style.visibility =
                "hidden";

            splash.style.pointerEvents =
                "none";

            setTimeout(
                () => {

                    splash.style.display =
                        "none";

                },
                500
            );
        }
    }
}


/* ============================================================
   DOM READY
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startHealthSphere
    );

} else {

    startHealthSphere();
}


/* ============================================================
   GLOBAL ACCESS
   ============================================================ */

window.HealthSphere =
    HealthSphere;


/* ============================================================
   DEVELOPMENT MESSAGE
   ============================================================ */

console.log(
    "%c HealthSphere ",
    "background:#0b8f83;color:white;font-weight:bold;padding:6px 10px;border-radius:6px;"
);

console.log(
    "Care • Connect • Protect"
);
/* =========================================================
   HEALTHSPHERE — SYMPTOM CHECKER
========================================================= */

(function initializeSymptomChecker() {

    "use strict";

    const introScreen = document.getElementById("symptom-intro");
    const questionScreen = document.getElementById("symptom-question");
    const resultScreen = document.getElementById("symptom-result");

    const startButton = document.getElementById("start-symptom-check");
    const restartButton = document.getElementById("restart-check");
    const restartResultButton = document.getElementById("restart-result");

    const answerButtons =
        document.querySelectorAll(".answer-button");

    const questionCounter =
        document.getElementById("question-counter");

    const questionNumber =
        document.getElementById("question-number");

    const questionText =
        document.getElementById("symptom-question-text");

    const questionHelp =
        document.getElementById("symptom-question-help");

    const progress =
        document.getElementById("symptom-progress");

    const riskIndicator =
        document.getElementById("risk-indicator");

    const riskTitle =
        document.getElementById("risk-title");

    const riskSubtitle =
        document.getElementById("risk-subtitle");

    const resultHeading =
        document.getElementById("result-heading");

    const resultDescription =
        document.getElementById("result-description");

    const symptomSummary =
        document.getElementById("symptom-summary");

    const answeredCount =
        document.getElementById("answered-count");

    const nextStepText =
        document.getElementById("next-step-text");


    /* ---------------------------------------------------------
       SAFETY CHECK
    --------------------------------------------------------- */

    if (
        !introScreen ||
        !questionScreen ||
        !resultScreen ||
        !startButton
    ) {
        console.warn(
            "[HealthSphere] Symptom Checker elements not found."
        );

        return;
    }


    /* ---------------------------------------------------------
       QUESTIONS
    --------------------------------------------------------- */

    const questions = [

        {
            id: "fever",
            name: "Fever",
            text: "Are you experiencing fever?",
            help: "A raised body temperature or feeling unusually hot."
        },

        {
            id: "headache",
            name: "Headache",
            text: "Are you experiencing a headache?",
            help: "Consider whether you currently have head pain or pressure."
        },

        {
            id: "cough",
            name: "Cough",
            text: "Are you experiencing a cough?",
            help: "Include a new or ongoing cough."
        },

        {
            id: "fatigue",
            name: "Fatigue",
            text: "Are you experiencing unusual fatigue?",
            help: "Think about whether you feel unusually tired or weak."
        },

        {
            id: "breathing",
            name: "Breathing difficulty",
            text: "Are you having difficulty breathing?",
            help: "Breathing difficulty can require prompt medical attention."
        }

    ];


    let currentQuestion = 0;

    let answers = {};


    /* ---------------------------------------------------------
       SHOW SCREEN
    --------------------------------------------------------- */

    function showScreen(screen) {

        introScreen.classList.remove("active");
        questionScreen.classList.remove("active");
        resultScreen.classList.remove("active");

        screen.classList.add("active");

    }


    /* ---------------------------------------------------------
       START
    --------------------------------------------------------- */

    function startChecker() {

        currentQuestion = 0;

        answers = {};

        showScreen(questionScreen);

        renderQuestion();

    }


    /* ---------------------------------------------------------
       RENDER QUESTION
    --------------------------------------------------------- */

    function renderQuestion() {

        const question = questions[currentQuestion];

        const total =
            questions.length;

        const number =
            currentQuestion + 1;

        questionCounter.textContent =
            `Question ${number} of ${total}`;

        questionNumber.textContent =
            String(number).padStart(2, "0");

        questionText.textContent =
            question.text;

        questionHelp.textContent =
            question.help;

        progress.style.width =
            `${(number / total) * 100}%`;

    }


    /* ---------------------------------------------------------
       ANSWER
    --------------------------------------------------------- */

    function handleAnswer(answer) {

        const question =
            questions[currentQuestion];

        answers[question.id] = answer;

        if (currentQuestion < questions.length - 1) {

            currentQuestion++;

            renderQuestion();

        } else {

            generateResult();

        }

    }


    /* ---------------------------------------------------------
       RISK ENGINE
    --------------------------------------------------------- */

    function calculateRisk() {

        /*
         * This is intentionally a simple FRONTEND demo rule.
         * It does not diagnose a medical condition.
         */

        if (answers.breathing === "yes") {

            return "red";

        }

        const yesCount =
            Object.values(answers)
                .filter(value => value === "yes")
                .length;


        if (yesCount >= 3) {

            return "yellow";

        }

        return "green";

    }


    /* ---------------------------------------------------------
       RESULT
    --------------------------------------------------------- */

    function generateResult() {

        const risk =
            calculateRisk();

        updateRiskUI(risk);

        generateSummary();

        showScreen(resultScreen);

    }


    /* ---------------------------------------------------------
       UPDATE RISK UI
    --------------------------------------------------------- */

    function updateRiskUI(risk) {

        riskIndicator.className =
            `risk-indicator ${risk}`;


        if (risk === "red") {

            riskTitle.textContent =
                "RED · URGENT ATTENTION";

            riskSubtitle.textContent =
                "Seek urgent medical attention, especially if symptoms are severe or worsening.";

            resultHeading.textContent =
                "Please prioritize medical care.";

            resultDescription.textContent =
                "A breathing-related warning response was selected. This checker cannot diagnose a condition. Seek urgent professional medical assessment.";

            nextStepText.textContent =
                "Contact an appropriate healthcare professional or emergency service if you are experiencing severe or rapidly worsening symptoms.";

        }

        else if (risk === "yellow") {

            riskTitle.textContent =
                "YELLOW · MEDICAL ADVICE";

            riskSubtitle.textContent =
                "Consider discussing your symptoms with a healthcare professional.";

            resultHeading.textContent =
                "Your symptoms deserve attention.";

            resultDescription.textContent =
                "Several symptoms were selected. Consider monitoring them and seeking professional medical advice, particularly if they persist or worsen.";

            nextStepText.textContent =
                "Consider contacting a doctor or qualified healthcare professional for appropriate evaluation.";

        }

        else {

            riskTitle.textContent =
                "GREEN · MONITOR";

            riskSubtitle.textContent =
                "No immediate warning pattern was detected in this simple check.";

            resultHeading.textContent =
                "Continue being health aware.";

            resultDescription.textContent =
                "Your responses do not indicate an immediate warning pattern in this simple awareness check. Continue monitoring how you feel.";

            nextStepText.textContent =
                "Continue monitoring your symptoms and seek professional advice if they persist, worsen, or concern you.";

        }

    }


    /* ---------------------------------------------------------
       SUMMARY
    --------------------------------------------------------- */

    function generateSummary() {

        symptomSummary.innerHTML = "";

        const answered =
            Object.keys(answers).length;

        answeredCount.textContent =
            `${answered} answered`;


        questions.forEach(question => {

            const answer =
                answers[question.id];

            if (!answer) return;

            const row =
                document.createElement("div");

            row.className =
                "summary-row";


            const symptomName =
                document.createElement("span");

            symptomName.textContent =
                question.name;


            const answerValue =
                document.createElement("span");

            answerValue.className =
                `summary-answer ${answer}`;

            answerValue.textContent =
                answer === "yes"
                    ? "Yes"
                    : "No";


            row.appendChild(symptomName);

            row.appendChild(answerValue);

            symptomSummary.appendChild(row);

        });

    }


    /* ---------------------------------------------------------
       RESET
    --------------------------------------------------------- */

    function resetChecker() {

        currentQuestion = 0;

        answers = {};

        showScreen(introScreen);

    }


    /* ---------------------------------------------------------
       EVENTS
    --------------------------------------------------------- */

    startButton.addEventListener(
        "click",
        startChecker
    );


    restartButton.addEventListener(
        "click",
        resetChecker
    );


    restartResultButton.addEventListener(
        "click",
        resetChecker
    );


    answerButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const answer =
                    button.dataset.answer;

                handleAnswer(answer);

            }
        );

    });


    console.log(
        "[HealthSphere] Symptom Checker ready."
    );

})();
/* =========================================================
   HEALTHSPHERE - SYMPTOM CHECKER
   Front-end awareness prototype
========================================================= */

(function () {

    "use strict";

    function initSymptomChecker() {

        const symptomOptions =
            document.querySelectorAll(".symptom-option");

        const categoryButtons =
            document.querySelectorAll(".category-btn");

        const searchInput =
            document.getElementById("symptom-search");

        const selectedCount =
            document.getElementById("selected-count");

        const selectedSymptoms =
            document.getElementById("selected-symptoms");

        const analyzeButton =
            document.getElementById("analyze-symptoms-btn");

        const resultBox =
            document.getElementById("symptom-result");

        const progressBar =
            document.getElementById("symptom-progress-bar");

        const progressText =
            document.getElementById("symptom-progress-text");


        /* ---------------------------------------------
           SAFETY CHECK
        --------------------------------------------- */

        if (
            !symptomOptions.length ||
            !selectedCount ||
            !selectedSymptoms ||
            !analyzeButton ||
            !resultBox
        ) {
            console.warn(
                "[HealthSphere] Symptom Checker elements not found."
            );
            return;
        }


        /* ---------------------------------------------
           STATE
        --------------------------------------------- */

        let selected = [];


        /* ---------------------------------------------
           SYMPTOM INFORMATION
        --------------------------------------------- */

        const symptomNames = {

            fever: "Fever",
            cough: "Cough",
            headache: "Headache",
            dizziness: "Dizziness",
            fatigue: "Fatigue",
            "sore-throat": "Sore throat",
            "body-ache": "Body ache",
            nausea: "Nausea",
            "stomach-discomfort": "Stomach discomfort",
            "breathing-difficulty": "Breathing difficulty",
            "chest-discomfort": "Chest discomfort",
            "runny-nose": "Runny nose"

        };


        /* ---------------------------------------------
           SELECT / UNSELECT SYMPTOM
        --------------------------------------------- */

        symptomOptions.forEach(function (button) {

            button.addEventListener("click", function () {

                const symptom =
                    button.dataset.symptom;

                if (!symptom) return;

                if (selected.includes(symptom)) {

                    selected =
                        selected.filter(
                            item => item !== symptom
                        );

                    button.classList.remove("selected");

                } else {

                    selected.push(symptom);

                    button.classList.add("selected");
                }

                updateSelectedSymptoms();

            });

        });


        /* ---------------------------------------------
           UPDATE SELECTED SYMPTOMS
        --------------------------------------------- */

        function updateSelectedSymptoms() {

            selectedCount.textContent =
                selected.length;

            if (selected.length === 0) {

                selectedSymptoms.innerHTML = `
                    <span class="empty-selection">
                        No symptoms selected yet.
                    </span>
                `;

                return;
            }

            selectedSymptoms.innerHTML =
                selected.map(function (symptom) {

                    return `
                        <span class="selected-chip">
                            ${symptomNames[symptom] || symptom}
                        </span>
                    `;

                }).join("");

        }


        /* ---------------------------------------------
           CATEGORY FILTER
        --------------------------------------------- */

        categoryButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                categoryButtons.forEach(function (btn) {

                    btn.classList.remove("active");

                });

                button.classList.add("active");

                const category =
                    button.dataset.category;

                symptomOptions.forEach(function (symptom) {

                    if (
                        category === "all" ||
                        symptom.dataset.category === category
                    ) {

                        symptom.style.display = "";

                    } else {

                        symptom.style.display = "none";

                    }

                });

            });

        });


        /* ---------------------------------------------
           SEARCH
        --------------------------------------------- */

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    const query =
                        searchInput.value
                            .trim()
                            .toLowerCase();

                    symptomOptions.forEach(function (button) {

                        const text =
                            button.textContent
                                .toLowerCase();

                        button.style.display =
                            text.includes(query)
                                ? ""
                                : "none";

                    });

                }
            );

        }


        /* ---------------------------------------------
           PROGRESS
        --------------------------------------------- */

        function updateProgress(step) {

            if (progressText) {

                progressText.textContent =
                    `Step ${step} of 3`;

            }

            if (progressBar) {

                progressBar.style.width =
                    `${(step / 3) * 100}%`;

            }

        }


        /* ---------------------------------------------
           ANALYSIS ENGINE
        --------------------------------------------- */

        function analyzeSymptoms() {

            if (selected.length === 0) {

                resultBox.innerHTML = `
                    <div class="result-card result-yellow">

                        <div class="result-icon">!</div>

                        <div>
                            <span class="result-label">
                                NEED MORE INFORMATION
                            </span>

                            <h3>
                                Please select at least one symptom.
                            </h3>

                            <p>
                                Choose the symptoms you are
                                experiencing and try again.
                            </p>
                        </div>

                    </div>
                `;

                resultBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                return;
            }


            updateProgress(2);


            /*
             * This is an awareness prototype.
             * It does NOT diagnose a medical condition.
             */

            let level = "green";

            let title =
                "Low immediate concern";

            let description =
                "Your selected symptoms do not automatically indicate an emergency. Continue monitoring how you feel.";

            let action =
                "Monitor symptoms and consider routine professional advice if they persist or worsen.";


            /* -----------------------------------------
               HIGH-ATTENTION SYMPTOMS
            ----------------------------------------- */

            if (
                selected.includes("breathing-difficulty") ||
                selected.includes("chest-discomfort")
            ) {

                level = "red";

                title =
                    "Prompt medical attention";

                description =
                    "Breathing difficulty or chest discomfort can sometimes require urgent professional assessment.";

                action =
                    "Seek appropriate medical attention promptly, especially if symptoms are severe, sudden, or worsening.";

            }

            /* -----------------------------------------
               MEDIUM ATTENTION
            ----------------------------------------- */

            else if (
                selected.length >= 3 ||
                selected.includes("fever") ||
                selected.includes("dizziness")
            ) {

                level = "yellow";

                title =
                    "Monitor closely";

                description =
                    "Several symptoms are present. This result is only an awareness guide and cannot determine the cause.";

                action =
                    "Rest, stay hydrated when appropriate, monitor changes, and consider speaking with a healthcare professional.";

            }


            /* -----------------------------------------
               RESULT DATA
            ----------------------------------------- */

            const resultData = {

                green: {
                    className: "result-green",
                    icon: "✓",
                    label: "GREEN · MONITOR",
                    color: "Green"
                },

                yellow: {
                    className: "result-yellow",
                    icon: "!",
                    label: "YELLOW · MONITOR CLOSELY",
                    color: "Yellow"
                },

                red: {
                    className: "result-red",
                    icon: "!",
                    label: "RED · PROMPT ATTENTION",
                    color: "Red"
                }

            };


            const result =
                resultData[level];


            /* -----------------------------------------
               DISPLAY RESULT
            ----------------------------------------- */

            resultBox.innerHTML = `

                <div class="result-card ${result.className}">

                    <div class="result-top">

                        <div class="result-icon">
                            ${result.icon}
                        </div>

                        <div>

                            <span class="result-label">
                                ${result.label}
                            </span>

                            <h3>
                                ${title}
                            </h3>

                        </div>

                    </div>


                    <div class="result-body">

                        <p>
                            ${description}
                        </p>

                        <div class="result-action">

                            <strong>
                                Suggested next step
                            </strong>

                            <span>
                                ${action}
                            </span>

                        </div>

                    </div>


                    <div class="result-disclaimer">

                        <strong>Important:</strong>
                        This HealthSphere feature provides
                        health-awareness information only.
                        It is not a diagnosis or a replacement
                        for a qualified healthcare professional.

                    </div>

                </div>


                <div class="selected-result">

                    <h4>
                        Your selected symptoms
                    </h4>

                    <div class="selected-result-list">

                        ${selected.map(function (symptom) {

                            return `
                                <span>
                                    ${symptomNames[symptom] || symptom}
                                </span>
                            `;

                        }).join("")}

                    </div>

                </div>

            `;


            updateProgress(3);


            /* -----------------------------------------
               SMOOTH SCROLL TO RESULT
            ----------------------------------------- */

            setTimeout(function () {

                resultBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 100);

        }


        /* ---------------------------------------------
           ANALYZE BUTTON
        --------------------------------------------- */

        analyzeButton.addEventListener(
            "click",
            analyzeSymptoms
        );


        /* ---------------------------------------------
           INITIAL STATE
        --------------------------------------------- */

        updateSelectedSymptoms();

        updateProgress(1);

        console.log(
            "[HealthSphere] Symptom Checker ready."
        );

    }


    /* ---------------------------------------------
       INITIALIZE AFTER PAGE LOAD
    --------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initSymptomChecker
        );

    } else {

        initSymptomChecker();

    }

})();

/* =========================================================
   HEALTHSPHERE
   RISK ENGINE
========================================================= */

(function () {

    "use strict";

    function initRiskEngine() {

        const cards =
            document.querySelectorAll(
                ".risk-level-card"
            );

        const title =
            document.getElementById(
                "current-risk-title"
            );

        const badge =
            document.getElementById(
                "current-risk-badge"
            );

        const meter =
            document.getElementById(
                "risk-meter-progress"
            );

        const recommendation =
            document.getElementById(
                "risk-recommendation"
            );


        /* ---------------------------------------------
           SAFETY CHECK
        --------------------------------------------- */

        if (
            !cards.length ||
            !title ||
            !badge ||
            !meter ||
            !recommendation
        ) {

            console.warn(
                "[HealthSphere] Risk Engine elements not found."
            );

            return;

        }


        /* ---------------------------------------------
           RISK DATA
        --------------------------------------------- */

        const riskData = {

            green: {

                title:
                    "Low immediate concern",

                badge:
                    "GREEN",

                width:
                    "22%",

                color:
                    "#159d78",

                icon:
                    "✓",

                message:
                    "Continue monitoring your health and maintain healthy daily habits."

            },

            yellow: {

                title:
                    "Monitor more closely",

                badge:
                    "YELLOW",

                width:
                    "55%",

                color:
                    "#d29a18",

                icon:
                    "!",

                message:
                    "Consider monitoring your symptoms and speaking with a healthcare professional if they persist or worsen."

            },

            red: {

                title:
                    "Prompt professional attention",

                badge:
                    "RED",

                width:
                    "88%",

                color:
                    "#d84d4d",

                icon:
                    "!",

                message:
                    "Some warning indicators may require prompt professional assessment. Seek appropriate medical attention."

            }

        };


        /* ---------------------------------------------
           DISPLAY RISK
        --------------------------------------------- */

        function showRisk(level) {

            const data =
                riskData[level];

            if (!data) return;


            /* Remove previous active */

            cards.forEach(function (card) {

                card.classList.remove(
                    "active"
                );

            });


            /* Activate selected */

            const selectedCard =
                document.querySelector(
                    `[data-risk="${level}"]`
                );

            if (selectedCard) {

                selectedCard.classList.add(
                    "active"
                );

            }


            /* Update title */

            title.textContent =
                data.title;


            /* Update badge */

            badge.textContent =
                data.badge;

            badge.style.background =
                `${data.color}15`;

            badge.style.color =
                data.color;


            /* Update meter */

            meter.style.width =
                data.width;

            meter.style.background =
                data.color;

            meter.style.boxShadow =
                `0 0 14px ${data.color}45`;


            /* Update recommendation */

            recommendation.innerHTML = `

                <div
                    class="recommendation-icon"
                    style="
                        color:${data.color};
                        background:${data.color}12;
                    "
                >
                    ${data.icon}
                </div>

                <div>

                    <strong>
                        Recommended next step
                    </strong>

                    <p>
                        ${data.message}
                    </p>

                </div>

            `;

        }


        /* ---------------------------------------------
           CARD CLICK
        --------------------------------------------- */

        cards.forEach(function (card) {

            card.addEventListener(
                "click",
                function () {

                    const level =
                        card.dataset.risk;

                    showRisk(level);

                }
            );

        });


        /* ---------------------------------------------
           INITIAL GREEN STATE
        --------------------------------------------- */

        showRisk("green");


        console.log(
            "[HealthSphere] Risk Engine ready."
        );

    }


    /* ---------------------------------------------
       INITIALIZE
    --------------------------------------------- */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initRiskEngine
        );

    } else {

        initRiskEngine();

    }

})();


/* ===========================
   HEALTHSPHERE SYMPTOM CHECKER
=========================== */

const selected = [];

const cards = document.querySelectorAll(".symptom-card");
const selectedBox = document.getElementById("selectedSymptoms");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("resultCard");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const search = document.getElementById("symptomSearch");

/* ---------- Select Symptoms ---------- */

cards.forEach(card => {

card.addEventListener("click",()=>{

const symptom = card.dataset.symptom;

if(selected.includes(symptom)){
selected.splice(selected.indexOf(symptom),1);
card.classList.remove("active");
}else{
selected.push(symptom);
card.classList.add("active");
}

updateUI();

});

});

/* ---------- Update UI ---------- */

function updateUI(){

selectedBox.innerHTML="";

if(selected.length===0){
selectedBox.textContent="No symptoms selected";
}else{

selected.forEach(sym=>{

const chip=document.createElement("div");
chip.className="selected-chip";
chip.textContent=sym;
selectedBox.appendChild(chip);

});

}

const progress=(selected.length/4)*100;
progressFill.style.width=Math.min(progress,100)+"%";
progressText.textContent=Math.min(progress,100)+"%";

}

/* ---------- Search ---------- */

search.addEventListener("input",()=>{

const value=search.value.toLowerCase();

cards.forEach(card=>{

const text=card.innerText.toLowerCase();

card.style.display=text.includes(value)?"flex":"none";

});

});

/* ---------- Analyze ---------- */

analyzeBtn.addEventListener("click",()=>{

if(selected.length===0){
alert("Please select at least one symptom.");
return;
}

let html="";
let cls="result-green";

if(
selected.includes("Fever") &&
selected.includes("Cough") &&
selected.includes("Fatigue") &&
selected.includes("Headache")
){

cls="result-yellow";

html=`
<h2>🟡 Moderate Risk</h2>

<p><strong>Possible Conditions</strong></p>

<ol>
<li>Influenza — 76%</li>
<li>Viral Infection — 14%</li>
<li>Common Cold — 7%</li>
<li>Other — 3%</li>
</ol>

<p><strong>Recommended Action:</strong> Monitor symptoms, stay hydrated and consult a healthcare professional if symptoms worsen.</p>
`;

}

else if(selected.includes("Chest pain") || selected.includes("Breathing difficulty")){

cls="result-red";

html=`
<h2>🔴 High Priority</h2>

<p>Your symptoms may require prompt medical attention.</p>

<p><strong>Recommendation:</strong> Visit the nearest healthcare facility immediately.</p>
`;

}

else{

cls="result-green";

html=`
<h2>🟢 Low Risk</h2>

<p>Your symptoms appear mild.</p>

<p>Rest, hydration and observation are recommended.</p>
`;

}

result.className=`result-card ${cls}`;
result.innerHTML=html;
result.classList.remove("hidden");

result.scrollIntoView({behavior:"smooth"});

});

/* =====================================================
   HEALTHSPHERE — FIRST AID & SAFETY HUB
===================================================== */

(function () {

    "use strict";

    const searchInput =
        document.getElementById("firstAidSearch");

    const cards =
        document.querySelectorAll(".aid-card");

    const filters =
        document.querySelectorAll(".aid-filter");

    const emptyState =
        document.getElementById("aidEmptyState");

    const modal =
        document.getElementById("aidModal");

    const modalOverlay =
        document.querySelector(".aid-modal-overlay");

    const closeModal =
        document.getElementById("closeAidModal");

    const modalIcon =
        document.getElementById("aidModalIcon");

    const modalLabel =
        document.getElementById("aidModalLabel");

    const modalTitle =
        document.getElementById("aidModalTitle");

    const modalIntro =
        document.getElementById("aidModalIntro");

    const modalSteps =
        document.getElementById("aidModalSteps");


    /* -----------------------------------------------
       FIRST AID CONTENT
    ------------------------------------------------ */

    const aidData = {

        cuts: {
            icon: "🩹",
            label: "MINOR INJURY",
            title: "Minor Cuts",
            intro:
                "For a small cut, focus on cleanliness, gentle care and monitoring.",

            steps: [
                "Move to a safe place and stay calm.",
                "If there is bleeding, use clean material and gentle pressure.",
                "Keep the area clean and avoid unnecessary touching.",
                "Monitor the area for worsening symptoms or signs of infection.",
                "Seek professional medical care if the injury is deep, severe or does not improve."
            ]
        },


        burns: {
            icon: "🔥",
            label: "BURN AWARENESS",
            title: "Minor Burns",
            intro:
                "For a minor burn, the priority is cooling the area and protecting it from further injury.",

            steps: [
                "Move away from the source of heat.",
                "Cool the affected area with cool running water.",
                "Avoid applying household substances or ice directly to the burn.",
                "Protect the area from further irritation.",
                "Seek medical care for serious, extensive or worsening burns."
            ]
        },


        dizziness: {
            icon: "🌀",
            label: "GENERAL SAFETY",
            title: "Feeling Dizzy",
            intro:
                "If you feel dizzy, prioritize immediate safety and avoid situations where you could fall.",

            steps: [
                "Sit or lie down somewhere safe.",
                "Avoid standing suddenly or walking until you feel steady.",
                "Rest and allow yourself time to recover.",
                "If dizziness continues, repeatedly returns or becomes severe, seek professional advice.",
                "Get urgent help if dizziness occurs with serious symptoms such as difficulty breathing or severe chest discomfort."
            ]
        },


        fainting: {
            icon: "💫",
            label: "GENERAL SAFETY",
            title: "Fainting",
            intro:
                "If someone faints, make sure the surrounding area is safe and seek help when needed.",

            steps: [
                "Make the surrounding area safe and check that the person is responsive.",
                "Do not leave someone who is unconscious alone.",
                "Seek emergency medical help if the person does not recover promptly or appears seriously unwell.",
                "Once recovered, encourage the person to remain resting and avoid suddenly standing.",
                "Repeated or unexplained fainting should be assessed by a healthcare professional."
            ]
        }

    };


    /* -----------------------------------------------
       FILTER
    ------------------------------------------------ */

    let activeCategory = "all";


    function filterCards() {

        const query =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

        let visibleCount = 0;


        cards.forEach(card => {

            const category =
                card.dataset.category || "";

            const title =
                card.dataset.title || "";

            const text =
                card.innerText.toLowerCase();


            const categoryMatch =
                activeCategory === "all" ||
                category === activeCategory;

            const searchMatch =
                !query ||
                title.toLowerCase().includes(query) ||
                text.includes(query);


            const visible =
                categoryMatch && searchMatch;


            card.style.display =
                visible ? "" : "none";


            if (visible) {
                visibleCount++;
            }

        });


        if (emptyState) {

            emptyState.hidden =
                visibleCount !== 0;

        }

    }


    /* -----------------------------------------------
       CATEGORY BUTTONS
    ------------------------------------------------ */

    filters.forEach(filter => {

        filter.addEventListener("click", function () {

            filters.forEach(button => {
                button.classList.remove("active");
            });

            this.classList.add("active");

            activeCategory =
                this.dataset.category || "all";

            filterCards();

        });

    });


    /* -----------------------------------------------
       SEARCH
    ------------------------------------------------ */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterCards
        );

    }


    /* -----------------------------------------------
       OPEN MODAL
    ------------------------------------------------ */

    function openAidModal(topic) {

        const data = aidData[topic];

        if (!data || !modal) {
            return;
        }


        modalIcon.textContent =
            data.icon;

        modalLabel.textContent =
            data.label;

        modalTitle.textContent =
            data.title;

        modalIntro.textContent =
            data.intro;


        modalSteps.innerHTML = "";


        data.steps.forEach(
            function (step, index) {

                const stepElement =
                    document.createElement("div");

                stepElement.className =
                    "aid-step";

                stepElement.innerHTML = `

                    <span class="aid-step-number">
                        ${index + 1}
                    </span>

                    <p>
                        ${step}
                    </p>

                `;

                modalSteps.appendChild(
                    stepElement
                );

            }
        );


        modal.classList.add("show");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

    }


    /* -----------------------------------------------
       CLOSE MODAL
    ------------------------------------------------ */

    function closeAidModal() {

        if (!modal) {
            return;
        }

        modal.classList.remove("show");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    /* -----------------------------------------------
       LEARN BUTTONS
    ------------------------------------------------ */

    document
        .querySelectorAll(".aid-learn-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const topic =
                        this.dataset.topic;

                    openAidModal(topic);

                }
            );

        });


    /* -----------------------------------------------
       CLOSE EVENTS
    ------------------------------------------------ */

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeAidModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeAidModal
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal &&
                modal.classList.contains("show")
            ) {

                closeAidModal();

            }

        }
    );


    /* -----------------------------------------------
       INITIALIZE
    ------------------------------------------------ */

    filterCards();

    console.log(
        "[HealthSphere] First Aid Hub ready."
    );

})();

/* =========================================================
   HEALTHSPHERE — FIRST AID ACCESS
   ========================================================= */

(function () {

    "use strict";

    const firstAidSearch =
        document.getElementById("firstAidSearch");

    const firstAidGrid =
        document.getElementById("firstAidGrid");

    const firstAidEmpty =
        document.getElementById("firstAidEmpty");

    const firstAidFilters =
        document.querySelectorAll(".first-aid-filter");

    const firstAidCards =
        document.querySelectorAll(".first-aid-card");

    const firstAidModal =
        document.getElementById("firstAidModal");

    const firstAidClose =
        document.getElementById("firstAidClose");

    const firstAidOverlay =
        document.getElementById("firstAidOverlay");

    const firstAidModalTitle =
        document.getElementById("firstAidModalTitle");

    const firstAidModalTag =
        document.getElementById("firstAidModalTag");

    const firstAidModalIntro =
        document.getElementById("firstAidModalIntro");

    const firstAidModalSteps =
        document.getElementById("firstAidModalSteps");

    const firstAidModalWarning =
        document.getElementById("firstAidModalWarning");


    /* -------------------------------------------------------
       FIRST AID CONTENT
       ------------------------------------------------------- */

    const firstAidData = {

        cut: {
            title: "Minor cuts & wounds",
            tag: "INJURY",
            intro:
                "For a small superficial cut, focus on basic wound care and monitoring.",

            steps: [
                "Wash your hands before touching the wound.",
                "If appropriate, gently rinse the area with clean running water.",
                "Apply gentle pressure with clean material if there is minor bleeding.",
                "Keep the area clean and protected while it heals.",
                "Seek professional care if bleeding does not stop, the wound is deep, or there are signs of infection."
            ],

            warning:
                "Seek urgent medical attention for severe bleeding, a deep wound, or a serious injury."
        },


        burn: {
            title: "Minor burns",
            tag: "BURNS",
            intro:
                "For a small superficial burn, cooling the affected area promptly can help.",

            steps: [
                "Move away from the source of heat.",
                "Cool the affected area under cool running water.",
                "Avoid applying ice directly to the skin.",
                "Do not intentionally break blisters.",
                "Seek professional medical care for extensive, deep, electrical, chemical, or serious burns."
            ],

            warning:
                "Serious or extensive burns require professional medical assessment."
        },


        nosebleed: {
            title: "Nosebleed",
            tag: "GENERAL",
            intro:
                "A common nosebleed can often be managed with calm positioning and gentle pressure.",

            steps: [
                "Sit upright and lean slightly forward.",
                "Breathe through your mouth.",
                "Gently pinch the soft part of the nose continuously.",
                "Avoid tilting the head backward.",
                "Seek medical attention if bleeding is heavy, prolonged, recurrent, or follows a significant injury."
            ],

            warning:
                "Heavy or persistent bleeding requires professional medical assessment."
        },


        breathing: {
            title: "Breathing difficulty",
            tag: "URGENT",
            intro:
                "Difficulty breathing can sometimes indicate a serious medical problem.",

            steps: [
                "Help the person remain calm and sit in a comfortable position.",
                "Loosen restrictive clothing if appropriate.",
                "Do not leave someone with severe breathing difficulty alone.",
                "If symptoms are severe, sudden, or worsening, seek emergency medical help immediately.",
                "Follow any emergency plan or prescribed rescue treatment the person already has."
            ],

            warning:
                "Severe or worsening breathing difficulty is an emergency. Contact local emergency services immediately."
        },


        sprain: {
            title: "Sprain or strain",
            tag: "INJURY",
            intro:
                "For a suspected minor sprain or strain, protect the area and avoid activities that worsen symptoms.",

            steps: [
                "Stop the activity that caused the injury.",
                "Rest the affected area.",
                "Use a wrapped cold pack for short periods if appropriate.",
                "Keep the injured area comfortable and supported.",
                "Seek professional assessment if pain is severe, the area looks deformed, or normal movement is significantly affected."
            ],

            warning:
                "A significant injury may require professional evaluation."
        },


        fainting: {
            title: "Fainting",
            tag: "GENERAL",
            intro:
                "If someone faints, focus on safety and getting appropriate help.",

            steps: [
                "Help prevent the person from falling or being injured.",
                "If they are unconscious, check that they are breathing normally.",
                "Do not give food or drink to an unconscious person.",
                "If they do not regain consciousness promptly or are not breathing normally, seek emergency medical help immediately.",
                "After recovery, encourage appropriate medical evaluation if the cause is unknown or the episode is concerning."
            ],

            warning:
                "Loss of consciousness with abnormal breathing or other serious symptoms requires emergency medical attention."
        }

    };


    /* -------------------------------------------------------
       CURRENT FILTER
       ------------------------------------------------------- */

    let currentCategory = "all";


    /* -------------------------------------------------------
       FILTER CARDS
       ------------------------------------------------------- */

    function filterFirstAidCards() {

        const searchTerm =
            firstAidSearch
                ? firstAidSearch.value
                    .trim()
                    .toLowerCase()
                : "";

        let visibleCount = 0;

        firstAidCards.forEach(function (card) {

            const category =
                card.dataset.category || "";

            const title =
                card.dataset.title || "";

            const matchesCategory =
                currentCategory === "all" ||
                category === currentCategory;

            const matchesSearch =
                !searchTerm ||
                title.includes(searchTerm) ||
                card.textContent
                    .toLowerCase()
                    .includes(searchTerm);

            const visible =
                matchesCategory && matchesSearch;

            card.style.display =
                visible ? "" : "none";

            if (visible) {
                visibleCount++;
            }

        });


        if (firstAidEmpty) {

            firstAidEmpty.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }

        if (firstAidGrid) {

            firstAidGrid.style.display =
                visibleCount === 0
                    ? "none"
                    : "grid";

        }

    }


    /* -------------------------------------------------------
       CATEGORY BUTTONS
       ------------------------------------------------------- */

    firstAidFilters.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                firstAidFilters.forEach(function (item) {

                    item.classList.remove("active");

                });

                button.classList.add("active");

                currentCategory =
                    button.dataset.category || "all";

                filterFirstAidCards();

            }
        );

    });


    /* -------------------------------------------------------
       SEARCH
       ------------------------------------------------------- */

    if (firstAidSearch) {

        firstAidSearch.addEventListener(
            "input",
            filterFirstAidCards
        );

    }


    /* -------------------------------------------------------
       OPEN MODAL
       ------------------------------------------------------- */

    document
        .querySelectorAll(".first-aid-view")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const aid =
                        button.dataset.aid;

                    const data =
                        firstAidData[aid];

                    if (!data) {
                        return;
                    }


                    if (firstAidModalTitle) {

                        firstAidModalTitle.textContent =
                            data.title;

                    }


                    if (firstAidModalTag) {

                        firstAidModalTag.textContent =
                            data.tag;

                    }


                    if (firstAidModalIntro) {

                        firstAidModalIntro.textContent =
                            data.intro;

                    }


                    if (firstAidModalSteps) {

                        firstAidModalSteps.innerHTML = "";

                        data.steps.forEach(
                            function (step, index) {

                                const stepElement =
                                    document.createElement("div");

                                stepElement.className =
                                    "first-aid-step";

                                stepElement.innerHTML = `
                                    <div class="first-aid-step-number">
                                        ${index + 1}
                                    </div>

                                    <p>
                                        ${step}
                                    </p>
                                `;

                                firstAidModalSteps.appendChild(
                                    stepElement
                                );

                            }
                        );

                    }


                    if (firstAidModalWarning) {

                        firstAidModalWarning.textContent =
                            data.warning;

                    }


                    if (firstAidModal) {

                        firstAidModal.classList.add("active");

                        firstAidModal.setAttribute(
                            "aria-hidden",
                            "false"
                        );

                        document.body.style.overflow =
                            "hidden";

                    }

                }
            );

        });


    /* -------------------------------------------------------
       CLOSE MODAL
       ------------------------------------------------------- */

    function closeFirstAidModal() {

        if (!firstAidModal) {
            return;
        }

        firstAidModal.classList.remove("active");

        firstAidModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

    }


    if (firstAidClose) {

        firstAidClose.addEventListener(
            "click",
            closeFirstAidModal
        );

    }


    if (firstAidOverlay) {

        firstAidOverlay.addEventListener(
            "click",
            closeFirstAidModal
        );

    }


    /* -------------------------------------------------------
       ESC KEY
       ------------------------------------------------------- */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                firstAidModal &&
                firstAidModal.classList.contains("active")
            ) {

                closeFirstAidModal();

            }

        }
    );


    /* -------------------------------------------------------
       INITIALIZE
       ------------------------------------------------------- */

    filterFirstAidCards();

    console.log(
        "[HealthSphere] First Aid module ready."
    );

})();

/* =========================================================
   HEALTH MONITORING MODULE
   ========================================================= */

(function () {

    "use strict";

    const storageKey = "healthsphere_health_history";

    const historyList =
        document.getElementById("healthHistoryList");

    const overallStatus =
        document.getElementById("overallHealthStatus");

    const overallMessage =
        document.getElementById("overallHealthMessage");

    const statusBadge =
        document.getElementById("healthStatusBadge");


    /* -------------------------------------------------------
       LOAD HISTORY
       ------------------------------------------------------- */

    function getHistory() {

        try {

            return JSON.parse(
                localStorage.getItem(storageKey)
            ) || [];

        } catch (error) {

            console.warn(
                "Unable to read health history.",
                error
            );

            return [];

        }

    }


    /* -------------------------------------------------------
       SAVE HISTORY
       ------------------------------------------------------- */

    function saveHistory(history) {

        try {

            localStorage.setItem(
                storageKey,
                JSON.stringify(history)
            );

        } catch (error) {

            console.warn(
                "Unable to save health history.",
                error
            );

        }

    }


    /* -------------------------------------------------------
       ADD READING
       ------------------------------------------------------- */

    function addReading(type, value, status) {

        const history = getHistory();

        history.unshift({

            id: Date.now(),

            type: type,

            value: value,

            status: status,

            date: new Date().toLocaleString()

        });

        saveHistory(history.slice(0, 30));

        renderHistory();

        updateOverallStatus(status);

    }


    /* -------------------------------------------------------
       STATUS
       ------------------------------------------------------- */

    function updateOverallStatus(status) {

        if (!overallStatus || !statusBadge) {
            return;
        }

        if (status === "green") {

            overallStatus.textContent =
                "Reading recorded";

            overallMessage.textContent =
                "This reading is within the general reference range used by this demo.";

            statusBadge.textContent =
                "GREEN";

        }

        else if (status === "yellow") {

            overallStatus.textContent =
                "Needs attention";

            overallMessage.textContent =
                "This reading may need monitoring or professional review.";

            statusBadge.textContent =
                "YELLOW";

        }

        else if (status === "red") {

            overallStatus.textContent =
                "Medical attention may be needed";

            overallMessage.textContent =
                "A concerning reading should be discussed with a qualified healthcare professional.";

            statusBadge.textContent =
                "RED";

        }

    }


    /* -------------------------------------------------------
       RENDER HISTORY
       ------------------------------------------------------- */

    function renderHistory() {

        if (!historyList) {
            return;
        }

        const history = getHistory();

        if (history.length === 0) {

            historyList.innerHTML = `
                <div class="health-history-empty">

                    <div>+</div>

                    <h4>
                        No readings recorded
                    </h4>

                    <p>
                        Your saved measurements will appear here.
                    </p>

                </div>
            `;

            return;

        }


        historyList.innerHTML = "";


        history.forEach(function (item) {

            const element =
                document.createElement("div");

            element.className =
                "health-history-item";


            element.innerHTML = `

                <div class="health-history-main">

                    <span
                        class="health-history-dot"
                        style="background:
                            ${
                                item.status === "red"
                                    ? "#d85a5a"
                                    : item.status === "yellow"
                                        ? "#d19a36"
                                        : "#159b78"
                            }">
                    </span>

                    <div>

                        <div class="health-history-name">
                            ${item.type}
                        </div>

                        <div class="health-history-date">
                            ${item.date}
                        </div>

                    </div>

                </div>


                <div class="health-history-value">
                    ${item.value}
                </div>

            `;

            historyList.appendChild(element);

        });

    }


    /* -------------------------------------------------------
       BLOOD PRESSURE
       ------------------------------------------------------- */

    const saveBPBtn =
        document.getElementById("saveBPBtn");

    if (saveBPBtn) {

        saveBPBtn.addEventListener(
            "click",
            function () {

                const systolic =
                    Number(
                        document.getElementById(
                            "systolicInput"
                        ).value
                    );

                const diastolic =
                    Number(
                        document.getElementById(
                            "diastolicInput"
                        ).value
                    );


                const result =
                    document.getElementById(
                        "bpResult"
                    );


                if (
                    !systolic ||
                    !diastolic ||
                    systolic <= 0 ||
                    diastolic <= 0
                ) {

                    result.textContent =
                        "Please enter both BP values.";

                    result.className =
                        "health-result status-yellow";

                    return;

                }


                let status =
                    "green";


                /*
                 * Demo classification only.
                 * Clinical interpretation should be
                 * implemented with verified medical
                 * guidelines in the final product.
                 */

                if (
                    systolic >= 180 ||
                    diastolic >= 120
                ) {

                    status = "red";

                    result.textContent =
                        "Very high reading — seek urgent professional medical advice.";

                }

                else if (
                    systolic >= 140 ||
                    diastolic >= 90
                ) {

                    status = "yellow";

                    result.textContent =
                        "Elevated reading — consider professional review and continued monitoring.";

                }

                else {

                    status = "green";

                    result.textContent =
                        "Reading recorded for monitoring.";

                }


                result.className =
                    "health-result status-" + status;


                addReading(
                    "Blood Pressure",
                    `${systolic}/${diastolic} mmHg`,
                    status
                );

            }
        );

    }


    /* -------------------------------------------------------
       GLUCOSE
       ------------------------------------------------------- */

    const saveGlucoseBtn =
        document.getElementById("saveGlucoseBtn");

    if (saveGlucoseBtn) {

        saveGlucoseBtn.addEventListener(
            "click",
            function () {

                const value =
                    Number(
                        document.getElementById(
                            "glucoseInput"
                        ).value
                    );


                const result =
                    document.getElementById(
                        "glucoseResult"
                    );


                if (!value || value <= 0) {

                    result.textContent =
                        "Please enter a glucose reading.";

                    result.className =
                        "health-result status-yellow";

                    return;

                }


                /*
                 * Glucose interpretation depends on
                 * timing, meals, medications and other
                 * clinical factors.
                 *
                 * Therefore this demo only records
                 * the value instead of diagnosing.
                 */

                result.textContent =
                    "Reading recorded. Interpretation depends on context and should be discussed with a healthcare professional.";

                result.className =
                    "health-result";


                addReading(
                    "Blood Glucose",
                    `${value} mg/dL`,
                    "green"
                );

            }
        );

    }


    /* -------------------------------------------------------
       TEMPERATURE
       ------------------------------------------------------- */

    const saveTemperatureBtn =
        document.getElementById(
            "saveTemperatureBtn"
        );

    if (saveTemperatureBtn) {

        saveTemperatureBtn.addEventListener(
            "click",
            function () {

                const value =
                    Number(
                        document.getElementById(
                            "temperatureInput"
                        ).value
                    );


                const result =
                    document.getElementById(
                        "temperatureResult"
                    );


                if (!value || value <= 0) {

                    result.textContent =
                        "Please enter a temperature.";

                    result.className =
                        "health-result status-yellow";

                    return;

                }


                let status =
                    "green";


                if (value >= 103) {

                    status = "red";

                    result.textContent =
                        "High temperature — consider prompt professional medical advice.";

                }

                else if (value >= 100.4) {

                    status = "yellow";

                    result.textContent =
                        "Elevated temperature — monitor symptoms and consider medical advice.";

                }

                else {

                    result.textContent =
                        "Temperature recorded.";

                }


                result.className =
                    "health-result status-" + status;


                addReading(
                    "Temperature",
                    `${value} °F`,
                    status
                );

            }
        );

    }


    /* -------------------------------------------------------
       WEIGHT
       ------------------------------------------------------- */

    const saveWeightBtn =
        document.getElementById(
            "saveWeightBtn"
        );

    if (saveWeightBtn) {

        saveWeightBtn.addEventListener(
            "click",
            function () {

                const value =
                    Number(
                        document.getElementById(
                            "weightInput"
                        ).value
                    );


                const result =
                    document.getElementById(
                        "weightResult"
                    );


                if (!value || value <= 0) {

                    result.textContent =
                        "Please enter your weight.";

                    result.className =
                        "health-result status-yellow";

                    return;

                }


                result.textContent =
                    "Weight recorded successfully.";

                result.className =
                    "health-result status-green";


                addReading(
                    "Weight",
                    `${value} kg`,
                    "green"
                );

            }
        );

    }


    /* -------------------------------------------------------
       CLEAR HISTORY
       ------------------------------------------------------- */

    const clearHistory =
        document.getElementById(
            "clearHealthHistory"
        );

    if (clearHistory) {

        clearHistory.addEventListener(
            "click",
            function () {

                const confirmed =
                    window.confirm(
                        "Clear all saved health readings?"
                    );

                if (!confirmed) {
                    return;
                }

                localStorage.removeItem(
                    storageKey
                );

                renderHistory();

                if (overallStatus) {

                    overallStatus.textContent =
                        "No readings yet";

                }

                if (overallMessage) {

                    overallMessage.textContent =
                        "Add a health reading below to begin monitoring.";

                }

                if (statusBadge) {

                    statusBadge.textContent =
                        "READY";

                }

            }
        );

    }


    /* -------------------------------------------------------
       INITIALIZE
       ------------------------------------------------------- */

    renderHistory();

    console.log(
        "[HealthSphere] Health Monitoring module ready."
    );

})();

/* =========================================================
   REMINDERS & PREVENTIVE CARE MODULE
   ========================================================= */

(function () {

    "use strict";


    const STORAGE_KEY =
        "healthsphere_reminders";


    const reminderForm =
        document.getElementById(
            "reminderForm"
        );


    const reminderList =
        document.getElementById(
            "reminderList"
        );


    const completedCount =
        document.getElementById(
            "completedReminderCount"
        );


    const pendingCount =
        document.getElementById(
            "pendingReminderCount"
        );


    const upcomingCount =
        document.getElementById(
            "upcomingReminderCount"
        );


    const titleInput =
        document.getElementById(
            "reminderTitle"
        );


    const categoryInput =
        document.getElementById(
            "reminderCategory"
        );


    const dateInput =
        document.getElementById(
            "reminderDate"
        );


    const timeInput =
        document.getElementById(
            "reminderTime"
        );


    const noteInput =
        document.getElementById(
            "reminderNote"
        );


    /* =====================================================
       STORAGE
       ===================================================== */

    function getReminders() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                )
            ) || [];

        } catch (error) {

            console.warn(
                "[HealthSphere] Unable to load reminders.",
                error
            );

            return [];

        }

    }


    function saveReminders(reminders) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(reminders)
            );

        } catch (error) {

            console.warn(
                "[HealthSphere] Unable to save reminders.",
                error
            );

        }

    }


    /* =====================================================
       CREATE REMINDER
       ===================================================== */

    if (reminderForm) {

        reminderForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const title =
                    titleInput.value.trim();


                const category =
                    categoryInput.value;


                const date =
                    dateInput.value;


                const time =
                    timeInput.value;


                const note =
                    noteInput.value.trim();


                if (
                    !title ||
                    !date ||
                    !time
                ) {

                    return;

                }


                const reminders =
                    getReminders();


                reminders.push({

                    id: Date.now(),

                    title: title,

                    category: category,

                    date: date,

                    time: time,

                    note: note,

                    completed: false,

                    createdAt:
                        new Date().toISOString()

                });


                saveReminders(reminders);


                reminderForm.reset();


                renderReminders();

            }
        );

    }


    /* =====================================================
       QUICK REMINDER BUTTONS
       ===================================================== */

    const quickButtons =
        document.querySelectorAll(
            ".reminder-type-card"
        );


    quickButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const type =
                        button.dataset.reminderType;


                    if (titleInput) {

                        titleInput.value =
                            type;

                    }


                    if (categoryInput) {

                        if (
                            type ===
                            "Medicine Reminder"
                        ) {

                            categoryInput.value =
                                "Medicine";

                        }

                        else if (
                            type ===
                            "Doctor Appointment"
                        ) {

                            categoryInput.value =
                                "Appointment";

                        }

                        else if (
                            type ===
                            "Vaccination Reminder"
                        ) {

                            categoryInput.value =
                                "Vaccination";

                        }

                        else if (
                            type ===
                            "Polio Reminder"
                        ) {

                            categoryInput.value =
                                "Polio";

                        }

                        else {

                            categoryInput.value =
                                "Monitoring";

                        }

                    }


                    if (reminderForm) {

                        reminderForm.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                    if (titleInput) {

                        setTimeout(
                            function () {

                                titleInput.focus();

                            },
                            500
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(
                dateString + "T00:00:00"
            );


        if (Number.isNaN(date.getTime())) {
            return dateString;
        }


        return date.toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       REMINDER STATUS
       ===================================================== */

    function isUpcoming(reminder) {

        if (reminder.completed) {
            return false;
        }


        const reminderDate =
            new Date(
                `${reminder.date}T${reminder.time}`
            );


        return (
            reminderDate.getTime() >=
            Date.now()
        );

    }


    /* =====================================================
       RENDER
       ===================================================== */

    function renderReminders() {

        if (!reminderList) {
            return;
        }


        const reminders =
            getReminders();


        updateCounters(
            reminders
        );


        if (reminders.length === 0) {

            reminderList.innerHTML = `

                <div class="reminder-empty">

                    <div class="reminder-empty-icon">
                        ◷
                    </div>

                    <h4>
                        No reminders yet
                    </h4>

                    <p>
                        Add your first health reminder above.
                    </p>

                </div>

            `;

            return;

        }


        reminders.sort(
            function (a, b) {

                return (
                    new Date(
                        `${a.date}T${a.time}`
                    ) -
                    new Date(
                        `${b.date}T${b.time}`
                    )
                );

            }
        );


        reminderList.innerHTML = "";


        reminders.forEach(
            function (reminder) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "reminder-item" +
                    (
                        reminder.completed
                            ? " completed"
                            : ""
                    );


                item.innerHTML = `

                    <div class="reminder-item-main">

                        <button
                            type="button"
                            class="reminder-check-btn"
                            data-action="complete"
                            data-id="${reminder.id}"
                            aria-label="Mark reminder as completed">

                            ${reminder.completed ? "✓" : ""}

                        </button>


                        <div class="reminder-item-content">

                            <div class="reminder-item-title">

                                ${escapeHTML(
                                    reminder.title
                                )}

                            </div>


                            <div class="reminder-item-meta">

                                <span>
                                    ${escapeHTML(
                                        reminder.category
                                    )}
                                </span>

                                <span>
                                    ${formatDate(
                                        reminder.date
                                    )}
                                </span>

                                <span>
                                    ${escapeHTML(
                                        reminder.time
                                    )}
                                </span>

                            </div>


                            ${
                                reminder.note
                                    ? `
                                        <div
                                            class="reminder-item-note">

                                            ${escapeHTML(
                                                reminder.note
                                            )}

                                        </div>
                                      `
                                    : ""
                            }

                        </div>

                    </div>


                    <button
                        type="button"
                        class="reminder-delete-btn"
                        data-action="delete"
                        data-id="${reminder.id}"
                        aria-label="Delete reminder">

                        ×

                    </button>

                `;


                reminderList.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       BUTTON ACTIONS
       ===================================================== */

    if (reminderList) {

        reminderList.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "button"
                    );


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;


                const id =
                    Number(
                        button.dataset.id
                    );


                if (!id) {
                    return;
                }


                const reminders =
                    getReminders();


                const reminder =
                    reminders.find(
                        function (item) {

                            return item.id === id;

                        }
                    );


                if (!reminder) {
                    return;
                }


                if (
                    action ===
                    "complete"
                ) {

                    reminder.completed =
                        !reminder.completed;

                }


                if (
                    action ===
                    "delete"
                ) {

                    const index =
                        reminders.findIndex(
                            function (item) {

                                return (
                                    item.id === id
                                );

                            }
                        );


                    if (index !== -1) {

                        reminders.splice(
                            index,
                            1
                        );

                    }

                }


                saveReminders(
                    reminders
                );


                renderReminders();

            }
        );

    }


    /* =====================================================
       COUNTERS
       ===================================================== */

    function updateCounters(reminders) {

        const completed =
            reminders.filter(
                function (item) {

                    return item.completed;

                }
            ).length;


        const pending =
            reminders.filter(
                function (item) {

                    return !item.completed;

                }
            ).length;


        const upcoming =
            reminders.filter(
                function (item) {

                    return isUpcoming(item);

                }
            ).length;


        if (completedCount) {

            completedCount.textContent =
                completed;

        }


        if (pendingCount) {

            pendingCount.textContent =
                pending;

        }


        if (upcomingCount) {

            upcomingCount.textContent =
                upcoming;

        }

    }


    /* =====================================================
       CLEAR COMPLETED
       ===================================================== */

    const clearCompleted =
        document.getElementById(
            "clearCompletedReminders"
        );


    if (clearCompleted) {

        clearCompleted.addEventListener(
            "click",
            function () {

                const reminders =
                    getReminders();


                const remaining =
                    reminders.filter(
                        function (item) {

                            return !item.completed;

                        }
                    );


                saveReminders(
                    remaining
                );


                renderReminders();

            }
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    renderReminders();


    console.log(
        "[HealthSphere] Reminders module ready."
    );

})();

/* =========================================================
   HEALTHCARE MAP MODULE
   ========================================================= */

(function () {

    "use strict";


    const searchInput =
        document.getElementById(
            "healthcareSearch"
        );


    const locationButton =
        document.getElementById(
            "useLocationBtn"
        );


    const locationStatus =
        document.getElementById(
            "locationStatus"
        );


    const resultsList =
        document.getElementById(
            "healthcareResultsList"
        );


    const resultsCount =
        document.getElementById(
            "healthcareResultsCount"
        );


    const noResults =
        document.getElementById(
            "healthcareNoResults"
        );


    const categoryButtons =
        document.querySelectorAll(
            ".healthcare-category"
        );


    const placeCards =
        document.querySelectorAll(
            ".healthcare-place-card"
        );


    /* =====================================================
       FILTER RESULTS
       ===================================================== */

    function filterHealthcarePlaces() {

        if (!searchInput) {
            return;
        }


        const searchValue =
            searchInput.value
                .trim()
                .toLowerCase();


        const activeCategory =
            document.querySelector(
                ".healthcare-category.active"
            );


        const category =
            activeCategory
                ? activeCategory.dataset.category
                : "all";


        let visibleCount = 0;


        placeCards.forEach(
            function (card) {

                const name =
                    (
                        card.dataset.name ||
                        ""
                    ).toLowerCase();


                const type =
                    (
                        card.dataset.type ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !searchValue ||
                    name.includes(searchValue) ||
                    type.includes(searchValue);


                const matchesCategory =
                    category === "all" ||
                    type === category;


                const visible =
                    matchesSearch &&
                    matchesCategory;


                card.style.display =
                    visible
                        ? "flex"
                        : "none";


                if (visible) {

                    visibleCount++;

                }

            }
        );


        if (resultsCount) {

            resultsCount.textContent =
                `${visibleCount} ${
                    visibleCount === 1
                        ? "place"
                        : "places"
                }`;

        }


        if (noResults) {

            noResults.classList.toggle(
                "visible",
                visibleCount === 0
            );

        }

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterHealthcarePlaces
        );

    }


    /* =====================================================
       CATEGORY FILTER
       ===================================================== */

    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    categoryButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    filterHealthcarePlaces();

                }
            );

        }
    );


    /* =====================================================
       LOCATION
       ===================================================== */

    if (locationButton) {

        locationButton.addEventListener(
            "click",
            function () {

                if (!navigator.geolocation) {

                    if (locationStatus) {

                        locationStatus.innerHTML =
                            `<span class="location-dot"></span>
                             Location unavailable`;

                    }

                    return;

                }


                if (locationStatus) {

                    locationStatus.innerHTML =
                        `<span class="location-dot"></span>
                         Detecting location...`;

                }


                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        const latitude =
                            position.coords.latitude;


                        const longitude =
                            position.coords.longitude;


                        console.log(
                            "[HealthSphere] Location:",
                            latitude,
                            longitude
                        );


                        const currentMarker =
                            document.getElementById(
                                "currentLocationMarker"
                            );


                        if (currentMarker) {

                            currentMarker.style.display =
                                "grid";

                        }


                        if (locationStatus) {

                            locationStatus.innerHTML =
                                `<span class="location-dot"></span>
                                 Location detected`;

                        }

                    },

                    function () {

                        if (locationStatus) {

                            locationStatus.innerHTML =
                                `<span class="location-dot"></span>
                                 Location permission denied`;

                        }

                    }

                );

            }
        );

    }


    /* =====================================================
       MAP MARKERS
       ===================================================== */

    const mapMarkers =
        document.querySelectorAll(
            ".map-marker"
        );


    mapMarkers.forEach(
        function (marker) {

            marker.addEventListener(
                "click",
                function () {

                    const place =
                        marker.dataset.place;


                    if (!searchInput || !place) {
                        return;
                    }


                    searchInput.value =
                        place;


                    filterHealthcarePlaces();

                }
            );

        }
    );


    /* =====================================================
       DIRECTIONS
       ===================================================== */

    const directionButtons =
        document.querySelectorAll(
            ".place-direction-btn"
        );


    directionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const place =
                        button.dataset.place;


                    if (!place) {
                        return;
                    }


                    const destination =
                        encodeURIComponent(
                            place
                        );


                    /*
                     * Frontend-only implementation.
                     *
                     * A real production project can
                     * replace this with a verified maps
                     * provider's directions API.
                     */

                    window.open(
                        `https://www.google.com/maps/search/?api=1&query=${destination}`,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }
            );

        }
    );


    /* =====================================================
       DETAILS
       ===================================================== */

    const detailButtons =
        document.querySelectorAll(
            ".place-details-btn"
        );


    detailButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const place =
                        button.dataset.place;


                    if (!place) {
                        return;
                    }


                    alert(
                        `${place}\n\n` +
                        "Detailed facility information " +
                        "will be connected to the healthcare " +
                        "database in the backend integration phase."
                    );

                }
            );

        }
    );


    /* =====================================================
       MAP ZOOM VISUAL EFFECT
       ===================================================== */

    const mapPreview =
        document.getElementById(
            "healthcareMapPreview"
        );


    const zoomIn =
        document.getElementById(
            "zoomInBtn"
        );


    const zoomOut =
        document.getElementById(
            "zoomOutBtn"
        );


    let mapScale = 1;


    if (zoomIn && mapPreview) {

        zoomIn.addEventListener(
            "click",
            function () {

                mapScale =
                    Math.min(
                        mapScale + 0.1,
                        1.5
                    );


                mapPreview.style.transform =
                    `scale(${mapScale})`;

            }
        );

    }


    if (zoomOut && mapPreview) {

        zoomOut.addEventListener(
            "click",
            function () {

                mapScale =
                    Math.max(
                        mapScale - 0.1,
                        0.9
                    );


                mapPreview.style.transform =
                    `scale(${mapScale})`;

            }
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    filterHealthcarePlaces();


    console.log(
        "[HealthSphere] Healthcare Map module ready."
    );

})();

/* =========================================================
   MULTILINGUAL + VOICE ACCESSIBILITY MODULE
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       LANGUAGE SELECTION
       ===================================================== */

    const languageOptions =
        document.querySelectorAll(
            ".language-option"
        );


    const selectedLanguage =
        document.getElementById(
            "selectedLanguage"
        );


    languageOptions.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {

                    languageOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    option.classList.add(
                        "active"
                    );


                    const language =
                        option.dataset.language;


                    const code =
                        option.dataset.code;


                    if (selectedLanguage) {

                        selectedLanguage.textContent =
                            language;

                    }


                    /*
                     * Save the user's language choice
                     * locally for the frontend prototype.
                     *
                     * Backend translation can later
                     * use this language code.
                     */

                    try {

                        localStorage.setItem(
                            "healthsphereLanguage",
                            code
                        );

                    } catch (error) {

                        console.warn(
                            "Language preference could not be saved."
                        );

                    }


                    console.log(
                        "[HealthSphere] Language selected:",
                        language,
                        code
                    );

                }
            );

        }
    );


    /* =====================================================
       RESTORE LANGUAGE
       ===================================================== */

    try {

        const savedLanguage =
            localStorage.getItem(
                "healthsphereLanguage"
            );


        if (savedLanguage) {

            languageOptions.forEach(
                function (option) {

                    if (
                        option.dataset.code ===
                        savedLanguage
                    ) {

                        option.click();

                    }

                }
            );

        }

    } catch (error) {

        console.warn(
            "Could not restore language preference."
        );

    }


    /* =====================================================
       VOICE ELEMENTS
       ===================================================== */

    const voiceButton =
        document.getElementById(
            "voiceButton"
        );


    const voiceButtonText =
        document.getElementById(
            "voiceButtonText"
        );


    const voiceTranscript =
        document.getElementById(
            "voiceTranscript"
        );


    const clearVoiceText =
        document.getElementById(
            "clearVoiceText"
        );


    const voiceStatus =
        document.getElementById(
            "voiceStatus"
        );


    const voiceStatusDot =
        document.getElementById(
            "voiceStatusDot"
        );


    const voiceVisualizer =
        document.getElementById(
            "voiceVisualizer"
        );


    /* =====================================================
       SPEECH RECOGNITION SUPPORT
       ===================================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    let recognition = null;

    let isListening = false;


    if (SpeechRecognition) {

        recognition =
            new SpeechRecognition();


        recognition.continuous =
            false;


        recognition.interimResults =
            true;


        recognition.lang =
            "en-IN";


        recognition.onstart =
            function () {

                isListening = true;


                if (voiceButton) {

                    voiceButton.classList.add(
                        "listening"
                    );

                }


                if (voiceVisualizer) {

                    voiceVisualizer.classList.add(
                        "listening"
                    );

                }


                if (voiceStatus) {

                    voiceStatus.textContent =
                        "Listening...";

                }


                if (
                    voiceStatusDot
                ) {

                    voiceStatusDot.style.background =
                        "#dc6262";

                }


                if (voiceButtonText) {

                    voiceButtonText.textContent =
                        "Stop listening";

                }

            };


        recognition.onresult =
            function (event) {

                let transcript = "";


                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    transcript +=
                        event.results[i][0].transcript;

                }


                if (voiceTranscript) {

                    voiceTranscript.innerHTML =
                        `<span>${escapeHTML(
                            transcript
                        )}</span>`;

                }

            };


        recognition.onerror =
            function (event) {

                console.warn(
                    "[HealthSphere] Voice error:",
                    event.error
                );


                isListening = false;


                resetVoiceInterface();


                if (voiceTranscript) {

                    voiceTranscript.innerHTML =
                        `<span class="transcript-placeholder">
                            Voice recognition could not be completed.
                         </span>`;

                }

            };


        recognition.onend =
            function () {

                isListening = false;

                resetVoiceInterface();

            };

    }


    /* =====================================================
       VOICE BUTTON
       ===================================================== */

    if (voiceButton) {

        voiceButton.addEventListener(
            "click",
            function () {

                if (!recognition) {

                    showVoiceUnavailable();

                    return;

                }


                if (isListening) {

                    recognition.stop();

                    return;

                }


                try {

                    const activeLanguage =
                        document.querySelector(
                            ".language-option.active"
                        );


                    const languageCode =
                        activeLanguage
                            ? activeLanguage.dataset.code
                            : "en";


                    recognition.lang =
                        getSpeechLanguage(
                            languageCode
                        );


                    recognition.start();

                } catch (error) {

                    console.warn(
                        "[HealthSphere] Could not start voice recognition:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       CLEAR TRANSCRIPT
       ===================================================== */

    if (clearVoiceText) {

        clearVoiceText.addEventListener(
            "click",
            function () {

                if (voiceTranscript) {

                    voiceTranscript.innerHTML =
                        `<span class="transcript-placeholder">
                            Your spoken message will appear here...
                         </span>`;

                }

            }
        );

    }


    /* =====================================================
       RESET VOICE UI
       ===================================================== */

    function resetVoiceInterface() {

        if (voiceButton) {

            voiceButton.classList.remove(
                "listening"
            );

        }


        if (voiceVisualizer) {

            voiceVisualizer.classList.remove(
                "listening"
            );

        }


        if (voiceStatus) {

            voiceStatus.textContent =
                "Ready";

        }


        if (voiceStatusDot) {

            voiceStatusDot.style.background =
                "#14a17f";

        }


        if (voiceButtonText) {

            voiceButtonText.textContent =
                "Start speaking";

        }

    }


    /* =====================================================
       BROWSER SUPPORT MESSAGE
       ===================================================== */

    function showVoiceUnavailable() {

        if (voiceStatus) {

            voiceStatus.textContent =
                "Not supported";

        }


        if (voiceTranscript) {

            voiceTranscript.innerHTML =
                `<span class="transcript-placeholder">
                    Voice recognition is not supported
                    by this browser. Try a supported browser.
                 </span>`;

        }

    }


    /* =====================================================
       LANGUAGE → SPEECH LANGUAGE
       ===================================================== */

    function getSpeechLanguage(code) {

        const languages = {

            en: "en-IN",

            hi: "hi-IN",

            bn: "bn-IN",

            as: "hi-IN",

            ta: "ta-IN",

            te: "te-IN",

            mr: "mr-IN",

            gu: "gu-IN"

        };


        return languages[code] || "en-IN";

    }


    /* =====================================================
       SAFE HTML
       ===================================================== */

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;

    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    if (voiceStatus) {

        if (!SpeechRecognition) {

            voiceStatus.textContent =
                "Browser check";

        }

    }


    console.log(
        "[HealthSphere] Multilingual + Voice module ready."
    );

})();

/* =========================================================
   HEALTH ANALYTICS DASHBOARD
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       PERIOD FILTER
       ===================================================== */

    const periodButtons =
        document.querySelectorAll(
            ".period-button"
        );


    periodButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    periodButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const period =
                        button.dataset.period;


                    updateAnalyticsPeriod(
                        period
                    );

                }
            );

        }
    );


    /* =====================================================
       ANALYTICS PERIOD
       ===================================================== */

    function updateAnalyticsPeriod(
        period
    ) {

        const score =
            document.getElementById(
                "healthScore"
            );


        const progress =
            document.getElementById(
                "scoreProgress"
            );


        /*
         * Demonstration frontend data.
         *
         * Replace this later with backend/API data.
         */

        const demoScores = {

            "7": 82,

            "30": 86,

            "90": 79

        };


        const selectedScore =
            demoScores[period] || 82;


        if (score) {

            animateNumber(
                score,
                selectedScore
            );

        }


        if (progress) {

            progress.style.width =
                selectedScore + "%";

        }


        console.log(
            "[HealthSphere] Analytics period:",
            period + " days"
        );

    }


    /* =====================================================
       NUMBER ANIMATION
       ===================================================== */

    function animateNumber(
        element,
        target
    ) {

        const start =
            Number(
                element.textContent
            ) || 0;


        const duration =
            500;


        const startTime =
            performance.now();


        function update(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const value =
                Math.round(
                    start +
                    (target - start) *
                    eased
                );


            element.textContent =
                value;


            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            }

        }


        requestAnimationFrame(
            update
        );

    }


    /* =====================================================
       LOAD HEALTH SCORE
       ===================================================== */

    const initialScore =
        document.getElementById(
            "healthScore"
        );


    const initialProgress =
        document.getElementById(
            "scoreProgress"
        );


    if (
        initialScore &&
        initialProgress
    ) {

        const score =
            Number(
                initialScore.textContent
            ) || 82;


        initialProgress.style.width =
            score + "%";

    }


    /* =====================================================
       FRONTEND DATA BRIDGE
       ===================================================== */

    /*
     * These functions provide a clean place for
     * future backend/API integration.
     *
     * Example future flow:
     *
     * Backend/API
     *      ↓
     * getHealthAnalytics()
     *      ↓
     * updateAnalyticsDashboard()
     */


    window.HealthSphereAnalytics = {

        updateBloodPressure:
            function (
                systolic,
                diastolic
            ) {

                const element =
                    document.getElementById(
                        "analyticsBP"
                    );


                if (!element) {

                    return;

                }


                element.textContent =
                    systolic +
                    "/" +
                    diastolic;

            },


        updateBloodSugar:
            function (
                value
            ) {

                const element =
                    document.getElementById(
                        "analyticsSugar"
                    );


                if (!element) {

                    return;

                }


                element.textContent =
                    value;

            },


        updateHealthScore:
            function (
                value
            ) {

                const score =
                    document.getElementById(
                        "healthScore"
                    );


                const progress =
                    document.getElementById(
                        "scoreProgress"
                    );


                if (score) {

                    score.textContent =
                        value;

                }


                if (progress) {

                    progress.style.width =
                        value + "%";

                }

            }

    };


    console.log(
        "[HealthSphere] Analytics Dashboard ready."
    );

})();


/* =========================================================
   PRIVACY & DATA SECURITY
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const healthConsentToggle =
        document.getElementById(
            "healthConsentToggle"
        );


    const analyticsConsentToggle =
        document.getElementById(
            "analyticsConsentToggle"
        );


    const personalizationToggle =
        document.getElementById(
            "personalizationToggle"
        );


    const viewDataBtn =
        document.getElementById(
            "viewDataBtn"
        );


    const deleteDataBtn =
        document.getElementById(
            "deleteDataBtn"
        );


    /* =====================================================
       LOCAL STORAGE KEYS
       ===================================================== */

    const PRIVACY_KEYS = {

        healthConsent:
            "healthsphere_health_consent",

        analyticsConsent:
            "healthsphere_analytics_consent",

        personalization:
            "healthsphere_personalization"

    };


    /* =====================================================
       LOAD SAVED PRIVACY SETTINGS
       ===================================================== */

    function loadPrivacySettings() {

        try {

            const healthConsent =
                localStorage.getItem(
                    PRIVACY_KEYS.healthConsent
                );


            const analyticsConsent =
                localStorage.getItem(
                    PRIVACY_KEYS.analyticsConsent
                );


            const personalization =
                localStorage.getItem(
                    PRIVACY_KEYS.personalization
                );


            if (
                healthConsent !== null &&
                healthConsentToggle
            ) {

                healthConsentToggle.checked =
                    healthConsent === "true";

            }


            if (
                analyticsConsent !== null &&
                analyticsConsentToggle
            ) {

                analyticsConsentToggle.checked =
                    analyticsConsent === "true";

            }


            if (
                personalization !== null &&
                personalizationToggle
            ) {

                personalizationToggle.checked =
                    personalization === "true";

            }

        } catch (error) {

            console.warn(
                "[HealthSphere] Privacy settings could not be loaded.",
                error
            );

        }

    }


    /* =====================================================
       SAVE PRIVACY SETTING
       ===================================================== */

    function savePrivacySetting(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                String(value)
            );

        } catch (error) {

            console.warn(
                "[HealthSphere] Could not save privacy setting.",
                error
            );

        }

    }


    /* =====================================================
       HEALTH CONSENT
       ===================================================== */

    if (healthConsentToggle) {

        healthConsentToggle.addEventListener(
            "change",
            function () {

                savePrivacySetting(
                    PRIVACY_KEYS.healthConsent,
                    healthConsentToggle.checked
                );


                showPrivacyMessage(
                    healthConsentToggle.checked
                        ? "Health data consent enabled."
                        : "Health data consent disabled."
                );

            }
        );

    }


    /* =====================================================
       ANALYTICS CONSENT
       ===================================================== */

    if (analyticsConsentToggle) {

        analyticsConsentToggle.addEventListener(
            "change",
            function () {

                savePrivacySetting(
                    PRIVACY_KEYS.analyticsConsent,
                    analyticsConsentToggle.checked
                );


                showPrivacyMessage(
                    analyticsConsentToggle.checked
                        ? "Anonymous analytics enabled."
                        : "Anonymous analytics disabled."
                );

            }
        );

    }


    /* =====================================================
       PERSONALIZATION
       ===================================================== */

    if (personalizationToggle) {

        personalizationToggle.addEventListener(
            "change",
            function () {

                savePrivacySetting(
                    PRIVACY_KEYS.personalization,
                    personalizationToggle.checked
                );


                showPrivacyMessage(
                    personalizationToggle.checked
                        ? "Personalization enabled."
                        : "Personalization disabled."
                );

            }
        );

    }


    /* =====================================================
       VIEW LOCAL DATA
       ===================================================== */

    if (viewDataBtn) {

        viewDataBtn.addEventListener(
            "click",
            function () {

                const localData =
                    getHealthSphereLocalData();


                const dataWindow =
                    window.open(
                        "",
                        "_blank",
                        "width=650,height=600"
                    );


                if (!dataWindow) {

                    showPrivacyMessage(
                        "Please allow pop-ups to view local data."
                    );

                    return;

                }


                dataWindow.document.write(
                    `
                    <!DOCTYPE html>

                    <html>

                    <head>

                        <title>
                            HealthSphere Data
                        </title>

                        <style>

                            body {
                                font-family:
                                    Arial,
                                    sans-serif;

                                background:
                                    #f5faf8;

                                color:
                                    #315852;

                                padding:
                                    30px;
                            }

                            h1 {
                                font-size:
                                    24px;
                            }

                            pre {
                                padding:
                                    20px;

                                border-radius:
                                    15px;

                                background:
                                    #ffffff;

                                border:
                                    1px solid
                                    #dcebe8;

                                overflow:
                                    auto;

                                line-height:
                                    1.6;
                            }

                        </style>

                    </head>

                    <body>

                        <h1>
                            HealthSphere Local Data
                        </h1>

                        <p>
                            This is demonstration data stored
                            locally in your browser.
                        </p>

                        <pre>
${escapeHTML(
    JSON.stringify(
        localData,
        null,
        2
    )
)}
                        </pre>

                    </body>

                    </html>
                    `
                );

                dataWindow.document.close();

            }
        );

    }


    /* =====================================================
       DELETE DATA
       ===================================================== */

    if (deleteDataBtn) {

        deleteDataBtn.addEventListener(
            "click",
            function () {

                const confirmed =
                    window.confirm(
                        "Delete HealthSphere demonstration data stored in this browser?"
                    );


                if (!confirmed) {

                    return;

                }


                try {

                    const keysToDelete = [

                        PRIVACY_KEYS.healthConsent,

                        PRIVACY_KEYS.analyticsConsent,

                        PRIVACY_KEYS.personalization

                    ];


                    keysToDelete.forEach(
                        function (key) {

                            localStorage.removeItem(
                                key
                            );

                        }
                    );


                    /*
                     * Do not clear the entire localStorage.
                     *
                     * Other modules may have their own
                     * frontend data.
                     */


                    showPrivacyMessage(
                        "Privacy settings and demonstration data were cleared."
                    );


                } catch (error) {

                    console.error(
                        "[HealthSphere] Data deletion failed.",
                        error
                    );


                    showPrivacyMessage(
                        "Unable to clear the selected data."
                    );

                }

            }
        );

    }


    /* =====================================================
       GET LOCAL DATA
       ===================================================== */

    function getHealthSphereLocalData() {

        const data = {};


        try {

            Object.keys(
                localStorage
            ).forEach(
                function (key) {

                    if (
                        key.startsWith(
                            "healthsphere_"
                        )
                    ) {

                        data[key] =
                            localStorage.getItem(
                                key
                            );

                    }

                }
            );

        } catch (error) {

            console.warn(
                "[HealthSphere] Could not read local data.",
                error
            );

        }


        return data;

    }


    /* =====================================================
       SAFE HTML ESCAPING
       ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       PRIVACY MESSAGE
       ===================================================== */

    function showPrivacyMessage(
        message
    ) {

        let toast =
            document.getElementById(
                "privacyToast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "privacyToast";


            toast.style.position =
                "fixed";


            toast.style.bottom =
                "25px";


            toast.style.left =
                "50%";


            toast.style.transform =
                "translateX(-50%)";


            toast.style.zIndex =
                "99999";


            toast.style.padding =
                "12px 18px";


            toast.style.borderRadius =
                "12px";


            toast.style.background =
                "#315852";


            toast.style.color =
                "#ffffff";


            toast.style.fontFamily =
                "inherit";


            toast.style.fontSize =
                "12px";


            toast.style.fontWeight =
                "700";


            toast.style.boxShadow =
                "0 12px 30px rgba(0,0,0,.15)";


            toast.style.opacity =
                "0";


            toast.style.transition =
                "opacity .25s ease";


            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            message;


        requestAnimationFrame(
            function () {

                toast.style.opacity =
                    "1";

            }
        );


        clearTimeout(
            toast._hideTimer
        );


        toast._hideTimer =
            setTimeout(
                function () {

                    toast.style.opacity =
                        "0";

                },
                2500
            );

    }


    /* =====================================================
       PUBLIC PRIVACY API
       ===================================================== */

    window.HealthSpherePrivacy = {

        getConsent:
            function () {

                return {

                    health:
                        healthConsentToggle
                            ? healthConsentToggle.checked
                            : false,

                    analytics:
                        analyticsConsentToggle
                            ? analyticsConsentToggle.checked
                            : false,

                    personalization:
                        personalizationToggle
                            ? personalizationToggle.checked
                            : false

                };

            },


        clearSettings:
            function () {

                Object.values(
                    PRIVACY_KEYS
                ).forEach(
                    function (key) {

                        localStorage.removeItem(
                            key
                        );

                    }
                );


                showPrivacyMessage(
                    "Privacy settings cleared."
                );

            },


        getLocalData:
            function () {

                return getHealthSphereLocalData();

            }

    };


    /* =====================================================
       INITIALIZE
       ===================================================== */

    loadPrivacySettings();


    console.log(
        "[HealthSphere] Privacy module ready."
    );

})();

/* =========================================================
   HEALTHSPHERE PWA MANAGER
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const statusBar =
        document.getElementById(
            "pwaStatusBar"
        );


    const statusDot =
        document.getElementById(
            "pwaStatusDot"
        );


    const statusText =
        document.getElementById(
            "pwaStatusText"
        );


    const installButton =
        document.getElementById(
            "pwaInstallButton"
        );


    const updateCard =
        document.getElementById(
            "pwaUpdateCard"
        );


    const updateButton =
        document.getElementById(
            "pwaUpdateButton"
        );


    let deferredInstallPrompt =
        null;


    let waitingServiceWorker =
        null;


    /* =====================================================
       CONNECTION STATUS
       ===================================================== */

    function updateConnectionStatus() {

        if (
            navigator.onLine
        ) {

            if (statusDot) {

                statusDot.classList.remove(
                    "offline"
                );

            }


            if (statusText) {

                statusText.textContent =
                    "Online • HealthSphere connected";

            }

        } else {

            if (statusDot) {

                statusDot.classList.add(
                    "offline"
                );

            }


            if (statusText) {

                statusText.textContent =
                    "Offline • Cached mode active";

            }

        }

    }


    window.addEventListener(
        "online",
        updateConnectionStatus
    );


    window.addEventListener(
        "offline",
        updateConnectionStatus
    );


    updateConnectionStatus();


    /* =====================================================
       INSTALL PROMPT
       ===================================================== */

    window.addEventListener(
        "beforeinstallprompt",
        function (event) {

            /*
             * Stop browser from displaying
             * the default install prompt.
             */

            event.preventDefault();


            deferredInstallPrompt =
                event;


            if (installButton) {

                installButton.hidden =
                    false;

            }

        }
    );


    /* =====================================================
       INSTALL BUTTON
       ===================================================== */

    if (installButton) {

        installButton.addEventListener(
            "click",
            async function () {

                if (
                    !deferredInstallPrompt
                ) {

                    return;

                }


                deferredInstallPrompt.prompt();


                const result =
                    await deferredInstallPrompt
                        .userChoice;


                console.log(
                    "[HealthSphere PWA] Install result:",
                    result.outcome
                );


                deferredInstallPrompt =
                    null;


                installButton.hidden =
                    true;

            }
        );

    }


    /* =====================================================
       APP INSTALLED
       ===================================================== */

    window.addEventListener(
        "appinstalled",
        function () {

            console.log(
                "[HealthSphere PWA] App installed."
            );


            if (installButton) {

                installButton.hidden =
                    true;

            }

        }
    );


    /* =====================================================
       SERVICE WORKER REGISTRATION
       ===================================================== */

    if (
        "serviceWorker" in navigator
    ) {

        window.addEventListener(
            "load",
            async function () {

                try {

                    const registration =
                        await navigator.serviceWorker
                            .register(
                                "./service-worker.js"
                            );


                    console.log(
                        "[HealthSphere PWA] Service worker registered:",
                        registration.scope
                    );


                    /*
                     * Check for updates.
                     */

                    registration.update();


                    /*
                     * Detect a waiting worker.
                     */

                    if (
                        registration.waiting
                    ) {

                        showUpdateCard(
                            registration.waiting
                        );

                    }


                    registration.addEventListener(
                        "updatefound",
                        function () {

                            const newWorker =
                                registration.installing;


                            if (!newWorker) {

                                return;

                            }


                            newWorker.addEventListener(
                                "statechange",
                                function () {

                                    if (
                                        newWorker.state ===
                                        "installed"
                                    ) {

                                        if (
                                            navigator.serviceWorker
                                                .controller
                                        ) {

                                            showUpdateCard(
                                                newWorker
                                            );

                                        }

                                    }

                                }
                            );

                        }
                    );


                } catch (error) {

                    console.error(
                        "[HealthSphere PWA] Service worker registration failed:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       UPDATE CARD
       ===================================================== */

    function showUpdateCard(
        serviceWorker
    ) {

        waitingServiceWorker =
            serviceWorker;


        if (!updateCard) {

            return;

        }


        updateCard.hidden =
            false;

    }


    /* =====================================================
       UPDATE BUTTON
       ===================================================== */

    if (updateButton) {

        updateButton.addEventListener(
            "click",
            function () {

                if (
                    waitingServiceWorker
                ) {

                    waitingServiceWorker.postMessage(
                        {
                            type:
                                "SKIP_WAITING"
                        }
                    );

                }

            }
        );

    }


    /* =====================================================
       CONTROLLER CHANGE
       ===================================================== */

    navigator.serviceWorker?.addEventListener(
        "controllerchange",
        function () {

            /*
             * Reload once after the new service
             * worker becomes active.
             */

            window.location.reload();

        }
    );


    /* =====================================================
       PWA STATUS
       ===================================================== */

    if (statusBar) {

        statusBar.setAttribute(
            "data-pwa-ready",
            "true"
        );

    }


    console.log(
        "[HealthSphere PWA] PWA manager ready."
    );

})();

/* =========================================================
   PART 24 — FRONTEND TESTING SYSTEM
   ========================================================= */

(function () {

    "use strict";


    const testingCards =
        document.querySelectorAll(
            ".testing-card"
        );


    const testingProgressBar =
        document.getElementById(
            "testingProgressBar"
        );


    const testingProgressText =
        document.getElementById(
            "testingProgressText"
        );


    const testingScore =
        document.getElementById(
            "testingScore"
        );


    const testingStatus =
        document.getElementById(
            "testingStatus"
        );


    const testingComplete =
        document.getElementById(
            "testingComplete"
        );


    if (
        !testingCards.length
    ) {

        return;

    }


    function updateTestingDashboard() {

        let passed = 0;


        testingCards.forEach(
            function (card) {

                if (
                    card.classList.contains(
                        "passed"
                    )
                ) {

                    passed++;

                }

            }
        );


        const total =
            testingCards.length;


        const percentage =
            Math.round(
                (passed / total) * 100
            );


        if (testingProgressBar) {

            testingProgressBar.style.width =
                percentage + "%";

        }


        if (testingProgressText) {

            testingProgressText.textContent =
                passed +
                " / " +
                total +
                " completed";

        }


        if (testingScore) {

            testingScore.textContent =
                percentage + "%";

        }


        if (testingStatus) {

            if (percentage === 100) {

                testingStatus.textContent =
                    "All checks passed";

            } else if (percentage >= 75) {

                testingStatus.textContent =
                    "Almost ready";

            } else if (percentage >= 40) {

                testingStatus.textContent =
                    "Testing in progress";

            } else {

                testingStatus.textContent =
                    "Testing required";

            }

        }


        if (testingComplete) {

            testingComplete.hidden =
                percentage !== 100;

        }

    }


    testingCards.forEach(
        function (card) {

            const button =
                card.querySelector(
                    ".testing-check-btn"
                );


            if (!button) {

                return;

            }


            button.addEventListener(
                "click",
                function () {

                    const passed =
                        card.classList.toggle(
                            "passed"
                        );


                    button.textContent =
                        passed
                            ? "Passed ✓"
                            : "Mark Passed";


                    updateTestingDashboard();

                }
            );

        }
    );


    updateTestingDashboard();


    console.log(
        "[HealthSphere] Testing module ready."
    );

})();

/* =========================================================
   PART 25 — PREMIUM UI INTERACTION SYSTEM
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       PAGE LOADER
       ===================================================== */

    const pageLoader =
        document.getElementById(
            "pageLoader"
        );


    function hidePageLoader() {

        if (!pageLoader) {

            return;

        }


        window.setTimeout(
            function () {

                pageLoader.classList.add(
                    "is-hidden"
                );

            },
            450
        );

    }


    if (
        document.readyState ===
        "complete"
    ) {

        hidePageLoader();

    } else {

        window.addEventListener(
            "load",
            hidePageLoader
        );

    }


    /* =====================================================
       NAVBAR SCROLL EFFECT
       ===================================================== */

    const navigation =
        document.querySelector(
            ".navbar"
        ) ||
        document.querySelector(
            "nav"
        );


    function updateNavbar() {

        if (!navigation) {

            return;

        }


        if (
            window.scrollY > 30
        ) {

            navigation.classList.add(
                "hs-scrolled"
            );

        } else {

            navigation.classList.remove(
                "hs-scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );


    updateNavbar();


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            "section > *, " +
            ".feature-card, " +
            ".health-card, " +
            ".info-card, " +
            ".metric-card, " +
            ".action-card, " +
            ".testing-card"
        );


    revealElements.forEach(
        function (element) {

            element.classList.add(
                "hs-reveal"
            );

        }
    );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "hs-visible"
                                );


                                revealObserver.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .08,

                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(
            function (element) {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "hs-visible"
                );

            }
        );

    }


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backToTop =
        document.getElementById(
            "backToTop"
        );


    function updateBackToTop() {

        if (!backToTop) {

            return;

        }


        if (
            window.scrollY > 500
        ) {

            backToTop.classList.add(
                "visible"
            );

        } else {

            backToTop.classList.remove(
                "visible"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateBackToTop,
        {
            passive: true
        }
    );


    if (backToTop) {

        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo(
                    {
                        top: 0,

                        behavior:
                            "smooth"
                    }
                );

            }
        );

    }


    updateBackToTop();


    /* =====================================================
       TOAST SYSTEM
       ===================================================== */

    const toastContainer =
        document.getElementById(
            "toastContainer"
        );


    window.showHealthSphereToast =
        function (
            message,
            type
        ) {

            if (!toastContainer) {

                return;

            }


            const toast =
                document.createElement(
                    "div"
                );


            toast.className =
                "hs-toast";


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                "hs-toast-icon";


            if (
                type === "error"
            ) {

                icon.textContent =
                    "!";

            } else if (
                type === "warning"
            ) {

                icon.textContent =
                    "⚠";

            } else {

                icon.textContent =
                    "✓";

            }


            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                message;


            toast.appendChild(
                icon
            );


            toast.appendChild(
                text
            );


            toastContainer.appendChild(
                toast
            );


            window.setTimeout(
                function () {

                    toast.classList.add(
                        "is-leaving"
                    );


                    window.setTimeout(
                        function () {

                            toast.remove();

                        },
                        250
                    );

                },
                3200
            );

        };


    /* =====================================================
       BUTTON FEEDBACK
       ===================================================== */

    const interactiveButtons =
        document.querySelectorAll(
            "button[data-toast]"
        );


    interactiveButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const message =
                        button.dataset.toast;


                    if (
                        message &&
                        typeof window.showHealthSphereToast ===
                        "function"
                    ) {

                        window.showHealthSphereToast(
                            message
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       IMAGE ERROR HANDLING
       ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    image.classList.add(
                        "image-load-error"
                    );

                    console.warn(
                        "[HealthSphere] Image could not be loaded:",
                        image.src
                    );

                }
            );

        }
    );


    /* =====================================================
       KEYBOARD ESCAPE SUPPORT
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                document.body.classList.remove(
                    "modal-open"
                );

            }

        }
    );


    /* =====================================================
       NETWORK FEEDBACK
       ===================================================== */

    window.addEventListener(
        "offline",
        function () {

            if (
                typeof window.showHealthSphereToast ===
                "function"
            ) {

                window.showHealthSphereToast(
                    "You are offline. Cached HealthSphere features remain available.",
                    "warning"
                );

            }

        }
    );


    window.addEventListener(
        "online",
        function () {

            if (
                typeof window.showHealthSphereToast ===
                "function"
            ) {

                window.showHealthSphereToast(
                    "Connection restored.",
                    "success"
                );

            }

        }
    );


    /* =====================================================
       PERFORMANCE LOG
       ===================================================== */

    window.addEventListener(
        "load",
        function () {

            window.setTimeout(
                function () {

                    if (
                        window.performance &&
                        window.performance.getEntriesByType
                    ) {

                        const navigationEntry =
                            window.performance
                                .getEntriesByType(
                                    "navigation"
                                )[0];


                        if (
                            navigationEntry
                        ) {

                            console.log(
                                "[HealthSphere] Page load:",
                                Math.round(
                                    navigationEntry.loadEventEnd
                                ) + "ms"
                            );

                        }

                    }

                },
                0
            );

        }
    );


    console.log(
        "[HealthSphere] Premium UI system ready."
    );

})();


/* =========================================================
   STEP 19 — HEALTHCARE MAP
   LEAFLET + OPENSTREETMAP
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CHECK LEAFLET
       ===================================================== */

    if (
        typeof L === "undefined"
    ) {

        console.error(
            "[HealthSphere Map] Leaflet was not loaded."
        );

        return;

    }


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const mapElement =
        document.getElementById(
            "healthcareMap"
        );


    const searchInput =
        document.getElementById(
            "healthcareSearch"
        );


    const resultsContainer =
        document.getElementById(
            "healthcareResults"
        );


    const locationButton =
        document.getElementById(
            "locateUserButton"
        );


    const statusText =
        document.getElementById(
            "mapStatusText"
        );


    const statusDot =
        document.getElementById(
            "mapStatusDot"
        );


    if (
        !mapElement
    ) {

        console.warn(
            "[HealthSphere Map] Map container not found."
        );

        return;

    }


    /* =====================================================
       SAMPLE HEALTHCARE DATA
       ===================================================== */

    /*
     * These are DEMO locations.
     *
     * For the SIH prototype, you can replace these
     * coordinates with verified healthcare facilities
     * from your target region.
     */

    const healthcarePlaces = [

        {
            id: 1,

            name:
                "Agartala Government Medical College",

            type:
                "hospital",

            address:
                "Agartala, Tripura",

            lat:
                23.8315,

            lng:
                91.2868
        },


        {
            id: 2,

            name:
                "Tripura Medical College",

            type:
                "hospital",

            address:
                "Hapania, Agartala, Tripura",

            lat:
                23.8037,

            lng:
                91.2767
        },


        {
            id: 3,

            name:
                "ILS Hospitals",

            type:
                "hospital",

            address:
                "Agartala, Tripura",

            lat:
                23.8415,

            lng:
                91.2810
        },


        {
            id: 4,

            name:
                "Urban Health Centre",

            type:
                "clinic",

            address:
                "Agartala, Tripura",

            lat:
                23.8310,

            lng:
                91.2860
        },


        {
            id: 5,

            name:
                "Local Pharmacy",

            type:
                "pharmacy",

            address:
                "Agartala, Tripura",

            lat:
                23.8355,

            lng:
                91.2825
        }

    ];


    /* =====================================================
       MAP INITIALIZATION
       ===================================================== */

    const map =
        L.map(
            mapElement,
            {
                zoomControl:
                    true,

                attributionControl:
                    true
            }
        )
        .setView(
            [
                23.8315,
                91.2868
            ],
            13
        );


    /* =====================================================
       OPENSTREETMAP TILE LAYER
       ===================================================== */

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom:
                19,

            attribution:
                '&copy; OpenStreetMap contributors'

        }

    ).addTo(
        map
    );


    /* =====================================================
       MARKER STORAGE
       ===================================================== */

    const markers = [];


    /* =====================================================
       ICON
       ===================================================== */

    function createHealthcareIcon(
        type
    ) {

        let symbol =
            "🏥";


        if (
            type ===
            "clinic"
        ) {

            symbol =
                "⚕";

        }


        if (
            type ===
            "pharmacy"
        ) {

            symbol =
                "✚";

        }


        return L.divIcon({

            className:
                "healthcare-marker-wrapper",

            html:
                `
                <div
                    style="
                        width:32px;
                        height:32px;
                        border-radius:50%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#07988d;
                        border:3px solid #ffffff;
                        box-shadow:0 5px 16px rgba(7,152,141,.3);
                        font-size:14px;
                    "
                >
                    ${symbol}
                </div>
                `,

            iconSize:
                [32, 32],

            iconAnchor:
                [16, 16],

            popupAnchor:
                [0, -18]

        });

    }


    /* =====================================================
       ADD MARKERS
       ===================================================== */

    healthcarePlaces.forEach(
        function (place) {

            const marker =
                L.marker(
                    [
                        place.lat,
                        place.lng
                    ],
                    {
                        icon:
                            createHealthcareIcon(
                                place.type
                            )
                    }
                )
                .addTo(
                    map
                );


            marker.bindPopup(

                `
                <div>

                    <div
                        class="map-popup-title">
                        ${place.name}
                    </div>

                    <div
                        class="map-popup-type">
                        ${place.type}
                    </div>

                    <div
                        class="map-popup-address">
                        ${place.address}
                    </div>

                </div>
                `

            );


            markers.push({

                marker:
                    marker,

                place:
                    place

            });

        }
    );


    /* =====================================================
       DISTANCE CALCULATION
       ===================================================== */

    function calculateDistance(
        lat1,
        lng1,
        lat2,
        lng2
    ) {

        const earthRadius =
            6371;


        const dLat =
            (
                lat2 -
                lat1
            ) *
            Math.PI /
            180;


        const dLng =
            (
                lng2 -
                lng1
            ) *
            Math.PI /
            180;


        const a =
            Math.sin(
                dLat / 2
            ) *
            Math.sin(
                dLat / 2
            ) +

            Math.cos(
                lat1 *
                Math.PI /
                180
            ) *

            Math.cos(
                lat2 *
                Math.PI /
                180
            ) *

            Math.sin(
                dLng / 2
            ) *
            Math.sin(
                dLng / 2
            );


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return (
            earthRadius *
            c
        );

    }


    /* =====================================================
       RENDER RESULTS
       ===================================================== */

    function renderResults(
        places
    ) {

        if (
            !resultsContainer
        ) {

            return;

        }


        resultsContainer.innerHTML =
            "";


        if (
            places.length ===
            0
        ) {

            resultsContainer.innerHTML =

                `
                <div
                    style="
                        padding:20px;
                        text-align:center;
                        color:#8a9c98;
                        font-size:8px;
                    "
                >
                    No healthcare facilities found.
                </div>
                `;

            return;

        }


        places.forEach(
            function (place) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "healthcare-result-card";


                card.dataset.id =
                    place.id;


                card.innerHTML =

                    `
                    <div
                        class="healthcare-result-top">

                        <span
                            class="healthcare-result-name">

                            ${place.name}

                        </span>

                        <span
                            class="healthcare-result-type">

                            ${place.type}

                        </span>

                    </div>

                    <div
                        class="healthcare-result-address">

                        ${place.address}

                    </div>

                    <div
                        class="healthcare-result-distance"
                        data-distance="${place.id}">

                        Healthcare facility

                    </div>
                    `;


                card.addEventListener(
                    "click",
                    function () {

                        map.setView(
                            [
                                place.lat,
                                place.lng
                            ],
                            16,
                            {
                                animate:
                                    true
                            }
                        );


                        const markerItem =
                            markers.find(
                                function (item) {

                                    return (
                                        item.place.id ===
                                        place.id
                                    );

                                }
                            );


                        if (
                            markerItem
                        ) {

                            markerItem.marker.openPopup();

                        }


                        document
                            .querySelectorAll(
                                ".healthcare-result-card"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        card.classList.add(
                            "active"
                        );

                    }
                );


                resultsContainer.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       INITIAL RESULTS
       ===================================================== */

    renderResults(
        healthcarePlaces
    );


    /* =====================================================
       CATEGORY FILTER
       ===================================================== */

    const filterButtons =
        document.querySelectorAll(
            ".map-filter"
        );


    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const category =
                        button.dataset.category;


                    const filtered =
                        category === "all"

                            ? healthcarePlaces

                            : healthcarePlaces.filter(
                                function (place) {

                                    return (
                                        place.type ===
                                        category
                                    );

                                }
                            );


                    renderResults(
                        filtered
                    );


                    markers.forEach(
                        function (item) {

                            const visible =
                                category ===
                                "all" ||

                                item.place.type ===
                                category;


                            if (
                                visible
                            ) {

                                item.marker.addTo(
                                    map
                                );

                            } else {

                                map.removeLayer(
                                    item.marker
                                );

                            }

                        }
                    );

                }
            );

        }
    );


    /* =====================================================
       SEARCH
       ===================================================== */

    if (
        searchInput
    ) {

        searchInput.addEventListener(
            "input",
            function () {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const filtered =
                    healthcarePlaces.filter(
                        function (place) {

                            return (

                                place.name
                                    .toLowerCase()
                                    .includes(
                                        query
                                    )

                                ||

                                place.type
                                    .toLowerCase()
                                    .includes(
                                        query
                                    )

                                ||

                                place.address
                                    .toLowerCase()
                                    .includes(
                                        query
                                    )

                            );

                        }
                    );


                renderResults(
                    filtered
                );


                markers.forEach(
                    function (item) {

                        const matches =
                            filtered.some(
                                function (place) {

                                    return (
                                        place.id ===
                                        item.place.id
                                    );

                                }
                            );


                        if (
                            matches
                        ) {

                            item.marker.addTo(
                                map
                            );

                        } else {

                            map.removeLayer(
                                item.marker
                            );

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       USER LOCATION
       ===================================================== */

    if (
        locationButton
    ) {

        locationButton.addEventListener(
            "click",
            function () {

                if (
                    !navigator.geolocation
                ) {

                    updateMapStatus(
                        "Location is not supported.",
                        true
                    );

                    return;

                }


                updateMapStatus(
                    "Finding your location...",
                    false
                );


                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        const userLat =
                            position.coords.latitude;


                        const userLng =
                            position.coords.longitude;


                        map.setView(
                            [
                                userLat,
                                userLng
                            ],
                            14,
                            {
                                animate:
                                    true
                            }
                        );


                        const userMarker =
                            L.marker(
                                [
                                    userLat,
                                    userLng
                                ]
                            )
                            .addTo(
                                map
                            );


                        userMarker.bindPopup(
                            "<strong>Your location</strong>"
                        );


                        userMarker.openPopup();


                        updateMapStatus(
                            "Your location found.",
                            false
                        );


                        updateDistances(
                            userLat,
                            userLng
                        );

                    },

                    function (error) {

                        console.warn(
                            "[HealthSphere Map] Location error:",
                            error
                        );


                        updateMapStatus(
                            "Location permission unavailable.",
                            true
                        );

                    },

                    {
                        enableHighAccuracy:
                            false,

                        timeout:
                            10000,

                        maximumAge:
                            300000

                    }

                );

            }
        );

    }


    /* =====================================================
       DISTANCE UPDATE
       ===================================================== */

    function updateDistances(
        userLat,
        userLng
    ) {

        healthcarePlaces.forEach(
            function (place) {

                const distance =
                    calculateDistance(
                        userLat,
                        userLng,
                        place.lat,
                        place.lng
                    );


                const element =
                    document.querySelector(
                        `[data-distance="${place.id}"]`
                    );


                if (
                    element
                ) {

                    element.textContent =
                        distance.toFixed(1) +
                        " km away";

                }

            }
        );

    }


    /* =====================================================
       MAP STATUS
       ===================================================== */

    function updateMapStatus(
        message,
        isError
    ) {

        if (
            statusText
        ) {

            statusText.textContent =
                message;

        }


        if (
            statusDot
        ) {

            statusDot.classList.toggle(
                "error",
                Boolean(isError)
            );

        }

    }


    /* =====================================================
       MAP RESIZE
       ===================================================== */

    window.setTimeout(
        function () {

            map.invalidateSize();

        },
        300
    );


    window.addEventListener(
        "resize",
        function () {

            map.invalidateSize();

        }
    );


    updateMapStatus(
        "Map ready",
        false
    );


    console.log(
        "[HealthSphere Map] Healthcare map initialized."
    );

})();