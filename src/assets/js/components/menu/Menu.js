import * as d3 from 'd3';
import MapChart from '../charts/MapChart';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';

class Menu {

  /**
   * 
   * 
   * Constructor, gets class variables in initial state and calls render function
   * @param {String} dataAsJSON - e.g ./the/path/to/my/json/file.json
   * @param {String} divClass - e.g .myExampleMenuWrapper
   * 
   */
  constructor(dataAsJSON, divClass) {

    // bind this to that
    const that = this;

    // initialize variables
    this.initConstruct = 0;
    this.valueRateAbs = 'abs';

    // append a img for logo
    d3.select(divClass).append('img')
      .attr('class', 'logo');


    // INPUT FIELDS
    this.wrapperInput = d3.select(divClass).append('div')
      .attr('class', 'wrapperInput');

    this.inputYear = this.wrapperInput.append('select');
    this.inputYear
      .attr('id', 'menu-year-selection')
      .attr('class', 'form-control');

    this.inputCrime = this.wrapperInput.append('select');
    this.inputCrime.attr('id', 'menu-crime-selection')
      .attr('class', 'form-control');
    // INPUT FIELDS END


    // RADIO BUTTONS they have to be structured like that -> bootstrap v4-alpha6)
    // radio wrapper
    this.wrapperRadio = d3.select(divClass).append('div')
      .attr('class', 'wrapperRadio');

    // controll wrapper 
    this.controlStacked = this.wrapperRadio.append('div')
      .attr('class', 'custom-controls-stacked');

    // radio button wrapper1
    this.customRadio1 = this.controlStacked.append('label')
      .attr('class', 'custom-control custom-radio');

    // radio button wrapper2
    this.customRadio2 = this.controlStacked.append('label')
      .attr('class', 'custom-control custom-radio');

    // the real radio button input for rate
    this.radioValueRate = this.customRadio1.append('input')
      .attr('class', 'custom-control-input')
      .attr('id', 'menu-rate')
      .attr('type', 'radio')
      .attr('value', 'rate')
      .attr('name', 'valueRate');

    // span for indicator (= second ring around radiobtn)
    this.customRadio1.append('span')
      .attr('class', 'custom-control-indicator');

    // description for the radiobtn
    this.customRadio1.append('span')
      .attr('class', 'custom-control-description description')
      .text('rate');

    // the real radio button input for rate
    this.radioValueAbs = this.customRadio2.append('input')
      .attr('class', 'custom-control-input')
      .attr('id', 'menu-abs')
      .attr('type', 'radio')
      .attr('value', 'abs')
      .attr('name', 'valueRate')
      .property('checked', 'checked');

    // span for indicator (= second ring around radiobtn)
    this.customRadio2.append('span')
      .attr('class', 'custom-control-indicator');

    // description for the radiobtn
    this.customRadio2.append('span')
      .attr('class', 'custom-control-description description')
      .text('absolute');

    // click function for abs order (= filter dropdown for abs)
    this.radioValueAbs
      .on('click', function () {
        that.inputCrime.html("");
        that.inputYear.html("");
        that.valueRateAbs = 'abs';
        that.createDropDown(this.valueRate, dataAsJSON);

      });

    // click function for rate order (= filter dropdown for rate)
    this.radioValueRate
      .on('click', function () {

        that.inputCrime.html("");
        that.inputYear.html("");
        that.valueRateAbs = 'rate';
        that.createDropDown(this.valueRate, dataAsJSON);

      });
    // RADIO BUTTONS END

    // BUTTON
    this.button = d3.select(divClass).append('button')
      .attr('class', 'btn btn-outline-primary menuBtn')
      .text('Show Data');
    // BUTTON END

    // inizialize dropdown
    this.createDropDown(this.valueRate, dataAsJSON);

  }


  /**
   * 
   * 
   * initialize the charts and rerender if button is clicked
   * @param {Object} data - e.g. {json: file}
   * 
   */
  render(data) {

    // height, width for linechart, initialize linechart
    let linechartHeight = (window.innerHeight/2)-40;
    let linechartWidth = window.innerWidth;
    let lineChart = new LineChart({ top: 40, bottom: 10, left: 120, right: 20 }, linechartWidth, linechartHeight, '.wrapper-graph', './assets/data/Crime_Region.json');

    // height, width for map, initialize map
    let mapChartHeight =  window.innerHeight / 2;
    let mapCharttWidth = window.innerWidth / 2;
    let myMapChart = new MapChart({ top: 40, bottom: 10, left: 120, right: 20 }, mapCharttWidth, mapChartHeight, '.wrapper-map', './assets/data/Crime_Region.json', './assets/data/us-states.json', lineChart);

    // height, width for barchart, initialize barchart
    let barchartHeight = window.innerWidth;
    let barchartWidth = window.innerWidth / 2;
    let myBarChart = new BarChart({ top: 40, bottom: 10, left: 120, right: 20 }, barchartWidth, barchartHeight, '.wrapper-barchart', './assets/data/Crime_Region.json', lineChart);

    
    // clickfunction for button
    this.button
      .on('click', function (event) {

        // prevent the default button click
        d3.event.preventDefault();

        // select the current year and crime from the drop downs
        var selYear = document.getElementById('menu-year-selection');
        selYear = selYear.options[selYear.selectedIndex].value;
        var selCrime = document.getElementById('menu-crime-selection');
        selCrime = selCrime.options[selCrime.selectedIndex].value;

        // call filter (= rerender the charts with new data)
        myMapChart.filter(data, selYear, selCrime, lineChart);
        myBarChart.filter(data, selYear, selCrime, lineChart);

      });

  }


  /**
   * 
   * 
   * Create the dropdown for year and crime
   * @param {String} valueRate - e.g. abs or rate
   * @param {Object} dataAsJSON - e.g. {json: data}
   * 
   */
  createDropDown(valueRate, dataAsJSON) {

    // d3 read json
    d3.json(dataAsJSON, (error, json) => {

      // bind data to this.data
      this.data = json;

      // read the available years
      let years = Object.keys(this.data[0].crimes.years);
      // loop through years and append options, but before delete all other options
      // 2015 is the initial state
      for (let i of years) {

        let option = this.inputYear.append('option');
        option.html(i);
        option.attr('value', i);

        if (i === '2015') option.attr('selected', 'selected');

      }

      // read the available years
      let crimes = Object.keys(this.data[0].crimes.years['2009']);
      // loop through crimes and append options, but before delete all other options
      // 2015 is the initial state
      for (let i of crimes) {

        // if vale is rate and the current iterator includes rate then append the potion
        // else if if the value is abs and the itterator does not include rate add the option
        if (this.valueRateAbs == 'rate' && i.includes('rate')) {

          let option_1 = this.inputCrime.append('option');
          option_1.html(i);
          option_1.attr('value', i);

        } else if (this.valueRateAbs == 'abs' && i.includes('rate') != true) {

          let option_2 = this.inputCrime.append('option');
          option_2.html(i);
          option_2.attr('value', i);

          // initial state
          if (i === 'Murder.and.nonnegligent.manslaughter') option_2.attr('selected', 'selected');

        }

      }

      // if its initialConstruct then render and ++ the state
      if (this.initConstruct === 0) {

        this.render(dataAsJSON);
        this.initConstruct++;

      }

    });

  }

}


export { Menu as default };