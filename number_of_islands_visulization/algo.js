let bfsQueue = [];
let dfsStack = [];

let arrayThatHoldsTheBlocksToConquer = {
    'bfs': bfsQueue,
    'dfs': dfsStack
}

let canvasIds = {
    'bfs': 'world_canvas_bfs',
    'dfs': 'world_canvas_dfs'
}

let world = undefined;

let worldsAsBlockSettings = {
    'bfs': undefined,
    'dfs': undefined
}

let currentMode = {
    'bfs': 'find_land', // can also be: 'conquer_land'
    'dfs': 'find_land'
}

let currentTraversalIndexes = {
    'bfs': {
        subArrayIdx: 0,
        subArrayElementIdx: 0
    },
    'dfs': {
        subArrayIdx: 0,
        subArrayElementIdx: 0
    },
}

let blocksThatHaveBeenAddedToFrontier = {
    'bfs': {},
    'dfs': {}
}

let numberOfIslands = {
    'bfs': 0,
    'dfs': 0
}

const createDFSAndBFSWorlds = () => {
    world = generateRandomWorld(worldSize, worldSize)
    let worldAsBlockSettings = convertWorldToBlockSettingsArray(world);
    worldsAsBlockSettings['bfs'] = structuredClone(worldAsBlockSettings);
    worldsAsBlockSettings['dfs'] = structuredClone(worldAsBlockSettings);
    drawWorld(worldsAsBlockSettings['bfs'], canvasIds.bfs);
    drawWorld(worldsAsBlockSettings['dfs'], canvasIds.dfs);
}

createDFSAndBFSWorlds();

const visuallyShowThatCurrentWaterBlockIsExplored = (algo) => {
    let worldAsBlockSettings = worldsAsBlockSettings[algo];
    let worldElementId = canvasIds[algo];
    let currentBlock = currentTraversalIndexes[algo];
    changeBlockColorAndReDrawWorld(
        worldAsBlockSettings, 
        worldElementId, 
        currentBlock.subArrayIdx, 
        currentBlock.subArrayElementIdx, 
        blockToIgnoreColor
    );
}

const visuallyShowThatCurrentLandBlockIsConquered = (algo, blockToConquer) => {
    let worldAsBlockSettings = worldsAsBlockSettings[algo];
    let worldElementId = canvasIds[algo];
    changeBlockColorAndReDrawWorld(
        worldAsBlockSettings, 
        worldElementId, 
        blockToConquer.subArrayIdx, 
        blockToConquer.subArrayElementIdx, 
        conqueredLandColor
    );
}

const visuallyShowThatWeArePassingOverConqueredLandButAreIgnoringTheBlock = (algo, block) => {
    let worldAsBlockSettings = worldsAsBlockSettings[algo];
    let worldElementId = canvasIds[algo];
    changeBlockColorAndReDrawWorld(
        worldAsBlockSettings, 
        worldElementId, 
        block.subArrayIdx, 
        block.subArrayElementIdx, 
        passingOverConqueredLandColor
    );
    setTimeout(() => {
        changeBlockColorAndReDrawWorld(
            worldAsBlockSettings, 
            worldElementId, 
            block.subArrayIdx, 
            block.subArrayElementIdx, 
            conqueredLandColor
        );  
    }, 25)
}

const updateNumberOfIslandsCount = (algo) => {
    numberOfIslands[algo] += 1;
    document.getElementById(`number_of_islands_found_${algo}`).innerText = numberOfIslands[algo];
}

const visuallyShowThatCurrentLandBlockIsAddedToTheFrontier = (algo, blockToAddToFrontier) => {
    let worldAsBlockSettings = worldsAsBlockSettings[algo];
    let worldElementId = canvasIds[algo];
    changeBlockColorAndReDrawWorld(
        worldAsBlockSettings, 
        worldElementId, 
        blockToAddToFrontier.subArrayIdx, 
        blockToAddToFrontier.subArrayElementIdx, 
        blockBeingPushedIntoFrontierColor
    );
}

const whatsAtThisLocation = (objectWithIndexes) => {
    let currentValue = world[objectWithIndexes.subArrayIdx][objectWithIndexes.subArrayElementIdx];
    if ( currentValue == 1 ) {
        return 'land';
    } else {
        return 'water';
    }
}

const moveToTheNextBlock = (algo) => {
    let currentBlock = currentTraversalIndexes[algo];
    // To do, we need to handle edge cases of
    // no more sub arrays and no more element in sub array

    let newSubArrayElementIdx = undefined;
    let newSubArrayIdx = undefined;
    if ( currentBlock.subArrayElementIdx == (worldSize - 1) ) {
        // We are at the end of the current sub-array
        // we need to move to the next one
        if ( currentBlock.subArrayIdx == ( worldSize - 1 ) ) {
            // There is nowhere else to go
        } else {
            newSubArrayElementIdx = 0;
            newSubArrayIdx = currentBlock.subArrayIdx + 1;
        }
    } else {
        newSubArrayElementIdx = currentBlock.subArrayElementIdx + 1;
        newSubArrayIdx = currentBlock.subArrayIdx;
    }

    let newBlock = {
        subArrayIdx: newSubArrayIdx,
        subArrayElementIdx: newSubArrayElementIdx
    }

    currentTraversalIndexes[algo] = newBlock;
}

