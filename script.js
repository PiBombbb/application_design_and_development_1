// 1. Grab the HTML elements and store them in variables
const modal = document.getElementById('simon_anim');
const open_button = document.getElementById('simon_open');
const close_button = document.getElementById('simon_close');
open_button.addEventListener('click', () => {
    modal.showModal();
});

close_button.addEventListener('click', () => {
    modal.close();
});
