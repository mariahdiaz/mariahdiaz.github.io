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
    .text("Country by World Population Percentage in 2022 ")
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
        .call(d3.axisBottom(x))
        .style("font-size", "12px");

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
        .call(d3.axisLeft(y))
        .style("font-size", "12px");

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
        .range(["rgba(245,41,41,0.9)", "rgba(54,129,225,0.84)","rgba(78,178,53,0.85)",
            "rgba(176,78,197,0.78)","rgba(255,116,3,0.8)", "rgba(250,220,5,0.95)"]);

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
        .style("opacity", "0.85")
        .attr("stroke", "black")
        .on("mouseover", function(event, d){
            const formater =  d3.format('.2s');
            div.transition()
                .duration(200)
                .style("opacity",1);
            div.html( `Country: ${d.Country} <br/> World Population Percentage: ${+d.WorldPopulationPercentage} %
                <br/> Density: ${formater(d.Density)} <br/> Area: ${formater(d.Area)}`)
                .style("left", (event.pageX+30)+"px")
                .style("top", (event.pageY-28)+"px");

        })
        .on("mouseout", function(d){
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    const valuesToShow = [0.01, 0.5,2, 5, 18]
    const xCircle = 830
    const xLabel = 920
    const yCircle = 330

   // bubble size legend
    svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("circle")
        .attr("cx", xCircle)
        .attr("cy", d => yCircle - z(d))
        .attr("r", d => z(d))
        .style("fill", "none")
        .attr("stroke", "black")

    //Connecting line for size legend
    svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("line")
        .attr('x1', d => xCircle + z(d))
        .attr('x2', xLabel)
        .attr('y1', d => yCircle - z(d))
        .attr('y2', d => yCircle - z(d))
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    //Percent Labels for size legend
    svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("text")
        .attr('x', xLabel)
        .attr('y', d => yCircle - z(d))
        .text( d => d + "%")
        .style("font-size", 11)
        .attr('alignment-baseline', 'middle')

    // Size legend title
    svg.append("text")
        .attr("x", 840)
        .attr("y",360)
        .text("World Population Percentage")
        .style("font-size", 17)
        .attr("text-anchor", "middle");
    svg.append("text")
        .attr("x", 840)
        .attr("y",385)
        .text("Bubble Size Legend")
        .style("font-size", 17)
        .attr("text-anchor", "middle");





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
        .style("opacity", "0.85")
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
