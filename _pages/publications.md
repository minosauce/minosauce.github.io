---
layout: page
permalink: /publications/
title: Publications
description: Journal, and conference
nav: true
nav_order: 20
---

<div
  class="publications-page"
  data-publications-pagination
  data-per-page="5"
>
  {% include bib_search.liquid %}


<!-- =========================================================
     Under Review
     ========================================================= -->
<section class="publication-section under-review-section">
  <h2>Under Review</h2>

  <div class="publications pub-numbered under-review-pubs">
    {% bibliography --query @article[status=review] %}
  </div>
</section>


  <!-- =========================================================
       Journal
       ========================================================= -->
  <section
    class="publication-section journal-section"
    data-publication-section
    data-publication-prefix="J"
  >
    <h2>Journal</h2>

    <div class="publications pub-numbered journal-pubs">
      {% bibliography --query @article[status!=review] %}
    </div>

    <nav
      class="publications-pagination"
      data-publications-pagination-nav
      aria-label="Journal pagination"
    ></nav>
  </section>


  <!-- =========================================================
       Conference
       ========================================================= -->
  <section
    class="publication-section conference-section"
    data-publication-section
    data-publication-prefix="C"
  >
    <h2>Conference</h2>

    <div class="publications pub-numbered conference-pubs">
      {% bibliography --template bib_conference --query @inproceedings %}
    </div>

    <nav
      class="publications-pagination"
      data-publications-pagination-nav
      aria-label="Conference pagination"
    ></nav>
  </section>

</div>

<link
  rel="stylesheet"
  href="{{ '/assets/css/publications-pagination.css' | relative_url }}"
>

<script
  src="{{ '/assets/js/publications-pagination.js' | relative_url }}"
></script>

<script
  src="{{ '/assets/js/pagination-stability.js' | relative_url }}"
></script>


<script
  src="{{ '/assets/js/publication-card-links.js' | relative_url }}"
></script>



<script>
document.addEventListener("DOMContentLoaded", () => {
  const datePattern =
    /(?:,\s*)?((?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19|20)\d{2})\s*$/i;

  document.querySelectorAll(
    ".publications-page .pub-numbered ol.bibliography > li"
  ).forEach((item) => {
    const periodical = item.querySelector(".periodical");
    const title = item.querySelector(".title");

    if (!periodical || !title) return;
    if (item.querySelector(".publication-date")) return;

    const html = periodical.innerHTML;
    const match = html.match(datePattern);

    if (!match) return;

    // Remove date from journal/conference name
    periodical.innerHTML = html
      .slice(0, match.index)
      .replace(/,\s*$/, "")
      .trimEnd();

    // Create independent date element
    const date = document.createElement("span");
    date.className = "publication-date";
    date.textContent = match[1].trim();

    // Position next to title on mobile;
    // CSS aligns it to the far right on desktop.
    title.insertAdjacentElement("afterend", date);
  });
});
</script>
