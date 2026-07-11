export function bootstrap(element: HTMLElement) {

    const canvas = document.createElement('canvas');

    canvas.id = 'game-view'

    const ctx = canvas.getContext('2d');

    if(!ctx) {
        throw new Error("No 2d context")
    }

    setCanvasSize(canvas)

    window.addEventListener('resize', setCanvasSize.bind(null, canvas))
    element.appendChild(canvas)

    return {canvas, ctx};
}

function setCanvasSize(canvas: HTMLCanvasElement) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio;
    ctx?.scale(dpr, dpr)
}
