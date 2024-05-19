import { genRandomNumber } from "./utils";
import Element from "./element";
import Vector from "./vector";
import { Colors } from "./constants";
import Animator from "./animator";

class Canvas {
    ctx;
    elements = [];
    canvas;
    newElement = null;
    mouse = null;
    maxDrawLength = 260;
    animationRadius = 0;

    constructor(width = window.innerWidth, height = window.innerHeight) {
        const root = document.getElementById("app");
        const canvas = document.createElement("canvas");
        root.appendChild(canvas);

        this.canvas = canvas;
        this.resize(width, height);

        this.ctx = canvas.getContext("2d");

        for (let i = 0; i < 4; i++) {
            this.generateElement(i);
        }
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    generateElement(i) {
        const radius = 30;

        let x = genRandomNumber(radius, this.canvas.width - radius);
        let y = genRandomNumber(radius, this.ctx.canvas.height - radius);

        const vector = new Vector(x, y);

        let elementIsAvailable = this.elements.find((element) => {
            return (
                element.position.magnitude(vector) <= element.radius + radius
            );
        });

        if (elementIsAvailable) {
            return this.generateElement(i);
        } else {
            return this.elements.push(new Element(vector, radius));
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.elements.forEach((element) => {
            this.drawCircle(element.position, element.radius, element.color);
        });
        this.drawTrajectory();

        this.elements.forEach((element) => {
            this.detectElementsCollision(element);

            element.update();
        });
    }

    detectElementsCollision(el1) {
        let el2;
        for (let i = 0; i < this.elements.length; i++) {
            el1 = this.elements[i];
            for (let j = i + 1; j < this.elements.length; j++) {
                el2 = this.elements[j];
                el1.move(el2);
            }
        }
    }

    drawTrajectory() {
        if (this.newElement != null) {
            this.drawCircle(
                this.newElement.position,
                this.animationRadius,
                null,
                null,
                true
            );

            if (this.mouse !== null) {
                this.drawLine(this.newElement.position, this.mouse, true);
            }
        }
    }

    drawCircle(
        vector,
        radius,
        backgroundColor = "rgba(0,0,0,0)",
        borderColor = Colors.gray,
        dashed = false
    ) {
        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = borderColor;
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

    drawLine(from, to, dashed = false, color = Colors.gray) {
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

    onMouseDown(e) {
        const position = new Vector(e.offsetX, e.offsetY);

        this.newElement = new Element(position, 30);

        Animator.animate(
            (state, a) => {
                if (!a) {
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

    onMouseMove(e) {
        if (!this.newElement) return;
        const pos = new Vector(e.offsetX, e.offsetY);
        const magnitude = this.newElement.position.magnitude(pos);
        const angle = this.newElement.position.direction(pos);

        if (magnitude > this.maxDrawLength) {
            this.mouse = this.newElement.position.getVectorWithRadius(
                this.maxDrawLength,
                angle
            );
        } else {
            this.mouse = pos;
        }
    }

    onMouseUp(e) {
        const position = new Vector(e.offsetX, e.offsetY);

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
