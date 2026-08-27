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
  href="{{ '/assets/css/page-carousel.css' | relative_url }}"
>


{% if site.data.repositories.github_users %}

## GitHub Users

<div class="repositories d-flex flex-wrap flex-md-row flex-column align-items-start">

  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
  {% endfor %}

</div>

---

{% if site.repo_trophies.enabled %}

  {% for user in site.data.repositories.github_users %}

    {% if site.data.repositories.github_users.size > 1 %}
      <h4>{{ user }}</h4>
    {% endif %}

    <div class="repositories d-flex flex-wrap flex-md-row flex-column align-items-start">
      {% include repository/repo_trophies.liquid username=user %}
    </div>

    ---

  {% endfor %}

{% endif %}

{% endif %}


<!-- =========================================================
     GitHub Repositories
     ========================================================= -->

{% if site.data.repositories.github_repos %}

  <section class="repository-carousel-section">

    <h2>
      GitHub Repositories
    </h2>

    {% assign reversed_github_repos = site.data.repositories.github_repos | reverse %}

    <div
      class="page-carousel page-repository-carousel"
      data-page-carousel
    >

      <button
        class="page-carousel-arrow page-carousel-prev"
        type="button"
        aria-label="Previous GitHub repositories"
      >
        ‹
      </button>

      <div
        class="page-carousel-track"
        data-page-carousel-track
      >

        {% for repo in reversed_github_repos %}

          <div class="page-carousel-slide page-repository-slide">

            <div class="repositories">

              {% include repository/repo.liquid repository=repo %}

            </div>

          </div>

        {% endfor %}

      </div>

      <button
        class="page-carousel-arrow page-carousel-next"
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
     ========================================================= -->

{% if site.data.repositories.open_repos %}

  <section class="repository-carousel-section">

    <h2>
      Open-Source Resources
    </h2>

    <div
      class="page-carousel page-repository-carousel"
      data-page-carousel
    >

      <button
        class="page-carousel-arrow page-carousel-prev"
        type="button"
        aria-label="Previous open-source repositories"
      >
        ‹
      </button>

      <div
        class="page-carousel-track"
        data-page-carousel-track
      >

        {% for repo in site.data.repositories.open_repos %}

          <div class="page-carousel-slide page-repository-slide">

            <div class="repositories">

              {% include repository/repo.liquid repository=repo %}

            </div>

          </div>

        {% endfor %}

      </div>

      <button
        class="page-carousel-arrow page-carousel-next"
        type="button"
        aria-label="Next open-source repositories"
      >
        ›
      </button>

    </div>

  </section>

{% endif %}


<script src="{{ '/assets/js/page-carousel.js' | relative_url }}"></script>
