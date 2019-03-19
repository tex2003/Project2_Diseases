// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#chart_1")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
// Configure a parseTime function which will return a new Date object from a string
var basicURL = '/basic'
// Load data from forcepoints.csv
d3.json(basicURL, function(error, basicData) {

  var dip = basicData.filter(function(d){
    return d.Disease === 'Diphtheria'
  });
  
  var measles = basicData.filter(function(d){
    return d.Disease === 'Measles'
  });
  
  var mumps = basicData.filter(function(d){
    return d.Disease === 'Mumps'
  });
  
  var pert = basicData.filter(function(d){
    return d.Disease === 'Pertussis'
  });
  
  var rub = basicData.filter(function(d){
    return d.Disease === 'Rubella'
  });
  
  var small = basicData.filter(function(d){
    return d.Disease === 'Smallpox'
  });
  
  var tube = basicData.filter(function(d){
    return d.Disease === 'Tuberculosis'
  });
  
  var typ = basicData.filter(function(d){
    return d.Disease === 'Typhoid fever'
  });
  
  var varic = basicData.filter(function(d){
    return d.Disease === 'Varicella'
  });
  
  var hepb = basicData.filter(function(d){
    return d.Disease === 'Viral hepatitis type B'
  });
  
  var hepa = basicData.filter(function(d){
    return d.Disease === 'Viral hepatitis, type A'
  });

var allDiseases = ['dip', 'measles', 'mumps', 'pert', 'rub', 'small', 'tube', 'typ', 'varic', 'hepb', 'hepa']
var accent = d3.scaleOrdinal(d3.schemePaired);

  // Throw an error if one occurs
  if (error) throw error;

  // Print the basicData
  console.log(basicData);

  // Format the date and cast the force value to a number
  basicData.forEach(function(data) {
    data.Year = +data.Year;
    data.Count = +data.Count;
  });

  // Configure a time scale
  // d3.extent returns the an array containing the min and max values for the property specified
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(basicData, data => data.Year), d3.max(basicData, data => data.Year)])
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(basicData, data => data.Count)])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Configure a line function which will plot the x and y coordinates using our scales
  var drawLine = d3.line()
    .x(data => xLinearScale(data.Year))
    .y(data => yLinearScale(data.Count));

  // Append an SVG path and plot its points using the line function
  chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(dip))
    .classed("dip", true);

  chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(measles))
    .classed('measles', true)

    chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(mumps))
    .classed('mumps', true)

    chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(pert))
    .classed('pert', true)

    chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(rub))
    .classed('rub', true)

    chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(small))
    .classed('small', true)

    chartGroup.append("tube")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(measles))
    .classed('tube', true)

    chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(typ))
    .classed('typ', true)

    chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(varic))
    .classed('varic', true)

    chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(hepb))
    .classed('hepb', true)

    chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(hepa))
    .classed('hepa', true)
  

  // Append an SVG group element to the chartGroup, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

  // Append an SVG group element to the chartGroup, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

});