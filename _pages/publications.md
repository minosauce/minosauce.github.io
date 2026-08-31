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

    <div class="publications under-review-pubs">
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
      {% bibliography --query @inproceedings %}
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
