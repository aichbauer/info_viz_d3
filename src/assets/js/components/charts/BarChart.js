// import every dependency that we need (npm install)
import * as d3 from 'd3';
import LineChart from './LineChart';

// Class -> constructor gets called when using ### new ### statement
class BarChart {

  /**
   *
   *
   * Constructor, gets class variables in initial state and calls render function
   * @param {Object} margin - e.g. { top: 40, bottom: 10, left: 120, right: 20 }
   * @param {Number} width - e.g. 100
   * @param {Number} height - e.g. 200
   * @param {String} barchartDivClass - e.g .myExampleBarChartDiv
   * @param {String} dataAsJSON - e.g ./the/path/to/my/json/file.json
   *
   */
  constructor(margin, width, height, barchartDivClass, dataAsJSON) {

    // binding this to that for closure
    const that = this;

    // class variables
    this.margin = margin;
    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;

    // append a div for our tooltip
    this.div = d3.select(barchartDivClass).append('div')
      .attr('class', 'tooltipBar');

    // RADIO BUTTONS START (they have to be structured like that -> bootstrap v4-alpha6)
    // radio wrapper
    this.wrapperRadio = d3.select(barchartDivClass).append('div')
      .attr('class', 'wrapperRadio');
    // RADIO BUTTONS
    this.wrapperRadioBar = d3.select(barchartDivClass).append('div')
      .attr('class', 'wrapperRadioBar');

    this.controlStacked = this.wrapperRadioBar.append('div')
    // controll wrapper
    this.controlStacked = this.wrapperRadio.append('div')
      .attr('class', 'custom-controls-stacked');

    // radio button wrapper1
    this.customRadio1 = this.controlStacked.append('label')
      .attr('class', 'custom-control custom-radio');

    // radio button wrapper2
    this.customRadio2 = this.controlStacked.append('label')
      .attr('class', 'custom-control custom-radio');

    // the real radio button input for desc order
    this.radioValueDesc = this.customRadio1.append('input')
      .attr('class', 'custom-control-input')
      .attr('id', 'desc')
      .attr('type', 'radio')
      .attr('value', 'desc')
      .attr('name', 'sortStyle')
      .property('checked', 'checked');

    // span for indicator (= second ring around radiobtn)
    this.customRadio1.append('span')
      .attr('class', 'custom-control-indicator');

    // description for the radiobtn
    this.customRadio1.append('span')
      .attr('class', 'custom-control-description description')
      .text('sort descending');

    // the real radio button input for asc order checked by default
    this.radioValueAsc = this.customRadio2.append('input')
      .attr('class', 'custom-control-input')
      .attr('id', 'asc')
      .attr('type', 'radio')
      .attr('value', 'asc')
      .attr('name', 'sortStyle');

    // span for indicator (= second ring around radiobtn)
    this.customRadio2.append('span')
      .attr('class', 'custom-control-indicator');

    // description for the radiobtn
    this.customRadio2.append('span')
      .attr('class', 'custom-control-description description')
      .text('sort ascending');

    // click function for asc order (= filter data and reorder bars on chart)
    this.radioValueAsc
      .on('click', function (e) {

        // get the current value from the dropdowns in the menu, year and crime
        let selYear = document.getElementById('menu-year-selection');
        selYear = selYear.options[selYear.selectedIndex].value;
        let selCrime = document.getElementById('menu-crime-selection');
        selCrime = selCrime.options[selCrime.selectedIndex].value;

        // reorder the data
        that.filter(dataAsJSON, selYear, selCrime, 'asc');

      });

    // click function for desc order (= filter data and reorder bars on chart)
    this.radioValueDesc
      .on('click', function (e) {

        // get the current value from the dropdowns in the menu, year and crime
        let selYear = document.getElementById('menu-year-selection');
        selYear = selYear.options[selYear.selectedIndex].value;
        let selCrime = document.getElementById('menu-crime-selection');
        selCrime = selCrime.options[selCrime.selectedIndex].value;

        // reorder the data
        that.filter(dataAsJSON, selYear, selCrime, 'desc');

      });
    // RADIO BUTTONS END

    // SVG START
    // svg -< append svg to barchartwrapper
    this.svg = d3.select(barchartDivClass).append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
      .attr('class', 'svg-barchart');

    // append a svg group to the svg we created before
    // transform translate for margin...
    this.g = this.svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    // SVG END

    // SCALE AND AXIS START
    // create the scale
    this.xscale = d3.scaleLinear().range([0, this.width]);
    this.yscale = d3.scaleBand().rangeRound([0, this.height]).paddingInner(0.1);

    // binding scale to axis, appending it to our svg grou we created before
    this.xaxis = d3.axisTop().scale(this.xscale);
    this.g_xaxis = this.g.append('g').attr('class', 'x axis');
    this.yaxis = d3.axisLeft().scale(this.yscale);
    this.g_yaxis = this.g.append('g').attr('class', 'y axis');
    // SCALE AND AXIS END

    // d3 read json
    d3.json(dataAsJSON, (error, json) => {

      // bind data to this.data and render with initial state (= es default value passed in args from render func)
      this.data = json;
      this.render(this.data);

    });

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
  barFillCol(crimeName, alphaVal) {

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


  /**
   *
   *
   * Function creates a sorted array, desc or asc
   * fill color for our bars returns different color for different crime
   * @param {Object} data - e.g. {json: file}
   * @param {String} crime - e.g. Violent.crime.number
   * @param {Number} year - e.g. 2015
   *
   */
  sortDataByValue(data, crime, year) {
    let swapped;

    do {
      swapped = false;

      for (let i = 0; i < data.length - 1; i++) {

        if (data[i].crimes.years[crime][year] > data[i + 1].crimes.years[crime][year]) {

          let temp = data[i];

          data[i] = data[i + 1];
          data[i + 1] = temp;
          swapped = true;

        } // End if

      } // END for

    } while (swapped);
  }


  /**
   *
   *
   * Creates a svg barchart with current data input, sorted asc or desc
   * @param {Object} new_data - e.g. {json: file}
   * @param {Number} year - e.g. 2015
   * @param {String} crime - e.g. Violent.crime.number
   * @param {String} order - e.g. desc or asc;
   *
   */
  render(new_data, year = '2015', crime = 'Murder.and.nonnegligent.manslaughter', order) {

    // get the order (= asc, desc) from the current clicked radiotbn
    order = document.querySelector('input[name="sortStyle"]:checked').value;

    // SORT OR DATA START
    // sorts asc
    this.sortDataByValue(new_data, year, crime);

    // if its desc sort the data we got from `sortDataByValue` desc
    if (order == 'desc') {
      new_data.reverse();
    }
    // SORT OR DATA END

    // ALL VALUES AND HIGHEST VALUE START
    // saves all values for selected crimes, to calculate the opacity for the bars
    let allValues = [];
    let darkGrey = 'rgb(127, 127, 127)';

    for (let i = 0; i < new_data.length; i++) {
      allValues.push(new_data[i].crimes.years[year][crime]);
    }

    allValues.sort((a, b) => a - b).reverse();
    let highestVal = allValues[0];
    // ALL VALUES AND HIGHEST VALUE END

    //SCALE AND AXIS START
    // Create scale for x and y axis
    this.xscale.domain([0, d3.max(new_data, (d) => d.crimes.years[year][crime])]);
    this.yscale.domain(new_data.map((d) => d.location));

    // bind new scale to x axis e.g. years 2009-2015 or 0-100k crimes
    this.g_xaxis.call(this.xaxis);
    this.g_yaxis.call(this.yaxis);
    // SCALE AND AXIS END

    // RECT => BARS START
    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = this.g.selectAll('rect')
      .data(new_data, (d) => d.location);

    // ENTER
    // new elements
    const rect_enter = rect.enter().append('rect')
      .attr('x', 1) //set intelligent default values for animation
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', 0)
      .attr('class', 'unclickedBar');

    // ENTER + UPDATE
    // both old and new elemente
    rect.merge(rect_enter).transition()
      .attr('class', 'barchart-rect unclickedBar')
      .style('stroke', '7f7f7f')
      .attr('height', this.yscale.bandwidth() - 5)
      .attr('width', (d) => this.xscale(d['crimes']['years'][year][crime]))
      .attr('y', (d) => this.yscale(d.location))
      .style('fill', (d) => {

        // Get data value
        let value = d.crimes.years[year][crime];
        let opacityVal = 0.01 * ((value / highestVal) * 100);
        let fillCol = this.barFillCol(crime, opacityVal);

        return d3.rgb(fillCol);

      });

    // mouse events
    rect.merge(rect_enter)
      // MOUSEOVER START
      .on('mouseover', function (d) {

        // Change fill-col and stroke-width
        d3.select(this)
          .style('cursor', 'pointer')
          .style('stroke', '#002675')
          .style('stroke-width', '3');

        // Add Tooltip
        d3.selectAll('.tooltipBar').transition()
          .duration(200)
          .style("opacity", '1');
        // change the text of the tooltip filled with current hovered data
        d3.selectAll('.tooltipBar').html(
          d.location +
          ' (' + d.code + ')' +
          '<br/>' + 'Value: ' + d.crimes.years[year][crime])
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY + 50) + 'px');

      }) // MOUSEOVER END
        // MOUSEOVER START
      .on('mouseout', function (d) {

        // if its unlicked the stroke should change from hovered (= 5) to not hovered (= 1)
        d3.selectAll('.unclickedBar')
          .style('stroke', '7f7f7f')
          .style('stroke-width', '1');

        // make the tooltip invisible
        d3.selectAll('.tooltipBar').transition()
          .duration(500)
          .style("opacity", '0');
      }) // MOUSEOUT END
        // CLICK START
      .on('click', function (d) {

        // make all clicked bars unclicked and set stroke back from 5 to 1
        d3.selectAll('.clickedBar')
          .attr('class', 'unclickedBar')
          .style('stroke', '7f7f7f')
          .style('stroke-width', '1');

        // make this element clicked and set stroke to 5
        d3.select(this)
          .attr('class', 'clickedBar')
          .style('stroke-width', '5');

        // vars for the height and with for the linechart
        let linechartWidth = window.innerWidth;
        let linechartHeight = window.innerHeight / 3;

        // select the div weher the linechart should be rendered
        d3.select('.wrapper-graph').html('');

        // create a new instance of linechart with the data of current location and current ValueRate (= rate or abs)
        new LineChart({ top: 40, bottom: 10, left: 120, right: 20 }, linechartWidth, linechartHeight, '.wrapper-graph', './assets/data/Crime_Region.json', d.location, document.querySelector('input[name="valueRate"]:checked').value);

      });
      // CLICK END

    // EXIT
    // elements that aren't associated with data
    rect.exit().remove();
    // RECT END

  }

  /**
   *
   *
   * Calls the render function with new data
   * @param {Object} dataAsJSON - e.g. {json: file}
   * @param {Number} year - e.g. 2015
   * @param {String} crime - e.g. Violent.crime.number
   * @param {String} order - e.g. desc or asc;
   *
   */
  filter(dataAsJSON, year, crime, order) {

    // d3 read json
    d3.json(dataAsJSON, (error, json) => {

      // bind data to this.data and render with initial state (= es default value passed in args from render func)
      this.data = json;
      this.render(this.data, year, crime, order);

    });

  }

}


// exporting our class as default so that we can import it in our app... ### ./src/assets/js/index.js ###
export { BarChart as default };