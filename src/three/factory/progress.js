/**
 * Scroll progress lives outside React: the camera reads it every frame, and a
 * state update per scroll event would re-render the whole tree for nothing.
 */
let progress = 0
let visible = true

export const setProgress = (p) => {
  progress = p
}
export const getProgress = () => progress

export const setWorldVisible = (v) => {
  visible = v
}
export const getWorldVisible = () => visible
