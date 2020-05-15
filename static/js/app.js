// Use D3 to read the JSON file
d3.json("data/samples.json").then((bbData) => {
  window.bbData = bbData;
  console.log(bbData);


  var data = bbData;

// ====================================================================
// CODE FOR POPULATING THE DROPDOWN BOX
// ====================================================================

var dropdownBox = data.names;
for (var i = 0; i < dropdownBox.length; i++) {
  selectBox = d3.select("#selDataset");
  selectBox.append("option").text(dropdownBox[i]);
}

// ====================================================================
// CODE FOR SETTING UP THE DEFAULT CHARTS WHEN THE WEBPAGE IS LAUNCHED
// ====================================================================

  // Set up default plot
  updatePlots(0)

  // Function for updating plots   
  function updatePlots(index) 
  {

    // Set up arrays for horizontal bar chart & gauge chart
    var otuIDs = data.samples[index].otu_ids;
    console.log(otuIDs);
    var sampleValues = data.samples[index].sample_values;
    console.log(sampleValues);
    var otuLabels = data.samples[index].otu_labels;
    console.log(otuLabels);
    var washFrequency = data.metadata[+index].wfreq;
    console.log(washFrequency);


    // Populate Demographic Data card
    var demographicKeys = Object.keys(data.metadata[index]);
    var demographicValues = Object.values(data.metadata[index])
    var demographicData = d3.select('#sample-metadata');

    // clear demographic data
    demographicData.html("");

    for (var i = 0; i < demographicKeys.length; i++) 
    {
      demographicData.append("p").text(`${demographicKeys[i]}: ${demographicValues[i]}`);
    };


// ====================================================================
// CODE FOR CREATING THE BAR CHART
// ====================================================================
    
    // Slice and reverse data for horizontal bar chart
    var barchartXValues = sampleValues.slice(0, 10).reverse();
    var barchartYValuesPrep = otuIDs.slice(0, 10).reverse();
    var barchartYValues = barchartYValuesPrep.map((otu => "OTU " + otu));
    var barchartHoverText = otuLabels.slice(0, 10).reverse();

    // Set up trace for BAR chart
    var trace1 = 
    {
      x: barchartXValues,
      y: barchartYValues,
      text: barchartHoverText,
      name: "",
      type: "bar",
      orientation: "h"
    };

    // data
    var barData = [trace1];

    // Apply  layout
    var layout = 
    {
      title: "Top 10 OTUs",
      margin: 
      {
        l: 70,
        r: 70,
        t: 60,
        b: 50
      }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", barData, layout);


// ====================================================================
// CODE FOR CREATING THE BUBBLE CHART
// ====================================================================


  // Set up trace for BUBBLE Chart
  trace2 = {
    x: otuIDs,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      color: otuIDs,
      opacity: [1, 0.8, 0.6, 0.4],
      size: sampleValues
    }
  }

  //data
  var bubbleData = [trace2];

  // Apply layout
  var layout = {
    title: 'OTU Frequency',
    showlegend: false,
    height: 600,
    width: 1200
  }

  // Render the plot to the div tag with id "bubble-plot"
  Plotly.newPlot("bubble", bubbleData, layout)



  // ====================================================================
// CODE FOR CREATING THE GAUGE CHART
// ====================================================================

    // Gauge chart

    var trace3 = [{
      domain: {x: [0, 1], y: [0,1]},
      type: "indicator",
      mode: "gauge+number",
      value: washFrequency,
      title: { text: "Belly Button Washing Frequency (Scrubs Per Week)" },
      gauge: {
        axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
        bar: { color: "#FF0000" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "transparent",
        steps: [
          { range: [0, 1], color: "#B0E0E6" },
          { range: [1, 2], color: "#ADD8E6" },
          { range: [2, 3], color: "#87CEFA" },
          { range: [3, 4], color: "#87CEEB" },
          { range: [4, 5], color: "#00BFFF" },
          { range: [5, 6], color: "#1E90FF" },
          { range: [6, 7], color: "#4169E1" },
          { range: [7, 8], color: "#0000FF" },
          { range: [8, 9], color: "#0000CD" }

        ],
      }
    }];

    gaugeData = trace3;

    var layout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 }
    };

    Plotly.newPlot("gauge", gaugeData, layout);

  }



// ====================================================================
// CODE FOR REFRESHING THE WEB PAGE ON USER SELECTION
// ====================================================================

  
  // On button click, call refreshData()
  d3.selectAll("#selDataset").on("change", refreshData);



  function refreshData() 
  {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var personsID = dropdownMenu.property("value");
    console.log(personsID);
    // Initialize an empty array for the person's data
    console.log(data)

    for (var i = 0; i < data.names.length; i++) {
      if (personsID === data.names[i]) {
        updatePlots(i);
        return
      }
    }
  }



});