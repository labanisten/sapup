(function() {
var timeline = null;
var data = [];

google.load("visualization", "1");

// Set callback to run when API is loaded
google.setOnLoadCallback(drawVisualization); 

// Called when the Visualization API is loaded.
function drawVisualization() {

  // Instantiate our timeline object.
  timeline = new links.Timeline(document.getElementById('mytimeline'));
          
  addData();

  // specify options
  options = {
    width:  "100%", 
    //height: "auto",
    //minHeight: 50, // pixels
    //height: "300px",
    //layout: "box",
    start: new Date(),
    end: new Date(2012, 6, 30),
    editable: true,
    animate: true,
    animateZoom:true,
    eventMargin: 10,  // minimal margin between events 
    eventMarginAxis: 5, // minimal margin beteen events and the axis
    showMajorLabels: true,
    showCustomTime: true,
    showNavigation: false,
    axisOnTop: true,
    snapEvents: true,
    dragAreaWidth: 40,
    step:10,
    scale: links.Timeline.StepDate.SCALE.DAY,
    //groupsWidth : "100px",
    groupsOnRight: false
  };

  // Draw our timeline with the created data and options 
  timeline.draw(data, options);
  
  google.visualization.events.addListener(timeline, 'select', 
    function () {
      //console.log('select', timeline.getSelection()[0]);
    }        
  );

  google.visualization.events.addListener(timeline, 'edit', 
    function() {
      //console.log('edit')
    }
  );

  google.visualization.events.addListener(timeline, 'change', 
    function() {
      //console.log('change')
      //timeline.cancelChange();
    }
  );

  google.visualization.events.addListener(timeline, 'add', 
    function() {
      console.log('add')
      //timeline.cancelAdd();
    }
  );
  
}


function addData() {
  data = [
            {
              'start': new Date(2012, 3, 5),
              'end': new Date(2012, 3, 8),  // end is optional
              'content': '<div class="Available"/>',
              'group': "P03"
            },
            {
              'start': new Date(2012, 3, 8),
              'end': new Date(2012, 3, 15),  // end is optional
              'content': '<div class="Available"/>',
              'group': "P03"
            },
            {
              'start': new Date(2012, 3, 16),
              'end': new Date(2012, 4, 1),  // end is optional
              'content': '<div class="Unavailable"/>',
              'group': "P03"
            },
            {
              'start': new Date(2012, 3, 5),
              'end': new Date(2012, 3, 8),  // end is optional
              'content': '<div class="Available"/>',
              'group': "P04"
            },
            {
              'start': new Date(2012, 3, 5),
              'end': new Date(2012, 3, 8),  // end is optional
              'content': '<div class="Unavailable"/>',
              'group': "P07"
            },

            {
              'start': new Date(2012, 3, 5),
              'end': new Date(2012, 3, 8),  // end is optional
              'content': '<div class="Available"/>',
              'group': "D03"
            },
            {
              'start': new Date(2012, 3, 8),
              'end': new Date(2012, 3, 15),  // end is optional
              'content': '<div class="Available"/>',
              'group': "D03"
            },
            {
              'start': new Date(2012, 3, 16),
              'end': new Date(2012, 4, 1),  // end is optional
              'content': '<div class="Unavailable"/>',
              'group': "D03"
            },
            {
              'start': new Date(2012, 3, 5),
              'end': new Date(2012, 3, 8),  // end is optional
              'content': '<div class="Available"/>',
              'group': "D04"
            },
            {
              'start': new Date(2012, 3, 6),
              'end': new Date(2012, 3, 15),  // end is optional
              'content': '<div class="Unavailable"/>',
              'group': "D07"
            }
          ];
}})()