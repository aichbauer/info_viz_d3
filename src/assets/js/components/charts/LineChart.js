import * as d3 from 'd3';


class LineChart {

  /**
   *
   *
   * Constructor, gets class variables in initial state and calls render function
   * @param {Object} margin - e.g. { top: 40, bottom: 10, left: 120, right: 20 }
   * @param {Number} width - e.g. 100
   * @param {Number} height - e.g. 200
   * @param {String} linechartDivClass - e.g .myExampleLineChartWrapperDiv
   * @param {String} dataAsJSON - e.g ./the/path/to/my/json/file.json
   * @param {String} location - e.g New York
   * @param {String} valueRate - e.g abs or rate
   *
   */
  constructor(margin, width, height, linechartDivClass, dataAsJSON, location, valueRate) {

    // set class variables
    this.margin = margin;
    this.div = linechartDivClass;
    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;

    // d3 read json
    d3.json(dataAsJSON, (error, json) => {

      // bind data to this.data and render with initial state (= es default value passed in args from render func)
      this.data = json;
      this.render(this.data, location, valueRate);

    });

  }

  /**
   *
   *
   * Creates a Svg with a multilinechart of the current data passed to it
   * @param {Object} new_data - e.g. {json: file}
   * @param {String} loc - e.g. New York
   * @param {String} valueRate - e.g. abs or rate
   *
   */
  render(new_data, loc = '', valueRate = '') {

    // bind this to that
    const that = this;

    // get an array of all crimes
    let crimesArray = Object.keys(new_data[0].crimes.years['2009']);
    // delete population out of the array, first element in array
    crimesArray.shift();

    // FILTER ARRAY START
    // filter array, if valuerate... delete element that are not selected abs or rate
    if (valueRate == 'rate') crimesArray = crimesArray.filter(/./.test.bind(new RegExp('.rate')));
    else if (valueRate == 'abs') {

      for (let x in crimesArray) {

        if (crimesArray[x].includes('.rate')) {

          crimesArray.splice(x, 1);

        }

      }

    }
    // FILTER ARRAY END

    // CREATE NEW DATA STRUCTURE FOR MULTILINE CHARTS
    let newData = [];
    let cri;

    // loop over new_data
    for (let i in new_data) {

      // if its the selected location
      if (loc == new_data[i].location) {

        // for every crime
        for (let y of crimesArray) {

          // for every year
          for (let x in new_data[i].crimes.years) {

            // create a new object with crime, vale and year
            let crimeYear = {
              "crime": y,
              "crimeValue": new_data[i].crimes.years[x][y],
              "year": x,

            }

            // add it to array
            newData.push(crimeYear);

          }

        }

      }

    }
    // CREATE NEW DATA STRUCTURE FOR MULTILINE CHARTS END

    // create the structure for multiline charts key is crime (nesting)
    let dataGroup = d3.nest()
      .key(function (d) {

        return d.crime;

      })
      .entries(newData);

    // append svg to our wrapper
    let vis = d3.select(this.div).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('class', 'svg-linechart')
      .attr('id', 'svg');

    // SCALE AND AXIS START
    // create the scaleung in the range min to max data for x and y
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

    // bind scaling to x and y axis
    let xAxis = d3.axisTop()
      .scale(xScale)

    let yAxis = d3.axisLeft()
      .scale(yScale)


    // append a svg group to our svg
    // append x and y axis (call)
    let g = vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(xAxis);

    // APPEND DIV FOR tooltipMap TO SVG
    let tooltip = d3.select(this.div).append('div')
      .attr('class', 'tooltipLine')
      .style('position', 'absolute')
      .style('opacity', '0')
      .style('background-color', '#002675')
      .style('color', '#fff')
      .style('padding', '15px');

    g = vis.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (this.margin.left) + ",0)")
      .call(yAxis);
    // SCALE AND AXIS END

    // GENERATE LINES START
    // function a line dependent on the curret data, binding x and y to the year and crimevalue
    var lineGen = d3.line()
      .x(function (d) {

        return xScale(d.year);

      })
      .y(function (d) {

        return yScale(d.crimeValue);

      })

    // now for every dataentry (the json we created out of the new_data (we transformed that))
    // create a line
    for (let i in dataGroup) {

      // append a path to our svg
      vis.append('svg:path')
        .attr('d', lineGen(dataGroup[i].values))
        .attr('stroke', function (d, j) {

          // color our stroke with the current crime color
          return that.lineFillCol(dataGroup[i].key, 1);

        })
        .attr('stroke-width', 2)
        .attr('id', 'line_' + dataGroup[i].key)
        .attr('fill', 'none')

        /**** MOUSEOVER ****/
        .on('mouseover', function (d) {

          let values = [];
          let years = [];

          for (let j = 0; j < dataGroup[i].values.length; j++) {

            years.push(dataGroup[i].values[j].year);
            values.push(dataGroup[i].values[j].crimeValue);

            // Change fill-col and stroke-width
            d3.select(this)
              .style('cursor', 'pointer')
              .style('stroke-width', '5');

            // Add tooltipMapMap
            d3.selectAll('.tooltipLine')
              .transition()
              .duration(200)
              .style("opacity", '1')
              .style('z-index', '999999');

            d3.selectAll('.tooltipLine').html(
              'Crime: ' + dataGroup[i].key +
              '<br/>' + years[0] + ': ' + values[0] +
              '<br/>' + years[1] + ': ' + values[1] +
              '<br/>' + years[2] + ': ' + values[2] +
              '<br/>' + years[3] + ': ' + values[3] +
              '<br/>' + years[4] + ': ' + values[4] +
              '<br/>' + years[5] + ': ' + values[5] +
              '<br/>' + years[6] + ': ' + values[6]
            )
              .style('left', (d3.mouse(this)[0]) + 'px')
              .style('top', (d3.mouse(this)[1] - 250) + 'px');
          }
        })

        .on('mouseout', function (d) {

          // if its unlicked the stroke should change from hovered (= 5) to not hovered (= 1)
          d3.select(this)
            .style('stroke-width', '2');

          // make the tooltip invisible
          d3.selectAll('.tooltipLine').transition()
            .duration(500)
            .style("opacity", '0');
        }); // MOUSEOUT END

    }
    // GENERATE LINES END

    // CREATE THE LEGEND FOR LINE CHART START
    // append a div to our wrapper
    let legend = d3.select(this.div)
      .append('div')
      .attr('class', 'legend');

    // for every crimeValue
    for (let i in dataGroup) {

      // get the current stroke attr
      let legendColor = document.getElementById('line_' + dataGroup[i].key).getAttribute('stroke');
      let legendPart = legend.append('div')
        .attr('class', 'legendPart');

      // add background color for legend
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


  /**
     *
     *
     * fill color for our bars returns different color for different crime
     * @param {String} crimeName - e.g. Violent.crime.number
     * @param {Number} alphaVal - e.g. 0.2 (= int between 0 and 1)
     * @returns {Object} The rgba value for the specified crimeName
     *
     */
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


  filter(new_data, location, valueRate) {

    // d3 read json
    d3.json(new_data, (error, json) => {

      // bind data to this.data and render with initial state (= es default value passed in args from render func)
      this.data = json;
      this.render(this.data, location, valueRate);

    });

  }

}


export { LineChart as default };