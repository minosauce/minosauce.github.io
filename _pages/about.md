---
layout: about
title: About
permalink: /
subtitle: Guidance, Navigation, and Control (GNC) Research Engineer

profile:
  align: left
  image: minho_jang.jpg
  image_circular: true
  more_info: >
    <p>Satellite System Engineer<br>@ KAIST SaTReC</p>

selected_papers: false
social: true

announcements:
  enabled: true
  scrollable: true
  limit: 5

latest_posts:
  enabled: true
  scrollable: true
  limit: 5
---

## Biography

He is currently working as a satellite system engineer at the Satellite Technology Research Center (SaTReC), KAIST, Daejeon, Republic of Korea. His research interests include guidance, navigation, and control (GNC), with a particular focus on optimal control theory and its applications to missile and satellite systems.

He received the B.S. degree in electronics and computer engineering from Chonnam National University, Gwangju, Republic of Korea, in 2021, and the M.S. degree in aerospace engineering from Sejong University, Seoul, Republic of Korea, in 2025.

His current research focuses on the development of advanced guidance and control algorithms for aerospace systems, including missile interception, satellite formation flying, and autonomous spacecraft operations.

<div style="clear: both;"></div>

<h2 class="home-section-title">
  <a href="{{ '/publications/' | relative_url }}" style="color: inherit">
    Publications
  </a>
</h2>

<div class="publications home-publications">
  {% bibliography --max 5 %}
</div>

<h2 class="home-section-title">
  <a href="{{ '/projects/' | relative_url }}" style="color: inherit">
    Projects
  </a>
</h2>

<div class="projects home-projects">
  {% assign recent_projects = site.projects | sort: 'date' | reverse %}

  <div class="row row-cols-1 row-cols-md-3">
    {% for project in recent_projects limit: 3 %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>

<h2 class="home-section-title">
  <a href="{{ '/repositories/' | relative_url }}" style="color: inherit">
    Repositories
  </a>
</h2>

{% if site.data.repositories.github_repos %}
{% assign reversed_github_repos = site.data.repositories.github_repos | reverse %}

  <div class="home-repositories">
    {% for repo in reversed_github_repos limit: 2 %}
      <div class="home-repository-item">
        {% include repository/repo.liquid repository=repo %}
      </div>
    {% endfor %}
  </div>
{% endif %}
