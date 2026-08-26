---
layout: page
permalink: /repositories/
title: Repositories
description: ""
nav: true
nav_order: 40
---


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

{% if site.data.repositories.github_repos %}

## GitHub Repositories

{% assign reversed_github_repos = site.data.repositories.github_repos | reverse %}

<div class="repositories repository-page-grid">
  {% for repo in reversed_github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>

{% endif %}

{% if site.data.repositories.open_repos %}

## Open-Source Resources

<div class="repositories repository-page-grid">
  {% for repo in site.data.repositories.open_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>

{% endif %}
