---
layout: page
permalink: /repositories/
title: Repositories
description:
nav: true
nav_order: 40
---

<link
  rel="stylesheet"
  href="{{ '/assets/css/showcase-carousel.css' | relative_url }}"
>


{% if site.data.repositories.github_users %}

<h2 class="repository-main-heading">
  GitHub Users
</h2>

<div class="repositories d-flex flex-wrap flex-md-row flex-column align-items-start">
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
  {% endfor %}
</div>

{% if site.repo_trophies.enabled %}
  {% for user in site.data.repositories.github_users %}

    {% if site.data.repositories.github_users.size > 1 %}
      <h4>{{ user }}</h4>
    {% endif %}

    <div class="repositories d-flex flex-wrap flex-md-row flex-column align-items-start">
      {% include repository/repo_trophies.liquid username=user %}
    </div>

  {% endfor %}
{% endif %}

{% endif %}


<!-- =========================================================
     GitHub Repositories
     Desktop: 2 columns × 3 rows = 6 repositories
     Mobile: 1 repository per swipe
     ========================================================= -->

{% if site.data.repositories.github_repos %}

<section class="showcase-section repository-section">

  <h2 class="repository-section-title">
    GitHub Repositories
  </h2>

  {% assign reversed_github_repos = site.data.repositories.github_repos | reverse %}

  <div
    class="showcase-carousel showcase-large-carousel repository-page-carousel"
    data-paged-carousel
    data-desktop-items="6"
    data-desktop-columns="2"
    data-tablet-items="4"
    data-tablet-columns="2"
    data-mobile-items="1"
    data-mobile-columns="1"
  >
    <button
      class="showcase-arrow showcase-prev"
      type="button"
      aria-label="Previous GitHub repositories"
    >
      ‹
    </button>

    <div
      class="showcase-source"
      data-carousel-source
      style="--showcase-fallback-columns: 2;"
    >
      {% for repo in reversed_github_repos %}
        <div class="showcase-item">
          <div class="repositories showcase-repo-host">
            {% include repository/repo.liquid repository=repo %}
          </div>
        </div>
      {% endfor %}
    </div>

    <div
      class="showcase-track"
      data-carousel-track
    ></div>

    <button
      class="showcase-arrow showcase-next"
      type="button"
      aria-label="Next GitHub repositories"
    >
      ›
    </button>
  </div>

</section>

{% endif %}


<!-- =========================================================
     Open-Source Resources
     Desktop: 2 columns × 3 rows = 6 repositories
     Mobile: 1 repository per swipe
     ========================================================= -->

{% if site.data.repositories.open_repos %}

<section class="showcase-section repository-section">

  <h2 class="repository-section-title">
    Open-Source Resources
  </h2>

  <div
    class="showcase-carousel showcase-large-carousel repository-page-carousel"
    data-paged-carousel
    data-desktop-items="6"
    data-desktop-columns="2"
    data-tablet-items="4"
    data-tablet-columns="2"
    data-mobile-items="1"
    data-mobile-columns="1"
  >
    <button
      class="showcase-arrow showcase-prev"
      type="button"
      aria-label="Previous open-source repositories"
    >
      ‹
    </button>

    <div
      class="showcase-source"
      data-carousel-source
      style="--showcase-fallback-columns: 2;"
    >
      {% for repo in site.data.repositories.open_repos %}
        <div class="showcase-item">
          <div class="repositories showcase-repo-host">
            {% include repository/repo.liquid repository=repo %}
          </div>
        </div>
      {% endfor %}
    </div>

    <div
      class="showcase-track"
      data-carousel-track
    ></div>

    <button
      class="showcase-arrow showcase-next"
      type="button"
      aria-label="Next open-source repositories"
    >
      ›
    </button>
  </div>

</section>

{% endif %}


<script src="{{ '/assets/js/showcase-carousel.js' | relative_url }}"></script>
