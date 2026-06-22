// 1. Grab the HTML elements and store them in variables
const modal = document.getElementById('simon_anim');
const openButton = document.getElementById('simon_open');
const closeButton = document.getElementById('simon_close');
const fetchNasaBtn = document.getElementById('fetchNasaBtn');
const nasa_display = document.getElementById('nasa_display');


// 2. Tell the open button to listen for a click and open the modal
openButton.addEventListener('click', () => {
    modal.showModal();
});

// 3. Tell the close button to listen for a click and close the modal
closeButton.addEventListener('click', () => {
    modal.close();
});
fetchNasaBtn.addEventListener('click', () => {
    const minLat = document.getElementById('minLat').value;
    const minLon = document.getElementById('minLon').value;
    const maxLat = document.getElementById('maxLat').value;
    const maxLon = document.getElementById('maxLon').value;

    const final_image_url = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?BBOX=${minLat},${minLon},${maxLat},${maxLon}&REQUEST=GetMap&FORMAT=image/jpeg&VERSION=1.3.0&LAYERS=BlueMarble_ShadedRelief_Bathymetry&WIDTH=600&HEIGHT=300&CRS=EPSG:4326`;

    nasa_display.src = final_image_url;
    nasa_display.style.display = "block";
});