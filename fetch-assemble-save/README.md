
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#./fetch-assemble-save/README.md "View file as a web page." ) </span>

<div><input type=button class = 'btn btn-secondary btn-sm' onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/fetch-assemble-save/README.md'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<!--
Develop branch / [Master branch]( https://www.ladybug.tools/spider-gbxml-tools/ )
-->

# [Fetch Assemble Save Read Me]( #fetch-assemble-save/README.md )


<iframe src=https://rawgit.com/ladybug-tools/spider-gbxml-tools/develop/fetch-assemble-save/r3/fetch-assemble-save.html width=100% height=400px >Iframes are not viewable in GitHub source code views</iframe>


## Concept

Fetch source files from a CDN, assemble these into a single HTML file, save the data to a file

* Buttons allow you to select various collections of assemblies
	* Assemble Master branch of Three.js + Trackball + Basic core
	* Assemble any release from 1 to 95 - not all releases actually run
	* Assemble Master branch with latest release of gbXML Viewer Basic
	* Assemble Master branch with latest release of gbXML Viewer Basic on top of latest OpenStudio core HTML file
* Assembled text appears in a textarea element
* HTML files appear in an Iframe element
* Save button to download and save as an HTML file
* May be adapted to load any combination of HTML and JavaScript files
* 7 KB / no dependencies

Usage: best to reload page between assemblies. Keep the JavaScript console open to help spot errors.


***

### Full screen: [Fetch Assemble Save R3 ]( https://rawgit.com/ladybug-tools/spider-gbxml-tools/develop/fetch-assemble-save/r3/fetch-assemble-save.html )

* All files now loaded as external text files
* Loads any release of Three.js - not fully tested
* Loads latest release of gbXML Viewer Basic
* Loads core HTML file extracted from OpenStudio embeddable_gbxml_editor.html
	* Loads test file but has issues updating the display
* Adds link to source code on GitHub



### Full screen: [Fetch Assemble Save R2 ]( https://rawgit.com/ladybug-tools/spider-gbxml-tools/develop/fetch-assemble-save/r2/fetch-assemble-save.html )

* Runs files loaded locally - uses xmlhttprequest rather than fetch
* gbML test file is loaded as expected


***

### Full screen: [Fetch Assemble Save R1]( https://www.ladybug.tools/spider-gbxml-tools/fetch-assemble-save/r1/fetch-assemble-save.html )


***

## To Do / Wish List

* Investigate and add all the OpenStudio requirements
* Needs lights
* Needs some modification to run Three.js releases older than r92
* Add link to source code
* Add dropdown with links to all Three.js releases
* Add strip out out multiple tabs and spaces feature


## Issues



## Links of Interest



## Change Log

### 2018-08-03 ~ Theo

* First commit


***

## <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > &#x1f578; </a></center>



