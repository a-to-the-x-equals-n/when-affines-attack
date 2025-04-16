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
        this.elements.thumbsUpBtn.addEventListener('click', () => this.vote('up'));
        this.elements.thumbsDownBtn.addEventListener('click', () => this.vote('down'));
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
        this.elements.description.textContent = currentImage.description || '';
        
        // Initialize vote counts
        this.elements.thumbsUpCount.textContent = currentImage.upvotes || '0';
        this.elements.thumbsDownCount.textContent = currentImage.downvotes || '0';
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
    
    async vote(voteType) 
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
                    vote: voteType  // Changed from 'value' to 'vote'
                })
            });
            
            const result = await response.json();
            
            if (!response.ok) 
            {
                throw new Error(result.error || 'Vote failed');
            }
            
            // Update UI with server response
            this.elements.thumbsUpCount.textContent = result.upvotes;
            this.elements.thumbsDownCount.textContent = result.downvotes;
        } 
        catch (error) 
        {
            console.error('Vote failed:', error);
            alert(`Vote error: ${error.message}`);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => 
{
    new ImageCarousel();
});