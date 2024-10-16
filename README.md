# Leaflet.TrueStory

Leaflet.TrueStory is a Leaflet plugin made to create storymap.

## Demo
[View Demo](https://pandidoux.github.io/Leaflet.TrueStory/demo/)

## Getting Started

### Prerequisites

Make sure you have Leaflet library included in your project.

<!-- This plugin is compatible with Leaflet version 1.x.x . -->

### Installation

Include the `Leaflet.TrueStory.js` and `Leaflet.TrueStory.css` files in your project.

```html
<link rel="stylesheet" href="path/to/Leaflet.TrueStory.css">
<script src="path/to/Leaflet.TrueStory.js"></script>
```

### Usage
Create a map:
```javascript
var map = L.map('map').setView([39.73, -104.99], 10);

// Add the Control to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);
```
Add the Leaflet.TrueStory control:
```javascript
// Define the Leaflet.TrueStory control
let leafletTrueStory = L.leafletTrueStory({
    options: {
        id: 'my-truestory',
        mode: 'full',
        background: 'rgba(0, 0, 0, 0.4)',
        interactThrough: false,
        toggle: true,
        toggleLabel: 'Toggle storymap',
        position: 'topleft',
        collapsed: false,
        spacer: '20em',
        autoshift: true,
        stories: [
            {
                id: null,
                title: null,
                content: null,
                width: '100%',
                align: 'center',
                callback: null,
            },{
                title: null,
                content: null,
                width: '100%',
                align: 'center',
                callback: function(story) {
                    console.log("Story is visible =>",story);
                },
            }
        ],
    },
});
// Add control to map
leafletTrueStory.addTo(map);
```

### Options

#### Storymap
| Option          | Description                                                       | Default Value     | Type    |
|-----------------|-------------------------------------------------------------------|-------------------|---------|
| id              | Storymap container HTML id                                        | null              | string  |
| mode            | Story display mode: `"full"`\|`"left"`\|`"right"`                 | "full"            | string  |
| background      | Background css property of the stories container                  | "transparent"     | string  |
| interactThrough | Allow interactions with the map through the storymap background   | false             | boolean |
| toggle          | Show a control toggle button                                      | false             | boolean |
| toggleLabel     | Label of the storymap toggle button                               | "Toggle storymap" | string  |
| position        | Control button position                                           | "topleft"         | string  |
| collapsed       | Should storymap be collapsed on init (when `toggle: true`)        | false             | boolean |
| spacer          | Bottom padding space between each stories                         | "200px"           | string  |
| autoshift       | Automaticaly shift the map to the side when mode is right or left | true              | boolean |
| borderRadius    | Border radius of stories blocs                                    | "20px"            | string  |
| blured          | Blur the limits between the map and the storymap background       | false             | boolean |
| stories         | Array of stories properties described in the dedicated section    | []                | array   |

#### Story
| Option     | Description                                           | Default Value | Type                  |
|------------|-------------------------------------------------------|---------------|-----------------------|
| id         | Define a HTML id for the story bloc                   | null          | string                |
| title      | Story title (text or HTML element)                    | null          | string \| HTMLElement |
| content    | Story content (text or HTML element)                  | null          | string \| HTMLElement |
| width      | Story css width property                              | "100%"        | string                |
| align      | Align story to the `"center"`\|`"left"`\|`"right"`    | "center"      | string                |
| background | Story bloc background css property                    | "#FFF"        | string                |
| shadow     | Show a shadow on the story bloc                       | true          | boolean               |
| callback   | Function called when the story is visible             | null          | function              |