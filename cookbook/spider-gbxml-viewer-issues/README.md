
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#cookbook/spider-gbxml-viewer-issues/README.md "View file as a web page." ) </span>

<div><input type=button class = 'btn btn-secondary btn-sm' onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/cookbook/spider-gbxml-viewer-issues/README.md'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Viewer Issues Read Me]( #cookbook/spider-gbxml-viewer-issues/README.md )



<iframe src=https://www.ladybug.tools/spider-gbxml-tools/cookbook/spider-gbxml-viewer-issues/index.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Viewer Issues </small>_

## Full Screen: [Spider gbXML Viewer Issues ]( https://www.ladybug.tools/spider-gbxml-tools/cookbook/spider-gbxml-viewer-issues/r7/spider-gbxml-viewer-issues.html )



## Concept

Open, view, examine, identify errors and fix gbXML files in 3D in your browser with free, open source entry-level Three.js JavaScript

* Currently still at a very early, experimental stage
	* If you need full issue checking use 'Aragog'


### File Check.js

* Uses file dialog box to open xml file
* Parses text into an array of lower text lines
* Carries out simple line-based searches for possible errors

### Missing gbXML Metadata

* Identify missing but required gbXML attributes. Issues Metadata R7.1

### Adjacent Space Invalid

* Surfaces with invalid adjacent spaces.

### Find Duplicate Coordinates

* Two surfaces with the same coordinates


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

## Issues

### Duplicate Coordinates

* 2018-10-21 ~ Theo ~ make sure no double counts
* 2018-10-21 ~ Theo ~ confirm finding same items a Aragog 12/14
* 2018-10-21 ~ Theo ~ determine and display faulty adjacent space issues


## Links of Interest

See also

* http://www.ladybug.tools/spider/index.html#gbxml-viewer/r14/gv-iss-issues/README.md


## Change Log


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



