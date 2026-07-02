const SERVER = "https://safedrip-backend.onrender.com";

// ---------------- LOAD DATA ----------------

async function loadData() {

    try {

        const response = await fetch(SERVER + "/api/data");
        const data = await response.json();

        // ---------------- Patient Details ----------------

        if (document.getElementById("bedNumber"))
            document.getElementById("bedNumber").innerHTML =
                data.bedNumber || "ICU-01";

        if (document.getElementById("ward"))
            document.getElementById("ward").innerHTML =
                data.ward || "ICU";

        // ---------------- Live Data ----------------

        document.getElementById("txid").innerHTML =
            data.transmitter;

        document.getElementById("weight").innerHTML =
            Number(data.weight).toFixed(2) + " g";

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
