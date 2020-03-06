children1 = data.data;
children2 = data.data2;
children3 = data.data3;
children4 = data.data4;
panel_number = data.panel_number;
key = data.key;
radius = data.radius;
color = data.color;
alpha = data.alpha;
lable_name = data.lable_name;
font = data.font;
font_color = data.font_color;
title = data.title;
font_size_title = data.font_size_title;
datalegend = data.legend;
legend_bubble_size = data.legend_bubble_size;
legend_spacing = data.legend_spacing;

w = width/panel_number;
h = height;

// define the svg elements =====
move_right = 0; //user supplied with options?
move_down = -20;

svg1 = svg.append('g')
         .attr('transform', 'translate(' + move_right + ',' + move_down + ')');
svg2 =  svg.append('g')
         .attr('transform', 'translate(' + w + ',' + move_down + ')');
svg3 =  svg.append('g')
         .attr('transform', 'translate(' + 2*w + ',' + move_down + ')');
svg4 =  svg.append('g')
         .attr('transform', 'translate(' + 3*w + ',' + move_down + ')');
svgtitle = svg.append('g')
          .attr('transform', 'translate(' + move_right + ',' + 0 + ')');
svgLegend = svg.append('g')
          .attr('transform', 'translate(' + 0 + ',' + (h-4*legend_bubble_size) +')');
          

// make the title ====
move_down_title = font_size_title *1.1;

svgtitle.append("text")
  .datum(title)
  .attr("dy", ".2em")
  .style("text-anchor", "middle")
  .attr("x", width/2)
  .attr("y", move_down_title)
  .text(title)
  .attr("font-family", font)
  .attr("font-size", font_size_title)
  .attr("fill", font_color);

// clean up the data =====
function dataClean(children){
  dataset = {children : []};

  for (i = 0; i < children[key].length; i++) {
    dataset.children[i] = {
      "key" : children[key][i],
      "radius" : children[radius][i]
    };
  }
  
  return dataset;
}

dataset1 = dataClean(children1);
dataset2 = dataClean(children2);
dataset3 = dataClean(children3);
dataset4 = dataClean(children4);

//function to get value to radius conversion (radius/value) =====
svg0 = svg.append('g')
         .attr('transform', 'translate(' + -w + ',' + move_down + ')');

function getsize(dataset) {
  
  bubble = d3.pack(dataset)
           .size([w, h])
           .padding(1.5);

  nodes = d3.hierarchy(dataset)
          .sum(function(d) { return d.radius;});

  node = svg0.selectAll(".node")
          .data(bubble(nodes).descendants())
          .enter()
          .filter(function(d){
            return  !d.children;
            })
          .append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
            });
  
  rvratio = nodes.children[0].r / nodes.children[0].value;

  return rvratio;
}

rv1 = getsize(dataset1);
rv2 = getsize(dataset2);
rv3 = getsize(dataset3);
rv4 = getsize(dataset4);

rvmin = Math.min(rv1, rv2, rv3, rv4);

w1 = w*rvmin/rv1;
w2 = w*rvmin/rv2;
w3 = w*rvmin/rv3;
w4 = w*rvmin/rv4;

// function to draw the bubbles given data and svg elements =====
function drawBubbles(children, dataset, svg, w, h) {
  
  bubble = d3.pack(dataset)
           .size([w, h])
           .padding(1.5);
           
  nodes = d3.hierarchy(dataset)
          .sum(function(d) { return d.radius;});
  
  node = svg.selectAll(".node")
          .data(bubble(nodes).descendants())
          .enter()
          .filter(function(d){
            return  !d.children;
            })
          .append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
            });
  
  node.append("circle")
    .attr("r", function(d) {
      return d.r ;
    })
    .attr("fill", function(d, i) {
      return children[color][i];
      })
    .attr("opacity", function(d, i){
      return children[alpha][i];
      });
      
  node.append("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text((function(d, i) {
      return children[lable_name][i];
      })) 
    .attr("font-family", font)
    .attr("font-size", children["font_size"][i])
    .attr("fill", font_color);
    
  return node;
}

node1 = drawBubbles(children1, dataset1, svg1, w1, h);
node2 = drawBubbles(children2, dataset2, svg2, w2, h);
node3 = drawBubbles(children3, dataset3, svg3, w3, h);
node4 = drawBubbles(children4, dataset4, svg4, w4, h);

// make the legend
// get buble size from first panel

b_size_panel1 = node1._groups[0][0].__data__.r /1.5;

font_size = font_size_title/2;

xscaleLegend = d3.scaleLinear()
                 .domain([1, d3.max(datalegend.X, function(d){ return d; })])
                 .range([legend_spacing, width - legend_spacing - font_size*5]);

yscaleLegend = d3.scaleLinear()
                 .domain([1, d3.max(datalegend.Y, function(d){ return d; })])
                 .range([0.5*legend_bubble_size, 3*legend_bubble_size]);

dataLegend = d3.zip(datalegend.id,datalegend.X, datalegend.Y, datalegend.color, datalegend.Lable);

svgLegend.selectAll("circle")
  .data(dataLegend)
  .enter()
  .append("circle")
  .attr("cx", function(d){ return xscaleLegend(d[1]);})
  .attr("cy", function(d){ return yscaleLegend(d[2]);})
  .attr("r", b_size_panel1)
  .attr("fill", function(d){ return d[3];} );
  
svgLegend.selectAll("text")
  .data(dataLegend)
  .enter()
  .append("text")
  .attr("data_html", "true")
  .attr("x", function(d){ return xscaleLegend(d[1]) + b_size_panel1 + 3;})
  .attr("y", function(d){ return yscaleLegend(d[2]);})
  .html(function(d) {return d[4].split(["<br>"])[0];})
  .attr("font-family", font)
  .attr("font-size", font_size)
  .attr("fill", font_color)
  .append("tspan")
  .text(function(d) {return d[4].split(["<br>"])[1];})
  .attr("x", function(d){ return xscaleLegend(d[1]) + b_size_panel1 + 3;})
  .attr("y", function(d){ return yscaleLegend(d[2])+ font_size;})
  .attr("font-family", font)
  .attr("font-size", font_size)
  .attr("fill", font_color); 
