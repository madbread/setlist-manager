# scss

main.scss will be recompiled to `/app/css/main.css`

Please be sure to import all .scss files into `scss/main.scss`

## SASS Organization

I use a [SMACCS](https://smacss.com/)-ish philosophy when setting up sass for large applications. If you are not familiar with [SMACCS](https://smacss.com/), I highly recommend checking out the free docs on [their website](https://smacss.com/).

All sass partials are contained in subfolders of `/scss`. They are all imported by `/scss/main.scss`. Within the `/scss` directory, there are four subdirs to include scss partials:

- base
- layout
- modules
- state

### Base

There are several types of partials inside the base folder:

- settings
- mixins
- base tag styles
- typography

#### base/_settings.scss

Any color / font / module / breakpoint / unit settings belong here

#### base/_mixins.scss

These contain all custom (non-compass) reusable sass functions

#### base/_base.scss

This stylesheet is intended for all default base tag style for the site.

Base styles include setting heading sizes, default link styles, default font styles, and body backgrounds. There should be no need to use !important in a Base style.

It doesn’t include any class or ID selectors. It is defining the default styling for how that element should look in all occurrences on the page.

#### base/_typography.scss

Includes the default font and size styles for the site.

### Layout

Place any layout styles here for the site. If any of the individual sections becomes too long, feel free to break them off into their own paritals (ex.. layout/_header.scss)

### Modules

There are self-contained complex elements. A module is a more discrete component of the page. Each Module should be designed to exist as a standalone component.

A custom reusable accordion list would be a good example of a module.

### State

A state is something that augments and overrides all other styles. For example, an accordion section may be in a collapsed or expanded state. A message may be in a success or error state.

There is plenty of similarity between a sub-module style and a state style. They both modify the existing look of an element. However, they differ in two key ways:

- State styles can apply to layout and/or module styles; and
- State styles indicate a JavaScript dependency.

Sometimes a state is very specific to a particular module where styling is very unique. In a case where a state rule is made for a specific module, the state class name should include the module name in it. The state rule should also reside with the module rules and not with the rest of the global state rules.
