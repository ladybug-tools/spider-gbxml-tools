
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-tester/README.md "View file as a web page." ) </span>

<div><input type=button class = "btn btn-secondary btn-sm" onclick=window.location.href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-tester/README.md"
value="You are now in a GitHub web page view - Click this button to view this read me file as source code" ></div>

<br>

# [Spider gbXML Tester Read Me]( #sandbox/spider-gbxml-tester/README.md )

<!--
<iframe src=https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-tester/sandbox/spider-gbxml-tester.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Tester</small>_
-->

## Bookmark this link: [Spider gbXML Tester]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-tester/ )

## [Sample test run]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-tester/r1/spider-gbxml-tester.html#https://rawgit.com/ladybug-tools/spider/master/gbxml-sample-files/bristol-clifton-downs-broken.xml )


## Concept

Many of the issues to be found in parsing gbXML files are clerical matters that can found using simple text search routines - full 3D viewing is not needed and may actually slow things down. In future revisions new utilities will add replace capability so that issues can be fixed and saved.


* Run basic checks on gbXML files and identify & report errors
* The script is still at an early stage. Many more checks can be added.


## To Do / Wish List

* 2019-03-12 ~ Add as many tests currently in Spider gbXML Viewer as possible that do not require 3D
* 2019-03-12 ~ Add fixing the issues where possible
* 2019-03-12 ~ Add check for opening vertices greater then four
* 2019-03-12 ~ Add check for openings larger or outside their parent surface

## Issues

* 2019-03-12 ~ In some workflows an Air surface type with duplicate adjacent spaces acceptable. You should be able to adjust the settings so an error is not issued.


## Things you can do using this script

Using the Script
* Click the three bars( 'hamburger menu icon' ) to slide the menu in and out
* Click the Octocat icon to view or edit the source code on GitHub
* Click on title to reload
* Press Control-U/Command-Option-U to view the source code
* Press Control-Shift-J/Command-Option-J to see if the JavaScript console reports any errors

Enhancing the Script

* Try adding a new menu module
* Translate into another language

## Links of Interest



## Change Log


### 2019-03-15 ~ Theo

spider-gbxml-tester.js

R1.3
* Add details and function to add add the details to divContents
* Code cleanup
* Run through jsHint

It's a lot easier to build tests here than in the 3D viewer.

* There is no need to fit into an existing UI
* There is no need to make the changes visible in the 3D model

The current effort points to a change of direction regarding the way the Viewer is developed. The viewer is currently a viewer and a fixer/editor. The way things seem to be going is that the tester should become the fixer for all testing that does not require 3D and 3D features such as ray-casting. And it currently feels like this is a doable proposition. Almost all fixes should be available with a single click. Occasionally there might be fixes where you have to choose from a list of items.

For example, let us say that you typed in an invalid surface type in your CAD program. We can let you select a valid surface type from the list of fifteen valid types. But then, we could see that your surface has a tilt of 90 degrees and it has an opening that is raised off the bottom of the surface and we can see that exposedToSun is set to true. Therefore we can pre-select 'ExteriorWall' and you can fix the error with a single click.

With some hard-thinking all of the text-based errors should be fixable in the fixer. This may mean that the viewer may more easily become a better viewer with more features being added more quickly.

Another benefit is that it will be easier to run a text-based fixer script with Node.js on a server and verify many files in a batch run


### 2019-03-12 ~ Theo

R1.2
* Looking good
* Most future change log updates will be available from the pop-up menu


### 2019-02-26 ~ Theo

* First commit


***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > <img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height=24 > </a></center>

