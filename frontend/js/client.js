// client.js - Properly formatted version
class GooseClient
{
    static BASE_URL = 'http://localhost:8003';
    static MAX_RETRIES = 3;
    static RETRY_DELAY = 1000;

    constructor()
    {
        this.cache = new Map();
    }

    async fetchImages(options = {})
    {
        const
        {
            retryCount = 0,
            bypassCache = false,
            timeout = 5000
        } = options;

        const cacheKey = 'images';
        if (!bypassCache && this.cache.has(cacheKey))
        {
            return this.cache.get(cacheKey);
        }

        try
        {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${GooseClient.BASE_URL}/images`,
            {
                signal: controller.signal,
                headers:
                {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.images)
            {
                this.cache.set(cacheKey, data.images);
                return data.images;
            }
            else
            {
                console.warn('No images found:', data.message || 'Unknown error');
                return [];
            }
        }
        catch (error)
        {
            console.error(`Attempt ${retryCount + 1} failed:`, error.message);

            if (retryCount < GooseClient.MAX_RETRIES)
            {
                await new Promise(resolve => setTimeout(resolve, GooseClient.RETRY_DELAY));
                return this.fetchImages({ ...options, retryCount: retryCount + 1 });
            }

            throw new Error(`Failed after ${GooseClient.MAX_RETRIES} retries`);
        }
    }

    async getImagesWithUI()
    {
        try
        {
            const loadingIndicator = document.getElementById('loading');
            loadingIndicator.style.display = 'block';

            const images = await this.fetchImages();
            this.renderImages(images);
        }
        catch (error)
        {
            console.error('Image load failed:', error);
            this.showError(error.message);
        }
        finally
        {
            loadingIndicator.style.display = 'none';
        }
    }

    renderImages(images)
    {
        const container = document.getElementById('image-container');
        container.innerHTML = images.map(img => `
            <div class="image-card">
                <img src="${img.url}" alt="${img.title || 'Image'}">
                <p>${img.description || ''}</p>
            </div>
        `).join('');
    }

    showError(message)
    {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = `Error: ${message}`;
        errorElement.style.display = 'block';
    }
}

// Initialize client
const gooseClient = new GooseClient();
window.gooseClient = gooseClient;

// Auto-init if loaded as module
if (import.meta.url)
{
    document.addEventListener('DOMContentLoaded', () =>
    {
        gooseClient.getImagesWithUI();
    });
}