function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// DELIVERABLE 1: BAR CHART 
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // D3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];


    // D3: 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = metadataArray[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // D3: 3. Create a variable that holds the washing frequency.
    var wfreqFloat = parseFloat(metadataResult.wfreq) * 1.0;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    otu_ids_sorted = otu_ids.slice(0,10).reverse();
    var yticks = otu_ids_sorted.map(otu_ids => "OTU" + otu_ids);
    console.log(otu_ids_sorted);
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: 'bar',
      hovertext: otu_labels,
      orientation: 'h',
    };
    
    var barData = [barTrace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "<b>Top 10 Bacteria Cultures Found</b>",
     margin: {t:30, b:30},
     bg_colour: "black",
     paper_bgcolor:"black",
     font: {color: "white"}
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // DELIVERABLE 2: BUBBLE CHART 
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      type: "bubble",
      mode: "markers",
      hovertext: otu_labels,
      marker: {
        size: sample_values.map(value => value * 0.90),
        color: otu_ids,
        colorscale: "Earth"
      }
    }
    
    var bubbleData = [bubbleTrace];
   
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "<b>Bacteria Cultures per Sample</b>",
        xaxis: {title: "OTU ID"},
        margins: "autoexpand",
        paper_bgcolor: "black",
        font: {color:"white"}
    };
  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
 

    // DELIVERABLE 3: GAUGE CHART
    // 4. Create the trace for the gauge chart.
    // Filter the data with the selected number.
    var gaugeTrace = {
      value: wfreqFloat,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {visible: true, range: [0,10], tickmode: "array"},
        bar: {color:"black"},
        steps: [
          {range:[0,2], color:"red"},
          {range:[2,4], color: "orange"},
          {range: [4,6], color:"yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"}
        ]
      }
    }
      
    var gaugeData = [gaugeTrace];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 500,
     height: 400,
     margin: {t:50, b:0},
     paper_bgcolor: "black",
     font: {color: "white"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
