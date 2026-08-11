/* =========================================================
   SOMEONE NEEDS DEBUGGING... 👀
   PERSONALITY ANALYSIS ENGINE
   ---------------------------------------------------------
   File: js/analysis.js

   Responsibilities:
   - Start personality analysis
   - Animate 0 → 100% progress
   - Change scanner messages
   - Generate believable personality percentages
   - Use user's entered name dynamically
   - Display "Analysis complete"
   - Move to personality result screen

   Depends on:
   - app.js
   - intro.js
========================================================= */


/* =========================================================
   1. ANALYSIS CONFIGURATION
========================================================= */


/*
   Messages shown during the scanner.

   {NAME} will automatically be replaced
   with the user's entered name.
*/

const analysisMessages = [

    "Scanning patience...",

    "Measuring sarcasm...",

    "Analyzing sense of humour...",

    "Checking roast capability...",

    "Calculating tolerance...",

    "Comparing evidence...",

    "Analyzing {NAME}'s bakwaas tolerance..."

];


/*
   How long each analysis stage stays visible.
*/

const ANALYSIS_STAGE_TIME = 900;


/*
   Final stage delay.
*/

const ANALYSIS_COMPLETE_DELAY = 700;


/* =========================================================
   2. PERSONALITY STAT DEFINITIONS
========================================================= */


/*
   These ranges keep the results believable
   and positive.

   The values are randomized within the ranges.

   Example:

   Patience → 78–94
   Sarcasm  → 82–98
*/

const personalityRanges = {

    patience: {
        min: 76,
        max: 94
    },

    sarcasm: {
        min: 82,
        max: 98
    },

    humour: {
        min: 78,
        max: 96
    },

    roasting: {
        min: 84,
        max: 99
    },

    tolerance: {
        min: 75,
        max: 95
    }

};


/* =========================================================
   3. STAT LABELS
========================================================= */

const personalityLabels = {

    patience:
        "Patience",

    sarcasm:
        "Sarcasm",

    humour:
        "Sense of Humour",

    roasting:
        "Roasting Ability",

    tolerance:
        "Bakwaas Tolerance"

};


/* =========================================================
   4. START ANALYSIS
========================================================= */


/*
   This function is called from intro.js:

       startAnalysis();

   It is intentionally global so intro.js
   can access it.
*/

async function startAnalysis() {

    /*
       Prevent analysis from starting twice.
    */

    if (appState.isAnalyzing) {

        return;

    }


    /*
       Make sure target identification
       has happened.
    */

    if (!appState.isIdentified) {

        console.warn(
            "Cannot start analysis before target identification."
        );

        return;

    }


    /*
       Update application state.
    */

    appState.isAnalyzing =
        true;

    appState.analysisComplete =
        false;


    /*
       Show analysis screen.
    */

    showScreen("analysis");


    /*
       Reset progress.
    */

    resetAnalysisUI();


    /*
       Generate personality values
       before displaying the result.
    */

    const stats =
        generatePersonalityStats();


    setPersonalityStats(
        stats
    );


    /*
       Start progress animation.
    */

    await runAnalysisProgress();


    /*
       Analysis complete.
    */

    await showAnalysisComplete();


    /*
       Mark analysis as complete.
    */

    appState.isAnalyzing =
        false;

    appState.analysisComplete =
        true;


    /*
       Move to personality result.
    */

    await delay(500);


    showPersonalityResult();

}


/* =========================================================
   5. RESET ANALYSIS UI
========================================================= */

function resetAnalysisUI() {

    /*
       Reset progress bar.
    */

    if (DOM.analysisProgress) {

        DOM.analysisProgress.style.width =
            "0%";

        DOM.analysisProgress.classList.add(
            "active"
        );

    }


    /*
       Reset percentage.
    */

    if (DOM.progressPercent) {

        DOM.progressPercent.textContent =
            "0%";

    }


    /*
       Reset status.
    */

    if (DOM.analysisStatus) {

        DOM.analysisStatus.textContent =
            "Initializing scanner...";

    }


    /*
       Reset terminal command.
    */

    if (DOM.analysisCommand) {

        DOM.analysisCommand.textContent =
            "initializing...";

    }

}


/* =========================================================
   6. RUN ANALYSIS PROGRESS
========================================================= */

