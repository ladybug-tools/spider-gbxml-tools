# Dev notes


## 2019-07-23 ~ Theo

Mostly dealt with

* Openings visible as holes in surfaces
* Better integration between left and right menus
* Updates to modules folders and file names
* Left menu: single on gbXML load event listener to close all details element in menu



## 2019-07-08 ~ Theo

SGV V 0.16.01-14

Dealt with

* 2019-06-21 ~ Theo ~ Menu header data in menu.js
* 2019-02-25 ~ Pop-up not showing when screen is touched with finger
* 2019-06-21 ~ Theo ~ Add core JavaScript file with version, date etc
* 2019-06-21 ~ Theo ~ Add construction etc data to left menu - with data showing in popup menu
* 2019-06-21 ~ Theo ~ Update GGD so it works in either left menu, popup or main areas

### 2019-06-21 ~ Theo

SGV V 0.16.01-2

Dealt with
* 2019-04-15 ~ Theo ~ Toggle edges
* 2019-04-15 ~ Theo ~ Add space/storey attributes to pop-up
* 2019-04-15 ~ Theo ~ Add gbxml/openings/construction data to pop-up

### 2019-06-06 ~ Theo

SGV R15.3.4

* F - VBS.js: Add select by text input
* F - VBS.js: Add Show/hide all spaces


### 2019-06-05 ~ Theo

* F - VST.js: Add show/hide all surfaces toggle
* R - VBSU.js: Creating and selecting options
* F - VBSU.js: Select and display multiple surface
* F - VBSU.js: Highlight selected surface immediately on input
* B - VBSU.js: unhighlight select if no valid.option
* F - VBSU.js: Add show/hide elected surfaces
* F - VBSP.js: Add select by text input
* F - VBSP.js: Add Show/hide all spaces

### 2019-04-16 ~ Theo

Spider gbXML Viewer 'Maevia' R15.1.1

* F ~ Add shift camera target to currently selected surface

### 2019-04-15 ~ Theo

Spider gbXML Viewer 'Maevia' R15.1.0

* F ~ Add 'Show/hide by space' to View menu
* B - Prevent right click from updating pop-up. Stop model scrolling when clicking in select boxes.
* D - Update to semver numbering. Add link to Atrax in Edit menu


### 2019-03-14 ~ Copied from Pop-up

* 2019-03-12 ~ R15.31 ~ ISAOIOEW & ISAOIOEF> Move more functions to ISRC. Select list box now handles multi-select. Add button to show/hide selected.
* 2019-03-11 ~ R15.30 ~ ISAOIOEW & ISAOIOEF> big updates. See Pop-up help
* 2019-03-08 ~ R15.29 ~ IAIO > Add interiorWall on exterior
* 2019-03-05 ~ R15.28 ~ POP > add primitive construction data readout - appears when construction data is available
* 2019-03-03 ~ R15.27 ~ ISSOH > beginning to find horizontal overlaps nicely
* 2019-03-03 ~ R15.26 ~ ISSOV > beginning to find vertical overlaps nicely
* 2019-02-28 ~ R15.25 ~ CUT > Improve behavior: View menu > Scene cut sections. FIL > close menus on open
* 2019-02-28 ~ R15.24 Local ~ First commit. For downloading and running local files
* 2019-02-26 ~ R15.23 ~ FIL > Add 'reload file' button and code
* 2019-02-26 ~ R15.22 ~ ISDUC/ISASD: Allow for no planar geometry
* 2019-02-26 ~ R15.21 ~ POP/VBS > Add check for no storey name
* 2019-02-25 ~ R15.20 ~ Set several menu items default to closed.
* 2019-02-24 ~ R15.20 ~ Update FIL file-open links
* 2019-02-22 ~ R15.19 ~ Minor fixes several modules. POP & ISCOR: pass through jsHint and makes fixes
* 2019-02-15 ~ Updates to Air Surface Type Editor
* 2019-02-14 ~ Add beginning of check if Air surface types are on exterior of a model
* 2019-02-13 ~ Add own theme local storage var. Update main popup text. Many updates to 'Air Surface Type Editor'
* 2019-02-12 ~ R15.3 ~ Add 'Air Surface Type on Exterior' issues module
* 2019-02-11 ~ R15.12 > View menu > Show/hide by storey: Better types/storeys integration on show all storeys
* 2019-02-11 ~ R15.11 > View menu > Show/hide by surface type: Code cleanup. Drop 'reset surfaces' button/code as being redundant
* 2019-02-11 ~ R15.10 > Edit menu > Issues Template: Bring up to same level as TooToo TMP
* 2019-02-11 ~ R15.9 > Edit menu >CAD Object ID Missing: Add checkbox to ignore surfaces of type 'Air'. Set default to ignore
* 2019-02-08 ~ R15.8 ~ add (not very smart) show all storeys button
* 2019-02-08 ~ R15.7 ~ better storey/type interaction
* 2019-02-07 ~ R15.6 ~ refactor styles
* 2019-01-31 ~ Fix settings - zoom all
* 2019-01-19 ~ New release R15 based on TooToo13
* 2019-01-17 ~ Add many TooToo fixes
* 2019-01-13 ~ Links to nearly 100% standard TooToo
* 2019-01-11 ~ Fixes crash when PlanarGeometry includes attributes
* 2019-01-09 ~ Index/html now based on TooToo R13 - beginning to look OK
* 2019-01-09 ~ Rolling out Spider gbXML Viewer Plus R12
* 2019-01-09 ~ Rolling out TooToo content management


