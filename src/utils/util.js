export async function loadImageAsync(src) {
    return new Promise(r => {
        const img = new Image()
        img.onload = () => r(img)
        img.src = src
    })
}