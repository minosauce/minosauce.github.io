/* =========================================================
   Pagination Layout Stability

   Prevents vertical layout shift when switching pages.

   Applied to:
   1. About - Publications
   2. About - News
   3. /news/
   4. /publications/ - Journal
   5. /publications/ - Conference

   Strategy:
   - Measure every page invisibly.
   - Find the tallest page.
   - Set that height directly as min-height
     of the content area.
   ========================================================= */

function initializePaginationStability() {
  const targets = [];


  /* =======================================================
     About - Publications
     ======================================================= */

  document
    .querySelectorAll(
      "[data-publication-pagination]",
    )
    .forEach((container) => {
      const list =
        container.querySelector(
          "ol.bibliography",
        );

      if (!list) {
        return;
      }

      targets.push({
        list,
        itemSelector: ":scope > li",
        perPage:
          Number(
            container.dataset.perPage,
          ) || 5,
      });
    });


  /* =======================================================
     Full Publications Page
     Journal / Conference separately
     ======================================================= */

  document
    .querySelectorAll(
      "[data-publication-section]",
    )
    .forEach((section) => {
      const list =
        section.querySelector(
          "ol.bibliography",
        );

      if (!list) {
        return;
      }

      const pageContainer =
        section.closest(
          "[data-publications-pagination]",
        );

      targets.push({
        list,
        itemSelector: ":scope > li",
        perPage:
          Number(
            pageContainer?.dataset
              .perPage,
          ) || 5,
      });
    });


  /* =======================================================
     News
     About-News + /news/
     ======================================================= */

  document
    .querySelectorAll(
      "[data-news-pagination]",
    )
    .forEach((container) => {
      const list =
        container.querySelector(
          ".news-list-custom",
        );

      if (!list) {
        return;
      }

      targets.push({
        list,
        itemSelector:
          ":scope > .news-item",
        perPage:
          Number(
            container.dataset.perPage,
          ) || 5,
      });
    });


  /* =======================================================
     Remove duplicate targets
     ======================================================= */

  const uniqueTargets =
    targets.filter(
      (target, index, array) =>
        array.findIndex(
          (candidate) =>
            candidate.list ===
            target.list,
        ) === index,
    );


  /* =======================================================
     Measure tallest page
     ======================================================= */

  function measureTallestPage(
    list,
    itemSelector,
    perPage,
  ) {
    const originalWidth =
      list.getBoundingClientRect()
        .width;

    if (originalWidth <= 0) {
      return;
    }


    /*
     * Create an invisible clone so that
     * measurement does not affect the live page.
     */
    const clone =
      list.cloneNode(true);

    clone.removeAttribute("id");

    clone.setAttribute(
      "aria-hidden",
      "true",
    );

    clone.classList.add(
      "pagination-measurement-clone",
    );


    Object.assign(
      clone.style,
      {
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",

        left: "0",
        top: "0",

        width:
          `${originalWidth}px`,

        minHeight: "0",
        height: "auto",

        zIndex: "-9999",
      },
    );


    const parent =
      list.parentElement;

    if (!parent) {
      return;
    }

    parent.appendChild(clone);


    const items =
      Array.from(
        clone.querySelectorAll(
          itemSelector,
        ),
      );


    if (items.length === 0) {
      clone.remove();
      return;
    }


    /*
     * Remove any pagination-hidden state
     * from the cloned elements.
     */
    items.forEach((item) => {
      item.hidden = false;

      item.classList.remove(
        "publication-page-hidden",
        "about-publication-hidden",
        "news-page-hidden",
        "pagination-hidden",
      );

      item.style.removeProperty(
        "display",
      );
    });


    const totalPages =
      Math.ceil(
        items.length / perPage,
      );

    let maximumHeight = 0;


    /* =====================================================
       Measure each page independently
       ===================================================== */

    for (
      let page = 0;
      page < totalPages;
      page += 1
    ) {
      const start =
        page * perPage;

      const end =
        start + perPage;


      items.forEach(
        (item, index) => {
          const visible =
            index >= start &&
            index < end;

          if (visible) {
            item.hidden = false;

            item.style.removeProperty(
              "display",
            );
          } else {
            item.style.setProperty(
              "display",
              "none",
              "important",
            );
          }
        },
      );


      const height =
        clone.getBoundingClientRect()
          .height;


      maximumHeight =
        Math.max(
          maximumHeight,
          height,
        );
    }


    /*
     * Remove measurement clone.
     */
    clone.remove();


    /*
     * Use the tallest page height directly.
     *
     * This keeps the pagination control at
     * the same vertical position when the
     * user changes pages.
     */
       if (maximumHeight > 0) {
     const isPublicationList =
       list.matches("ol.bibliography");
   
     const extraHeight =
       isPublicationList ? 120 : 0;
   
     list.style.minHeight =
       `${Math.ceil(maximumHeight) + extraHeight}px`;
   }
  }


  /* =======================================================
     Measure all paginated sections
     ======================================================= */

  function updateAllHeights() {
    uniqueTargets.forEach(
      ({
        list,
        itemSelector,
        perPage,
      }) => {
        /*
         * Remove the previous measurement first
         * so it cannot affect re-measurement.
         */
        list.style.removeProperty(
          "min-height",
        );

        measureTallestPage(
          list,
          itemSelector,
          perPage,
        );
      },
    );
  }


  /* =======================================================
     Initial measurement
     ======================================================= */

  requestAnimationFrame(
    () => {
      requestAnimationFrame(
        updateAllHeights,
      );
    },
  );


  /* =======================================================
     Responsive resize
     ======================================================= */

  let resizeTimer = null;

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(
        resizeTimer,
      );

      resizeTimer =
        setTimeout(
          updateAllHeights,
          150,
        );
    },
  );


  /* =======================================================
     Re-measure after web fonts are ready
     ======================================================= */

  if (document.fonts?.ready) {
    document.fonts.ready.then(
      () => {
        updateAllHeights();
      },
    );
  }


  /* =======================================================
     Re-measure after all resources are loaded
     ======================================================= */

  window.addEventListener(
    "load",
    updateAllHeights,
    {
      once: true,
    },
  );
}


/* =========================================================
   Safe initialization
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializePaginationStability,
    {
      once: true,
    },
  );
} else {
  initializePaginationStability();
}
