/*
 * Back-end logic
 */

exports.analysis = function(req, res)
{
    res.render('demo-analysis',
    {
        "example":  { "availableImages": [
            "/images/lena.png",
            "/images/mandrill.png",
            "/images/sudoku.png",
            "/images/kid.jpg"
        ] } 
    });
};
