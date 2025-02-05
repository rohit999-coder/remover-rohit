const imageInput = document.getElementById('imageInput');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');
const removeBackgroundBtn = document.getElementById('removeBackground');
const downloadBtn = document.getElementById('downloadBtn');

// Replace with your remove.bg API key
const API_KEY = 'tUP4C8N5P5BEMAjNJuiJRfEe';

imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            originalImage.src = event.target.result;
            originalImage.style.display = 'block';
            removeBackgroundBtn.disabled = false;
            processedImage.style.display = 'none';
            downloadBtn.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

removeBackgroundBtn.addEventListener('click', async function() {
    if (!imageInput.files[0]) return;

    const formData = new FormData();
    formData.append('image_file', imageInput.files[0]);

    removeBackgroundBtn.disabled = true;
    removeBackgroundBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    removeBackgroundBtn.classList.add('processing');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to remove background');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        processedImage.src = url;
        processedImage.style.display = 'block';
        downloadBtn.style.display = 'block';

        // Add file size info
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        document.querySelector('.download-size').textContent = `(${sizeMB} MB)`;

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to remove background. Please try again.');
    } finally {
        removeBackgroundBtn.disabled = false;
        removeBackgroundBtn.innerHTML = '<i class="fas fa-eraser"></i> Remove Background';
        removeBackgroundBtn.classList.remove('processing');
    }
});

// Add download functionality
downloadBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(processedImage.src);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'removed-background.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error downloading image:', error);
        alert('Failed to download image. Please try again.');
    }
}); 