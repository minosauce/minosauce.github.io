---
layout: page
title: Development of Localization Technology for Wind Power Control Systems
date: 2021-09-02
category: Funded
description: "Funded by: Ministry of Trade, Industry and Energy (MOTIE)"
img: /assets/img/projects/windfarm_mpc.png
thumbnail_fit: contain
related_publications: true
---

### Managing Institution: Korea Institute of Energy Technology Evaluation and Planning (KETEP)

## Project Overview

<a href="/assets/pdf/projects/windfarm_mpc.pdf" target="_blank" rel="noopener noreferrer">
  <img
    src="/assets/img/projects/windfarm_mpc.png"
    alt="Wind Farm MPC Project"
    style="width: 100%; height: auto;"
  >
</a>

- Designed and deployed the FAST.Farm mid-fidelity simulator for wind farm dynamics, enabling online environmental modeling and data collection

- Applied dynamic mode decomposition (DMD) to reduce the dimensionality of high-fidelity wind flow field data from FAST.Farm, improving computational efficiency for control algorithms

- Implemented Kalman Filter-based state estimation to enhance predictive accuracy of reduced-order wind field models

- Developed a model predictive control framework to maximize total wind farm power output using the estimated flow field states

- Engineered real-time socket communication (ZeroMQ) between the central control server and distributed wind turbine controllers

- Published the research as a journal paper in collaboration with graduate researchers at Sejong University [J.1]
- Tools & Software Used: MATLAB, Fortran, Python, OpenFAST, FAST.Farm, ZeroMQ


{% cite J1 %}
