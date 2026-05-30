export type Point3 = [number, number, number];

export type PlayerLayout = {
    cardPositions: [Point3, Point3];
    chipPosition: Point3;
    labelPosition: Point3;
};

const seatPositions: Record<number, Point3> = {
    1: [0, 0.04, 2.05],
    2: [-2.15, 0.04, 1.05],
    3: [-2.15, 0.04, -1.05],
    4: [0, 0.04, -2.05],
    5: [2.15, 0.04, -1.05],
    6: [2.15, 0.04, 1.05],
};

export const deckPosition: Point3 = [-0.95, 0.06, 0];
export const potPosition: Point3 = [0, 0.08, 0];
export const muckPosition: Point3 = [1.15, 0.06, 0];

export function boardPosition(index: number): Point3 {
    return [-0.72 + index * 0.36, 0.06, 1.2];
}

export function playerLayout(seat: number): PlayerLayout {
    const base = seatPositions[seat] ?? seatPositions[1];
    const horizontal = Math.abs(base[0]) > 1;
    const gap: Point3 = horizontal ? [0, 0, 0.28] : [0.28, 0, 0];

    return {
        cardPositions: [
            [base[0] - gap[0] / 2, base[1], base[2] - gap[2] / 2],
            [base[0] + gap[0] / 2, base[1], base[2] + gap[2] / 2],
        ],
        chipPosition: [base[0] * 0.68, 0.08, base[2] * 0.68],
        labelPosition: [base[0], 0.28, base[2]],
    };
}
