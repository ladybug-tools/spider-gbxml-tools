
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#cookbook/README.md "View file as a web page." ) </span>

<div><input type=button class = 'btn btn-secondary btn-sm' onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/cookbook/README.md'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Viewer Cookbook Read Me]( #cookbook/README.md )

<!--
<iframe src=https://www.ladybug.tools/spider-gbxml-tools/cookbook/index.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Viewer Cookbook</small>_

## Full Screen: [Spider gbXML Viewer Cookbook]( https://www.ladybug.tools/spider-gbxml-tools/cookbook/cookbook.html )
-->

<br>

## [Cookbook Gallery]( #cookbook/cookbook-viewer-one-pager/index.html )

* Skim through all the projects in the Cookbook by scrolling down a single page gallery

<br>

## Concept

### Coding Style

These scripts here are [cookbook]( https://en.wikipedia.org/wiki/Cookbook#Usage_outside_the_world_of_food ) style example code

The scripts are intended to help with rapid iteration of simple code edits. For example, choosing a pretty color or selecting a pleasing length may require the viewing of dozens of 'fails' involving editing the code, changing a number, saving it, refreshing the browser, and judging the results.

Until there is an AI debugger for ugliness, the path toward a beautiful user experience is paved with the coder's fails.

Here we use a variety of strategies in order to get up to speed at faster fails per hour.

The tricks include:

* Make the code a readable as possible
	* Avoid using symbols such as ~~ or => that requires extra mental processing
	* Make the code as much as possible like reading a line of English prose
* Use a variety of color to indicate that adjacent and connected elements are actually separate elements
* If a feature creates an element then display that element immediately and in a distinguishable manner.
	* You should not have to click to see if something is actually there
* Enable viewing everything upon loading
	* use transparency and 'exploding' element positions
* Allow as much possible user interaction as possible
	* Cookbook examples are places where you find out what crashes your app
	* Will your script survive a user entering negative numbers?
	* Can things get too big or small or invisible and come back and still be usable?
	* Preventing users from entering invalid data is a very separate issue
		* And we need to provide some cookbook examples of helping you input useful data
* Do not apply fixes for particular operating systems
	* Try to make code easier and faster to read / avoid thinking about complications / grasp the essence
	* Example: issues with iframes on Apple mobile devices
	* Example: wide lines on Widows OS with certain browsers

### Files

All the examples here are standalone files.

They follow the Three.js examples: https://threejs.org/examples/

* All HTML, CSS and JavaScript - apart from library files - are in a single HTML file



## To Do / Wish List

* 2018-10-21 ~ Theo ~ Add example for gbXML loader
* 2018-10-21 ~ Theo ~ Add example for file open
* 2018-10-21 ~ Theo ~ File Open: bring in code to load default file
* 2018-10-21 ~ Theo ~ File Open: confirm default file feature works locally
* 2018-10-17 ~ @EK-CEL It would be nice to have an application (probably a Spider module) which can split a gbXML file by Levels for a number of partial files. Then I can upload each file and review it. After all partial files are reviewed I can join them together back to a single gbXML file.



## Issues



## Links of Interest



## Change Log

### 2018-10-09 ~ Theo

* First commit


***

### <center title="Howdy! My web is better than yours. ;-)" ><a href=javascript:window.scrollTo(0,0); style="text-decoration:none !important;" > &#x1f578; </a></center>



