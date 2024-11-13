const countValueParaElement = document.querySelector('.count-value');
const increaseBtn = document.querySelector('.count-increase-btn') ;
let countValue = 0; 

increaseBtn.addEventListener('click', () => {
    countValue++;
    countValueParaElement.textContent = countValue.toString().padStart(4, '0'); 
});