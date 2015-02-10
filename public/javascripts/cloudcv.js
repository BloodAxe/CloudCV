/**
 * @author Eugene Zatepyakin / http://inspirit.ru/
 */

window.cloudcv = {
    REVISION: '0.0.1'
};

(function(global) {
    "use strict";

    var BASE_URL = 'http://api.cloudcv.io/v1/';

    var analyze_t = (function () {
        function analyze_t(baseUrl) {

            this.dominantColors = function(image, callback) {
                if (typeof image == 'string') {
                    $.get(baseUrl + 'dominantColors/' + encodeURIComponent(image), function( response ) {
                        callback(null, response);
                    });
                }
                else {
                    var data = new FormData();
                    data['image'] = image;

                    $.post(baseUrl + 'dominantColors/', data, function( response ) {
                        callback(null, response);
                    });
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


    //
    global.image = new image_t(BASE_URL + 'image/');

})(window.cloudcv);