/*
*    main.js
*/

var margin = {top: 10, right: 10, bottom: 100, left:100};
var width = 600;
var height = 400;

var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)

var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


d3.json("data/buildings.json").then((data)=> {
	console.log(data)
	var heights = []
	data.forEach((d)=>{
		d.height = + d.height;
	heights.push(d.height);
	});

	var builds = data.map((d)=>{return d.name; });

	//var rectangles = svg.selectAll("rect").data(data);
	var rectangles = g.selectAll("rect").data(data);

	var x = d3.scaleBand()
			.domain(builds)
			.range([0, width])
			.paddingInner(0.3)
			.paddingOuter(0.3);

	var maxH = Math.max.apply(Math, heights);
	//console.log(maxH);

	var y = d3.scaleLinear()
			.domain([maxH, 0])
			.range([0, height]);

	var color = d3.scaleOrdinal()
				.domain(builds)
				.range(d3.schemeSet3)

	rectangles.enter()
		.append("rect")
			.attr("x", (d)=>{
				return x(d.name);
			})
			.attr("y", (d)=>{
				return y(d.height);
			})
			.attr("width", x.bandwidth())
			.attr("height", (d)=>{
				return height - y(d.height);
			})
			.attr("fill", (d)=>{
				return color(d.name);
			});


	//Botom axix
	var bottomAxis = d3.axisBottom(x);
	g.append("g")
		.attr("class", "bottom axis")
		.attr("transform", "translate(0, " + height + ")")
		.call(bottomAxis)
		.selectAll("text")
	    .attr("y", "10")
	    .attr("x", "-5")
	    .attr("text-anchor", "end")
	    .attr("transform", "rotate(-20)");

	//Lef axis 5 ticks
	var leftAxis = d3.axisLeft(y).ticks(5)
			.tickFormat((d) => { return d + "m"; });

	g.append("g")
		.attr("class", "left axis")
		.call(leftAxis);

	//Label x-axis
	g.append("text")
		.attr("class", "x axis-label")
		.attr("x", (width / 2))
		.attr("y", height + 140)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(0, -50)")
		.style("fill","black")
		.text("The world's tallest buildings");

	//Label y-axis
	g.append("text")
		.attr("class", "y axis-label")
		.attr("x", -(height / 2))
		.attr("y", -60)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.style("fill","black")
		.text("Height (m)");


}).catch((error)=>{
	console.log(error);
});
