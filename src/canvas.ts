import { genRandomNumber } from "./utils";
import Element from "./element";
import Vector from "./vector";
import { Colors } from "./constants";
import Animator from "./animator";

class Canvas {
    private ctx?: CanvasRenderingContext2D | null;
    public elements: Element[] = [];
    public canvas: HTMLCanvasElement | null = null;
    private newElement?: Element | null = null;
    private mouse: Vector | null = null;
    private maxDrawLength: number = 260;
    private animationRadius: number = 0;

    constructor(width = window.innerWidth, height = window.innerHeight) {
        const root: HTMLElement | null = document.getElementById("app");
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        if (root) {
            root.appendChild(canvas);

            this.canvas = canvas;
            this.resize(width, height);

            this.ctx = canvas.getContext("2d");

            for (let i = 0; i < 4; i++) {
                this.generateElement(i);
            }
        }
    }

    public resize(width: number, height: number) {
        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }

    private generateElement(i: number) {
        const radius = 30;
        if (this.canvas && this.ctx) {
            let x = genRandomNumber(radius, this.canvas.width - radius);
            let y = genRandomNumber(radius, this.ctx.canvas.height - radius);

            const vector = new Vector(x, y);

            let elementIsAvailable = this.elements.find((element: Element) => {
                return (
                    element.position.magnitude(vector) <=
                    element.radius + radius
                );
            });

            if (elementIsAvailable) {
                this.generateElement(i);
                return;
            } else {
                this.elements.push(new Element(vector, radius));
                return;
            }
        }
    }

    public draw(): void {
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.elements.forEach((element) => {
                this.drawCircle(
                    element.position,
                    element.radius,
                    element.color
                );
            });
            this.drawTrajectory();

            this.elements.forEach((element) => {
                this.detectElementsCollision(element);

                element.update();
            });
        }
    }

    private detectElementsCollision(el1: Element): void {
        let el2: Element;
        for (let i = 0; i < this.elements.length; i++) {
            el1 = this.elements[i];
            for (let j = i + 1; j < this.elements.length; j++) {
                el2 = this.elements[j];
                el1.move(el2);
            }
        }
    }

    private drawTrajectory() {
        if (this.newElement != null) {
            this.drawCircle(
                this.newElement.position,
                this.animationRadius,
                null,
                true
            );

            if (this.mouse) {
                this.drawLine(this.newElement.position, this.mouse, true);
            }
        }
    }

    private drawCircle(
        vector: Vector,
        radius: number,
        backgroundColor: string | null = "rgba(0,0,0,0)",
        dashed: boolean = false
    ) {
        if (!this.ctx) return;
        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = Colors.gray;

        this.ctx.arc(vector.x, vector.y, radius, 0, Math.PI * 2);

        if (dashed) {
            this.ctx.setLineDash([10]);
        }

        if (backgroundColor) {
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fill();
        }
        this.ctx.stroke();

        this.ctx.closePath();
        this.ctx.restore();
    }

    private drawLine(
        from: Vector,
        to: Vector,
        dashed: boolean = false,
        color: string = Colors.gray
    ) {
        if (this.ctx) {
            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.strokeStyle = color;

            if (dashed) {
                this.ctx.setLineDash([10, 5]);
            }

            this.ctx.lineWidth = 1;
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);

            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
        }
    }

    onMouseDown(e: MouseEvent): void {
        const position: Vector = new Vector(e.offsetX, e.offsetY);

        this.newElement = new Element(position, 30);

        Animator.animate(
            (state: number, isDone: boolean) => {
                if (!isDone) {
                    this.animationRadius = state;
                }
            },
            1000,
            {
                from: 0,
                to: this.newElement.radius,
            }
        );
    }

    onMouseMove(e: MouseEvent): void {
        if (!this.newElement) return;
        const pos: Vector = new Vector(e.offsetX, e.offsetY);
        const magnitude: number = this.newElement.position.magnitude(pos);
        const angle: number = this.newElement.position.direction(pos);

        if (magnitude > this.maxDrawLength) {
            this.mouse = this.newElement.position.getVectorWithRadius(
                this.maxDrawLength,
                angle
            );
        } else {
            this.mouse = pos;
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (!this.newElement) return;

        const position: Vector = new Vector(e.offsetX, e.offsetY);
        this.newElement.velocity = this.newElement.position
            .subtract(position)
            .divide(4);

        this.elements.push(this.newElement);

        this.newElement = null;
        this.animationRadius = 0;
        this.mouse = null;
    }
}

export default Canvas;
