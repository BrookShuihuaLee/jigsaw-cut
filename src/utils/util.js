export async function loadImageAsync(src) {
    return new Promise(r => {
        const img = new Image()
        img.onload = () => r(img)
        img.src = src
    })
}

export function cloneCanvas(canvas) {
    const c = document.createElement('canvas')
    c.width = canvas.width
    c.height = canvas.height
    const ctx = c.getContext('2d')
    ctx.drawImage(canvas, 0, 0)
    return c
}

export function parseIntWithDefault(v, defaultV = -1) {
    v = parseInt(v)
    if (isNaN(v)) v = defaultV
    return v
}