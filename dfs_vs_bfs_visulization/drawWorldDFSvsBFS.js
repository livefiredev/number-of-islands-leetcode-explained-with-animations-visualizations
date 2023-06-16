const convertWorldToBlockSettingsArray = (world) => {
    let blockSettingsArray = [];

    world.forEach((latitudeRow, latitudeIdx) => {
        let blockRow = []
        latitudeRow.forEach((longitudeCell, longitudeIdx) => {
            let x = longitudeIdx * blockSize
            let y = latitudeIdx * blockSize
            let color = longitudeCell === 0 ? waterColor : landColor
            blockRow.push({ x, y, color })
        });
        blockSettingsArray.push(blockRow)
    })
    return blockSettingsArray;
}

let drawWorld = (worldAsBlockSettings, idOfElement) => {
    document.getElementById(idOfElement).innerHTML = '';
    let draw = SVG().addTo(`#${idOfElement}`).size(worldAsBlockSettings[0].length * blockSize, worldAsBlockSettings.length * blockSize)
    worldAsBlockSettings.forEach((latitudeRow) => {
        latitudeRow.forEach((blockSettings) => {
            draw.rect(blockSize, blockSize).move(blockSettings.x, blockSettings.y).fill(blockSettings.color)
        })
    })
}

const generateWorld = (width, height) => {
    let world = []
    for (let i = 0; i < height; i++) {
        let row = []
        for (let j = 0; j < width; j++) {
            row.push(1)
        }
        world.push(row)
    }
    return world
}

const changeBlockColorAndReDrawWorld = (whichWorld, latitudeIdx, longitudeIdx, newColor) => {
    let worldAsBlockSettings = undefined;
    let idOfElement = undefined;
    if (whichWorld == "bfs") {
        worldAsBlockSettings = bfsWorldAsBlockSettings;
        idOfElement = "world_canvas_bfs";
    } else {
        worldAsBlockSettings = dfsWorldAsBlockSettings;
        idOfElement = "world_canvas_dfs";
    }
    worldAsBlockSettings[latitudeIdx][longitudeIdx].color = newColor;
    drawWorld(worldAsBlockSettings, idOfElement)
}

let bfsWorld = generateWorld(worldSize, worldSize)
let dfsWorld = generateWorld(worldSize, worldSize)

let bfsWorldAsBlockSettings = convertWorldToBlockSettingsArray(bfsWorld)
let dfsWorldAsBlockSettings = convertWorldToBlockSettingsArray(dfsWorld)

drawWorld(bfsWorldAsBlockSettings, 'world_canvas_bfs')
drawWorld(dfsWorldAsBlockSettings, 'world_canvas_dfs')