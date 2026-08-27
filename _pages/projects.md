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
  href="{{ '/assets/css/page-carousel.css' | relative_url }}"
>

<div class="projects">

  {% if page.display_categories %}

    {% for category in page.display_categories %}

      <h2 class="category">
        {{ category }}
      </h2>

      {% assign categorized_projects = site.projects | where: 'category', category %}
      {% assign sorted_projects = categorized_projects | sort: 'date' | reverse %}

      <div
        class="page-carousel page-project-carousel"
        data-page-carousel
      >

        <button
          class="page-carousel-arrow page-carousel-prev"
          type="button"
          aria-label="Previous {{ category }} projects"
        >
          ‹
        </button>

        <div
          class="page-carousel-track"
          data-page-carousel-track
        >

          {% for project in sorted_projects %}

            <div class="page-carousel-slide page-project-slide">

              <div class="projects">

                {% include projects.liquid
                  project=project
                  project_number=forloop.rindex
                %}

              </div>

            </div>

          {% endfor %}

        </div>

        <button
          class="page-carousel-arrow page-carousel-next"
          type="button"
          aria-label="Next {{ category }} projects"
        >
          ›
        </button>

      </div>

    {% endfor %}


  {% else %}


    {% assign sorted_projects = site.projects | sort: 'date' | reverse %}

    <div
      class="page-carousel page-project-carousel"
      data-page-carousel
    >

      <button
        class="page-carousel-arrow page-carousel-prev"
        type="button"
        aria-label="Previous projects"
      >
        ‹
      </button>

      <div
        class="page-carousel-track"
        data-page-carousel-track
      >

        {% for project in sorted_projects %}

          <div class="page-carousel-slide page-project-slide">

            <div class="projects">

              {% include projects.liquid
                project=project
                project_number=forloop.rindex
              %}

            </div>

          </div>

        {% endfor %}

      </div>

      <button
        class="page-carousel-arrow page-carousel-next"
        type="button"
        aria-label="Next projects"
      >
        ›
      </button>

    </div>

  {% endif %}

</div>

<script src="{{ '/assets/js/page-carousel.js' | relative_url }}"></script>