### 2019-02-13 ~ Theo

Spider gbXML Viewer 'Maevia' R15

* Currently changes are being added to the popup window available when you run main HTML file


### 2019-01-31 ~ Theo

Spider gbXML Viewer 'Maevia' R15.3

* Reversed the normal of second triangle in quads
* Added Rood to horizontal surfaces

R15.2
* Fixes for Evgeny

### 2019-01-25 ~ Theo

Spider gbXML Viewer 'Maevia' R15.1

* Add Edit and View menus


### 2019-01-19 ~ Theo

* Commit Spider gbXML Viewer 'Maevia' R15


### 2018-12-20 ~ Theo

Spider gbXML text parser R10.8
* see [cookbook/spider-gbxml-issues Read Me]( https://www.ladybug.tools/spider-gbxml-tools//spider-gbxml-viewer/r10/cookbook/spider-gbxml-issues/README.md )

### 2018-12-13 ~ Theo

SGTP R10.5
* See cookbook/spider-gbxml-file-open
* gbx-text-parser.js split in two
	* gbx-gbxml-text-parser.js
	* gbxu-gbxml-utilit spider-gbxml-viewer.html
	* Menu simplified: open xml and open zip combined into singe UI

### 2018-12-10 ~ Theo

SGTP R10.3
* See [cookbook/template]( https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/r10/cookbook/template )
* See [cookbook/spider-gbxml-gallery-sample-files]( https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/r10/cookbook/spider-gbxml-gallery-sample-files )


### 2018-12-10 ~ Theo

SGTP R10.2
* See cookbook/issues

### 2018-12-09 ~ Theo

SGTP R10.1
* Many updates
* Start of organizing files so modules have dev folders

### 2018-12-06 ~ Theo

SGTP  spider-gbxml-viewer.html
	* Update link to Three.js R99 - all seems OK
* isasi-issues-adjacent-space-invalid.js
	* Adds ability to run in 'check all issues'. Add depracation notice
* iscod-issues-cad-object-id.js
	* Pass through jsHint
	* Adds ability to run in 'check all issues'
	* Adds ability to select new CAD object type from list of buttons.
* iscor-issues-core.js
	* 'check all issues' actualy works
* isduc-issues-duplicate-coordinates.js
	* New module
* ismet-issues-metadata.js
	* Adds ability to run in 'check all issues'
* issti-issues-surface-type-invalid.js
	* Adds ability to run in 'check all issues'
* istmp-issues-template.js
	* Adds ability to run in 'check all issues'. Simplified code a bit. Passed through jsHint


### 2018-12-05 ~ Theo

SGTP R9.15
* istmp-issues-template.js
	*  ~ Add more template functions
* issti-issues-surface-type-invalid.js
	*  Adds ability to select new surface type from list of buttons.
* iscod-issues-cad-object-id.js
	* New module - nearly ready for testing

The new way of building issues module is shorter and simpler than before and should make creating new modules faster and and easier.

### 2018-12-02 ~ Theo

SGTP R9.13
* Refactor Edit menu code
	* Remove: Menu on toggle run of all checks
	* Add: button to run all checks at once
	* Many files have minor upda spider-gbxml-viewer.html
		* isfic-issues-file-check.js
		* ismet-issues-metadata.js
		* issti-issues-surface-type-invalid.js
		* isduc-issues-duplicate-coordinates.js
		* isasi-issues-adjacent-space-invalid.js
* Add istmp-issues-template.js
* Only run Edit menu issues checks when menus toggle open / do not run on toggle close

### 2018-12-01 ~ Theo

SGTP R9.13
* Rename several issues files an spider-gbxml-viewer.html
* isduc-issues-duplicate-coordinates.js
	* Add toggle active to show/hide button
* isduc-issues-duplicate-coordinates.js
	* New module - mostly there but needs editing functionality


### 2018-11-30 ~ Theo

R9:12
* fil-open-file.js
	* Add full-featured open file DIV
	* Supports drag and drop
	* Supports inter-session default file
	* Add current status details DIV
* isdc-issues-duplicate-coordinates.js
	* Add display ids of duplicate surfaces as options in a select element
	* Select an option to set focus to selected surface and update pop-up dialog
	* Add 'delete selected surface' button


### 2018-11-29 ~ Theo

R9.11
* ismet-issues-metadata.js
	* update button: 'Add changes to data in memory'
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

## Full Screen: [Spider gbXML Viewer 'Maevia' R15 R8.1]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-v/spider-gbxml-viewer.html )

#### 2018-11-09 ~ Theo

* gbx-text-parser: Three.js surfaces
	* Add Phong material if lights
	* Add cast and receive shadows
	* Add dispose of geometry on load new model
* Base file:
	* Refactor loading process



## Full Screen: [Spider gbXML Viewer 'Maevia' R15 R8.0]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-v/spider-gbxml-viewer.html )

## Full Screen: [Spider gbXML Viewer 'Maevia' R15 R8.0 'Evgeny' ]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-v/spider-gbxml-viewer-evgeny.html )

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


## Full Screen: [Spider gbXML Viewer 'Maevia' R15 R7.0]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-v/spider-gbxml-viewer.html )

### 2018-11-05 ~ Theo

* Adds ability to open and decompress XNL date from ZIP files
	* Current version only decodes UTF-8 files. UTF-16: TBD.
	* So does not yet directly read files exported by Revit
	* Currently only reads the first file it finds in the ZIP
	* Thank you JSzip
* Adds rudimentary display of surface type colors

Underway
* 2018-11-04 - Michal: Add ability to read gbXML from .zip files


## Full Screen: [Spider gbXML Viewer 'Maevia' R15 R6.0]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-v/spider-gbxml-viewer.html )

### 2018-11-04 ~ Theo

* Adds 'Statistics detail view
	* Shows number of spaces, storey, surfaces, zones and vertices
* Add 'Reports' detail view
	* View model by clicking surface type
	* View model by clicking 'exposedToSun', 'horizontal' and 'vertical'


## Full Screen: [Spider gbXML Viewer 'Maevia' R15 R5.0]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-v/spider-gbxml-viewer.html )

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

## Full Screen: [Spider gbXML Viewer 'Maevia' R15 R4.0]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-v/spider-gbxml-viewer.html )

### 2018-11-02 ~ Theo
* Creates and displays meshes in Three.js
* Only handles triangles and quads

## Full Screen: [Spider gbXML Viewer 'Maevia' R15 R3.0]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-v/spider-gbxml-viewer.html )

* Name change
* Adds standalone JavaScript file

## Full Screen: [Spider gbXML Hacker R2.0]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/r2/spider-gbxml-hacker.html )

### 2018-11-02 ~ Theo
text-parser R2.0

Wow!

Reading 1,342,749 coordinates in the 666 MB file in 6 seconds. Sickx!


## Full Screen: [Spider gbXML Hacker R1.0]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/r1/spider-gbxml-hacker.html )

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

### 2018-11-15 ~ Theo

See previous day comments. Converting text files over 3 MB compressed crashes the browser while the conversion to xml is taking place.

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