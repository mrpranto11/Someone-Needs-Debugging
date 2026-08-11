/* =========================================================
   SOMEONE NEEDS DEBUGGING... 👀
   FINAL RESULT ENGINE
   ---------------------------------------------------------
   File: js/results.js

   Responsibilities:
   - Calculate final Pranto-Tolerance Score
   - Use answers from Q1 → Q5
   - Generate different conclusions
   - Animate final score
   - Animate final score bar
   - Trigger confetti for high scores
   - Open Final Verdict modal
   - Handle final verdict responses

   Depends on:
   - app.js
   - questions.js
========================================================= */


/* =========================================================
   1. SCORE WEIGHTS
========================================================= */

/*
   Every question contributes differently.

   Total weight = 100%

   Q1 = 20%
   Q2 = 15%
   Q3 = 15%
   Q4 = 25%
   Q5 = 25%
*/

const scoreWeights = {

    question1: 0.20,

    question2: 0.15,

    question3: 0.15,

    question4: 0.25,

    question5: 0.25

};


/* =========================================================
   2. FINAL SCORE CONCLUSIONS
========================================================= */

const scoreConclusions = [

    {
        min: 0,
        max: 30,

        title:
            "System recommendation:",

        text:
            "Reduce Pranto interaction to safe levels. 😂"
    },

    {
        min: 31,
        max: 50,

        title:
            "Diagnosis:",

        text:
            "Manageable amount of bakwaas detected."
    },

    {
        min: 51,
        max: 70,

        title:
            "Interesting...",

        text:
            "You don't seem completely annoyed by him. 👀"
    },

    {
        min: 71,
        max: 85,

        title:
            "WARNING:",

        text:
            "You tolerate Pranto more than expected. 😂"
    },

    {
        min: 86,
        max: 95,

        title:
            "Critical finding:",

        text:
            "High compatibility with Pranto's bakwaas detected."
    },

    {
        min: 96,
        max: 100,

        title:
            "SYSTEM ERROR 🚨",

        text:
            "You may have developed immunity to Pranto."
    }

];


/* =========================================================
   3. CALCULATE FINAL RESULT
========================================================= */

/*
   Called automatically after Q5.

       calculateFinalResult()

   The function reads:

       appState.answers

   and combines all five answers.
*/

function calculateFinalResult() {

    /*
       Make sure all questions have answers.
    */

    if (
        !appState.answers ||
        appState.answers.length < 5
    ) {

        console.warn(
            "Not all questions have been answered."
        );

        return;

    }


    /*
       Extract answers.
    */

    const q1 =
        appState.answers[0];

    const q2 =
        appState.answers[1];

    const q3 =
        appState.answers[2];

    const q4 =
        appState.answers[3];

    const q5 =
        appState.answers[4];


    /*
       Extract individual scores.
    */

    const score1 =
        getAnswerScore(q1);

    const score2 =
        getAnswerScore(q2);

    const score3 =
        getAnswerScore(q3);

    const score4 =
        getAnswerScore(q4);

    const score5 =
        getAnswerScore(q5);


    /*
       Weighted calculation.

       Example:

       Q1 = 80 × 20%
       Q2 = 60 × 15%
       etc.
    */

    const weightedScore =

        (score1 * scoreWeights.question1) +

        (score2 * scoreWeights.question2) +

        (score3 * scoreWeights.question3) +

        (score4 * scoreWeights.question4) +

        (score5 * scoreWeights.question5);


    /*
       Round to whole number.
    */

    const finalScore =
        Math.round(
            weightedScore
        );


    /*
       Store globally.
    */

    setFinalScore(
        finalScore
    );


    /*
       Show final result.
    */

    renderFinalResult(
        finalScore
    );

}


/* =========================================================
   4. GET ANSWER SCORE
========================================================= */

/*
   Handles both:

       option answers

   and:

       slider answers
*/

function getAnswerScore(
    answer
) {

    if (!answer) {

        return 0;

    }


    /*
       Option question.
    */

    if (
        answer.type ===
        "option"
    ) {

        return Number(
            answer.score
        ) || 0;

    }


    /*
       Slider question.
    */

    if (
        answer.type ===
        "slider"
    ) {

        return Number(
            answer.value
        ) || 0;

    }


    return 0;

}


/* =========================================================
   5. GET SCORE CONCLUSION
========================================================= */

function getScoreConclusion(
    score
) {

    const result =
        scoreConclusions.find(
            item =>
                score >= item.min &&
                score <= item.max
        );


    return result || {

        title:
            "System status:",

        text:
            "Analysis completed successfully."

    };

}


/* =========================================================
   6. RENDER FINAL RESULT
========================================================= */

