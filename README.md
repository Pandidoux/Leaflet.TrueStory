# Leaflet.TrueStory

Leaflet.TrueStory is a Leaflet plugin made to create storymap.

## Demo
[View Demo](#)

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
    id: "my-simple-slider", // Custom HTML id
    position: 'topright', // Control position
    title: 'Layer Opacity', // Control title
    collapse: true, // Should the control be able to collapse or always be open
    sliderItems: { // Slider items objects { "item1_name":item_value1, "item2_name":item_value2 } or Array [item1, item2]
        'A': 'AAA',
        'B': 'BBB',
        'C': 'CCC',
        'D': 'DDD',
        'E': 'EEE',
        'F': 'FFF',
        'G': 'GGG',
        'H': 'HHH',
        'I': 'III',
    },
    // sliderItems: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
    defaultValue: 0, // Default value for the slider
    sliderChange: function (label, value, index) { // Function executed when slider is moved
        console.log('label =',label,' value =',value,' index =',index);
    },
    fireOnInit: true, // Execute the sliderChange function on initialisation
    width: '400px', // Slider width, default 400px, within limit of window width
});
// Add control to map
leafletTrueStory.addTo(map);
```

| Option       | Description                                         | Default Value   | Type            |
|--------------|-----------------------------------------------------|-----------------|-----------------|
| id           | Custom HTML id                                      | null            | string          |
| position     | Control position on the map                         | 'topright'      | string          |
| title        | Control title displayed on the UI                   | 'Simple Slider' | string          |
| collapse     | Enable collapsing/expanding feature for the control | true            | boolean         |
| sliderItems  | Slider items objects                                | null            | Object / Array  |
| defaultValue | Default value for the slider                        | 0               | string          |
| sliderChange | Function executed when slider is moved              | undefined       | function        |
| fireOnInit   | Execute the sliderChange function on initialisation | false           | boolean         |
| width        | Slider width                                        | '400px'         | string          |
