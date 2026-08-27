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
  data-per-page="10"
>
  {% include bib_search.liquid %}

  {% assign journal_count = site.bibliography | where_exp: "item", "item.type == 'article'" | size %}
  {% assign conference_count = site.bibliography | where_exp: "item", "item.type == 'inproceedings'" | size %}

  {% if journal_count > 0 %}
    <div class="publication-section journal-section" data-publication-section>
      <h2>Journal</h2>

      <div
        class="publications pub-numbered journal-pubs"
        style="--journal-start: {{ journal_count }};"
      >
        {% bibliography --query @article %}
      </div>
    </div>
  {% endif %}

  {% if conference_count > 0 %}
    <div class="publication-section conference-section" data-publication-section>
      <h2>Conference</h2>

      <div
        class="publications pub-numbered conference-pubs"
        style="--conference-start: {{ conference_count }};"
      >
        {% bibliography --query @inproceedings %}
      </div>
    </div>
  {% endif %}

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
