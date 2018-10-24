
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#cookbook/spider-gbxml-viewer-pop-up/README.md "View file as a web page." ) </span>

<div><input type=button class = 'btn btn-secondary btn-sm' onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/cookbook/spider-gbxml-viewer-pop-up/README.md'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Viewer Pop-Up Read Me]( #cookbook/spider-gbxml-viewer-pop-up/README.md )


<iframe src=https://www.ladybug.tools/spider-gbxml-tools/cookbook/spider-gbxml-viewer-pop-up/index.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Viewer Pop-Up</small>_

## Full Screen: [Spider gbXML Viewer Pop-Up]( https://www.ladybug.tools/spider-gbxml-tools/cookbook/spider-gbxml-viewer-pop-up/r7/spider-gbxml-viewer-pop-up.html )



## Concept

Click on any surface in a gbXML model to display all its attribute data in a pop-op window

* Toggle the display of 3D surfaces based on user input
* Click on any surface in the model to:
	* View id, name, type CAD object id
	* View adjacent space parameters
	* Toggle view of space and storey
	* View dimensions and area


### Other names used in previous releases

* Heads-Up Display ( HUD)
* Context menu


## To Do / Wish List

* 2018-10-15 ~ PolyLoop display:
	* Put in a details tag
	* On toggle display vertex numbers in 3D model
* 2018-10-15 ~ Rectangular Geometry: display outline
* 2018-01-02 ~ Multiple types of heads-up modules with different agendas
* 2018-01-02 ~ Add in-world placard at cursor location
	* Show space names at cursor locations

See also

* https://github.com/ladybug-tools/spider/tree/master/gbxml-viewer/r14/gv-ctx-context-menu



## Issues



## Links of Interest



## Change Log

#### 2018-10-24 ~ Theo

SGV Pop-Up R7.6
* Fix issues with display of adjacent spaces
* Add nice POP.getArray function
* Enhance document titling


#### 2018-10-22 ~ Theo

SGV Pop-Up R7.5
* Rename current folder
* Done: 2018-10-21 ~ Michal/Theo ~ CADObjectId: no commas
* Nothing selected pop-up
	* Add zoom all button
	* Add Campus attributes and building attributes
	* Add tool tips
* Update current status and other text
* Switch visibility toggle from eye.png to Unicode character

Done
* 2018-10-14 ~ Display gbXML meta information


#### 2018-10-20 ~ Theo

SGV Pop-Up R7.4
* Many fixes relating to buttons user experience
	* Buttons toggle visibility of elements and change color in more predictable manner
	* Add toggle surface visible button
	* Add zoom surface and zoom whatever visible buttons
* Add design notes details section
* Add release number var

Mostly fixed or well underway

* 2018-10-17 ~ Errors id one or no spaces
* 2018-10-17 ~ No Zone info being displayed
* 2018-10-14 ~ Buttons not all reverting to gray when all surfaces are visible

Very old wish list item
* 2018-03-04 ~ Identify two adjacent spaces at same time


The code in this pop-up-gbxml.js file is far simpler than the code in AGV R14 gv-ctx.js.

There are several reasons for this
* The mission for this module is simpler:
	* Toggle visibility
	* Identify element attributes
* There is far less code abstraction
	* https://en.wikipedia.org/wiki/Abstraction_principle_(computer_programming)
	* basic dictum that aims to reduce duplication of information in a program
* Almost all code used by this module is in this module



#### 2018-10-18 ~ Theo

SGV Pop-Up R7.3
* Update mnu text
* Space and storey buttons use names
* Attributes for surface, space and storey all update when you click respective buttons
* Attributes for everything display as expected

R7.3 has been forked to the main lib r7 and is now available via

https://www.ladybug.tools/spider-gbxml-tools/gbxml-viewer-basic/


Well underway
* 2018-10-15 ~ Adjacent Space: show attributes


#### 2018-10-15 ~ Theo

* Fix not displaying on newly opened model
* Add entire surface highlights not just triangle

Getting there / Well underway

* 2018-10-12 ~ Nicer display of attribute data
* 2018-10-12 ~ View outline of entire polygon not just a triangle
	* 2018-03-05 ~ Goal: surface + two adjacent: all visible at once

#### 2018-10-14 ~ Theo

Pop-Up R7.1
* Many new features
* Change of direction / design intent


Navigating and identifying are two different things. As we design, let us try to keep these actions separate.

Navigate/Highlight/Focus/Toggle Visibility/Spotlight/Accentuate/Make Clear

The first part is placing the selected surface in its context visually
* Identify the other gbXML elements a surface is a member of
* Toggle the visibility of elements

Identify Attributes
* Display attributes of currently displayed element
* List all the given attributes of the selected element

#### 2018-10-11 ~ Theo

* Update description

#### 2018-10-10 ~ Theo

* First commit


***

### <center title="Howdy! My web is better than yours. ;-)" ><a href=javascript:window.scrollTo(0,0); style="text-decoration:none !important;" > &#x1f578; </a></center>



