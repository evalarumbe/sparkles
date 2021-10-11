(() => {
    // Set up high-level dependencies
    const utils = {
        randomX: () => Math.floor(Math.random() * window.innerWidth),
        randomY: () => Math.floor(Math.random() * window.innerHeight),
        randomRadius: () => {
            const sizes = [1, 1, 2, 3, 5, 8, 13]; // px (Fibonacci, my heart)
            const i = Math.floor(Math.random() * (sizes.length));
            return sizes[i];
        },
        randomDelay: () => (Math.random() * (1.5 - 0.5 + 1) + 0.5), // 0.5 to 1.5 seconds
    }
    const { randomX, randomY, randomRadius, randomDelay } = utils;
    
    const canvas = document.querySelector('#make-me-sparkle');
    const ctx = canvas.getContext('2d');

    // Set canvas to initial viewport size
    // TODO: dynamic on resize
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get movin'
    const sparkles = createSparkles(100);
    animateSparkles(sparkles);


    /**
     * Set starting properties for all sparkles, and how they will animate.
     * @param {number} n - How many sparkles would you like?
     * @return {Array} sparkle objects
     */
    function createSparkles(n) {
        const sparkles = [];
        let radius = 0;
        
        // Generate the specified number of sparkles
        for (let i = 0; i < n; i++) {    
            radius = randomRadius();
            const sparkle = {
                x: randomX(),
                y: randomY(),
                r: radius, // Animated (starts as min height and width)
                rMax: radius * 2,
                opacity: 0, // Animated
            };

            // Set the animation end state
            gsap.to(sparkle, {
                duration: 2,
                delay: randomDelay(),
                repeat: -1,
                yoyo: true,
                opacity: 1,
                r: sparkle.rMax,
            });

            sparkles.push(sparkle);
        }

        return sparkles;
    }

    /**
     * Continuously clear and redraw sparkles
     * @param {Array} sparkles TODO: which properties do we need
     */
    function animateSparkles(sparkles) {
        // On each frame (between animation states)
        gsap.ticker.add(() => {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log('cleared');
            // Render all sparkles
            sparkles.forEach(sparkle => {
                renderSparkle(sparkle);
            });
        });
        
        /**
         * Render the sparkle at its current opacity and size
         * @param {{ opacity, x, y, r }} sparkle
         * // TODO: JS Docs for object prop data types
         */
        function renderSparkle({ opacity, x, y, r }) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            drawSparkle(x, y, r);
            ctx.fill();
            
            /**
             * Draw a sparkle for a given radius and coordinate (x, y) position.
             * Call drawSparkle in between calls to ctx.fillStyle(...) and ctx.fill().
             * 
             * @param {number} x - center point's pixels from left
             * @param {number} y - center point's pixels from top
             * @param {number} r - height and width (loosely, "radius") of the sparkle
             */
            function drawSparkle(x, y, r) {
                const halfR = r / 2; // for legibility
        
                ctx.beginPath();
                ctx.moveTo(x, (y - r)); // top point
                ctx.bezierCurveTo(x, (y - halfR), (x + halfR), y, (x + r), y); // right point
                ctx.bezierCurveTo((x + halfR), y, x, (y + halfR), x, (y + r)); // bottom point
                ctx.bezierCurveTo(x, (y + halfR), (x - halfR), y, (x - r), y); // left point
                ctx.bezierCurveTo((x - halfR), y, x, (y - halfR), x, (y - r)); // close
                ctx.closePath();
            }
        }
    }
})();
