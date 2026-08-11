/* =========================================================
   SOMEONE NEEDS DEBUGGING... 👀
   MAIN APPLICATION CONTROLLER
   ---------------------------------------------------------
   File: js/app.js

   Responsibilities:
   - Store global application state
   - Control screen navigation
   - Store target name
   - Store answers
   - Store final score
   - Provide common helper functions
   - Keep different JS modules connected

   Other files:
   intro.js       → boot + name identification
   analysis.js    → personality scanner
   questions.js   → 5 questions
   results.js     → score calculation
   easter-eggs.js → secret interactions
========================================================= */


/* =========================================================
   1. GLOBAL APPLICATION STATE
========================================================= */

/*
   All important temporary data lives here.

   Example:

   If user enters:

       Kajal

   Then:

       appState.targetName
       = "Kajal"

   And later:

       appState.targetExecutable
       = "Kajal.exe"
*/

const appState = {

    /* ---------------------------------------------
       Target information
    --------------------------------------------- */

    targetName: "",

    targetExecutable: "",


    /* ---------------------------------------------
       Application status
    --------------------------------------------- */

    currentScreen: "intro",

    isIdentified: false,

    isAnalyzing: false,

    analysisComplete: false,


    /* ---------------------------------------------
       Question system
    --------------------------------------------- */

    currentQuestion: 0,

    totalQuestions: 5,

    answers: [],


    /* ---------------------------------------------
       Slider answer
    --------------------------------------------- */

    toleranceValue: 50,


    /* ---------------------------------------------
       Result system
    --------------------------------------------- */

    personalityStats: {},

    finalScore: 0,

    finalVerdict: null,


    /* ---------------------------------------------
       Easter eggs
    --------------------------------------------- */

    targetClickCount: 0,

    developerEggFound: false,

    boringnessEggFound: false

};


/* =========================================================
   2. DOM ELEMENT CACHE
========================================================= */

/*
   Frequently used elements are stored here so other
   JavaScript files don't need to repeatedly query
   the DOM.

   This also makes the code easier to maintain.
*/

const DOM = {

    /* ---------------------------------------------
       Main application
    --------------------------------------------- */

    app:
        document.getElementById("app"),


    /* ---------------------------------------------
       Intro
    --------------------------------------------- */

    introScreen:
        document.getElementById("intro-screen"),

    bootTerminal:
        document.getElementById("boot-terminal"),

    targetInputSection:
        document.getElementById("target-input-section"),

    targetNameInput:
        document.getElementById("target-name-input"),

    nameError:
        document.getElementById("name-error"),

    identifyTargetBtn:
        document.getElementById("identify-target-btn"),

    targetScanning:
        document.getElementById("target-scanning"),

    targetScanOutput:
        document.getElementById("target-scan-output"),

    targetFound:
        document.getElementById("target-found"),

    targetName:
        document.getElementById("target-name"),

    startDebuggingBtn:
        document.getElementById("start-debugging-btn"),


    /* ---------------------------------------------
       Warning modal
    --------------------------------------------- */

    warningModal:
        document.getElementById("warning-modal"),

    proceedBtn:
        document.getElementById("proceed-btn"),

    exitBtn:
        document.getElementById("exit-btn"),

    exitMessage:
        document.getElementById("exit-message"),


    /* ---------------------------------------------
       Analysis
    --------------------------------------------- */

    analysisScreen:
        document.getElementById("analysis-screen"),

    analysisStatus:
        document.getElementById("analysis-status"),

    progressPercent:
        document.getElementById("progress-percent"),

    analysisProgress:
        document.getElementById("analysis-progress"),

    analysisTerminal:
        document.getElementById("analysis-terminal"),

    analysisCommand:
        document.getElementById("analysis-command"),


    /* ---------------------------------------------
       Personality result
    --------------------------------------------- */

    personalityScreen:
        document.getElementById("personality-screen"),

    resultTargetName:
        document.getElementById("result-target-name"),

    personalityStats:
        document.getElementById("personality-stats"),

    personalityConclusion:
        document.getElementById("personality-conclusion"),

    startRealTestBtn:
        document.getElementById("start-real-test-btn"),


    /* ---------------------------------------------
       Questions
    --------------------------------------------- */

    questionsScreen:
        document.getElementById("questions-screen"),

    questionNumber:
        document.getElementById("question-number"),

    questionPercent:
        document.getElementById("question-percent"),

    questionContainer:
        document.getElementById("question-container"),

    nextQuestionBtn:
        document.getElementById("next-question-btn"),


    /* ---------------------------------------------
       Final result
    --------------------------------------------- */

    finalResultScreen:
        document.getElementById("final-result-screen"),

    finalScore:
        document.getElementById("final-score"),

    finalScoreBar:
        document.getElementById("final-score-bar"),

    finalConclusion:
        document.getElementById("final-conclusion"),

    finalVerdictBtn:
        document.getElementById("final-verdict-btn"),


    /* ---------------------------------------------
       Verdict modal
    --------------------------------------------- */

    verdictModal:
        document.getElementById("verdict-modal"),

    closeVerdictModal:
        document.getElementById("close-verdict-modal"),

    verdictOptions:
        document.getElementById("verdict-options"),

    verdictResponse:
        document.getElementById("verdict-response"),


    /* ---------------------------------------------
       Developer Easter Egg
    --------------------------------------------- */

    developerModal:
        document.getElementById("developer-modal"),

    developerNote:
        document.getElementById("developer-note"),

    closeDeveloperModal:
        document.getElementById("close-developer-modal"),


    /* ---------------------------------------------
       Bottom terminal Easter Egg
    --------------------------------------------- */

    boringnessTerminal:
        document.getElementById("boringness-terminal"),

    boringnessResult:
        document.getElementById("boringness-result"),


    /* ---------------------------------------------
       Background
    --------------------------------------------- */

    particles:
        document.getElementById("particles"),

    binaryBackground:
        document.getElementById("binary-background")

};


