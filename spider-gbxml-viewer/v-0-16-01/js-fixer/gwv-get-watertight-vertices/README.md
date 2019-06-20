# gwv-get-watertight-vertices Read Me

[Source code]( https://github.com/ladybug-tools/spider-gbxml-fixer/tree/master/r0-4-0/gwv-get-watertight-vertices )

<details open>

<summary>Concept</summary>

Check for surfaces with vertices unconnected to other vertices

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

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-06-07 ~ Theo


* F - GWV.js: First commit

</details>