(function ($) 
{
	// === CONFIG ===
	const baseUrl = 'http://localhost:8003';
	let images = [];
	let currentIndex = 0;

	// === DOM REFERENCES ===
	const $image = $('#carousel-image');
	const $description = $('#image-desc');
	const $thumbsUp = $('#thumbsUpBtn');
	const $thumbsDown = $('#thumbsDownBtn');
	const $upCount = $('#thumbsUpCount');
	const $downCount = $('#thumbsDownCount');
	const $prev = $('#prev-button');
	const $next = $('#next-button');

	// === DISPLAY CURRENT IMAGE ===
	function showImage() 
    {
		const img = images[currentIndex];
		$image.attr('src', img.image);
		$description.text(img.description || '');
		$upCount.text(img.upvotes || 0);
		$downCount.text(img.downvotes || 0);
	}

	// === FETCH IMAGES FROM BACKEND ===
	function loadImages() 
    {
		$.get(`${baseUrl}/images`)
			.done((data) => 
            {
				images = data.images || [];
				if (images.length > 0) 
                {
					showImage();
				}
			})
			.fail(() => 
            {
				alert('Failed to load images');
			});
	}

	// === HANDLE VOTING ===
	function vote(type) 
    {
		const img = images[currentIndex];
		$.ajax({
			url: `${baseUrl}/vote`,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				imageId: img.id,
				vote: type
			}),
			success: function (res) 
            {
				$upCount.text(res.upvotes);
				$downCount.text(res.downvotes);
			},
			error: function () 
            {
				alert('Vote failed');
			}
		});
	}

	// === IMAGE NAVIGATION ===
	function nextImage() 
    {
		currentIndex = (currentIndex + 1) % images.length;
		showImage();
	}
	function prevImage() 
    {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		showImage();
	}

	// === INIT ===
	$(document).ready(function () 
    {
		loadImages();
		$thumbsUp.on('click', () => vote('up'));
		$thumbsDown.on('click', () => vote('down'));
		$next.on('click', nextImage);
		$prev.on('click', prevImage);
	});
})(jQuery);
