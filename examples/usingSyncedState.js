/**
 * Simple example how to read and invert the current state of a switch.
 * Would toggle the state switch:0 on each newly connected device.
 */

const http = require('http')
const ShellyOWS = require("../shellyOWS");
const ShellyOWSInspector = require("../shellyOWSinspector");

console.log('WS server starting at port 8080')

const httpServer = http.createServer()

let shellyOws = new ShellyOWS(httpServer);

shellyOws.addHandler("NotifyFullStatus", async (clientId, params) => {
    let response = await shellyOws.call(clientId, "Switch.set", {'id': 0, 'on': true});

    // invert state after 2 more seconds
    setTimeout(() => {
        shellyOws.call(
            clientId,
            "Switch.set",
            {
                'id': 0,
                'on': !shellyOws.getState(clientId)['switch:0'].output /* invert state */
            }
        );
    }, 2000);
});


// add debugging/inspection capabilities on the webserver, e.g. /clients, /send?clientId=shellypro4pm-083af27b4470&method=Shelly.getconfig&params=...optional...
(new ShellyOWSInspector(httpServer, shellyOws));

httpServer.listen(8080);
