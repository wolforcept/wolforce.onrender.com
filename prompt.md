Ok so i want you to make a webpage with preact + html.
I want it to be really clean in both desktop and mobile, but i want minimal specific code for either, so i want it to be made in a way that it works for both most of the time (there may be exceptions of course)

The website is a blog like page but with filters to help the user find stuff more easily.

### NAVBAR

The top is a navbar (not fixed) that simply has my wide logo on the left and some buttons on the right.

There are two buttons:

* login button. only icon, no text. button is hidden if the user is already logged in. shows a login modal. This button should be very transparent, barely visible.

* create button. only a plus icon, no text. button is hidden if the user is not logged in. shows a create dialog.

Dialogs on the site should all use the same  style object so that they are all self similar and are easy to change.

the actual dialogs:

* login:  a simple modal with just a key input box and cancel and login buttons. Clicking cancel hides the dialog. Clicking login tries to connect to a Github GIST with the key and if successful saves that key on localstorage. having that key is what defines if the user is logged in or not. if the key is not correct a small error message should appear. Important: this message should not change the size of the dialog!

* create:  Shows a small simple form dialog with a few fields: "Title", "Image Url", "Tags (comma separated)", "Content" and "Links". all are strings. the dialog has "publish" and "cancel" buttons. clicking cancel hides the dialog. clicking publish creates a new object, then fetches the gist and appends the new object to "posts" on the gist. then sends an update with then new gist to the github gist using the saved login key.

### POSTS

 on the site itself you will show entries for all my projects. the entries are fetched from the gist. the gist is public so the key is not needed to get the posts, only to update.
the actual gist url is 

```html
https://gist.githubusercontent.com/wolforcept/9a4b5ebc40791c07a176b6d47411c125/raw/wolforce
```

the gist has this format: 


```html
{
    "posts": [
        {
            "date": "2025-08-24",
            "title": "Green Spreader",
            "content": "A half baked game for Mini Jam.",
            "image": "greenspreader.png",
            "tags": [
                "game",
                "webgame",
                "gamejam",
                "Mini Jam"
            ],
            "links": [
                {
                    "title": "Itch.io",
                    "link": "https://wolforcept.itch.io/greenspreader"
                }
            ]
        }
        //...
    ]
}
```

The posts will be arranged in grid or list, so I want you to create a flexible component that renders differently depending on the type of arrange of the site.
The component should always show the Title, Date and Image, but depending on the arrangement it can also show the other information: tags, content and links.
* case arrange=grid: the posts should be square tiles with the image as background and the title on bottom, in front of the image. add a small black to transparent gradient on the bottom so the text is more easily readable
* case arrange=list: the post should be a wider card (full width on mobile, but not on desktop) Image on the left and the information on the right in this order: Title and date, tags, content, links
The component should also have a small star (empty or yellow) on the top corner and clicking it should add it to the favourites (the id is the title) and the favourites should be saved on localstorage.

the posts as tiles should be small, about 3 per row in mobile.
the posts as list items should be full width in mobile, but not on desktop
the images that dont start with "http://" should be fetched from the local folder "assets/images"

#### POST DETAILS

Clicking a post should use a hash like router to "open" a new page with the details, so that the user can use the back button to return to the list, but without actually going to a different page. this new page should be a new component (dont reuse the list component) with all the post information but bigger and more clear.

when showing the details of a post, move the back button to the navbar, to the right, and hide the create button.

### FILTERS

I want another second navbar for the simple/advanced filters and grid/list selector.
it should be below the navbar, but if the user scrolls it becomes fixed to the top.
On the left it should have a selector for grid/list.
On the right a button to toggle advanced filters.
On the center the filters themselves.
The simple filters are just few hardcoded chips, for now just ["favourites" (just a star), "games","software" and "links"] and only one can be selected at a  time. 
the advanced filters are a list of all the tags that are present in all posts. this list should be compiled immediately as the GIST is fetched. clicking a filter toggles between various states: 
 - OFF - the tag is ignored, gray background
 - AND - the tag is used as an "and" function, blue background
 - OR - the tag is used as an "or" function, green background
 - NOT - the tag is used as a "not" function, red background
the filter text should show a plus when used in OR mode and a minus when used in NOT mode.
there should be a "clear" button to clear all filters.

returning to simple filters should clear all advanced filters
advanced filters should be a bigger box that shows all filters, no scrolling.

the grid/list button should be a single toggle button, not a switch.

the advaced button should be an icon, not a text button

the simple filters should be centered.

## THEME

the logo on the top left on the navbar should be an actual image, not text.
It is in assets/images/logo.png

the theme should be bright gold accents over dark bluish green background #1b2c2e
Please put all color definitions in a clearly separated theme region in code

## ICONS

I want you to use my own made icon font called iconawesome. it was made with svgtofont, so i have the css and the woff and woff2 in this CDN
https://wolforcept.github.io/cdn/iconawesome/ia.css
https://wolforcept.github.io/cdn/iconawesome/ia.woff
https://wolforcept.github.io/cdn/iconawesome/ia.woff2
the icons are used like in fontawesome, like "ia ia-plus"

## code quality

i want clean code, clearly separated into sections and using "#region" / "#endregion"
