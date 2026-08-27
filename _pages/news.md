---
layout: page
title: News
permalink: /news/
nav: true
nav_order: 50
---

<link
  rel="stylesheet"
  href="{{ '/assets/css/news-pagination.css' | relative_url }}"
>

{% include news.liquid per_page=8 %}

<script src="{{ '/assets/js/news-pagination.js' | relative_url }}"></script>


<script
  src="{{ '/assets/js/pagination-stability.js' | relative_url }}"
></script>
