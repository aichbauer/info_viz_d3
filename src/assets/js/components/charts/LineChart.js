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
      .attr('class', 'svg-linechart');

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
    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(xAxis);

    vis.append("g")
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
        .attr('fill', 'none');

    }
    // GENERATE LINES END

    // CREATE THE LEGEND FOR LINE CHART START
    // append a div to our wrapper
    let legend = d3.select(this.div)
    .append('div')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('justify-content', 'flex-start')
    .style('flex-direction', 'row')
    .style('flex-wrap', 'wrap')
    .style('flex-flow', 'row wrap')
    .style('align-content', 'flex-end');

    // for every crimeValue 
    for (let i in dataGroup){

      // get the current stroke attr
      let legendColor = document.getElementById('line_' + dataGroup[i].key).getAttribute('stroke');

      // append a div to a div thats appended to the div we appended to the wrapper
      let legendpart = legend.append('div');
      let inner = legendpart.append('div');

      // add background color for legend
      inner.append('div')
      .style('background', legendColor)
      .style('width', 10)
      .style('height', 10)

      // add name of crime for legend
      inner.append('div')
      .text(dataGroup[i].key);
      // CREATE THE LEGEND FOR LINE CHART END
    
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

}


export { LineChart as default };