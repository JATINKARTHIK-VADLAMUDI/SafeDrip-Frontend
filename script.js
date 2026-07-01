const SERVER = "https://safedrip-backend.onrender.com";

// ---------------- LOAD LIVE DATA ----------------

async function loadData() {

    try {

        const response = await fetch(SERVER + "/api/data");

        const data = await response.json();

        document.getElementById("txid").innerHTML =
            data.transmitter;

        document.getElementById("weight").innerHTML =
            data.weight.toFixed(2) + " g";

        document.getElementById("relay").innerHTML =
            data.relay;

        document.getElementById("status").innerHTML =
            data.status;

        document.getElementById("mode").innerHTML =
            data.mode;

    }

    catch (error) {

        console.log(error);

    }

}

// ---------------- SEND CONTROL ----------------

async function sendCommand(mode) {

    try {

        await fetch(SERVER + "/api/control", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mode: mode
            })

        });

        loadData();

    }

    catch (error) {

        console.log(error);

    }

}

// ---------------- AUTO REFRESH ----------------

loadData();

setInterval(loadData, 1000);
