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
    
    class Sparkle {
        constructor() {
            this.x = randomX(); // center point's pixels from left
            this.y = randomY(); // center point's pixels from top
            this.rMin = randomRadius();
            this.rMax = this.rMin * 2;
            this.r = this.rMin; // animated. radius (height and width) of the sparkle
            this.opacityMin = 0;
            this.opacityMax = 0.7;
            this.opacity = this.opacityMin; // animated
        }

        /**
         * Set ending animation state
         */
        setEndState() {
            gsap.to(this, {
                duration: 2,
                delay: firstRender ? randomDelay() : 0,
                repeat: -1,
                yoyo: true,
                opacity: this.opacityMax,
                r: this.rMax,
            });
        }

        /**
         * Draw a sparkle to the canvas
         * Call draw in between calls to ctx.fillStyle(...) and ctx.fill().
         */
        draw() {
            // vars for legibility
            const { x, y, r } = this;
            const halfR = r / 2;
    
            ctx.beginPath();
            ctx.moveTo(x, (y - r)); // top point
            ctx.bezierCurveTo(x, (y - halfR), (x + halfR), y, (x + r), y); // right point
            ctx.bezierCurveTo((x + halfR), y, x, (y + halfR), x, (y + r)); // bottom point
            ctx.bezierCurveTo(x, (y + halfR), (x - halfR), y, (x - r), y); // left point
            ctx.bezierCurveTo((x - halfR), y, x, (y - halfR), x, (y - r)); // close
            ctx.closePath();
        }

        /**
         * Render the sparkle at its current opacity and size
         */
        render() {
            const { r, rMin, rMax } = this;
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            this.draw();
            ctx.fill();
        }
        
        /**
         * Test if a sparkle's center point is within a 200px radius of the cursor
         * 
         * Thank you Internet for saving me time on circle math
         * https://www.w3resource.com/javascript-exercises/javascript-basic-exercise-120.php
         * 
         * @param {Event} - mousemove { offsetX, offsetY } cursor position
         * @returns {Boolean}
         */
        isNearCursor(event) {
            const { offsetX, offsetY } = event;
            const radiusFromCursor = 200; // px
            const distance = (this.x - offsetX) * (this.x - offsetX) + (this.y - offsetY) * (this.y - offsetY);
            const rSquared = radiusFromCursor * radiusFromCursor;
            return distance < rSquared;
        }

        /**
         * Increase radius of a sparkle (affects the end state of animation)
         * TODO: Consider making this chainable. See usage at handleMouseMove()
         */
        brighten() {
            this.rMax = this.rMin * 4;
            this.opacityMax = 1;
        }
        
        /**
         * Undo the effect of the brighten function
         * TODO: Consider making this chainable. See usage at handleMouseMove()
         */
        dim() {
            this.rMax = this.rMin * 2;
            this.opacityMax = 0.7;
        }
    }

    const canvas = document.querySelector('#make-me-sparkle');
    const ctx = canvas.getContext('2d');
    let firstRender = true; // prevents a delay on resize
    const allSparkles = createSparkles(100);

    window.addEventListener('load', initSparkles);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    /**
     * Create the specified number of sparkles.
     * @param {number} n - How many sparkles would you like?
     * @return {Array} Sparkle instances
     */
     function createSparkles(n) {
        const sparkles = [];
        for (let i = 0; i < n; i++) {
            const sparkle = new Sparkle();            
            sparkles.push(sparkle);
        }
        return sparkles;
    }

    /**
     * Create and animate sparkles to fill the viewport.
     */
    function initSparkles() {
        // TODO: maybe canvas size should be handled separately, for readability
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        allSparkles.forEach(sparkle => sparkle.setEndState());
        animateSparkles(allSparkles);
    }
    
    /**
     *  TODO: Prevent canvas from redrawing too often during resize (see Readme)
     */
    function handleResize() {
        allSparkles.forEach(sparkle => {
            sparkle.x = randomX();
            sparkle.y = randomY();
        });
        initSparkles();
    }

    /**
     * Apply effect to nearby sparkles. Remove effect from other (distant) sparkles.
     * @param {Event} mousemove
     */
    function handleMouseMove(event) {
        const brighterSparkles = sparklesNearCursor(event);
        const otherSparkles = allSparkles.filter(sparkle => !brighterSparkles.includes(sparkle));
        
        brighterSparkles.forEach(sparkle => {
            sparkle.brighten();
            sparkle.setEndState();
        });
        
        otherSparkles.forEach(sparkle => {
            sparkle.dim();
            sparkle.setEndState();
        });
    }
    
    /**
     * Remove effect from all sparkles.
     */
     function handleMouseOut() {
        allSparkles.forEach(sparkle => {
            sparkle.dim();
            sparkle.setEndState();
        });
    }

     /**
     * Identify sparkles that are close to the cursor
     * @param {Event} - { offsetX, offsetY } cursor position
     * @returns {Array} Sparkle instances
     */
    function sparklesNearCursor(event) {
        return allSparkles.filter(sparkle => sparkle.isNearCursor(event));
    }
    
    /**
     * Continuously clear and redraw sparkles
     * @param {Array} Sparkle instances
     */
    function animateSparkles(sparkles) {
        // On each frame (between animation states)
        gsap.ticker.add(() => {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log('cleared');
            // Render all sparkles
            sparkles.forEach(sparkle => sparkle.render());
        });   
        firstRender = false;
    }
})();
