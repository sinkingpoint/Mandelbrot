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

    function setParameters(xmin, xmax, ymin, ymax){
      document.getElementById('xmin').value = xmin;
      document.getElementById('xmax').value = xmax;
      document.getElementById('ymin').value = ymin;
      document.getElementById('ymax').value = ymax;
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

        document.getElementById('variables').onsubmit = function(){
          let xmin = Number(document.getElementById('xmin').value);
          let ymin = Number(document.getElementById('xmax').value);
          let xmax = Number(document.getElementById('ymin').value);
          let ymax = Number(document.getElementById('ymax').value);
          let width = Number(document.getElementById('width').value);
          let height = Number(document.getElementById('height').value);
          let blockSize = Number(document.getElementById('blockSize').value);
          let maxIterations = Number(document.getElementById('maxIterations').value);
          run(xmin, xmax, ymin, ymax, width, height, blockSize, maxIterations)
          return false;
        }

        document.getElementById('elephants').onclick = function(){
            setParameters(0.275, 0.3, 0, 0.025);
        }
    }

    function getSetPixelFunction(x, y, blockWidth, blockHeight, maxIterations){
        return function(data){
            for(let deltaX = 0;deltaX < blockWidth;deltaX ++){
                for(let deltaY = 0;deltaY < blockHeight;deltaY ++){
                    let color = (data.iterations[deltaX * blockWidth + deltaY] / maxIterations) * 255;
                    mandelbrot.pixelData[0] = color
                    mandelbrot.pixelData[1] = color
                    mandelbrot.pixelData[2] = color
                    mandelbrot.pixelData[3] = 255
                    mandelbrot.canvasContext.putImageData(mandelbrot.pixel, x + deltaX, y + deltaY);
                }
            }
        }
    }

    function run(xMin, xMax, yMin, yMax, width, height, blockSize, maxIterations){
        let r1 = linspace(xMin, xMax, width)
        let r2 = linspace(yMin, yMax, height)
        const incX = (xMax - xMin) / width;
        const incY = (yMax - yMin) / width;
        const innerDelay = 50;
        const blockXSize = blockSize;
        const blockYSize = blockSize;
        const numXBlocks = Math.floor(width / blockXSize);
        const numYBlocks = Math.floor(height / blockYSize);
        const outerDelay = innerDelay * numYBlocks * 0.5;

        for(let r = 0;r < numXBlocks;r ++){
            (function(r){
                window.setTimeout(function(){
                    for(let i = 0;i < numYBlocks;i ++){
                        (function(i){
                            window.setTimeout(function(){
                                let result = $.getJSON('http://localhost:5000/mandelbrot/' + r1[r * blockXSize] + '/' + r2[i * blockYSize] + '/' + r1[(r + 1) * blockXSize - 1] + '/' + r2[(i + 1) * blockXSize-1] + '/' + blockXSize + '/' + blockYSize + '/' + maxIterations);
                                result.then(getSetPixelFunction(r * blockXSize, i * blockYSize, blockXSize, blockYSize, maxIterations));
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
