/* =========================================================
   SOMEONE NEEDS DEBUGGING... 👀
   INTERACTIVE QUESTION ENGINE
   ---------------------------------------------------------
   File: js/questions.js

   Responsibilities:
   - Render Q1 → Q5
   - Handle option selection
   - Handle Q4 tolerance slider
   - Store answers
   - Update question progress
   - Move between questions
   - Start final result calculation

   Depends on:
   - app.js
   - results.js
========================================================= */


/* =========================================================
   1. QUESTION DATABASE
========================================================= */

/*
   score = contribution toward the final
   Pranto-Tolerance Score.

   Higher score = higher tolerance.

   Q4 uses the slider directly, so it doesn't
   need normal options.
*/

const questions = [

    /* =====================================================
       QUESTION 1
    ===================================================== */

    {
        id: 1,

        type: "options",

        question:
            "Pranto agar 10 minute tak continuously bakbak kare toh?",

        options: [

            {
                id: "A",
                text: "A. Sunungi 😂",
                score: 75
            },

            {
                id: "B",
                text: "B. Ignore karungi",
                score: 35
            },

            {
                id: "C",
                text: "C. Bolungi chup ho jao 😭",
                score: 15
            },

            {
                id: "D",
                text: "D. Aur bolo, entertainment mil raha hai 😂",
                score: 100
            }

        ]

    },


    /* =====================================================
       QUESTION 2
    ===================================================== */

    {
        id: 2,

        type: "options",

        question:
            "Pranto ko boring bolne ka main reason kya hai?",

        options: [

            {
                id: "A",
                text: "A. Zyada bolta hai",
                score: 65
            },

            {
                id: "B",
                text: "B. Bakwaas zyada karta hai",
                score: 55
            },

            {
                id: "C",
                text: "C. Bachpan se software update nahi mila 😂",
                score: 85
            },

            {
                id: "D",
                text: "D. Sabhi options",
                score: 45
            }

        ]

    },


    /* =====================================================
       QUESTION 3
    ===================================================== */

    {
        id: 3,

        type: "options",

        question:
            "Pranto ko improve karne ke liye ek update?",

        options: [

            {
                id: "A",
                text: "A. Thoda kam bolo",
                score: 55
            },

            {
                id: "B",
                text: "B. Better jokes download karo",
                score: 70
            },

            {
                id: "C",
                text: "C. Dusron ko bhi bolne do",
                score: 65
            },

            {
                id: "D",
                text: "D. Full system reset 😂",
                score: 20
            }

        ]

    },


    /* =====================================================
       QUESTION 4
    ===================================================== */

    {
        id: 4,

        type: "slider",

        question:
            "Honestly... Pranto ki bakwaas kitne level tak tolerate kar sakti ho?"

    },


    /* =====================================================
       QUESTION 5
    ===================================================== */

    {
        id: 5,

        type: "options",

        question:
            "Final question... Pranto actually boring hai ya bas thoda zyada bolta hai? 👀",

        options: [

            {
                id: "A",
                text: "Actually boring 😂",
                score: 5
            },

            {
                id: "B",
                text: "Bas zyada bolta hai 😭",
                score: 65
            },

            {
                id: "C",
                text: "Depends on the topic",
                score: 75
            },

            {
                id: "D",
                text: "Not really 😌",
                score: 100
            }

        ]

    }

];


/* =========================================================
   2. SLIDER MESSAGES
========================================================= */

/*
   Q4 message changes according to slider value.
*/

const toleranceMessages = [

    {
        min: 0,
        max: 20,
        text:
            "Developer has been blocked by the system 💀"
    },

    {
        min: 21,
        max: 40,
        text:
            "Limited access granted."
    },

    {
        min: 41,
        max: 60,
        text:
            "Okay, manageable."
    },

    {
        min: 61,
        max: 80,
        text:
            "Suspiciously high tolerance 👀"
    },

    {
        min: 81,
        max: 95,
        text:
            "System is impressed 😂"
    },

    {
        min: 96,
        max: 100,
        text:
            "ERROR: Immunity to Pranto detected."
    }

];


/* =========================================================
   3. START QUESTION TEST
========================================================= */

/*
   Called by analysis.js after the personality scan.

       startQuestionTest()
*/

function startQuestionTest() {

    /*
       Reset question state.
    */

    appState.currentQuestion = 0;

    appState.answers = [];

    appState.toleranceValue = 50;


    /*
       Show questions screen.
    */

    showScreen("questions");


    /*
       Render first question.
    */

    renderCurrentQuestion();

}


/* =========================================================
   4. GET CURRENT QUESTION
========================================================= */

function getCurrentQuestion() {

    return questions[
        appState.currentQuestion
    ];

}


/* =========================================================
   5. UPDATE QUESTION PROGRESS
========================================================= */

function updateQuestionProgress() {

    const current =
        appState.currentQuestion + 1;

    const total =
        questions.length;


    const percentage =
        Math.round(
            (current / total) * 100
        );


    /*
       Question number.
    */

    if (DOM.questionNumber) {

        DOM.questionNumber.textContent =
            `Question ${current} / ${total}`;

    }


    /*
       Percentage.
    */

    if (DOM.questionPercent) {

        DOM.questionPercent.textContent =
            `${percentage}%`;

    }

}


