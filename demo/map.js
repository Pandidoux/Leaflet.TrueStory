// OpenStreetMap layer
const OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
});


// Map definition
var map = L.map('map', {
    center: [50.635, 3.054],
    zoom: 13,
});
map.on('click',(e)=>{
    console.log(e);
})
OpenStreetMap.addTo(map);


// Create bloc 2 title and content
let title2 = document.createElement('span');
title2.innerText = 'Title 2';
title2.style.fontSize = 'large';
let txt2 = document.createElement('span');
txt2.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.';


/** Callback function
 * @param {Object} story Story object properties
 */
const printStory = function(story) {
    console.log('story =',story.id);
}


// Define the Leaflet.LayerOpacity control
let leafletTrueStory = L.leafletTrueStory({
    id: 'my-truestory',
    mode: 'full',
    autoshift: true,
    background: 'rgba(0, 0, 0, 0.3)',
    interactThrough: false,
    control: true,
    controlLabel: 'Show/Hide Storymap',
    position: 'topleft',
    collapsed: false,
    spacer: '30em',
    borderRadius: '25px',
    blured: false,
    padding: '20px 60px',
    stories: [
        {
            id: 'story-1',
            title: 'Title 1',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
            width: null,
            align: 'center',
            background: '#FFF',
            shadow: true,
            callback: printStory,
        },{
            id: 'story-2',
            title: title2,
            content: txt2,
            width: '300px',
            align: 'left',
            background: '#FFF',
            shadow: false,
            callback: printStory,
        },{
            id: 'story-3',
            title: 'Title 3',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
            width: '300px',
            align: 'right',
            background: '#FFF',
            shadow: true,
            callback: printStory,
        },{
            id: 'story-4',
            title: 'Title 4',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
            width: '300px',
            align: 'left',
            background: '#FFF',
            shadow: true,
            callback: printStory,
        },{
            id: 'story-5',
            title: document.getElementById('extrenal-title'),
            content: document.getElementById('extrenal-content'),
            width: '75%',
            align: 'center',
            background: 'rgba(0,0,0,0.4)',
            shadow: true,
            callback: printStory,
        }
    ],
});
leafletTrueStory.addTo(map); // Add control to map
console.log('leafletTrueStory =', leafletTrueStory);


/** Change leafleatTrueStory properties and update view
 * @param {string} property Property name
 * @param {any} value Value to assign
 */
const updateTrueStory = function (property, value) {
    leafletTrueStory.remove();
    leafletTrueStory.options[property] = value;
    leafletTrueStory.addTo(map);
    document.querySelectorAll(`#modifier-buttons button[name='${property}']`).forEach(button => {
        button.classList.remove('active');
    });
}
document.querySelectorAll('.radio-group label').forEach(label => {
    const input = label.querySelector('input');
    input.addEventListener('change', (e) => {
        const name = input.getAttribute('name');
        const value = (['true', 'false'].includes(label.innerText)) ? label.innerText == 'true' : label.innerText;
        updateTrueStory(name, value);
    });
});
