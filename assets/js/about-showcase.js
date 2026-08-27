/* =========================================================
   About Showcase

   - Publications: 5 items per page
   - Projects carousel: 3 / 2 / 1 cards per click
   - Repositories carousel: 2 / 2 / 1 cards per click
   ========================================================= */

function initializeAboutShowcase() {
  initializeAboutPublicationPagination();
  initializeAboutCarousels();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeAboutShowcase,
    { once: true },
  );
} else {
  initializeAboutShowcase();
}


/* =========================================================
   About - Publications Pagination
   Journal + Conference combined / 5 publications per page
   ========================================================= */

function initializeAboutPublicationPagination() {
  const publicationSections = document.querySelectorAll(
    "[data-publication-pagination]",
  );

  publicationSections.forEach((section) => {
    if (section.dataset.paginationInitialized === "true") {
      return;
    }

    const bibliography = section.querySelector(
      "ol.bibliography",
    );

    if (!bibliography) {
      return;
    }

    const publications = Array.from(
      bibliography.querySelectorAll(":scope > li"),
    );

    if (publications.length === 0) {
      return;
    }

    section.dataset.paginationInitialized = "true";

    const itemsPerPage =
      Number(section.dataset.perPage) || 5;

    const totalPages = Math.ceil(
      publications.length / itemsPerPage,
    );


    /*
     * 5개 이하이면
     * pagination을 만들지 않고 전부 표시
     */
    if (totalPages <= 1) {
      publications.forEach((publication) => {
        publication.hidden = false;
        publication.style.display = "";
      });

      return;
    }


    let currentPage = 1;


    /* =====================================================
       Pagination container
       ===================================================== */

    const pagination =
      document.createElement("nav");

    pagination.className =
      "about-publication-pagination";

    pagination.setAttribute(
      "aria-label",
      "Publication pages",
    );


    /* -----------------------------------------------------
       Previous
       ----------------------------------------------------- */

    const previousButton =
      document.createElement("button");

    previousButton.type = "button";

    previousButton.className =
      "pagination-arrow pagination-prev";

    previousButton.textContent = "‹";

    previousButton.setAttribute(
      "aria-label",
      "Previous publication page",
    );

    pagination.appendChild(previousButton);


    /* -----------------------------------------------------
       Page numbers
       ----------------------------------------------------- */

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
        "pagination-number";

      button.dataset.page =
        String(page);

      button.textContent =
        String(page);

      button.setAttribute(
        "aria-label",
        `Publication page ${page}`,
      );

      pagination.appendChild(button);

      pageButtons.push(button);
    }


    /* -----------------------------------------------------
       Next
       ----------------------------------------------------- */

    const nextButton =
      document.createElement("button");

    nextButton.type = "button";

    nextButton.className =
      "pagination-arrow pagination-next";

    nextButton.textContent = "›";

    nextButton.setAttribute(
      "aria-label",
      "Next publication page",
    );

    pagination.appendChild(nextButton);


    /*
     * bibliography 바로 아래에 pagination 삽입
     */
    section.appendChild(pagination);


    /* =====================================================
       Render Page
       ===================================================== */

    function renderPage(
      page,
      shouldScroll = false,
    ) {
      currentPage = Math.max(
        1,
        Math.min(page, totalPages),
      );

      const start =
        (currentPage - 1) *
        itemsPerPage;

      const end =
        start + itemsPerPage;


      /*
       * 현재 페이지의 논문 5개만 표시
       */
      publications.forEach(
        (publication, index) => {
          const visible =
            index >= start &&
            index < end;

          publication.hidden =
            !visible;

          publication.style.display =
            visible ? "" : "none";
        },
      );


      /*
       * Active page 표시
       */
      pageButtons.forEach(
        (button) => {
          const buttonPage =
            Number(
              button.dataset.page,
            );

          const active =
            buttonPage ===
            currentPage;

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
        },
      );


      /*
       * 첫/마지막 페이지 화살표
       */
      previousButton.disabled =
        currentPage === 1;

      nextButton.disabled =
        currentPage ===
        totalPages;


      /*
       * pagination 클릭 후
       * Publications 제목 부근으로 이동
       */
      if (shouldScroll) {
        const publicationBlock =
          section.closest(
            ".about-publication-block",
          );

        const scrollTarget =
          publicationBlock ||
          section;

        scrollTarget.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }


    /* =====================================================
       Page events
       ===================================================== */

    pageButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            renderPage(
              Number(
                button.dataset.page,
              ),
              true,
            );
          },
        );
      },
    );


    previousButton.addEventListener(
      "click",
      () => {
        if (currentPage > 1) {
          renderPage(
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
          currentPage <
          totalPages
        ) {
          renderPage(
            currentPage + 1,
            true,
          );
        }
      },
    );


    /*
     * 첫 화면:
     * 최근 publication 5개
     */
    renderPage(1);
  });
}


/* =========================================================
   About - Projects / Repositories Carousel

   Projects
   Desktop (>991px) : 3 cards
   Tablet  (>576px) : 2 cards
   Mobile  (<=576px): 1 card

   Repositories
   Desktop / Tablet (>576px): 2 cards
   Mobile           (<=576px): 1 card
   ========================================================= */

