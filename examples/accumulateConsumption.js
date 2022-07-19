/**
 * Accumulates energy data from PM devices.
 */

const http = require('http')
const ShellyOWS = require("../shellyOWS");
const ShellyOWSInspector = require("../shellyOWSinspector");

console.log('WS server starting at port 8080');

const httpServer = http.createServer();

let shellyOws = new ShellyOWS(httpServer);

let CONSUMPTION_ACCUMULATOR = {};
let accumulate = async (clientId, params) => {
    for (let k of Object.keys(params)) {
        if (k.indexOf("switch:") > -1) {
            if (!CONSUMPTION_ACCUMULATOR[clientId]) {
                // init
                CONSUMPTION_ACCUMULATOR[clientId] = {};
            }
            if (params[k].output === false) {
                // reset when turned off
                CONSUMPTION_ACCUMULATOR[clientId][k] = 0;
                console.error('reset accumulator for', k);
            }
            if (params[k].aenergy) {
                // accumulate energy for this {clientId, switchId}
                CONSUMPTION_ACCUMULATOR[clientId][k] = CONSUMPTION_ACCUMULATOR[clientId][k] || 0;
                CONSUMPTION_ACCUMULATOR[clientId][k] += params[k].aenergy.by_minute[0];
                if (CONSUMPTION_ACCUMULATOR[clientId][k] > 500) {
                    console.error(
                        clientId, k,
                        'consumption is > 0.5W, turning off, current accumulated consumption:',
                        CONSUMPTION_ACCUMULATOR[clientId][k]
                    );

                    await shellyOws.call(clientId, "Switch.set", {'id': 0, 'on': false});
                }
                else {
                    console.debug(clientId, "Current consumption accumulated for", k, CONSUMPTION_ACCUMULATOR[clientId][k], "mW");
                }
            }
        }
    }
};

shellyOws.addHandler("NotifyStatus", accumulate);

// initial accumulation and automatic turning on, when the device is connected first
shellyOws.addHandler("NotifyFullStatus", async (clientId, params) => {
    accumulate(clientId, params);

    // This method is called initially when a device is connected, so lets turn on the Switch
    await shellyOws.call(clientId, "Switch.set", {'id': 0, 'on': true});
});

shellyOws.addHandler("OWS::Disconnected", async (clientId, params) => {
    // Reset all consumption
    delete CONSUMPTION_ACCUMULATOR[clientId];
});

// add debugging/inspection capabilities on the webserver, e.g. /clients, /send?clientId=shellypro4pm-083af27b4470&method=Shelly.getconfig&params=...optional...
(new ShellyOWSInspector(httpServer, shellyOws));

httpServer.listen(8080);
