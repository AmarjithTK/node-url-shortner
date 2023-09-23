document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('shorten-form');
    const longUrlInput = document.getElementById('longUrl');
    const card = document.getElementById('shortened-url');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get the long URL input value
        const longUrl = longUrlInput.value;

    console.log(longUrl)
        // Send a POST request to your server to shorten the URL
        fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ longUrl }),
        })
        .then((response) => response.json())
        .then((data) => {
            // Display the shortened URL in the card
            card.textContent = data.shortUrl;
            card.style.display = 'block';

            // Reset the input form
            longUrlInput.value = '';
        })
        .catch((error) => {
            console.error(error);
        });
    });
});

