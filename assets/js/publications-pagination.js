document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    "[data-publications-pagination]",
  );

  if (!container) {
    return;
  }

  const pagination = container.querySelector(
    "[data-publications-pagination-nav]",
  );

  if (!pagination) {
    return;
  }

  const sections = Array.from(
    container.querySelectorAll(
      "[data-publication-section]",
    ),
  );

  const publications = sections.flatMap(
    (section) =>
      Array.from(
        section.querySelectorAll(
          "ol.bibliography > li",
        ),
      ),
  );

  const perPage =
    Number(container.dataset.perPage) || 10;

  const totalPages = Math.ceil(
    publications.length / perPage,
  );

  let currentPage = 1;

  /* =======================================================
     Nothing to paginate
     ======================================================= */

  if (totalPages <= 1) {
    pagination.hidden = true;
    return;
  }

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
     Show / hide publication sections
     ======================================================= */

  function updateSections() {
    sections.forEach((section) => {
      const items = Array.from(
        section.querySelectorAll(
          "ol.bibliography > li",
        ),
      );

      const hasVisibleItem =
        items.some(
          (item) =>
            !item.classList.contains(
              "publication-page-hidden",
            ),
        );

      section.classList.toggle(
        "publication-section-hidden",
        !hasVisibleItem,
      );
    });
  }

  /* =======================================================
     Show page
     ======================================================= */

  function showPage(page) {
    currentPage = Math.max(
      1,
      Math.min(page, totalPages),
    );

    const start =
      (currentPage - 1) * perPage;

    const end = start + perPage;

    publications.forEach(
      (publication, index) => {
        publication.classList.toggle(
          "publication-page-hidden",
          index < start || index >= end,
        );
      },
    );

    updateSections();
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
    /*
     * 1 2 3 4 5
     *
     * or:
     *
     * 1 2 3 … 8
     * 1 … 3 4 5 … 8
     * 1 … 6 7 8
     */

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
     * Numbers
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

     검색 중에는 pagination을 해제하여
     전체 bibliography를 검색 대상으로 둔다.
     ======================================================= */

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      () => {
        const hasQuery =
          searchInput.value.trim().length > 0;

        if (hasQuery) {
          publications.forEach(
            (publication) => {
              publication.classList.remove(
                "publication-page-hidden",
              );
            },
          );

          sections.forEach(
            (section) => {
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
