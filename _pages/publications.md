---
layout: page
permalink: /publications/
title: Publications
description: Journal and conference publications.
nav: true
nav_order: 20
---

<div
  class="publications publications-page"
  data-publications-pagination
  data-per-page="5"
>
  {% include bib_search.liquid %}

  <div class="publication-section journal-section" data-publication-section>
    <h2>Journal</h2>

    <div class="publications pub-numbered journal-pubs">
      {% bibliography --query @article %}
    </div>
  </div>

  <div class="publication-section conference-section" data-publication-section>
    <h2>Conference</h2>

    <div class="publications pub-numbered conference-pubs">
      {% bibliography --query @inproceedings %}
    </div>
  </div>

  <nav
    class="publications-pagination"
    data-publications-pagination-nav
    aria-label="Publications pagination"
  ></nav>
</div>

<link
  rel="stylesheet"
  href="{{ '/assets/css/publications-pagination.css' | relative_url }}"
>

<script src="{{ '/assets/js/publications-pagination.js' | relative_url }}"></script>
