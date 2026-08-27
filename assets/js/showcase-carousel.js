document.addEventListener("DOMContentLoaded", () => {
  initializePagedCarousels();
  initializePublicationPagination();
});


/* =========================================================
   Responsive paged carousels
   ========================================================= */

function initializePagedCarousels() {
  const carousels = document.querySelectorAll(
    "[data-paged-carousel]",
  );

  carousels.forEach((carousel) => {
    initializePagedCarousel(carousel);
  });
}


function initializePagedCarousel(carousel) {
  const source = carousel.querySelector(
    "[data-carousel-source]",
  );

  const track = carousel.querySelector(
    "[data-carousel-track]",
  );

  const previousButton = carousel.querySelector(
    ".showcase-prev",
  );

  const nextButton = carousel.querySelector(
    ".showcase-next",
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
   * Keep references to the original elements.
   * They are moved into responsive pages by JavaScript.
   */

  const items = Array.from(source.children);

  if (items.length === 0) {
    previousButton.hidden = true;
    nextButton.hidden = true;

    return;
  }


  let currentLayout = "";


  function getLayout() {
    const width = window.innerWidth;

    if (width <= 576) {
      return {
        name: "mobile",
        itemsPerPage:
          Number(carousel.dataset.mobileItems) || 1,
        columns:
          Number(carousel.dataset.mobileColumns) || 1,
      };
    }

    if (width <= 991) {
      return {
        name: "tablet",
        itemsPerPage:
          Number(carousel.dataset.tabletItems) || 2,
        columns:
          Number(carousel.dataset.tabletColumns) || 2,
      };
    }

    return {
      name: "desktop",
      itemsPerPage:
        Number(carousel.dataset.desktopItems) || 3,
      columns:
        Number(carousel.dataset.desktopColumns) || 3,
    };
  }


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
     * Remove existing generated pages.
     * Original item references are preserved above.
     */

    track.innerHTML = "";


    /*
     * Create responsive pages.
     */

    for (
      let index = 0;
      index < items.length;
      index += layout.itemsPerPage
    ) {
      const page = document.createElement("div");

      page.className = "showcase-page";

      page.style.setProperty(
        "--showcase-columns",
        layout.columns,
      );


      const grid = document.createElement("div");

      grid.className = "showcase-page-grid";


      const pageItems = items.slice(
        index,
        index + layout.itemsPerPage,
      );

      pageItems.forEach((item) => {
        grid.appendChild(item);
      });


      page.appendChild(grid);
      track.appendChild(page);
    }


    carousel.classList.add("is-enhanced");

    track.scrollLeft = 0;

    requestAnimationFrame(() => {
      updateButtons();
    });
  }


  function getScrollAmount() {
    const firstPage = track.querySelector(
      ".showcase-page",
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
      firstPage.getBoundingClientRect().width +
      gap
    );
  }


  function updateButtons() {
    const maximumScroll =
      track.scrollWidth - track.clientWidth;

    const hasMultiplePages =
      track.querySelectorAll(
        ".showcase-page",
      ).length > 1;


    previousButton.hidden =
      !hasMultiplePages;

    nextButton.hidden =
      !hasMultiplePages;


    if (!hasMultiplePages) {
      return;
    }


    previousButton.disabled =
      track.scrollLeft <= 3;

    nextButton.disabled =
      track.scrollLeft >=
      maximumScroll - 3;
  }


  /* =======================================================
     Arrow navigation
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
     Track scrolling / mobile swipe
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


  /*
   * Initial build.
   */

  buildPages(true);
}


/* =========================================================
   About Publications Pagination
   Five publications per page
   ========================================================= */

