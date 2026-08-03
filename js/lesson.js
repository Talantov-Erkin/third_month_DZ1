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

let currentTabIndex = 0 // храним текущий активный таб, чтобы автослайдер знал, откуда продолжать

// изначально показываем только первый блок, остальные прячем
const showTabBlock = (index) => {
    tabBlocks.forEach((block, i) => {
        block.style.display = i === index ? 'flex' : 'none'
    })

    tabItems.forEach((item, i) => {
        item.classList.toggle('tab_content_item_active', i === index)
    })

    currentTabIndex = index
}

showTabBlock(0)

// делегирование событий: один обработчик на родителе вместо
// назначения обработчика каждой кнопке отдельно
tabItemsBlock.addEventListener('click', (event) => {
    const clickedItem = event.target.closest('.tab_content_item')
    if (!clickedItem) return

    const index = Array.from(tabItems).indexOf(clickedItem)
    showTabBlock(index)
})

// автоматическое переключение на следующий таб каждые 4 секунды
setInterval(() => {
    const nextIndex = currentTabIndex < tabItems.length - 1 ? currentTabIndex + 1 : 0
    showTabBlock(nextIndex)
}, 4000)


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

const TOTAL_POSTS = 100 // всего постов на jsonplaceholder — id от 1 до 100
let postId = 1

const renderCard = (content) => {
    card.innerHTML = content
}

const fetchPost = async (id) => {
    renderCard('<p>Загрузка...</p>')

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`)
        }

        const post = await response.json()
        renderCard(`<p>Пост #${post.id}</p><span>${post.title}</span>`)
    } catch (error) {
        console.log('Не удалось загрузить пост:', error.message)
        renderCard('<p style="color: red;">Не удалось загрузить пост</p>')
    }
}

fetchPost(postId)

btnNext.onclick = () => {
    postId = postId < TOTAL_POSTS ? postId + 1 : 1
    fetchPost(postId)
}

btnPrev.onclick = () => {
    postId = postId > 1 ? postId - 1 : TOTAL_POSTS
    fetchPost(postId)
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
