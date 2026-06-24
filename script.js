const modal_gif = document.getElementById('heolstor_gif');
const modal_webp = document.getElementById('heolstor_webp');
const modal_avif = document.getElementById('heolstor_avif');
const modal_simon = document.getElementById('simon_anim');
const open_button_gif = document.getElementById('gif_open');
const close_button_gif = document.getElementById('gif_close');
const open_button_webp = document.getElementById('webp_open');
const close_button_webp = document.getElementById('webp_close');
const open_button_avif = document.getElementById('avif_open');
const close_button_avif = document.getElementById('avif_close');
const open_button_simon = document.getElementById('simon_open');
const close_button_simon = document.getElementById('simon_close');
open_button_gif.addEventListener('click', () => {
    modal_gif.showModal();
});
close_button_gif.addEventListener('click', () => {
    modal_gif.close();
});
open_button_webp.addEventListener('click', () => {
    modal_webp.showModal();
});
close_button_webp.addEventListener('click', () => {
    modal_webp.close();
});
open_button_avif.addEventListener('click', () => {
    modal_avif.showModal();
});
close_button_avif.addEventListener('click', () => {
    modal_avif.close();
});
open_button_simon.addEventListener('click', () => {
    modal_simon.showModal();
});
close_button_simon.addEventListener('click', () => {
    modal_simon.close();
});
