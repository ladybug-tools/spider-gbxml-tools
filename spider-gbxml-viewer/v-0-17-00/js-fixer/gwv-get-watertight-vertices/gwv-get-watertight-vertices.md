# GWV Get Watertight Vertices Read Me

[Source code]( https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-16-01/js-fixer/gwv-get-watertight-vertices )

<details open>

<summary>Concept</summary>

Check for surfaces with vertices unconnected to other vertices

2019-06-26 ~ Generally seems to be working well

### Rationale

A typical junction of surfaces - such as an external wall / roof corner - has at least three identical corner points or vertices.

Two interior floors with continuous interior walls creates twelve identical corner coordinates.

It is therefore possible to check for "watertight" conditions by identifying all vertices and noting if each vertex is part of a triad of identical points. If a vertex does not have identical partners then there is an issue with the surface it belongs to.

The appearance of just two identical coordinates occurs from time to time. These may or may not be valid. A check for this condition is work to be done.


### Operating procedure

1. Find all surfaces in the gbXML file
2. Discard all Shade surfaces
3. Find all planar geometry in each surface
4. Discard any planar geometry associated with openings
5. Find all coordinates in planar geometry
6. Identify all unique coordinates
7. Identify the number of instances or number of times used in model for each unique coordinate
8. If a vertex of a vertex is only used once in the model then flag that surface as having an issue


</details>

<details>

<summary>To Do / Wish List</summary>


</details>

<details open >

<summary>Issues</summary>

### test case

bristol-clifton-downs-broken.xml includes surface 'aim14466' which is an Air surface duplicate of a Shade surface.
Because Shade type surfaces are ignored, the vertices of the Air surface are found to be unique and are flagged.

</details>

<details>

<summary>Change Log</summary>

### 2019-07-23 ~ Theo

GWV 0.17.00-0gwv

* R - GWV.js: Cleanup


### 2019-06-26 ~ Theo

gwv-get-watertight-vertices
B - GWV.js: checks for inclusion in list of valid surfaces
C - GVW: update readme
R - GVW.js: cleanup


### 2019-06-07 ~ Theo

* F - GWV.js: First commit

</details>