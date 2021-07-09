(() => {
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
     * Identify the canvas element, set its resolution according to viewport size,
     * and return its 2D context.
     * 
     * @param {String} canvasSelector - canvas element to fill with sparkles
     * @returns {CanvasRenderingContext2D}
     */
    function getCanvasContext(canvasSelector) {
        const canvas = document.querySelector(canvasSelector);
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        return ctx;
    }

    /**
     * Define sparkle-relevant funcs and get sparklin'.
     * @param {CanvasRenderingContext2D} ctx - where to draw the sparkles
     */
    function initSparkles(ctx) {
        /**
         * Draw a single sparkle based on a given center point and radius.
         * 
         * @param {number} x - center point from left (px)
         * @param {number} y - center point from top (px)
         * @param {number} r - sparkle radius (px)
         */
        function drawSparkle(x, y, r) {
            const halfR = r / 2;
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(x, (y - r)); // top point
            ctx.bezierCurveTo(x, (y - halfR), (x + halfR), y, (x + r), y); // right point
            ctx.bezierCurveTo((x + halfR), y, x, (y + halfR), x, (y + r)); // bottom point
            ctx.bezierCurveTo(x, (y + halfR), (x - halfR), y, (x - r), y); // left point
            ctx.bezierCurveTo((x - halfR), y, x, (y - halfR), x, (y - r)); // close
            ctx.fill();
        }

        /**
         * Draw on the <canvas> until we have enough sparkles.
         * (though one can never truly have enough sparkles).
         * 
         * @param {number} n - How many sparkles would you like?
         * @param {CanvasRenderingContext2D} ctx - HTML5 canvas context (2D)
         */
        function createSparkles(n) {
            let randomX, randomY, randomRadius;
            for (let i = 0; i < n; i++) {
                randomX = utils.randomX();
                randomY = utils.randomY();
                randomRadius = utils.randomSize();
                drawSparkle(randomX, randomY, randomRadius);
            }
        }

        createSparkles(1000); // as many as you like
    }

    const utils = initUtils();
    initSparkles(getCanvasContext('#make-me-sparkle'));
})();


// WILDERNESS of REFACTORIA

/**
 * TODO: redo with canvas
 * @param {Array} sparkles - HTMLElement Array of sparkles to animate
 */
    function animate(sparkles) {
    
    sparkles.forEach(sparkle => {
        const twinkle = new gsap.timeline({repeat: -1, yoyo: true});
        const randomDelay = utils.randomDelay();

        twinkle.to(sparkle, {
            opacity: 1,
            delay: randomDelay,
            duration: 2,
            ease: 'power2.in',
        });
    });
}

/**
 * TODO: redo with canvas
 * @param {Array} sparkles - HTMLElement Array of sparkles to scatter
 * @param {HTMLElement} area - A parent element to cover with sparkles
 */
function scatter(sparkles, area) {
    sparkles.forEach(sparkle => {
        area.appendChild(sparkle);  
    });
}