document.addEventListener('DOMContentLoaded', () =>
    {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const previewArea = document.getElementById('previewArea');
    
        // trigger file input on click
        dropZone.addEventListener('click', () => fileInput.click());
    
        // handle dropped files
        dropZone.addEventListener('dragover', e =>
        {
            e.preventDefault();
            dropZone.classList.add('drag-hover');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-hover'));
    
        dropZone.addEventListener('drop', e =>
        {
            e.preventDefault();
            dropZone.classList.remove('drag-hover');
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        });
    
        // handle input change
        fileInput.addEventListener('change', e =>
        {
            const file = e.target.files[0];
            if (file) handleFile(file);
        });
    
        function handleFile(file)
        {
            if (!file.type.startsWith('image/')) return;
    
            const reader = new FileReader();
            reader.onload = e =>
            {
                previewArea.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" />`;
    
                // submit to server (optional)
                uploadToServer(file);
            };
            reader.readAsDataURL(file);
        }
    
        function uploadToServer(file)
        {
            const formData = new FormData();
            formData.append('image', file);
    
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(res => res.ok ? console.log('Upload complete') : console.warn('Upload failed'))
            .catch(err => console.error(err));
        }
    });
    