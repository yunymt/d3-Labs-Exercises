/*
*    main.js
*/
var svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500);

d3.json("data/buildings.json").then((data)=> {
	console.log(data)
	var heights = []
	data.forEach((d)=>{
		d.height = + d.height;
	heights.push(d.height);
	});

	var builds = data.map((d)=>{return d.name; });

	var rectangles = svg.selectAll("rect").data(data);

	var x = d3.scaleBand()
			.domain(builds)
			.range([0, 400])
			.paddingInner(0.3)
			.paddingOuter(0.3);

	var maxH = Math.max.apply(Math, heights);
	console.log(maxH);

	var y = d3.scaleLinear()
			.domain([0, maxH])
			.range([0, 400]);

	var color = d3.scaleOrdinal()
				.domain(builds)
				.range(d3.schemeSet3)

	rectangles.enter()
		.append("rect")
			.attr("x", (d)=>{
				return x(d.name);
			})
			.attr("y", (d)=>{
				return 500-y(d.height);
			})
			.attr("width", x.bandwidth())
			.attr("height", (d)=>{
				return y(d.height);
			})
			.attr("fill", (d)=>{
				return color(d.name);
			});
}).catch((error)=>{
	console.log(error);
});
