// ================= ПОЛУЧЕНИЕ И РЕНДЕР ПОСТОВ =================

const postsList = document.querySelector('.posts-list')

// у всех карточек одна и та же картинка-заглушка
const CARD_IMAGE = 'https://picsum.photos/id/1015/400/250'

const renderPosts = (posts) => {
    postsList.innerHTML = posts
        .map(
            (post) => `
                <div class="post-card">
                    <div class="post-photo">
                        <img src="${CARD_IMAGE}" alt="${post.title}">
                    </div>
                    <h4>${post.title}</h4>
                    <p>${post.body}</p>
                </div>
            `
        )
        .join('')
}

const fetchPosts = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`)
        }

        const posts = await response.json()
        renderPosts(posts)
    } catch (error) {
        console.log('Не удалось загрузить посты:', error.message)
        postsList.innerHTML = '<p style="color: red;">Не удалось загрузить посты</p>'
    }
}

fetchPosts()
