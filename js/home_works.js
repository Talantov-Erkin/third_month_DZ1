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
 

/ ================= DELAY (используется в заданиях ниже) =================
 
const delay = (value, ms, shouldFail = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            shouldFail ? reject(new Error(`Ошибка при обработке: ${value}`)) : resolve(value);
        }, ms);
    });
}
 
 
// ================= ЗАДАНИЕ 1 — ЦЕПОЧКА ИЗ ТРЁХ DELAY (.then/.catch/.finally) =================
 
delay(1, 500)
    .then((value) => {
        console.log('[Задание 1] Шаг 1 выполнен, значение:', value)
        return delay(value + 1, 500, true) // второй delay должен упасть
    })
    .then((value) => {
        // этот шаг не выполнится, т.к. предыдущий delay упал
        console.log('[Задание 1] Шаг 2 выполнен, значение:', value)
        return delay(value + 1, 500)
    })
    .then((value) => {
        // этот шаг тоже не выполнится
        console.log('[Задание 1] Шаг 3 выполнен, значение:', value)
    })
    .catch((error) => {
        console.log('[Задание 1] Поймали ошибку в .catch:', error.message)
    })
    .finally(() => {
        console.log('[Задание 1] .finally сработал в любом случае')
    })
 
 
// ================= ЗАДАНИЕ 2 — ТА ЖЕ ЦЕПОЧКА ЧЕРЕЗ async/await =================
 
const runChainAsync = async () => {
    try {
        const value1 = await delay(1, 500)
        console.log('[Задание 2] Шаг 1 выполнен, значение:', value1)
 
        const value2 = await delay(value1 + 1, 500, true) // должен упасть
        console.log('[Задание 2] Шаг 2 выполнен, значение:', value2) // не выполнится
 
        const value3 = await delay(value2 + 1, 500)
        console.log('[Задание 2] Шаг 3 выполнен, значение:', value3) // не выполнится
    } catch (error) {
        console.log('[Задание 2] Поймали ошибку в catch:', error.message)
    } finally {
        console.log('[Задание 2] finally сработал в любом случае')
    }
}
 
runChainAsync()
 
// --- Усложнение: последовательная обработка массива из 4 значений ---
// Одна ошибка не должна прерывать обработку остальных элементов
 
const processArraySequentially = async (values) => {
    const results = []
 
    for (const value of values) {
        try {
            const shouldFail = Math.random() > 0.7
            const result = await delay(value, 300, shouldFail)
            results.push({ value: result, error: null })
        } catch (error) {
            // ошибка конкретного элемента не прерывает цикл
            results.push({ value: null, error: error.message })
        }
    }
 
    return results
}
 
processArraySequentially([10, 20, 30, 40]).then((results) => {
    console.log('[Задание 2] Результаты обработки массива:', results)
})
 
 

const runPromiseAll = async () => {
    try {
        const results = await Promise.all([
            delay('A', 300),
            delay('B', 600, true),
            delay('C', 900),
            delay('D', 1200)
        ])
        console.log('[Задание 3 / Promise.all] Все выполнились:', results)
    } catch (error) { 
        console.log('[Задание 3 / Promise.all] Упал из-за первой ошибки:', error.message)
    }
}
 
runPromiseAll()
 
const runPromiseAllSettled = async () => {
    const results = await Promise.allSettled([
        delay('A', 300),
        delay('B', 600, true),
        delay('C', 900),
        delay('D', 1200)
    ])
 
    const succeeded = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)
 
    const failed = results
        .filter((r) => r.status === 'rejected')
        .map((r) => r.reason.message)
 
    console.log('[Задание 3 / Promise.allSettled] Успешные:', succeeded)
    console.log('[Задание 3 / Promise.allSettled] Провалившиеся:', failed)
}
 
runPromiseAllSettled()
 
const runPromiseRace = async () => {
    try {
        const result = await Promise.race([
            delay('полезные данные', 2000),
            delay('таймаут', 500, true)
        ])
        console.log('[Задание 3 / Promise.race] Победитель:', result)
    } catch (error) {
        console.log('[Задание 3 / Promise.race] Гонку выиграл таймаут с ошибкой:', error.message)
    }
}
 
runPromiseRace()
 