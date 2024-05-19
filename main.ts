import Canvas from "./src/canvas";

const canvas = new Canvas();
let id;

window.addEventListener("load", () => {
    const update = () => {
        canvas.draw();
        id = requestAnimationFrame(update);
    };
    update();
});

window.addEventListener("unload", () => {
    cancelAnimationFrame(id);
});

window.addEventListener("resize", () => {
    canvas.resize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousedown", (e: MouseEvent) => {
    canvas.onMouseDown(e);
});

window.addEventListener("mousemove", (e: MouseEvent) => {
    canvas.onMouseMove(e);
});

window.addEventListener("mouseup", (e: MouseEvent) => {
    canvas.onMouseUp(e);
});

window.addEventListener("contextmenu", (e: MouseEvent) => {
    e.preventDefault();
});
