import Canvas from "./src/canvas";

const canvas: Canvas = new Canvas();
let id: number;

const ballCountContainer: HTMLElement | null = document.getElementById("count");
const inputRange: HTMLInputElement | undefined =
    ballCountContainer?.getElementsByTagName("input")[0];
const quantity: HTMLElement | undefined =
    ballCountContainer?.getElementsByTagName("b")[0];

inputRange?.addEventListener("change", (e: Event) => {
    const target: HTMLInputElement = e.target as HTMLInputElement;

    if (target) {
        quantity && (quantity.innerText = target.value);
        canvas.elementGenerator(+target.value);
    }
});

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

ballCountContainer?.addEventListener("mousedown", (e: MouseEvent) => {
    e.stopPropagation();
});
