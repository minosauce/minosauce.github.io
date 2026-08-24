---
layout: page
permalink: /publications/
title: publications
description: Journal and conference publications.
nav: true
nav_order: 2
---

{% include bib_search.liquid %}

{% capture journal_count_raw %}{% bibliography_count --query @article %}{% endcapture %}
{% assign journal_count = journal_count_raw | strip | plus: 0 %}
{% assign journal_start = journal_count | plus: 1 %}

{% capture conference_count_raw %}{% bibliography_count --query @inproceedings %}{% endcapture %}
{% assign conference_count = conference_count_raw | strip | plus: 0 %}
{% assign conference_start = conference_count | plus: 1 %}


<style>
  .pub-numbered ol.bibliography {
    list-style: none;
    padding-left: 0;
  }

  .journal-pubs {
    counter-reset: journal-counter var(--journal-start);
  }

  .journal-pubs ol.bibliography > li {
    counter-increment: journal-counter -1;
    position: relative;
    padding-left: 3.0rem;
  }

  .journal-pubs ol.bibliography > li::before {
    content: "[J." counter(journal-counter) "]";
    position: absolute;
    left: 0;
    top: 0;
    font-weight: 600;
  }

  .conference-pubs {
    counter-reset: conference-counter var(--conference-start);
  }

  .conference-pubs ol.bibliography > li {
    counter-increment: conference-counter -1;
    position: relative;
    padding-left: 3.0rem;
  }

  .conference-pubs ol.bibliography > li::before {
    content: "[C." counter(conference-counter) "]";
    position: absolute;
    left: 0;
    top: 0;
    font-weight: 600;
  }

  .publication-section {
    margin-top: 2rem;
    margin-bottom: 3rem;
  }

  .publication-section h2 {
    margin-bottom: 1.5rem;
  }
</style>


{% if journal_count > 0 %}
<div class="publication-section">
  <h2>Journal</h2>

  <div
    class="publications pub-numbered journal-pubs"
    style="--journal-start: {{ journal_start }};"
  >
    {% bibliography --query @article %}
  </div>
</div>
{% endif %}


{% if conference_count > 0 %}
<div class="publication-section">
  <h2>Conference</h2>

  <div
    class="publications pub-numbered conference-pubs"
    style="--conference-start: {{ conference_start }};"
  >
    {% bibliography --query @inproceedings %}
  </div>
</div>
{% endif %}
