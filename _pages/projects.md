---
layout: page
title: Projects
permalink: /projects/
nav: true
nav_order: 30
display_categories: [Funded, Independent]
horizontal: false
---

<div class="projects">

{% if page.display_categories %}
{% for category in page.display_categories %}

      <h2 class="category">
        {{ category }}
      </h2>

      {% assign categorized_projects = site.projects | where: 'category', category %}
      {% assign sorted_projects = categorized_projects | sort: 'date' | reverse %}

      <div class="row row-cols-1 row-cols-md-3 g-4">
        {% for project in sorted_projects %}
          {% include projects.liquid
            project=project
            project_number=forloop.rindex
          %}
        {% endfor %}
      </div>

    {% endfor %}

{% else %}

    {% assign sorted_projects = site.projects | sort: 'date' | reverse %}

    <div class="row row-cols-1 row-cols-md-3 g-4">
      {% for project in sorted_projects %}
        {% include projects.liquid
          project=project
          project_number=forloop.rindex
        %}
      {% endfor %}
    </div>

{% endif %}

</div>
