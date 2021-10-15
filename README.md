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
    - If cursor moves off screen, dim all sparkles
    - [Respond more elegantly to resize](https://stackoverflow.com/questions/5489946/how-to-wait-for-the-end-of-resize-event-and-only-then-perform-an-action)

- Place sparkles more intentionally
    - Make them appear in a wave across the canvas (vertical, horizontal or diagonal...)
    - [Place sparkles so they don't overlap](https://www.youtube.com/watch?v=QkJHDIwPQ9E&ab_channel=TheBuffED)
    - Set number of sparkles based on viewport size (not too many, not to few)

## Unsolved mysteries

- Bugs on mouse over:
    - animation pauses for dim sparkles
    - sparkling all syncs up, but I wanted them separate like they are at load (perhaps something to do with delay?)
