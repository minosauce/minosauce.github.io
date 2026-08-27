document.addEventListener("DOMContentLoaded", () => {
  initializeAboutPublicationPagination();
  initializeAboutCarousels();
});


/* =========================================================
   About - Publications Pagination
   5 publications per page
   ========================================================= */

function initializeAboutPublicationPagination() {
  const publicationSections = document.querySelectorAll(
    "[data-publication-pagination]",
  );

  publicationSections.forEach((section) => {
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

    const itemsPerPage =
      Number(section.dataset.perPage) || 5;

    const totalPages = Math.ceil(
      publications.length / itemsPerPage,
    );

    /*
     * 5개 이하이면 페이지네이션을 만들지 않는다.
     */
    if (totalPages <= 1) {
      return;
    }

    let currentPage = 1;

    const pagination =
      document.createElement("nav");

    pagination.className =
      "about-publication-pagination";

    pagination.setAttribute(
      "aria-label",
      "Publication pages",
    );


    /* -------------------------------------------------------
       Previous button
       ------------------------------------------------------- */

    const previousButton =
      document.createElement("button");

    previousButton.type = "button";

    previousButton.className =
      "pagination-arrow pagination-prev";

    previousButton.innerHTML = "‹";

    previousButton.setAttribute(
      "aria-label",
      "Previous publication page",
    );

    pagination.appendChild(previousButton);


    /* -------------------------------------------------------
       Page number buttons
       ------------------------------------------------------- */

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

      button.dataset.page = page;

      button.textContent = page;

      button.setAttribute(
        "aria-label",
        `Publication page ${page}`,
      );

      pagination.appendChild(button);

      pageButtons.push(button);
    }


    /* -------------------------------------------------------
       Next button
       ------------------------------------------------------- */

    const nextButton =
      document.createElement("button");

    nextButton.type = "button";

    nextButton.className =
      "pagination-arrow pagination-next";

    nextButton.innerHTML = "›";

    nextButton.setAttribute(
      "aria-label",
      "Next publication page",
    );

    pagination.appendChild(nextButton);


    /*
     * Publications 목록 바로 아래에 삽입
     */
    section.appendChild(pagination);


    /* -------------------------------------------------------
       Render page
       ------------------------------------------------------- */

    function renderPage(
      page,
      shouldScroll = false,
    ) {
      currentPage = page;

      const start =
        (currentPage - 1) * itemsPerPage;

      const end =
        start + itemsPerPage;


      /*
       * 선택된 페이지의 논문만 표시
       */
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
       * 현재 페이지 버튼 표시
       */
      pageButtons.forEach((button) => {
        const buttonPage =
          Number(button.dataset.page);

        const active =
          buttonPage === currentPage;

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
       * 첫 페이지 / 마지막 페이지에서
       * 화살표 비활성화
       */
      previousButton.disabled =
        currentPage === 1;

      nextButton.disabled =
        currentPage === totalPages;


      /*
       * 페이지 번호를 누른 뒤
       * Publications 영역 위쪽으로 부드럽게 이동
       */
      if (shouldScroll) {
        const publicationBlock =
          section.closest(
            ".about-publication-block",
          );

        if (publicationBlock) {
          publicationBlock.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }


    /* -------------------------------------------------------
       Page number events
       ------------------------------------------------------- */

    pageButtons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const page =
            Number(button.dataset.page);

          renderPage(page, true);
        },
      );
    });


    /* -------------------------------------------------------
       Previous
       ------------------------------------------------------- */

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


    /* -------------------------------------------------------
       Next
       ------------------------------------------------------- */

    nextButton.addEventListener(
      "click",
      () => {
        if (
          currentPage < totalPages
        ) {
          renderPage(
            currentPage + 1,
            true,
          );
        }
      },
    );


    /*
     * 첫 화면 = 최신 논문 5개
     */
    renderPage(1);
  });
}


