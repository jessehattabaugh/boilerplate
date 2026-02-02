// test linting set up for various environments
//void process; // Node
//void Document; // Browser
void Clients; // ServiceWorker
//void DedicatedWorkerGlobalScope; // Worker

/** @type {WorkerMessage} */
const message = 'Hello Worker';

console.debug(message);
