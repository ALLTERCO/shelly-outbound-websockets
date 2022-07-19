/**
 * This script would read and set config values.
 * For the example, we would set a random device name on each newly connected device and once thats done (async),
 * would print the new device name.
 */


const http = require('http')
const ShellyOWS = require("../shellyOWS");
const ShellyOWSInspector = require("../shellyOWSinspector");


function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}



console.log('WS server starting at port 8080')

const httpServer = http.createServer()

let shellyOws = new ShellyOWS(httpServer);

shellyOws.addHandler("NotifyFullStatus", async (clientId, params) => {
    // we are using setConfig method, instead of direct .call, since it would take care in updating local config cache,
    // immediately after the config is saved successfully.

    let response = await shellyOws.setConfig(clientId, "Sys", {
        'device': {
            'name': "test" + between(1, 100)
        }
    });

    console.error("New name for", clientId, "is", shellyOws.getConfig(clientId)['sys']['device']['name']);
});


// add debugging/inspection capabilities on the webserver, e.g. /clients, /send?clientId=shellypro4pm-083af27b4470&method=Shelly.getconfig&params=...optional...
(new ShellyOWSInspector(httpServer, shellyOws));

httpServer.listen(8080);
