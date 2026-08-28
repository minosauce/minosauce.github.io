/* =========================================================
   Pagination Layout Stability

   Applied to:
   1. About - Publications
   2. About - News
   3. /news/
   4. /publications/ - Journal
   5. /publications/ - Conference

   Publications:
   - Keep each publication at its natural height.
   - Measure every 5-item page invisibly.
   - Use the tallest page as the list min-height.
   - A short last page therefore leaves empty space only
     below the publications, instead of spreading items apart.

   News:
   - Measure every page invisibly.
   - Use the tallest page as the list min-height.
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
        type: "publication",

        list,

        itemSelector:
          ":scope > li",

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
        type: "publication",

        list,

        itemSelector:
          ":scope > li",

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
        type: "news",

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
     Reset old publication slot styles

     이전 virtual-slot 방식에서 넣었던
     min-height / flex-basis / margin 등을 제거한다.
     ======================================================= */

  function resetPublicationLayout(
    list,
    itemSelector,
  ) {
    list.style.removeProperty(
      "min-height",
    );

    list.style.removeProperty(
      "height",
    );

    list.style.removeProperty(
      "flex-direction",
    );

    list.style.removeProperty(
      "justify-content",
    );

    list.style.removeProperty(
      "gap",
    );


    const items =
      Array.from(
        list.querySelectorAll(
          itemSelector,
        ),
      );


    items.forEach((item) => {
      item.style.removeProperty(
        "min-height",
      );

      item.style.removeProperty(
        "height",
      );

      item.style.removeProperty(
        "flex-basis",
      );

      item.style.removeProperty(
        "flex-grow",
      );

      item.style.removeProperty(
        "flex-shrink",
      );

      item.style.removeProperty(
        "box-sizing",
      );

      item.style.removeProperty(
        "margin-top",
      );

      item.style.removeProperty(
        "margin-bottom",
      );
    });
  }


  /* =======================================================
     Create invisible measurement clone
     ======================================================= */

  function createMeasurementClone(
    list,
  ) {
    const originalWidth =
      list.getBoundingClientRect()
        .width;


    if (originalWidth <= 0) {
      return null;
    }


    const parent =
      list.parentElement;


    if (!parent) {
      return null;
    }


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


    /*
     * 실제 페이지에는 영향을 주지 않는
     * invisible measurement copy.
     */
    clone.style.setProperty(
      "position",
      "absolute",
      "important",
    );

    clone.style.setProperty(
      "visibility",
      "hidden",
      "important",
    );

    clone.style.setProperty(
      "pointer-events",
      "none",
      "important",
    );

    clone.style.setProperty(
      "left",
      "0",
      "important",
    );

    clone.style.setProperty(
      "top",
      "0",
      "important",
    );

    clone.style.setProperty(
      "width",
      `${originalWidth}px`,
      "important",
    );

    clone.style.setProperty(
      "min-height",
      "0",
      "important",
    );

    clone.style.setProperty(
      "height",
      "auto",
      "important",
    );

    /*
     * 기존 space-between CSS가
     * clone 측정에 영향을 주지 않도록
     * 일반 block layout으로 측정.
     */
    clone.style.setProperty(
      "display",
      "block",
      "important",
    );

    clone.style.setProperty(
      "z-index",
      "-9999",
      "important",
    );


    parent.appendChild(clone);


    return clone;
  }


  /* =======================================================
     Prepare clone items
     ======================================================= */

  function prepareItemsForMeasurement(
    items,
  ) {
    items.forEach((item) => {
      /*
       * Pagination script가 적용한
       * 숨김 상태를 clone에서 전부 제거.
       */
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


      /*
       * 과거 virtual-slot 방식에서
       * 남아 있을 수 있는 inline style 제거.
       */
      item.style.removeProperty(
        "min-height",
      );

      item.style.removeProperty(
        "height",
      );

      item.style.removeProperty(
        "flex-basis",
      );

      item.style.removeProperty(
        "flex-grow",
      );

      item.style.removeProperty(
        "flex-shrink",
      );
    });
  }


  /* =======================================================
     Measure tallest natural page

     핵심:
     - publication 하나하나의 높이는 건드리지 않는다.
     - 현재 CSS의 자연스러운 margin과 줄바꿈을 그대로 사용.
     - 오직 가장 높은 "페이지 전체 높이"만 측정한다.
     ======================================================= */

  function measureTallestPage(
    list,
    itemSelector,
    perPage,
  ) {
    const clone =
      createMeasurementClone(
        list,
      );


    if (!clone) {
      return 0;
    }


    const items =
      Array.from(
        clone.querySelectorAll(
          itemSelector,
        ),
      );


    if (
      items.length === 0
    ) {
      clone.remove();

      return 0;
    }


    prepareItemsForMeasurement(
      items,
    );


    const totalPages =
      Math.ceil(
        items.length / perPage,
      );


    let maximumPageHeight = 0;


    /* =====================================================
       각 page를 하나씩 측정
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


      const pageHeight =
        clone.getBoundingClientRect()
          .height;


      maximumPageHeight =
        Math.max(
          maximumPageHeight,
          pageHeight,
        );
    }


    clone.remove();


    return Math.ceil(
      maximumPageHeight,
    );
  }


  /* =======================================================
     Publications stability
     ======================================================= */

  function stabilizePublications(
    list,
    itemSelector,
    perPage,
  ) {
    /*
     * 이전 virtual slot 관련 inline CSS
     * 전부 제거.
     */
    resetPublicationLayout(
      list,
      itemSelector,
    );


    const liveItems =
      Array.from(
        list.querySelectorAll(
          itemSelector,
        ),
      );


    /*
     * 전체 논문 수가 5개 이하라면
     * pagination도 없으므로
     * 높이 고정 자체가 필요 없다.
     */
    if (
      liveItems.length <= perPage
    ) {
      return;
    }


    const maximumPageHeight =
      measureTallestPage(
        list,
        itemSelector,
        perPage,
      );


    if (
      maximumPageHeight <= 0
    ) {
      return;
    }


    /*
     * 중요:
     *
     * space-between을 사용하지 않는다.
     *
     * publication은 원래 document flow대로
     * 위에서 아래로 자연스럽게 배치한다.
     */
    list.style.setProperty(
      "display",
      "block",
      "important",
    );


    /*
     * 가장 높은 페이지의 전체 높이만
     * min-height로 확보한다.
     *
     * 예:
     *
     * 5개 페이지
     *
     * [논문]
     * [논문]
     * [논문]
     * [논문]
     * [논문]
     *
     *
     * 3개 페이지
     *
     * [논문]
     * [논문]
     * [논문]
     *
     * [빈 공간]
     * [빈 공간]
     *
     *
     * 실제 논문 사이 간격은 동일하게 유지된다.
     */
    list.style.setProperty(
      "min-height",
      `${maximumPageHeight}px`,
    );
  }


  /* =======================================================
     News stability
     ======================================================= */

  function stabilizeNews(
    list,
    itemSelector,
    perPage,
  ) {
    /*
     * 재측정 전에 이전 min-height 제거.
     */
    list.style.removeProperty(
      "min-height",
    );


    const liveItems =
      Array.from(
        list.querySelectorAll(
          itemSelector,
        ),
      );


    if (
      liveItems.length <= perPage
    ) {
      return;
    }


    const maximumPageHeight =
      measureTallestPage(
        list,
        itemSelector,
        perPage,
      );


    if (
      maximumPageHeight <= 0
    ) {
      return;
    }


    /*
     * News는 기존 방식 그대로
     * 가장 높은 페이지 높이를 사용.
     */
    list.style.setProperty(
      "min-height",
      `${maximumPageHeight}px`,
    );
  }


  /* =======================================================
     Measure / update everything
     ======================================================= */

  function updateAllHeights() {
    uniqueTargets.forEach(
      ({
        type,
        list,
        itemSelector,
        perPage,
      }) => {


        /* --------------------------------------------------
           Publications
           -------------------------------------------------- */

        if (
          type ===
          "publication"
        ) {
          stabilizePublications(
            list,
            itemSelector,
            perPage,
          );

          return;
        }


        /* --------------------------------------------------
           News
           -------------------------------------------------- */

        stabilizeNews(
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
     Re-measure after fonts are ready
     ======================================================= */

  if (
    document.fonts?.ready
  ) {
    document.fonts.ready.then(
      () => {
        updateAllHeights();
      },
    );
  }


  /* =======================================================
     Re-measure after all resources loaded
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
