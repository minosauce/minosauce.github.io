document.addEventListener("DOMContentLoaded", () => {
  const publicationCards = document.querySelectorAll(
    ".publications-page .pub-numbered ol.bibliography > li"
  );

  publicationCards.forEach((card) => {
    // DOI 링크 찾기
    const doiLink =
      card.querySelector('a[href*="doi.org"]') ||
      Array.from(card.querySelectorAll("a")).find(
        (link) => link.textContent.trim().toLowerCase() === "doi"
      );

    // DOI가 없는 publication은 아무 처리도 하지 않음
    if (!doiLink) return;

    // 카드가 클릭 가능하다는 표시
    card.classList.add("publication-card-clickable");

    // 키보드 접근성
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");
    card.setAttribute(
      "aria-label",
      `${card.querySelector(".title")?.textContent.trim() || "Publication"} DOI 열기`
    );

    // 마우스 클릭
    card.addEventListener("click", (event) => {
      // DOI, arXiv, PDF 등 기존 링크/버튼을 직접 클릭한 경우
      // 카드 클릭 이벤트를 실행하지 않음
      if (
        event.target.closest(
          "a, button, input, textarea, select, label"
        )
      ) {
        return;
      }

      window.location.href = doiLink.href;
    });

    // Enter / Space 키 지원
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        if (
          event.target.closest(
            "a, button, input, textarea, select, label"
          )
        ) {
          return;
        }

        event.preventDefault();
        window.location.href = doiLink.href;
      }
    });
  });
});
