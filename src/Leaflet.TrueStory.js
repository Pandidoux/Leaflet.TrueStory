/* Leaflet control plugins inherit from Leaflet's Control class. */
L.LeafletTrueStory = L.Control.extend({
    options: {
        id: null, // Storymap container HTML id
        mode: 'full', // Story display mode: "full"|"left"|"right"|"top"|"bottom"
        miniMode: 'bottom', // Display mode on mobile: "full"|"left"|"right"|"top"|"bottom"
        padding: '10px', // CSS padding property between the stories and the edges of the map
        background: 'transparent', // Background css property of the stories container
        interactThrough: false, // Allow interactions with the map through the storymap background
        control: false, // Show a control button
        controlLabel: 'Toggle storymap', // Label of the storymap control button
        position: 'topleft', // Control button position
        collapsed: false, // Should storymap be collapsed on init (when control: true)
        spacer: '200px', // Padding bottom space between each stories
        autoshift: true, // Automaticaly shift the map to the side when mode is right or left
        borderRadius: '20px', // Border radius of stories blocs
        blured: false, // Blur the limits between the map and the storymap background
        stories: [], // Array of stories properties described in the dedicated section
    },
    defaultStoryOptions: {
        id: null, // Define a HTML id for the story bloc
        title: null, // Story title (text or HTML element)
        content: null, // Story content (text or HTML element)
        width: '100%', // Story css width property
        align: 'center', // Align story to the "center"|"left"|"right"
        background: '#FFF', // Story bloc background css property
        shadow: true, // Show a shadow on the story bloc
        callback: null, // Function called when the story is visible
    },


    /* Leaflet calls the initialize function when an instance of the plugin
     * control is created with a call to new.
     */
    initialize: function (options) {
        // Combine the control plugin's default options with those passed in as the parameter
        L.Util.setOptions(this, options);
    },


    /* Called by Leaflet when the control is added to the map */
    onAdd: function (map) {
        this._initLayout(); // Create the DOM element that will contain the control.
        return this._container;
    },


    /** Create control UI */
    _initLayout: function () {
        // Toggle open button
        this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-truestory-openner');
        this._oppener = document.createElement('a');
        this._oppener.setAttribute('title', this.options.controlLabel);
        L.DomEvent.disableClickPropagation(this._container);
        L.DomEvent.disableScrollPropagation(this._container);
        this._container.appendChild(this._oppener);
        if (this.options.control !== true) {
            this._container.style.display = 'none';
        }

        // Story container
        this._storyContainer = document.createElement('div');
        this._storyContainer.style.display = 'none';
        this._map._container.appendChild(this._storyContainer);
        if (this.options.id) {
            this._storyContainer.setAttribute('id', this.options.id);
        }
        this._storyContainer.classList.add('leaflet-truestory');
        this._setClassList();
        this._storyContainer.style.background = this.options.background;
        // Disable map interaction through all storymap surface
        if (this.options.interactThrough !== true) {
            L.DomEvent.disableClickPropagation(this._storyContainer);
            L.DomEvent.disableScrollPropagation(this._storyContainer);
        }
        this._storyContainer.style.boxShadow = (this.options.blured === true) ? `0 0 5px 5px ${this.options.background}` : null;
        this._storyContainer.style.padding = this.options.padding;

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
        story = { ...this.defaultStoryOptions, ...story_options };

        // Container
        let storyContainer = document.createElement('div');
        storyContainer.setAttribute('id', story.id);
        switch (story.align) {
            case 'left':
                storyContainer.classList.add('leaflet-truestory-containerleft');
                break;
            case 'right':
                storyContainer.classList.add('leaflet-truestory-containerright');
                break;
            default:
                storyContainer.classList.add('leaflet-truestory-containercenter');
                break;
        }
        let storyBloc = document.createElement('div');
        storyContainer.appendChild(storyBloc);
        storyBloc.classList.add('leaflet-truestory-storybloc');
        storyBloc.style.width = story.width;
        storyBloc.style.borderRadius = this.options.borderRadius;
        storyBloc.style.background = story.background;
        storyBloc.style.boxShadow = (story.shadow === true) ? '0 2px 4px 0 rgba(34, 36, 38, .12), 0 2px 10px 0 rgba(34, 36, 38, .15)' : null;
        // Disable map interaction only through the storyBloc
        if (this.options.interactThrough === true) {
            L.DomEvent.disableClickPropagation(storyBloc);
            L.DomEvent.disableScrollPropagation(storyBloc);
        }

        // Title
        if (story.title) {
            let titleContainer = document.createElement('div');
            storyBloc.appendChild(titleContainer);
            if (story.title instanceof HTMLElement) { // title => Element
                titleContainer.appendChild(story.title);
            } else { // title => String
                titleContainer.innerHTML = story.title;
                titleContainer.classList.add('leaflet-truestory-title');
            }
        }

        // Content
        let contentContainer = document.createElement('div');
        storyBloc.appendChild(contentContainer);
        contentContainer.classList.add('leaflet-truestory-content');
        if (story.content instanceof HTMLElement) { // content => Element
            contentContainer.appendChild(story.content);
        } else { // content => String
            contentContainer.innerHTML = story.content;
        }

        return storyContainer;
    },


    /** Update the control content */
    _postInit: function () {
        // Toggle open button
        this._oppener.addEventListener('click', () => {
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
        this._last_story = this.options.stories[0];
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
            passive: true
        });

        if (['left','right','top','bottom'].includes(this.options.mode)) { // not center
            this._map.on('resize', (e) => {
                if (e.oldSize.x <= 640 && e.newSize.x > 640 || e.oldSize.x > 640 && e.newSize.x <= 640) { // size increase or decrease
                    this._setClassList();
                }
            });
        }

        // init first story callback
        if (typeof this.options.stories[0].callback == 'function') {
            this.options.stories[0].callback(this.options.stories[0]);
        }

    },


    /** Set storymap's container class list */
    _setClassList: function() {
        // console.log('_setClassList');
        const mapSize = this._map.getSize();
        this._storyContainer.classList.remove('leaflet-truestory-modeleft','leaflet-truestory-moderight','leaflet-truestory-modetop','leaflet-truestory-modebottom','leaflet-truestory-modecenter');
        if (mapSize.x > 640) { // normal width
            switch (this.options.mode) {
                case 'left':
                    this._storyContainer.classList.add('leaflet-truestory-modeleft');
                    break;
                case 'right':
                    this._storyContainer.classList.add('leaflet-truestory-moderight');
                    break;
                case 'top':
                    this._storyContainer.classList.add('leaflet-truestory-modetop');
                    break;
                case 'bottom':
                    this._storyContainer.classList.add('leaflet-truestory-modebottom');
                    break;
                default:
                    this._storyContainer.classList.add('leaflet-truestory-modecenter');
                    break;
            }
        } else { // small width
            switch (this.options.miniMode) {
                case 'left':
                    this._storyContainer.classList.add('leaflet-truestory-modeleft');
                    break;
                case 'right':
                    this._storyContainer.classList.add('leaflet-truestory-moderight');
                    break;
                case 'top':
                    this._storyContainer.classList.add('leaflet-truestory-modetop');
                    break;
                case 'bottom':
                    this._storyContainer.classList.add('leaflet-truestory-modebottom');
                    break;
                default:
                    this._storyContainer.classList.add('leaflet-truestory-modecenter');
                    break;
            }
        }
    },


    /** Expand Storymap */
    _expand: function () {
        this._storyContainer.style.display = null;
        if (this.options.autoshift === true && (this.options.mode === 'left' || this.options.mode === 'right')) {
            let size = window.innerWidth;
            if (this.options.mode === 'left') {
                if (size > 640) {
                    this._shiftMap('right', 15);
                } else {
                    this._shiftMap('top', 20);
                }
            } else if (this.options.mode === 'right') {
                if (size > 640) {
                    this._shiftMap('left', 15);
                } else {
                    this._shiftMap('top', 20);
                }
            }
        }
    },


    /** Collapse Storymap */
    _collapse: function () {
        this._storyContainer.style.display = 'none';
        if (this.options.autoshift === true && (this.options.mode === 'left' || this.options.mode === 'right')) {
            let size = window.innerWidth;
            if (this.options.mode === 'left') {
                if (size > 640) {
                    this._unshiftMap('right', 15);
                } else {
                    this._unshiftMap('top', 20);
                }
            } else if (this.options.mode === 'right') {
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
    _shiftMap: function (direction, shiftPercent) {
        shiftPercent = (shiftPercent) ? (shiftPercent / 100) : 0.15;
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
        let offset_h = (this._map.getSize().x * shiftPercent) * multiplier_h;
        let offset_v = (this._map.getSize().y * shiftPercent) * multiplier_v;
        this._map.panBy(new L.Point(offset_h, offset_v), { animate: false }); // Shift map center
    },


    /** Unshift map from the specified side
     * @param {String} direction From which direction the map has been offset
     * @param {Number} shiftPercent Percentage of the map to shift between 0 and 100, default: 15
     */
    _unshiftMap: function (direction, shiftPercent) {
        shiftPercent = (shiftPercent) ? (shiftPercent / 100) : 0.15;
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
        let offset_h = (this._map.getSize().x * shiftPercent) * multiplier_h;
        let offset_v = (this._map.getSize().y * shiftPercent) * multiplier_v;
        this._map.panBy(new L.Point(offset_h, offset_v), { animate: false }); // Shift map center
    },


    /** Detect if element is visible or not
     * @param {HTMLElement} element element to verify
     * @param {HTMLElement} container element's container
     * @returns {Boolean} True => visible, False => not visible
     */
    _isStoryVisible: function (element, container) {
        const element_bounds = element.getBoundingClientRect();
        const container_bounds = container.getBoundingClientRect();
        return ((element_bounds.top >= container_bounds.top) && (element_bounds.top < (container_bounds.height + container_bounds.top)));
    },


    /* Leaflet calls the onRemove function when a control is removed from the map */
    onRemove: function (map) {
        if (this._storyContainer.style.display != 'none') {
            this._collapse();
        }
        this._container.remove();
        this._storyContainer.remove();
    },


});


/* Factory function */
L.leafletTrueStory = function (options) {
    return new L.LeafletTrueStory(options);
};
