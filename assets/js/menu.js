// =========================================================
// NOVOPIXEL - MENU MOBILE (hambúrguer)
// =========================================================

(() => {

    const toggle = document.getElementById("menuToggle");
    const overlay = document.getElementById("menuOverlay");
    const navWrapper = document.getElementById("navWrapper");

    if (!toggle || !navWrapper) return; // evita erro se os elementos não existirem

    function openMenu() {
        document.body.classList.add("menu-open");
        toggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
        const isOpen = document.body.classList.contains("menu-open");
        isOpen ? closeMenu() : openMenu();
    }

    // Clique no botão hambúrguer
    toggle.addEventListener("click", toggleMenu);

    // Clique fora do menu (overlay) fecha o menu
    if (overlay) {
        overlay.addEventListener("click", closeMenu);
    }

    // Fecha o menu ao clicar em qualquer link dentro dele
    navWrapper.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Fecha o menu ao pressionar ESC
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    // Fecha o menu automaticamente se a tela for redimensionada
    // para um tamanho de desktop (evita bug de menu "preso" aberto)
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeMenu();
    });

})();
