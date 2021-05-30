/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);


d3.csv("data/ages.csv").then((data)=> {
	console.log(data);
});

d3.tsv("data/ages.tsv").then((data)=> {
	console.log(data);
});

d3.json("data/ages.json").then((data)=> {
	data.forEach((d)=>{
		d.age = + d.age;
	});
	console.log(data);

	var circles = svg.selectAll("circle").data(data);
	var x = 30;
	var color = ["blue", "orange", "yellow", "red", "green"]

	circles.enter()
		.append("circle")
			.attr("cx", (d, i)=>{
				return (i*x)+50;
			})
			.attr("cy", 100)
			.attr("r", (person)=>{ return person.age; })
			.attr("fill",(d, i)=>{
				if(d.age>10){
					return color[i];
				}
				else{
					return "purple";
				}
			});
			
}).catch((error)=>{
	console.log(error);
});

	
