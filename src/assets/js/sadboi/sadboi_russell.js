import * as d3 from 'd3';
import {TimelineMax, Power4, TweenMax} from 'gsap';
import ScrollMagic from 'scrollmagic';
import "imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap";
import russelData from "data/sadboi/russel_features.json";

//GLOBALS
var controller = new ScrollMagic.Controller();
var graphicTrigger = 'russellTrigger';
var graphicEndTrigger = 'russellEndTrigger';
var dataTrigger = 'dataReveal';
var graphicId = 'russellGraphic';
var axisTrigger = 'axisReveal';
var examplePointTriggers = {
    happy: 'happyReveal',
    sad: 'sadReveal',
    relaxed: 'relaxedReveal',
    angry: 'angryReveal',
}
var quadrantCountTrigger = "quadrantCountReveal";
var quadrantCountClass = "quadrantCount";
var pointClass = "samplePoint";
var quadAvgTrigger = "averageQuadrantsReveal";
var quadAvgClass = "quadrantAverage";
var allAvgTrigger = "allAverageReveal";
var allAvgClass = "allAverageClass";
var width = 500;
var height = 500;



function drawGraphic(data, margin, xScale, xValue, yScale, yValue, colorsMap, elementId) {

    var svg = d3.select("#"+elementId)
        .append("svg")
        .attr("viewBox", "0 0 500 500")
        .attr("preserveAspectRatio", "xMinYMin meet")

    var xAxis = g => g
        .attr("transform", `translate(0, ${height - (height / 2)})`)
        .call(d3.axisBottom(xScale)
            .tickSizeOuter(0)
            .ticks(1)
        )

    var yAxis = g => g
        .attr("transform", `translate(${width / 2}, 0)`)
        .call(d3.axisLeft(yScale)
            .tickSizeOuter(0)
            .ticks(1)
        )

    var xAxisLabel = svg.append("text")
        .attr("transform", `translate(${width / 2 + margin.left*1.5}, ${margin.top*1.5})`)
        .style("fill", "black")
        .style("text-anchor", "middle")
        .attr("class", "axisLabel")
        .attr("opacity", 0)
        .text("Energy")
        
    var yAxisLabel = svg.append("text")
        .attr("transform", `translate(${width - margin.right*2.5}, ${height / 2 - 0.5 * margin.top}) `)
        .style("fill", "black")
        .style("text-anchor", "middle")
        .attr("class", "axisLabel")
        .attr("opacity", 0)
        .text("Valence")
        
        var dots = g => g.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("opacity", 0)
            .attr("r", 2)
            .attr("cx", d => xScale(xValue(d)))
            .attr("cy", d => yScale(yValue(d)))
            .attr("fill", d => colorsMap[d.type]);
        
        var _xAxis = svg.append("g").call(xAxis);
        var _yAxis = svg.append("g").call(yAxis);
        var _dots = svg.append("g").call(dots);
        
        const quadrantCount = [
            {
                valence: 0.75,
                energy: 0.75,
                count: "475",
                type: "happy",
            },
            {
                valence: 0.25,
                energy: 0.25,
                count: "454",
                type: "sad",
            },
            {
                valence: 0.25,
                energy: 0.75,
                count: "486",
                type: "angry",
            }, 
            {
                valence: 0.75,
                energy: 0.25,
                count: "133",
                type: "relaxed",
            }
    ];
    
    svg.selectAll(".quadrantCount")
        .data(quadrantCount)
        .enter()
        .append("text")
        .attr("opacity", 0)
        .attr("class", "quadrantCount")
        .attr("transform", d => `translate(${xScale(xValue(d))}, ${yScale(yValue(d))})`)
        .attr("fill", d => colorsMap[d.type])
        .text( d => d.count)

    const averages = [
        {
            valence: 0.2698845814977972,
            energy: 0.3379588105726869,
            type: "sad"
        },
        {
            valence: 0.6612294736842101,
            energy: 0.6960147368421055,
            type: "happy"
        },
        {
            valence: 0.6486015037593986,
            energy: 0.4062857142857144,
            type: "relaxed"
        },
        {
            valence: 0.3270899176954732,
            energy: 0.6547366255144035,
            type: "angry"
        }
    ]

    svg.selectAll('.' + quadAvgClass)
        .data(averages)
        .enter()
        .append("circle")
        .attr("class", "quadrantAverage")
        .attr("opacity", 0)
        .attr("r", 10)
        .attr("cx", d => xScale(xValue(d)))
        .attr("cy", d => yScale(yValue(d)))
        .attr("fill", d => colorsMap[d.type])  
        
    const allAvg = [{
        energy: 0.5527942543576501,
        valence: 0.44018160103292375,
        type: "angry"
    }]

    svg.selectAll('.' + allAvgClass)
        .data(allAvg)
        .enter()
        .append("circle")
        .attr("class", allAvgClass)
        .attr('opacity', 0)
        .attr('r', 10)
        .attr('cx', d => xScale(xValue(d)))
        .attr('cy', d => yScale(yValue(d)))
        .attr('fill', d => colorsMap[d.type])
}


