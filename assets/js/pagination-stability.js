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
   - Set that height as min-height of the content area.
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


  /*
   * 중복 target 제거
   */
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
     Make one measurement copy
     ======================================================= */

  function measureTallestPage(
    list,
    itemSelector,
    perPage,
  ) {
    const originalWidth =
      list.getBoundingClientRect()
        .width;

    if (
      originalWidth <= 0
    ) {
      return;
    }


    /*
     * 실제 화면을 건드리지 않고
     * 같은 위치/같은 CSS context에서
     * invisible clone으로 측정
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


    if (
      items.length === 0
    ) {
      clone.remove();
      return;
    }


    /*
     * 기존 pagination JS가 적용한
     * 숨김 상태를 clone에서는 전부 해제
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


    /*
     * 각 page를 하나씩 실제 rendering해서
     * 높이를 측정
     */
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


    clone.remove();


if (maximumHeight > 0) {
  /*
   * tallest page 높이를 그대로 예약하면
   * 마지막 페이지에서 빈 공간이 너무 커지므로
   * 약 6rem만큼 예약 높이를 줄인다.
   *
   * 실제 content가 이보다 높으면
   * CSS가 자동으로 늘어나므로 내용이 잘리지는 않는다.
   */
  const rootFontSize =
    parseFloat(
      getComputedStyle(
        document.documentElement
      ).fontSize
    ) || 16;

  const reduction =
    6 * rootFontSize;

  const stableHeight =
    Math.max(
      0,
      Math.ceil(maximumHeight) -
        reduction
    );

  list.style.minHeight =
    `${stableHeight}px`;
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
         * 이전 측정값이 width 계산에
         * 영향을 주지 않도록 일시 해제
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


  /*
   * 최초 측정
   */
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
     Web font rendering 완료 후 재측정
     ======================================================= */

  if (document.fonts?.ready) {
    document.fonts.ready.then(
      () => {
        updateAllHeights();
      },
    );
  }


  /*
   * 이미지 등 모든 resource가 로드된 뒤
   * 마지막으로 한 번 재측정
   */
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
