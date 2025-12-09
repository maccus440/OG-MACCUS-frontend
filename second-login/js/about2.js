const slider = document.getElementById("slider");
const cards = slider.querySelectorAll(".card");
const prevBtn = document.querySelector(".btn.prev");
const nextBtn = document.querySelector(".btn.next");

function getScrollAmount() {
const card = cards[0];
const style = getComputedStyle(card)
const cardWidth = card.offsetwidth;
const gap = parseInt(style.marginRight) || 20;
return cardWidth + gap;
}

function updateButton() {
    const maxScollLeft = slider.scrollWidth - slider.clientWidth;
    prevBtn.style.display = slider.scrollLeft > 0 ? 'block' : 'none';
    nextBtn.style.display = slider.scrollLeft < maxScollLeft - 5 ? 'block' : 'none'
}
updateButton()

nextBtn.addEventListener('click', () => {
    slider.scrollLeft += getScrollAmount();
    setTimeout(updateButton, 100)
});

prevBtn.addEventListener('click', () => {
    slider.scrollLeft -= getScrollAmount();
    setTimeout(updateButton, 100)
})