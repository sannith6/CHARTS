looker.plugins.visualizations.add({
  create: function(element, config) {
	  element.innerHTML = `
      <style>
			#container {
			  width: 70%;
			  display: inline-block;
			}

			@media (max-width: 576px) {
			  #container {
				width: 100%;
				display: block;
			  }
			}

   </style>


	`;

	var chartContainer = element.appendChild(document.createElement("div"));
	chartContainer.className = 'chart-container';
	chartContainer.id = 'chartContainer';
	
  },
  
   updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
    // Clear any errors from previous updates:
    this.clearErrors();
	
 

	
		
		var view = `
					   <div class="container max-width-lg cd-timeline__container">
      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--picture">
          <img src="assets/img/cd-icon-picture.svg" alt="Picture">
        </div> <!-- cd-timeline__img -->

        <div class="cd-timeline__content text-component">
          <h2>Title of section 1</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Jan 14</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div> <!-- cd-timeline__content -->
      </div> <!-- cd-timeline__block -->

      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--movie">
          <img src="assets/img/cd-icon-movie.svg" alt="Movie">
        </div> <!-- cd-timeline__img -->

        <div class="cd-timeline__content text-component">
          <h2>Title of section 2</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?</p>
          
          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Jan 18</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div> <!-- cd-timeline__content -->
      </div> <!-- cd-timeline__block -->

      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--picture">
          <img src="assets/img/cd-icon-picture.svg" alt="Picture">
        </div> <!-- cd-timeline__img -->

        <div class="cd-timeline__content text-component">
          <h2>Title of section 3</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi, obcaecati, quisquam id molestias eaque asperiores voluptatibus cupiditate error assumenda delectus odit similique earum voluptatem doloremque dolorem ipsam quae rerum quis. Odit, itaque, deserunt corporis vero ipsum nisi eius odio natus ullam provident pariatur temporibus quia eos repellat consequuntur perferendis enim amet quae quasi repudiandae sed quod veniam dolore possimus rem voluptatum eveniet eligendi quis fugiat aliquam sunt similique aut adipisci.</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Jan 24</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div> <!-- cd-timeline__content -->
      </div> <!-- cd-timeline__block -->

      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--location">
          <img src="assets/img/cd-icon-location.svg" alt="Location">
        </div> <!-- cd-timeline__img -->

        <div class="cd-timeline__content text-component">
          <h2>Title of section 4</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Feb 14</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div> <!-- cd-timeline__content -->
      </div> <!-- cd-timeline__block -->

      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--location">
          <img src="assets/img/cd-icon-location.svg" alt="Location">
        </div> <!-- cd-timeline__img -->

        <div class="cd-timeline__content text-component">
          <h2>Title of section 5</h2>
          <p class="color-contrast-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum.</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Feb 18</span>
            <a href="#0" class="btn btn--subtle">Read more</a>
          </div>
        </div> <!-- cd-timeline__content -->
      </div> <!-- cd-timeline__block -->

      <div class="cd-timeline__block">
        <div class="cd-timeline__img cd-timeline__img--movie">
          <img src="assets/img/cd-icon-movie.svg" alt="Movie">
        </div> <!-- cd-timeline__img -->

        <div class="cd-timeline__content text-component">
          <h2>Final Section</h2>
          <p class="color-contrast-medium">This is the content of the last section</p>

          <div class="flex justify-between items-center">
            <span class="cd-timeline__date">Feb 26</span>
          </div>
        </div> <!-- cd-timeline__content -->
      </div> <!-- cd-timeline__block -->
    </div>
	`

		chartContainer.innerHTML = view

	(function(){
  // Vertical Timeline - by CodyHouse.co
	function VerticalTimeline( element ) {
		this.element = element;
		this.blocks = this.element.getElementsByClassName("cd-timeline__block");
		this.images = this.element.getElementsByClassName("cd-timeline__img");
		this.contents = this.element.getElementsByClassName("cd-timeline__content");
		this.offset = 0.8;
		this.hideBlocks();
	};

	VerticalTimeline.prototype.hideBlocks = function() {
		if ( !"classList" in document.documentElement ) {
			return; // no animation on older browsers
		}
		//hide timeline blocks which are outside the viewport
		var self = this;
		for( var i = 0; i < this.blocks.length; i++) {
			(function(i){
				if( self.blocks[i].getBoundingClientRect().top > window.innerHeight*self.offset ) {
					self.images[i].classList.add("cd-timeline__img--hidden"); 
					self.contents[i].classList.add("cd-timeline__content--hidden"); 
				}
			})(i);
		}
	};

	VerticalTimeline.prototype.showBlocks = function() {
		if ( ! "classList" in document.documentElement ) {
			return;
		}
		var self = this;
		for( var i = 0; i < this.blocks.length; i++) {
			(function(i){
				if( self.contents[i].classList.contains("cd-timeline__content--hidden") && self.blocks[i].getBoundingClientRect().top <= window.innerHeight*self.offset ) {
					// add bounce-in animation
					self.images[i].classList.add("cd-timeline__img--bounce-in");
					self.contents[i].classList.add("cd-timeline__content--bounce-in");
					self.images[i].classList.remove("cd-timeline__img--hidden");
					self.contents[i].classList.remove("cd-timeline__content--hidden");
				}
			})(i);
		}
	};

	var verticalTimelines = document.getElementsByClassName("js-cd-timeline"),
		verticalTimelinesArray = [],
		scrolling = false;
	if( verticalTimelines.length > 0 ) {
		for( var i = 0; i < verticalTimelines.length; i++) {
			(function(i){
				verticalTimelinesArray.push(new VerticalTimeline(verticalTimelines[i]));
			})(i);
		}

		//show timeline blocks on scrolling
		window.addEventListener("scroll", function(event) {
			if( !scrolling ) {
				scrolling = true;
				(!window.requestAnimationFrame) ? setTimeout(checkTimelineScroll, 250) : window.requestAnimationFrame(checkTimelineScroll);
			}
		});
	}

	function checkTimelineScroll() {
		verticalTimelinesArray.forEach(function(timeline){
			timeline.showBlocks();
		});
		scrolling = false;
	};
})();



		}
})
