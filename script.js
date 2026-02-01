/* ---------------- PARTICLES ---------------- */

particlesJS("particles-js", {
  particles: {
    number: { value: 150 },
    color: { value: "#b0b0b0" },
    size: { value: 2.5 },
    move: { speed: 2.5 }
  }
});


/* ---------------- MODE STATE ---------------- */

let isManual = false; // MUST be at top


/* ---------------- SOCKET ---------------- */

const socket = io();

const distanceText = document.getElementById("distanceValue");
const statusText   = document.getElementById("roverStatus");


socket.on("connect", () => {
    console.log("Connected to server");
});


/* Distance */
socket.on("distance", (value) => {

    distanceText.innerHTML = value + " cm";

    if (value < 20) {
        distanceText.style.color = "red";
    } 
    else if (value < 50) {
        distanceText.style.color = "orange";
    }
    else {
        distanceText.style.color = "#22C55E";
    }
});


/* Status */
statusText.innerHTML = "CONNECTING...";

socket.on("status", (state) => {

    statusText.innerHTML = state;

    if (state === "STOPPED") {
        statusText.style.color = "red";
    }
    else if (state === "MOVING") {
        statusText.style.color = "#22C55E";
    }
    else if (state.includes("TURN")) {
        statusText.style.color = "orange";
    }
    else {
        statusText.style.color = "yellow";
    }
});


/* ---------------- SEND COMMAND ---------------- */

function sendCommand(cmd) {

    document.getElementById("controlStatus").innerText =
        cmd.toUpperCase();

    console.log("Command:", cmd);

    // socket.emit("command", cmd);   // Later for backend
}


/* ---------------- KEYBOARD CONTROL ---------------- */

document.addEventListener("keydown", function (e) {

    // ❌ Block in AUTO mode
    if (!isManual) return;

    switch (e.key) {

        case "ArrowUp":
        case "w":
        case "W":
            sendCommand("forward");
            break;

        case "ArrowDown":
        case "s":
        case "S":
            sendCommand("backward");
            break;

        case "ArrowLeft":
        case "a":
        case "A":
            sendCommand("left");
            break;

        case "ArrowRight":
        case "d":
        case "D":
            sendCommand("right");
            break;

        case " ":
            sendCommand("stop");
            break;
    }
});


/* Stop on key release */
document.addEventListener("keyup", function (e) {

    if (!isManual) return;

    if (
        e.key === "ArrowUp"   ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"||
        e.key === "w" || e.key === "W" ||
        e.key === "a" || e.key === "A" ||
        e.key === "s" || e.key === "S" ||
        e.key === "d" || e.key === "D"
    ) {
        sendCommand("stop");
    }
});


/* ---------------- MODE TOGGLE ---------------- */

function toggleMode() {

    const btn = document.getElementById("modeBtn");
    const manualButtons = document.querySelectorAll(".manual-btn");
    const status = document.getElementById("controlStatus");

    isManual = !isManual;

    if (isManual) {
        // MANUAL MODE
        btn.innerText = "🎮 Manual Mode";
        btn.style.background = "#22c55e";

        manualButtons.forEach(b => b.disabled = false);

        status.innerText = "MANUAL";

        sendCommand("manual");

    } else {
        // AUTO MODE
        btn.innerText = "🤖 Autonomous Mode";
        btn.style.background = "#3b82f6";

        manualButtons.forEach(b => b.disabled = true);

        status.innerText = "AUTO";

        sendCommand("auto");
    }

    console.log("Manual Mode:", isManual);
}


