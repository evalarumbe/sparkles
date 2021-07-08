(() => {
    /**
     * TODO
     * @returns {Object} of utility functions
     */
    function initUtils() {
        const utils = {};

        utils.randomSize = () => {
            const sizes = [10, 20, 30, 50, 80, 130]; // px (Fibonacci, my heart)
            const i = Math.floor(Math.random() * (sizes.length + 1));
            return sizes[i];
        };

        utils.randomDelay = () => {
            // between 0.5 and 1.5 seconds
            return Math.floor(Math.random() * (1.5 - 0.5 + 1) + 0.5);
        };

        return utils;
    }

    function initSparkles() {
        const sparkles = createSparkles(10); // TODO: Arbitrarily more than 10.
        const area = document.getElementById('make-me-sparkle');

        scatter(sparkles, area);
        animate(sparkles);
    }

    /**
     * Clone the existing SVG until we have enough sparkles,
     * (though one can never truly have enough sparkles).
     * 
     * @param {number} n - How many sparkles would you like?
     * @return {Array} - HTMLElement Array of SVGs
     */
    function createSparkles(n) {
        const firstSparkle = document.querySelector('.first.sparkle');
        const sparkles = [firstSparkle];
        let newSparkle, newSparkleSize;

        // Clone the first sparkle
        while (sparkles.length < n) {
            newSparkle = firstSparkle.cloneNode(true); // Include descendants
            newSparkle.classList.remove('first');
            newSparkleSize = utils.randomSize();

            newSparkle.style.width = newSparkleSize;
            newSparkle.style.height = newSparkleSize;

            sparkles.push(newSparkle);
        }

        return sparkles;
    }

    /**
     * TODO
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
     * TODO
     * @param {Array} sparkles - HTMLElement Array of sparkles to scatter
     * @param {HTMLElement} area - A parent element to cover with sparkles
     */
    function scatter(sparkles, area) {
        sparkles.forEach(sparkle => {
            area.appendChild(sparkle);  
        });
    }

    const utils = initUtils();
    initSparkles();
})();