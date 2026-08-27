document.addEventListener("DOMContentLoaded", () => {
  initializeNewsPagination();
});


function initializeNewsPagination() {
  const containers = document.querySelectorAll(
    "[data-news-pagination]",
  );

  containers.forEach((container) => {
    const newsList = container.querySelector(
      ".news-list-custom",
    );

    if (!newsList) {
      return;
    }

    const newsItems = Array.from(
      newsList.querySelectorAll(":scope > .news-item"),
    );

    if (newsItems.length === 0) {
      return;
    }

    const itemsPerPage =
      Number(container.dataset.perPage) || 15;

    const totalPages = Math.ceil(
      newsItems.length / itemsPerPage,
    );

    /*
     * Pagination is unnecessary if everything
     * already fits on one page.
     */
    if (totalPages <= 1) {
      return;
    }

    let currentPage = 1;


    /* =====================================================
       Pagination container
       ===================================================== */

    const pagination =
      document.createElement("nav");

    pagination.className =
      "news-pagination";

    pagination.setAttribute(
      "aria-label",
      "News pages",
    );


    /* =====================================================
       Previous button
       ===================================================== */

    const previousButton =
      document.createElement("button");

    previousButton.type = "button";

    previousButton.className =
      "news-pagination-arrow";

    previousButton.innerHTML = "‹";

    previousButton.setAttribute(
      "aria-label",
      "Previous news page",
    );

    pagination.appendChild(
      previousButton,
    );


    /* =====================================================
       Page number buttons
       ===================================================== */

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
        "news-pagination-number";

      button.dataset.page = page;

      button.textContent = page;

      button.setAttribute(
        "aria-label",
        `News page ${page}`,
      );

      pagination.appendChild(button);

      pageButtons.push(button);
    }


    /* =====================================================
       Next button
       ===================================================== */

    const nextButton =
      document.createElement("button");

    nextButton.type = "button";

    nextButton.className =
      "news-pagination-arrow";

    nextButton.innerHTML = "›";

    nextButton.setAttribute(
      "aria-label",
      "Next news page",
    );

    pagination.appendChild(
      nextButton,
    );


    /*
     * Pagination goes below the News list.
     */
    container.appendChild(
      pagination,
    );


    /* =====================================================
       Render page
       ===================================================== */

    function renderPage(
      page,
      shouldScroll = false,
    ) {
      currentPage = page;

      const start =
        (currentPage - 1) *
        itemsPerPage;

      const end =
        start + itemsPerPage;


      newsItems.forEach(
        (item, index) => {
          const visible =
            index >= start &&
            index < end;

          item.hidden = !visible;

          item.style.display =
            visible ? "" : "none";
        },
      );


      /* Current page styling */

      pageButtons.forEach(
        (button) => {
          const buttonPage =
            Number(
              button.dataset.page,
            );

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
        },
      );


      /* Arrow state */

      previousButton.disabled =
        currentPage === 1;

      nextButton.disabled =
        currentPage === totalPages;


      /*
       * Smoothly return to the top of
       * the News list when the page changes.
       */

      if (shouldScroll) {
        container.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }


    /* =====================================================
       Number buttons
       ===================================================== */

    pageButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const page =
              Number(
                button.dataset.page,
              );

            renderPage(
              page,
              true,
            );
          },
        );
      },
    );


    /* =====================================================
       Previous
       ===================================================== */

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


    /* =====================================================
       Next
       ===================================================== */

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
     * Initial page:
     * newest news items.
     */

    renderPage(1);
  });
}
