function initializePublicationsPagination() {
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
   * =======================================================
   * Visible page-number calculation
   * =======================================================
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
   * =======================================================
   * Initialize each section independently
   * =======================================================
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

    if (!pagination) return null;

    const prefix =
      section.dataset.publicationPrefix || "";

    const totalPublications =
      publications.length;


    /*
     * -------------------------------------------------------
     * Publication numbering
     *
     * Latest first:
     *
     * Journal:
     * [J.11]
     * [J.10]
     * ...
     * [J.1]
     *
     * Conference:
     * [C.15]
     * ...
     * [C.1]
     * -------------------------------------------------------
     */

    publications.forEach(
      (publication, index) => {
        const number =
          totalPublications - index;

        publication.dataset.publicationLabel =
          `[${prefix}.${number}]`;
      }
    );


    const totalPages = Math.max(
      1,
      Math.ceil(
        publications.length / perPage
      )
    );

    let currentPage = 1;


    /*
     * -------------------------------------------------------
     * Show page
     * -------------------------------------------------------
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
     * -------------------------------------------------------
     * Page-number button
     * -------------------------------------------------------
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


    function createEllipsis() {
      const span =
        document.createElement("span");

      span.className =
        "publications-pagination-ellipsis";

      span.textContent = "…";

      return span;
    }


    /*
     * -------------------------------------------------------
     * Render pagination
     * -------------------------------------------------------
     */

    function renderPagination() {
      pagination.innerHTML = "";

      /*
       * 5개 이하라면 pagination 없음
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
     * Search mode
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
     * Initial page
     */
    showPage(1);


    return {
      showPage,
      showAllForSearch,
    };
  }).filter(Boolean);


  /*
   * =======================================================
   * Bib Search compatibility
   * =======================================================
   */

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      () => {
        const hasQuery =
          searchInput.value.trim().length > 0;

        if (hasQuery) {
          pagers.forEach((pager) => {
            pager.showAllForSearch();
          });

          return;
        }

        pagers.forEach((pager) => {
          pager.showPage(1);
        });
      }
    );
  }
}


/*
 * Works whether the script is loaded
 * before or after DOMContentLoaded.
 */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializePublicationsPagination,
    { once: true }
  );
} else {
  initializePublicationsPagination();
}
