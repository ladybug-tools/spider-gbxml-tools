
RESTful access

Testing

Source control
* GitHub driven


## 2019-07-26 ~

## The "TL;DR"

Spider gbbXML Viewer v0.17 'Maevia' provides a significant leap forward in terms of performance, usability and robustness.


## Spider gbXML Viewer Read Me

First released in 1999, [gbXML]( http://gbxml.org) is the architecture, engineering and construction (AEC) industry standard file format for transmitting data between CAD programs such as Revit, AutoCAD , [Bentley MicroStation]( https://www.bentley.com/en/products/brands/microstation )  and energy analysis programs such as [Open Studio]( https://www.openstudio.net/ ), [Energy Plus]( https://energyplus.net/ ), [Sefaira]( https://sefaira.com/ ), [TAS Engineering]( https://www.edsl.net/tas-engineering/ ) and others.

gbXML files are generally created as exports from CAD programs as the minimum representation of building data that is suitable for creating a 3D model used to carry out energy and illumination studies.

Although the guidelines of the gbXML format are clear and well documented, the process of simplifying data required for a complex building is fraught with issues. In turn the import of files with problems is also fraught with issues. A sad result is that building engineers around the world spend much time dealing with data file issues - time which would much be much better spent actually analyzing the models and recommending better solutions. The Spider project is an effort to help remedy these issues.

First released in 2017 as a programming exercise, the Spider gbbXML Viewer is a web browser viewer of gbXML data. It reads the data from ASCII or ZIP files, parses the data and creates 3D representations viewable in the browser. Right from the get go, designers and engineers saw the potential for the Viewer to help spot errors visually. Within a few months R12 of the viewer was allowing users to spot many issues as well as providing tools to fix the issues and save the data to new files

The upcoming Spider gbbXML Viewer v0.17 - code name 'Maevia' makes managing gbXML files faster, simpler and with higher quality data transfers.


Behind the simple words, there lies a myriad of features and benefits that need to be defined built and tested. The following is an overview of a number of the thought processes covered by the Spider team while developing the app.


The list is quite long. There are several intentions.

* Software is not magic, Software is created by humans who and think har over extended periods of time
* It's light and easy and can be used in a small office almost instantly but there is also enough depth and robustness so that the routines can be (and already hve been) brought into the complex workflows of very large practices


The following sections identify the problems that need to be solved to make good software, software that tackles gbXML issues and software that people can use to solve real issues


## General software needs

The items in this section are requirements for any software to be used to process the core repositories of data used by building design or engineering organizations.


What are the minimum criteria for the software we want? Several qualities wanted

* Data is accessible
* Follows the rules of programs we know
* Handles the data
* OS/device independent

More

* Open to software and stuff that completely change the game





### Compatibility Polyglotism

File management, data safety

**Problem**: We live in a connected world. Data may arrive from anywhere at any time. Systems that force you to download a file or limit you to opening file on a remote server or use another app to decompress data are problems not solutions.

**Want/Need**: Opening files is not an issue. You may open any file, of any type, from any source, anywhere, any time.

**Solution**: Spider is good at opening gbXML files and making the data usable for you. The file open module deals with data files that may be local or remote, 8 bit/single or 16bit/double-byte, in ASCII or ZIP format, small or hundreds of megabytes, working or broken, loaded once or repeatedly with a click, readable as text, as XML, as JSON or in 3D.

**Importance**: This is a nice to have. It won't change the world, but every app should have this. And since file-open-basic.js is on GitHug, what are you waiting for?


### Device independent

**Problem:** You have a thing you are interested in but you are traveling, at home, have lost you computer, without power or whatever, but that does not stop the problem from being interesting and you want to find a solution.

**Want/Need**: handling problems is not an issue. You can access your data on any device, anywhere, any time. Today's mantra is "Mobile first!"

**Solution**: Spider runs from a server or runs locally, online or off line, standalone or embedded in an iframe. Spiders run on a desktop, laptop, tablet or smartphone. If you have access to a browser you can manipulate gbXML.

**Importance**. Unknown. Current building engineering is mostly carried in offices with access high-powered desktops or laptops for big, expensive long-term projects. The
future may bring more light width ad-hoc field engineering where you pull the folding phone out of your cargo-pants and decide the R-value of the gunk inside the 3D building printer for an acoustic shell behind this afternoon's rock concert.



### Robust / Forgiving /

**Problem**: You want to access data in the office and on building sites without issues. In other words under a variety of environmental conditions, a range of devices and a variety of human focus or training on the task hand

**Want/Need**: The software is able to operate under stress or tolerate unpredictable or invalid input. For example, it can be designed with resilience to low memory conditions.

/// A file reader that is forgiving, makes the date understandable, works fast and is fun to play with

**Solution**: Billions of dollars and zillions of hours have been spent making your browser work always and anywhere. Spider harnesses that power.

**Importance**: Decreasing. Because of industries such as gaming, pornography and advertising, the browser is rendering faster and more safely than we can think.


**Links of interest**:

* https://en.wikipedia.org/wiki/Robustness_testing

	robustness as the degree to which a system or component can function correctly in the presence of invalid inputs or stressful environmental conditions

* http://www.performance-workshop.org/documents/Verifying_Software_Robustness_Final_Collard.pdf

	 Software is robust if it can tolerate such problems as unanticipated events, invalid inputs, corrupted internally stored data, improper uses by system operators, unavailable databases, stress overloads and so on.
	Systems that include both hardware and software are robust if they can tolerate physical problems such as equipment damage loss of power software crashes and equipment damage, loss of power, software crashes and so on.



### Software verification and validation

**Problem**: The system has given you an answer, but you need to know that the answer is authoritative, verifiable and beneficial.

* Verification: Are we building the product right?
* Validation: Are we building the right product?

**Want/Need**: Answers and solutions that are trustworthy and my be audited

**Solution**: All built on FOSS, few dependencies. Spider is built on our own source code and the following JavaScript libraries Three.js, PKZip.js and Showdown.js.  Also several dozen in-house modules all written in plain-vanilla JavaScript. There are no other dependencies. All of the above are plain vanilla open source JavaScript files available for inspection on GitHub.

**Importance**: Unknown. At some time in the future all programs may be some AI neural network thingies. On the other hand maybe programming becomes things like strumming a guitar or combing your hair.

**Links of interest**:

* https://en.wikipedia.org/wiki/Software_verification_and_validation
* https://en.wikipedia.org/wiki/Verification_and_validation
* https://en.wikipedia.org/wiki/Runtime_verification


### Performance / Speedy execution

**Problem**: Going from one tab or window to another tab or window and then returning to the first tab or window is boring, frustrating and old-skool. Fixing the design takes longer than designing the design. Every keystroke is it takes to do something is a keystroke slowing down better engineering

**Want/Need**: Every click in your current tab just keeps new things coming into your current tab. The menu trees just make this happen for you

**Problem**: Spider is designed for you to see, review and fix with as few keystrokes as possible while giving you the maximum feedback, timeliness and direction.





## Code remixing


### Not Distracting

**Problem**: Solving building engineering problems and creating elegant solutions is time-consuming, expensive and complicated. We are working with complex building engineering concepts and these take up most of our thought processing capabilities. Code of any complexity makes you spend more time analyzing the code than analyzing the building design.

**Want/Need**: methods where we spend time on the engineering not the coding or programming

**Solution**: The code in Spider 'Maevia' The actual code for visualizing and investigating should not slow down
Coding style follows Mr.doob Three.js coding style very closely. In other words code should look good as good as a poem on a page.

**Importance**




### Hackability

**Problem**: We have entered an era where programming apps for the browser has become a highly sophisticated, directed and all consuming affair. People with excellent STEM skills but limited coding skills a afraid to start. Full stack developers excellent in a particular workflow such as Angular may cringe at the idea of working with Vue or React.

**Want/Need**: tool as are hackable by people with all manner of skill sets and at all levels of skill mastery.

**Solution**: Spider is designed to be easy for beginners to hack using the Windows Notepad or MacOS TextEdit or the GitHub online editor and easy for full stack developers to port into complex, existing workflows.

* [Hackability - What it means, why it’s important]( https://www.slideshare.net/nitot/hackability-what-it-means-why-its-important/ )



### Workflow adaptable

**Problem**: Every organization, every discipline, every project may have its own work flow, web presence methodology, look and feel. Having to adapt to new methods is a deal breaker

**Want**: Tools that adapt to your current needs rather than the reverse. Your needs are complex. They range from appearance to performance, from security to economic value

**Solution**: Spider is easy to theme. Demos for Bootstrap and W3Schools theme provided. Spider is easy to embed. Demos for embedding Spider in an iframe are provide



## gbXML Specific


### Error repair

**Problem**. You receive many gbXML files with many issues. In other words, you receive files of hundreds of thousands lines with hundred of errors. The process of repairing the files is done by humans and is drudgery, complicated and expensive.

**Want/Need**: Files that can fix themselves.

**Solution**: Spider has eight routines for checking for issues and nine modules that identify issues and can fix the issues with a click of a single button

**Importance**: This is it. Fix the files and get on with it. Files that make the round trip between energy analysis and CAD apps are worth their weight in copper pipes or something.



### In depth Views

**Problem**: gbXML files typically contain many elements including surfaces, spaces, stories, zones, constructions, materials and many more. Any one of these may have issies

**Want/Need**: the ability to view any and all elements in a gbXML file

**Solution**: Spider provides the tools to view every instance in every element with a few keystrokes. For example, surface elements may be located using ID, name, construction or CAD Object ID. Once located, the attributes of the surface may be viewed as clickable items, a raw gbXML or as 3D representation highligted un the 3D model

Relevance: Very important. Spiders ability to locate an element, highlight it, view it;s detail, zoom into it, show its neighbors and more are the things that make Maeva useful, speedy and fun.



### Effectiveness

**Problem**: You have to know Revit, AutoCAD, Open Studio, TAS and a bunch of other programs. You have to download, install and keep them up to date. Most engineering apps are programs you have to download, install and update. Then you have watch innumerable podcasts in order to get going.

**Want/Need**: easy to use, free, just works. Easy to re-purpose

Solution. Spider: it just works. If you can use the menus in a browser you can use Spider. If you have something that take two clicks and yu ask us, we can probably make it happen in one click.

Relevance: All apps 'should just work'. So this category in the future should nor be important. But for th moment Spider is a good early adopter.



## Usability / Learnability

### Documentation



**Comments**: Inline comments are rare in Spider. Often they merely indicate the beginning and end of a logical grouping of functions. The bigger, deeper effort is going into the naming of variable, function, files and folders Every module has its own name space.


**Read Me Files**: Every module has an associated read me file written in Markdown format. fileName.js has fileName.md. Every read me incorporates module mission/vision/problem-being-solved, wish list, issues, links of interest and change log. Automating the process of updating - ( think jsDOc, aspects of YAML and so on ) of the module read me is a work-in-progress


### Sample Data

**Problem**: People have to start somewhere but there is nothing there to start with. Data to learn from or for testing is not available

**Want/Need**: Sample data for learning, testing and manipulating

**Solution**: Spider provides dozens of sample gbXML files for you to practice with

[Importance of Sampling in the Era of Big Data]( https://towardsdatascience.com/importance-of-sampling-in-the-era-of-big-data-d2cf83e06c6a )



### Extensible Product Portfolio (EPP )

**Problem**: Users hate change

**Want/Need**: The idea of EPP is thus: when you have a product that works, and an existing customer base - freeze it. Instead of a major redesign simply leave the product the way it is, bar minor bug-fix work. Instead devote effort into building a new, next-generation product that addresses (hopefully) a new customer segment, and allow existing customers to add this new product to their portfolio. This allows existing customers to self-select into a new product, protects revenue and reduces the risk of existing product customers leaving due to badwill.


**Solution**: Spider is very EPP. All of the Spider gbXML Viewer versions are online. Most are in usable working order.


**Links of interest**:

* Jacon Nielson:[Users Hate Change]( https://www.nngroup.com/videos/users-hate-change/ )
* Comments by sleepyfix [Users hate change]( https://gist.github.com/sleepyfox/a4d311ffcdc4fd908ec97d1c245e57dc )

