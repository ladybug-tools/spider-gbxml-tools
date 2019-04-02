
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

Many of the issues to be found in parsing gbXML files are clerical matters that may be identified using simple text search routines. Full 3D viewing of these types of errors is not needed and may actually slow things down.

* Run basic checks on gbXML files and identify, report and fix any errors
* The script is still at an early stage. Many more checks may be added.


## To Do / Wish List

* 2019-03-12 ~ Add as many tests currently in Spider gbXML Viewer as possible that do not require 3D
* 2019-03-12 ~ Add fixing the issues where possible
* 2019-03-12 ~ Add check for opening vertices greater then four
* 2019-03-12 ~ Add check for openings larger or outside their parent surface

## Issues

* 2019-03-12 ~ In some workflows an Air surface type with duplicate adjacent spaces is acceptable. You should be able to adjust the settings so an error is not issued.


## Things you can do using this script

Using the Script
* Click 'Choose file' and load a gbXML files or a ZIP file containing a gbXML file
* Drag and dtop a gbXML or ZIP file to the area inside the dotted lines in the left menu
* Click 'Open gbXML sample files' to access the Spider gbXML sample files
* Click the three bars( 'hamburger menu icon' ) to slide the menu in and out
* Click the Octocat icon to view or edit the source code on GitHub
* Click on title in the menu to reload the web page
* Press Control-U/Command-Option-U to view the source code
* Press Control-Shift-J/Command-Option-J to see if the JavaScript console reports any errors

Enhancing the Script

* Try adding a new menu module
* Translate into another language

## Links of Interest

### _Atrax robustus_

* https://en.wikipedia.org/wiki/Sydney_funnel-web_spider

> The Sydney funnel-web spider (Atrax robustus) is a species of venomous mygalomorph spider native to eastern Australia, usually found within a 100 km (62 mi) radius of Sydney. It is a member of a group of spiders known as Australian funnel-web spiders. Its bite is capable of causing serious illness or death in humans if left untreated.

## Change Log

### Commit message prefixes

From [The case for single character git commit message prefixes]( https://smalldata.tech/blog/2018/10/04/the-case-for-single-character-git-commit-message-prefixes )

* B, indicates a bugfix.
* F, indicates a feature or a change - this will most likely be the majority of the commits.
* a, code formatting change.
* c, comments and or documentation.
* D, dependency updates.
* R, code refactoring, note that this is different from r below.
* r, proven code refactoring - this is the original meaning of the mathematical term refactoring, where it can be mathematically proven that the code change does not change any functionality.
* T, test cases and/or test improvements
* !, unknown - i.e. for when you really need to make that commit because there's a horde of zombies waiting outside.


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

