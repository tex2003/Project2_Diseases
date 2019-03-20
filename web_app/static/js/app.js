// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 80
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


// Select body, append SVG area to it, and set its dimensions
var svg = d3.select(".chart_1")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
  }))
  .on("dblclick.zoom", null)
  .on("mousedown.zoom", null)
  .on("touchstart.zoom", null)
  .on("touchmove.zoom", null)
  .on("touchend.zoom", null)
  .append("g");

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var basicURL = "/basic";
d3.json(basicURL).then(function (basicData) {

  var dip = basicData.filter(function (d) {
    return d.Disease === 'Diphtheria'
  });

  var measles = basicData.filter(function (d) {
    return d.Disease === 'Measles'
  });

  var mumps = basicData.filter(function (d) {
    return d.Disease === 'Mumps'
  });

  var pert = basicData.filter(function (d) {
    return d.Disease === 'Pertussis'
  });

  var rub = basicData.filter(function (d) {
    return d.Disease === 'Rubella'
  });

  var small = basicData.filter(function (d) {
    return d.Disease === 'Smallpox'
  });

  var tube = basicData.filter(function (d) {
    return d.Disease === 'Tuberculosis'
  });

  var typ = basicData.filter(function (d) {
    return d.Disease === 'Typhoid fever'
  });

  var varic = basicData.filter(function (d) {
    return d.Disease === 'Varicella'
  });

  var hepb = basicData.filter(function (d) {
    return d.Disease === 'Viral hepatitis type B'
  });

  var hepa = basicData.filter(function (d) {
    return d.Disease === 'Viral hepatitis, type A'
  });

  var circleData = [{
    'cx': 1920,
    'cy': 69470,
    'radius': 5,
    'color': '#8dd3c7',
    'disease': 'Diphtheria'
  }, {
    'cx': 1963,
    'cy': 331082,
    'radius': 5,
    'color': '#bebada',
    'disease': 'Measles'
  }, {
    'cx': 1967,
    'cy': 2498,
    'radius': 5,
    'color': '#fb8072',
    'disease': 'Mumps'
  }, {
    'cx': 1930,
    'cy': 37216,
    'radius': 5,
    'color': '#80b1d3',
    'disease': 'Pertussis'
  }, {
    'cx': 1969,
    'cy': 50998,
    'radius': 5,
    'color': '#fdb462',
    'disease': 'Rubella'
  }, {
    'cx': 1796,
    'cy': 0,
    'radius': 5,
    'color': '#b3de69',
    'disease': 'Smallpox'
  }, {
    'cx': 1921,
    'cy': 75290,
    'radius': 5,
    'color': '#fccde5',
    'disease': 'Tuberculosis'
  }, {
    'cx': 1896,
    'cy': 0,
    'radius': 5,
    'color': '#d9d9d9',
    'disease': 'Typhoid fever'
  }, {
    'cx': 1995,
    'cy': 0,
    'radius': 5,
    'color': '#bc80bd',
    'disease': 'Varicella'
  }, {
    'cx': 1982,
    'cy': 17929,
    'radius': 5,
    'color': '#ccebc5',
    'disease': 'Viral hepatitis type B'
  }, {
    'cx': 1995,
    'cy': 294,
    'radius': 5,
    'color': '#ffed6f',
    'disease': 'Viral hepatitis, type A'
  }]
  var allDiseases = ['dip', 'measles', 'mumps', 'pert', 'rub', 'small', 'tube', 'typ', 'varic', 'hepb', 'hepa']
  var accent = ['#8dd3c7', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];
  // Print the basicData
  console.log(basicData);

  // Format the date and cast the force value to a number
  basicData.forEach(function (data) {
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
  var bottomAxis = d3.axisBottom(xLinearScale).tickFormat(d3.format('d'));
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

  chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for basicData
    .attr("d", drawLine(tube))
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

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + 30)
    .attr('dy', '1em')
    .text("Year");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("# Reported Cases");

  var legend = chartGroup.append("g")
    .attr("class", "legend")
    .attr("x", chartWidth - 25)
    .attr("y", 25)
    .attr("height", 60)
    .attr("width", 100);

  legend.selectAll('g').data(allDiseases)
    .enter()
    .append('g')
    .each(function (d, i) {
      var g = d3.select(this);
      g.append("rect")
        .attr("x", chartWidth - 100)
        .attr("y", i * 25)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", accent[i]);

      g.append("text")
        .attr("x", chartWidth - 75)
        .attr("y", i * 25 + 8)
        .attr("height", 30)
        .attr("width", 100)
        .style("fill", accent[i])
        .text(d);
    });

});