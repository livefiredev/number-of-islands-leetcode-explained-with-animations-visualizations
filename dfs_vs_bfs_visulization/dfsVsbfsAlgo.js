let intervalId = undefined;
let bfsComplete = false;
let dfsComplete = false;
let numberOfBlocksCovered = {
    bfs: 0,
    dfs: 0
}

let dfsStack = [
    {
        subArrayIdx: 0,
        subArrayElementIdx: 0,
    }
]

let bfsQueue = [
    {
        subArrayIdx: 0,
        subArrayElementIdx: 0,
    }
]

let dfsHandledObject = {}
let bfsHandledObject = {}

const addBlockToHandledList = (algoType, objWithIdexes) => {
    if (algoType == 'bfs') {
        bfsHandledObject[`${objWithIdexes.subArrayIdx}-${objWithIdexes.subArrayElementIdx}`] = true;
    } else {
        dfsHandledObject[`${objWithIdexes.subArrayIdx}-${objWithIdexes.subArrayElementIdx}`] = true;
    }
}

addBlockToHandledList('bfs', bfsQueue[0]);
addBlockToHandledList('dfs', dfsStack[0]);

const addBlockToFrontier = (algoType, objWithIdexes) => {
    if (algoType == 'bfs') {
        bfsQueue.push(objWithIdexes)
    } else {
        dfsStack.push(objWithIdexes)
    }
}

const hasThisBlockBeenHandled = (algoType, objWithIdexes) => {
    let val;
    if (algoType == 'bfs') {
        val = bfsHandledObject[`${objWithIdexes.subArrayIdx}-${objWithIdexes.subArrayElementIdx}`];
    } else {
        val = dfsHandledObject[`${objWithIdexes.subArrayIdx}-${objWithIdexes.subArrayElementIdx}`];
    }
    if (val == undefined) {
        return false
    } else {
        val;
    }
}

const doesBlockExist = ({ subArrayIdx, subArrayElementIdx }) => {
    // Check if the idxs are too low
    if (subArrayIdx < 0 || subArrayElementIdx < 0) {
        return false;
    }
    let maxIndexPossibleForBothIndexes = worldSize - 1;
    // Check if the idxes are too high
    if (subArrayIdx > maxIndexPossibleForBothIndexes || subArrayElementIdx > maxIndexPossibleForBothIndexes) {
        return false;
    }
    return true;
}

const addNeighborsToQueue = (algo, subArrayIdx, subArrayElementIdx) => {
    let blockAbove = {
        subArrayIdx: subArrayIdx - 1,
        subArrayElementIdx: subArrayElementIdx
    }

    let blockBelow = {
        subArrayIdx: subArrayIdx + 1,
        subArrayElementIdx: subArrayElementIdx
    }

    let blockOnTheRight = {
        subArrayIdx: subArrayIdx,
        subArrayElementIdx: subArrayElementIdx + 1
    }

    let blockOnTheLeft = {
        subArrayIdx: subArrayIdx,
        subArrayElementIdx: subArrayElementIdx - 1
    }

    let allSurroundingBlocks = [
        blockAbove, blockBelow, blockOnTheRight, blockOnTheLeft
    ]

    allSurroundingBlocks.forEach((blockObject) => {
        if (doesBlockExist(blockObject) && hasThisBlockBeenHandled(algo, blockObject) == false) {
            changeBlockColorAndReDrawWorld(algo, blockObject.subArrayIdx, blockObject.subArrayElementIdx, blockBeingPushedIntoFrontierColor);
            addBlockToHandledList(algo, blockObject);
            addBlockToFrontier(algo, blockObject);
        }
    })
}

const closeAnimationIfDFSAndBFSAreComplete = () => {
    if ( bfsComplete && dfsComplete ) {
        console.log('Both are complete to stopping animation.')
        clearInterval(intervalId);
    }
}

const incrementBlockAndUpdateBlockCount = (algo) => {
    numberOfBlocksCovered[algo] += 1;
    let selectorForCounterInUI = `number_of_blocks_covered_${algo}`;
    document.getElementById(selectorForCounterInUI).innerText = numberOfBlocksCovered[algo];
}

const processNextStepInBFS = () => {

    let elementToProcess = bfsQueue.shift();
    if (elementToProcess == undefined) {
        bfsComplete = true;
        closeAnimationIfDFSAndBFSAreComplete();
        return;
    }

    changeBlockColorAndReDrawWorld('bfs', elementToProcess.subArrayIdx, elementToProcess.subArrayElementIdx, conqueredLandColor);
    incrementBlockAndUpdateBlockCount('bfs');

    addNeighborsToQueue('bfs', elementToProcess.subArrayIdx, elementToProcess.subArrayElementIdx);
}

const processNextStepInDFS = () => {

    let elementToProcess = dfsStack.pop();
    if (elementToProcess == undefined) {
        dfsComplete = true;
        closeAnimationIfDFSAndBFSAreComplete();
        return;
    }

    changeBlockColorAndReDrawWorld('dfs', elementToProcess.subArrayIdx, elementToProcess.subArrayElementIdx, conqueredLandColor);
    incrementBlockAndUpdateBlockCount('dfs');

    addNeighborsToQueue('dfs', elementToProcess.subArrayIdx, elementToProcess.subArrayElementIdx);
}

const processNextStepsInAlgo = () => {
    console.log('New step');
    processNextStepInBFS()
    processNextStepInDFS()
}

document.getElementById("nextButton").addEventListener("click", () => {
    processNextStepsInAlgo();
})

document.getElementById('playButton').addEventListener('click', () => {
    if (intervalId) {
        return;
    }
    intervalId = setInterval(processNextStepsInAlgo, 10);
})