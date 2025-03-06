$(document).ready(function() {
    $('#productForm').on('submit', function(e) {
        e.preventDefault();
        
        // Create FormData object to handle file upload
        let formData = new FormData(this);
        
        $.ajax({
            url: 'upload.php',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                let result = JSON.parse(response);
                if(result.status === 'success') {
                    alert('Product added successfully!');
                    $('#productForm')[0].reset();
                } else {
                    alert('Error: ' + result.message);
                }
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    });
});