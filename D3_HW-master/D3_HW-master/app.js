var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var plotWidth = svgWidth - margin.left - margin.right;
var plotHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

var scatterPlot = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("#scatter").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("data.csv", function(err, healthcareData) {
  if (err) throw err;
console.log(healthcareData)
  // Step 1: Parse Data/Cast as numbers
   // ==============================
  healthcareData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear().range([0, plotWidth]);
  var yLinearScale = d3.scaleLinear().range([plotHeight, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin;
  var xMax;
  var yMin;
  var yMax;
  
  xMin = d3.min(healthcareData, function(data) {
      return data.healthcare;
  });
  
  xMax = d3.max(healthcareData, function(data) {
      return data.healthcare;
  });
  
  yMin = d3.min(healthcareData, function(data) {
      return data.poverty;
  });
  
  yMax = d3.max(healthcareData, function(data) {
      return data.poverty;
  });
  
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);
  console.log(xMin);
  console.log(yMax);

  // Step 4: Append Axes to the chart
  // ==============================
  scatterPlot.append("g")
    .attr("transform", `translate(0, ${plotHeight})`)
    .call(bottomAxis);

  scatterPlot.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var plotSize = scatterPlot.selectAll("circle")
  .data(healthcareData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare +1.5))
  .attr("cy", d => yLinearScale(d.poverty +0.3))
  .attr("r", "12")
  .attr("fill", "blue")
  .attr("opacity", .5)

  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });
  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (abbr + '%');
      });

  // Step 7: Create tooltip in the chart
  // ==============================
  scatterPlot.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels

  scatterPlot.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(healthcareData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.healthcare +1.3);
          
      })
      .attr("y", function(data) {
          return yLinearScale(data.poverty +.1);
          
      })
      .text(function(data) {
          return data.abbr
      });

  scatterPlot.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (plotHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healtcare(%)");

  scatterPlot.append("g")
    .attr("transform", `translate(${plotWidth / 2}, ${plotHeight + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
});