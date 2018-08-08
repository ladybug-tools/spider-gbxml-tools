# gbXML to OpenStudio Report

The goal of the scripts in this project is to enable you to transfer data from a CAD progran to an analysis program with as few steps of human intervention as possible.

This document is intended to a be a summary of lessens learned, test results and any issues of interest that occur in the pursuance of the above goal.

Sections of new text will will be posted to GitHub Issues under a 'lessons-learned' tag. These issues will be cclosed as and when a newer issue is posted. And actions or further investigations arsing from these reports should be opened as new issues


## 2018-08-08 ~ Theo

Out of a number of attempts on various files, the first gbXML file to be imported into OpenStudio and successful complete 'Run Simulation is:

https://github.com/GreenBuildingXML/Sample-gbXML-Files/blob/master/gbXML_TRK.xml

### Notes on the successful run

* After being downloaded Windows10 or Chrome converted the file to UTF-8. This was noticeable because the files size was much reduced. 'Aragog' gbXML Viewer R14 failed to load the file. Work-around delete the text ```encoding="UTF-16"``` from the first line of the gbXML file
* The gbXML_TRK.xml files was imported using OpenStudio > File menu > Import gbXML
* EPW and DDY files for SFO were imported into OpenStudio 'Schedules' tab
* OpenStudio reports 'Unable to launch Dview' with a message 'Not found in expected location'.

### Notes on failed runs
* The usual first reported error is: ```** Severe  ** <root>[BuildingSurface:Detailed][B-00_110-E-F-58] - Missing required property 'construction_name'.```
* The examples file 'seb.osm' was loaded and completed a successful 'Run simulation. A gbXML files was created using OpenStudio > File menu > Export gbXML. The newly created file was then imported using OpenStudio > File menu > Import gbXML.Th file loaded successfully and was viewable in the OpenStudio Geometry tab. The file did not, however, complete a successful 'Run simulation.. The first error being: ```   ** Severe  ** <root>[Construction][3'0" x 3'0" Double pane  Alum Construction] - Missing required property 'outside_layer'.```
* Attens were made to load a default OSM library and then merge in the gbXML file, but none of these attempts provided a successful run on files that had previously failed to be imported on their own

### Related Activity

* 'Aragog' gbXML Viewer R14.14 > Reports tab: now has a card for gbXML 'Construction' elements
* There wil be investigations as to whether the various viewers should ad the feature of adding Construction elements to gbXL file upon request



***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > &#x1f578; </a></center>


