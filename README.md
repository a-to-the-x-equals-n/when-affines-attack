## <span style="color: #00BE67;">Intro</span>

A quirky game where you play as a goose and try to avoid affine matrix transformations for as long as you can.

The main inspiration was to try and find a means--within my skillset--to try and develop a minigame that my kids could perhaps find interesting. 

In doing so, hopefully they accidentally learn a thing or two about affine transformation matrices, against their will.

---

### <span style="color: #00BE67;">Quick Setup</span>

There's a __Makefile__ included for your convenience.

1. __Clone__ the repository.
2. Nagivate to the __root folder__ of the __cloned repository__.
3. Execute the following in __terminal__:

```bash
make client
```
>__NOTE__: _The default __port__ in the Makefile is __8002__._

The __Makefile__ is configured for a __bash__ shell, so if you run into any issues, you can simply run the following in your terminal:

```bash
python -m http.server 8002
```

*__OR...__*

```bash
python3 -m http.server 8002
```

### <span style="color: #00BE67;">Game Instructions</span>

Use your directional arrow keys to move your __goose__. Alternatively, `WASD` or `wasd` will also register character movement.

__Affine transformations__ (3x3 matrices) are randomly generated at intervals of approximately 5 seconds.

You have __3 lives__.

It is your goal to __avoid colliding with any__ of the matrices.

For __every collision__, you will __lose one life.__

__BUT!__ when you do collide, your __goose__ will undergo that _exact_ transformation. Not only visually, but also the goose's direction vector is adjust according to the matrix as well; __north__ may become __southwest__, etc.


### <span style="color: #00BE67;">Requirements</span>

Just an internet browser and a __Python__ version 3.0+ for __Python's__ `http.server` module.

Locally, I'm running __Firefox__ and __Python v3.10__ for the `http.server`.