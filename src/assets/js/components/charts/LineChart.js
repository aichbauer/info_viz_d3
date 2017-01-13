import * as d3 from 'd3';


class LineChart {

  constructor(margin, width, height, linechartDivClass, dataAsJSON) {

    this.margin = margin;

    this.div = linechartDivClass;

    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;

    d3.json(dataAsJSON, (error, json) => {
      this.data = json;
      this.render(this.data);
    });

  }


  render(new_data, loc = ['New York', 'Hawaii'], crime = 'Violent.crime.number.rate') {

    let newData = [];

    for (let i in new_data) {

      if (loc.includes(new_data[i].location)) {

        for (let x in new_data[i].crimes.years) {

          console.log(new_data[i].location)
          console.log('\n\n')
          console.log(new_data[i].crimes)
          console.log('\n\n')
          console.log(new_data[i].crimes.years[x][crime])
          console.log(Object.keys(new_data[i].crimes.years))
          console.log('\n\n\n\n')

          let crimeYear = {
            "location": new_data[i].location,
            "crimeValue": new_data[i].crimes.years[x][crime],
            "year": x,

          }

          newData.push(crimeYear);

        }

      }

    }

    console.log(newData);

    var dataGroup = d3.nest()
      .key(function (d) { return d.location; })
      .entries(newData);
    console.log(JSON.stringify(dataGroup));
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var vis = d3.select(this.div).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('class', 'svg-linechart');
    let xScale = d3.scaleLinear().range([this.margin.left, this.width - this.margin.right]).domain([d3.min(newData, function (d) {
      return d.year;
    }), d3.max(newData, function (d) {
      return d.year;
    })])
    let yScale = d3.scaleLinear().range([this.height - this.margin.top, this.margin.bottom]).domain([d3.min(newData, function (d) {
      return d.crimeValue;
    }), d3.max(newData, function (d) {
      return d.crimeValue;
    })])
    let xAxis = d3.axisTop()
      .scale(xScale)
    let yAxis = d3.axisLeft()
      .scale(yScale)
    let lSpace = this.width / dataGroup.length;
    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(xAxis);
    vis.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (this.margin.left) + ",0)")
      .call(yAxis);

    var lineGen = d3.line()
      .x(function (d) {
        return xScale(d.year);
      })
      .y(function (d) {
        return yScale(d.crimeValue);
      })
    dataGroup.forEach(function (d, i) {
      vis.append('svg:path')
        .attr('d', lineGen(d.values))
        .attr('stroke', function (d, j) {
          return "hsl(" + Math.random() * 360 + ",100%,50%)";
        })
        .attr('stroke-width', 2)
        .attr('id', 'line_' + d.key)
        .attr('fill', 'none');

      vis.append("text")
        .attr("x", (lSpace / 2) + i * lSpace)
        .attr("y", this.height)
        .style("fill", "black")
        .attr("class", "legend")
        .on('click', function () {
          var active = d.active ? false : true;
          var opacity = active ? 0 : 1;
          d3.select("#line_" + d.key).style("opacity", opacity);
          d.active = active;
        })
        .text(d.key);

    });

  }


  filter() {

  }

}


export { LineChart as default };