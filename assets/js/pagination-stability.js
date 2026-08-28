/* =========================================================
   Pagination Layout Stability

   Publications:
   - Use fixed virtual publication slots.
   - Each page always occupies 5 publication slots.
   - If a page contains fewer than 5 publications,
     the remaining slots stay empty at the bottom.
   - Pagination therefore stays at the same Y position.
   - Publications themselves do NOT spread apart.

   News:
   - Measure every page.
   - Use the tallest page as min-height.

   Applied to:
   1. About - Publications
   2. About - News
   3. /news/
   4. /publications/ - Journal
   5. /publications/ - Conference
   ========================================================= */


/*
 * Publication 하나의 slot 아래쪽에
 * 추가할 기본 여백.
 *
 * 1.0  = 좁게
 * 1.25 = 추천
 * 1.5  = 조금 넓게
 * 2.0  = 많이 넓게
 */
const PUBLICATION_SLOT_GAP_REM = 1.0;


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
     Utility
     ======================================================= */

  function getRootFontSize() {
    return (
      parseFloat(
        getComputedStyle(
          document.documentElement,
        ).fontSize,
      ) || 16
    );
  }


  /* =======================================================
     Reset JS-generated publication layout

     resize 후 다시 측정할 때 이전 slot 크기가
     새 측정에 영향을 주지 않도록 한다.
     ======================================================= */

  function resetPublicationLayout(
    list,
    itemSelector,
  ) {
    list.style.removeProperty(
      "min-height",
    );

    list.style.removeProperty(
      "display",
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
     Publications
     Fixed virtual slot system
     ======================================================= */

  function measurePublicationSlots(
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


    const liveItems =
      Array.from(
        list.querySelectorAll(
          itemSelector,
        ),
      );


    if (
      liveItems.length === 0
    ) {
      return;
    }


    /*
     * Publication이 perPage 이하라면
     * pagination 자체가 필요 없으므로
     * 굳이 5개 slot 높이를 만들지 않는다.
     */
    if (
      liveItems.length <= perPage
    ) {
      return;
    }


    /* -----------------------------------------------------
       Invisible measurement clone
       ----------------------------------------------------- */

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


    /*
     * 기존 CSS의
     *
     * display:flex;
     * justify-content:space-between;
     *
     * 같은 설정이 측정에 영향을 주지 않도록
     * clone은 일반 block layout으로 측정.
     */
    clone.style.setProperty(
      "display",
      "block",
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


    const parent =
      list.parentElement;


    if (!parent) {
      return;
    }


    parent.appendChild(clone);


    const cloneItems =
      Array.from(
        clone.querySelectorAll(
          itemSelector,
        ),
      );


    if (
      cloneItems.length === 0
    ) {
      clone.remove();
      return;
    }


    /* -----------------------------------------------------
       모든 publication을 자연 상태로 복원
       ----------------------------------------------------- */

    cloneItems.forEach((item) => {
      item.hidden = false;


      item.classList.remove(
        "publication-page-hidden",
        "about-publication-hidden",
        "pagination-hidden",
      );


      item.style.removeProperty(
        "display",
      );


      /*
       * publication 자체의 자연 높이만
       * 측정하기 위해 margin 제거.
       */
      item.style.setProperty(
        "margin-top",
        "0",
        "important",
      );

      item.style.setProperty(
        "margin-bottom",
        "0",
        "important",
      );


      item.style.removeProperty(
        "min-height",
      );

      item.style.removeProperty(
        "height",
      );

      item.style.removeProperty(
        "flex-basis",
      );
    });


    /* -----------------------------------------------------
       가장 높은 publication 하나를 찾는다.
       ----------------------------------------------------- */

    let maximumItemHeight = 0;


    cloneItems.forEach((item) => {
      const height =
        item.getBoundingClientRect()
          .height;


      maximumItemHeight =
        Math.max(
          maximumItemHeight,
          height,
        );
    });


    clone.remove();


    if (
      maximumItemHeight <= 0
    ) {
      return;
    }


    /* -----------------------------------------------------
       하나의 virtual slot 높이

       가장 높은 publication
       +
       publication 사이의 기본 여백
       ----------------------------------------------------- */

    const slotGap =
      PUBLICATION_SLOT_GAP_REM *
      getRootFontSize();


    const slotHeight =
      Math.ceil(
        maximumItemHeight +
        slotGap,
      );


    /*
     * 5개짜리 페이지라면:
     *
     * slot × 5
     *
     * 3개짜리 마지막 페이지도
     * 전체 list 높이는 동일하게 유지된다.
     */
    const listHeight =
      slotHeight * perPage;


   /* -----------------------------------------------------
      Apply virtual publication slots
   
      핵심:
      - slotHeight는 "최소 높이"일 뿐이다.
      - 내용이 길면 publication 자체가 자연스럽게 더 커진다.
      - 따라서 모바일 줄바꿈에서도 겹치지 않는다.
      ----------------------------------------------------- */
   
   /*
    * flex 기반 space-between을 사용하지 않는다.
    *
    * 일반적인 위→아래 document flow로 배치한다.
    */
   list.style.setProperty(
     "display",
     "block",
     "important",
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
   
   
   /*
    * 항상 perPage개의 가상 slot이 존재하는 것처럼
    * 전체 최소 높이를 확보한다.
    *
    * 예:
    * slotHeight = 150px
    * perPage = 5
    *
    * min-height = 750px
    */
   list.style.setProperty(
     "min-height",
     `${listHeight}px`,
   );
   
   
   liveItems.forEach((item) => {
     /*
      * 기존 margin 대신 slotHeight가
      * publication 간 기본 세로 간격을 담당한다.
      */
     item.style.setProperty(
       "margin-top",
       "0",
       "important",
     );
   
     item.style.setProperty(
       "margin-bottom",
       "0",
       "important",
     );
   
     item.style.setProperty(
       "box-sizing",
       "border-box",
       "important",
     );
   
   
     /*
      * 중요:
      *
      * height나 flex-basis를 고정하지 않는다.
      *
      * publication 내용이 짧으면
      * slotHeight만큼 공간을 차지하고,
      *
      * 모바일에서 내용이 여러 줄로 길어지면
      * slotHeight보다 더 크게 자동 확장된다.
      */
     item.style.setProperty(
       "min-height",
       `${slotHeight}px`,
       "important",
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




     


  /* =======================================================
     News
     Tallest page measurement
     ======================================================= */

  function measureTallestNewsPage(
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
     * 기존 pagination hidden state 제거
     */
    items.forEach((item) => {
      item.hidden = false;


      item.classList.remove(
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


    /* -----------------------------------------------------
       News page 하나씩 측정
       ----------------------------------------------------- */

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


    /*
     * News는 기존 방식 유지:
     * 가장 높은 page의 높이를 그대로 사용.
     */
    if (
      maximumHeight > 0
    ) {
      list.style.minHeight =
        `${Math.ceil(
          maximumHeight,
        )}px`;
    }
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
          type === "publication"
        ) {
          resetPublicationLayout(
            list,
            itemSelector,
          );


          measurePublicationSlots(
            list,
            itemSelector,
            perPage,
          );


          return;
        }


        /* --------------------------------------------------
           News
           -------------------------------------------------- */

        list.style.removeProperty(
          "min-height",
        );


        measureTallestNewsPage(
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
