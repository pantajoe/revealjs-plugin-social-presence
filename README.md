# Social Presence Plugin for reveal.js

## Setup

First, install the the file `dist/social-presence.min.js` to your reveal.js plugin folder
as well as the stylesheet in `dist/social-presence.css`.

Then, add third-party dependencies to your page's `head` tag:

```html
<!-- React -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script> 
<!-- ReactDOM -->
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<!-- Socket.IO -->
<script crossorigin src="https://www.unpkg.com/socket.io-client@4.5.4/dist/socket.io.min.js"></script>
```

Add the stylesheet belonging to this plugin:

```html
<link rel="stylesheet" href="plugin/social-presence/social-presence.css">
```

As a sibling element to your `div.reveal` element, add a `div` with the id `social-presence`:

```html
<div id="social-presence"></div>
```

Add a script tag for this plugin alongside your other reveal.js script tags:

```html
<script src="plugin/social-presence/social-presence.min.js"></script>
```

## Notes

Make sure not to enable the `mouswheel` navigation as elements of this plugin
are scrollable and this could result in unwanted navigation.
