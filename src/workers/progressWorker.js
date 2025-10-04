import { parentPort, workerData } from 'worker_threads';

function lognTask(totalSteps) {
    for (let i = 0; i < totalSteps; i++) {
        const temp = Math.sqrt(i) * Math.random();

        if (i % (totalSteps / 10) === 0) {
            const progress = (i / totalSteps) * 100;
            parentPort.postMessage({
                type: "progress",
                value: Math.floor(progress)
            });
        }
    }
    return "Task Completed";
}

const result = lognTask(workerData.steps);

parentPort.postMessage({
    type: "complete",
    result
});