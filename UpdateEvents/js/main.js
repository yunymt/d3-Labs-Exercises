/*
*    main.js
*/

var margin = {top: 100, right: 10, bottom: 100, left:100};
var width = 600;
var height = 400;
var flag = true;

var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)

var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleBand()
			.range([0, width])
			.paddingInner(0.3)
			.paddingOuter(0.3);

var y = d3.scaleLinear()
	.range([0, height]);

var xAxisGroup =
	g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + height + ")")
		.style("fill","pink")

var yAxisGroup =
	g.append("g")
		.attr("class", "y axis")
		.style("fill","pink")


//Label x-axis
	g.append("text")
		.attr("class", "x axis-label")
		.attr("x", (width / 2))
		.attr("y", height + 140)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(0, -80)")
		.style("fill","purple")
		.text("Month");

//Label y-axis
var yLabel =
	g.append("text")
		.attr("class", "y axis-label")
		.attr("x", -(height / 2))
		.attr("y", -60)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.style("fill","purple")
		.text("Revenue (dlls)");


d3.json("data/revenues.json").then((data)=> {
	console.log(data)
	data.forEach((d)=>{
		d.revenue = + parseInt(d.revenue);
		d.profit= + parseInt(d.profit);
	});

	//UPDATE
	d3.interval(() => {
		update(data);
		flag = !flag;
	}, 1000);
	update(data);

}).catch((error)=>{
	console.log(error);
});


function update(data){
	var value = flag ? "revenue" : "profit";
	var months = data.map((d)=>{return d.month; });
	x.domain(months);

	var maxRev = d3.max(data, (d) => {return d[value]; });
	y.domain([maxRev, 0]);
			

	var color = d3.scaleOrdinal()
				.domain(months)
				.range(d3.schemeSet3)


	var bars = g.selectAll("rect").data(data);
	bars.exit().remove();

	//UPDATE
	bars.attr("x", (d) => { return x(d.month); })
		.attr("y", (d) => { return y(d[value]); })
		.attr("width", x.bandwidth)
		.attr("height",(d) => { return height - y(d[value])});

	bars.enter()
		.append("rect")
			.attr("x", (d)=>{
				return x(d.month);
			})
			.attr("y", (d)=>{
				return y(d[value]);
			})
			.attr("width", x.bandwidth())
			.attr("height", (d)=>{
				return height - y(d[value]);
			})
			.attr("fill", (d)=>{
				return color(d.month);
			});

	//Botom axix
	var bottomAxis =  d3.axisBottom(x);
	
	xAxisGroup.call(bottomAxis)
	.selectAll("text")
	.attr("y", "10")
	.attr("x", "-5")
	.attr("text-anchor", "end")
	.attr("transform", "rotate(0)")
	.attr("text-anchor", "middle");

	//Lef axis 5 ticks
	var leftAxis = d3.axisLeft(y).ticks(5)
			.tickFormat((d) => { return "$"+ d/1000 + "K"; });

	yAxisGroup.call(leftAxis);

	var label = flag ? "Revenue (dlls)" : "Profit (dlls)";
	yLabel.text(label);
}
