var svg = d3.select("svg"),
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

var color = d3.scaleOrdinal();
color.range(["#654F6F", "#6BA292"])

var x = d3.scaleBand().rangeRound([0, width])
  .padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [  {Group: "Denied", Count:16, Quarter: '2020Q2'},
  {Group: "Granted", Count:32, Quarter: '2020Q2'},
  {Group: "Denied", Count:22, Quarter: '2020Q3'},
  {Group: "Granted", Count:47, Quarter: '2020Q3'},
  {Group: "Denied", Count:34, Quarter: '2020Q4'},
  {Group: "Granted", Count:52, Quarter: '2020Q4'},
  {Group: "Denied", Count:43, Quarter: '2021Q1'},
  {Group: "Granted", Count:76, Quarter: '2021Q1'},
  {Group: "Denied", Count:20, Quarter: '2021Q2'},
  {Group: "Granted", Count:79, Quarter: '2021Q2'},
  {Group: "Denied", Count:14, Quarter: '2021Q3'},
  {Group: "Granted", Count:64, Quarter: '2021Q3'}];

var ymaxdomain = d3.max(data, function(d) {
  return d.Count;
});
x.domain(data.map(function(d) {
  return d.Quarter
}));
y.domain([0, ymaxdomain]);

var x1 = d3.scaleBand()
  .rangeRound([0, x.bandwidth()])
  .padding(0.05)
  .domain(data.map(function(d) {
    return d.Group;
  }));

color.domain(data.map(function(d) {
  return d.Group;
}));


var groups = g.selectAll(null)
  .data(data)
  .enter()
  .append("g")
  .attr("transform", function(d) {
    return "translate(" + x(d.Quarter) + ",0)";
  })

  var grid = g.selectAll(null)
   .attr('class', 'grid')
   .attr('transform', 'translate('+margin.left+','+margin.top+')')
   .append("g")
  grid.append("g")
    .call(d3.axisLeft()
    .scale(y)
    .tickSize(-width, 0, 0)
    .tickFormat(''))


var bars = groups.selectAll(null)
  .data(function(d) {
    return [d]
  })
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return x1(d.Group)
  })
  .attr("y", function(d) {
    return y(d.Count);
  })
  .attr("width", x1.bandwidth())
  .attr("height", function(d) {
    return height - y(d.Count);
  })
  .attr("fill", function(d) {
    return color(d.Group)
  })
  .on('mouseenter', function(actual, i){
    d3.select(this).attr('opacity', 0.5)

  .on('mouseleave', function(actual, i){
    d3.select(this).attr('opacity', 1)
  })
});

bars
  .enter()
  .append("text")
  .attr("x", function(d, i) {
    return x1(d.Group)
  })
  .attr("y", function(d) {
        return y(d.Count);
      })
  .style('fill', d => color(d.key))
  .style('font-size', '1.25em')
      //make sure one just decimal place is displayed
  .text(function(d) {y(d.Count)});




//legend

var keys = ["Denied", "Granted"]
var legend_color = d3.scaleOrdinal(d3.schemeCategory10)
  .domain(keys)
  .range(d3.schemeCategory10);

// Add one dot in the legend for each name.
var size = 20

svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("rect")
    .attr("x", 120)
    .attr("y", function(d,i){ return 45 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return color(d)})

// Add one dot in the legend for each name.
svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 120 + size*1.2)
    .attr("y", function(d,i){ return 48 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

groups
  .append("text")
  .attr("x", function(d, i) {
    return x1(d.Group) + x1.bandwidth() / 2
  })
  .attr("y", function(d) {
    return y(d.Count) - 5;
    })
  .style('fill', function(d) {
    return color(d.Group)
  })
  .style('font-size', '1.25em')
  .style('text-anchor', 'middle')
      //make sure one just decimal place is displayed
  .text(function(d) {
    return d.Count
  });


g.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

g.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y).ticks(null, "s"))
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("fill", "#000")
  .attr("font-weight", "bold")
  .attr("text-anchor", "end")
  .text("Count");

/*g.append('text')
  .attr('class', 'source')
  .attr('x', width - margin / 2)
  .attr('y', height + margin * 2000)
  .attr('fill', 'black')
  .attr('text-anchor', 'start')
  .text('Source: Unified Patents, 2021')
  */
