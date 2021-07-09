(() => {
    const utils = initUtils(); // Used in nested funcs
    drawSparkles(1000, '#make-me-sparkle'); // As many sparkles as you like

    
    /**
     * Define some utility functions.
     * @returns {Object} of utility functions
     */
    function initUtils() {
        const utils = {};

        utils.randomX = () => {
            return Math.floor(Math.random() * window.innerWidth);
        };

        utils.randomY = () => {
            return Math.floor(Math.random() * window.innerHeight);
        };

        utils.randomSize = () => {
            const sizes = [1, 1, 2, 3, 5, 8, 13]; // px (Fibonacci, my heart)
            const i = Math.floor(Math.random() * (sizes.length));
            return sizes[i];
        };

        utils.randomDelay = () => {
            // between 0.5 and 1.5 seconds
            return Math.random() * (1.5 - 0.5 + 1) + 0.5;
        };

        return utils;
   }

    /**
     * Draw animated sparkles to the canvas.
     * @param {number} n - How many sparkles would you like? 
     * @param {CanvasRenderingContext2D} canvasSelector - Where shall I draw them?
     */
    function drawSparkles(n, canvasSelector) {
        // Set up randomizers
        const { randomX, randomY, randomSize, randomDelay } = utils;

        // Set up the canvas
        const canvas = document.querySelector(canvasSelector);
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create and store sparkles
        const sparkles = [];

        for (let i = 0; i < n; i++) {
            // Generate a new sparkle
            const sparkle = {
                x: randomX(),
                y: randomY(),
                r: randomSize(),
                opacity: 0,
            };

            sparkles.push(sparkle);
        }
        
        // Animate sparkles
        sparkles.forEach(sparkle => {
            // Set the animation end state
            gsap.to(sparkle, {
                duration: 2,
                delay: randomDelay(),
                repeat: -1,
                yoyo: true,
                opacity: 1,
            });
            
            // Trigger repaints on each frame
            gsap.ticker.add(() => {
                sparkle.draw = function() { // TODO: there's gotta be a better place to define this
                    const { x, y, r } = sparkle;
                    const halfR = r / 2;

                    ctx.beginPath();
                    ctx.moveTo(x, (y - r)); // top point
                    ctx.bezierCurveTo(x, (y - halfR), (x + halfR), y, (x + r), y); // right point
                    ctx.bezierCurveTo((x + halfR), y, x, (y + halfR), x, (y + r)); // bottom point
                    ctx.bezierCurveTo(x, (y + halfR), (x - halfR), y, (x - r), y); // left point
                    ctx.bezierCurveTo((x - halfR), y, x, (y - halfR), x, (y - r)); // close
                    ctx.closePath();
                };

                const { opacity } = sparkle;
                // Clear the sparkle on each frame
                ctx.fillStyle = `rgba(0, 0, 0, 100)`;
                sparkle.draw();
                ctx.fill();
                
                // Redraw the sparkle on each frame
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                sparkle.draw();
                ctx.fill();

            });
        });
    }
})();
    