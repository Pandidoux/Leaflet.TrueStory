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
    id: 'my-truestory',
    position: 'topleft',
    mode: 'right',
    autoshift: true,
    // background: 'rgba(0, 0, 0, 0.4)',
    interactThrough: false,
    toggle: true,
    toggleLabel: 'Basculer la Storymap',
    collapsed: false,
    spacer: '30em',
    stories: [
        {
            id: 'story-1',
            title: title,
            content: txt,
            width: '50%',
            align: 'center',
            callback: printStory,
        },{
            id: 'story-2',
            title: 'Titre 2',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
            width: '300px',
            align: 'left',
            callback: printStory,
        },{
            id: 'story-3',
            title: 'Titre 3',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
            // width: '300px',
            align: 'right',
            callback: printStory,
        },{
            id: 'story-4',
            title: 'Titre 4',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
            width: '300px',
            align: 'left',
            callback: printStory,
        },{
            id: 'story-5',
            title: 'Titre 5',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
            width: '300px',
            align: 'right',
            callback: printStory,
        }
    ],
});
// Add control to map
leafletTrueStory.addTo(map);
```
