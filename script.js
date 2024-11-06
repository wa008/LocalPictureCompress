const imageInput = document.getElementById('imageInput');
const originalImage = document.getElementById('originalImg');
const compressedImage = document.getElementById('compressedImg');

// Access the sliders once and not on every event call
const sizeSlider = document.getElementById('sizeSlider');
const widthSlider = document.getElementById('widthSlider');
const heightSlider = document.getElementById('heightSlider');

// Update slider values dynamically
sizeSlider.addEventListener('mouseup', function() {
    photoCompress();
});

// Update height slider values dynamically
heightSlider.addEventListener('mouseup', function() {
    photoCompress();
});

// Update width slider values dynamically
widthSlider.addEventListener('mouseup', function() {
    photoCompress();
});


// Function to handle image upload
function handleImageUpload(event) {
    photoCompress();
}

function resetValues() {
    sizeSlider.value = 50; // Reset size slider value to default
    widthSlider.value = 50; // Reset width slider value to default
    heightSlider.value = 50; // Reset height slider value to default
    photoCompress(); // Call the photoCompress function to update the compressed image
}

function photoCompress() {
    originalImage.style.display = 'block';
    compressedImage.style.display = 'block';
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // e.target.result: 
            // data:image/jpeg;base64,/9j/4bzzRXhpZgAASUkqAAgAAAAMAA4BAgAgAAAAngAAAA8BAgAFAAAAvgAAABABAgAKAAAAxAAAABIBAwABAAAAAQAAABoBBQABAAAAzgAAABsBBQABAAAA1gAAACgBAwABAAAAAgAAADEBAgAQAAAA3gAAADIBAgAUAAAA7gAAABMCAwABAAAAAgAAAGmHBAABAAAAbAEAAKXEB.......(show more 8.1M)
            // console.log(e.target.result)
            console.log( e.target.result.length);
            originalImage.src = e.target.result; // Set the image source

            originalImage.onload = function() {
                const sizeRatio = sizeSlider.value / 100; // Get the size ratio
                const widthRatio = widthSlider.value / 100; // Get the width ratio
                const heightRatio = heightSlider.value / 100; // Get the height ratio

                const byteCharacters = atob(e.target.result.split(',')[1]);
                // console.log(byteCharacters.length);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                   byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                // 6062080, 5920k
                // 38110, 37.2k
                // console.log(byteArray)
                const blob = new Blob([byteArray], { type: 'image/jpeg' });
                
                // Convert canvas to ImageBitmap
                createImageBitmap(blob).then((bitmap) => {
                    // Draw the bitmap onto a new canvas for compression
                    const compressedCanvas = document.createElement('canvas');
                    const compressedCtx = compressedCanvas.getContext('2d');
                    const width = originalImage.naturalWidth * widthRatio;
                    const height = originalImage.naturalHeight * heightRatio;
                    compressedCanvas.width = width;
                    compressedCanvas.height = height;
                    compressedCtx.drawImage(bitmap, 0, 0, width, height);

                    // Get the compressed image data as a data URL
                    console.log('sizeRatio: ', sizeRatio)
                    const compressedData = compressedCanvas.toDataURL('image/jpeg', sizeRatio);
                    // console.log(compressedData)
                    compressedImage.src = compressedData; // Set the compressed image source
                    compressedImage.width = 500 * Math.min(widthRatio, height);
                    // compressedImage.height = "500";
                });
            }
        };
        reader.readAsDataURL(imageInput.files[0]); // Read the file as data URL
    } else {
        console.error("Please select an image file."); // Error if no file selected
    }
}

function displayImageProperties(imgId, propertiesDivId) {
    const img = document.getElementById(imgId);
    const propertiesDiv = document.getElementById(propertiesDivId);

    const base64Data = img.src.split(",")[1];
    const base64Length = base64Data.length;

    const sizeInBytes = (base64Length * 3) / 4 - (base64Data.endsWith("==") ? 2 : base64Data.endsWith("=") ? 1 : 0);
    const sizeInKB = sizeInBytes / 1024;
    const size = sizeInKB > 1024 ? (sizeInKB / 1024).toFixed(1) + ' MB' : sizeInKB.toFixed(1) + ' KB';

    const widthInPixels = img.naturalWidth;
    const heightInPixels = img.naturalHeight;
    let resolution = widthInPixels * heightInPixels;

    propertiesDiv.innerHTML = `
      <p><strong>Size:</strong> ${size}</p>
      <p><strong>Resolution:</strong> ${resolution} pixels</p>
      <p><strong>Width:</strong> ${widthInPixels} px</p>
      <p><strong>Height:</strong> ${heightInPixels} px</p>
    `;
}



function downloadImage() {
    // Get the compressed image URL
    const compressedImageUrl = document.getElementById('compressedImg').src;

    // Create a link element and set its attributes
    const link = document.createElement('a');
    link.href = compressedImageUrl;
    link.download = 'compressed_image.jpg'; // Set the desired filename

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Call the function when images load (assuming they are loaded dynamically)
const compressedImg = document.getElementById('compressedImg');
compressedImg.onload = () => {
    displayImageProperties('originalImg', 'originalProperties');
    displayImageProperties('compressedImg', 'compressedProperties');
};
