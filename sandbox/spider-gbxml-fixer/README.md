
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-fixer/README.md "View file as a web page." ) </span>

<div><input type=button class = "btn btn-secondary btn-sm" onclick=window.location.href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/README.md"
value="You are now in a GitHub web page view - Click this button to view this read me file as source code" ></div>

<br>

# [Spider gbXML Fixer 'Atrax' Read Me]( #sandbox/spider-gbxml-fixer/README.md )

<!--
<iframe src=https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-fixer/sandbox/spider-gbxml-fixer.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Fixer</small>_
-->

## Bookmark this link: https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-fixer/

* Links to the latest most current revision

## [Sample test run]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-fixer/r1/spider-gbxml-fixer.html#https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/bristol-clifton-downs-broken.xml )

* Loads and checks a sample file from the Spider gbXML sample files folder


## Concept / the problem to be solved

The good people who create CAD and energy analysis applications are primarily software programmers. They have infrequent access to large numbers of actual building test cases nor can they simulate large varieties of practice-specific energy simulation workflows. The current frequently-repeated outcome is that building engineering practices devote much time to dealing with issues in transferring data back and forth between CAD applications and energy analysis programs - and thus losing time for creating better simulations

Many of the issues to be found in parsing gbXML files are clerical matters that may be identified using simple text search routines. Full 3D viewing of these types of errors is not needed and may actually slow things down.


### Mission for Spider gbXML Fixer

* Run basic text-based checks on gbXML files and uncover, identify, report and fix any errors or issues
* Help you access scripts that work well in your practice, your workflow and your skill set so that

### Vision

* All errors are fixed and changes saved with the click of a single button or just running the script of a server

### Notes

* Not all issues in gbXML files are simple, text-based issues. Some issues will require full a 3D visualization in order to be discovered and fixed. An intention is to make the workflow between a text-based fixer and full 3D fixer as seamless as possible.
* If you identify a frequently occurring error in ggXML files and supply sample files that exhibit the error, The Spider team will build a module that identifies and fixes the issue
* The script is still at an early stage. Many more checks may be added.


## To Do / Wish List

* 2019-03-12 ~ Add as many tests currently in Spider gbXML Viewer as possible that do not require 3D
* 2019-03-12 ~ Add more and better fixing the issues where possible
* 2019-03-12 ~ Add check for opening vertices greater then four
* 2019-03-12 ~ Add check for openings larger or outside their parent surface


## Issues

* 2019-04-02 ~ Toggling the display of a module and clicking the 'Run check again' perform thhe identical action. Would be nice to decide which is preferable
* Once a change is effected, some modules re-run the check automatically and others do not. Would be nice to decide which behavior is preferable


## Usage / things you can do using this script

Opening files and saving changes
* Click 'Choose file' and load a gbXML files or a ZIP file containing a gbXML file
* Drag & drop a gbXML or ZIP file to the area inside the dotted lines in the left menu
* Click 'Open gbXML sample files' to access the Spider gbXML sample files
	* Then click any of the buttons to a obtain a list of files you can open
* Click on the 'Save file' to save any changes you have made to a new file
	* You may save the changes either to an XML file or and XML file compressed into a ZIP file

Checking and fixing errors
* Once a file is opened a menu appears in the main content area that allows yo to identify and fix any issues found in the file
* Clicking any of the titles displays the text and runs the checking routines
	* Click 'Run all checks' to open all the modules' text and run all the checks. This may take quite a while on large files
* There are a numbers of types of errors to be check and needs its own style of user interface
	* Streamlining amd homogenizing the workflows of the modules is a work-in-progress. Please do report issues and insights
* In some workflows an Air surface type with duplicate adjacent spaces is acceptable. You may adjust the settings so an error is not issued.

Menu system
* Click on any of the '?' links to see a pop-up menu at top right with
	* Short description of the module
	* Link to source code for the module
	* Wish list / to do items
	* Issues list
	* Change log
* Click the three bars( 'hamburger menu icon' ) to slide the menu in and out
* Click the Octocat icon to view or edit the source code on GitHub
* Click on title in the menu to reload the web page
* Click on 'Select Them and choose a [Bootswatch]( https://bootswatch.com/ ) theme such as 'United'
* Click on 'Footer / Help' to see the links to many support files

Debugging
* Press Control-U/Command-Option-U to view the source code
* Press Control-Shift-J/Command-Option-J to see if the JavaScript console reports any errors

Enhancing the script
* Try adding a new menu module
* Translate into another language



## Links of Interest

### _Atrax robustus_

* https://en.wikipedia.org/wiki/Sydney_funnel-web_spider

> The Sydney funnel-web spider (Atrax robustus) is a species of venomous mygalomorph spider native to eastern Australia, usually found within a 100 km (62 mi) radius of Sydney. It is a member of a group of spiders known as Australian funnel-web spiders. Its bite is capable of causing serious illness or death in humans if left untreated.

## Change Log

### Commit message prefixes

From [The case for single character git commit message prefixes]( https://smalldata.tech/blog/2018/10/04/the-case-for-single-character-git-commit-message-prefixes ):

* B, indicates a bugfix.
* F, indicates a feature or a change - this will most likely be the majority of the commits.
* a, code formatting change.
* c, comments and or documentation.
* D, dependency updates.
* R, code refactoring, note that this is different from r below.
* r, proven code refactoring - this is the original meaning of the mathematical term refactoring, where it can be mathematically proven that the code change does not change any functionality.
* T, test cases and/or test improvements
* !, unknown - i.e. for when you really need to make that commit because there's a horde of zombies waiting outside.


### 2019-04-02 ~ Theo

Spider gbXML Fixer 'Atrax' R1.7
* B - Validate HTML with  https://validator.w3.org/nu / Fix all errors reported
* D - Update this read me a lot

_See also changes listed in individual JavaScript files_

### 2019-03-25 ~ Theo

Spider gbXML Fixer 'Atrax' R1.6

_See changes in individual JavaScript files_

 * Many / See pop-up help for individual checks
 * Runs just about every sample file without errors

### 2019-03-25 ~ Theo

Spider gbXML Fixer 'Atrax' R1.5

_Changes in JavaScript files_

 * Many / See pop-ups

### 2019-03-25 ~ Theo

Spider gbXML Fixer 'Atrax' R1.4

* C ~ Add 'Atrax' to menu title / Update rev and date / Update readme ~ add Commit message prefixes

_Changes in JavaScript files_
* Many / See pop-ups



### 2019-03-23 ~ Theo

Spider gbXML Fixer 'Atrax' R1.3

* Add code name: 'Atrax'


### 2019-03-22 ~ Theo

spider-gbxml-fixer.html/.js R1.2
* Almost complete rewrite
* Fast
* Uses HTML template element - my first use of

### 2019-03-19 ~ Theo

spider-gbxml-fixer.html/.js R1.0

* First commit


***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > <img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height=24 > </a></center>

