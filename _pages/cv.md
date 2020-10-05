---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* B.A. in Applied Mathematics and Computer Science, UC Berkeley, 2020
* Ph.D. in Computer Vision and Robotics, UT Austin (Ongoing)

Work experience
======
* Summer 2019: Software Engineering Intern
  * Hewlett Packard Enterprise (HPE)
  
Skills
======
* Python, Java, C
* Deep Learning
  * PyTorch
  * Tensorflow

Publications
======
  <ul>{% for post in site.publications %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Talks
======
  <ul>{% for post in site.talks %}
    {% include archive-single-talk-cv.html %}
  {% endfor %}</ul>
  
Teaching
======
  <ul>{% for post in site.teaching %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  

