// Add your layers to the map
// OpenStreetMap
const OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
});


// Define map
var map = L.map('map', {
    center: [50.635, 3.054],
    zoom: 13,
    // zoomControl: false,
});
map.on('click',(e)=>{
    console.log(e);
})
OpenStreetMap.addTo(map);

let txt = document.createElement('span');
txt.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.';
let title = document.createElement('span');
title.innerText = 'Titre 1';

const printStory = function(story) {
    console.log('story =',story.id);
}

// Define the Leaflet.LayerOpacity control
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
// console.log('leafletTrueStory =', leafletTrueStory);
