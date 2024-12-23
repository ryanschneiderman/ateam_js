import { ParticleImage } from "./ParticleImage";
import { ran } from "../../../utils/helpers"; // Adjust the import path as necessary
import { MousePosition } from "../types";

type Particle = {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
    toX: number;
    toY: number;
    r: number | undefined;
    g: number | undefined;
    b: number | undefined;
    a: number;
    hiddenDuringTrans: boolean;
    originalAlpha: number;
    color: string | undefined;
    baseRadius: number;
    baseRadiusOriginal: number;
    randomPosX: number;
    randomPosY: number;
    shrinking: boolean;
    shrinkDelay: number;
    flashSize: boolean;
    used: boolean;
    duplicate: boolean;
    randomNum: number;
    time: number;
    time2: number;
    deg: number;
    vel: number;
    curve: number;
    alpha: number;
};

// ParticleSystem.ts
class ParticleSystem {
    particles: Particle[][];
    impulsX: number;
    impulsY: number;
    images: ParticleImage[];
    randomMovement: boolean;
    onMobile: boolean = false;
    decMultiplier: number;
    imageIndex: number;
    reactionSensitivity: number;
    // Particle system properties
    // Consider adding properties like particles, impulsX, impulsY, etc.

    constructor() {
        this.particles = []; // Initialize an empty array for particles
        this.impulsX = Math.random() * 600 - 300; // Initial impulse in X direction
        this.impulsY = -Math.random() * 300; // Initial impulse in Y direction
        // Set this to whatever is passed in
        this.images = [];
        this.randomMovement = false;
        this.decMultiplier = 0.02;
        this.imageIndex = 0;
        this.reactionSensitivity = 3;
    }

    public setImpulsX(newImpulsX: number) {
        this.impulsX = newImpulsX;
    }

    public setImpulsY(newImpulsY: number) {
        this.impulsY = newImpulsY;
    }

    public setIsMobile(onMobile: boolean) {
        this.onMobile = onMobile;
    }

    public setRandomMovement(rm: boolean) {
        this.randomMovement = rm;
    }
    public setImages(particleImages: ParticleImage[]) {
        this.images = particleImages;
    }
    public getImages() {
        return this.images;
    }

    public setPointsRandom() {
        for (let i = 0; i < this.particles[this.imageIndex].length; i++) {
            var currentPoint = this.particles[this.imageIndex][i];
            currentPoint.randomPosX = Math.random() * 6;
            currentPoint.randomPosY = Math.random() * 6;
        }
    }

    // public setDecMultiplier(newDec: number){
    //   this.decMultiplier = newDec;
    // }

