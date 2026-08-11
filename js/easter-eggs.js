/* =========================================================
   SOMEONE NEEDS DEBUGGING... 👀
   SECRET EASTER EGGS
   ---------------------------------------------------------
   File: js/easter-eggs.js

   Easter Egg #1
   --------------
   Target name / [Name].exe ko 5 baar click karne par
   developer confession reveal hoga.

   Easter Egg #2
   --------------
   Bottom terminal:

       developer@cse:~$ ./debug_boringness.exe

   click karne par funny result show hoga.

   Depends on:
   - app.js
   - animations.css
========================================================= */


/* =========================================================
   1. DEVELOPER CONFESSION
========================================================= */

const developerConfession = [

    "Developer confession:",

    "",

    "Okay fine...",

    "",

    "I know I talk too much sometimes. 😂",

    "",

    "But at least I turned my bakwaas",

    "into a website.",

    "",

    "— A Computer Engineering student"

];


/*
   Typing speed for confession.
*/

const CONFESSION_SPEED = 38;


/* =========================================================
   2. TARGET CLICK CONFIGURATION
========================================================= */

const REQUIRED_TARGET_CLICKS = 5;


/*
   Prevent accidental repeated triggering.
*/

let developerEggTriggered = false;


/* =========================================================
   3. TARGET NAME CLICK HANDLER
========================================================= */

function handleTargetNameClick() {

    /*
       Don't trigger again after the Easter Egg
       has already been discovered.
    */

    if (developerEggTriggered) {

        return;

    }


    /*
       Increase click count.
    */

    appState.targetClickCount += 1;


    /*
       Small visual feedback.

       The target title briefly gets a glitch effect.
    */

    if (DOM.targetName) {

        DOM.targetName.classList.remove(
            "glitch"
        );


        void DOM.targetName.offsetWidth;


        DOM.targetName.classList.add(
            "glitch"
        );

    }


    /*
       Check whether 5 clicks have happened.
    */

    if (
        appState.targetClickCount >=
        REQUIRED_TARGET_CLICKS
    ) {

        revealDeveloperConfession();

    }

}


/* =========================================================
   4. REVEAL DEVELOPER CONFESSION
========================================================= */

async function revealDeveloperConfession() {

    /*
       Prevent duplicate execution.
    */

    if (developerEggTriggered) {

        return;

    }


    developerEggTriggered =
        true;


    appState.developerEggFound =
        true;


    /*
       Open developer modal.
    */

    if (DOM.developerModal) {

        openModal(
            DOM.developerModal
        );

    }


    /*
       Clear previous text.
    */

    if (DOM.developerNote) {

        DOM.developerNote.textContent =
            "";


        DOM.developerNote.classList.add(
            "typing"
        );

    }


    /*
       Type each confession line.
    */

    if (DOM.developerNote) {

        for (
            const line
            of developerConfession
        ) {

            /*
               Empty line.
            */

            if (line === "") {

                DOM.developerNote.textContent +=
                    "\n";

                await delay(180);

                continue;

            }


            /*
               Type character by character.
            */

            for (
                let i = 0;
                i < line.length;
                i++
            ) {

                DOM.developerNote.textContent +=
                    line[i];


                await delay(
                    CONFESSION_SPEED
                );

            }


            /*
               New line.
            */

            DOM.developerNote.textContent +=
                "\n";


            await delay(220);

        }


        /*
           Stop cursor animation after
           typing is complete.
        */

        setTimeout(() => {

            DOM.developerNote.classList.remove(
                "typing"
            );

        }, 1000);

    }

}


/* =========================================================
   5. CLOSE DEVELOPER MODAL
========================================================= */

function closeDeveloperConfession() {

    closeModal(
        DOM.developerModal
    );

}


/* =========================================================
   6. DEVELOPER MODAL CLOSE BUTTON
========================================================= */

if (DOM.closeDeveloperModal) {

    DOM.closeDeveloperModal.addEventListener(
        "click",
        closeDeveloperConfession
    );

}


/* =========================================================
   7. CLICK OUTSIDE DEVELOPER MODAL
========================================================= */

if (DOM.developerModal) {

    DOM.developerModal.addEventListener(
        "click",
        event => {

            /*
               Only close when the backdrop itself
               is clicked.
            */

            if (
                event.target ===
                DOM.developerModal
            ) {

                closeDeveloperConfession();

            }

        }
    );

}


/* =========================================================
   8. ESCAPE KEY FOR DEVELOPER MODAL
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            DOM.developerModal &&
            !DOM.developerModal.classList.contains(
                "hidden"
            )
        ) {

            closeDeveloperConfession();

        }

    }
);


/* =========================================================
   9. BORINGNESS TERMINAL
========================================================= */

