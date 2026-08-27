document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll("[data-page-carousel]");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector("[data-page-carousel-track]");
    const previousButton = carousel.querySelector(".page-carousel-prev");
    const nextButton = carousel.querySelector(".page-carousel-next");

    if (!track || !previousButton || !nextButton) {
      return;
    }

    /* =======================================================
       Scroll amount = one card + gap
       ======================================================= */

    const getScrollAmount = () => {
      const slide = track.querySelector(".page-carousel-slide");

      if (!slide) {
        return track.clientWidth;
      }

      const trackStyle = window.getComputedStyle(track);

      const gap =
        parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;

      return slide.getBoundingClientRect().width + gap;
    };


    /* =======================================================
       Arrow state
       ======================================================= */

    const updateButtons = () => {
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
    };


    /* =======================================================
       Previous
       ======================================================= */

    previousButton.addEventListener("click", () => {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    });


    /* =======================================================
       Next
       ======================================================= */

    nextButton.addEventListener("click", () => {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    });


    /* =======================================================
       Native mouse / touch scrolling
       ======================================================= */

    track.addEventListener(
      "scroll",
      updateButtons,
      {
        passive: true,
      },
    );


    /* =======================================================
       Responsive recalculation
       ======================================================= */

    window.addEventListener(
      "resize",
      updateButtons,
    );


    /* =======================================================
       Initial state
       ======================================================= */

    requestAnimationFrame(updateButtons);
  });
});
