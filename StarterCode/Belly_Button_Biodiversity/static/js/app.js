
function DrawBargraph(sampleId) {
    console.log(`Calling DrawBargraph (${sampleId})`);

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray = samples.filter(s => s.id == sampleId);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

        var barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h"
        }

        barArray = [barData];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", barArray, barLayout);

    });
}

function DrawBubblechart(sampleId) {
    console.log(`Calling DrawBubblechart (${sampleId})`);
    
    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray = samples.filter(s => s.id == sampleId);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,
            }
        }

        bubbleArray = [bubbleData];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample", 
            showlegend: false, 
            margin: {t: 30, l: 150}, 
            xaxis: {title: {text: "OTU ID"}}
        };

        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);
    });
}

function ShowMetadata(sampleId) {
    console.log(`Calling ShowMetadata (${sampleId})`);

    d3.json("samples.json").then((data) => {

        var metadata = data.metadata;
        var resultArray = metadata.filter(md => md.id ==sampleId);
        var result = resultArray[0];

        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            var textToShow = (`${key}: ${value}`);
            PANEL.append("h6").text(textToShow);
        })
    });
}

function DrawGauge(sampleId){
    console.log(`Calling DrawGauge(${sampleId})`);

    d3.json("samples.json").then((data) => {

        var metadata = data.metadata;
        var resultArray = metadata.filter(md => md.id == sampleId);
        var result = resultArray[0];

        var wfreq = result.wfreq;
        console.log (`(${sampleId}) washes their hands ${wfreq} per week.`)

        var gaugeData = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: wfreq,
              title: { text: "Weekly Washing Frequency", font: { size: 24 } },
              gauge: {
                axis: { range: [null, 9]},
                bar: {color: "gray"},
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: "hsl 120, 100%, 95%"},
                  { range: [1, 2], color: "hsl 120, 100%, 85%" },
                  { range: [2, 3], color: "hsl 120, 100%, 75%" },
                  { range: [3, 4], color: "hsl 120, 100%, 65%" },
                  { range: [4, 5], color: "hsl 120, 100%, 55%" },
                  { range: [5, 6], color: "hsl 120, 100%, 45%" },
                  { range: [6, 7], color: "hsl 120, 100%, 35%" },
                  { range: [7, 8], color: "hsl 120, 100%, 25%" },
                  { range: [8, 9], color: "hsl 120, 100%, 15%" }
                ],
              }
            }
          ];

        var gaugeLayout = {
            margin: {t: 0, b: 0}
        };

        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}

function optionChanged(newSampleId) {

    console.log(`User Selected ${newSampleId}`);

    DrawBubblechart(newSampleId);
    DrawBargraph(newSampleId);
    ShowMetadata(newSampleId);
    DrawGauge(newSampleId);

}


function InitDashboard() {
    
    console.log ("Initializing Dashboard");

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {

        console.log(data);

        var sampleNames = data.names;

        sampleNames.forEach((sampleId) => {
            selector.append("option")
                .text(sampleId)
                .property("value", sampleId);
        });

        var sampleId = sampleNames[0];

        DrawBargraph(sampleId);
        DrawBubblechart(sampleId);
        DrawGauge(sampleId);
        ShowMetadata(sampleId);

    });

}

InitDashboard();