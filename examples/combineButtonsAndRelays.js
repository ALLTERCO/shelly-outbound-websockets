/**
 * Example on how to use events from 1 device and then toggle other devices.
 */


const http = require('http')
const ShellyOWS = require("../shellyOWS");
const ShellyOWSInspector = require("../shellyOWSinspector");

console.log('WS server starting at port 8080')

const httpServer = http.createServer()

let shellyOws = new ShellyOWS(httpServer);


shellyOws.addHandler("NotifyEvent", async (clientId, params) => {
    if (!params.events) {
        return;
    }

    for (let event of params.events) {
        if (event.event === "single_push") {
            // map input:N -> switch:N
            let id = parseInt(event.component.split("input:")[1], 10);

            for (let clientId of shellyOws.getClients()) {
                // On each single_push, call Switch.toggle on all switch'able clients
                let state = shellyOws.getState(clientId);

                // check if switch:N exists for this client
                if (state["switch:" + id]) {
                    await shellyOws.call(clientId, "Switch.toggle", {'id': id});
                }
            }
        }
    }
});

// optional: add debugging/inspection capabilities on the webserver, e.g. /clients,
// /send?clientId=shellypro4pm-083af27b4470&method=Shelly.getconfig&params=..
(new ShellyOWSInspector(httpServer, shellyOws));

httpServer.listen(8080);
