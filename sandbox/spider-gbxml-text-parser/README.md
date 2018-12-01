
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-text-parser/README.md "View file as a web page." ) </span>

<div><input type=button class = "btn btn-secondary btn-sm" onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-text-parser/README.md'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Text Parser Read Me]( #sandbox/spider-gbxml-text-parser/README.md )


<iframe src=https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/index.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Text Parser</small>_

## Full Screen: [Spider gbXML Text Parser R9.9]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r9/spider-gbxml-text-parser.html )


***

## Concept

Open and examine very large gbXML files in your browser with free, open source JavaScript

***

The Spider gbXML Text Parser script is a work in progress for of opening very large gbXML files,

It is currently being tested on a gbXML file ( private and not sharable ) of 698,000,000 bytes and:

* Lines of text: 8,746,903
* Spaces: 5,550
* Surfaces: 70,774
* Zones: 2,618

The file breaks the Chrome browser on Windows 10, the FireFox browser on Windows 10 and OpenStudio on Windows 10. Opens in FZK Viewer but with very slow performance.

But Spider gbXML Text Parser loads and updates the file quite well - in your browser.

### Features

Open File loader
* Load very large ( greater than 700 megabytes ) gbXML at a reasonable speed
* Read files in either UTF-8 or UTF-16 format
* Open remote files via a URL or local files via the file dialog box
* Open and automatically extract UTF-8 and UTF-6 files contained in ZIP compressed folders using file dialog box
* Save file to disk

gbXML Text Parser
* Files size: 8 kb
* Reads and operates on file as if an ordinary text file
* Very simple operations
* Provides feedback and statistics of loading
* Currently not parsing openings at load time - makes loading much faster

Reports
* Buttons toggle surface type display
* Buttons provide horizontal, vertical, exterior and exposeToSun toggles

Level-by-level 'Evgeny' Workflow
* Select visible storey from select box
* Actual workflow is a work-in-progress

Pop-up Text Parser
* Response time OK even with large files
* Show/hide surface, spaces, storey, zone and entire model
* Display attributes for each type of element
* Zoom all and toggle openings



***


## Change Log

### 2018-11-30 ~ Theo

R9:12
* fil-open-file.js
	* Add full-featured open file DIV
	* Supports drag and drop
	* Supports inter-session default file
	* Add current status details DIV
isdc-issues-duplicate-coordinates.js
	* Add display ids of duplicate surfaces as opention in a select element
	* Select an option to set focus to selected surface and update pop-up dialog
	* Add 'delete selected surface' button


### 2018-11-29 ~ Theo

R9.11
* ismet-issues-metadata.js
	* updte button: 'Add changes to data in memory'
	* Click 'Save file as' button in File menu to save changes to a local file


#### 2018-11-26 ~ Theo

R9.9
* FIL Open File
	* Better reporting of stats while opening files
	* Add FIL.onOpenFile()
	* Run through jsHint and cleanup
	* Add release numbering
* GBX text parser
	* Add release numbering
	* Run through jsHint and cleanup
	* Refactor 'Text parser statistics' panel
* vwsrf-view-surface types.js
	* Run through jsHint and cleanup


#### 2018-11-21 ~ Theo

R9.8
* Edit Menu
	* All the following **beginning** to work / but still slow to open menu with large buildings
	* File Check
	* Missing gbXML Metadata
	* Adjacent Space Invalid
	* Duplicate Coordinates

#### 2018-11-19 ~ Theo

R9.8
* Continues effort to refactor menus so they are easier to understand
	* Reorganizing in traditional way: file, edit, view, help etc
	* But in vertical alignment so code works on computer and phone
* Add Edit menu
	* Start of process to carry over modules from previous releases
	* Four modules brought over but all mostly works-in-progress / not fully usable
* Add 'Save file as' capability


#### 2018-11-18 ~ Theo

R9.7
* Adds progressive update of display

This update is kind of a big thing. Seeing things appear is much more fun than staring at a blank screen - even when the progressive loading may slow things down a bit


