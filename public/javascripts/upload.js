$(document).ready(function() {
 
    status('Choose a file :)');
 
    // Check to see when a user has selected a file                                                                                                                
    var timerId;
    timerId = setInterval(function() {
	if($('#userPhotoInput').val() !== '') {
            clearInterval(timerId);
 
            $('#uploadForm').submit();
        }
    }, 500);
 
    $('#uploadForm').submit(function() {
        status('uploading the file ...');
 
        $(this).ajaxSubmit({                                                                                                                 
 
            error: function(xhr) {
		status('Error: ' + xhr.status);
            },
 
            success: function(response) {
		//TODO: We will fill this in later
            }
	});
 
	// Have to stop the form from submitting and causing                                                                                                       
	// a page refresh - don't forget this                                                                                                                      
	return false;
    });
 
    function status(message) {
	$('#status').text(message);
    }
});