function initializeAboutCarousels() {
  const carousels =
    document.querySelectorAll(
      "[data-about-carousel]",
    );

  carousels.forEach(
    (carousel) => {
      if (
        carousel.dataset
          .carouselInitialized ===
        "true"
      ) {
        return;
      }


      const track =
        carousel.querySelector(
          "[data-carousel-track]",
        );

      const previousButton =
        carousel.querySelector(
          ".about-carousel-prev",
        );

      const nextButton =
        carousel.querySelector(
          ".about-carousel-next",
        );


      if (
        !track ||
        !previousButton ||
        !nextButton
      ) {
        return;
      }


      const slides =
        Array.from(
          track.querySelectorAll(
            ".about-carousel-slide",
          ),
        );


      if (
        slides.length === 0
      ) {
        carousel.classList.add(
          "no-scroll",
        );

        previousButton.disabled =
          true;

        nextButton.disabled =
          true;

        return;
      }


      carousel.dataset
        .carouselInitialized =
        "true";


      const isProjectCarousel =
        slides.some(
          (slide) =>
            slide.classList.contains(
              "about-project-slide",
            ),
        );


      const isRepositoryCarousel =
        slides.some(
          (slide) =>
            slide.classList.contains(
              "about-repository-slide",
            ),
        );


      /*
       * CSS에
       *
       * scroll-snap-stop: always;
       *
       * 가 남아 있어도
       * 중간 카드에서 멈추지 않도록 처리
       */
      slides.forEach(
        (slide) => {
          slide.style.scrollSnapStop =
            "normal";
        },
      );


      /* ===================================================
         한 번 클릭할 때 이동할 카드 개수
         =================================================== */

      function getStep() {
        /*
         * Projects
         */
        if (
          isProjectCarousel
        ) {
          if (
            window.innerWidth >
            991
          ) {
            return 3;
          }

          if (
            window.innerWidth >
            576
          ) {
            return 2;
          }

          return 1;
        }


        /*
         * Repositories
         */
        if (
          isRepositoryCarousel
        ) {
          if (
            window.innerWidth >
            576
          ) {
            return 2;
          }

          return 1;
        }


        return 1;
      }


      /* ===================================================
         특정 카드의 정확한 scroll 위치
         =================================================== */

      function getSlidePosition(
        index,
      ) {
        const slide =
          slides[index];

        if (!slide) {
          return 0;
        }

        const trackRect =
          track.getBoundingClientRect();

        const slideRect =
          slide.getBoundingClientRect();

        return (
          track.scrollLeft +
          slideRect.left -
          trackRect.left
        );
      }


      /* ===================================================
         현재 가장 왼쪽 카드 index
         =================================================== */

      function getCurrentIndex() {
        const trackRect =
          track.getBoundingClientRect();

        let closestIndex = 0;

        let closestDistance =
          Infinity;


        slides.forEach(
          (slide, index) => {
            const slideRect =
              slide.getBoundingClientRect();

            const distance =
              Math.abs(
                slideRect.left -
                trackRect.left,
              );

            if (
              distance <
              closestDistance
            ) {
              closestDistance =
                distance;

              closestIndex =
                index;
            }
          },
        );


        return closestIndex;
      }


      /* ===================================================
         마지막으로 시작 가능한 index
         =================================================== */

      function getMaxStartIndex() {
        const step =
          getStep();

        return Math.max(
          0,
          slides.length - step,
        );
      }


      /* ===================================================
         카드 index 기준 정확히 이동
         =================================================== */

      function scrollToIndex(
        index,
      ) {
        const targetIndex =
          Math.max(
            0,
            Math.min(
              index,
              getMaxStartIndex(),
            ),
          );


        track.scrollTo({
          left:
            getSlidePosition(
              targetIndex,
            ),

          behavior: "smooth",
        });
      }


      /* ===================================================
         Arrow 상태
         =================================================== */

      function updateButtons() {
        const maxScrollLeft =
          Math.max(
            0,

            track.scrollWidth -
              track.clientWidth,
          );


        const hasOverflow =
          maxScrollLeft > 3;


        carousel.classList.toggle(
          "no-scroll",
          !hasOverflow,
        );


        if (!hasOverflow) {
          previousButton.disabled =
            true;

          nextButton.disabled =
            true;

          return;
        }


        previousButton.disabled =
          track.scrollLeft <= 3;


        nextButton.disabled =
          track.scrollLeft >=
          maxScrollLeft - 3;
      }


      /* ===================================================
         Previous
         =================================================== */

      previousButton.addEventListener(
        "click",
        () => {
          const currentIndex =
            getCurrentIndex();

          const step =
            getStep();


          scrollToIndex(
            currentIndex -
              step,
          );
        },
      );


      /* ===================================================
         Next
         =================================================== */

      nextButton.addEventListener(
        "click",
        () => {
          const currentIndex =
            getCurrentIndex();

          const step =
            getStep();


          scrollToIndex(
            currentIndex +
              step,
          );
        },
      );


      /* ===================================================
         Scroll
         =================================================== */

      track.addEventListener(
        "scroll",
        updateButtons,
        {
          passive: true,
        },
      );


      /* ===================================================
         Resize
         =================================================== */

      window.addEventListener(
        "resize",
        () => {
          requestAnimationFrame(
            updateButtons,
          );
        },
      );


      /*
       * 최초 상태
       */
      requestAnimationFrame(
        updateButtons,
      );
    },
  );
}
