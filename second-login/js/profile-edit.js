document.getElementById('change-pic-btn').addEventListener('click', function() {
    document.getElementById('file-input').click(); // Trigger file dialog
});

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result; // Update image
        };
        reader.readAsDataURL(file);
    }
});