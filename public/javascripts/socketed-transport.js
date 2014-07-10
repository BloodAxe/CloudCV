;(function (window, document) {
    'use strict';
    
    window.VideoCapture = function(elements, success, error) {
        
        // Define our error message
        function sendError(message) {
            if (error) {
                var e = new Error();
                e.message = message;
                error(e);
            } else {
                console.error(message);
            }
        }
        
        // Try to play the media stream
        function play() {
            var video = document.getElementById(elements.video);
            if (!video) {
                sendError('Unable to find the video element.');
                return;
            }

            function successCallback(stream) {
                // Set the source of the video element with the stream from the camera
                if (video.mozSrcObject !== undefined) {
                    video.mozSrcObject = stream;
                } else {
                    video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                }
                video.play();
            }

            function errorCallback(error) {
                sendError('Unable to get webcam stream.');
            }

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

            // Call the getUserMedia method with our callback functions
            if (navigator.getUserMedia) {
                navigator.getUserMedia({video: true}, successCallback, errorCallback);
            } else {
                sendError('Native web camera streaming (getUserMedia) not supported in this browser.');
            }
            
            // Check the video dimensions when data has loaded
            video.addEventListener('loadeddata', function() {
                var attempts = 10;
                
                function checkVideo() {
                    if (attempts > 0) {
                        if (video.videoWidth > 0 && video.videoHeight > 0) {
                            // Execute success callback function
                            if (success) success(video);
                        } else {
                            // Wait a bit and try again
                            window.setTimeout(checkVideo, 500);
                        }
                    } else {
                        // Give up after 10 attempts
                        sendError('Unable to play video stream. Is webcam working?');
                    }
                    attempts--;
                }
                
                checkVideo();
            }, false);
        }

        return {
            play: play
        };
    };
})(window, document);


function dataURItoBlob(dataURI)
{
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var comp = dataURI.split(',');

    var byteString = window.atob(comp[1]);

    // separate out the mime component
    var mimeString = comp[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    var i;

    for (i = 0; i < byteString.length; i++)
    {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}

function setupCapture_canvas(video, socket, dataReady) {

    var interval  = 30;
    var canvas    = document.createElement("canvas");
    
    canvas.width  = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    console.log("Created canvas of size " + canvas.width + ";" + canvas.height);

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); 
    var dataUrl = canvas.toDataURL("image/jpeg");
    socket.emit('frame', dataUrl);
    
    socket.on('nextFrame', function(data) {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); 
        var dataUrl = canvas.toDataURL("image/jpeg");
        socket.emit('frame', dataUrl);            
    });

    socket.on('result', function (data) {
        $("#faces").attr('src', data.color.histogramImage);     
        $("#dominantColorsImage").attr('src', data.color.dominantColorsImage);     

    });
}