async function runAnalysisProgress() {

    const totalStages =
        analysisMessages.length;


    /*
       Progress starts at 0.
    */

    updateAnalysisProgress(0);


    /*
       Process each analysis message.
    */

    for (
        let stage = 0;
        stage < totalStages;
        stage++
    ) {

        /*
           Replace {NAME} dynamically.
        */

        const message =
            analysisMessages[stage]
                .replace(
                    "{NAME}",
                    getTargetName()
                );


        /*
           Update visible scanner text.
        */

        updateAnalysisMessage(
            message
        );


        /*
           Calculate progress range.

           Example with 7 stages:

           Stage 1 → around 14%
           Stage 2 → around 28%
           ...
           Stage 7 → around 100%
        */

        const targetProgress =
            Math.round(
                ((stage + 1) /
                totalStages) *
                100
            );


        /*
           Smoothly animate from
           current progress to target.
        */

        await animateProgressTo(
            targetProgress,
            ANALYSIS_STAGE_TIME
        );

    }

}


/* =========================================================
   7. UPDATE ANALYSIS MESSAGE
========================================================= */

function updateAnalysisMessage(
    message
) {

    /*
       Main status text.
    */

    if (DOM.analysisStatus) {

        DOM.analysisStatus.textContent =
            message;

        DOM.analysisStatus.classList.remove(
            "glitch"
        );

        void DOM.analysisStatus.offsetWidth;

        DOM.analysisStatus.classList.add(
            "glitch"
        );

    }


    /*
       Terminal command.
    */

    if (DOM.analysisCommand) {

        DOM.analysisCommand.textContent =
            message;

    }

}


/* =========================================================
   8. UPDATE PROGRESS
========================================================= */

function updateAnalysisProgress(
    percentage
) {

    const safePercentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    /*
       Progress bar.
    */

    if (DOM.analysisProgress) {

        DOM.analysisProgress.style.width =
            `${safePercentage}%`;

    }


    /*
       Percentage text.
    */

    if (DOM.progressPercent) {

        DOM.progressPercent.textContent =
            `${Math.round(safePercentage)}%`;

    }

}


/* =========================================================
   9. ANIMATE PROGRESS
========================================================= */


/*
   Smoothly moves the progress bar.

   Example:

       14 → 28

   instead of instantly jumping.
*/

function animateProgressTo(
    target,
    duration
) {

    return new Promise(resolve => {

        /*
           Get current percentage.
        */

        const current =
            parseInt(
                DOM.progressPercent?.textContent
                    ?.replace("%", "")
            ) || 0;


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


            const value =
                current +
                (target - current) *
                eased;


            updateAnalysisProgress(
                value
            );


            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            } else {

                updateAnalysisProgress(
                    target
                );

                resolve();

            }

        }


        requestAnimationFrame(
            update
        );

    });

}


/* =========================================================
   10. GENERATE PERSONALITY STATS
========================================================= */


/*
   Creates randomized but believable
   personality percentages.

   Every new scan can produce slightly
   different results.
*/

function generatePersonalityStats() {

    const stats = {

        patience:
            randomInt(
                personalityRanges.patience.min,
                personalityRanges.patience.max
            ),

        sarcasm:
            randomInt(
                personalityRanges.sarcasm.min,
                personalityRanges.sarcasm.max
            ),

        humour:
            randomInt(
                personalityRanges.humour.min,
                personalityRanges.humour.max
            ),

        roasting:
            randomInt(
                personalityRanges.roasting.min,
                personalityRanges.roasting.max
            ),

        tolerance:
            randomInt(
                personalityRanges.tolerance.min,
                personalityRanges.tolerance.max
            )

    };


    return stats;

}


/* =========================================================
   11. ANALYSIS COMPLETE
========================================================= */

async function showAnalysisComplete() {

    /*
       Remove active shimmer.
    */

    if (DOM.analysisProgress) {

        DOM.analysisProgress.classList.remove(
            "active"
        );

    }


    /*
       Set final 100%.
    */

    updateAnalysisProgress(
        100
    );


    /*
       Change status.
    */

    if (DOM.analysisStatus) {

        DOM.analysisStatus.textContent =
            "Analysis complete.";

        DOM.analysisStatus.classList.remove(
            "glitch"
        );

    }


    /*
       Change terminal command.
    */

    if (DOM.analysisCommand) {

        DOM.analysisCommand.textContent =
            "analysis.complete()";

    }


    /*
       Add success styling.
    */

    if (DOM.analysisCommand) {

        DOM.analysisCommand.classList.add(
            "success"
        );

    }


    await delay(
        ANALYSIS_COMPLETE_DELAY
    );

}


/* =========================================================
   12. SHOW PERSONALITY RESULT
========================================================= */

