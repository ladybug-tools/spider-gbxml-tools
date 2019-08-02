# Design considerations

The following text is an extract from this Wikipedia article

* https://en.wikipedia.org/wiki/Software_design#Design_considerations

It is checklist of items to consider when acquiring new software.  It is a list if requirements from the end-user or customer point of view. An unusual aspect of this section is that there is no footnote linking to the source of the data. It may therefore be "original research". Nonetheless it feels useful and is the only example of a checklist that I have been able to find.


***

There are many aspects to consider in the design of a piece of software. The importance of each consideration should reflect the goals and expectations that the software is being created to meet. Some of these aspects are:

## Compatibility

_The software is able to operate with other products that are designed for interoperability with another product. For example, a piece of software may be backward-compatible with an older version of itself._

Further considerations might include

* Data compatibility between versions of the data format. Can older versions if the program be use with newer versions of the data. Can an older browser view your new web page?
* Data compatibility with different programs. Does your new web page work on all browsers?
* Application compatibility. Can you use the same extension on a variety of browsers and operating systems



## Extensibility

_New capabilities can be added to the software without major changes to the underlying architecture._

* Are there plugins, extensions, API, scripting language?

## Modularity

_The resulting software comprises well defined, independent components which leads to better maintainability. The components could be then implemented and tested in isolation before being integrated to form a desired software system. This allows division of work in a software development project._

* Can I get different apps to work together?
* Does the app I am looking at have a variety of features that I can add or remove
* Will my CAD program work with my energy analysis program


## Fault-tolerance

_The software is resistant to and able to recover from component failure._

* Will the program crash if given faulty data?
* will a program have issues with low memory or large files?

## Maintainability

_A measure of how easily bug fixes or functional modifications can be accomplished. High maintainability can be the product of modularity and extensibility._

* Is there a place where issues can be submitted
* Is there a history of fixing issues in a timely fashion?
* is there a history of updating the app on a regular basis?
* Are there a number of versions available?

## Reliability (Software durability)

_The software is able to perform a required function under stated conditions for a specified period of time._

* Can we use the software all day without it crashing
* When we reload the page how long does it take?

## Reusability

_The ability to use some or all of the aspects of the preexisting software in other projects with little to no modification._

* can I use my existing data in the new program
* can I use the other programs that usually work with with the new program
* Hackability

## Robustness

_The software is able to operate under stress or tolerate unpredictable or invalid input. For example, it can be designed with resilience to low memory conditions._


* Good garbage collection

**Links of interest**:

https://en.wikipedia.org/wiki/Robustness_testing

	robustness as the degree to which a system or component can function correctly in the presence of invalid inputs or stressful environmental conditions


## Security

_The software is able to withstand and resist hostile acts and influences._

* Is the data kept locally or does it go to a server?


## Usability

_The software user interface must be usable for its target user/audience. Default values for the parameters must be chosen so that they are a good choice for the majority of the users._

* Is there a steep learning curve?
* Will there be significant changes to the workflow?


## Performance

_The software performs its tasks within a time-frame that is acceptable for the user, and does not require too much memory._

* Will the majority of the tasks take less than a second to carry out?
* Are mixes of short and long responses avoided?


## Portability

_The software should be usable across a number of different conditions and environments._

* can I use the program on my computer, laptop, tablet, mobile device?


## Scalability

_The software adapts well to increasing data or number of users._

* what are server loads like?

***

Possible Additions

## Licensing


## Pricing


## Internationalization

## Verifiable / Auditable