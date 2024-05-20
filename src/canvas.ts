import { genRandomNumber } from "./utils";
import Element from "./element";
import Vector from "./vector";
import { Colors } from "./constants";
import Animator from "./animator";
import CMath from "./math";

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

            this.elementGenerator();
        }
    }

    public elementGenerator(quantity: number = 4): void {
        const count = quantity - this.elements.length;

        if (quantity < this.elements.length) {
            this.elements = this.elements.splice(0, quantity);
        } else {
            for (let i = 0; i < count; i++) {
                this.generateElement(i);
            }
        }
    }

    private generateElement(i: number) {
        if (this.canvas) {
            const R: number = genRandomNumber(20, 40);
            let x: number = genRandomNumber(R, this.canvas.width - R);
            let y: number = genRandomNumber(R, this.canvas.height - R);

            const vector: Vector = new Vector(x, y);

            const elementIsAvailable: Element | undefined = this.elements.find(
                (element: Element) => {
                    return (
                        element.position.magnitude(vector) <= element.radius + R
                    );
                }
            );

            if (elementIsAvailable) {
                this.generateElement(i);
                return;
            } else {
                this.elements.push(new Element(vector, R));
                return;
            }
        }
    }

    public resize(width: number, height: number) {
        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
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
            this.ctx.fillStyle = "rgba(0,0,0,0.8)";

            this.ctx.font = "20px serif";
            this.ctx.fillText(
                `Balls quantity ${this.elements.length.toString()}`,
                10,
                30
            );

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

    private drawTrajectory(): void {
        if (this.newElement != null) {
            this.drawCircle(
                this.newElement.position,
                this.animationRadius,
                null,
                true
            );

            if (this.mouse) {
                this.drawLine(this.newElement.position, this.mouse, true);
                const aim = this.newElement.position.getInvertedVector(
                    this.mouse
                );

                this.drawArrow(this.newElement.position, aim, 6);
            }
        }
    }

    drawArrow(v1: Vector, v2: Vector, headLength: number) {
        if (!this.ctx) return;

        const degreesInRadians225: number = CMath.degreeToRadian(225);
        const degreesInRadians135: number = CMath.degreeToRadian(135);

        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        const angle = Math.atan2(dy, dx);

        const x225 = v2.x + headLength * Math.cos(angle + degreesInRadians225);
        const y225 = v2.y + headLength * Math.sin(angle + degreesInRadians225);
        const x135 = v2.x + headLength * Math.cos(angle + degreesInRadians135);
        const y135 = v2.y + headLength * Math.sin(angle + degreesInRadians135);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.setLineDash([6]);
        this.ctx.strokeStyle = Colors.gray;
        this.ctx.moveTo(v1.x, v1.y);
        this.ctx.lineTo(v2.x, v2.y);
        this.ctx.moveTo(v2.x, v2.y);
        this.ctx.lineTo(x225, y225);
        this.ctx.moveTo(v2.x, v2.y);
        this.ctx.lineTo(x135, y135);
        this.ctx.stroke();
        this.ctx.restore();
    }

    private drawCircle(
        vector: Vector,
        radius: number,
        backgroundColor: string | null = "rgba(0,0,0,0)",
        dashed: boolean = false
    ): void {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = Colors.gray;

        this.ctx.arc(vector.x, vector.y, radius, 0, Math.PI * 2);

        if (dashed) {
            this.ctx.setLineDash([6]);
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
    ): void {
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
        if (!this.canvas) return;
        const radius: number = genRandomNumber(20, 40);
        const x: number = Math.max(
            radius,
            Math.min(e.offsetX, this.canvas.width - radius)
        );

        const y: number = Math.max(
            radius,
            Math.min(e.offsetY, this.canvas.height - radius)
        );

        const position: Vector = new Vector(x, y);

        this.newElement = new Element(position, radius);

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