function renderFinalResult(
    score
) {

    /*
       Get conclusion.
    */

    const conclusion =
        getScoreConclusion(
            score
        );


    /*
       Show final result screen.
    */

    showScreen(
        "finalResult"
    );


    /*
       Reset score UI.
    */

    resetFinalResultUI();


    /*
       Set conclusion text.
    */

    if (DOM.finalConclusion) {

        DOM.finalConclusion.innerHTML = `

            <strong>
                ${escapeHTML(
                    conclusion.title
                )}
            </strong>

            <span>
                ${escapeHTML(
                    conclusion.text
                )}
            </span>

        `;

    }


    /*
       Animate score.

       0 → final score
    */

    setTimeout(() => {

        animateFinalScore(
            score
        );

    }, 250);


    /*
       Animate score bar.
    */

    setTimeout(() => {

        if (DOM.finalScoreBar) {

            DOM.finalScoreBar.style.width =
                `${score}%`;

        }

    }, 300);


    /*
       High score effect.
    */

    if (score >= 86) {

        setTimeout(() => {

            triggerConfetti();

        }, 900);

    }


    /*
       Add special card effect.
    */

    if (score >= 86) {

        const card =
            DOM.finalResultScreen
                ?.querySelector(
                    ".final-card"
                );


        if (card) {

            card.classList.add(
                "high-score"
            );

        }

    }

}


/* =========================================================
   7. RESET FINAL RESULT UI
========================================================= */

function resetFinalResultUI() {

    if (DOM.finalScore) {

        DOM.finalScore.textContent =
            "0%";

        DOM.finalScore.classList.remove(
            "score-complete"
        );

        DOM.finalScore.classList.add(
            "score-counting"
        );

    }


    if (DOM.finalScoreBar) {

        DOM.finalScoreBar.style.width =
            "0%";

    }


    /*
       Remove previous high-score effect.
    */

    const card =
        DOM.finalResultScreen
            ?.querySelector(
                ".final-card"
            );


    if (card) {

        card.classList.remove(
            "high-score"
        );

    }

}


/* =========================================================
   8. ANIMATE FINAL SCORE
========================================================= */

function animateFinalScore(
    score
) {

    if (!DOM.finalScore) {
        return;
    }


    /*
       Use existing helper from app.js.
    */

    animateNumber(
        DOM.finalScore,
        0,
        score,
        1600,
        "%"
    );


    /*
       Complete animation after
       counting finishes.
    */

    setTimeout(() => {

        DOM.finalScore.classList.remove(
            "score-counting"
        );


        DOM.finalScore.classList.add(
            "score-complete"
        );

    }, 1650);

}


/* =========================================================
   9. CONFETTI
========================================================= */

/*
   Creates lightweight CSS-based confetti.

   No external library required.
*/

function triggerConfetti() {

    const numberOfPieces =
        45;


    for (
        let i = 0;
        i < numberOfPieces;
        i++
    ) {

        createConfettiPiece(
            i
        );

    }

}


/* =========================================================
   10. CREATE CONFETTI PIECE
========================================================= */

function createConfettiPiece(
    index
) {

    const piece =
        document.createElement(
            "div"
        );


    piece.className =
        "confetti";


    /*
       Random horizontal position.
    */

    piece.style.left =
        `${Math.random() * 100}%`;


    /*
       Random animation duration.
    */

    const duration =
        2.2 +
        Math.random() * 2.3;


    piece.style.animationDuration =
        `${duration}s`;


    /*
       Random delay.
    */

    piece.style.animationDelay =
        `${Math.random() * 0.7}s`;


    /*
       Slightly different sizes.
    */

    const width =
        4 +
        Math.random() * 5;

    const height =
        7 +
        Math.random() * 8;


    piece.style.width =
        `${width}px`;

    piece.style.height =
        `${height}px`;


    /*
       Rotate starting angle.
    */

    piece.style.transform =
        `rotate(${Math.random() * 360}deg)`;


    /*
       Keep the pieces visually varied
       without needing external CSS colors.
    */

    const confettiColors = [

        "#7da2ff",

        "#9b7cff",

        "#69e6a4",

        "#f5c76b",

        "#ff7b9c",

        "#d7dcef"

    ];


    piece.style.background =
        confettiColors[
            index %
            confettiColors.length
        ];


    document.body.appendChild(
        piece
    );


    /*
       Remove after animation.
    */

    setTimeout(() => {

        piece.remove();

    }, (duration + 1) * 1000);

}


/* =========================================================
   11. FINAL VERDICT DATA
========================================================= */

/*
   These are NOT romantic responses.

   They keep the tone playful and teasing.
*/

const verdictResponses = {

    boring: {

        text:
            "Fair enough. Developer will now consider a software update. 😂",

        scoreEffect:
            -5

    },


    pakao: {

        text:
            "Accurate diagnosis. No objections. 😭😂",

        scoreEffect:
            0

    },


    sometimes: {

        text:
            "Acceptable result. Developer has survived the test. 😌",

        scoreEffect:
            3

    },


    interesting: {

        text:
            "Unexpected result detected. Developer is suspicious. 👀😂",

        scoreEffect:
            5

    }

};