function showPersonalityResult() {

    /*
       Update result target name.
    */

    if (DOM.resultTargetName) {

        DOM.resultTargetName.textContent =
            getTargetExecutable();

    }


    /*
       Generate stat cards.
    */

    renderPersonalityStats();


    /*
       Update conclusion.
    */

    renderPersonalityConclusion();


    /*
       Show personality screen.
    */

    showScreen(
        "personality"
    );


    /*
       Animate the card.
    */

    const card =
        DOM.personalityScreen
            ?.querySelector(
                ".glass-card"
            );


    if (card) {

        card.classList.remove(
            "card-enter"
        );

        void card.offsetWidth;

        card.classList.add(
            "card-enter"
        );

    }

}


/* =========================================================
   13. RENDER PERSONALITY STATS
========================================================= */

function renderPersonalityStats() {

    if (!DOM.personalityStats) {
        return;
    }


    DOM.personalityStats.innerHTML =
        "";


    const stats =
        appState.personalityStats;


    /*
       Create each statistic.
    */

    Object.keys(
        personalityLabels
    ).forEach(
        (key, index) => {

            const value =
                stats[key] || 0;


            /*
               Main stat container.
            */

            const stat =
                document.createElement(
                    "div"
                );


            stat.className =
                "stat-item stat-enter";


            /*
               Stagger entrance animation.
            */

            stat.style.animationDelay =
                `${index * 100}ms`;


            /*
               Header.
            */

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "stat-header";


            /*
               Label.
            */

            const label =
                document.createElement(
                    "span"
                );


            label.textContent =
                personalityLabels[key];


            /*
               Percentage.
            */

            const percentage =
                document.createElement(
                    "span"
                );


            percentage.className =
                "stat-value";


            percentage.textContent =
                "0%";


            header.appendChild(
                label
            );

            header.appendChild(
                percentage
            );


            /*
               Track.
            */

            const track =
                document.createElement(
                    "div"
                );


            track.className =
                "stat-track";


            /*
               Progress bar.
            */

            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "stat-bar shimmer";


            bar.style.width =
                "0%";


            track.appendChild(
                bar
            );


            /*
               Complete stat.
            */

            stat.appendChild(
                header
            );

            stat.appendChild(
                track
            );


            DOM.personalityStats.appendChild(
                stat
            );


            /*
               Animate percentage.
            */

            setTimeout(() => {

                animateNumber(
                    percentage,
                    0,
                    value,
                    850,
                    "%"
                );


                /*
                   Animate progress bar.
                */

                setTimeout(() => {

                    bar.style.width =
                        `${value}%`;

                }, 100);

            }, 150 + index * 120);

        }
    );

}


/* =========================================================
   14. PERSONALITY CONCLUSION
========================================================= */

function renderPersonalityConclusion() {

    if (!DOM.personalityConclusion) {
        return;
    }


    const stats =
        appState.personalityStats;


    /*
       Calculate average.
    */

    const values = [
        stats.patience,
        stats.sarcasm,
        stats.humour,
        stats.roasting,
        stats.tolerance
    ];


    const average =
        Math.round(
            values.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / values.length
        );


    let conclusion;


    /*
       Different conclusions based on
       generated personality data.
    */

    if (average >= 94) {

        conclusion =
            "System is slightly concerned by these numbers. 😂";

    } else if (average >= 88) {

        conclusion =
            "System has detected dangerously good humour levels. 👀";

    } else if (average >= 82) {

        conclusion =
            "System has detected a surprisingly high tolerance for nonsense. 😂";

    } else {

        conclusion =
            "System has detected acceptable levels of chaos. 😌";

    }


    DOM.personalityConclusion.innerHTML = `

        <strong>
            Conclusion:
        </strong>

        <span>
            ${conclusion}
        </span>

    `;

}


/* =========================================================
function handleStartRealTest() {

    console.log(
        "Starting real test..."
    );


    if (
        typeof startQuestionTest ===
        "function"
    ) {

        startQuestionTest();

    } else {

        console.error(
            "questions.js is NOT loaded or startQuestionTest() is missing."
        );

        alert(
            "System Error: questions.js not loaded."
        );

    }

}

/* =========================================================
   CONTINUE TO REAL TEST
   Robust event listener
========================================================= */

document.addEventListener("click", function (event) {

    const button =
        event.target.closest("#start-real-test-btn");

    if (!button) {
        return;
    }

    console.log(
        "REAL TEST BUTTON CLICKED"
    );

    handleStartRealTest();

});


/* =========================================================
   17. DEBUG HELPER
========================================================= */

/*
   Useful during development.

   In browser console:

       debugAnalysis()

   will show current personality data.
*/

function debugAnalysis() {

    console.table(
        appState.personalityStats
    );

    console.log(
        "Target:",
        getTargetExecutable()
    );

}


/* =========================================================
   END OF ANALYSIS ENGINE
========================================================= */
