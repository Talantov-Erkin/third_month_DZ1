// ================= PHONE CHECKER =================

const phoneInput = document.querySelector('#phone_input')
const phoneButton = document.querySelector('#phone_button')
const phoneResult = document.querySelector('#phone_result')

// Формат: +996 XXX XX-XX-XX
const phoneRegex = /^\+996\s\d{3}\s\d{2}-\d{2}-\d{2}$/

phoneButton.onclick = () => {
    const value = phoneInput.value.trim()

    if (value === '') {
        phoneResult.textContent = 'Введите номер телефона'
        phoneResult.style.color = 'orange'
        return
    }

    if (phoneRegex.test(value)) {
        phoneResult.textContent = 'Номер валиден ✅'
        phoneResult.style.color = 'lightgreen'
    } else {
        phoneResult.textContent = 'Номер невалиден ❌ (формат: +996 XXX XX-XX-XX)'
        phoneResult.style.color = 'red'
    }
}


// ================= TAB SLIDER (делегирование событий + classList) =================

const tabItemsBlock = document.querySelector('.tab_content_items')
const tabItems = document.querySelectorAll('.tab_content_item')
const tabBlocks = document.querySelectorAll('.tab_content_block')

// изначально показываем только первый блок, остальные прячем
const showTabBlock = (index) => {
    tabBlocks.forEach((block, i) => {
        block.style.display = i === index ? 'flex' : 'none'
    })
}

showTabBlock(0)

// делегирование событий: один обработчик на родителе вместо
// назначения обработчика каждой кнопке отдельно
tabItemsBlock.addEventListener('click', (event) => {
    const clickedItem = event.target.closest('.tab_content_item')
    if (!clickedItem) return

    const index = Array.from(tabItems).indexOf(clickedItem)

    tabItems.forEach((item) => item.classList.remove('tab_content_item_active'))
    clickedItem.classList.add('tab_content_item_active')

    showTabBlock(index)
})


// ================= CONVERTER (som / usd / eur) =================

const somInput = document.querySelector('#som')
const usdInput = document.querySelector('#usd')
const eurInput = document.querySelector('#eur')

let rates = null // сюда попадут курсы из converter.json

const fetchRates = async () => {
    try {
        const response = await fetch('../converter.json')

        if (!response.ok) {
            throw new Error(`Ошибка загрузки курсов: ${response.status}`)
        }

        rates = await response.json()
    } catch (error) {
        console.log('Не удалось загрузить курсы валют:', error.message)
    }
}

fetchRates()

const clearInputs = (except) => {
    ;[somInput, usdInput, eurInput].forEach((input) => {
        if (input !== except) input.value = ''
    })
}

somInput.oninput = () => {
    if (!rates) return
    const som = parseFloat(somInput.value)
    if (isNaN(som)) return clearInputs(somInput)

    usdInput.value = (som / rates.usd).toFixed(2)
    eurInput.value = (som / rates.eur).toFixed(2)
}

usdInput.oninput = () => {
    if (!rates) return
    const usd = parseFloat(usdInput.value)
    if (isNaN(usd)) return clearInputs(usdInput)

    somInput.value = (usd * rates.usd).toFixed(2)
    eurInput.value = ((usd * rates.usd) / rates.eur).toFixed(2)
}

eurInput.oninput = () => {
    if (!rates) return
    const eur = parseFloat(eurInput.value)
    if (isNaN(eur)) return clearInputs(eurInput)

    somInput.value = (eur * rates.eur).toFixed(2)
    usdInput.value = ((eur * rates.eur) / rates.usd).toFixed(2)
}


// ================= CARD SWITCHER =================

const card = document.querySelector('.card')
const btnPrev = document.querySelector('#btn-prev')
const btnNext = document.querySelector('#btn-next')

const cardsData = [
    { title: 'Совет #1', text: 'let и const почти всегда лучше var' },
    { title: 'Совет #2', text: 'Стрелочные функции не имеют своего this' },
    { title: 'Совет #3', text: 'JSON.stringify превращает объект в строку' },
    { title: 'Совет #4', text: 'Promise.all падает при первой же ошибке' },
    { title: 'Совет #5', text: 'classList.toggle переключает класс туда-обратно' }
]

let cardIndex = 0

const renderCard = () => {
    const { title, text } = cardsData[cardIndex]
    card.innerHTML = `<p>${title}</p><span>${text}</span>`
}

renderCard()

btnNext.onclick = () => {
    cardIndex = cardIndex < cardsData.length - 1 ? cardIndex + 1 : 0
    renderCard()
}

btnPrev.onclick = () => {
    cardIndex = cardIndex > 0 ? cardIndex - 1 : cardsData.length - 1
    renderCard()
}


// ================= WEATHER =================

const cityInput = document.querySelector('.cityName')
const searchButton = document.querySelector('#search')
const cityOutput = document.querySelector('.city')
const tempOutput = document.querySelector('.temp')

// Open-Meteo — бесплатное API без ключа: сначала находим координаты города,
// потом по ним запрашиваем текущую погоду
const fetchWeather = async (cityName) => {
    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=ru`
        )

        if (!geoResponse.ok) {
            throw new Error(`Ошибка геокодинга: ${geoResponse.status}`)
        }

        const geoData = await geoResponse.json()

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Город не найден')
        }

        const { latitude, longitude, name, country } = geoData.results[0]

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        )

        if (!weatherResponse.ok) {
            throw new Error(`Ошибка получения погоды: ${weatherResponse.status}`)
        }

        const weatherData = await weatherResponse.json()

        cityOutput.textContent = `${name}, ${country}`
        tempOutput.textContent = `${weatherData.current_weather.temperature}°C`
    } catch (error) {
        console.log('Ошибка при получении погоды:', error.message)
        cityOutput.textContent = 'Не удалось найти город'
        tempOutput.textContent = ''
    }
}

searchButton.onclick = () => {
    const cityName = cityInput.value.trim()

    if (cityName === '') {
        cityOutput.textContent = 'Введите название города'
        tempOutput.textContent = ''
        return
    }

    fetchWeather(cityName)
}
