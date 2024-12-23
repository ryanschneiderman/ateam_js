// Define a function to generate a random integer between min (inclusive) and max (inclusive)
export function ran(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}