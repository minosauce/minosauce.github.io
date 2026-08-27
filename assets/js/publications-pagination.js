document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    "[data-publications-pagination]"
  );

  if (!container) return;

  const perPage =
    Number(container.dataset.perPage) || 5;

  const sections = Array.from(
    container.querySelectorAll(
      "[data-publication-section]"
    )
  );

  const searchInput =
    document.querySelector(".bibsearch-form-input") ||
    document.querySelector("#bibsearch") ||
    document.querySelector(
      'input[placeholder="Type to filter"]'
    );

  /*
   * -------------------------------------------------------
   * 표시할 페이지 번호 계산
   * -------------------------------------------------------
   *
   * 페이지가 적으면:
   *
   *   1 2 3 4
   *
   * 많아지면:
   *
   *   1 2 3 4 5 … 10
   *   1 … 4 5 6 … 10
   *   1 … 6 7 8 9 10
   */
  function getVisiblePages(
    currentPage,
    totalPages
  ) {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        "ellipsis",
        totalPages,
      ];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  }


  /*
   * -------------------------------------------------------
   * 각각의 Journal / Conference section 초기화
   * -------------------------------------------------------
   */

  const pagers = sections.map((section) => {
    const publications = Array.from(
      section.querySelectorAll(
        "ol.bibliography > li"
      )
    );

    const pagination = section.querySelector(
      "[data-publications-pagination-nav]"
    );

    if (!pagination) {
      return null;
    }

    const totalPages = Math.max(
      1,
      Math.ceil(
        publications.length / perPage
      )
    );

    let currentPage = 1;


    /*
     * 현재 페이지 표시
     */
    function showPage(
      page,
      shouldScroll = false
    ) {
      currentPage = Math.max(
        1,
        Math.min(page, totalPages)
      );

      const start =
        (currentPage - 1) * perPage;

      const end =
        start + perPage;

      publications.forEach(
        (publication, index) => {
          publication.classList.toggle(
            "publication-page-hidden",
            index < start || index >= end
          );
        }
      );

      renderPagination();

      if (shouldScroll) {
        const heading =
          section.querySelector("h2");

        if (heading) {
          heading.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }


    /*
     * 페이지 버튼
     */
    function createPageButton(page) {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "publications-pagination-button";

      button.textContent = page;

      if (page === currentPage) {
        button.classList.add("active");

        button.setAttribute(
          "aria-current",
          "page"
        );
      }

      button.addEventListener(
        "click",
        () => {
          showPage(page, true);
        }
      );

      return button;
    }


    /*
     * ...
     */
    function createEllipsis() {
      const ellipsis =
        document.createElement("span");

      ellipsis.className =
        "publications-pagination-ellipsis";

      ellipsis.textContent = "…";

      return ellipsis;
    }


    /*
     * pagination 렌더링
     */
    function renderPagination() {
      pagination.innerHTML = "";

      /*
       * publication이 5개 이하라면
       * pagination 자체를 표시하지 않는다.
       */
      if (totalPages <= 1) {
        pagination.hidden = true;
        return;
      }

      pagination.hidden = false;


      /*
       * Previous
       */
      const previous =
        document.createElement("button");

      previous.type = "button";

      previous.className =
        "publications-pagination-arrow";

      previous.textContent = "‹";

      previous.setAttribute(
        "aria-label",
        "Previous page"
      );

      previous.disabled =
        currentPage === 1;

      previous.addEventListener(
        "click",
        () => {
          if (currentPage > 1) {
            showPage(
              currentPage - 1,
              true
            );
          }
        }
      );

      pagination.appendChild(previous);


      /*
       * Page numbers
       */
      getVisiblePages(
        currentPage,
        totalPages
      ).forEach((page) => {
        if (page === "ellipsis") {
          pagination.appendChild(
            createEllipsis()
          );
        } else {
          pagination.appendChild(
            createPageButton(page)
          );
        }
      });


      /*
       * Next
       */
      const next =
        document.createElement("button");

      next.type = "button";

      next.className =
        "publications-pagination-arrow";

      next.textContent = "›";

      next.setAttribute(
        "aria-label",
        "Next page"
      );

      next.disabled =
        currentPage === totalPages;

      next.addEventListener(
        "click",
        () => {
          if (currentPage < totalPages) {
            showPage(
              currentPage + 1,
              true
            );
          }
        }
      );

      pagination.appendChild(next);
    }


    /*
     * 검색할 때 사용할 함수
     */
    function showAllForSearch() {
      publications.forEach(
        (publication) => {
          publication.classList.remove(
            "publication-page-hidden"
          );
        }
      );

      pagination.hidden = true;
    }


    /*
     * 초기 상태
     */
    showPage(1);


    return {
      showPage,
      showAllForSearch,
      pagination,
    };
  }).filter(Boolean);


  /*
   * -------------------------------------------------------
   * Bib search와 pagination 연동
   * -------------------------------------------------------
   */

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      () => {
        const hasQuery =
          searchInput.value
            .trim()
            .length > 0;

        /*
         * 검색 중
         *
         * pagination 때문에 숨겨둔 항목을
         * 모두 다시 노출한다.
         *
         * 실제 검색 결과 필터링은
         * al-folio bibsearch가 담당한다.
         */
        if (hasQuery) {
          pagers.forEach((pager) => {
            pager.showAllForSearch();
          });

          return;
        }


        /*
         * 검색창을 다시 비우면
         * Journal / Conference 모두
         * 각각 1페이지로 복귀
         */
        pagers.forEach((pager) => {
          pager.showPage(1);
        });
      }
    );
  }
});
