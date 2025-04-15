class ImageCarousel 
{
    constructor() 
    {
        this.images = [];
        this.currentIndex = 0;
        this.baseUrl = 'http://localhost:8003';
        
        this.initElements();
        this.bindEvents();
        this.loadImages();
    }
    
    initElements() 
    {
        this.elements = {
            image: document.getElementById('carouselImage'),
            title: document.getElementById('imageTitle'),
            description: document.getElementById('imageDescription'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            thumbsUpBtn: document.getElementById('thumbsUpBtn'),
            thumbsDownBtn: document.getElementById('thumbsDownBtn'),
            thumbsUpCount: document.getElementById('thumbsUpCount'),
            thumbsDownCount: document.getElementById('thumbsDownCount')
        };
    }
    
    bindEvents() 
    {
        this.elements.prevBtn.addEventListener('click', () => this.prevImage());
        this.elements.nextBtn.addEventListener('click', () => this.nextImage());
        this.elements.thumbsUpBtn.addEventListener('click', () => this.vote(1));
        this.elements.thumbsDownBtn.addEventListener('click', () => this.vote(-1));
    }
    
    async loadImages() 
    {
        try 
        {
            const response = await fetch(`${this.baseUrl}/images`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            this.images = data.images || [];
            
            if (this.images.length > 0) 
            {
                this.showCurrentImage();
            }
        } 
        catch (error) 
        {
            console.error('Failed to load images:', error);
            alert('Failed to load images. Please try again later.');
        }
    }
    
    showCurrentImage() 
    {
        const currentImage = this.images[this.currentIndex];
        this.elements.image.src = currentImage.image;
        // this.elements.title.textContent = currentImage.title || 'Untitled';
        this.elements.description.textContent = currentImage.description || '';
        
        // TODO: Load vote counts from your backend
        this.elements.thumbsUpCount.textContent = '0';
        this.elements.thumbsDownCount.textContent = '0';
    }
    
    prevImage() 
    {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showCurrentImage();
    }
    
    nextImage() 
    {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.showCurrentImage();
    }
    
    async vote(value) 
    {
        try 
        {
            const currentImage = this.images[this.currentIndex];
            const response = await fetch(`${this.baseUrl}/vote`, 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    imageId: currentImage.id,
                    value: value
                })
            });
            
            if (!response.ok) throw new Error('Vote failed');
            
            // Update UI immediately (optimistic update)
            if (value === 1) 
            {
                const current = parseInt(this.elements.thumbsUpCount.textContent);
                this.elements.thumbsUpCount.textContent = current + 1;
            } 
            else 
            {
                const current = parseInt(this.elements.thumbsDownCount.textContent);
                this.elements.thumbsDownCount.textContent = current + 1;
            }
        } 
        catch (error) 
        {
            console.error('Vote failed:', error);
            alert('Vote could not be processed. Please try again.');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => 
{
    new ImageCarousel();
});