document.addEventListener("DOMContentLoaded", () => {
  initializePageCarousels();
});


/* =========================================================
   Page Carousels

   Projects:
   6 projects per carousel page

   Repositories:
   6 repositories per carousel page
   ========================================================= */

function initializePageCarousels() {
  const carousels =
    document.querySelectorAll(
      "[data-page-carousel]",
    );

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


  /* =======================================================
     Settings
     ======================================================= */

  const itemsPerPage = 6;

  const items =
    Array.from(source.children);


  if (items.length === 0) {
    carousel.classList.add(
      "no-scroll",
    );

    return;
  }


  /* =======================================================
     Build 6-item pages
     ======================================================= */

  function buildPages() {
    track.innerHTML = "";


    for (
      let index = 0;
      index < items.length;
      index += itemsPerPage
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
          index + itemsPerPage,
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
     Scroll distance
     One complete 6-item page
     ======================================================= */

  function getScrollAmount() {
    const firstPage =
      track.querySelector(
        ".page-carousel-page",
      );

    if (!firstPage) {
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
      firstPage.getBoundingClientRect()
        .width + gap
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
     Previous page
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
     Next page
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
     Mouse / touch scrolling
     ======================================================= */

  track.addEventListener(
    "scroll",
    updateButtons,
    {
      passive: true,
    },
  );


  /* =======================================================
     Resize
     ======================================================= */

  window.addEventListener(
    "resize",
    () => {
      requestAnimationFrame(
        updateButtons,
      );
    },
  );


  /* =======================================================
     Initial build
     ======================================================= */

  buildPages();
}
