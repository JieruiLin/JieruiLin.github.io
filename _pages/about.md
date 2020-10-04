---
permalink: /
title: "About me"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I'm a first-year Ph.D. student at UT Austin advised by Prof. [Philipp Krähenbühl](https://www.philkr.net/) and Prof. [Yuke Zhu](https://www.cs.utexas.edu/~yukez/). Before coming to Austin, I spent four wonderful years at UC Berkeley as an undergraduate and a researcher at [BAIR](https://bair.berkeley.edu/), advised by Prof. [Trevor Darrell](https://people.eecs.berkeley.edu/~trevor/) and Prof. [Jitendra Malik](https://people.eecs.berkeley.edu/~malik/).

My research lies at the intersection of vision, robotics and machine learning. I'm interested in learning meaningful visual representations through interaction and using such priors to faciliate down-stream tasks. I also work on building robust and generalizable learning algorithms that are applicable in the real world.

News
======
* Our recent paper ***Fighting Copycat Agents in Behavioral Cloning from Multiple Observations*** is accepted to NeurIPS 2020. Paper and code will be public soon!

Projects
======

### Fighting Copycat Agents in Behavioral Cloning from Multiple Observations 
Chuan Wen*, Jierui Lin*, Trevor Darrell, Dinesh Jayaraman and Yang Gao 

![alt text](../images/copycat.png?raw=true)

***Copycat problem*** in an autonomous driving scenario: The vehicle waits at the red light and start to drive when the light turns green. A ***copycat*** policy which simply replays its previous action will predict all but one actions correctly while being useless when evaluated in the environment. 

To combat this ***copycat problem***, we propose an adversarial approach to learn a feature representation that removes excess information about the previous expert action nuisance correlate, while retaining the information necessary to predict the next action. In our experiments, our approach improves performance significantly across a variety of partially observed imitation learning tasks.