/* =========================================================
   About - Projects / Repositories Carousel
   ========================================================= */

    function initializeAboutCarousels() {
      const carousels = document.querySelectorAll(
        "[data-about-carousel]",
      );
    
      carousels.forEach((carousel) => {
        const track = carousel.querySelector(
          "[data-carousel-track]",
        );
    
        const previousButton = carousel.querySelector(
          ".about-carousel-prev",
        );
    
        const nextButton = carousel.querySelector(
          ".about-carousel-next",
        );
    
        if (!track || !previousButton || !nextButton) {
          return;
        }
    
        const slides = Array.from(
          track.querySelectorAll(".about-carousel-slide"),
        );
    
        if (slides.length === 0) {
          return;
        }
    
        const isProjectCarousel = Boolean(
          carousel.querySelector(".about-project-slide"),
        );
    
        const isRepositoryCarousel = Boolean(
          carousel.querySelector(".about-repository-slide"),
        );
    
        /*
         * 한 번에 이동할 카드 수
         */
        function getStep() {
          if (isProjectCarousel) {
            if (window.innerWidth > 991) {
              return 3;
            }
    
            if (window.innerWidth > 576) {
              return 2;
            }
    
            return 1;
          }
    
          if (isRepositoryCarousel) {
            if (window.innerWidth > 576) {
              return 2;
            }
    
            return 1;
          }
    
          return 1;
        }
    
        /*
         * 특정 카드의 정확한 scrollLeft 위치 계산
         */
        function getSlidePosition(index) {
          const slide = slides[index];
    
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
    
        /*
         * 현재 가장 왼쪽에 가까운 카드 index
         */
        function getCurrentIndex() {
          let closestIndex = 0;
          let closestDistance = Infinity;
    
          const trackRect =
            track.getBoundingClientRect();
    
          slides.forEach((slide, index) => {
            const slideRect =
              slide.getBoundingClientRect();
    
            const distance = Math.abs(
              slideRect.left - trackRect.left,
            );
    
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });
    
          return closestIndex;
        }
    
        /*
         * 카드 index로 정확하게 이동
         */
        function scrollToIndex(index) {
          const step = getStep();
    
          const maxStartIndex = Math.max(
            0,
            slides.length - step,
          );
    
          const targetIndex = Math.max(
            0,
            Math.min(index, maxStartIndex),
          );
    
          track.scrollTo({
            left: getSlidePosition(targetIndex),
            behavior: "smooth",
          });
        }
    
        /*
         * 화살표 활성 / 비활성
         */
        function updateButtons() {
          const maxScrollLeft =
            track.scrollWidth - track.clientWidth;
    
          const hasOverflow = maxScrollLeft > 3;
    
          carousel.classList.toggle(
            "no-scroll",
            !hasOverflow,
          );
    
          if (!hasOverflow) {
            previousButton.disabled = true;
            nextButton.disabled = true;
            return;
          }
    
          previousButton.disabled =
            track.scrollLeft <= 3;
    
          nextButton.disabled =
            track.scrollLeft >= maxScrollLeft - 3;
        }
    
        /*
         * Previous
         */
        previousButton.addEventListener(
          "click",
          () => {
            const step = getStep();
            const currentIndex =
              getCurrentIndex();
    
            scrollToIndex(
              currentIndex - step,
            );
          },
        );
    
        /*
         * Next
         */
        nextButton.addEventListener(
          "click",
          () => {
            const step = getStep();
            const currentIndex =
              getCurrentIndex();
    
            scrollToIndex(
              currentIndex + step,
            );
          },
        );
    
        track.addEventListener(
          "scroll",
          updateButtons,
          {
            passive: true,
          },
        );
    
        window.addEventListener(
          "resize",
          updateButtons,
        );
    
        requestAnimationFrame(
          updateButtons,
        );
      });
    }



    /* -------------------------------------------------------
       한 번 클릭할 때 이동할 거리
       = 카드 1개 너비 + gap (3개씩 넘기기)
       ------------------------------------------------------- */

    function getScrollAmount() {
      const slide = track.querySelector(".about-carousel-slide");
    
      if (!slide) {
        return track.clientWidth;
      }
    
      const style = window.getComputedStyle(track);
    
      const gap =
        parseFloat(
          style.columnGap || style.gap
        ) || 0;
    
      const slideWidth =
        slide.getBoundingClientRect().width;
    
      /*
       * Projects
       *
       * Desktop : 3 cards visible -> move 3 cards
       * Tablet  : 2 cards visible -> move 2 cards
       * Mobile  : 1 card per swipe
       */
      if (
        carousel.querySelector(
          ".about-project-slide"
        )
      ) {
        if (window.innerWidth > 991) {
          return (slideWidth + gap) * 3;
        }
    
        if (window.innerWidth > 576) {
          return (slideWidth + gap) * 2;
        }
    
        return slideWidth + gap;
      }
    
      /*
       * Repositories
       *
       * Desktop / Tablet : 2 cards visible -> move 2 cards
       * Mobile           : 1 card per swipe
       */
      if (
        carousel.querySelector(
          ".about-repository-slide"
        )
      ) {
        if (window.innerWidth > 576) {
          return (slideWidth + gap) * 2;
        }
    
        return slideWidth + gap;
      }
    
      return slideWidth + gap;
    }


    /* -------------------------------------------------------
       Arrow 상태
       ------------------------------------------------------- */

    function updateButtons() {
      const maxScrollLeft =
        track.scrollWidth -
        track.clientWidth;

      const hasOverflow =
        maxScrollLeft > 3;

      /*
       * 카드 수가 적어서 넘길 필요가 없으면
       * 화살표를 숨긴다.
       */
      carousel.classList.toggle(
        "no-scroll",
        !hasOverflow,
      );

      if (!hasOverflow) {
        previousButton.disabled = true;
        nextButton.disabled = true;

        return;
      }

      previousButton.disabled =
        track.scrollLeft <= 3;

      nextButton.disabled =
        track.scrollLeft >=
        maxScrollLeft - 3;
    }


    /* -------------------------------------------------------
       Previous
       ------------------------------------------------------- */

    previousButton.addEventListener(
      "click",
      () => {
        track.scrollBy({
          left: -getScrollAmount(),
          behavior: "smooth",
        });
      },
    );


    /* -------------------------------------------------------
       Next
       ------------------------------------------------------- */

    nextButton.addEventListener(
      "click",
      () => {
        track.scrollBy({
          left: getScrollAmount(),
          behavior: "smooth",
        });
      },
    );


    /* -------------------------------------------------------
       Mouse scroll / mobile swipe
       ------------------------------------------------------- */

    track.addEventListener(
      "scroll",
      updateButtons,
      {
        passive: true,
      },
    );


    /* -------------------------------------------------------
       Window resize
       ------------------------------------------------------- */

    window.addEventListener(
      "resize",
      updateButtons,
    );


    /*
     * 최초 화살표 상태 계산
     */
    requestAnimationFrame(
      updateButtons,
    );
  });
}
