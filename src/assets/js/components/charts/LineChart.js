import * as d3 from 'd3';


class LineChart {

  constructor(margin, width, height, linechartDivClass, dataAsJSON, location, valueRate) {

    this.margin = margin;

    this.div = linechartDivClass;

    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;

    d3.json(dataAsJSON, (error, json) => {
      this.data = json;
      this.render(this.data, location, valueRate);
    });

  }


  render(new_data, loc = '', valueRate = '') {

    const that = this;

    let crimesArray = Object.keys(new_data[0].crimes.years['2009']);
    crimesArray.shift();

    if (valueRate == 'rate') crimesArray = crimesArray.filter(/./.test.bind(new RegExp('.rate')));
    else if (valueRate == 'abs') {

      for (let x in crimesArray) {

        if (crimesArray[x].includes('.rate')) {

          crimesArray.splice(x, 1);

        }

      }

    }

    let newData = [];
    let cri;

    for (let i in new_data) {

      if (loc == new_data[i].location) {

        for (let y of crimesArray) {

          for (let x in new_data[i].crimes.years) {

            let crimeYear = {
              "crime": y,
              "crimeValue": new_data[i].crimes.years[x][y],
              "year": x,

            }

            newData.push(crimeYear);

          }

        }


      }

    }

    var dataGroup = d3.nest()
      .key(function (d) { return d.crime; })
      .entries(newData);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var vis = d3.select(this.div).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('class', 'svg-linechart');

    let xScale = d3.scaleLinear().range([this.margin.left, this.width - this.margin.right]).domain([d3.min(newData, function (d) {

      return d.year;

    }), d3.max(newData, function (d) {

      return d.year;

    })]);

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

    for (let i in dataGroup) {

      vis.append('svg:path')
        .attr('d', lineGen(dataGroup[i].values))
        .attr('stroke', function (d, j) {

          return that.lineFillCol(dataGroup[i].key, 1);

        })
        .attr('stroke-width', 2)
        .attr('id', 'line_' + dataGroup[i].key)
        .attr('fill', 'none');

    }

    let legend = d3.select(this.div)
      .append('div')
      .attr('class', 'legend');

    for (let i in dataGroup) {

      let legendColor = document.getElementById('line_' + dataGroup[i].key).getAttribute('stroke');
      let legendPart = legend.append('div')
        .attr('class', 'legendPart');

      let inner = legendPart.append('div')
        .attr('class', 'legendPart-bg')
        .style('background', legendColor)
        .style('width', 10)
        .style('height', 10);

      legendPart.append('div')
        .attr('class', 'legendPart-text')
        .text(dataGroup[i].key);
    }
  }

  filter() {

  }


  lineFillCol(crimeName, alphaVal) {

    let fillCol;

    switch (crimeName) {
      case 'Population':
        fillCol = d3.rgb(31, 119, 180, alphaVal);
        break;
      case 'Violent.crime.number':
      case 'Violent.crime.number.rate':
        fillCol = d3.rgb(148, 103, 189, alphaVal);
        break;
      case 'Murder.and.nonnegligent.manslaughter':
      case 'Murder.and.nonnegligent.manslaughter.rate':
        fillCol = d3.rgb(214, 39, 40, alphaVal);
        break;
      case 'Rape':
      case 'Rape.rate':
        fillCol = d3.rgb(255, 127, 14, alphaVal);
        break;
      case 'Robbery':
      case 'Robbery.rate':
        fillCol = d3.rgb(44, 160, 44, alphaVal);
        break;
      case 'Aggravated.assault':
      case 'Aggravated.assault.rate':
        fillCol = d3.rgb(140, 86, 75, alphaVal);
        break;
      case 'Property.crime':
      case 'Property.crime.rate':
        fillCol = d3.rgb(188, 189, 34, alphaVal);
        break;
      case 'Burglary':
      case 'Burglary.rate':
        fillCol = d3.rgb(23, 190, 207, alphaVal);
        break;
      case 'Larceny.theft':
      case 'Larceny.theft.rate':
        fillCol = d3.rgb(227, 119, 194, alphaVal);
        break;
      case 'Motor.vehicle.theft':
      case 'Motor.vehicle.theft.rate':
        fillCol = d3.rgb(102, 170, 0, alphaVal);
        break;
      default:
        break;
    }

    return fillCol;
  }

}




export { LineChart as default };