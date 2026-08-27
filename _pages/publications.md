---
layout: page
permalink: /publications/
title: Publications
description: Journal and conference publications.
nav: true
nav_order: 20
---


<div
  class="publications-page"
  data-publications-pagination
  data-per-page="5"
>
  {% include bib_search.liquid %}

  {% capture journal_count_raw %}
    {% bibliography_count --query @article %}
  {% endcapture %}
  {% assign journal_count = journal_count_raw | strip | plus: 0 %}
  {% assign journal_start = journal_count | plus: 1 %}

  {% capture conference_count_raw %}
    {% bibliography_count --query @inproceedings %}
  {% endcapture %}
  {% assign conference_count = conference_count_raw | strip | plus: 0 %}
  {% assign conference_start = conference_count | plus: 1 %}


  {% if journal_count > 0 %}
    <section
      class="publication-section journal-section"
      data-publication-section
    >
      <h2>Journal</h2>

      <div
        class="publications pub-numbered journal-pubs"
        style="--journal-start: {{ journal_start }};"
      >
        {% bibliography --query @article %}
      </div>

      <nav
        class="publications-pagination"
        data-publications-pagination-nav
        aria-label="Journal pagination"
      ></nav>
    </section>
  {% endif %}


  {% if conference_count > 0 %}
    <section
      class="publication-section conference-section"
      data-publication-section
    >
      <h2>Conference</h2>

      <div
        class="publications pub-numbered conference-pubs"
        style="--conference-start: {{ conference_start }};"
      >
        {% bibliography --query @inproceedings %}
      </div>

      <nav
        class="publications-pagination"
        data-publications-pagination-nav
        aria-label="Conference pagination"
      ></nav>
    </section>
  {% endif %}
</div>

<link
  rel="stylesheet"
  href="{{ '/assets/css/publications-pagination.css' | relative_url }}"
>

<script
  src="{{ '/assets/js/publications-pagination.js' | relative_url }}"
></script>