    // Implementation of your update logic...
    // OR IF NOT WE NEED A WAY TO ACCESS THE CANVAS AND STATE
    public updatePoints(
        mouse: MousePosition,
        loaded: boolean,
        sequenceActive: boolean,
        index: number,
        canvasWidth: number,
        canvasHeight: number
    ) {
        var i, currentPoint, theta, distance, dx, dy;

        this.impulsX = this.impulsX - this.impulsX / 30;
        this.impulsY = this.impulsY - this.impulsY / 30;

        if (this.onMobile == true) {
            if (this.decMultiplier < 0.23)
                this.decMultiplier = this.decMultiplier + 0.0015;
        } else {
            if (this.decMultiplier < 0.125)
                this.decMultiplier = this.decMultiplier + 0.0004;
        }

        //proc
        for (i = 0; i < this.particles[index].length; i++) {
            currentPoint = this.particles[index][i];

            theta = Math.atan2(
                currentPoint.y - mouse.y,
                currentPoint.x - mouse.x
            );

            distance =
                (this.reactionSensitivity * 60) /
                Math.sqrt(
                    (mouse.x - currentPoint.x) * (mouse.x - currentPoint.x) +
                        (mouse.y - currentPoint.y) * (mouse.y - currentPoint.y)
                );
            if (distance > 50) {
                distance = 0;
            }

            if (!this.particles[index][i].time) {
                this.particles[index][i].time = ran(70, 200);
                this.particles[index][i].deg = ran(-120, 180);
                this.particles[index][i].vel = ran(0.08, 0.14);
            }

            // Calc movement

            var velocity =
                this.randomMovement == false
                    ? this.particles[index][i].vel
                    : this.particles[index][i].vel;

            dx =
                velocity *
                Math.cos((this.particles[index][i].deg * Math.PI) / 180);
            dy =
                velocity *
                Math.sin((this.particles[index][i].deg * Math.PI) / 180);

            if (loaded != false) {
                currentPoint.x += dx;
                currentPoint.y += dy;
            }

            if (this.particles[index][i].curve > 0) {
                this.particles[index][i].deg = this.particles[index][i].deg + 2;
            } else {
                this.particles[index][i].deg = this.particles[index][i].deg - 2;
            }

            this.particles[index][i].time = this.particles[index][i].time - 1;

            //before loaded
            if (loaded == false) {
                if (this.particles[index][i].vel < 0.4) {
                    //skip processing.
                } else {
                    this.particles[index][i].vel =
                        this.particles[index][i].vel - 0.0;
                }

                currentPoint.x += Math.cos(theta) * distance;
                currentPoint.y += Math.sin(theta) * distance;
                //after loaded
            } else {
                //next shape
                if (this.randomMovement == false) {
                    if (sequenceActive == false) {
                        currentPoint.baseRadius = Math.ceil(
                            currentPoint.randomNum *
                                this.images[index].maxParticleSize
                        );

                        currentPoint.baseRadiusOriginal =
                            currentPoint.baseRadius;

                        if (this.particles[index][i].vel < 0.4)
                            this.particles[index][i].time = 0;
                        else
                            this.particles[index][i].vel =
                                this.particles[index][i].vel - 0.008;

                        currentPoint.x +=
                            Math.cos(theta) * distance +
                            (this.particles[index][i].originalX -
                                currentPoint.x) *
                                this.decMultiplier;
                        currentPoint.y +=
                            Math.sin(theta) * distance +
                            (this.particles[index][i].originalY -
                                currentPoint.y) *
                                this.decMultiplier;
                    }
                    // NOTE: I THINK THIS IS AN IRRELEVANT CASE
                    // else {

                    //   // if(typeof this.particles[index][Math.floor(currentthis.particles[index])][currentSequenceIndex][i] !== 'undefined'){
                    //     currentPoint.x += Math.cos(theta) * distance + (this.particles[index][0][i].seqX - currentPoint.x) * 0.08;
                    //     currentPoint.y += Math.sin(theta) * distance + (this.particles[index][0][i].seqY - currentPoint.y) * 0.08;
                    //   // }
                    // }
                }

                //random movement
                else {
                    if (i == 0 && this.reactionSensitivity < 8) {
                        this.reactionSensitivity = 8;
                    }

                    var sizeMovement =
                        (this.particles[index][i].randomNum *
                            currentPoint.baseRadius) /
                        4;

                    if (sizeMovement < 0.25) {
                        sizeMovement = 0.25;
                    }

                    if (!this.particles[index][i].time2) {
                        this.particles[index][i].time2 = ran(300, 900);
                    }

                    this.particles[index][i].time2 =
                        this.particles[index][i].time2 - 1;

                    currentPoint.x +=
                        Math.cos(theta) * distance +
                        (this.particles[index][i].toX - currentPoint.x) * 0.027;
                    currentPoint.y +=
                        Math.sin(theta) * distance +
                        (this.particles[index][i].toY - currentPoint.y) * 0.027;

                    // check for bounds
                    if (currentPoint.x < -(canvasWidth * 0.1)) {
                        currentPoint.x = canvasWidth * 1.1;
                        currentPoint.toX = canvasWidth * 1.1 - ran(20, 40) * 4;
                    }
                    if (currentPoint.x > canvasWidth * 1.1) {
                        currentPoint.x = -(canvasWidth * 0.1);
                        currentPoint.toX =
                            -(canvasWidth * 0.1) + ran(20, 40) * 4;
                    }

                    if (currentPoint.y < -(canvasHeight * 0.1)) {
                        currentPoint.y = canvasHeight * 1.1;
                        currentPoint.toY = canvasHeight * 1.1 - ran(20, 40) * 4;
                    }
                    if (currentPoint.y > canvasHeight * 1.1) {
                        currentPoint.y = -(canvasHeight * 0.1);
                        currentPoint.toY =
                            -(canvasHeight * 0.1) + ran(20, 40) * 4;
                    }

                    currentPoint.toX +=
                        Math.floor((this.impulsX * sizeMovement * 30) / 30) +
                        (this.impulsX / 7) * currentPoint.randomPosX;
                    currentPoint.toY +=
                        Math.floor((this.impulsY * sizeMovement * 30) / 30) +
                        (this.impulsY / 7) * currentPoint.randomPosY;

                    //sparkle
                    if (currentPoint.shrinkDelay >= 0)
                        currentPoint.shrinkDelay =
                            currentPoint.shrinkDelay - 0.5;

                    if (
                        currentPoint.flashSize == true &&
                        currentPoint.shrinkDelay <= 0
                    ) {
                        ////start large
                        if (
                            currentPoint.baseRadius ==
                                currentPoint.baseRadiusOriginal &&
                            currentPoint.shrinking == false
                        ) {
                            currentPoint.baseRadius =
                                this.images[index].maxParticleSize + 4;
                            currentPoint.alpha = 1;
                            currentPoint.color =
                                "rgba(" +
                                currentPoint.a +
                                "," +
                                currentPoint.g +
                                "," +
                                currentPoint.b +
                                "," +
                                "1)";
                            currentPoint.shrinking = true;
                        }

                        ////dec
                        currentPoint.baseRadius =
                            currentPoint.baseRadius - 0.3 > 1
                                ? currentPoint.baseRadius - 0.3
                                : 1;
                        currentPoint.alpha =
                            currentPoint.alpha >= currentPoint.originalAlpha &&
                            currentPoint.originalAlpha != 1
                                ? currentPoint.alpha - 0.01
                                : currentPoint.originalAlpha;
                        currentPoint.color =
                            "rgba(" +
                            currentPoint.r +
                            "," +
                            currentPoint.g +
                            "," +
                            currentPoint.b +
                            "," +
                            currentPoint.alpha +
                            ")";

                        ////end size
                        if (
                            currentPoint.baseRadius <=
                                currentPoint.baseRadiusOriginal &&
                            currentPoint.shrinking == true
                        ) {
                            currentPoint.baseRadius =
                                currentPoint.baseRadiusOriginal;
                            currentPoint.flashSize = false;
                            currentPoint.shrinking = false;
                            currentPoint.shrinkDelay = Math.random() * 100;
                            currentPoint.color =
                                "rgba(" +
                                currentPoint.r +
                                "," +
                                currentPoint.g +
                                "," +
                                currentPoint.b +
                                "," +
                                currentPoint.originalAlpha +
                                ")";

                            ////set new random one
                            this.particles[index][
                                Math.floor(
                                    Math.random() * this.particles[index].length
                                )
                            ].flashSize = true;
                        }
                    }
                }
            }
        }
    }

