document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var formData = new FormData(this);

    // Simulate form submission for demonstration purposes
    // In a real scenario, you would send this data to your backend server
    // Replace this with your actual endpoint for form submission
    fetch('https://jsonplaceholder.typicode.com/posts', { 
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Display a success message
        document.getElementById('response').innerHTML = "<p>Form submitted successfully!</p>";
        // Clear the form fields
        document.getElementById('contact-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        // Display an error message if submission fails
        document.getElementById('response').innerHTML = "<p>Submission failed. Please try again later.</p>";
    });
});