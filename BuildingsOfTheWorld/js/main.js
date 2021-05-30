/*
*    main.js
*/
var svg = d3.select("#chart-area").append("svg")
	.attr("width", 1000)
	.attr("height", 1000);

d3.json("data/buildings.json").then((data)=> {
	console.log(data)
	var heights = []
	data.forEach((d)=>{
		d.height = + d.height;
	heights.push(d.height);
	});

	var rectangles = svg.selectAll("rect").data(data);
	var x = 50;
	var maxH = Math.max.apply(Math, heights);
	console.log(maxH);

	rectangles.enter()
		.append("rect")
			.attr("x", (d, i)=>{
				return (i*x)+100;
			})
			.attr("y", (d, i)=>{
				return maxH-d.height;
			})
			.attr("width", 40)
			.attr("height", (building)=>{return building.height; })
			.attr("fill","purple");
});
