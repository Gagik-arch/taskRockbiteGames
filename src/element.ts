import { generateColor } from "./utils";
import Vector from "./vector";
import { gravity, restitution } from "./constants";

class Element {
    public velocity: Vector = new Vector(0, 0);
    public color: string;
    public position: Vector = new Vector(0, 0);
    public radius: number = 0;
    public mass: number = 0;

    constructor(vector: Vector, radius: number) {
        this.color = generateColor();
        this.position = vector;
        this.radius = radius;
        this.mass = 4 * Math.PI * this.radius ** 2;
    }

    update() {
        if (this.position.x + this.radius >= window.innerWidth) {
            this.velocity.x = -Math.abs(this.velocity.x) * restitution;
        } else if (this.position.x - this.radius <= 0) {
            this.velocity.x = Math.abs(this.velocity.x) * restitution;
        }
        if (this.position.y + this.radius >= window.innerHeight) {
            this.velocity.y = -this.velocity.y * restitution;
            this.position.y = window.innerHeight - this.radius;
        } else if (this.position.y - this.radius <= 0) {
            this.velocity.y = -this.velocity.y * restitution;
            this.position.y = this.radius;
        }

        this.velocity.y += gravity;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    move(element: Element) {
        const magnitude: number = this.position.magnitude(element.position);
        if (magnitude < this.radius + element.radius) {
            const nx: number =
                (element.position.x - this.position.x) / magnitude;
            const ny: number =
                (element.position.y - this.position.y) / magnitude;
            const p: number =
                (2 *
                    (this.velocity.x * nx +
                        this.velocity.y * ny -
                        element.velocity.x * nx -
                        element.velocity.y * ny)) /
                (this.mass + element.mass);

            const collisionVector = this.getCollisionPoint(element);

            this.position.x =
                collisionVector.x +
                (this.radius * (this.position.x - element.position.x)) /
                    magnitude;
            this.position.y =
                collisionVector.y +
                (this.radius * (this.position.y - element.position.y)) /
                    magnitude;
            element.position.x =
                collisionVector.x +
                (element.radius * (element.position.x - this.position.x)) /
                    magnitude;
            element.position.y =
                collisionVector.y +
                (element.radius * (element.position.y - this.position.y)) /
                    magnitude;

            this.velocity.x -= p * this.mass * nx;
            this.velocity.y -= p * this.mass * ny;
            element.velocity.x += p * element.mass * nx;
            element.velocity.y += p * element.mass * ny;
        }
    }

    getCollisionPoint(element: Element): Vector {
        const x: number =
            (this.position.x * element.radius +
                element.position.x * this.radius) /
            (this.radius + element.radius);

        const y =
            (this.position.y * element.radius +
                element.position.y * this.radius) /
            (this.radius + element.radius);

        return new Vector(x, y);
    }
}

export default Element;
