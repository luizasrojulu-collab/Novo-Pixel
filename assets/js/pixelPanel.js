// =========================================================
// CONFIGURAÇÃO DO CANVAS DO PAINEL
// =========================================================

function initPixelPanel() {

    const pixelCanvas = document.getElementById("pixelGrid");
    if (!pixelCanvas) return; // evita erro se o elemento não existir ainda

    const pixelCtx = pixelCanvas.getContext("2d");

    // Tamanho de cada quadrado da grade
    const pixelSquareSize = 18;

    const pixelGrid = [];

    // =========================================================
    // AJUSTE DE TAMANHO (com suporte a telas de alta resolução)
    // =========================================================

    function resizePixelCanvas() {

        const rect = pixelCanvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Buffer real do canvas em pixels físicos
        pixelCanvas.width = rect.width * dpr;
        pixelCanvas.height = rect.height * dpr;

        // Escala o contexto para desenhar em unidades CSS
        pixelCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Recria a grade usando o tamanho em CSS pixels
        initPixelGrid(rect.width, rect.height);

    }

    // =========================================================
    // INICIALIZAÇÃO DA GRADE
    // =========================================================

    function initPixelGrid(width, height) {

        pixelGrid.length = 0;

        // Evita loop infinito/grade vazia se o painel ainda não tiver tamanho
        if (!width || !height) return;

        for (let x = 0; x < width; x += pixelSquareSize) {
            for (let y = 0; y < height; y += pixelSquareSize) {

                pixelGrid.push({
                    x,
                    y,
                    alpha: 0,
                    fading: false,
                    nextTrigger: Math.random() * 4000
                });

            }
        }

    }

    // =========================================================
    // DESENHO DA GRADE
    // =========================================================

    let pixelLastFrame = Date.now();

    function drawPixelGrid() {

        const now = Date.now();
        const delta = now - pixelLastFrame;
        pixelLastFrame = now;

        const dpr = window.devicePixelRatio || 1;
        const cssWidth = pixelCanvas.width / dpr;
        const cssHeight = pixelCanvas.height / dpr;

        pixelCtx.clearRect(0, 0, cssWidth, cssHeight);

        for (let i = 0; i < pixelGrid.length; i++) {

            const cell = pixelGrid[i];

            cell.nextTrigger -= delta;

            if (cell.nextTrigger <= 0 && cell.alpha === 0) {
                cell.alpha = 1;
                cell.fading = false;
                cell.nextTrigger = 1500 + Math.random() * 4500;
            }

            if (cell.alpha >= 1 && !cell.fading) {
                cell.fading = true;
            }

            if (cell.fading) {
                cell.alpha -= 0.012;
                if (cell.alpha <= 0) {
                    cell.alpha = 0;
                    cell.fading = false;
                }
            }

            if (cell.alpha > 0) {

                const centerX = cell.x + pixelSquareSize / 2;
                const centerY = cell.y + pixelSquareSize / 2;

                const gradient = pixelCtx.createRadialGradient(
                    centerX, centerY, 1,
                    centerX, centerY, pixelSquareSize
                );

                gradient.addColorStop(0, `rgba(0, 229, 195, ${cell.alpha * 0.55})`);
                gradient.addColorStop(1, `rgba(0, 229, 195, 0)`);

                pixelCtx.fillStyle = gradient;
                pixelCtx.fillRect(cell.x, cell.y, pixelSquareSize, pixelSquareSize);

                pixelCtx.strokeStyle = `rgba(0, 229, 195, ${cell.alpha * 0.5})`;
                pixelCtx.lineWidth = 1;
                pixelCtx.strokeRect(
                    cell.x + 0.5,
                    cell.y + 0.5,
                    pixelSquareSize - 1,
                    pixelSquareSize - 1
                );

            }

        }

        requestAnimationFrame(drawPixelGrid);

    }

    // =========================================================
    // RESIZE COM DEBOUNCE
    // =========================================================

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizePixelCanvas, 150);
    });

    resizePixelCanvas();
    drawPixelGrid();

}

// Garante que o DOM já existe antes de rodar
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPixelPanel);
} else {
    initPixelPanel();
}