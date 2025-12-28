export type SpotPos = { x: number; y: number }

// Default approximate positions (percent) for finger centers per hand.
// Edit these numbers to calibrate spots to your images.
export const left: SpotPos[] = [
  { x: 9, y: 47 },
  { x: 34, y: 36 },
  { x: 50, y: 32 },
  { x: 66, y: 38 },
  { x: 82, y: 54 },
]

export const right: SpotPos[] = [
  { x: 82, y: 50 },
  { x: 66, y: 36 },
  { x: 50, y: 32 },
  { x: 34, y: 38 },
  { x: 18, y: 54 },
]

export default { left, right }
