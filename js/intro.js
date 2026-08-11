/* =========================================================
   SOMEONE NEEDS DEBUGGING... 👀
   INTRO / TARGET IDENTIFICATION SYSTEM
   ---------------------------------------------------------
   File: js/intro.js

   Responsibilities:
   - Run system boot sequence
   - Display terminal messages
   - Ask user for their name
   - Validate name
   - Identify target
   - Create [Name].exe dynamically
   - Run target scanning animation
   - Show TARGET FOUND
   - Open warning modal
========================================================= */


/* =========================================================
   1. BOOT CONFIGURATION
========================================================= */

const bootMessages = [

    "Initializing personality scanner...",

    "Loading behavioral database...",

    "Checking patience level...",

    "Scanning sarcasm...",

    "Detecting bakwaas tolerance...",

    "Searching for suspicious behavior..."

];


/*
   Delay between terminal messages.
*/

const BOOT_MESSAGE_DELAY = 500;


/* =========================================================
   2. TARGET SCANNING MESSAGES
========================================================= */

const targetScanMessages = [

    "> receiving input...",

    "> analyzing target...",

    "> checking identity pattern...",

    "> matching behavioral database...",

    "> verifying human status...",

    "> suspicious behavior detected...",

    "> identity confirmed."

];


/*
   Delay between target scanning messages.
*/

const TARGET_SCAN_DELAY = 480;


/* =========================================================
   3. START BOOT SEQUENCE
========================================================= */

async function startBootSequence() {

    if (!DOM.bootTerminal) {
        return;
    }


    /*
       Prevent boot sequence from running twice.
    */

    if (
        DOM.bootTerminal.dataset.booted === "true"
    ) {

        return;

    }


    DOM.bootTerminal.dataset.booted =
        "true";


    /*
       Clear terminal first.
    */

    DOM.bootTerminal.innerHTML =
        "";


    /* ---------------------------------------------
       Initial command
    --------------------------------------------- */

    await addBootLine(
        "developer@cse:~$ system.boot()",
        "prompt",
        35
    );


    await delay(350);


    /* ---------------------------------------------
       Boot messages
    --------------------------------------------- */

    for (
        const message of bootMessages
    ) {

        await addBootLine(
            message,
            "terminal-line",
            18
        );

        await delay(
            BOOT_MESSAGE_DELAY
        );

    }


    /* ---------------------------------------------
       Boot complete
    --------------------------------------------- */

    await delay(300);


    await addBootLine(
        "System ready.",
        "success",
        20
    );


    await delay(300);


    /*
       Reveal target identification section.
    */

    revealTargetInput();

}


/* =========================================================
   4. ADD TERMINAL LINE
========================================================= */

async function addBootLine(
    text,
    className = "terminal-line",
    speed = 18
) {

    if (!DOM.bootTerminal) {
        return;
    }


    const line =
        document.createElement("div");


    line.className =
        `terminal-line boot-line ${className}`;


    DOM.bootTerminal.appendChild(
        line
    );


    /*
       Type the message character by character.
    */

    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        line.textContent +=
            text[i];


        await delay(speed);

    }


    /*
       Keep newest message visible.
    */

    DOM.bootTerminal.scrollTop =
        DOM.bootTerminal.scrollHeight;

}


/* =========================================================
   5. REVEAL NAME INPUT
========================================================= */

function revealTargetInput() {

    if (!DOM.targetInputSection) {
        return;
    }


    DOM.targetInputSection.classList.remove(
        "hidden"
    );


    /*
       Small entrance animation.
    */

    DOM.targetInputSection.classList.add(
        "screen-enter"
    );


    /*
       Automatically focus the input.
    */

    setTimeout(() => {

        if (DOM.targetNameInput) {

            DOM.targetNameInput.focus();

        }

    }, 350);

}


/* =========================================================
   6. NAME VALIDATION
========================================================= */

