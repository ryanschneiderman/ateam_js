import React, { useRef, useEffect, useState } from "react";
import { ParticleImage } from "../../Models/ParticleImage";
import ParticleSystem from "../../Models/ParticleSystem";
import { MousePosition } from "../../types";
import RotatingText from "../RotatingText";
import { text } from "stream/consumers";

const CanvasComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasBgRef = useRef<HTMLCanvasElement | null>(null);
    // const imageRefs = useRef<HTMLImageElement[]>([]);
    const bgImages = useRef<HTMLImageElement[]>([]);
    const [canvasBackgroundColor, setCanvasBackgroundColor] =
        useState("transparent");

    const [loaded, setLoaded] = useState<boolean>(false);
    const [rotateTimer, setRotateTimer] = useState<number>(5500);

    // const [animationId, setAnimationId] = useState<number | null>(null);
    const animationId = useRef(0);
    const [isOutOfSight, setIsOutOfSight] = useState(false); // Assuming visibility state
    const nowRef = useRef(0); // Initialize `now` with 0
    const thenRef = useRef(Date.now());
    const elapsedRef = useRef(0);
    // const [now, setNow] = useState<number>(0);
    const [elapsed, setElapsed] = useState<number>(0);
    // const [then, setThen] = useState<number>(Date.now());
    // const [particleImages, setParticleImages] = useState<ParticleImage[]>([]);
    const [canvasHeight, setCanvasHeight] = useState<number | null>(null);
    const [canvasWidth, setCanvasWidth] = useState<number | null>(null);
    // const [bgImages, setBgImages] = useState<HTMLImageElement[]>([]);
    // const [canvsBgCtxPixelData, setCanvsBgCtxPixelData] = useState<ImageData>();
    const timeoutHolder = useRef<ReturnType<typeof setTimeout>>();

    const imageIndex = useRef(0);
    const [textIndex, setTextIndex] = useState<number>(0);
    const [textFade, setTextFade] = useState<boolean>(true);

    // const [imageIndex, setImageIndex] = useState<number>(0);
    const mousePosition = useRef({
        x: 0,
        y: 0,
    });

    // Event handler for mouse movement
    const handleMouseMove = (event: MouseEvent) => {
        mousePosition.current = {
            x: event.clientX,
            y: event.clientY,
        };
    };
    useEffect(() => {
        // Add event listener when the component mounts
        window.addEventListener("mousemove", handleMouseMove);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []); // Empty dependency array ensures this effect runs only once

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            const canvas = canvasRef.current;
            const canvasBg = canvasBgRef.current;
            if (canvas && canvasBg) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvasBg.width = window.innerWidth;
                canvasBg.height = window.innerHeight;
            }

            const particleImages = particleSystem.getImages();
            cancelAnimationFrame(animationId.current);
            for (let i = 0; i < particleImages.length; i++) {
                drawImageToBackground(
                    i,
                    particleImages[i],
                    bgImages.current[i]
                );
            }
            draw();
            // particlesRotate(false);

            //set mobile state
            // this.onMobile = this.canvas.width <= 690 ? true : false;
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const particleSystem = new ParticleSystem();

    // Example usage:
    const imageAttributes = [
        {
            src: "images/Basketball-Rev5.png",
            backgroundColor: "#2b2b2b",
            text: {
                main: "Welcome to ATeam",
                sub: "Basketball modernized.",
            },
        },
        {
            src: "images/Basketball-Rev5.png",
            backgroundColor: "#2b2b2b",
            text: {
                main: "Everything your team needs, all in one place.",
                sub: "Track stats, diagram plays, communicate with your players.",
            },
        },
        {
            src: "images/Basketball-Rev5.png",
            backgroundColor: "#2b2b2b",
            text: {
                main: "Made by coaches, for coaches.",
                sub: "Every detail focused on making your life as a coach easier",
            },
        },
        // Add more image attributes as needed
    ];

    useEffect(() => {
        setCanvasBackgroundColor(imageAttributes[0].backgroundColor);
        const canvas = canvasRef.current;
        const canvasBg = canvasBgRef.current;
        if (canvas && canvasBg) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvasBg.width = window.innerWidth;
            canvasBg.height = window.innerHeight;
        }

        let particleImages: ParticleImage[] = [];
        imageAttributes.forEach((attributes) => {
            const particleImage = new ParticleImage(
                attributes.src,
                // attributes.colorMapping,
                // attributes.color,
                attributes.backgroundColor
                // attributes.colorAlpha,
                // attributes.density,
                // attributes.maxParticleSize
            );
            particleImages.push(particleImage);
        });
        particleSystem.setImages(particleImages);
        loadImageData(particleImages);

        // if (imageIndex.current == particleImages.length - 1) {
        draw();
        particlesRotate(false);

        // TODO: resize logic
        // if(resize == false){
        //start the rotate timer
        // particlesRotate(false);
        // }
        // }
    }, []);

    const loadImageData = (particleImages: ParticleImage[]) => {
        // Function to load an image and return a promise
        const loadImage = (url: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = url;
                // img.onerror = (error) => reject(error);
            });
        };

        // Load all images and store them in state
        Promise.all(
            particleImages.map((particleImage) => loadImage(particleImage.src))
        )
            .then((loadedImages) => {
                bgImages.current = loadedImages;
                callDrawImageToBackground(particleImages);
            })
            .catch((error) => {
                console.error("Failed to load images", error);
            });
    };
    const callDrawImageToBackground = (particleImages: ParticleImage[]) => {
        for (let i = 0; i < particleImages.length; i++) {
            drawImageToBackground(i, particleImages[i], bgImages.current[i]);
        }
    };

    // Draw images once they are loaded
    const drawImageToBackground = (
        index: number,
        particleImage: ParticleImage,
        bgImage: HTMLImageElement
    ) => {
        const canvasBg = canvasBgRef.current;
        const bgCtx = canvasBgRef.current?.getContext("2d");
        const canvas = canvasRef.current;
        const ctx = canvasRef.current?.getContext("2d");

        var newWidth, newHeight;

        // TODO: worry about rezie later
        // var userResized = resize;

        // TODO: worry about heightDiff later. For now keep static.
        // var heightDiff = (Nodes.textPosition == 'bottom' && Nodes.textPositionH == 'center') ? $(Nodes.canvasID).parents($selector).find('.inner-wrap').height()/1.3 + 50 : 0;
        var heightDiff = 0;

        // TODO: come up with better logic for if canvasBg is null
        if (canvas == null || ctx == null || bgCtx == null) {
            throw new Error("Canvas BG is null");
        }

        if (canvas.height < 650) heightDiff = heightDiff / 2;

        // If the image is too big for the screen... scale it down.
        if (
            bgImage.width > canvas.width - 50 - heightDiff ||
            bgImage.height > canvas.offsetHeight - 50 - heightDiff
        ) {
            var maxRatio = Math.max(
                bgImage.width / (canvas.width - 50),
                bgImage.height / (canvas.height - heightDiff)
            );

            newWidth = bgImage.width / maxRatio;
            newHeight = bgImage.height / maxRatio;

            //change density based on ratio
            if (canvas.width < 1600) {
                if (maxRatio > 3 && maxRatio <= 4) {
                    particleImage.density = particleImage.densityOriginal - 3;
                    if (particleImage.maxParticleSize >= 3)
                        particleImage.maxParticleSize =
                            particleImage.maxParticleSizeOriginal - 1;
                } else if (maxRatio > 4) {
                    if (canvas.width > 800)
                        particleImage.density =
                            particleImage.densityOriginal - 4;
                    else
                        particleImage.density =
                            particleImage.densityOriginal - 5;

                    if (particleImage.maxParticleSize > 2)
                        particleImage.maxParticleSize = 2;
                } else if (maxRatio <= 3) {
                    particleImage.density = particleImage.densityOriginal;
                    particleImage.maxParticleSize =
                        particleImage.maxParticleSizeOriginal;
                }
            } else {
                particleImage.density = particleImage.densityOriginal;
                particleImage.maxParticleSize =
                    particleImage.maxParticleSizeOriginal;
            }
        } else {
            newWidth = bgImage.width;
            newHeight = bgImage.height;
        }

        // Draw to background canvas
        // TODO: figure out headerHeight later
        // var headerHeight = ($('#header-outer[data-transparent-header="true"]').length > 0 && $('body.mobile').length == 0 || $('#header-outer[data-permanent-transparent="1"]').length > 0) ? 0 : $('#header-outer').height();
        var headerHeight = 0;

        bgCtx.drawImage(
            bgImage,
            (canvas.width - newWidth) / 2,
            (canvas.height + headerHeight / 2 - newHeight - heightDiff * 1) / 2,
            newWidth,
            newHeight
        );
        const canvsBgCtxPixelData = bgCtx.getImageData(
            0,
            0,
            canvas.offsetWidth,
            canvas.offsetHeight
        );

        particleSystem.prepareParticles(
            canvas.height,
            canvas.width,
            canvsBgCtxPixelData
        );
    };
    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvas) {
            // Animation logic
            const id = requestAnimationFrame(draw);
            animationId.current = id;

            nowRef.current = Date.now();
            if (nowRef.current != null) {
                elapsedRef.current = nowRef.current - thenRef.current;
            }

            if (elapsedRef.current > 16.666 && nowRef) {
                thenRef.current =
                    nowRef.current - (elapsedRef.current % 16.666);

                // If top of page is visible
                if (!isOutOfSight) {
                    clear(ctx, canvas);
                    // TODO: need to figure out loaded logic.
                    particleSystem.updatePoints(
                        mousePosition.current,
                        true,
                        false,
                        imageIndex.current,
                        canvas.offsetWidth,
                        canvas.offsetHeight
                    );
                    particleSystem.drawPoints(ctx, imageIndex.current);
                }
            }
        }
    };

    const clear = (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement
    ) => {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    };

    const particleRotateLogic = (seek: number) => {
        //clear current timeout incase seeked
        if (timeoutHolder.current != null) {
            clearTimeout(timeoutHolder.current);
        }

        //chance for random movement or next shape
        // var explodeChance = (disableExplosion == 'on') ? 0 : 0.4;
        var explodeChance = 0.4;

        var timeoutInterval;
        var prevIndex;

        if (Math.random() > explodeChance || seek !== 0) {
            if (seek !== 0) {
                prevIndex = imageIndex.current;
                imageIndex.current = seek;
                setTextFade(false);
                setTimeout(() => {
                    setTextIndex(seek);
                    setTextFade(true);
                }, 500);
            } else {
                var new_index =
                    imageIndex.current + 1 == imageAttributes.length
                        ? 0
                        : imageIndex.current + 1;
                imageIndex.current = new_index;
                setTextFade(false);
                setTimeout(() => {
                    setTextIndex(new_index);
                    setTextFade(true);
                }, 500);
                prevIndex =
                    imageIndex.current == imageAttributes.length
                        ? 0
                        : imageIndex.current - 1;
            }
            particleSystem.rotateParticlesRandom(imageIndex.current, prevIndex);

            //update pagination
            //   TODO: revisit this. Might need to solve pagination
            //   var $selector = ($('.nectar-box-roll').length > 0) ? '.nectar-box-roll': '.nectar-particles';
            //   if($(Nodes.canvasID).parents($selector).find('.pagination-navigation').length > 0 && seek == false) {
            //     setTimeout( function(){
            //       $(Nodes.canvasID).parents($selector).find('.pagination-dot').eq(Nodes.currentShapeIndex).trigger('click');
            //     },$paginationTimeout);
            //   }

            timeoutInterval = rotateTimer;

            particleSystem.setRandomMovement(false);

            timeoutHolder.current = setTimeout(function () {
                particleRotateLogic(0);
            }, timeoutInterval);
        } else {
            timeoutInterval = 2800;
            timeoutHolder.current = setTimeout(function () {
                particleRotateLogic(0);
            }, timeoutInterval);

            particleSystem.setRandomMovement(true);
            particleSystem.setImpulsX(Math.random() * 600 - 300);
            particleSystem.setImpulsY(-Math.random() * 300);

            particleSystem.setPointsRandom();
        }
        // TODO: implement
        updateCanvasBgColor();
    };

    const updateCanvasBgColor = () => {
        setCanvasBackgroundColor(
            imageAttributes[imageIndex.current].backgroundColor
        );
    };

    const particlesRotate = (skipInitialDelay: boolean) => {
        var initTimeOut = skipInitialDelay == true ? 0 : 800;

        setTimeout(function () {
            var timeoutInterval =
                loaded == false ? rotateTimer + 1000 : rotateTimer;

            setLoaded(true);
            if (imageAttributes.length > 1)
                timeoutHolder.current = setTimeout(function () {
                    // 0 = false boolean
                    particleRotateLogic(0);
                }, timeoutInterval);

            updateCanvasBgColor();
            // TODO: need to be able to do this without passing canvasId
        }, initTimeOut);

        // TOOD: look to implement this later
        //fadeout loading animation
        // if(skipInitialDelay != true) {
        //   $('#ajax-loading-screen').stop().transition({'opacity':0},1000,function(){
        //     $(this).css({'display':'none'});
        //   });
        //   $('#ajax-loading-screen .loading-icon').transition({'opacity':0},1000);
        // }
    };

    return (
        <div>
            <div
                className="canvas-bg inset-0"
                style={{ backgroundColor: canvasBackgroundColor }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "1px solid black",
                    }}
                ></canvas>
                <canvas
                    id="bg-canvas"
                    ref={canvasBgRef}
                    style={{ display: "none", width: "100%", height: "100%" }}
                ></canvas>
            </div>
            <div className="mr-50 ml-50">
                <div className=" absolute inset-0 flex justify-center items-center text-center">
                    <RotatingText
                        currentText={imageAttributes[textIndex].text}
                        fade={textFade}
                    />
                </div>
            </div>
        </div>
    );
};

export default CanvasComponent;
