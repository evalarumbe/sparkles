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
    let firstRender = true; // prevents a delay on resize
    const allSparkles = createSparkles(100);

    // Fill the viewport with sparkles and start over on resize
    initSparkles();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

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
        setEndState(allSparkles);
        animateSparkles(allSparkles);
    }
    
    /**
     *  TODO: Prevent canvas from redrawing too often during resize (see Readme)
     */
    function handleResize() {
        firstRender = false;
        initSparkles();
    }

    /**
     * TODO: Doc
     * @param {Event} event 
     * @returns 
     */
    function handleMouseMove(event) {
        // TODO: pass these into func that makes them grow / bright. i think it's gonna get too crowded in here.
        const brighterSparkles = sparklesNearCursor(event);
        const otherSparkles = allSparkles.filter(sparkle => !brighterSparkles.includes(sparkle));
        
        brighterSparkles.forEach(sparkle => {
            // TODO: do something better to them. just testing which subset i grabbed for now.
            // sparkle.rMax = sparkle.r * 4; // lol
            sparkle.x = 0;
        });
        
        // otherSparkles.forEach(sparkle => {
        //     // TODO: do something better to them. just testing which subset i grabbed for now.
        //     sparkle.x = 300;
        // });

        setEndState(brighterSparkles);
    }

    /**
     * Identify sparkles that are close to the cursor
     * @param {Event} - { offsetX, offsetY } cursor position
     * @returns {Array} - sparkles TODO: document these objects better up top
     */
    function sparklesNearCursor(event) {
        const sparklesNearCursor = allSparkles.filter(sparkle => {
            return isNearCursor(sparkle, event);
        });
        console.log('how many?', sparklesNearCursor.length);
        return sparklesNearCursor;
    }

    /**
     * Test if a sparkle's center point is within a 200px radius of the cursor
     * 
     * Thank you Internet for saving me time on circle math
     * https://www.w3resource.com/javascript-exercises/javascript-basic-exercise-120.php
     * 
     * @param {Object} - sparkle { x, y } center point
     * @param {Event} - mousemove { offsetX, offsetY } cursor position
     * @returns {Boolean}
     */
    function isNearCursor({ x, y }, { offsetX, offsetY }) {
        const radiusFromCursor = 200; // px
        const dist = (x - offsetX) * (x - offsetX) + (y - offsetY) * (y - offsetY);
        const rSquared = radiusFromCursor * radiusFromCursor;
        return dist < rSquared;
    }

    /**
     * Set ending animation states for a set (or subset) of sparkles
     * @param {Array} sparkles Which sparkles should this affect?
     */
    function setEndState(sparkles) {
        sparkles.forEach(sparkle => {
            gsap.to(sparkle, {
                duration: 2,
                delay: firstRender ? randomDelay() : 0,
                repeat: -1,
                yoyo: true,
                opacity: 1,
                r: sparkle.rMax,
            });
        });
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
    }

    /**
     * Render the sparkle at its current opacity and size
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
})();
