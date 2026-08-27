document.addEventListener("DOMContentLoaded", () => {
  initializePageCarousels();
});

/* =========================================================
   Page Carousels

   Desktop / Tablet:
   - 6 items per page

   Mobile:
   - 1 item per page
   - native horizontal swipe
   ========================================================= */

function initializePageCarousels() {
  const carousels =
    document.querySelectorAll("[data-page-carousel]");

  carousels.forEach((carousel) => {
    initializePageCarousel(carousel);
  });
}

function initializePageCarousel(carousel) {
  const source =
    carousel.querySelector(
      "[data-page-carousel-source]",
    );

  const track =
    carousel.querySelector(
      "[data-page-carousel-track]",
    );

  const previousButton =
    carousel.querySelector(
      ".page-carousel-prev",
    );

  const nextButton =
    carousel.querySelector(
      ".page-carousel-next",
    );

  if (
    !source ||
    !track ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  /*
   * Original card elements.
   * We keep references so they can be rebuilt
   * when the viewport changes.
   */
  const items = Array.from(source.children);

  if (items.length === 0) {
    carousel.classList.add("no-scroll");
    return;
  }

  let currentLayout = "";

  /* =======================================================
     Responsive layout
     ======================================================= */

  function getLayout() {
    if (window.innerWidth <= 576) {
      return {
        name: "mobile",
        itemsPerPage: 1,
      };
    }

    return {
      name: "desktop",
      itemsPerPage: 6,
    };
  }

  /* =======================================================
     Build pages
     ======================================================= */

  function buildPages(force = false) {
    const layout = getLayout();

    if (
      !force &&
      layout.name === currentLayout
    ) {
      return;
    }

    currentLayout = layout.name;

    /*
     * Existing generated pages are removed.
     * Original item references remain in `items`.
     */
    track.innerHTML = "";

    for (
      let index = 0;
      index < items.length;
      index += layout.itemsPerPage
    ) {
      const page =
        document.createElement("div");

      page.className =
        "page-carousel-page";

      const grid =
        document.createElement("div");

      grid.className =
        "page-carousel-page-grid";

      const pageItems =
        items.slice(
          index,
          index + layout.itemsPerPage,
        );

      pageItems.forEach((item) => {
        grid.appendChild(item);
      });

      page.appendChild(grid);
      track.appendChild(page);
    }

    track.scrollLeft = 0;

    requestAnimationFrame(
      updateButtons,
    );
  }

  /* =======================================================
     Scroll amount
     ======================================================= */

  function getScrollAmount() {
    const page =
      track.querySelector(
        ".page-carousel-page",
      );

    if (!page) {
      return track.clientWidth;
    }

    const trackStyle =
      window.getComputedStyle(track);

    const gap =
      parseFloat(
        trackStyle.columnGap ||
          trackStyle.gap,
      ) || 0;

    return (
      page.getBoundingClientRect().width +
      gap
    );
  }

  /* =======================================================
     Arrow state
     ======================================================= */

  function updateButtons() {
    const pages =
      track.querySelectorAll(
        ".page-carousel-page",
      );

    const hasMultiplePages =
      pages.length > 1;

    carousel.classList.toggle(
      "no-scroll",
      !hasMultiplePages,
    );

    if (!hasMultiplePages) {
      previousButton.disabled = true;
      nextButton.disabled = true;
      return;
    }

    const maxScrollLeft =
      track.scrollWidth -
      track.clientWidth;

    previousButton.disabled =
      track.scrollLeft <= 3;

    nextButton.disabled =
      track.scrollLeft >=
      maxScrollLeft - 3;
  }

  /* =======================================================
     Previous
     ======================================================= */

  previousButton.addEventListener(
    "click",
    () => {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    },
  );

  /* =======================================================
     Next
     ======================================================= */

  nextButton.addEventListener(
    "click",
    () => {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    },
  );

  /* =======================================================
     Native mobile swipe / track scroll
     ======================================================= */

  track.addEventListener(
    "scroll",
    updateButtons,
    {
      passive: true,
    },
  );

  /* =======================================================
     Responsive rebuild
     ======================================================= */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        buildPages();
      }, 150);
    },
  );

  /* =======================================================
     Initial build
     ======================================================= */

  buildPages(true);
}
