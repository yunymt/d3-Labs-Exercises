/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

	var data = [25, 20, 15, 10, 5];
	width = 40;

	var i, x=50, y=50;
	for (i=0; i<data.length;i++){
		var rect = svg.append("rect")
		.attr("x", x)
		.attr("y", y)
		.attr("width", 40)
		.attr("height", data[i])
		.attr("fill","purple");

		x = x+50;
		y = y+5;
	}

	