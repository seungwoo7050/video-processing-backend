import { parentPort, workerData } from 'worker_threads';

console.log("Worker가 받은 데이터:", workerData);

function heavyComputation(n) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += Math.sqrt(i);
    }
    return sum;
}

const result = heavyComputation(workerData.iterations);

parentPort.postMessage({
    type: "complete",
    result
});