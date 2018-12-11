
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/README.md "View file as a web page." ) </span>

<div><input type=button class = 'btn btn-secondary btn-sm' onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/README.md'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Viewer Issues Read Me]( #sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/README.md )



<iframe src=https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/index.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Viewer Issues </small>_

## Full Screen: [Spider gbXML Viewer Issues ]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-issues/index.html )



## Concept

Open, view, examine, identify errors and fix gbXML files in 3D in your browser with free, open source entry-level Three.js JavaScript

* Currently still at a very early, experimental stage
* If you need full issue checking use 'Aragog'


### File Check.js

* Uses file dialog box to open xml file
* Parses text into an array of lower text lines
* Carries out simple line-based searches for possible errors

### Missing gbXML Metadata

* Identify missing but required gbXML attributes.

### Surface Type Invalid

* Surfaces with an invalid surface type assignment
* Probably a fairly rare occurrence

### Find Duplicate Coordinates

* Two surfaces with the same coordinates


### Adjacent Space Invalid

* Surfaces with invalid adjacent spaces.

To be deprecated.

Being replaced by multiple shorter and simpler modules dedicated to identifing and fixing very specific issues.




### Adjacent Space Extra

Surfaces with an invalid adjacent space:
* surface type Shade with one or more adjacent spaces
* surface type such as ExteriorWall or Roof with two or more adjacent spaces

### Adjacent Space Duplicate

* Surfaces of type that take two adjacent spaces such as InteriorWall with two adjacent spaces that are identical


### CAD Object ID Missing

* Surface without a CAD object ID


<!--
### Duplicate Rectangular Geometry

* Identify surfaces with identical rectangular geometry File Check

### Inclusions

* Overlapping bounding boxes


### Point inside Polygon

* Yes


## To Do / Wish List

### Point in Polygon

Things to try
* Two surfaces have identical coordinates, but one surface has fewer coordinates than the other
* Two surfaces have overlapping bounding boxes, but have different surface types or other differences
	* 2018-10-30 ~ Not finding different surface types


## Issues

### Duplicate Coordinates

* 2018-10-21 ~ Theo ~ make sure no double counts
* 2018-10-21 ~ Theo ~ confirm finding same items a Aragog 12/14
* 2018-10-21 ~ Theo ~ determine and display faulty adjacent space issues
-->


## To Do / Wish List


## Issues




## Links of Interest

See also

* http://www.ladybug.tools/spider/index.html#gbxml-viewer/r14/gv-iss-issues/README.md


## Change Log


### 2018-12-10 ~ Theo

Spider gbXML Text Parser R10.2
* Spider gbXML Viewer Issues Read me
	* Fix links
	* Edit text
* iscor-issues-core.js
	* Add current status details element
	* Update list of modules to run
* issti-issues-surface-type-invalid.js
	* Update current status / add link
	* Code refactor /cleanup / minor bug fixes
* isasi-issues-adjacent-space-invalid.js
	* Deprecate
* isase-issues-adjacent-space-extra.js
	* Update current status / add link
	* Code refactor /cleanup / minor bug fixes
* isasd-issues-adjacent-space-duplicate.js
	* Code cleanup
	* Add spaceOtherShowHide button
	* Add adjacentSpaceUpdate button - not working yet

### 2018-12-09 ~ Theo

* Read me file
	* Forked to SVTP R10
* isase-issues-adjacent-space-extra.js
	* Add to read me
	* Update menu text
	* Add show/hide space
	* Add delete reference
	* Generaly working as intended
	* 2018-12-07 ~ new module
* isasd-issues-adjacent-space-duplicate.js
	* Making progress
	* Select a surface and buttons appear and update
	* Add space show/ hide
	* Add select from list of space
	* Add update surface button - not yet operational

### 2018-11-?? ~ Theo
Issues Adjacent Space Invalid ISASI R7.1
* Fix if adjacent two spaces is not an array

### 2018-10-30 ~ Theo

Issues ISIN R7.1
* A tiny bit of progress


### 2018-10-29 ~ Theo

Issues ISPIP R7.2
* More work on point in polygon
* Sadly, the algorithm only seems to identify valid surfaces

### 2018-10-28 ~ Theo

Issues ISPIP R7.1
* Good progress but still finding false positives



### 2018-10-27 ~ Theo

Issues R7.0
* Add Point In Polygon panel
	* Check if the coordinates of one surface are inside the coordinates of another surface
* Add Adjacent Space Invalid panel
* Add Template panel

### 2018-10-26 ~ Theo

Issues R7.0
* Add Duplicate Rectangular Geometry panel
* Generally add text and status panel


### 2018-10-19 ~ Theo

* Missing gbXML Metadata
	* working as R14
* Find Duplicate Coordinates
	* As R14 with updated user experience
	* Fixes: TBD
* Inclusions
	* At a very early stage

### 2018-10-16 ~ Theo

* First commit


***

### <center title="Howdy! My web is better than yours. ;-)" ><a href=javascript:window.scrollTo(0,0); style="text-decoration:none !important;" > &#x1f578; </a></center>