function setupGraphicAnimation(startTrigger, endTrigger, elementId, ctrl){
    var el = document.getElementById(elementId);
    var startTween = new TimelineMax()
    .from(el, 0.25, {opacity: 0});


    new ScrollMagic.Scene({
        triggerElement: "#" + startTrigger,
        triggerHook: 0.1,
        reverse: true
    })
    .on('start', () => {
        TweenMax.set(el, {zIndex: 999});
    })
    .on('leave', (e) => {
        if (e.scrollDirection == 'REVERSE'){
            TweenMax.set(el, {zIndex: -1})
        }
    })
    .setTween(startTween)
    .addTo(ctrl);

    var endTween = new TimelineMax()
        .to(el, 0.30, {opacity: 0})

    new ScrollMagic.Scene({
        triggerElement: "#" + endTrigger,
        triggerHook: 0.9,
        duration: 0,
        reverse: true
    })
    .on('start', (el) => {
        TweenMax.set(el, {zIndex: -1});
    })
    .setTween(endTween)
    .addTo(ctrl);
}

function setupDataRevealAnimation(data, triggerId, graphicId, pointClass, controller){
    
    const scene = new ScrollMagic.Scene({
        triggerElement: "#" + triggerId,
        triggerHook: 0.15,
        reverse: true,
        duration: '100%'
    })
        .on('start', () => {
            d3.selectAll('.' + pointClass)
                .transition()
                .duration(150)
                .ease(d3.easeLinear)
                .attr("opacity", 0)

            d3.selectAll('.dot')
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("opacity", 1)
        })
        .on('leave', (e) =>{
            if (e.scrollDirection == 'REVERSE'){
                d3.selectAll('.' + pointClass)
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .attr("opacity", 1)
            }

            d3.selectAll('.dot')
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("opacity", 0)
        })
        .addTo(controller);

}

function setupTextAnimation(controller){
    Array.from(document.getElementsByClassName("text-trigger")).forEach(
      element => {
        const tween = new TimelineMax().fromTo(
          element,
          1,
          { yPercent: 10, autoAlpha: 0, scale: 0.9, opacity: 1 },
          { yPercent: 0, autoAlpha: 1, scale: 1, ease: Power4.easeOut }
        );

        const scene = new ScrollMagic.Scene({
          triggerElement: "#" + element.id,
          triggerHook: 0.1,
          duration: "50%"
        })
          .setTween(tween)
          .setPin(element)
          .addTo(controller);
    });
}


function setupPointRevealAnimation(pointTrigger, pointClass, xMap, yMap, oldPoint, curPoint, colorsMap, controller){

    new ScrollMagic.Scene({
        triggerElement: "#" + pointTrigger,
        triggerHook: 0.1,
        reverse: true
    }).on('start', () => {
        d3.select("." + pointClass)
            .transition()
            .duration(250)
            .ease(d3.easeLinear)
            .attr("opacity", 1)
            .attr("cx", xMap(curPoint))
            .attr("cy", yMap(curPoint))
            .attr("r", 10)
            .attr("fill", d => colorsMap[curPoint.type])
    }).on('leave', (event) => {
        d3.select("." + pointClass)
            .transition()
            .duration(250)
            .ease(d3.easeLinear)
            .attr("opacity", 1)
            .attr("cx", xMap(oldPoint))
            .attr("cy", yMap(oldPoint))
            .attr("fill", d => colorsMap[oldPoint.type])
    }).addTo(controller)
}

function setupRussellPointRevealAnimation(graphicId, pointClass, xMap, yMap, colorsMap, controller) {

    
    const neutralPoint = {
        valence: 0.5,
        energy: 0.5,
        type: "neutral"
    };
    
    var point = d3.select("#" + graphicId).select("svg")
        .append("circle")
        .attr("class", pointClass)
        .attr("cx", xMap(neutralPoint))
        .attr("cy", yMap(neutralPoint))
        .attr("opacity", 1)
        .attr("fill", "black")

    const happyPoint = {
        valence: 0.75,
        energy: 0.75,
        type: "happy"
    };

    const sadPoint = {
        valence: 0.25,
        energy: 0.25,
        type: "sad"
    };

    const relaxedPoint = {
        valence: 0.75,
        energy: 0.25,
        type: "relaxed"
    };

    const angryPoint = {
        valence: 0.25,
        energy: 0.75,
        type: "angry"
    };
    
    setupPointRevealAnimation(
        examplePointTriggers.happy, pointClass, 
        xMap, yMap, neutralPoint, happyPoint, colorsMap, controller
    )

    setupPointRevealAnimation(
        examplePointTriggers.sad, pointClass,
        xMap, yMap, happyPoint, sadPoint, colorsMap, controller
    )

    setupPointRevealAnimation(
        examplePointTriggers.angry, pointClass,
        xMap, yMap, sadPoint, angryPoint, colorsMap, controller
    )

    setupPointRevealAnimation(
        examplePointTriggers.relaxed, pointClass,
        xMap, yMap, angryPoint, relaxedPoint, colorsMap, controller
    )

}

