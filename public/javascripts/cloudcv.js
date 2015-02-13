/**
 * @author Eugene Zatepyakin / http://inspirit.ru/
 */

window.cloudcv = {
    REVISION: '0.0.1'
};

(function(global) {
    "use strict";

    var BASE_URL = 'https://cloudcv.io/api/v1/';

    var analyze_t = (function () {
        function analyze_t(baseUrl) {

            this.dominantColors = function(image, callback) {

                if (image instanceof Blob) {

                    var formData = new FormData();
                    formData.append('image', image);

                    $.ajax({
                        url: baseUrl + 'dominantColors/',
                        type: 'POST',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (data)  { callback(null, data); },                        
                        error:   function (error) { callback({message:error.statusText}); }
                    });
                }
                else if (typeof image == 'string') {
                    $.get(baseUrl + 'dominantColors/' + encodeURIComponent(image), function( response ) {
                        callback(null, response);
                    });
                }
                else {
                    callback(new Error('Unsupported type of image argument'));
                }
            };
        }
        return analyze_t;
    })();

    var image_t = (function () {
        function image_t(baseUrl) {
            this.analyze = new analyze_t(baseUrl + 'analyze/');
        }
        return image_t;
    })();

    // Common-used functions:

    /**
     * @brief Decode data-URL and return a Blob object with raw image data.
     *
     * @param dataURL - A string of DataURL format that is decoded and passed to create Blob of correct mime-type.
     */
    function dataURLtoBlob(dataURL)
    {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var comp = dataURL.split(',');

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

        try {
            return new Blob([ab], {type: mimeString});
        } catch (e) {
            // The BlobBuilder API has been deprecated in favour of Blob, but older
            // browsers don't know about the Blob constructor
            // IE10 also supports BlobBuilder, but since the `Blob` constructor
            //  also works, there's no need to add `MSBlobBuilder`.
            var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
            var bb = new BlobBuilder();
            bb.append(ab);
            return bb.getBlob(mimeString);
        }
    }

    /**
     * @brief Encode image and return data-URL that with that information.
     * 
     * @param image Can be instance of HTML Image or HTML Canvas. 
     * @param quality Quality of the encoded image (0.8 by default).
     */
    function getImageDataAsBlob(image) {

        if (image instanceof HTMLImageElement) {

            var canvas = document.createElement('canvas');
            canvas.width  = image.width;
            canvas.height = image.height;
            canvas.getContext("2d").drawImage(image, 0, 0);
            return getImageDataAsBlob(canvas, 1.0);

        } else if (image instanceof HTMLCanvasElement) {

            return dataURLtoBlob(image.toDataURL('image/jpeg', 1.0));

        } else {

            console.error('Unsupported argument type passed to getImageDataURL' + typeof(image));
            return null;
        }
    }

    //
    global.common = {

        getImageDataAsBlob: getImageDataAsBlob,

        bindHookOnFileInput: function(inputId, callback) {
            var input = document.getElementById(inputId);

            if (!input) {
                console.error('Cannot find element with id #' + inputId);
                return false;
            }

            input.addEventListener('change', function(e) {
                
                if (e.target.files.length != 1)
                    return;

                var file = e.target.files[0];
                var url = URL.createObjectURL(file);
                var srcImg = new Image();

                srcImg.onload = function(e) {
                    callback(srcImg, file);

                    if (url) {
                        URL.revokeObjectURL(url);
                        url = null;
                    }
                };
            
                if (url) {
                    srcImg.src = url;
                }
                else {
                    var reader = new FileReader();

                    reader.onload = function (oFREvent) {
                        var dataUrl = oFREvent.target.result;
                        srcImg.src = dataUrl;
                    };

                    reader.readAsDataURL(file);
                }

            });
        }
    };

    global.image = new image_t(BASE_URL + 'image/');

})(window.cloudcv);