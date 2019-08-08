<style>

main summary, h2 { margin: 0; padding: 0; }

main h2 { display: inline; }

</style>

# Spider gbXML Viewer compliance with _ISO 245010 ~ System and software quality models_

<details open>

<summary><h2>Overview of this effort</h2></summary>


The owners of a typical commercial software product sold on the open market frequently pay an  an advertising agency to create a web site for the product. The web site is usually designed to broadcast the features and benefits of the product and omit any aspects about the products being sold that are not positive. Many open source projects follow similar routes.

Are there other paths to gain your recognition and adoption in your organization? This document is the initial exploration of other possibilities for creating an "Appropriateness recognizability" to help you ascertain whether our projects are suitable or not suitable for your organization.

This Spider team side project is an intention to document Spider gbXML Viewer compliance with [_ISO 245010 System and software quality models_]( https://iso25000.com/index.php/en/iso-25000-standards/iso-25010 ) produced by the [International Organization for Standardization]( https://www.iso.org/home.html ).

Paraphrasing the ISO 9126 terminology, our mission here may be stated as:

By clarifying project priorities and converting abstract priorities to measurable values this document develops a common and shareable understanding of the objectives and capabilities of the Spider gbXML Viewer project.


</details>


<details>

<summary><h2>Prefaces to the ISO documents</h2></summary>

[Wikipedia introduction previous version, ISO 9126]( https://en.wikipedia.org/wiki/ISO/IEC_9126): _The fundamental objective of the ISO/IEC 9126 standard is to address some of the well known human biases that can adversely affect the delivery and perception of a software development project. These biases include changing priorities after the start of a project or not having any clear definitions of "success". By clarifying, then agreeing on the project priorities and subsequently converting abstract priorities (compliance) to measurable values (output data can be validated against schema X with zero intervention), ISO/IEC 9126 tries to develop a common understanding of the project's objectives and goals._

[iso25000.com introduction to current version, ISO/IEC 25010]( https://iso25000.com/index.php/en/iso-25000-standards/iso-25010 ): _The quality model is the cornerstone of a product quality evaluation system. The quality model determines which quality characteristics will be taken into account when evaluating the properties of a software product._

_The quality of a system is the degree to which the system satisfies the stated and implied needs of its various stakeholders, and thus provides value. Those stakeholders' needs (functionality, performance, security, maintainability, etc.) are precisely what is represented in the quality model, which categorizes the product quality into characteristics and sub-characteristics._

_The product quality model defined in ISO/IEC 25010 comprises eight quality characteristics_

The the source for the following text is from [iso25000.com](  https://iso25000.com/index.php/en/iso-25000-standards/iso-25010 ). And that hext appears to be a redaction from [iso.org]( https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:ed-1:v1:en )

</details>


<details>

<summary><h2>Usage notes</h2></summary>

In the following sections, the titles and text in _italics_ are quotes from the text on the ISO 25010 web page. These cover the eight the primary characteristics and associated sub-characteristics of the standard. Text not in italics begins to describe Spider compliance with the standard. The name 'Maevia' is used to indicate 'Spider gbXML Viewer Maevia v0.17.01'.

Kindly note that the following is a first, small step. Actual compliance certification would require much more documentation.

</details>


<details>

<summary><h2>1. Functional suitability</h2></summary>

_The degree to which a product or system provides functions that meet stated and implied needs when used under specified conditions._


### Functional completeness

_Degree to which the set of functions covers all the specified tasks and user objectives._

File handling

* Maevia reads, parses and displays all the [Spider Sample Files]( https://www.ladybug.tools/spider/#gbxml-sample-files/ ) test files at without issue

gbXML item viewing

* The official [gbXML schema v6.01]( http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html ) provides a specification for 346 elements and 122 simple types.
* Important or frequently used elements include: surfaces, spaces, stories, zones, constructions, materials - all of these are readily locatable and viewable using Maevia.
* Maevia supplies 15 modules for filtering and selecting gbXML elements
* A future revision could document any items not covered or viewable in Maevia

Issue Fixers

* Maevia supplies 17 modules of checking or fixing errors in gbXML files

These will be documented in a future release of this document


### Functional correctness

_Degree to which a product or system provides the correct results with the needed degree of precision._

gbXML item viewing

* Providing correct results is a primary mission of Maevia
* Every item in Maevia is viewable as raw GB XML, 'prettified' text and in 3D
* The results of any one format may be verified by comparing with the contents of the other two formats

### Functional appropriateness

_Degree to which the functions facilitate the accomplishment of specified tasks and objectives_


File handling

* Handles numerous file errors and idiosyncrasies ( To be listed )
* Handles very large gbXML files in a speedy, no-fail, fashion
* Loads, extracts and saves 8-bit and 16-bit gbXML files to and from XML files and ZIP files
* Supports files that are local or on a server with one button press file reloading


Identifying content and viewing issues

* Displays virtually every aspect of numerical and attribute data in the gbXML file
* Supplies a variety of 3D visualization aids including exploding, cut sections, wireframe and more
	* These will be documented in future versions of this this document

Identifying and fixing issues

* Maevia begins to provide tools to fix many issues found in the gbXML files

These will be documented in future versions of this this document

</details>



<details>

<summary><h2>2. Performance efficiency</h2></summary>

_This characteristic represents the performance relative to the amount of resources used under stated conditions._

### Time behavior

_Degree to which the response and processing times and throughput rates of a product or system, when performing its functions, meet requirements._

* Most files - even large files hosted on remote servers - load in a second or two


### Resource utilization

_Degree to which the amounts and types of resources used by a product or system, when performing its functions, meet requirements._

* Maevia runs, opens and displays files on an Amazon Kindle Fire HD8 with just 1.5 GB of RAM


### Capacity

_Degree to which the maximum limits of a product or system parameter meet requirements._

* The largest file being currently tested with Maevia is 698 megabytes. This file loads on a Win10 Core I7 with Nvidia GPU machine in about a minute.



***


</details>
<details>
<summary><h2>3. Compatibility</h2></summary>

_Degree to which a product, system or component can exchange information with other products, systems or components, and/or perform its required functions, while sharing the same hardware or software environment._


### Co-existence

_Degree to which a product can perform its required functions efficiently while sharing a common environment and resources with other products, without detrimental impact on any other product._

* All typical files tested on Maevia run at 60 frames per second in a browser with multiple tabs open

### Interoperability.

_Degree to which two or more systems, products or components can exchange information and use the information that has been exchanged._

* Maevia is currently running in production environments with a variety of CAD applications and energy analysis programs including Revit, Open Studio, TAS Engineering and others


</details>


<details>

<summary><h2>4. Usability</h2></summary>

_Degree to which a product or system can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use_

### Appropriateness recognizability

_Degree to which users can recognize whether a product or system is appropriate for their needs._

* Running as a web app in the browser, means that Maevia's capabilities may be investigated, tested and analyzed in a very speedy fashion
* Product details, user activity may be verified by examining the [Maevia repositories on GitHub]( https://github.com/ladybug-tools/spider-gbxml-tools/ )


### Learnability

* Maevia a provides context sensitive help in both 3D and 2D
	* Displays helpful text including text-to-voice in popup
* Every module has an associated read me file in Markdown format with help, wish list, issues and a change log


### Operability

_Degree to which a product or system has attributes that make it easy to operate and control._

* Maevia runs as any familiar webpage does in a browser
* Maevia menus are organized in the standard and familiar file, edit, select, view, settings and help format used by many programs


### User error protection

_Degree to which a system protects users against making errors._

* A lot of time has been spent making a Maevia workflow that is simple and logical and obvious
	* Most desired outcomes may be accomplished with two or three clicks on a menu
* Many buttons have popup tooltips
* Alerts that pop up are added to the code whenever a pattern of mistakes has been identified


### User interface aesthetics

_Degree to which a user interface enables pleasing and satisfying interaction for the user._

* By default Maevia is neither attractive nor unattractive
* By design, Maevia a delivers a user interface themed to fit in with the existing house style of any organization
* Along with the basic built-in theme, two theme-adding modules are provided: [W3Schools]( https://www.w3schools.com/w3css/ ) and [BootSwatch]( https://bootswatch.com/ ).
* Selected themes are remembered in between sessions


### Accessibility

_Degree to which a product or system can be used by people with the widest range of characteristics and capabilities to achieve a specified goal in a specified context of use._

* The senior maintainer for the Maevia project is 72 years old, is missing a left hand and is a partial paraplegic
* Maevia is tested on a wide variety of devices with a wide variety of interface elements
* Maevia is designed so that [ARIA roles]( https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles ) and other theme updates to assist with accessibility may be applied to the user interface, but awaiting testing procedures (and testers) these have not yet been implemented




</details>


<details>

<summary><h2>5. Reliability</h2></summary>

_Degree to which a system, product or component performs specified functions under specified conditions for a specified period of time._

* Most interaction with Maevia operating on a file - particularly now that automatic fixers are being implemented - should only take a few minutes
* Multiple interactions with multiple files has not appeared to cause any significant issues
* On occasion, when opening a new file after having opened and closed a very large file, it may take a while to clear memory
* Clicking on the menu title reloads the web page - and is often faster than waiting for the memory to clear
* Leaving multiple tabs open for a number of hours has not appeared to cause any significant issues


### Maturity

_Degree to which a system, product or component meets needs for reliability under normal operation._

* Maevia may be considered a fairly young project - the first commits were in 2017.
* The gbXML parser in Maevia. however, has been almost in continuous use ever since and has successfully opened and handled many thousands of files


### Availability

_Degree to which a system, product or component is operational and accessible when required for use._

* Maevia it is your typical web app, it just works


### Fault tolerance

_Degree to which a system, product or component operates as intended despite the presence of hardware or software faults._

* Glitches are quite rare, but when they occur a single click in the Maevia menu title will reload the webpage
* Reloads take only a second or so

### Recoverability

_Degree to which, in the event of an interruption or a failure, a product or system can recover the data directly affected and re-establish the desired state of the system._

* The current system apart from reloading, offers no protection in the case of a system failure
* If there is a system failure and you have not saved then your unsaved edits are lost
* Future versions could be created that would save temporary data in local storage, but the overarching intention is to provide viewing and fixing that is so speedy that temporary storage is not required




</details>
<details>
<summary><h2>6. Security</h2></summary>

_Degree to which a product or system protects information and data so that persons or other products or systems have the degree of data access appropriate to their types and levels of authorization._

Given the nature of the Maevia application, there are few areas of copyright, trademark or secrecy where security could be an issue. In any case, no issues have been raised to this date


### Confidentiality

_Degree to which a product or system ensures that data are accessible only to those authorized to have access._

* Maevia runs locally, on server, in an iframe or even embedded in another app ( such as Open Studio ;-)
* Given that Maevia is just a webpage statically hosted, the organization using Maevia may readily apply security parameters as need

### Integrity

_Degree to which a system, product or component prevents unauthorized access to, or modification of, computer programs or data._

* See above
* Given that the Maevia files are hosted on GitHub, an organization seeking to verify code integrity could compare the SHA of the local instance aof a module gainst the SHA of the instance on GitHub


### Non-repudiation

_degree to which actions or events can be proven to have taken place, so that the events or actions cannot be repudiated later._

* It would be an interesting experiment to add blockchain capability to the instances of gbXML files


### Accountability

_Degree to which the actions of an entity can be traced uniquely to the entity._

* gbXML files have a document history element.
* Previous versions of Maevia have had the ability to add and edit this data
* Previous versions of Maevia have also had the ability to maintain log files of edits
* Future revisions of Maevia should add these capabilities back


### Authenticity

_Degree to which the identity of a subject or resource can be proved to be the one claimed._

* Given that the Maevia application is a web app, verifying the authenticity of an instance depends on the organization using Maevia and its ability to maintain encryption and security throughout their workflow pipeline



</details>
<details>
<summary><h2>7. Maintainability</h2></summary>

_The degree of effectiveness and efficiency with which a product or system can be modified to improve it, correct it or adapt it to changes in environment, and in requirements._

### Modularity

_Degree to which a system or computer program is composed of discrete components such that a change to one component has minimal impact on other components._

* Maevia is entirely written in plain vanilla FOSS JavaScript with just three dependencies: Three.js, pkZip.js and Showdown.js
* All three dependencies are in use in thousands of other applications
* The Maevia file handling, menu, theme and other modules are currently in use in dozens of other locations
* The primary Maevia parser is in use in a number of Maevia versions an as well as being embedded in applications by [NREL]( https://www.ladybug.tools/spider/#gbxml-sample-files/README.md ) and [Perkins Will]( https://perkinswill.com/ )


### Reusability

_Degree to which an asset can be used in more than one system, or in building other assets._

* Given that the modules are written in plain vanilla JavaScript it should be fairly easy to reuse the code as part of a Vue, Angular or React environment
* Hosted on GitHub, everything is forkable
* Maevia is built up from several dozen JavaScript modules Each of which tends to be less than 500 lines long
* Groups of modules are kept in separate folders so as to be identifiable as a group

### Analysability

_Degree of effectiveness and efficiency with which it is possible to assess the impact on a product or system of an intended change to one or more of its parts, or to diagnose a product for deficiencies or causes of failures, or to identify parts to be modified._

* Maevia modules are passed through jsHint and jsLint on a frequent basis
* Maevia code is not currently compiled and therefore does not get all the error checking a compiler provides
* Maevia code is not currently being passed through a full 'prettify' cleanup


### Modifiability

_Degree to which a product or system can be effectively and efficiently modified without introducing defects or degrading existing product quality._

* Much attention in the development of Maevia has been devoted to creation of logical namespaces, folder, file and variable names that helped provide the feeling that the code is written as if it were a spoken language
* Maevia is written in plain vanilla JavaScript with code that is easy to read and designed so it is very simple for beginners to edit
* Maevia is written in a very simple coding style so that building engineers may be able to verify the validity of the calculations without being full stack programmers



### Testability

_Degree of effectiveness and efficiency with which test criteria can be established for a system, product or component and tests can be performed to determine whether those criteria have been met._

Investigating ways of designing and building testing systems is on the to do list

Code

* Currently all testing is manual and mostly carried out by opening the [Spider Sample gbXML]( https://www.ladybug.tools/spider/#gbxml-sample-files/README.md ) files and clicking on the various menus

gbXML item viewers

* Currently all testing is manual and carried out by interacting with the menus and viewing results in the 3D model and on the 2D context sensitive pop-up screen

Issue Fixers

* Currently all issue fixers are checked by running the tests again and seeing if the number of errors has been reduced down to zero
* Re-running the test is carried out automatically after a fix has been carried out


</details>


<details>

<summary><h2>8. Portability</h2></summary>

_Degree of effectiveness and efficiency with which a system, product or component can be transferred from one hardware, software or other operational or usage environment to another._

### Adaptability

_Degree to which a product or system can effectively and efficiently be adapted for different or evolving hardware, software or other operational or usage environments._

* Maevia works just fine on phones, tablets, laptops or workstations
* Maevia has been tested on Chrome, Edge, Firefox and Safari browsers
* Maevia has been tested on Windows, MacOS, Chromebooks and another number of other device operating systems
* Maevia has been tested hosted on GitHub, hosted on content delivery networks and opened directly from the local hard disk
* Maevia has opened files exported from several CAD systems and has exported to files that are read by a number of energy analysis programs


### Installability

_Degree of effectiveness and efficiency with which a product or system can be successfully installed and/or uninstalled in a specified environment._

* Maevia is a JavaScript that loads and runs in your browser. There is nothing to download or install.


### Replaceability

_Degree to which a product can replace another specified software product for the same purpose in the same environment_

* Maevia may replace or be replaced by any other programs that opens gbXML files
* There are a number of versions of Maevia hosted on the spider website.
	Most but not all are currently operable. All of the versions may be used interchangeably to view gbXML files


</details>


<details>

<summary><h2>Criticism of this effort</h2></summary>

* It will take much time and effort to complete this project. The time might better be spent writing good software
* The ISO standard is one of many. Perhaps the IEEE or any one of several others might be better choices
* ISO standards are highly proprietary, have extremely restrictive licenses and cost considerable amounts of money. Developing open source equivalents are a better long term solution.

</details>

<details>

<summary><h2>Links of interest</h2></summary>


### Standards

* https://pm.stackexchange.com/questions/20950/what-is-the-best-industry-standard-report-for-code-quality-control-and-measureme
* ISO or IEEE?? https://pdfs.semanticscholar.org/de1c/f09a52540b0cc500d712fa44fed3c13dcf3d.pdf
* http://profs.etsmtl.ca/claporte/english/enseignement/cmu_sqa/Notes/Normes/Software_Engineering_Standards_Int.pdf
* https://www.ifi.uzh.ch/dam/jcr:8e9cd2bb-60de-4ce7-b17e-8f994744d4cd/06_product_q.pdf

### ISO 25010 Software Quality Model

* https://iso25000.com/index.php/en/iso-25000-standards/iso-25010
* https://www.iso.org/standard/35733.html
* https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:ed-1:v1:en

About

* https://edisciplinas.usp.br/pluginfile.php/294901/mod_resource/content/1/ISO%2025010%20-%20Quality%20Model.pdf
* https://www.codacy.com/blog/iso-25010-software-quality-model/
* https://nocomplexity.com/overview-of-iso-25010/
* https://nocomplexity.com/category/quality-management/

### ISO/IEC_9126

* https://www.iso.org/standard/22749.html
* https://en.wikipedia.org/wiki/ISO/IEC_9126
* http://www.arisa.se/compendium/
* http://www.arisa.se/compendium/node6.html



### IEEE Standard for a Software Quality Metrics Methodology

* https://standards.ieee.org/standard/1061-1998.html
* https://ieeexplore.ieee.org/document/749159
* https://github.com/rick4470/IEEE-SRS-Tempate

### Boehm software quality tree

* https://www.google.com/search?rlz=1C1GCEA_enUS815US815&q=:+Boehm%E2%80%99s+software+quality+tree


### Software

* https://en.wikipedia.org/wiki/Software_quality
* https://en.wikipedia.org/wiki/Software
* https://en.wikipedia.org/wiki/Application_software
* https://en.wikipedia.org/wiki/Software_development
* https://en.wikipedia.org/wiki/Software_design ***
* https://en.wikipedia.org/wiki/Open-source_software
* https://en.wikipedia.org/wiki/Open-source_software
* https://en.wikipedia.org/wiki/The_Cathedral_and_the_Bazaar


### WBS

* https://en.wikipedia.org/wiki/Work_breakdown_structure
* https://www.lucidchart.com/blog/how-to-create-a-work-breakdown-structure-and-why-you-should

As you make a work breakdown structure, use the following rules for best results:

The 100% rule. The work represented by your WBS must include 100% of the work necessary to complete the overarching goal without including any extraneous or unrelated work. Also,  child tasks on any level must account for all of the work necessary to complete the parent task.

Mutually exclusive. Do not include a sub-task twice or account for any amount of work twice. Doing so would violate the 100% rule and will result in miscalculations as you try to determine the resources necessary to complete a project.

Outcomes, not actions. Remember to focus on deliverables and outcomes rather than actions. For example, if you were building a bike, a deliverable might be “the braking system” while actions would include “calibrate the brake pads.”

The 8/80 rule. There are several ways to decide when a work package is small enough without being too small. This rule is one of the most common suggestions—a work package should take no less than eight hours of effort, but no more than 80. Other rules suggest no more than ten days (which is the same as 80 hours if you work full time) or no more than a standard reporting period. In other words, if you report on your work every month, a work package should take no more than a month to complete. When in doubt, apply the “if it makes sense” rule and use your best judgment.

Three levels. Generally speaking, a WBS should include about three levels of detail. Some branches of the WBS will be more subdivided than others, but if most branches have about three levels, the scope of your project and the level of detail in your WBS are about right.
Make assignments. Every work package should be assigned to a specific team or individual. If you have made your WBS well, there will be no work overlap so responsibilities will be clear.





### Design considerations

From: https://en.wikipedia.org/wiki/Software_design


There are many aspects to consider in the design of a piece of software. The importance of each consideration should reflect the goals and expectations that the software is being created to meet. Some of these aspects are:

* Compatibility - The software is able to operate with other products that are designed for interoperability with another product. For example, a piece of software may be backward-compatible with an older version of itself.
* Extensibility - New capabilities can be added to the software without major changes to the underlying architecture.
* Modularity - the resulting software comprises well defined, independent components which leads to better maintainability. The components could be then implemented and tested in isolation before being integrated to form a desired software system. This allows division of work in a software development project.
* Fault-tolerance - The software is resistant to and able to recover from component failure.
* Maintainability - A measure of how easily bug fixes or functional modifications can be accomplished. High maintainability can be the product of modularity and extensibility.
* Reliability (Software durability) - The software is able to perform a required function under stated conditions for a specified period of time.
* Reusability - The ability to use some or all of the aspects of the preexisting software in other projects with little to no modification.
* Robustness - The software is able to operate under stress or tolerate unpredictable or invalid input. For example, it can be designed with resilience to low memory conditions.
* Security - The software is able to withstand and resist hostile acts and influences.
* Usability - The software user interface must be usable for its target user/audience. Default values for the parameters must be chosen so that they are a good choice for the majority of the users.[6]
* Performance - The software performs its tasks within a time-frame that is acceptable for the user, and does not require too much memory.
* Portability - The software should be usable across a number of different conditions and environments.
* Scalability - The software adapts well to increasing data or number of users.