/* =========================================================
   12. OPEN FINAL VERDICT
========================================================= */

function openFinalVerdict() {

    /*
       Make sure modal exists.
    */

    if (!DOM.verdictModal) {

        console.warn(
            "Verdict modal not found."
        );

        return;

    }


    /*
       Reset previous response.
    */

    if (DOM.verdictResponse) {

        DOM.verdictResponse.innerHTML =
            "";

        DOM.verdictResponse.classList.add(
            "hidden"
        );

    }


    /*
       Remove previous selection.
    */

    if (DOM.verdictOptions) {

        DOM.verdictOptions
            .querySelectorAll(
                ".verdict-option"
            )
            .forEach(
                button => {

                    button.classList.remove(
                        "verdict-selected"
                    );

                }
            );

    }


    /*
       Open modal.
    */

    openModal(
        DOM.verdictModal
    );

}


/* =========================================================
   13. HANDLE VERDICT SELECTION
========================================================= */

function handleVerdictSelection(
    verdictKey,
    button
) {

    const verdict =
        verdictResponses[
            verdictKey
        ];


    if (!verdict) {
        return;
    }


    /*
       Save selected verdict.
    */

    setFinalVerdict(
        verdictKey
    );


    /*
       Remove previous selection.
    */

    if (DOM.verdictOptions) {

        DOM.verdictOptions
            .querySelectorAll(
                ".verdict-option"
            )
            .forEach(
                option => {

                    option.classList.remove(
                        "verdict-selected"
                    );

                }
            );

    }


    /*
       Highlight selected button.
    */

    button.classList.add(
        "verdict-selected"
    );


    /*
       Display response.
    */

    showVerdictResponse(
        verdict.text
    );


    /*
       Keep the actual final score intact.

       The verdict is a separate fun interaction
       and does not secretly change the score.
    */

}


/* =========================================================
   14. SHOW VERDICT RESPONSE
========================================================= */

function showVerdictResponse(
    text
) {

    if (!DOM.verdictResponse) {
        return;
    }


    DOM.verdictResponse.innerHTML = `

        <div class="verdict-response-text">
            ${escapeHTML(text)}
        </div>

    `;


    DOM.verdictResponse.classList.remove(
        "hidden"
    );


    DOM.verdictResponse.classList.remove(
        "show"
    );


    void DOM.verdictResponse.offsetWidth;


    DOM.verdictResponse.classList.add(
        "show"
    );

}


/* =========================================================
   15. CLOSE VERDICT
========================================================= */

function closeFinalVerdict() {

    closeModal(
        DOM.verdictModal
    );

}


/* =========================================================
   16. FINAL VERDICT BUTTON
========================================================= */

if (DOM.finalVerdictBtn) {

    DOM.finalVerdictBtn.addEventListener(
        "click",
        openFinalVerdict
    );

}


/* =========================================================
   17. VERDICT OPTION EVENTS
========================================================= */

if (DOM.verdictOptions) {

    DOM.verdictOptions
        .querySelectorAll(
            ".verdict-option"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const verdictKey =
                            button.dataset.verdict;


                        handleVerdictSelection(
                            verdictKey,
                            button
                        );

                    }
                );

            }
        );

}


/* =========================================================
   18. CLOSE VERDICT MODAL
========================================================= */

if (DOM.closeVerdictModal) {

    DOM.closeVerdictModal.addEventListener(
        "click",
        closeFinalVerdict
    );

}


/* =========================================================
   19. CLICK OUTSIDE VERDICT MODAL
========================================================= */

if (DOM.verdictModal) {

    DOM.verdictModal.addEventListener(
        "click",
        event => {

            /*
               Only close if the actual overlay
               itself was clicked.
            */

            if (
                event.target ===
                DOM.verdictModal
            ) {

                closeFinalVerdict();

            }

        }
    );

}


/* =========================================================
   20. DEBUG FINAL SCORE
========================================================= */

/*
   Browser console:

       debugFinalResult()

   shows all scores and calculation.
*/

function debugFinalResult() {

    const answers =
        appState.answers;


    const scores =
        answers.map(
            answer =>
                getAnswerScore(answer)
        );


    console.table({

        Q1:
            scores[0],

        Q2:
            scores[1],

        Q3:
            scores[2],

        Q4:
            scores[3],

        Q5:
            scores[4],

        FINAL:
            appState.finalScore

    });


    console.log(
        "Final Score:",
        appState.finalScore + "%"
    );

}


/* =========================================================
   END OF FINAL RESULT ENGINE
========================================================= */