/*
   The terminal command at the bottom is clickable.

       developer@cse:~$ ./debug_boringness.exe

   Clicking it runs a fake diagnostic.
*/


const boringnessMessages = [

    "developer@cse:~$ ./debug_boringness.exe",

    "",

    "> loading diagnostic module...",

    "> scanning conversation patterns...",

    "> checking boringness database...",

    "> comparing evidence...",

    "",

    "Result:",

    "Boringness not found.",

    "",

    "Excessive talking detected instead. 😂"

];


/*
   Typing speed for terminal Easter Egg.
*/

const BORINGNESS_SPEED = 28;


/* =========================================================
   10. RUN BORINGNESS DEBUGGER
========================================================= */

async function runBoringnessDebugger() {

    /*
       Prevent multiple executions at once.
    */

    if (
        DOM.boringnessTerminal?.dataset.running ===
        "true"
    ) {

        return;

    }


    /*
       Mark terminal as running.
    */

    if (DOM.boringnessTerminal) {

        DOM.boringnessTerminal.dataset.running =
            "true";


        DOM.boringnessTerminal.classList.add(
            "terminal-active"
        );

    }


    /*
       Show result area.
    */

    if (DOM.boringnessResult) {

        DOM.boringnessResult.classList.remove(
            "hidden"
        );


        DOM.boringnessResult.textContent =
            "";

    }


    /*
       Type terminal output.
    */

    if (DOM.boringnessResult) {

        for (
            const line
            of boringnessMessages
        ) {

            /*
               Empty line.
            */

            if (line === "") {

                DOM.boringnessResult.textContent +=
                    "\n";

                await delay(160);

                continue;

            }


            /*
               Type line.
            */

            for (
                let i = 0;
                i < line.length;
                i++
            ) {

                DOM.boringnessResult.textContent +=
                    line[i];


                await delay(
                    BORINGNESS_SPEED
                );

            }


            DOM.boringnessResult.textContent +=
                "\n";


            await delay(230);

        }

    }


    /*
       Final animation.
    */

    if (DOM.boringnessResult) {

        DOM.boringnessResult.classList.remove(
            "glitch"
        );


        void DOM.boringnessResult.offsetWidth;


        DOM.boringnessResult.classList.add(
            "glitch"
        );

    }


    /*
       Allow terminal to run again.
    */

    setTimeout(() => {

        if (DOM.boringnessTerminal) {

            DOM.boringnessTerminal.dataset.running =
                "false";

            DOM.boringnessTerminal.classList.remove(
                "terminal-active"
            );

        }

    }, 1000);


    /*
       Mark Easter Egg as discovered.
    */

    appState.boringnessEggFound =
        true;

}


/* =========================================================
   11. BORINGNESS TERMINAL CLICK
========================================================= */

if (DOM.boringnessTerminal) {

    DOM.boringnessTerminal.addEventListener(
        "click",
        runBoringnessDebugger
    );

}


/* =========================================================
   12. KEYBOARD ACCESSIBILITY
========================================================= */

/*
   Terminal should also work when focused
   and Enter / Space is pressed.
*/

if (DOM.boringnessTerminal) {

    DOM.boringnessTerminal.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                runBoringnessDebugger();

            }

        }
    );

}


/* =========================================================
   13. TARGET NAME ACCESSIBILITY
========================================================= */

if (DOM.targetName) {

    /*
       Make it keyboard accessible if it is
       not already a button.
    */

    if (
        DOM.targetName.tagName !==
        "BUTTON"
    ) {

        DOM.targetName.setAttribute(
            "role",
            "button"
        );


        DOM.targetName.setAttribute(
            "tabindex",
            "0"
        );

    }


    DOM.targetName.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                handleTargetNameClick();

            }

        }
    );


    /*
       Five clicks unlock the secret.
    */

    DOM.targetName.addEventListener(
        "click",
        handleTargetNameClick
    );

}


/* =========================================================
   14. EASTER EGG STATUS
========================================================= */

/*
   Developer console helper:

       debugEasterEggs()

   Shows whether both secrets were discovered.
*/

function debugEasterEggs() {

    console.table({

        "Developer Confession":
            appState.developerEggFound,

        "Boringness Debugger":
            appState.boringnessEggFound,

        "Target Clicks":
            appState.targetClickCount

    });

}


/* =========================================================
   15. INITIALIZATION
========================================================= */

function initializeEasterEggs() {

    /*
       Nothing needs to run automatically.

       Event listeners above handle
       the interactions.

       This function simply confirms
       the module is loaded.
    */

    console.log(
        "%c Easter eggs loaded 👀 ",
        "color:#9b7cff;font-weight:bold;"
    );

}


/*
   Initialize after DOM is available.
*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeEasterEggs
    );

} else {

    initializeEasterEggs();

}


/* =========================================================
   END OF EASTER EGGS
========================================================= */