const getBlockToConquerDependingOnAlgo = (algo) => {
    let theArrayThatHoldsTheBlocksToConquer = arrayThatHoldsTheBlocksToConquer[algo];
    if ( algo == 'bfs' ) {
        return theArrayThatHoldsTheBlocksToConquer.shift();
    } else {
        return theArrayThatHoldsTheBlocksToConquer.pop();
    }
}

const addBlockToFrontier = (algo, block) => {
    blocksThatHaveBeenAddedToFrontier[algo][`${block.subArrayIdx},${block.subArrayElementIdx}`] = true;
    visuallyShowThatCurrentLandBlockIsAddedToTheFrontier(algo, block);
    arrayThatHoldsTheBlocksToConquer[algo].push(block);
}

const isBlockAlreadyAddedToTheFrontier = (algo, block) => {
    return blocksThatHaveBeenAddedToFrontier[algo][`${block.subArrayIdx},${block.subArrayElementIdx}`] === true;
}

const canThisBlockExist = (block) => {
    if (block.subArrayIdx < 0) return false;
    if (block.subArrayElementIdx < 0) return false;
    if (block.subArrayIdx >= worldSize) return false;
    if (block.subArrayElementIdx >= worldSize) return false;
    return true;
}

const addBlocksThatCanBeConqueredFromThisBlockToTheFrontier = (algo, blockToConquer) => {
    let blockAbove = {
        subArrayIdx: blockToConquer.subArrayIdx - 1,
        subArrayElementIdx: blockToConquer.subArrayElementIdx
    }

    let blockBelow = {
        subArrayIdx: blockToConquer.subArrayIdx + 1,
        subArrayElementIdx: blockToConquer.subArrayElementIdx
    }

    let blockToRight = {
        subArrayIdx: blockToConquer.subArrayIdx,
        subArrayElementIdx: blockToConquer.subArrayElementIdx + 1
    }

    let blockToLeft = {
        subArrayIdx: blockToConquer.subArrayIdx,
        subArrayElementIdx: blockToConquer.subArrayElementIdx - 1
    }

    let allPossibleBlocksToConquer = [
        blockAbove,
        blockBelow,
        blockToRight,
        blockToLeft
    ]

    let onlyBlocksThatCanExist = allPossibleBlocksToConquer.filter(canThisBlockExist);

    let blocksWithLand = onlyBlocksThatCanExist.filter((block) => {
        if ( whatsAtThisLocation(block) == 'land' ) {
            return true;
        } else {
            return false;
        }
    });

    let newUnvisitedBlocks = blocksWithLand.filter((block) => {
        return isBlockAlreadyAddedToTheFrontier(algo, block) == false;
    });

    newUnvisitedBlocks.forEach((block) => {
        addBlockToFrontier(algo, block);
    })
}

let conquerLand = (algo) => {
    let blockToConquer = getBlockToConquerDependingOnAlgo(algo);

    if (blockToConquer == undefined) {
        currentMode[algo] = 'find_land';
        updateNumberOfIslandsCount(algo);
        moveToTheNextBlock(algo);
        return;
    }

    visuallyShowThatCurrentLandBlockIsConquered(algo, blockToConquer);
    addBlocksThatCanBeConqueredFromThisBlockToTheFrontier(algo, blockToConquer);
}

const goNext = (algo) => {

    let theCurrentMode = currentMode[algo];
    if (theCurrentMode == 'find_land') {
        let currentTraversalIndex = currentTraversalIndexes[algo];

        if (currentTraversalIndex.subArrayIdx == undefined) {
            if (autoPlayIntervalId != undefined) {
                clearInterval(autoPlayIntervalId);
                autoPlayIntervalId = undefined;
            }
            return;
        }

        // If we have already explored this block
        // via land exploration we need to ignore this block
        if (isBlockAlreadyAddedToTheFrontier(algo, currentTraversalIndex) == true) {
            visuallyShowThatWeArePassingOverConqueredLandButAreIgnoringTheBlock(algo, currentTraversalIndex);
            moveToTheNextBlock(algo);
            return;
        }

        if ( whatsAtThisLocation(currentTraversalIndex) == 'land' ) {
            addBlockToFrontier(algo, currentTraversalIndex);
            currentMode[algo] = 'conquer_land';
        } else {
            // This is not land, so lets move to the next
            // block in order to find land
            visuallyShowThatCurrentWaterBlockIsExplored(algo);
            moveToTheNextBlock(algo);
        }
    } else {
        conquerLand(algo);
    }

}