#### 2018-11-17 ~ Theo

R9.6
* Add menu titles and rename menu items
* Add 'Save files as...'
	* File needs better tidying before save
* Add 'Scene cut sections'

vwsrf-view-surface-types.js
* File renamed
* Many fixes

cut-section-cut.js
* File added
* Update by toggling class
* Some issues fixed


#### 2018-11-15 ~ Theo

Home page
* Add onProgress function
Style.css
* Improve functionality on mobile devices
Settings and Pop-Up
* Add toggle openings button
gbx text parser
* Update edges
* Add openings

Done
* 2018-11-14 ~ display zone, storey and zone geometries on demand - not just surfaces geometry

#### 2018-11-14 ~ Theo

Pop-Up R9.4
* Update current status
* Zoom all displays Campus data


#### 2018-11-12 ~ Theo

Pop-Up R9.3
* Now displays spaces, storeys and zones and their attributes more correctly

'Evgeny'
* Levels now display the correct surfaces

#### 2018-11-11 ~ Theo

* Many improvements

#### 2018-11-10 ~ Theo
* Pop-up menu:
	* beginning to work
	* Appears to be reasonably fast enough
* gbx-text-parser:
	* Load refactor mostly complete and working quite well
	* Fix issue when getPlane runs our of points. Thanks to Evgeny fot the heads-up and demo file
* reports & 'Evgeny' workflow
	* Updated to work with parser

***

## Full Screen: [Spider gbXML Text Parser R8.1]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r8/spider-gbxml-text-parser.html )

#### 2018-11-09 ~ Theo

* gbx-text-parser: Three.js surfaces
	* Add Phong material if lights
	* Add cast and receive shadows
	* Add dispose of geometry on load new model
* Base file:
	* Refactor loading process



## Full Screen: [Spider gbXML Text Parser R8.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r8/spider-gbxml-text-parser.html )

## Full Screen: [Spider gbXML Text Parser R8.0 'Evgeny' ]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r8/spider-gbxml-text-parser-evgeny.html )

### 2018-11-07 ~ Theo

* Buttons working better
* Add indications to button states
* Loads large ZIP with either UTF-8 or UTF-16


### 2018-11-06 ~ Theo

* Loads Revit UTF-16 ZIP files up to just over a megabyte in size. Loads much larger UTF-8 ZIP files
* Reports menu shows only surface types in use with buttons of surface type colors
	* Note: many issues with the behavior and color of buttons

'Evgeny' edition
* A first pass at building a menu to support a workflow suggested by Evgeny in a private email

Fixed
* 2018-11-04 ~ Theo: if 'exposedToSun' not set for any surfaces then nothing displays on load


## Full Screen: [Spider gbXML Text Parser R7.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r7/spider-gbxml-text-parser.html )

### 2018-11-05 ~ Theo

* Adds ability to open and decompress XNL date from ZIP files
	* Current version only decodes UTF-8 files. UTF-16: TBD.
	* So does not yet directly read files exported by Revit
	* Currently only reads the first file it finds in the ZIP
	* Thank you JSzip
* Adds rudimentary display of surface type colors

Underway
* 2018-11-04 - Michal: Add ability to read gbXML from .zip files


## Full Screen: [Spider gbXML Text Parser R6.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r6/spider-gbxml-text-parser.html )

### 2018-11-04 ~ Theo

* Adds 'Statistics detail view
	* Shows number of spaces, storey, surfaces, zones and vertices
* Add 'Reports' detail view
	* View model by clicking surface type
	* View model by clicking 'exposedToSun', 'horizontal' and 'vertical'


## Full Screen: [Spider gbXML Text Parser R5.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r5/spider-gbxml-text-parser.html )

### 2018-11-03 ~ Theo

* Draw polygonal surfaces with any number of vertices
* Displays some statistics
* Adds load file from disk
* Adds load sample files

Largest model loaded so far
* bytes loaded: 698,701,430
* time to load: 9,119 ms
* time to parse: 8,244 ms
* spaces: 5,550
* surfaces: 70,774
* coordinates: 1,342,749
* On fast machine loads in under a minute. Reloads under 45 seconds

