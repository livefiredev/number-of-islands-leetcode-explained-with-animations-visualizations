const convertWorldToBlockSettingsArray = (world) => {
    let blockSettingsArray = [];

    world.forEach((subArray, subArrayIndex) => {
        let blockRow = []
        subArray.forEach((subArrayElement, subArrayElementIndex) => {
            let x = subArrayElementIndex * blockSize
            let y = subArrayIndex * blockSize
            let color = subArrayElement === 0 ? waterColor : landColor
            blockRow.push({ x, y, color })
        });
        blockSettingsArray.push(blockRow)
    })
    return blockSettingsArray;
}

let drawWorld = (worldAsBlockSettings, elementId) => {
    document.getElementById(elementId).innerHTML = '';
    let draw = SVG().addTo(`#${elementId}`).size(worldAsBlockSettings[0].length * blockSize, worldAsBlockSettings.length * blockSize)
    worldAsBlockSettings.forEach((subArray) => {
        subArray.forEach((blockSettings) => {
            draw.rect(blockSize, blockSize).move(blockSettings.x, blockSettings.y).fill(blockSettings.color)
        })
    })
}

const generateRandomPointOfLandOrWater = () => {
    let randomNumberBetweenZeroAndHundreds = Math.round(Math.random() * 100)
    let ratioOfLandToWater = document.getElementById("land_to_water_ratio").value;
    return randomNumberBetweenZeroAndHundreds < parseInt(ratioOfLandToWater) ? 1 : 0
}

const generateRandomWorld = (width, height) => {
    let world = []
    for (let i = 0; i < height; i++) {
        let row = []
        for (let j = 0; j < width; j++) {
            row.push(generateRandomPointOfLandOrWater())
        }
        world.push(row)
    }
    return world
}

const changeBlockColorAndReDrawWorld = (world, elementId, subArrayIdx, elementInsideSubArrayIdx, newColor) => {
    world[subArrayIdx][elementInsideSubArrayIdx].color = newColor;
    drawWorld(world, elementId);
}

const renderNumberOfIslandsFound = () => {
    document.getElementById('number_of_islands_found_bfs').innerHTML = numberOfIslandsBFS;
    document.getElementById('number_of_islands_found_dfs').innerHTML = numberOfIslandsDFS;
}