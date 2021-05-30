/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500);

	var circle = svg.append("circle")
	.attr("cx", 200)
	.attr("cy", 250)
	.attr("r", 30)
	.attr("fill", "green");

	var rect = svg.append("rect")
	.attr("x", 50)
	.attr("y", 50)
	.attr("width", 70)
	.attr("height", 70)
	.attr("fill","purple");