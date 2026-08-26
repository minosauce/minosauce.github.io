---
layout: project
title: Development of Localization Technology for Wind Power Control Systems
date: 2021-09-02
end_date: 2025-04-30
category: Funded
description: "Funded by: Ministry of Trade, Industry and Energy (MOTIE)"
img: /assets/img/projects/cover_windfarm.png
related_publications: true
---

**Managing Institution: Korea Institute of Energy Technology Evaluation and Planning (KETEP)**

<br>

# Project Overview

<div class="project-figure">
  <img src="/assets/img/projects/windfarm_mpc.png" alt="Wind Power Control Systems">
</div>


- Designed and deployed the FAST.Farm mid-fidelity simulator for wind farm dynamics, enabling online environmental modeling and data collection

- Applied dynamic mode decomposition (DMD) to reduce the dimensionality of high-fidelity wind flow field data from FAST.Farm, improving computational efficiency for control algorithms

- Implemented Kalman Filter-based state estimation to enhance predictive accuracy of reduced-order wind field models

- Developed a model predictive control framework to maximize total wind farm power output using the estimated flow field states

- Engineered real-time socket communication (ZeroMQ) between the central control server and distributed wind turbine controllers

- Published the research as a journal paper in collaboration with graduate researchers at Sejong University [J.1]

- **Tools & Software Used:** MATLAB, Fortran, Python, OpenFAST, FAST.Farm, ZeroMQ

<br>

<span class="hidden-project-citation">
  {% cite J1 %}
</span>
