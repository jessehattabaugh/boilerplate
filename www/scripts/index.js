// JavaScript that runs after the DOM has been loaded

// test linting set up for various environments
//void process; // Node
void Document; // Browser
//void Clients; // ServiceWorker
//void DedicatedWorkerGlobalScope; // Worker

/** @type {ScriptType} */
const message = 'Hello Scripts';

console.log(message, 'dom loaded');
