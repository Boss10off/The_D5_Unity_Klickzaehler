const countValueParaElement = document.querySelector('.count-value');
const increaseBtn = document.querySelector('.count-increase-btn') ;
const catSVG = document.querySelector('.cat-svg') ;
let countValue = 0; 

increaseBtn.addEventListener('click', () => {
    const newNumber = document.createElement("span");
    newNumber.textContent = (countValue + 1).toString().padStart(4, '0');
    newNumber.classList.add("show");

    // Add current number and apply the move-up animation
    const currentNumber = countValueParaElement.querySelectorAll("span");
    if (currentNumber) {
        currentNumber.forEach(e => e.classList.add("move-up"));
    }

    // Append the new number and increment count
    countValueParaElement.appendChild(newNumber);
    catSVG.querySelectorAll('.right-leg').forEach(e => e.classList.add("animate-right-leg"))
    countValue++;

    // Clean up old numbers after animation
    setTimeout(() => {
        if (currentNumber) {
            catSVG.querySelectorAll('.right-leg').forEach(e => e.classList.remove("animate-right-leg"))
            currentNumber.forEach(e => {
                e.remove();
            })
        } 
    }, 300);
});
