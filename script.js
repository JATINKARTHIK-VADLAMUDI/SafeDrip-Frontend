const SERVER = "https://safedrip-backend.onrender.com";

// ---------------- URL PARAMETERS ----------------

const params = new URLSearchParams(window.location.search);

const selectedFloor = params.get("floor");
const selectedWard = params.get("ward");
const selectedBed = params.get("bed");


// ---------------- ALERT VARIABLES ----------------

let alertShown = false;
let desktopNotificationShown = false;

// Ask Notification Permission

if ("Notification" in window) {

    Notification.requestPermission();

}

// ---------------- LOAD DATA ----------------

async function loadData() {

    try {

        const response = await fetch(
            SERVER + "/api/bed-data?bed=" + encodeURIComponent(selectedBed || "Bed-01")
        );
        const data = await response.json();

        // ---------------- Patient Details ----------------

       // ---------------- Patient Details ----------------
        
        if (document.getElementById("bedNumber"))
            document.getElementById("bedNumber").innerHTML =
                selectedBed || data.bedNumber || "--";

        if (document.getElementById("ward"))
            document.getElementById("ward").innerHTML =
                selectedWard || data.ward || "--";

        if (document.getElementById("floor"))
            document.getElementById("floor").innerHTML =
                selectedFloor || "--";

        // ---------------- Live Data ----------------

        document.getElementById("txid").innerHTML =
            data.transmitter;

        document.getElementById("weight").innerHTML =
            Number(data.weight).toFixed(2) + " g";
        // ---------------- EMERGENCY ALERT ----------------
        
        const weightCard = document.getElementById("weightCard");
        const alertBanner = document.getElementById("alertBanner");
        
        if (Number(data.weight) <= 20) {
            
            // Show Banner
            
            if (alertBanner)
                alertBanner.style.display = "block";
            // Flash Weight Card
            if (weightCard)
                weightCard.classList.add("flash");
            // Popup only once
            if (!alertShown) {
                alertShown = true;
                showPopup(data.weight, data.transmitter);
                playAlarm();
            }
            // Desktop Notification only once
            if (!desktopNotificationShown &&
                Notification.permission === "granted") {
                desktopNotificationShown = true;
                new Notification("🚨 SafeDrip Alert", {
                    body:
                        "LOW SALINE LEVEL\n\n" +
                        "Transmitter : " + data.transmitter +
                        "\nWeight : " +
                        Number(data.weight).toFixed(2) +
                        " g\n\nReplace Saline Bottle.",
                    icon:
                        "https://cdn-icons-png.flaticon.com/512/2966/2966489.png"
                });
            }
        }
        else{
            if(alertBanner)
                alertBanner.style.display="none";
            if(weightCard)
                weightCard.classList.remove("flash");
            alertShown=false;
            desktopNotificationShown=false;
        }

        document.getElementById("relay").innerHTML =
            data.relay;

        document.getElementById("motor").innerHTML =
            data.motor;

        document.getElementById("buzzer").innerHTML =
            data.buzzer;

        // ---------------- STATUS ----------------

        const status = document.getElementById("status");

        status.innerHTML = data.status;

        status.classList.remove("safe", "warning", "danger");

        if (data.status === "SAFE")
            status.classList.add("safe");

        else if (data.status === "WARNING")
            status.classList.add("warning");

        else if (data.status === "DANGER")
            status.classList.add("danger");

        // ---------------- TIME ----------------

        document.getElementById("time").innerHTML =
            new Date().toLocaleTimeString();

    }

    catch (err) {

        console.log("ERROR :", err);

    }

}
// ---------------- POPUP ----------------

function showPopup(weight, transmitter){

    document.getElementById("popup").style.display="block";

    document.getElementById("popupWeight").innerHTML=
    Number(weight).toFixed(2)+" g";

    document.getElementById("popupTx").innerHTML=
    transmitter;

}

function closePopup(){

    document.getElementById("popup").style.display="none";
    alertShown = false;

}
// ---------------- ALARM ----------------

function playAlarm(){

    const audio = new Audio(
    "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );

    audio.play();

}

// ---------------- MOTOR ----------------

async function sendMotor(mode) {

    await fetch(SERVER + "/api/control", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            motor: mode
        })

    });

    loadData();

}

// ---------------- BUZZER ----------------

async function sendBuzzer(mode) {

    await fetch(SERVER + "/api/control", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            buzzer: mode
        })

    });

    loadData();

}

// ---------------- AUTO REFRESH ----------------

loadData();

setInterval(loadData, 1000);
