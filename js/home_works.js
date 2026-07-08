
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
const childWidth = childBlock.clientWidth
const step = 5
const maxLeft = parentWidth - childWidth
 

const moveChildBlock = (position = 0) => {
    const clampedPosition = Math.min(position, maxLeft)
    childBlock.style.left = `${clampedPosition}px`
    if (clampedPosition < maxLeft) {
        setTimeout(() => moveChildBlock(position + step), 20)
    }
}
 
moveChildBlock()