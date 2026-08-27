document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    "[data-publications-pagination]",
  );

  if (!container) return;

  const pagination = container.querySelector(
    "[data-publications-pagination-nav]",
  );

  if (!pagination) return;

  const sections = Array.from(
    container.querySelectorAll(
      "[data-publication-section]",
    ),
  );

  const perPage =
    Number(container.dataset.perPage) || 5;

  /*
   * Journal / Conference를 서로 독립된 목록으로 보관한다.
   *
   * 예:
   * sectionData[0] = Journal publications
   * sectionData[1] = Conference publications
   */
  const sectionData = sections.map((section) => ({
    section,
    publications: Array.from(
      section.querySelectorAll(
        "ol.bibliography > li",
      ),
    ),
  }));

  /*
   * 가장 publication 수가 많은 section을 기준으로
   * 전체 페이지 수를 결정한다.
   *
   * Journal 10개 / Conference 16개라면:
   * Journal    = 2 pages
   * Conference = 4 pages
   * totalPages = 4
   */
  const totalPages = Math.max(
    1,
    ...sectionData.map(({ publications }) =>
      Math.ceil(publications.length / perPage),
    ),
  );

  let currentPage = 1;

  /* =======================================================
     Search box
     ======================================================= */

  const searchInput =
    document.querySelector(
      ".bibsearch-form-input",
    ) ||
    document.querySelector("#bibsearch") ||
    document.querySelector(
      'input[placeholder="Type to filter"]',
    );

  /* =======================================================
     Show page

     한 페이지에서:
       Journal    최대 5개
       Conference 최대 5개
     를 각각 표시한다.
     ======================================================= */

  function showPage(page) {
    currentPage = Math.max(
      1,
      Math.min(page, totalPages),
    );

    const start =
      (currentPage - 1) * perPage;

    const end =
      start + perPage;

    sectionData.forEach(
      ({ section, publications }) => {
        publications.forEach(
          (publication, index) => {
            publication.classList.toggle(
              "publication-page-hidden",
              index < start || index >= end,
            );
          },
        );

        /*
         * 현재 페이지에 표시할 publication이
         * 하나도 없는 section만 숨긴다.
         */
        const hasVisiblePublication =
          publications.some(
            (publication) =>
              !publication.classList.contains(
                "publication-page-hidden",
              ),
          );

        section.classList.toggle(
          "publication-section-hidden",
          !hasVisiblePublication,
        );
      },
    );

    renderPagination();
  }

  /* =======================================================
     Page button
     ======================================================= */

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
        "page",
      );
    }

    button.addEventListener(
      "click",
      () => {
        showPage(page);

        container.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
    );

    return button;
  }

  /* =======================================================
     Ellipsis
     ======================================================= */

  function createEllipsis() {
    const ellipsis =
      document.createElement("span");

    ellipsis.className =
      "publications-pagination-ellipsis";

    ellipsis.textContent = "…";

    return ellipsis;
  }

  /* =======================================================
     Pagination numbers
     ======================================================= */

  function getVisiblePages() {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1,
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

    if (
      currentPage >=
      totalPages - 3
    ) {
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

  /* =======================================================
     Render pagination
     ======================================================= */

  function renderPagination() {
    pagination.innerHTML = "";

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
      "Previous page",
    );

    previous.disabled =
      currentPage === 1;

    previous.addEventListener(
      "click",
      () => {
        if (currentPage > 1) {
          showPage(currentPage - 1);

          container.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      },
    );

    pagination.appendChild(previous);

    /*
     * Page numbers
     */

    getVisiblePages().forEach(
      (page) => {
        if (page === "ellipsis") {
          pagination.appendChild(
            createEllipsis(),
          );
        } else {
          pagination.appendChild(
            createPageButton(page),
          );
        }
      },
    );

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
      "Next page",
    );

    next.disabled =
      currentPage === totalPages;

    next.addEventListener(
      "click",
      () => {
        if (currentPage < totalPages) {
          showPage(currentPage + 1);

          container.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      },
    );

    pagination.appendChild(next);
  }

  /* =======================================================
     Search compatibility

     검색하는 동안에는 pagination 제한을 해제해서
     모든 Journal / Conference publication을
     bibsearch가 검색할 수 있도록 한다.
     ======================================================= */

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      () => {
        const hasQuery =
          searchInput.value.trim().length > 0;

        if (hasQuery) {
          sectionData.forEach(
            ({ section, publications }) => {
              publications.forEach(
                (publication) => {
                  publication.classList.remove(
                    "publication-page-hidden",
                  );
                },
              );

              section.classList.remove(
                "publication-section-hidden",
              );
            },
          );

          pagination.hidden = true;

          return;
        }

        showPage(1);
      },
    );
  }

  /* =======================================================
     Initial page
     ======================================================= */

  showPage(1);
});