Notes
* Reload faster than first load
* Model not fully loaded until model centers on screen
* Surface types displayed: Roof, ExteriorWall, ExposedFloor, Air & Shade

## Full Screen: [Spider gbXML Text Parser R4.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r4/spider-gbxml-text-parser.html )

### 2018-11-02 ~ Theo
* Creates and displays meshes in Three.js
* Only handles triangles and quads

## Full Screen: [Spider gbXML Text Parser R3.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r3/spider-gbxml-text-parser.html )

* Name change
* Adds standalone JavaScript file

## Full Screen: [Spider gbXML Hacker R2.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r2/spider-gbxml-hacker.html )

### 2018-11-02 ~ Theo
text-parser R2.0

Wow!

Reading 1,342,749 coordinates in the 666 MB file in 6 seconds. Sickx!


## Full Screen: [Spider gbXML Hacker R1.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r1/spider-gbxml-hacker.html )

With Chrome browser on Windows 10/Core i7/Nvidia GPU  reads the file and displays limited text data for the file in under 15 seconds. No attempts are made to display data in 3D.

Does almost nothing. You must use 'Choose File' and developer console to see anything.

* Opens file
* Splits data into an array of trimmed lines
* Searches the array for selected text data such as 'space', 'surface' and 'zone'


## To Do / Wish List

* 2018-11-08 ~ Theo ~ faster redraws when pushing visibility buttons


## Issues

* 2018-11-08 ~ Theo ~ Some shades also showing as roof / and other places when surfaces not showing up as expectd
* File not loading: annapolis-md-single-family-residential-2016.xml

## Things you can do using this script

* Click the three bars( 'hamburger menu icon' ) to slide the menu in and out
* Click the Octocat icon to view or edit the source code on GitHub
* Click on title to reload
* Press Control-U/Command-Option-U to view the source code
* Press Control-Shift-J/Command-Option-J to see if the JavaScript console reports any errors


## Links of Interest



## Change Log


### 2018-11-15 ~ Theo

Se previou day comments. Converting text files over 3 MB compressed crashes the browser while the conversion to xml is taking place.

### 2018-11-14 ~ Theo

I'm finding that converting text to xml is fast. May be good to do a conversion on load and just use xml all the time instead of parsing xml frm text on demand. Will need to test.


### 2018-11-01 ~ Theo

I've just been working on a file similar to the 'text-parser' file included here. What I am discovering is that it is much faster to load a file as a text file then it is to load it as an XML file and then convert it to JSON

I've been experimenting with the Warwick University file. This file is just over 20 megabytes in size. Even with this size, it takes the browser less than a couple of seconds to load the data as a text file.

Once loaded and when using the browser built-in XML parser and the xml2obj routine that we have been using, it takes about 8 seconds to do the parsing of the entire file.

On the other hand, reading the text and converting it into an array of lines and then doing some simple parsing, takes only a couple of seconds. Therefore, even if the more complicated parsing takes double the time, overall processing would still be half the time of using the XML parser system.

Using the simple array parsing method would provide a significant secondary benefit. Under the current system, the script must wait until all the XML/JSON parsing is completed before display of the 3D surfaces commences. but if we treat the file as an array, we could start displaying the 3D surfaces almost immediately once the file is loaded. This would create a much more pleasant user experience. Instead of viewing a blank screen for a number of seconds, you would see each surfaces display as soon as it read.

If this process could be made to work, it might represent a huge leap forward with the development of gbXML viewers.

It will take a number of revisions of scripts in order to see if this process does work as currently imagined. Development will continue, but only as a secondary effort in parallel with the main development work of the primary current Spider gbXML Viewer.



### 2018-10-27 ~ Theo

* First commit


***

### <center title="Howdy! My web is better than yours. ;-)" ><a href=javascript:window.scrollTo(0,0); style="text-decoration:none !important;" > &#x1f578; </a></center>

