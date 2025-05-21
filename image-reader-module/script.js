const imageInput = document.getElementById('image-input');
const uploadButton = document.getElementById('upload-button');
const imagePreview = document.getElementById('image-preview');
const imageTitle = document.getElementById('image-title');
const imageDescription = document.getElementById('image-description');
const copyButton = document.getElementById('copy-button');

uploadButton.addEventListener('click', () => {
  imageInput.click();
});

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const imageData = reader.result;
    imagePreview.style.backgroundImage = `url(${imageData})`;
    // Chamada à API Google Cloud Vision para ler a imagem
    const apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY';
    const requestData = {
      requests: [
        {
          image: {
            content: imageData.split(',')[1],
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10,
            },
          ],
        },
      ],
    };
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
      const labels = data.responses[0].labelAnnotations;
      if (labels && labels.length > 0) {
        imageTitle.textContent = 'Detected Labels:';
        imageDescription.textContent = labels.map(label => label.description).join(', ');
      } else {
        imageTitle.textContent = 'No Labels Detected';
        imageDescription.textContent = '';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  reader.readAsDataURL(file);
});

copyButton.addEventListener('click', () => {
  const textToCopy = imageDescription.textContent;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('Texto copiado para a área de transferência!');
  });
});
