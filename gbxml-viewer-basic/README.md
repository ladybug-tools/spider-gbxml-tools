
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/index.html#gbxml-viewer-basic/README.md "View file as a web page." )</span>

<div><input type=button class="btn btn-secondary btn-sm" onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/gbxml-viewer-basic/README.md'" value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Viewer Basic Read Me]( #gbxml-viewer-basic/README.md )


<iframe class=iframeReadMe src=https://www.ladybug.tools/spider-gbxml-tools/gbxml-viewer-basic/ width=100% height=400px >Iframes are not displayed on github.com</iframe>
_<small>Spider gbXML Viewer Basic</small>_

## Latest stable release: [gbXML Viewer Basic]( https://www.ladybug.tools/spider-gbxml-tools/gbxml-viewer-basic/ )

## Concept

Spider gbXML Viewer provides a number of scripts that enable you to carry out a variety of tasks relating to selecting, viewing and manipulating gbXML files.

'Spider gbXML Viewer Basic' assembles several of the scripts into a single assembly. The objective is to provide:

* Help you explore the possibilities
* Provide a core set of scripts
* Enable speedier more full testing of the interaction between the scripts

### Background

The ['Aragog' gbXML Viewer]( https://www.ladybug.tools/spider/gbxml-viewer/ ) is a nice bit of work - or it will be one day - but the code base is getting lengthy and convoluted. It's no longer a place for beginners to start. You can't just open it up and see what's going on in fifteen minutes or so.

Therefore we now have gbXML Viewer Basic

This is a very basic gbXML file viewer
* Use this code if you want a the basic idea of how to read a gbXML file and turn it into a Three.js scene
* Use this code if you want to learn how to take sets of coplanar points and convert these to Three.js 2D Shapes with holes - all positioned and rotated arbitrarily in 3D space.

The intention is that the core gbXML parser here and the core parser in the full-featured gbXML Viewer and the parser in the RAD Viewer all contain identical or nearly identical code.

The code should be simple, fast and easy to read. If you can read and understand the Three.js examples and the [Mr.doob coding style&trade; ]( https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2 ), then you should feel at home here. Be prepared to enjoy the white space!

A good function to look at is ```GBX.get3dShape()```. This function takes a set of 3D coplanar points along with points that bound any holes and converts these into a Three.js mesh bounded by those points. This mesh is created using a Three.js Shape - which is excellent stuff but very 2D. The conversion requires that you conjugate your quaternions and do all manner of other unreal linear algebra thinking. All this in just 300 or so lines of code.

The gbXML portions are also interesting. The routines end up with three sets of data for every element in the original file: XML, JSON and Three.js meshes.



## Latest stable release: [gbXML Viewer Basic R7]( https://www.ladybug.tools/spider-gbxml-tools/gbxml-viewer-basic/r7/spider-gbxml-viewer-basic.html )

This release incorporates the first significant changes in many months to the core gbXML loading and parsing algorithms. The new code is smaller and faster and appears to generate fewer visual errors.

The updates occurred after applying the lessons learned from the more recent Spider RAD Viewer. Both apps are now beginning to share a lot of code.

#### 2018-10-15 ~ Theo

R7.6
* Add better edges display for gbXML data

#### 2018-10-10

* Add pop-up information

#### 2018-10-08
* A bit faster still?
* gbXML loader code dropped from 590 lines to 360 lines
* Appears to be fixing some rendering errors that occur in previous releases
* Built on Three.js [Buffer Geometry]( https://threejs.org/docs/#api/en/core/BufferGeometry)
	* An efficient representation of mesh, line, or point geometry. Includes vertex positions, face indices, normals, colors, UVs, and custom attributes within buffers, reducing the cost of passing all this data to the GPU.
* Uses Three.js [ShapeUtils.triangulateShape()]( https://threejs.org/docs/#api/en/extras/ShapeUtils )
	* ShapeUtils.triangulateShape() uses Earcut: An implementation of the [earcut polygon triangulation algorithm]( https://en.wikipedia.org/wiki/Polygon_triangulation#Ear_clipping_method ). The code is a port of [mapbox/earcut]( https://github.com/mapbox/earcut ).
	* Previous releases are based on the more high level Three.js Shape geometry

Future thought: could we put all the triangles in a single mesh and yet still identify and highlight each of the original surfaces?

## [gbXML Viewer Basic R6]( https://rawgit.com/ladybug-tools/spider-gbxml-tools/master/gbxml-viewer-basic/r6/gbxml-viewer-basic.html )

* Significantly faster
* Adds file open dialog and location.hash functions to open files
* More complete report of data being loaded


## [gbXML Viewer Basic R5]( https://rawgit.com/ladybug-tools/spider-gbxml-tools/master/gbxml-viewer-basic/r5/gbxml-viewer-basic.html )


## [gbXML Viewer Basic R4]( https://www.ladybug.tools/spider-gbxml-tools/r4/gbxml-viewer-basic/index.html )

* Prior releases here: https://www.ladybug.tools/spider/#gbxml-viewer-basic/README.md


## Wish list



## Issues

* 2018-06-02 ~ Theo ~ Need a spider name - preferably one without a trademark, perhaps a nice-sounding latin name: https://en.wikipedia.org/wiki/List_of_spider_common_names
* 2018-06-02 ~ Theo ~ currently surfaces, edges and opening are each their own group of objects. Could nicer things happen if the edges and opening were children of their parent surface??

### Sample Files

* 2018-10-24 ~ Theo ~ Add own folder and test app
* 2018-10-24 ~ Theo ~ buttons not toggling properly


## Links of Interest

* https://www.ladybug.tools/spider/#gbxml-viewer/README.md



## Change Log


### 2018-07-16 ~ Theo

* Code cleanup
* Update develop package JSON

### 2018-07-14 ~ Theo

* Create develop branch
* Update to gBV R5.0
* GBX.parseFileXML( text ): now converts a string to XML
* New function: GBX.getStringFromXml( xml ) returns an XML file converted to a string

### 2018-07-13 ~ Theo

GVB R4.1
* Forked fromSpider repo to Spider gbXML Tools repo

### 2018-06-04 ~ Theo

R4
* ten lines or so shorter
* And a few more internal links between Three.js data and gbJSON data


### 2018-06-02 ~ Theo

R3
* Much improved geometry dispose
* Memory information display
* Two more files to load on menu
* Add visibility toggles
* Add zoom all button
* More cleanup and updating variable names


### 2018-06-01 ~ Theo

R2
* Cleaned up and simplified version of R1

R1
* First commit
* Code almost a duplicate of gbXML Viewer R14 gbp.js

***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > &#x1f578; </a></center>