    public prepareParticles(
        canvasHeight: number,
        canvasWidth: number,
        bgContextPixelData: ImageData
    ) {
        console.log(bgContextPixelData);
        var length = this.images.length;
        for (let k = 0; k < length; k++) {
            // set imgToDraw to the current image according to the imageIndex
            var imgToDraw = this.images[k];
            this.particles[k] = [];
            var i, j;
            if (bgContextPixelData) {
                var colors = bgContextPixelData.data;

                for (i = 0; i < canvasHeight; i += imgToDraw.density) {
                    // console.log("i: " + i);

                    for (j = 0; j < canvasWidth; j += imgToDraw.density) {
                        // console.log("j: " + j);

                        var pixelPosition =
                            (j + i * bgContextPixelData.width) * 4;

                        // Dont use whiteish pixels
                        if (
                            (colors[pixelPosition] > 200 &&
                                colors[pixelPosition + 1] > 200 &&
                                colors[pixelPosition + 2] > 200) ||
                            colors[pixelPosition + 3] === 0
                        ) {
                            continue;
                        }

                        var xPos, yPos;

                        // First shape index
                        if (this.imageIndex == 0) {
                            var rndNumX =
                                Math.random() > 0.5
                                    ? Math.random() * window.innerWidth
                                    : Math.random() * -window.innerWidth;
                            var rndNumY =
                                Math.random() > 0.5
                                    ? Math.random() * window.innerHeight
                                    : Math.random() * -window.innerHeight;
                            xPos =
                                Math.random() * (window.innerWidth * 2) +
                                rndNumX;
                            yPos =
                                Math.random() * (window.innerHeight * 2) +
                                rndNumY;
                        }
                        // all others
                        else {
                            var mathRnd = Math.random();

                            var prevIndex =
                                this.imageIndex == this.particles.length - 1
                                    ? 0
                                    : this.imageIndex - 1;
                            xPos =
                                this.particles[prevIndex][
                                    Math.floor(
                                        mathRnd *
                                            this.particles[prevIndex].length
                                    )
                                ].originalX;
                            yPos =
                                this.particles[prevIndex][
                                    Math.floor(
                                        mathRnd *
                                            this.particles[prevIndex].length
                                    )
                                ].originalY;
                        }

                        // TODO: handle resize logic later or elsewhere
                        //
                        if (this.randomMovement == false) {
                            xPos = j + ran(-7, 7);
                            yPos = i + ran(-7, 7);
                        } else {
                            xPos = Math.random() * window.innerWidth;
                            yPos = Math.random() * window.innerHeight;
                        }

                        var alpha = 1;

                        //color mapping
                        var r, g, b, color;
                        switch (imgToDraw.colorMapping) {
                            case "original":
                                r = colors[pixelPosition];
                                g = colors[pixelPosition + 1];
                                b = colors[pixelPosition + 2];
                                color =
                                    "rgba(" +
                                    r +
                                    "," +
                                    g +
                                    "," +
                                    b +
                                    "," +
                                    alpha +
                                    ")";
                                // console.log(color);
                                break;

                            case "solid":
                                var hex = imgToDraw.color.replace("#", "");
                                r = parseInt(hex.substring(0, 2), 16);
                                g = parseInt(hex.substring(2, 4), 16);
                                b = parseInt(hex.substring(4, 6), 16);
                                color =
                                    "rgba(" +
                                    r +
                                    "," +
                                    g +
                                    "," +
                                    b +
                                    "," +
                                    alpha +
                                    ")";
                                break;

                            case "random":
                                r = Math.floor(Math.random() * 255);
                                g = Math.floor(Math.random() * 255);
                                b = Math.floor(Math.random() * 255);
                                color =
                                    "rgba(" +
                                    r +
                                    "," +
                                    g +
                                    "," +
                                    b +
                                    "," +
                                    alpha +
                                    ")";
                                break;
                        }

                        var flashChance = Math.random() < 0.5 ? true : false;
                        var rndNum = Math.random();
                        this.particles[k].push({
                            x: xPos,
                            y: yPos,
                            originalX: j,
                            originalY: i,
                            toX: Math.random() * window.innerWidth,
                            toY: Math.random() * window.innerHeight,
                            r: r,
                            g: g,
                            b: b,
                            a: alpha,
                            hiddenDuringTrans: false,
                            originalAlpha: alpha,
                            color: color,
                            baseRadius: Math.ceil(
                                rndNum * imgToDraw.maxParticleSize
                            ),
                            baseRadiusOriginal: Math.ceil(
                                rndNum * imgToDraw.maxParticleSize
                            ),
                            randomPosX: Math.random() * 6,
                            randomPosY: Math.random() * 6,
                            shrinking: false,
                            shrinkDelay: Math.random() * 100,
                            flashSize: flashChance,
                            used: false,
                            duplicate: false,
                            randomNum: rndNum,
                            time: ran(70, 200),
                            time2: ran(300, 900),
                            deg: ran(-120, 180),
                            vel: ran(0.08, 0.14),
                            curve: 0,
                            alpha: 1,
                        });
                    }
                }

                //hide particles for trans
                for (var u = 0; u < this.particles[k].length; u++) {
                    var randomNum = ran(0, this.particles[k].length);
                    var divider;

                    if (window.innerWidth < 690) {
                        divider = this.particles[k].length > 200 ? 8 : 5;
                        if (
                            this.particles[k].length > 150 &&
                            randomNum >
                                Math.floor(this.particles[k].length / divider)
                        ) {
                            this.particles[k][u].hiddenDuringTrans = true;
                        }
                    } else {
                        if (this.particles[k].length > 800) {
                            divider = 6;
                        } else if (
                            this.particles[k].length <= 800 &&
                            this.particles[k].length > 600
                        ) {
                            divider = 4.5;
                        } else if (
                            this.particles[k].length <= 600 &&
                            this.particles[k].length > 400
                        ) {
                            divider = 3.5;
                        } else if (this.particles[k].length <= 400) {
                            divider = 1.5;
                        }
                        // TODO: look into catch case for divider
                        else {
                            divider = 1.5;
                        }

                        if (
                            this.particles[k].length > 350 &&
                            randomNum >
                                Math.floor(this.particles[k].length / divider)
                        ) {
                            this.particles[k][u].hiddenDuringTrans = true;
                        }
                    }
                }
            }
        }
        console.log(this.particles);
    }

