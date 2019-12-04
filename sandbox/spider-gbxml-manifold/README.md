# Spider gbXML Manifold Read Me

## Latest stable version [Spider gbXML Manifold ]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-manifold/ "This is the 'canonical' or best and safest link to keep" )

<details open >

<summary>Concept</summary>

## Mission

* Ascertain if a collection of points is water tight or manifold

### Request source: Add "water-tight" functionality so an imperfect model can be sealed 100%

[Issue 19]( https://github.com/GreenBuildingXML/GreenBuildingXML.github.io/issues/19)

This is per a Trane TRACE 3D project manager: The only way to import a gbXML model into TRACE 3D is one that is 100% watertight. Since most models exported by Revit are NOT watertight, there needs to be a way to make it tight. The gbXML viewer could help.

### Define "Manifold"

Manifold: a collection of points forming a certain kind of set, such as those of a topologically closed surface or an analog of this in three or more dimensions.

https://en.wikipedia.org/wiki/Manifold

"watertight"

* closely sealed, fastened, or fitted so that no water enters or passes through.

## Plan of attack

We would like to determine if a gbXML model is manifold, given the following guidelines.

* A model is made up of polygon multiple surfaces where the vertices are coplanar
* When two surfaces intersect there are vertices at the end points of the line of intersection

_Further investigation of the gbXML schema is required in order to establish a full set of guidelines._


### Vertices check

In general, and as a rule of thumb, there are at least three identical vertices at each point of intersection. Think of the three surfaces that form the corner of a box. In gbXML there may be the special case where a wall abuts but does not cross another wall. In this case there are the corner vertices of the wall and floor bit only a line of intersection with the other wall.

In any case, in a gbXML model any vertex a part of any surface that has only a single identical counterpart vertex belonging to a different surface is worthy of investigation.

The current approach is to identify every vertex of every planar geometry surface in a gbXML file and count the number of duplications for each appearance. If a vertex has only two duplicates, it is flagged for further examination.

### Triangular faces check

Three.js meshes are composed of triangular faces. A further version of the script will check the edges of every face and establish whether or not there is a duplicate edge occurring in another face. The absence of a duplicate will indicate a non-manifold mesh.





## Versions

#### [Spider gbXML Manifold v0.02 ]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-manifold/v-0-02/spider-gbxml-manifold.html )

Updates: 2019-12-03

* F: Add lines with Width
* F: Add simple lighting
* F: Add updated links to sample files
* F: Add 'Surfaces with issues' menu panel and demo functions

The current 'lines and boxes' approach to visualizing the data is a work-in-progress. Given that the idea is to identify vertices with issues, it seems like a good idea. But, as of this writing, it seems that there will be problem with trying to identify which surface a vertex belongs to.



#### [Spider gbXML Manifold v0.01 ]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-manifold/v-0-01/spider-gbxml-manifold.html )

* First release
* Vertices with possible issues are highlighted in magenta.
* gray = shade surfaces
* yellow = interior surfaces
* cyan = exterior surfaces

</details>

<details>

<summary>To Do / Wish List</summary>


</details>

<details>

<summary>Issues</summary>


</details>



<details open>

<summary>Links of interest</summary>

Proving manifold get very complcated very quickly

* https://en.wikipedia.org/wiki/Topological_manifold
* https://en.wikipedia.org/wiki/Hausdorff_space
* https://en.wikipedia.org/wiki/Triangulation_(topology)




</details>

<details open>

<summary>Change Log</summary>

### 2019-11-19 ~ Theo

* F - First commit

</details>

