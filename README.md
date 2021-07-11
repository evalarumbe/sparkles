# Sparkles

## Goal

Decorate a canvas element with animated sparkles.

## Useful links

[Code example showing how GSAP and canvas code talk to each other](https://greensock.com/forums/topic/24378-controlling-items-on-canvas-with-gsap-info/?do=findComment&comment=115997)

## Many possible TODOs

- Play nice with other elements on the page 
    - Clear the sparkles with transparent pixels (instead of solid ones), so we can overlay sparkles on another element. [Maybe with clipping paths...](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip) or [maybe with globalAlpha](https://stackoverflow.com/questions/33723384/how-to-reset-transparency-when-drawing-overlapping-content-on-html-canvas).
    - Allow sparkles to overlap the edges of underlying element (generate center points within element boundary, but let the shape stretch past it)
    - [Make it a 3D orb](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#a_createradialgradient_example)

- Interactivity
    - [Respond to mouse movement](https://www.youtube.com/watch?v=52rKp7P3gIs&ab_channel=Frankslaboratory)

- Place sparkles more intentionally
    - Make them appear in a wave across the canvas (vertical, horizontal or diagonal...)
    - [Place sparkles so they don't overlap](https://www.youtube.com/watch?v=QkJHDIwPQ9E&ab_channel=TheBuffED) 

- Performance
    - Can I make it so my computer doesn't yell at me so much?
