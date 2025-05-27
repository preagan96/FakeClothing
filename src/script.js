const images = [
    "../public/product1.png",
    "../public/product2.png",
    "../public/product3.png",
    "../public/product4.png"
];

let currentIndex = 0;
const rotatingImage = document.getElementById("rotating-image");

function rotateImage() {
    currentIndex = (currentIndex + 1) % images.length;
    rotatingImage.src = images[currentIndex];
}

setInterval(rotateImage, 10000);