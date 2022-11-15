

// set the dimensions and margins of the graph
var margin = { top: 120, right: 250, bottom: 75, left: 130 },
    width = 1100 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
    .select("#Bubble_viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .style("border", "solid")
    .style("border-width", "1px");


//Graph Title
svg.append("text")
    .attr("x", width / 2)
    .attr("y",-60)
    .attr("text-anchor", "middle")
    .text("World Population Percentage Bubble Chart")
    .style("font-size", "30px") ;

// read the data
d3.csv("BubbleChartData.csv").then((data) => {

    // add x axis
    const x = d3.scaleLog()
        .domain([d3.min(data, (d) => +d.Area), d3.max(data, (d) => +d.Area)])
        .range([0,width])
        .nice();

    //visualize x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add x axis label
    svg.append("text")
        .attr("class","x label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + 50)
        .style("font-size", "20px")
        .text("Area (per km^2)");

    // add y axis
    const y = d3.scaleLog()
        .domain([d3.min(data, (d) => +d.Density), d3.max(data, (d) => +d.Density)])
        .range([height, 0])
        .nice();

    //visualize y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // add y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", -90)
        .text("Density (per km^2)")
        .style("font-size", "20px")
        .attr("transform", "rotate(-90)");

    const z = d3.scaleSymlog()
        .domain([0,d3.max(data, (d) => +d.WorldPopulationPercentage)]) //max
        .range([10, 70])
        .nice();

    // add a scale for bubble color
    const myColor = d3.scaleOrdinal()
        .domain(["Asia","Europe","Africa","Oceania","North America","South America"])
        .range(d3.schemeSet1);

    // add Bubbles
    svg.append("g")
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("class", "bubbles")
        .attr("cx", (d) => x(d.Area))
        .attr("cy", (d) => y(d.Density))
        .attr("r", (d) => z(+d.WorldPopulationPercentage))
        .style("fill", (d) => myColor(d.Continent))
        .style("opacity", "0.7")
        .attr("stroke", "black")
        .on("mouseover", function(event, d){
        const formater =  d3.format('.3s');
        const formater1= d3.format(".2f");
            div.transition()
                .duration(200)
                .style("opacity",1);
            div.html( `Country: ${d.Country} <br/> World Population Percentage: ${+d.WorldPopulationPercentage} %
                <br/> Density: ${formater1(d.Density)} <br/> Area: ${formater(d.Area)}`)
                .style("left", (event.pageX+30)+"px")
                .style("top", (event.pageY-28)+"px");

        })
        .on("mouseout", function(d){
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });



//Bubble color legend
    const size = 20;
    const newgroups=["Asia","Europe","Africa","Oceania","North America","South America"];


    //add colored dots for legend
    svg.selectAll("myrect")
        .data(newgroups)
        .join("circle")
        .attr("cx", 780)
        .attr("cy", (d, i) => 10 + i * (size + 7))
        .attr("r", 5)
        .style("fill", (d) => myColor(d))
        .style("opacity", "0.7")
        .attr("stroke", "black");

    // add labels beside colored dots
    svg.selectAll("mylabels")
        .data(newgroups)
        .enter()
        .append("text")
        .attr("x", 800)
        .attr("y", (d, i) => 10 + i * (size + 7))
        .style("fill", (d) => myColor(d))
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    //.attr("stroke", "black");

    //color legend title
    svg.append("text")
        .attr("x", 860)
        .attr("y",-20)
        .text("Continents Color Legend:")
        .style("font-size", 18)
        .attr("text-anchor", "middle");

});

