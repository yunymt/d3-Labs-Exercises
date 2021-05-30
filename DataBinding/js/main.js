/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

	var data = [25, 20, 15, 10, 5];

	var rectangles = svg.selectAll("rect").data(data);

	var y = 50;
	rectangles.enter()
		.append("rect")
			.attr("x", (d, i)=>{
				//console.log("Item: " + d + " Index: " + i);
				return (i*50)+25;
			})
			.attr("y", (d)=>{
				return y-d;
			})
			.attr("width", 40)
			.attr("height", (d)=>{return d; })
			.attr("fill","purple");