function validateTargetName(name) {

    /*
       Remove extra spaces.
    */

    const cleanName =
        String(name)
            .trim()
            .replace(/\s+/g, " ");


    /*
       Empty name is invalid.
    */

    if (!cleanName) {

        return {
            valid: false,
            message: "Please enter your name."
        };

    }


    /*
       Minimum length.
    */

    if (cleanName.length < 2) {

        return {
            valid: false,
            message: "Name is too short."
        };

    }


    /*
       Maximum length.
    */

    if (cleanName.length > 25) {

        return {
            valid: false,
            message: "Name is too long."
        };

    }


    /*
       Allow normal names with:
       - English letters
       - Numbers
       - Spaces
       - Dot
       - Hyphen
       - Apostrophe
    */

    const validNamePattern =
        /^[a-zA-Z0-9 .'-]+$/;


    if (
        !validNamePattern.test(
            cleanName
        )
    ) {

        return {
            valid: false,
            message:
                "Please use normal characters only."
        };

    }


    return {
        valid: true,
        name: cleanName
    };

}


/* =========================================================
   7. SHOW NAME ERROR
========================================================= */

function showNameError(message) {

    if (!DOM.nameError) {
        return;
    }


    DOM.nameError.textContent =
        message;


    DOM.nameError.classList.remove(
        "hidden"
    );


    /*
       Shake the input wrapper.
    */

    const inputWrapper =
        DOM.targetNameInput
            ?.closest(
                ".name-input-wrapper"
            );


    if (inputWrapper) {

        inputWrapper.classList.remove(
            "glitch"
        );


        void inputWrapper.offsetWidth;


        inputWrapper.classList.add(
            "glitch"
        );

    }

}


/* =========================================================
   8. HIDE NAME ERROR
========================================================= */

function hideNameError() {

    if (!DOM.nameError) {
        return;
    }


    DOM.nameError.classList.add(
        "hidden"
    );

}


/* =========================================================
   9. IDENTIFY TARGET
========================================================= */

async function identifyTarget() {

    if (!DOM.targetNameInput) {
        return;
    }


    const validation =
        validateTargetName(
            DOM.targetNameInput.value
        );


    /*
       Invalid name.
    */

    if (!validation.valid) {

        showNameError(
            validation.message
        );

        return;

    }


    hideNameError();


    /*
       Save target name globally.

       Example:

       Kajal

       becomes:

       Kajal.exe
    */

    const success =
        setTargetName(
            validation.name
        );


    if (!success) {
        return;
    }


    /*
       Disable button while scanning.
    */

    if (DOM.identifyTargetBtn) {

        DOM.identifyTargetBtn.disabled =
            true;

        DOM.identifyTargetBtn.textContent =
            "IDENTIFYING...";

    }


    /*
       Hide input section.
    */

    if (DOM.targetInputSection) {

        DOM.targetInputSection.classList.add(
            "hidden"
        );

    }


    /*
       Show scanning section.
    */

    if (DOM.targetScanning) {

        DOM.targetScanning.classList.remove(
            "hidden"
        );

        DOM.targetScanning.classList.add(
            "active"
        );

    }


    /*
       Run scanning animation.
    */

    await runTargetScan();


    /*
       Show target found.
    */

    revealTargetFound();

}


/* =========================================================
   10. TARGET SCANNING
========================================================= */

async function runTargetScan() {

    if (!DOM.targetScanOutput) {
        return;
    }


    DOM.targetScanOutput.innerHTML =
        "";


    for (
        const message of targetScanMessages
    ) {

        const line =
            document.createElement("div");


        line.className =
            "scanning-line";


        DOM.targetScanOutput.appendChild(
            line
        );


        /*
           Type scan message.
        */

        for (
            let i = 0;
            i < message.length;
            i++
        ) {

            line.textContent +=
                message[i];


            await delay(15);

        }


        await delay(
            TARGET_SCAN_DELAY
        );

    }


    /*
       Add the actual target name
       to the scanning output.
    */

    const targetLine =
        document.createElement("div");


    targetLine.className =
        "success scanning-line";


    targetLine.textContent =
        `> target identified: ${getTargetExecutable()}`;


    DOM.targetScanOutput.appendChild(
        targetLine
    );


    await delay(500);

}


/* =========================================================
   11. REVEAL TARGET FOUND
========================================================= */

function revealTargetFound() {

    /*
       Hide scanning section.
    */

    if (DOM.targetScanning) {

        DOM.targetScanning.classList.add(
            "hidden"
        );

        DOM.targetScanning.classList.remove(
            "active"
        );

    }


    /*
       Update executable name.
    */

    if (DOM.targetName) {

        DOM.targetName.textContent =
            getTargetExecutable();

    }


    /*
       Show target card.
    */

    if (DOM.targetFound) {

        DOM.targetFound.classList.remove(
            "hidden"
        );


        /*
           Trigger detection animation.
        */

        DOM.targetFound.classList.remove(
            "target-detected"
        );


        void DOM.targetFound.offsetWidth;


        DOM.targetFound.classList.add(
            "target-detected"
        );

    }


    /*
       Show Start Debugging button
       after target detection.
    */

    setTimeout(() => {

        if (DOM.startDebuggingBtn) {

            DOM.startDebuggingBtn.classList.remove(
                "hidden"
            );

            DOM.startDebuggingBtn.classList.add(
                "screen-enter"
            );

        }

    }, 500);

}


/* =========================================================
   12. START DEBUGGING BUTTON
========================================================= */

function handleStartDebugging() {

    /*
       User has already been identified.
    */

    if (!appState.isIdentified) {

        return;

    }


    /*
       Open warning modal.
    */

    openModal(
        DOM.warningModal
    );


    /*
       Reset exit message.
    */

    if (DOM.exitMessage) {

        DOM.exitMessage.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   13. PROCEED BUTTON
========================================================= */

function handleProceed() {

    /*
       Close warning modal.
    */

    closeModal(
        DOM.warningModal
    );


    /*
       Analysis module will take over.

       Small delay gives the modal close
       animation time to complete.
    */

    setTimeout(() => {

        if (
            typeof startAnalysis ===
            "function"
        ) {

            startAnalysis();

        } else {

            /*
               Temporary fallback if analysis.js
               has not been created yet.
            */

            console.warn(
                "analysis.js is not loaded yet."
            );

        }

    }, 250);

}


/* =========================================================
   14. EXIT BUTTON
========================================================= */

function handleExit() {

    if (!DOM.exitMessage) {
        return;
    }


    /*
       Show funny response.
    */

    DOM.exitMessage.classList.remove(
        "hidden"
    );


    /*
       Add glitch effect.
    */

    DOM.exitMessage.classList.remove(
        "glitch"
    );


    void DOM.exitMessage.offsetWidth;


    DOM.exitMessage.classList.add(
        "glitch"
    );


    /*
       After a short delay:

       - Close modal
       - Bring Start button back
    */

    setTimeout(() => {

        closeModal(
            DOM.warningModal
        );


        /*
           Start button remains available.
        */

        if (DOM.startDebuggingBtn) {

            DOM.startDebuggingBtn.classList.remove(
                "hidden"
            );

        }

    }, 1600);

}


/* =========================================================
   15. INPUT LIVE VALIDATION
========================================================= */

function handleNameInput() {

    /*
       As soon as the user starts typing,
       remove the previous error.
    */

    if (
        DOM.nameError &&
        DOM.targetNameInput.value.trim()
    ) {

        hideNameError();

    }

}


/* =========================================================
   16. EVENT LISTENERS
========================================================= */


/* ---------------------------------------------
   Identify target
--------------------------------------------- */

if (DOM.identifyTargetBtn) {

    DOM.identifyTargetBtn.addEventListener(
        "click",
        identifyTarget
    );

}


/* ---------------------------------------------
   Name input
--------------------------------------------- */

if (DOM.targetNameInput) {

    DOM.targetNameInput.addEventListener(
        "input",
        handleNameInput
    );

}


/* ---------------------------------------------
   Start debugging
--------------------------------------------- */

if (DOM.startDebuggingBtn) {

    DOM.startDebuggingBtn.addEventListener(
        "click",
        handleStartDebugging
    );

}


/* ---------------------------------------------
   Proceed
--------------------------------------------- */

if (DOM.proceedBtn) {

    DOM.proceedBtn.addEventListener(
        "click",
        handleProceed
    );

}


/* ---------------------------------------------
   Exit
--------------------------------------------- */

if (DOM.exitBtn) {

    DOM.exitBtn.addEventListener(
        "click",
        handleExit
    );

}


/* =========================================================
   17. ENTER KEY SUPPORT
========================================================= */

if (DOM.targetNameInput) {

    DOM.targetNameInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();


                if (
                    DOM.identifyTargetBtn &&
                    !DOM.identifyTargetBtn.disabled
                ) {

                    identifyTarget();

                }

            }

        }
    );

}


/* =========================================================
   18. START INTRO AFTER PAGE LOAD
========================================================= */

function initializeIntro() {

    /*
       Make sure intro screen is visible.
    */

    showScreen("intro");


    /*
       Start terminal boot sequence.
    */

    startBootSequence();

}


/*
   DOM may already be loaded because app.js
   was loaded before this file.
*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeIntro
    );

} else {

    initializeIntro();

}


/* =========================================================
   END OF INTRO SYSTEM
========================================================= */
