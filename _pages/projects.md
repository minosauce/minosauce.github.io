---
layout: page
title: Projects
permalink: /projects/
description:
nav: true
nav_order: 30
display_categories:
  - Funded
  - Independent
---

<link
  rel="stylesheet"
  href="{{ '/assets/css/showcase-carousel.css' | relative_url }}"
>

<div class="projects projects-page">
  {% if page.display_categories %}
    {% for category in page.display_categories %}

      {% assign categorized_projects = site.projects | where: 'category', category %}
      {% assign sorted_projects = categorized_projects | sort: 'date' | reverse %}

      {% if sorted_projects.size > 0 %}
        <section class="showcase-section project-category-section">

          <h2 class="category">
            {{ category }}
          </h2>

          <div
            class="showcase-carousel showcase-large-carousel"
            data-paged-carousel
            data-desktop-items="6"
            data-desktop-columns="3"
            data-tablet-items="4"
            data-tablet-columns="2"
            data-mobile-items="1"
            data-mobile-columns="1"
          >
            <button
              class="showcase-arrow showcase-prev"
              type="button"
              aria-label="Previous {{ category }} projects"
            >
              ‹
            </button>

            <div
              class="showcase-source"
              data-carousel-source
              style="--showcase-fallback-columns: 3;"
            >
              {% for project in sorted_projects %}
                <div class="showcase-item">
                  <div class="projects showcase-project-host">
                    {% include projects.liquid
                      project=project
                      project_number=forloop.rindex
                    %}
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
              aria-label="Next {{ category }} projects"
            >
              ›
            </button>
          </div>

        </section>
      {% endif %}

    {% endfor %}
  {% else %}

    {% assign sorted_projects = site.projects | sort: 'date' | reverse %}

    <section class="showcase-section">
      <div
        class="showcase-carousel showcase-large-carousel"
        data-paged-carousel
        data-desktop-items="6"
        data-desktop-columns="3"
        data-tablet-items="4"
        data-tablet-columns="2"
        data-mobile-items="1"
        data-mobile-columns="1"
      >
        <button
          class="showcase-arrow showcase-prev"
          type="button"
          aria-label="Previous projects"
        >
          ‹
        </button>

        <div
          class="showcase-source"
          data-carousel-source
          style="--showcase-fallback-columns: 3;"
        >
          {% for project in sorted_projects %}
            <div class="showcase-item">
              <div class="projects showcase-project-host">
                {% include projects.liquid
                  project=project
                  project_number=forloop.rindex
                %}
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
          aria-label="Next projects"
        >
          ›
        </button>
      </div>
    </section>

  {% endif %}
</div>

<script src="{{ '/assets/js/showcase-carousel.js' | relative_url }}"></script>
