class CMath {
    static radianToDegree(radian: number): number {
        return (180 / Math.PI) * radian;
    }
    static degreeToRadian(degree: number): number {
        return degree * (Math.PI / 180);
    }
}

export default CMath;