function initializePublicationPagination() {
  const publicationSections =
    document.querySelectorAll(
      "[data-publication-pagination]",
    );

  publicationSections.forEach((section) => {
    const bibliography =
      section.querySelector(
        "ol.bibliography",
      );

    if (!bibliography) {
      return;
    }


    const publications = Array.from(
      bibliography.querySelectorAll(
        ":scope > li",
      ),
    );

    if (publications.length === 0) {
      return;
    }


    const itemsPerPage =
      Number(section.dataset.perPage) || 5;

    const totalPages = Math.ceil(
      publications.length /
        itemsPerPage,
    );


    /*
     * No pagination required for five
     * or fewer publications.
     */

    if (totalPages <= 1) {
      return;
    }


    let currentPage = 1;


    const pagination =
      document.createElement("nav");

    pagination.className =
      "publication-pagination";

    pagination.setAttribute(
      "aria-label",
      "Publication pages",
    );


    /* =====================================================
       Previous button
       ===================================================== */

    const previousButton =
      document.createElement("button");

    previousButton.type = "button";

    previousButton.className =
      "publication-pagination-arrow";

    previousButton.innerHTML = "‹";

    previousButton.setAttribute(
      "aria-label",
      "Previous publication page",
    );

    pagination.appendChild(
      previousButton,
    );


    /* =====================================================
       Page numbers
       ===================================================== */

    const pageButtons = [];

    for (
      let page = 1;
      page <= totalPages;
      page += 1
    ) {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "publication-pagination-number";

      button.dataset.page = page;

      button.textContent = page;

      button.setAttribute(
        "aria-label",
        `Publication page ${page}`,
      );

      pagination.appendChild(button);

      pageButtons.push(button);
    }


    /* =====================================================
       Next button
       ===================================================== */

    const nextButton =
      document.createElement("button");

    nextButton.type = "button";

    nextButton.className =
      "publication-pagination-arrow";

    nextButton.innerHTML = "›";

    nextButton.setAttribute(
      "aria-label",
      "Next publication page",
    );

    pagination.appendChild(
      nextButton,
    );


    section.appendChild(pagination);


    /* =====================================================
       Render requested publication page
       ===================================================== */

    function renderPublicationPage(
      page,
      shouldScroll = false,
    ) {
      currentPage = page;


      const start =
        (currentPage - 1) *
        itemsPerPage;

      const end =
        start + itemsPerPage;


      publications.forEach(
        (publication, index) => {
          const visible =
            index >= start &&
            index < end;

          publication.hidden = !visible;

          publication.style.display =
            visible ? "" : "none";
        },
      );


      /*
       * Active page number
       */

      pageButtons.forEach((button) => {
        const pageNumber =
          Number(button.dataset.page);

        const active =
          pageNumber === currentPage;

        button.classList.toggle(
          "active",
          active,
        );

        if (active) {
          button.setAttribute(
            "aria-current",
            "page",
          );
        } else {
          button.removeAttribute(
            "aria-current",
          );
        }
      });


      /*
       * Arrow availability
       */

      previousButton.disabled =
        currentPage === 1;

      nextButton.disabled =
        currentPage === totalPages;


      /*
       * Smoothly return to Publications
       * after changing page.
       */

      if (shouldScroll) {
        const parentSection =
          section.closest(
            ".about-showcase-section",
          );

        if (parentSection) {
          parentSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }


    /* =====================================================
       Page number events
       ===================================================== */

    pageButtons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const page =
            Number(button.dataset.page);

          renderPublicationPage(
            page,
            true,
          );
        },
      );
    });


    /* =====================================================
       Previous / Next events
       ===================================================== */

    previousButton.addEventListener(
      "click",
      () => {
        if (currentPage > 1) {
          renderPublicationPage(
            currentPage - 1,
            true,
          );
        }
      },
    );


    nextButton.addEventListener(
      "click",
      () => {
        if (
          currentPage < totalPages
        ) {
          renderPublicationPage(
            currentPage + 1,
            true,
          );
        }
      },
    );


    /*
     * Initial page = latest publications.
     */

    renderPublicationPage(1);
  });
}
