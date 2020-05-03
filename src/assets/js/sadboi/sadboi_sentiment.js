import * as d3 from "d3";
import ScrollMagic from 'scrollmagic';
import sentiment from "data/sadboi/sentiment.json";

var controller = new ScrollMagic.Controller();


function sentimentHistogram(data, elementId, bins) {

    
    var width = 500;
    var height = 500;  
    
    var margin = ({
        top: 20,
        right: 20,
        bottom: 30,
        left: 30
    })

    var color = d3.scaleSequential(d3.interpolateMagma);


    var canvas = d3.select(elementId)
        .append("svg")
        .attr("viewBox", "0 0 500 500")
        .attr("preserveAspectRatio", "xMinYMin meet")

    var histogram = d3.histogram()
        .thresholds(bins ? bins : d3.thresholdFreedmanDiaconis)
        (data)


    var x = d3.scaleLinear()
      .domain([-0.5, 0.5])
      .nice()
      .range([margin.left + 20, width - margin.right]);

    var y = d3.scaleLinear()
      .domain([0, d3.max(histogram, d => d.length)])
      .nice()
      .range([height - margin.bottom, margin.top]);


    var xAxis = g => g
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.append("text")
            .attr("x", width - margin.right)
            .attr("y", -4)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end"))
            // .text(data.x))

    var yAxis = g => g
        .attr("transform", `translate(${margin.left + 20}, 0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 5)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold"))

    var _xAxis = canvas.append("g").call(xAxis);
    var _yAxis = canvas.append("g").call(yAxis);

    
    var xAxisLabel = canvas.append("text")
    .attr("transform", `translate(${width / 2}, ${height})`)
    .style("fill", "black")
    .style("text-anchor", "middle")
    .text("Sentiment")
    
    var yAxisLabel = canvas.append("text")
    .attr("transform", `translate(${margin.left - 10}, ${height / 2}) rotate(270)`)
    .style("fill", "black")
    .style("text-anchor", "middle")
    .text("Count")
    
    var bars = canvas.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(histogram)
        .enter().append("rect")
            .attr("x", d => x(d.x0)+1)
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", d => y(0))
            .style("fill", function(d, i){
                return color(d.x0 + 0.5);
            })

    var scene = new ScrollMagic.Scene({
        triggerElement: "#histogramTrigger",
        triggerHook: 0.1,
        duration: height
    }).on("start", function(){
        d3.selectAll("rect")
            .transition()
            .duration(200)
            .ease(d3.easeLinear)
            .attr("y", d => y(d.length))
            .attr("height", d => y(0) - y(d.length))
    })
    .addTo(controller);
}

var unweightedData = Object.keys(sentiment).map(function(i){ return sentiment[i].sentiment});
var unweightedHistogram = sentimentHistogram(unweightedData, "#histogram");

