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

This paper presents a data-driven approach to maximize the power of a wind farm by developing a dynamic mode decomposition with input and output for reduced order model (DMDior)-based reduced
order model (ROM) for model predictive control (MPC). The main goal of this research is to efficiently model and manage the complex flow field within a wind farm to enhance power production. We leveraged DMDior to transform extensive high-dimensional flow data into an accurate yet simplified ROM, which successfully represents the essential dynamic features of wind flow, including the critical interactions between turbines and their adaptive response to environmental changes. Based on this ROM, the MPC framework was carefully designed. 

MPC uses this model to dynamically adjust the yaw angle of a wind turbine to optimally match changing wind patterns to maximize power output. The system also incorporates an adaptive Kalman filter designed for the state estimation in MPC applications. This estimation is critical to the effective execution of the MPC in each iteration. This ensures that the MPC operates based on the most up-to-date and accurate representation of the wind farm’s state, improving the overall reliability and efficiency of the control strategy. This approach demonstrates a practical and effective way to increase the power output of a wind farm, with experimental results indicating a power increase of about 4.72%.


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
