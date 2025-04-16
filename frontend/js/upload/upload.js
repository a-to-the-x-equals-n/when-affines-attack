// ======================
// === UPLOAD HANDLER ===
// ======================
class UploadModal 
{
    constructor() 
    {
        try 
        {
            console.log('[UploadModal] Initializing...');
            
            this.files = [];
            
            // Cache elements
            this.elements = {
                dropZone: document.getElementById('dropZone'),
                fileInput: document.getElementById('fileInput'),
                previewArea: document.getElementById('previewArea'),
                uploadBtn: document.getElementById('uploadBtn'),
                uploadControls: document.getElementById('uploadControls'),
                statusMessage: document.getElementById('statusMessage')
            };
            
            // Debug log elements
            console.log('[UploadModal] Elements:', this.elements);
            
            // Validate critical elements
            if (!this.elements.dropZone || !this.elements.fileInput) 
            {
                throw new Error('Missing required elements (dropZone or fileInput)');
            }
            
            this.bindEvents();
            console.log('[UploadModal] Initialized successfully');
        } 
        catch (error) 
        {
            console.error('[UploadModal] Initialization failed:', error);
            throw error;
        }
    }

    // === EVENT BINDING ===
    bindEvents() 
    {
        // Drag events
        this.elements.dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        this.elements.dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.elements.dropZone.addEventListener('drop', this.handleDrop.bind(this));
        
        // Click events
        this.elements.dropZone.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.fileInput.addEventListener('change', () => this.handleFiles(this.elements.fileInput.files));
        
        // Upload button
        if (this.elements.uploadBtn) 
        {
            this.elements.uploadBtn.addEventListener('click', this.uploadFiles.bind(this));
        }
    }

    // === DRAG HANDLERS ===
    handleDragOver(e) 
    {
        e.preventDefault();
        this.elements.dropZone.classList.add('active');
    }

    handleDragLeave() 
    {
        this.elements.dropZone.classList.remove('active');
    }

    handleDrop(e) 
    {
        e.preventDefault();
        this.elements.dropZone.classList.remove('active');
        this.handleFiles(e.dataTransfer.files);
    }

    // === FILE PROCESSING ===
    handleFiles(files) 
    {
        if (!files || files.length === 0) return;
        
        const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
        let addedFiles = 0;
        
        Array.from(files).forEach(file => 
        {
            if (!validTypes.includes(file.type)) 
            {
                this.showStatus(`Skipped ${file.name}: Invalid file type`, 'error');
                return;
            }
            
            if (!this.isDuplicate(file)) 
            {
                this.files.push(file);
                addedFiles++;
            }
        });
        
        if (addedFiles > 0) 
        {
            this.updateUI();
            this.showStatus(`Added ${addedFiles} file(s)`, 'success');
        }
    }

    isDuplicate(file) 
    {
        return this.files.some(f => 
            f.name === file.name && 
            f.size === file.size &&
            f.lastModified === file.lastModified
        );
    }

    // === UI UPDATES ===
    updateUI() 
    {
        this.renderPreviews();
        
        if (this.elements.uploadBtn) 
        {
            this.elements.uploadBtn.disabled = this.files.length === 0;
        }
        
        if (this.elements.uploadControls) 
        {
            this.elements.uploadControls.classList.remove('hidden');
        }
    }

    renderPreviews() 
    {
        if (!this.elements.previewArea) return;
        
        this.elements.previewArea.innerHTML = '';
        
        this.files.forEach((file, index) => 
        {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-item';
            
            previewItem.innerHTML = `
                <img src="${URL.createObjectURL(file)}" alt="Preview">
                <div class="file-info">
                    <span>${file.name}</span>
                    <span>${this.formatFileSize(file.size)}</span>
                </div>
                <button class="brutal-button small-btn" data-index="${index}">X</button>
            `;
            
            previewItem.querySelector('button').addEventListener('click', (e) => 
            {
                this.files.splice(e.target.dataset.index, 1);
                this.updateUI();
                this.showStatus('File removed', 'info');
            });
            
            this.elements.previewArea.appendChild(previewItem);
        });
    }

    // === FILE UPLOAD ===
    async uploadFiles() 
    {
        if (this.files.length === 0) return;
        
        this.setUploadState(true);
        this.showStatus('Uploading files...', 'info');
        
        try 
        {
            const formData = new FormData();
            this.files.forEach(file => formData.append('images', file));
            
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) 
            {
                throw new Error(await response.text());
            }
            
            this.showStatus('Upload successful!', 'success');
            this.resetUploader();
        } 
        catch (error) 
        {
            console.error('Upload failed:', error);
            this.showStatus(`Upload failed: ${error.message}`, 'error');
        } 
        finally 
        {
            this.setUploadState(false);
        }
    }

    // === HELPER METHODS ===
    setUploadState(isUploading) 
    {
        if (this.elements.uploadBtn) 
        {
            this.elements.uploadBtn.disabled = isUploading;
            this.elements.uploadBtn.textContent = isUploading ? 'Uploading...' : 'Upload';
        }
    }

    resetUploader() 
    {
        this.files = [];
        this.updateUI();
        
        if (this.elements.uploadControls) 
        {
            this.elements.uploadControls.classList.add('hidden');
        }
    }

    showStatus(message, type) 
    {
        if (!this.elements.statusMessage) return;
        
        this.elements.statusMessage.textContent = message;
        this.elements.statusMessage.className = `status-message ${type}`;
        this.elements.statusMessage.classList.remove('hidden');
        
        setTimeout(() => {
            this.elements.statusMessage.classList.add('hidden');
        }, 5000);
    }

    formatFileSize(bytes) 
    {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => 
{
    try 
    {
        console.log('[Main] Initializing upload modal...');
        window.uploadModal = new UploadModal();
        console.log('[Main] Upload modal ready');
    } 
    catch (error) 
    {
        console.error('[Main] Initialization failed:', error);
        
        // Fallback error display
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '0';
        errorDiv.style.left = '0';
        errorDiv.style.right = '0';
        errorDiv.style.padding = '1rem';
        errorDiv.style.background = '#c00';
        errorDiv.style.color = 'white';
        errorDiv.style.zIndex = '9999';
        errorDiv.style.textAlign = 'center';
        errorDiv.innerHTML = `
            <strong>Upload Error</strong>
            <p>${error.message}</p>
            <button onclick="location.reload()" 
                    style="margin-top: 0.5rem; padding: 0.25rem 0.5rem;">
                Refresh Page
            </button>
        `;
        
        document.body.appendChild(errorDiv);
    }
});