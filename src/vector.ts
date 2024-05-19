import CMath from "./math";

class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector = new Vector(0, 0)): Vector {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    multiply(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Vector {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    dotProduct(vector: Vector): number {
        return this.x * vector.x + this.y * vector.y;
    }

    normalize(vector = new Vector(0, 0)): Vector {
        const magnitude: number = this.magnitude(vector);
        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    magnitude(vector: Vector = new Vector(0, 0)): number {
        let dx: number = vector.x - this.x;
        let dy: number = vector.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    direction(vector: Vector): number {
        const result =
            (Math.atan2(vector.y - this.y, vector.x - this.x) * 180) / Math.PI;

        return result > 0 ? result : 360 + result;
    }

    getInvertedVector(vector: Vector): Vector {
        const zeroChanged = vector.subtract(this);
        return this.add(new Vector(-zeroChanged.x, -zeroChanged.y));
    }

    getVectorWithRadius(radius: number, angle: number): Vector {
        angle = CMath.degreeToRadian(-angle);

        return new Vector(
            this.x + radius * Math.cos(angle),
            this.y + -radius * Math.sin(angle)
        );
    }
}

export default Vector;