/* =========================================================
   6. RENDER CURRENT QUESTION
========================================================= */

function renderCurrentQuestion() {

    if (!DOM.questionContainer) {
        return;
    }


    const question =
        getCurrentQuestion();


    if (!question) {
        return;
    }


    /*
       Update progress.
    */

    updateQuestionProgress();


    /*
       Clear previous question.
    */

    DOM.questionContainer.innerHTML =
        "";


    /*
       Create question text.
    */

    const questionText =
        document.createElement("h3");


    questionText.className =
        "question-text";


    questionText.textContent =
        question.question;


    DOM.questionContainer.appendChild(
        questionText
    );


    /*
       Render according to question type.
    */

    if (question.type === "options") {

        renderOptionsQuestion(
            question
        );

    }


    if (question.type === "slider") {

        renderSliderQuestion(
            question
        );

    }


    /*
       Animate question entrance.
    */

    DOM.questionContainer.classList.remove(
        "question-enter"
    );


    void DOM.questionContainer.offsetWidth;


    DOM.questionContainer.classList.add(
        "question-enter"
    );


    /*
       Update next button.
    */

    updateNextButton();

}


/* =========================================================
   7. RENDER NORMAL OPTIONS
========================================================= */

function renderOptionsQuestion(
    question
) {

    const optionsContainer =
        document.createElement("div");


    optionsContainer.className =
        "question-options";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "question-option";


            button.dataset.optionId =
                option.id;


            button.dataset.score =
                option.score;


            button.textContent =
                option.text;


            /*
               Staggered animation.
            */

            button.classList.add(
                "option-enter"
            );


            button.style.animationDelay =
                `${index * 70}ms`;


            /*
               Check if user already selected
               this answer.
            */

            const previousAnswer =
                getAnswer(
                    appState.currentQuestion
                );


            if (
                previousAnswer &&
                previousAnswer.optionId === option.id
            ) {

                button.classList.add(
                    "selected"
                );

            }


            /*
               Handle selection.
            */

            button.addEventListener(
                "click",
                () => {

                    selectOption(
                        question,
                        option,
                        button
                    );

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );


    DOM.questionContainer.appendChild(
        optionsContainer
    );

}


/* =========================================================
   8. SELECT OPTION
========================================================= */

function selectOption(
    question,
    option,
    button
) {

    /*
       Remove selected state from
       all options.
    */

    const allOptions =
        DOM.questionContainer
            .querySelectorAll(
                ".question-option"
            );


    allOptions.forEach(
        optionButton => {

            optionButton.classList.remove(
                "selected"
            );

        }
    );


    /*
       Highlight selected option.
    */

    button.classList.add(
        "selected"
    );


    /*
       Store answer.

       Example:

       {
           type: "option",
           optionId: "D",
           score: 100
       }
    */

    saveAnswer(
        appState.currentQuestion,
        {
            type: "option",

            optionId:
                option.id,

            score:
                option.score
        }
    );


    /*
       Update Next button.
    */

    updateNextButton();

}


/* =========================================================
   9. RENDER SLIDER QUESTION
========================================================= */

function renderSliderQuestion(
    question
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "slider-wrapper";


    /*
       Slider.
    */

    const slider =
        document.createElement("input");


    slider.type =
        "range";


    slider.min =
        "0";


    slider.max =
        "100";


    slider.value =
        appState.toleranceValue;


    slider.step =
        "1";


    slider.className =
        "tolerance-slider";


    slider.id =
        "tolerance-slider";


    /*
       0% / 100% labels.
    */

    const sliderLabels =
        document.createElement("div");


    sliderLabels.style.display =
        "flex";


    sliderLabels.style.justifyContent =
        "space-between";


    sliderLabels.style.marginTop =
        "8px";


    sliderLabels.style.color =
        "#737b8d";


    sliderLabels.style.fontSize =
        "10px";


    sliderLabels.style.fontFamily =
        '"Courier New", monospace';


    sliderLabels.innerHTML = `
        <span>0%</span>
        <span>100%</span>
    `;


    /*
       Current value.
    */

    const valueDisplay =
        document.createElement("div");


    valueDisplay.className =
        "slider-value";


    valueDisplay.id =
        "slider-value";


    valueDisplay.textContent =
        `${appState.toleranceValue}%`;


    /*
       Dynamic message.
    */

    const messageDisplay =
        document.createElement("div");


    messageDisplay.className =
        "slider-message";


    messageDisplay.id =
        "slider-message";


    messageDisplay.textContent =
        getToleranceMessage(
            appState.toleranceValue
        );


    /*
       Build slider.
    */

    wrapper.appendChild(
        slider
    );

    wrapper.appendChild(
        sliderLabels
    );

    wrapper.appendChild(
        valueDisplay
    );

    wrapper.appendChild(
        messageDisplay
    );


    DOM.questionContainer.appendChild(
        wrapper
    );


    /*
       Save initial slider value.
    */

    saveAnswer(
        appState.currentQuestion,
        {
            type: "slider",

            value:
                appState.toleranceValue,

            score:
                appState.toleranceValue
        }
    );


    /*
       Slider event.
    */

    slider.addEventListener(
        "input",
        handleToleranceSlider
    );


    /*
       Q4 is always answerable because
       it has a default value.
    */

    updateNextButton();

}


/* =========================================================
   10. HANDLE TOLERANCE SLIDER
========================================================= */

function handleToleranceSlider(
    event
) {

    const value =
        Number(
            event.target.value
        );


    /*
       Store globally.
    */

    setToleranceValue(
        value
    );


    /*
       Update value display.
    */

    const valueDisplay =
        document.getElementById(
            "slider-value"
        );


    if (valueDisplay) {

        valueDisplay.textContent =
            `${value}%`;


        /*
           Trigger value animation.
        */

        valueDisplay.classList.remove(
            "value-update"
        );


        void valueDisplay.offsetWidth;


        valueDisplay.classList.add(
            "value-update"
        );

    }


    /*
       Update dynamic message.
    */

    const messageDisplay =
        document.getElementById(
            "slider-message"
        );


    if (messageDisplay) {

        messageDisplay.textContent =
            getToleranceMessage(
                value
            );

    }


    /*
       Save answer.

       Slider value itself becomes
       the score.
    */

    saveAnswer(
        appState.currentQuestion,
        {
            type: "slider",

            value:
                value,

            score:
                value
        }
    );


    /*
       Update next button.
    */

    updateNextButton();

}


/* =========================================================
   11. GET TOLERANCE MESSAGE
========================================================= */

function getToleranceMessage(
    value
) {

    const numericValue =
        Number(value);


    const result =
        toleranceMessages.find(
            item =>
                numericValue >= item.min &&
                numericValue <= item.max
        );


    return result
        ? result.text
        : "System is processing the evidence...";

}


/* =========================================================
   12. CHECK IF QUESTION IS ANSWERED
========================================================= */

function isCurrentQuestionAnswered() {

    const answer =
        getAnswer(
            appState.currentQuestion
        );


    /*
       Q4 slider always has a default answer.
    */

    if (
        appState.currentQuestion === 3
    ) {

        return (
            answer !== undefined &&
            answer !== null
        );

    }


    /*
       Normal questions require
       an option selection.
    */

    return (
        answer !== undefined &&
        answer !== null &&
        answer.optionId
    );

}


/* =========================================================
   13. UPDATE NEXT BUTTON
========================================================= */

function updateNextButton() {

    if (!DOM.nextQuestionBtn) {
        return;
    }


    const answered =
        isCurrentQuestionAnswered();


    /*
       Disable until an answer exists.
    */

    DOM.nextQuestionBtn.disabled =
        !answered;


    /*
       Text changes on last question.
    */

    if (
        appState.currentQuestion ===
        questions.length - 1
    ) {

        DOM.nextQuestionBtn.textContent =
            "CALCULATE RESULT →";

    } else {

        DOM.nextQuestionBtn.textContent =
            "NEXT →";

    }

}


/* =========================================================
   14. NEXT QUESTION
========================================================= */

function goToNextQuestion() {

    /*
       Don't continue without an answer.
    */

    if (
        !isCurrentQuestionAnswered()
    ) {

        showAnswerRequiredFeedback();

        return;

    }


    /*
       If this is the last question,
       finish the test.
    */

    if (
        appState.currentQuestion >=
        questions.length - 1
    ) {

        finishQuestionTest();

        return;

    }


    /*
       Move to next question.
    */

    appState.currentQuestion += 1;


    /*
       Render it.
    */

    renderCurrentQuestion();


    /*
       Scroll question into view.
    */

    setTimeout(() => {

        DOM.questionContainer?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* =========================================================
   15. ANSWER REQUIRED FEEDBACK
========================================================= */

function showAnswerRequiredFeedback() {

    if (!DOM.questionContainer) {
        return;
    }


    /*
       Small glitch effect.
    */

    DOM.questionContainer.classList.remove(
        "glitch"
    );


    void DOM.questionContainer.offsetWidth;


    DOM.questionContainer.classList.add(
        "glitch"
    );


    /*
       Temporarily change button text.
    */

    if (DOM.nextQuestionBtn) {

        const originalText =
            DOM.nextQuestionBtn.textContent;


        DOM.nextQuestionBtn.textContent =
            "SELECT AN ANSWER FIRST 👀";


        setTimeout(() => {

            /*
               Don't overwrite the button if
               the user has already moved on.
            */

            if (
                DOM.nextQuestionBtn &&
                appState.currentScreen ===
                    "questions"
            ) {

                updateNextButton();

            }

        }, 1000);

    }

}


/* =========================================================
   16. FINISH QUESTION TEST
========================================================= */

function finishQuestionTest() {

    /*
       Make sure the final answer is stored.
    */

    const finalAnswer =
        getAnswer(
            questions.length - 1
        );


    if (!finalAnswer) {

        showAnswerRequiredFeedback();

        return;

    }


    /*
       Mark question test complete.
