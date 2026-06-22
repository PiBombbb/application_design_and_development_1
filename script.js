// 1. Grab the HTML elements and store them in variables
const modal = document.getElementById('simon_anim');
const openButton = document.getElementById('simon_open');
const closeButton = document.getElementById('simon_close');

// 2. Tell the open button to listen for a click and open the modal
openButton.addEventListener('click', () => {
    modal.showModal();
});

// 3. Tell the close button to listen for a click and close the modal
closeButton.addEventListener('click', () => {
    modal.close();
});