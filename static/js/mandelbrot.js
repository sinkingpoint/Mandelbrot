(function(mandelbrot){
    function linspace(min, max, n){
        if(n == 0)return [];
        if(n == 1)return [min];
        let result = Array(n);
        let inc = (max - min) / n;
        for(let i = 0;i < n;i ++){
            result[i] = min + i * inc
        }

        return result
    }

    function init(){
        console.log("Initialising Mandelbrot Processor");
        let canvas = document.getElementById('mandelbrot');
        let context = canvas.getContext('2d');
        let pixel = context.createImageData(1, 1);
        let pixelData = pixel.data;

        mandelbrot.canvasContext = context;
        mandelbrot.pixel = pixel;
        mandelbrot.pixelData = pixelData;
    }

    function getSetPixelFunction(x, y, maxIterations){
        return function(data){
            let color = (data.iterations / maxIterations) * 255;
            mandelbrot.pixelData[0] = color
            mandelbrot.pixelData[1] = color
            mandelbrot.pixelData[2] = color
            mandelbrot.pixelData[3] = 255
            mandelbrot.canvasContext.putImageData(mandelbrot.pixel, x, y);
        }
    }

    function run(xMin, xMax, yMin, yMax, width, height, maxIterations){
        let r1 = linspace(xMin, xMax, width)
        let r2 = linspace(yMin, yMax, height)
        const outerDelay = 500;
        const innerDelay = 50;
        for(let r = 0;r < width;r ++){
            (function(r){
                window.setTimeout(function(){
                    for(let i = 0;i < height;i ++){
                        (function(i){
                            window.setTimeout(function(){
                                let result = $.getJSON('http://localhost:5000/mandelbrot/' + r1[r] + '/' + r2[i] + '/' + maxIterations);
                                result.then(getSetPixelFunction(r, i, maxIterations));
                            }, i * innerDelay);
                        })(i);
                    }
                }, r * outerDelay);
            })(r);
        }
    }

    init();
    mandelbrot.run = run;
})(window.mandelbrotJS = window.mandelbrotJS || {});