/* =========================================================
   3. SCREEN MAP
========================================================= */

/*
   Central screen registry.

   This prevents us from writing separate show/hide
   logic in every JavaScript file.
*/

const screens = {

    intro:
        DOM.introScreen,

    analysis:
        DOM.analysisScreen,

    personality:
        DOM.personalityScreen,

    questions:
        DOM.questionsScreen,

    finalResult:
        DOM.finalResultScreen,

    verdict:
        document.getElementById("verdict-screen")

};


/* =========================================================
   4. HIDE ALL SCREENS
========================================================= */

function hideAllScreens() {

    Object.values(screens).forEach(screen => {

        if (!screen) return;

        screen.classList.add("hidden");

        screen.classList.remove(
            "screen-enter"
        );

    });

}


/* =========================================================
   5. SHOW SCREEN
========================================================= */

/*
   Usage:

       showScreen("analysis");

   or:

       showScreen("questions");
*/

function showScreen(screenName) {

    const screen =
        screens[screenName];

    if (!screen) {

        console.warn(
            `Screen "${screenName}" does not exist.`
        );

        return;
    }


    hideAllScreens();


    screen.classList.remove("hidden");


    /*
       Force browser reflow so the entrance
       animation can restart every time.
    */

    void screen.offsetWidth;


    screen.classList.add(
        "screen-enter"
    );


    appState.currentScreen =
        screenName;


    /*
       Scroll to top whenever a new screen
       appears.
    */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   6. SHOW MODAL
========================================================= */

function openModal(modal) {

    if (!modal) return;

    modal.classList.remove("hidden");

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   7. CLOSE MODAL
========================================================= */

function closeModal(modal) {

    if (!modal) return;

    modal.classList.add("hidden");

    /*
       Restore normal page scrolling.
    */

    document.body.style.overflow =
        "";

}


/* =========================================================
   8. SET TARGET NAME
========================================================= */

/*
   This is called after the user enters a name.

   Example:

       setTargetName("Kajal");

   Results:

       appState.targetName
       = "Kajal"

       appState.targetExecutable
       = "Kajal.exe"
*/

function setTargetName(name) {

    const cleanName =
        String(name)
            .trim()
            .replace(/\s+/g, " ");


    if (!cleanName) {

        return false;
    }


    appState.targetName =
        cleanName;


    appState.targetExecutable =
        `${cleanName}.exe`;


    appState.isIdentified =
        true;


    /*
       Update every relevant UI element.
    */

    if (DOM.targetName) {

        DOM.targetName.textContent =
            appState.targetExecutable;
    }


    if (DOM.resultTargetName) {

        DOM.resultTargetName.textContent =
            appState.targetExecutable;
    }


    return true;

}


/* =========================================================
   9. GET TARGET NAME
========================================================= */

function getTargetName() {

    return appState.targetName;

}


/* =========================================================
   10. GET TARGET EXECUTABLE
========================================================= */

function getTargetExecutable() {

    return appState.targetExecutable;

}


/* =========================================================
   11. SAVE QUESTION ANSWER
========================================================= */

/*
   Answers are stored like:

       appState.answers[0]
       appState.answers[1]
       appState.answers[2]

   etc.
*/

function saveAnswer(
    questionIndex,
    answer
) {

    appState.answers[
        questionIndex
    ] = answer;

}


/* =========================================================
   12. GET QUESTION ANSWER
========================================================= */

function getAnswer(questionIndex) {

    return appState.answers[
        questionIndex
    ];

}


/* =========================================================
   13. SET SLIDER VALUE
========================================================= */

function setToleranceValue(value) {

    let numericValue =
        Number(value);


    if (Number.isNaN(numericValue)) {

        numericValue = 50;
    }


    numericValue =
        Math.max(
            0,
            Math.min(
                100,
                numericValue
            )
        );


    appState.toleranceValue =
        numericValue;

}


/* =========================================================
   14. SET PERSONALITY STATS
========================================================= */

function setPersonalityStats(stats) {

    appState.personalityStats =
        stats || {};

}


/* =========================================================
   15. SET FINAL SCORE
========================================================= */

function setFinalScore(score) {

    let numericScore =
        Number(score);


    if (Number.isNaN(numericScore)) {

        numericScore = 0;
    }


    numericScore =
        Math.round(
            Math.max(
                0,
                Math.min(
                    100,
                    numericScore
                )
            )
        );


    appState.finalScore =
        numericScore;


    return numericScore;

}


/* =========================================================
   16. SET FINAL VERDICT
========================================================= */

function setFinalVerdict(verdict) {

    appState.finalVerdict =
        verdict;

}


/* =========================================================
   17. RESET APPLICATION
========================================================= */

/*
   Used by:

       RUN DEBUG AGAIN 🔄

   It completely resets temporary user data.
*/

function resetApplication() {

    appState.targetName =
        "";

    appState.targetExecutable =
        "";

    appState.currentScreen =
        "intro";

    appState.isIdentified =
        false;

    appState.isAnalyzing =
        false;

    appState.analysisComplete =
        false;

    appState.currentQuestion =
        0;

    appState.answers =
        [];

    appState.toleranceValue =
        50;

    appState.personalityStats =
        {};

    appState.finalScore =
        0;

    appState.finalVerdict =
        null;

    appState.targetClickCount =
        0;

    appState.developerEggFound =
        false;

    appState.boringnessEggFound =
        false;


    /*
       Reset important input fields.
    */

    if (DOM.targetNameInput) {

        DOM.targetNameInput.value =
            "";
    }


    /*
       Reset progress.
    */

    if (DOM.analysisProgress) {

        DOM.analysisProgress.style.width =
            "0%";
    }


    if (DOM.progressPercent) {

        DOM.progressPercent.textContent =
            "0%";
    }


    /*
       Reset final score.
    */

    if (DOM.finalScore) {

        DOM.finalScore.textContent =
            "0%";
    }


    if (DOM.finalScoreBar) {

        DOM.finalScoreBar.style.width =
            "0%";
    }


    /*
       Close any open modal.
    */

    closeModal(DOM.warningModal);

    closeModal(DOM.verdictModal);

    closeModal(DOM.developerModal);


    /*
       Clear generated content.
    */

    if (DOM.personalityStats) {

        DOM.personalityStats.innerHTML =
            "";
    }


    if (DOM.questionContainer) {

        DOM.questionContainer.innerHTML =
            "";
    }


    if (DOM.verdictResponse) {

        DOM.verdictResponse.innerHTML =
            "";

        DOM.verdictResponse.classList.add(
            "hidden"
        );

    }


    /*
       Restore intro state.
    */

    if (DOM.targetInputSection) {

        DOM.targetInputSection.classList.remove(
            "hidden"
        );
    }


    if (DOM.targetScanning) {

        DOM.targetScanning.classList.add(
            "hidden"
        );
    }


    if (DOM.targetFound) {

        DOM.targetFound.classList.add(
            "hidden"
        );
    }


    if (DOM.startDebuggingBtn) {

        DOM.startDebuggingBtn.classList.add(
            "hidden"
        );
    }


    if (DOM.exitMessage) {

        DOM.exitMessage.classList.add(
            "hidden"
        );
    }


    /*
       Show intro screen.
    */

    showScreen("intro");

}


/* =========================================================
   18. SAFE HTML ESCAPE
========================================================= */

/*
   User input should never be inserted into HTML
   without escaping.

   This helper lets us safely display names later.
*/

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;

}


/* =========================================================
   19. RANDOM NUMBER HELPER
========================================================= */

/*
   Returns an integer between min and max.

   Example:

       randomInt(80, 95)

   could return:

       87
*/

function randomInt(min, max) {

    min = Math.ceil(min);

    max = Math.floor(max);


    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


/* =========================================================
   20. DELAY HELPER
========================================================= */

/*
   Useful for terminal sequences.

   Example:

       await delay(1000);
*/

function delay(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================================
   21. TYPEWRITER HELPER
========================================================= */

/*
   Types text character by character.

   Used later for:
   - Boot messages
   - Target scanning
   - Developer confession
*/

async function typeText(
    element,
    text,
    speed = 25
) {

    if (!element) return;


    element.textContent =
        "";


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        element.textContent +=
            text[i];


        await delay(speed);

    }

}


/* =========================================================
   22. NUMBER ANIMATION HELPER
========================================================= */

/*
   Animates a number:

       0 → 87

   Used for:
   - Personality percentages
   - Final score
*/

function animateNumber(
    element,
    start,
    end,
    duration = 1000,
    suffix = ""
) {

    if (!element) return;


    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
           Ease-out curve.
        */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.round(
                start +
                (end - start) *
                eased
            );


        element.textContent =
            `${currentValue}${suffix}`;


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


/* =========================================================
   23. INITIALIZE APPLICATION
========================================================= */

/*
   This runs once after the HTML is loaded.

   Individual modules will attach their own
   event listeners.
*/

function initializeApp() {

    console.log(
        "%c Someone Needs Debugging... 👀 ",
        "color:#8ba7ff;font-weight:bold;"
    );

    console.log(
        "Application initialized."
    );


    /*
       Intro is the first screen.
    */

    showScreen("intro");

}


/* =========================================================
   24. GLOBAL KEYBOARD SUPPORT
========================================================= */

/*
   Enter inside the name input will later behave
   exactly like clicking IDENTIFY TARGET.
*/

if (DOM.targetNameInput) {

    DOM.targetNameInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                DOM.identifyTargetBtn
            ) {

                DOM.identifyTargetBtn.click();

            }

        }
    );

}


/* =========================================================
   25. ESCAPE KEY → CLOSE MODALS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        if (
            DOM.warningModal &&
            !DOM.warningModal.classList.contains(
                "hidden"
            )
        ) {

            closeModal(
                DOM.warningModal
            );

        }


        if (
            DOM.verdictModal &&
            !DOM.verdictModal.classList.contains(
                "hidden"
            )
        ) {

            closeModal(
                DOM.verdictModal
            );

        }


        if (
            DOM.developerModal &&
            !DOM.developerModal.classList.contains(
                "hidden"
            )
        ) {

            closeModal(
                DOM.developerModal
            );

        }

    }
);


/* =========================================================
   26. INITIALIZE WHEN DOM IS READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}


/* =========================================================
   END OF APP CONTROLLER
========================================================= */