    public drawPoints(ctx: CanvasRenderingContext2D, index: number) {
        var i, currentPoint;

        for (i = 0; i < this.particles[index].length; i++) {
            currentPoint = this.particles[index][i];

            var randomNum = this.particles[index][i].randomNum;
            if (randomNum < 0.1) {
                randomNum = 0.3;
            }

            //skip drawing some particles during trans
            if (
                currentPoint.hiddenDuringTrans == true &&
                this.randomMovement == true
            ) {
                continue;
            }

            // Draw the particle
            //   TODO: need to reference the context
            if (ctx == null) {
                throw new Error("ctx is null");
            }
            if (currentPoint.color == null) {
                throw new Error("point must have color");
            }
            ctx.beginPath();
            ctx.arc(
                currentPoint.x,
                currentPoint.y,
                currentPoint.baseRadius,
                0,
                Math.PI * 2,
                true
            );
            ctx.fillStyle = currentPoint.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    public rotateParticlesRandom(index: number, prevIndex: number) {
        this.decMultiplier = 0.04;

        if (Math.floor(index) - 1 == -1) {
            prevIndex = this.particles.length - 1;
        }

        var prevPrevIndex =
            prevIndex - 1 == -1 ? this.particles.length - 1 : prevIndex - 1;
        var mathRnd;
        var xPos, yPos;

        //set next shape x/y pos to match the previos one after rnd movement
        for (var i = 0; i < this.particles[index].length; i++) {
            mathRnd = Math.random();

            xPos =
                this.particles[prevIndex][
                    Math.floor(mathRnd * this.particles[prevIndex].length)
                ].x;
            yPos =
                this.particles[prevIndex][
                    Math.floor(mathRnd * this.particles[prevIndex].length)
                ].y;

            // }

            this.particles[index][i].x = xPos;
            this.particles[index][i].y = yPos;
        }

        // var $paginationTimeout = 300;

        //reset this.particles to prev shap after animation is complete
        for (i = 0; i < this.particles[prevIndex].length; i++) {
            mathRnd = Math.random();
            xPos =
                this.particles[prevPrevIndex][
                    Math.floor(mathRnd * this.particles[prevPrevIndex].length)
                ].originalX;
            yPos =
                this.particles[prevPrevIndex][
                    Math.floor(mathRnd * this.particles[prevPrevIndex].length)
                ].originalY;
            this.particles[prevIndex][i].x = xPos;
            this.particles[prevIndex][i].y = yPos;

            this.particles[prevIndex][i].toX =
                Math.random() * window.innerWidth;
            this.particles[prevIndex][i].toY =
                Math.random() * window.innerHeight;

            //reset flash chance
            var flashChance = Math.random() < 0.5 ? true : false;
            this.particles[prevIndex][i].flashSize = flashChance;
        }

        if (this.reactionSensitivity > 4) {
            window.innerWidth > 690
                ? (this.reactionSensitivity = 4)
                : (this.reactionSensitivity = 1);
        }

        //handle captions
        var currentCaptionIndex, nextCaptionIndex;

        //   seek !== false
        // if(seek !== 0) {
        //   currentCaptionIndex = seek+1;
        //   nextCaptionIndex = seek+1;
        // } else {
        currentCaptionIndex = index == 0 ? this.images.length : index;
        nextCaptionIndex =
            index == this.particles.length ? 0 : Math.floor(index + 1);
        // }

        // shapeTextDisplay(currentCaptionIndex, nextCaptionIndex, seek);
    }

    // Other methods related to particle system management can go here
}

export default ParticleSystem;
