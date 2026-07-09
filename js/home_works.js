const gmailInput = document.querySelector('#gmail_input')
const gmailButton = document.querySelector('#gmail_button')
const gmailResult = document.querySelector('#gmail_result')


const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/

gmailButton.onclick = () => {
    const value = gmailInput.value.trim()

    if (value === '') {
        gmailResult.textContent = 'Введите почту'
        gmailResult.style.color = 'orange'
        return
    }

    if (gmailRegex.test(value)) {
        gmailResult.textContent = 'Почта валидна ✅'
        gmailResult.style.color = 'lightgreen'
    } else {
        gmailResult.textContent = 'Почта невалидна ❌'
        gmailResult.style.color = 'red'
    }
}



const parentBlock = document.querySelector('.parent_block')
const childBlock = document.querySelector('.child_block')
 
const parentWidth = parentBlock.clientWidth
const parentHeight = parentBlock.clientHeight
const childWidth = childBlock.clientWidth
const childHeight = childBlock.clientHeight
 
const step = 5
 
const maxLeft = parentWidth - childWidth
const maxTop = parentHeight - childHeight
 
let x = 0
let y = 0
let direction = 'right'
 
const moveChildBlock = () => {
    childBlock.style.left = `${x}px`
    childBlock.style.top = `${y}px`
 
    switch (direction) {
        case 'right':
            x = Math.min(x + step, maxLeft)
            if (x === maxLeft) direction = 'down'
            break
        case 'down':
            y = Math.min(y + step, maxTop)
            if (y === maxTop) direction = 'left'
            break
        case 'left':
            x = Math.max(x - step, 0)
            if (x === 0) direction = 'up'
            break
        case 'up':
            y = Math.max(y - step, 0)
            if (y === 0) direction = 'right'
            break
    }
    setTimeout(moveChildBlock, 20)
}
moveChildBlock()



const secondsDisplay = document.querySelector('#seconds')
const startButton = document.querySelector('#start')
const stopButton = document.querySelector('#stop')
const resetButton = document.querySelector('#reset')
 
let elapsedTime = 0
let startTimestamp = null
let timerId = null
 
const formatTime = (totalMs) => {
    const hours = Math.floor(totalMs / 3600000)
    const minutes = Math.floor((totalMs % 3600000) / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)
    const milliseconds = Math.floor(totalMs % 1000)
 
    const pad = (num, size = 2) => String(num).padStart(size, '0')
 
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds, 3)}`
}
 
const updateDisplay = () => {
    secondsDisplay.textContent = formatTime(elapsedTime)
}
 
updateDisplay()
 
const tick = () => {
    elapsedTime = Date.now() - startTimestamp
    updateDisplay()
    timerId = requestAnimationFrame(tick)
}
 
startButton.onclick = () => {
    if (timerId) return
 
    startTimestamp = Date.now() - elapsedTime
    timerId = requestAnimationFrame(tick)
}
 
stopButton.onclick = () => {
    cancelAnimationFrame(timerId)
    timerId = null
}
 
resetButton.onclick = () => {
    cancelAnimationFrame(timerId)
    timerId = null
    elapsedTime = 0
    updateDisplay()
}




const firstPromise = new Promise((resolve, reject) => {
    const isSuccess = Math.random() > 0.5
    setTimeout(() => {
        if (isSuccess) {
            resolve('Первый промис выполнен успешно')
        } else {
            reject('Первый промис завершился с ошибкой')
        }
    }, 1000)
})
 
firstPromise
    .then(
        (result) => {
            console.log(result)
            return new Promise((resolve, reject) => {
                const isSuccess = Math.random() > 0.5
 
                setTimeout(() => {
                    if (isSuccess) {
                        resolve('Второй промис выполнен успешно')
                    } else {
                        reject('Второй промис завершился с ошибкой')
                    }
                }, 1000)
            })
        },
        (error) => {
            console.log(error)
 
            return new Promise((resolve, reject) => {
                const isSuccess = Math.random() > 0.5
 
                setTimeout(() => {
                    if (isSuccess) {
                        resolve('Второй промис выполнен успешно')
                    } else {
                        reject('Второй промис завершился с ошибкой')
                    }
                }, 1000)
            })
        }
    )
.then(
    (result) => console.log(result),
    (error) => console.log(error)
)
 