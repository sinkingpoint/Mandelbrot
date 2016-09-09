(function(mandelbrot){
    function linspace(min, max, n){
        if(n == 0)return [];
        if(n == 1)return [min];
        let result = Array(n);
        let inc = (max - min) / n;
        for(let i = 0;i < n;i ++){
            result[i] = min + i * inc
        }

        result.push(max)
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
        let ymin = Number(document.getElementById('ymin').value);
        let xmax = Number(document.getElementById('xmax').value);
        let ymax = Number(document.getElementById('ymax').value);
        let width = Number(document.getElementById('width').value);
        let height = Number(document.getElementById('height').value);
        let blockSize = Number(document.getElementById('blockSize').value);
        let maxIterations = Number(document.getElementById('maxIterations').value);
        run(xmin, xmax, ymin, ymax, width, height, blockSize, maxIterations)
        return false;
      }

      let jumps = {
        full: [-2, 0.5, -1.25, 1.25],
        elephants: [0.275, 0.3, 0.001, 0.02],
        tendrils: [-0.235625, -0.234625, 0.826715, 0.827715]
      };

      for(let divName in jumps){
        if(jumps.hasOwnProperty(divName)){
          document.getElementById(divName).onclick = function(){
            let parameterValues = jumps[divName];
            setParameters(parameterValues[0], parameterValues[1], parameterValues[2], parameterValues[3]);
          }
        }
      }
    }

    function getRGB(elementID){
      let colourString = document.getElementById(elementID).value;
      let colourInt = parseInt(colourString.substring(1), 16);
      return [colourInt >> 16 & 0xFF, colourInt >> 8 & 0xFF, colourInt & 0xFF];
    }

    function getSetPixelFunction(x, y, blockWidth, blockHeight, maxIterations){
      return function(data){
        let startRGB = getRGB('startColour');
        let endRGB = getRGB('endColour');
        for(let deltaX = 0;deltaX < blockWidth;deltaX ++){
            for(let deltaY = 0;deltaY < blockHeight;deltaY ++){
                let colourPCent = (data.iterations[deltaX * blockWidth + deltaY] / maxIterations);
                mandelbrot.pixelData[0] = startRGB[0] * colourPCent + (1 - colourPCent) * endRGB[0]
                mandelbrot.pixelData[1] = startRGB[1] * colourPCent + (1 - colourPCent) * endRGB[1]
                mandelbrot.pixelData[2] = startRGB[2] * colourPCent + (1 - colourPCent) * endRGB[2]
                mandelbrot.pixelData[3] = 255
                mandelbrot.canvasContext.putImageData(mandelbrot.pixel, x + deltaX, y + deltaY);
            }
        }
      }
    }

    function run(xMin, xMax, yMin, yMax, width, height, blockSize, maxIterations){
      let r1 = linspace(xMin, xMax, width);
      let r2 = linspace(yMin, yMax, height);
      const numXBlocks = Math.floor(width / blockSize);
      const numYBlocks = Math.floor(height / blockSize);

      const innerDelay = 50;
      const outerDelay = innerDelay * numYBlocks * 0.5;

      for(let r = 0;r < numXBlocks;r ++){
        (function(r){
          window.setTimeout(function(){
            for(let i = 0;i < numYBlocks;i ++){
              (function(i){
                window.setTimeout(function(){
                  let startX = r1[r * blockSize];
                  let startY = r2[i * blockSize];
                  let endX = r1[(r + 1) * blockSize];
                  let endY = r2[(i + 1) * blockSize];
                  let result = $.getJSON('http://' + window.location.host + '/mandelbrot/' + startX + '/' + endX + '/' + startY + '/' + endY + '/' + blockSize + '/' + blockSize + '/' + maxIterations);
                  result.then(getSetPixelFunction(r * blockSize, i * blockSize, blockSize, blockSize, maxIterations));
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
