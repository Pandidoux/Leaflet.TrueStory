/* Leaflet control plugins inherit from Leaflet's Control class. A common
 * naming convention is to add the name of the control plugin to Leaflet's
 * namespace, which is L.
 */
L.LeafletTrueStory = L.Control.extend({
    options: {
        id: null, // Storymap container HTML id
        mode: 'center', // Story display mode: center|left|right
        background: 'transparent', // Background css property of the stories
        interactThrough: false, // Allow to interact with the map behind the storymap
        toggle: false, // Show a control toggle button
        toggleLabel: 'Toggle storymap', // Label of the storymap toggle button
        position: 'topleft', // Toggle control button position
        collapsed: false, // If toggle button is true, story should storymap be collapsed on init
        spacer: '20em', // Bottom padding space between each stories
        autoshift: true, // Automaticaly shift the map to the side when mode is right or left
        stories: [],
    },
    defaultStoryOptions: {
        id: null, // Story HTML id
        title: null, // Story title (text or HTML element)
        content: null, // Story content (text or HTML element)
        width: '100%', // Story width
        align: 'center', // Align story to the left, right, center
        callback: null, // Function called when the story is visible
    },


    /* Leaflet calls the initialize function when an instance of the plugin
     * control is created with a call to new.
     */
    initialize: function (options) {
        // Combine the control plugin's default options with those passed in as the parameter
        // console.log('this =', this);
        // console.log('options =', options);
        L.Util.setOptions(this, options);
    },


    /* Leaflet calls the onAdd function when the control is added to the map:
     * control.addTo(map);
     * map.addControl(control);
     */
    onAdd: function (map) {
        /* Create the DOM element that will contain the control. The leaflet-control-template
         * CSS class is defined in the LeafletSimpleSlider.css file.
         */
        this._initLayout();
        // Continue implementing the control here.

        /* The onAdd function must return the DOM element that contains the plugin
         * control. Leaflet will add this element to the map.
         */
        return this._container;
    },


    /** Create control UI */
    _initLayout: function () {

        // Toggle open button
        this._container = L.DomUtil.create('div', 'leaflet-truestory-openner leaflet-bar ');
        this._toggle = L.DomUtil.create('a', 'toggle toggleimg');
        this._toggle.setAttribute('title',this.options.toggleLabel);
        L.DomEvent.disableClickPropagation(this._container);
        L.DomEvent.disableScrollPropagation(this._container);
        this._container.appendChild(this._toggle);
        if (this.options.toggle !== true) {
            this._container.style.display = 'none';
        }

        // Story container
        this._storyContainer = document.createElement('div');
        this._storyContainer.style.display = 'none';
        this._map._container.appendChild(this._storyContainer);
        if (this.options.id) {
            this._storyContainer.setAttribute('id',this.options.id);
        }
        this._storyContainer.classList.add('leaflet-truestory');
        switch (this.options.mode) {
            case 'left':
                this._storyContainer.classList.add('leaflet-truestory-modeleft');
                break;
            case 'right':
                this._storyContainer.classList.add('leaflet-truestory-moderight');
                break;
            default:
                this._storyContainer.classList.add('leaflet-truestory-modecenter');
                break;
        }
        this._storyContainer.style.background = this.options.background;
        if (this.options.interactThrough !== true) {
            L.DomEvent.disableClickPropagation(this._storyContainer);
            L.DomEvent.disableScrollPropagation(this._storyContainer);
        }

        // Stories
        if (Object.prototype.toString.call(this.options.stories) === '[object Array]') {
            this.options.stories.forEach(story_options => {
                let story_elem = this._createStory(story_options);
                this._storyContainer.appendChild(story_elem);
                let spacer_elem = document.createElement('div');
                spacer_elem.style.height = this.options.spacer;
                this._storyContainer.appendChild(spacer_elem);
                story_options.element = story_elem;
            });
        }

        this._postInit();
    },


    /** Create a story HTML Element and return it
     * @param {Object} story_options A story options
    */
    _createStory: function (story_options) {
        story = {...this.defaultStoryOptions, ...story_options};

        // Container
        let storyContainer = document.createElement('div');
        storyContainer.setAttribute('id',story.id);
        switch (story.align) {
            case 'left':
                storyContainer.classList.add('truestory-container-left');
                break;
            case 'right':
                storyContainer.classList.add('truestory-container-right');
                break;
            default:
                storyContainer.classList.add('truestory-container-center');
                break;
        }
        let storyElement = document.createElement('div');
        storyContainer.appendChild(storyElement);
        storyElement.classList.add('leaflet-truestory-story');
        storyElement.style.width = story.width;

        // Title
        if (story.title) {
            let titleContainer = document.createElement('div');
            storyElement.appendChild(titleContainer);
            titleContainer.classList.add('leaflet-truestory-title');
            if (story.title instanceof HTMLElement) { // Element
                titleContainer.appendChild(story.title);
            } else { // String
                titleContainer.innerHTML = story.title;
            }
        }

        // Content
        let contentContainer = document.createElement('div');
        storyElement.appendChild(contentContainer);
        contentContainer.classList.add('leaflet-truestory-content');
        if (story.content instanceof HTMLElement) { // Element
            contentContainer.appendChild(story.content);
        } else { // String
            contentContainer.innerHTML = story.content;
        }

        return storyContainer;
    },


    /** Update the control content */
    _postInit: function () {
        // Toggle open button
        this._toggle.addEventListener('click', ()=>{
            if (this._storyContainer.style.display == 'none') {
                this._expand();
            } else {
                this._collapse();
            }
        });

        // Story container
        if (this.options.collapsed !== true) {
            this._expand();
        }

        // Story callback on scroll
        var scroll_timeout = null;
        this._last_story = this.options.stories[0]
        this._storyContainer.addEventListener('scroll', (e) => {
            clearTimeout(scroll_timeout);
            scroll_timeout = setTimeout(() => {
                // search first visible story
                for (let i = 0; i < this.options.stories.length; i++) {
                    if (this._isStoryVisible(this.options.stories[i].element, e.target)) {
                        story_visible = this.options.stories[i];
                        break;
                    }
                }
                if (this._last_story && (this._last_story.element == story_visible.element)) {
                    return; // same story as before scroll
                } else {
                    this._last_story = story_visible;
                }
                if (typeof story_visible.callback == 'function') {
                    story_visible.callback(story_visible);
                }
            }, 250);
        }, {
            passive:true
        });
        // init first story callback
        if (typeof this.options.stories[0].callback == 'function') {
            this.options.stories[0].callback(this.options.stories[0]);
        }

    },


    /** Expand Storymap */
    _expand: function() {
        // console.log('_expand');
        this._storyContainer.style.display = null;
        if (this.options.autoshift === true && (this.options.mode == 'left' || this.options.mode == 'right')) {
            // let size = this._map.getSize().x;
            let size = window.innerWidth;
            if (this.options.mode == 'left') {
                if (size > 640) {
                    this._shiftMap('right', 15);
                } else {
                    this._shiftMap('top', 20);
                }
            } else if (this.options.mode == 'right') {
                if (size > 640) {
                    this._shiftMap('left', 15);
                } else {
                    this._shiftMap('top', 20);
                }
            }
        }
    },


    /** Collapse Storymap */
    _collapse: function() {
        // console.log('_collapse');
        this._storyContainer.style.display = 'none';
        if (this.options.autoshift === true && (this.options.mode == 'left' || this.options.mode == 'right')) {
            // let size = this._map.getSize().x;
            let size = window.innerWidth;
            if (this.options.mode == 'left') {
                if (size > 640) {
                    this._unshiftMap('right', 15);
                } else {
                    this._unshiftMap('top', 20);
                }
            } else if (this.options.mode == 'right') {
                if (size > 640) {
                    this._unshiftMap('left', 15);
                } else {
                    this._unshiftMap('top', 20);
                }
            }
        }
    },


    /** Shift map away from the specified side
     * @param {String} direction Which direction the map sould offset to
     * @param {Number} shiftPercent Percentage of the map to shift between 0 and 100, default: 15
     */
    _shiftMap: function(direction, shiftPercent) {
        // console.log('_shiftMap');
        shiftPercent = (shiftPercent) ? (shiftPercent / 100) : 0.15 ;
        let multiplier_h = 0;
        let multiplier_v = 0;
        switch (direction) {
            case 'left':
                multiplier_h = 1;
                break;
            case 'right':
                multiplier_h = -1;
                break;
            case 'top':
                multiplier_v = 1;
                break;
            case 'bottom':
                multiplier_v = -1;
                break;
            default:
                break;
        }
        let offset_h = (map.getSize().x * shiftPercent) * multiplier_h;
        let offset_v = (map.getSize().y * shiftPercent) * multiplier_v;
        map.panBy(new L.Point(offset_h, offset_v), {animate:false}); // Shift map center
    },


    /** Unshift map from the specified side
     * @param {String} direction From which direction the map has been offset
     * @param {Number} shiftPercent Percentage of the map to shift between 0 and 100, default: 15
     */
    _unshiftMap: function(direction, shiftPercent) {
        // console.log('_unshiftMap');
        shiftPercent = (shiftPercent) ? (shiftPercent / 100) : 0.15 ;
        let multiplier_h = 0;
        let multiplier_v = 0;
        switch (direction) {
            case 'left':
                multiplier_h = -1;
                break;
            case 'right':
                multiplier_h = 1;
                break;
            case 'top':
                multiplier_v = -1;
                break;
            case 'bottom':
                multiplier_v = 1;
                break;
            default:
                break;
        }
        let offset_h = (map.getSize().x * shiftPercent) * multiplier_h;
        let offset_v = (map.getSize().y * shiftPercent) * multiplier_v;
        map.panBy(new L.Point(offset_h, offset_v), {animate:false}); // Shift map center
    },


    /** Detecte si l'élément est visible ou non
     * @param {HTMLElement} element element à vérifier
     * @param {HTMLElement} container contenneur de l'élément à vérifier
     * @returns {Boolean} True => visible, False => invisible
     */
    _isStoryVisible: function(element, container) {
        const element_bounds = element.getBoundingClientRect();
        const container_bounds = container.getBoundingClientRect();
        // console.log('element_bounds =',element_bounds,' container_bounds =',container_bounds);
        return ((element_bounds.top >= container_bounds.top) && (element_bounds.top < (container_bounds.height+container_bounds.top)));
    },


    /* Leaflet calls the onRemove function when a control is removed from the map:
     * control.removeFrom(map);
     * map.removeControl(control);
     */
    onRemove: function (map) {
        this._container.remove();
        this._storyContainer.remove();
    },


});

/* The standard Leaflet plugin creation pattern is to implement a factory function that
 * enables the creation of the plugin to be chained with other function calls:
 * L.leafletTrueStory().addTo(map);
 * The common convention is to name the factory function after the class of the control
 * plugin but make the first letter lower case.
 */
L.leafletTrueStory = function (options) {
    return new L.LeafletTrueStory(options);
};
