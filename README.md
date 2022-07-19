# shelly-outbound-websockets

Sample code for Shelly Outbound WebSockets.

This repo contains an example implementation of an
[Outbound WebSocket](https://shelly-api-docs.shelly.cloud/gen2/ComponentsAndServices/Ws) server, that
can be used with [Shelly's RPC](https://shelly-api-docs.shelly.cloud/gen2/)

Examples
====

examples/accumulateConsumption.js
---
Example on how to accumulate consumption from PM devices.


examples/usingSyncedConfig.js
---
Example on how to access and set locally cached config.


examples/usingSyncedState.js
---
Example on how to read locally cached state.


examples/combineButtonsAndRelays.js
---
Example on how to read events from devices and call methods on other specific (capable) devices,
that are connected to the Outbound server.
