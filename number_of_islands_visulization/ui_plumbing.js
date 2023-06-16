document.getElementById('nextButton').addEventListener('click', () => {
    goNext('dfs')
    goNext('bfs')
})


let autoPlayIntervalId = undefined;

document.getElementById('playButton').addEventListener('click', () => {
    autoPlayIntervalId = setInterval(() => {
        goNext('dfs')
        goNext('bfs')
    }, 100)
})
