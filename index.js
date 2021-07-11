(() => {
    // Set up high-level dependencies
    const utils = {
        randomX: () => Math.floor(Math.random() * canvas.width),
        randomY: () => Math.floor(Math.random() * canvas.height),
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

    // Set canvas to element size
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);

    // Get movin'
    const sparkles = createSparkles(10);
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

        sparkles.forEach(sparkle => {
            gsap.ticker.add(() => {
                // If these two lines are swapped, it breaks (:
                clearSparkle(sparkle);
                renderSparkle(sparkle);
            });
        });

        /**
         * Clear the sparkle on each frame, between animation states
         * @param {{ x, y, rMax }} sparkle
         * // TODO: JS Docs for object prop data types
         */
        function clearSparkle({ x, y, rMax }) {
            ctx.fillStyle = `rgba(128, 0, 128, 1)`;
            drawSparkle(x, y, rMax); // Clear the maximum possible sparkle size
            ctx.fill();
        }

        /**
         * Render the sparkle on each frame, showing new animation states
         * @param {{ opacity, x, y, r }} sparkle
         * // TODO: JS Docs for object prop data types
         */
        function renderSparkle({ opacity, x, y, r }) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            drawSparkle(x, y, r);
            ctx.fill();
        }

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
})();
    