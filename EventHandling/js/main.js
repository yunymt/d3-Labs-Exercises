/*
*    main.js
*/

var margin = {top: 10, right: 10, bottom: 100, left:100};
var width = 600;
var height = 400;
var formattedData = [];
var years = [];
var interval;
var time = 0;

var t = d3.transition().duration(1000);
var k = 0;

var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)

var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleLog()
	.domain([142, 150000])
	.range([0, width])
	.base(10);

var y = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

var area = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25*Math.PI, 1500*Math.PI]);

var color = d3.scaleOrdinal()
	.range(d3.schemePastel1);

//Bottom axis
var bottomAxis = d3.axisBottom(x)
	.tickValues([400,4000,40000])
	.tickFormat(d3.format("$"));

//Left axis
var leftAxis = d3.axisLeft(y);

var xAxisGroup = g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")");

var xAxisGroup = g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")")
    .style("fill","pink");

var yAxisGroup = g.append("g")
    .attr("class", "y axis")
    .style("fill","pink");

//Label x-axis
var xLabel = g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 140)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -80)")
    .style("fill","purple")
    .text("GDP Per Capita ($)");

//Label y-axis
var yLabel = g.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height / 2))
	.attr("y", -60)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.style("fill","purple")
	.text("Life Expectancy (Years)");

//Years legend
var legend = g.append("g")
 	.attr("transform", "translate(" + (width - 10) + "," + (height - 170) + ")");

var areaL = g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width - 50)
	.attr("y", height - 20)
	.attr("font-size", "50px")
	.attr("text-anchor", "middle")
	.attr("fill", "gray")

d3.json("data/data.json").then((data)=>{
	data.forEach((d)=>{
		d.year = +d.year;
		
	});
	formattedData = data.map((year) => {
		return year["countries"].filter((country) => {
		var dataExists = (country.income && country.life_exp);
		return dataExists;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});
	years = data.map((d) => {return d.year;});
	var contin = formattedData[0].map((d) => {return d.continent;});
	var continents = [...new Set(contin)];

	color.domain(continents)
	continents.forEach((cont, i) => {
		var contRow = legend.append("g")
			.attr("transform", "translate(0, " + (i * 20) + ")");

		contRow.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", color(cont))
			.attr("stroke", "white");

		contRow.append("text")
			.attr("x", -20)
			.attr("y", 10)
			.attr("text-anchor", "end")
			.style("text-transform", "capitalize")
			.text(cont);
		 });
	
	update(years[k % years.length], formattedData[k % years.length], time);
	k += 1;
});


function update(year, data, time) {
	var idx = $("#date-slider").slider("value");
	year = years[idx];

	var continent = $("#continent-select").val();
	var data = data.filter((d) => {
		if (continent == "all") { return true; }
		else {
			return d.continent == continent;
		}
	});

	var tip = d3.tip()
	.attr('class', 'd3-tip')
	.html((d) => { 
		var text = "<strong>Country:</strong>";
		text += "<span style='color:orange'> " + d.country + "</span><br>";
		text += "<strong>Continent:</strong> ";
		text += "<span style='color:orange;text-transform:capitalize'>" + d.continent + "</span><br>";
		text += "<strong>Life Expectancy:</strong>";
		text += "<span style='color:orange'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
		text += "<strong>GDP Per Capita:</strong>";
		text += "<span style='color:orange'>" + d3.format("$,.0f")(d.income) + "</span><br>";
		text += "<strong>Population:</strong>";
		text += "<span style='color:orange'>" + d3.format(",.0f")(d.population) + "</span><br>";

		return text;
	 });

	g.call(tip);

	var circles = g.selectAll("circle").data(data, (d) => { return d.country; });

	circles.exit()
	    .transition(t)
			.attr("fill", (d) => { return color(d.continent); })
			.attr("cy", (d) => { return y(d.life_exp); })
			.attr("cx", (d) => { return y(d.income); })
			.attr("r", (d) => { return Math.sqrt(area(d.population)/Math.PI);})
		.remove();

	//UPDATE
	circles.transition(t)
		.attr("fill", (d) => { return color(d.continent); })
		.attr("cy", (d) => { return y(d.life_exp); })
		.attr("cx", (d) => { return y(d.income); })
		.attr("r", (d) => { return Math.sqrt(area(d.population)/Math.PI);})

	circles.enter()
	.append("circle")
			.attr("fill", (d) => { return color(d.continent); })
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
			.attr("cy", (d) => { return y(d.life_exp); })
			.attr("cx", (d) => { return y(d.income); })
			.attr("r", (d) => { return Math.sqrt(area(d.population)/Math.PI);})
		.merge(circles)
		.transition(t)
			.attr("cy", (d) => {return y(d.life_exp);})
			.attr("cx", (d) => { return x(d.income);})
			.attr("r", (d)=>{return Math.sqrt(area(d.population) / Math.PI);});

	areaL.text(idx);

	xAxisGroup.call(bottomAxis)
	    .selectAll("text")
	    .attr("y", "10")
	    .attr("x", "-5")
	    .attr("transform", "rotate(0)")
	    .attr("text-anchor", "middle");

	yAxisGroup.call(leftAxis);

	$("#date-slider").slider("value", +(k + 1800));
	$("#year")[0].innerHTML = +(idx);
}

function step(){
	update(years[k % years.length], formattedData[k % years.length], time);
	k = k+1;
}

$("#play-button").on("click", ( ) => {
	var button = $("#play-button");
	if (button.text() == "Play"){
		button.text("Pause");
		interval = setInterval(step, 1000);
	} else if (button.text() == "Pause"){
		button.text("Play");
		clearInterval(interval);
	}
});

$("#reset-button").on("click", ( ) => {
	k = 0;
});

$("#continent-select").on("change", ( ) => {
	update(years[k % years.length], formattedData[k % years.length], time);
	k += 1;
});

$("#date-slider").slider({
	max: 2014, min: 1800, step: 1,
	slide:(event, ui) => {
		k = ui.value - 1800;
		update(years[k % years.length], formattedData[k % years.length], time);
		k = k + 1;
	}
});