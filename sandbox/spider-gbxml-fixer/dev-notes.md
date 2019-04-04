
# Dev Notes


### 2019-04-03 ~ Theo

In R1 what is loaded at run time depends on the HTML in the template element. The JavaScript module cannot be moved or commented out without also editing the HTML in the template in the main HTML file.

It feels, at this writing, that all the code and the UI should be in the JavaScript module. The whole thing can be set up with a single get.

This thought is the impetus for going from R1 to R2.

It could help with making it easier to have the same module in fixer and 3D viewer.

As the process of checking becomes increasingly automated assemblage may may it easier to pare down to a smaller, easier usr experience - one check module at a time

***

It must be easy to use a fixer module in viewer and vice versa. Thhis will help with visually verifying that an error is fixed correctly. But: given that we are fixing things we should not supply a bunch of ui elements to help fix things that are fixable by algorithm.


***

R14 reduces the number of spaces to check by looking for common vertices

See gv-iss line 380 and on

