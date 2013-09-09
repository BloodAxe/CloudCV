// Face global object that we will use to connect events
var CV = {};

function getImageDim(image)
{
    var result = {};
    document.body.appendChild(image);
    result['width'] = image.offsetWidth;
    result['height'] = image.offsetHeight;
    document.body.removeChild(image);
    return result;
}

function loadRemoteFile(file, imageReadyCallback)
{
    var image = new Image();
    image.onload = function ()
    {
        $(CV).trigger("imageSelected", image);
    }
    image.src = file;
}

function loadImageFile(file, imageReadyCallback)
{
    console.log("loadImageFile(%s)", file);
    
    var reader = new FileReader();
    reader.onload = function (e)
    {
        var image = new Image();
        image.onload = function ()
        {
            imageReadyCallback(image);
        }
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function imageSelected(image)
{
    var drawingCanvas = document.getElementById("file-preview");
    var context       = drawingCanvas.getContext('2d');
    context.drawImage(image, 0, 0, drawingCanvas.width, drawingCanvas.height);

    $(CV).trigger("imageSelected", image);
}


window.onload = function()
{
    document.getElementById("file-selector").addEventListener("change", function (e)
    {
        var files = this.files;
        if (files.length)
        {
            loadImageFile(files[0], imageSelected);
        }
    });

}