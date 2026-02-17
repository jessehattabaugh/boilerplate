// JavaScript that doesn't require the DOM be fully parsed

// test linting set up for various environments
//void process; // Node
void Document; // Browser
//void Clients; // ServiceWorker
//void DedicatedWorkerGlobalScope; // Worker

/** @type {ScriptType} */
const message = 'Hello Scripts';

console.log(message, 'async script loaded');