function setupAxisLabelRevealAnimation(triggerId, controller){
    const scene = new ScrollMagic.Scene({
        triggerElement: "#" + triggerId,
        triggerHook: 0.15,
        duration: '50%'
    })
        .on('start', () => {
            d3.selectAll('.axisLabel')
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("opacity", 1)
        })
        .on('leave', (e) => {
            if(e.scrollDirection == "REVERSE"){
                d3.selectAll('.axisLabel')
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("opacity", 0)
            }
        })
        .addTo(controller);
}

function setupQuadrantCountAnimation(triggerId, countClass, controller){

    const quadrantCount = {
        happy: 475,
        sad: 454,
        angry: 486,
        relaxed: 133
    };

    new ScrollMagic.Scene({
        triggerElement: "#" + triggerId,
        triggerHook: 0.15,
        duration: "100%"
    })
    .on('start', () => {
        d3.selectAll('.samplePoint')
            .transition()
            .duration(150)
            .ease(d3.easeLinear)
            .attr("opacity", 0)
            
        d3.selectAll('.' + countClass)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("opacity", 1)
    })
    .on('leave', (e) => {
        if (e.scrollDirection == 'REVERSE'){
            d3.selectAll('.dot')
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("opacity", 1)
        }

        d3.selectAll('.' + countClass)
            .transition()
            .duration(150)
            .ease(d3.easeLinear)
            .attr('opacity', 0)
    })
    .addTo(controller);
}

function setupQuadrantAverageRevealAnimation(quadAvgTrigger, quadAvgClass, quadCountClass, ctrl){
    new ScrollMagic.Scene({
        triggerElement: "#" + quadAvgTrigger,
        triggerHook: 0.15,
        duration: "100%"
    })
    .on('start', () => {
        d3.selectAll('.' + quadAvgClass)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("opacity", 1)

    })
    .on('leave', (e) => {
        if (e.scrollDirection == 'REVERSE'){
            d3.selectAll('.' + quadCountClass)
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("opacity", 1)
        }

        d3.selectAll('.' + quadAvgClass)
            .transition()
            .duration(150)
            .ease(d3.easeLinear)
            .attr('opacity', 0)
    })
    .addTo(ctrl);
}

function setupAllAverageRevealAnimation(allAvgTrigger, allAvgClass, quadAvgClass, ctrl){
    new ScrollMagic.Scene({
        triggerElement: "#" + allAvgTrigger,
        triggerHook: 0.15,
        duration: "100%",
    })
    .on('start', () => {
        d3.selectAll('.' + allAvgClass)
            .transition()
            .duration(200)
            .ease(d3.easeLinear)
            .attr("opacity", 1)
    })
    .on('leave', (e) => {
        if (e.scrollDirection == 'REVERSE'){
            d3.selectAll('.' + quadAvgClass)
                .transition()
                .duration(1500)
                .ease(d3.easeLinear)
                .attr("opacity", 1)
        }
        
        d3.selectAll('.' + allAvgClass)
            .transition()
            .duration(150)
            .ease(d3.easeLinear)
            .attr('opacity', 0)
            
    }).addTo(ctrl);
}

function russell(data, graphicId, ctrl){
    var margin = ({
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    })

    var colorsMap = {
        happy: "#ffd530",
        angry: "#ff0000",
        relaxed: "#0cc906",
        sad: "#5000ff",
        neutral: "#000000",
    };

    //Setup X
    var xValue = function (d) { return d.valence; },
        xScale = d3.scaleLinear()
                    .domain([0, 1]).nice()
                    .range([margin.left, width - margin.right]),
        xMap = function (d) { return xScale(xValue(d)); }
            
    //Setup Y
    var yValue = function (d) { return d.energy; },
        yScale = d3.scaleLinear()
                    .domain([0, 1]).nice()
                    .range([height - margin.bottom, margin.top]),
        yMap = function (d) { return yScale(yValue(d)); }

    drawGraphic(data, margin, xScale, xValue, yScale, yValue, colorsMap, graphicId);   
    setupTextAnimation(ctrl);
    setupGraphicAnimation(graphicTrigger, graphicEndTrigger, graphicId, ctrl);
    setupAxisLabelRevealAnimation(axisTrigger, ctrl);
    setupRussellPointRevealAnimation(graphicId, pointClass, xMap, yMap, colorsMap, ctrl);
    setupDataRevealAnimation(data, dataTrigger, graphicId, pointClass, ctrl);
    setupQuadrantCountAnimation(quadrantCountTrigger, quadrantCountClass, ctrl);
    setupQuadrantAverageRevealAnimation(quadAvgTrigger, quadAvgClass, quadrantCountClass, ctrl);
    setupAllAverageRevealAnimation(allAvgTrigger, allAvgClass, quadAvgClass, ctrl);
}


var data = Object.keys(russelData).map(function (i) {      
    return {
        "energy": russelData[i].energy, 
        "valence": russelData[i].valence,
        "type": russelData[i].song_type,
    }
});

russell(data, graphicId, controller);



