import * as d3 from 'd3';
import MapChart from '../charts/MapChart';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';

class Menu {

  constructor(dataAsJSON, divClass) {

    const that = this;

    this.initConstruct = 0;

    this.valueRateAbs = 'abs';

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


    // RADIO BUTTONS

    this.wrapperRadio = d3.select(divClass).append('div')
      .attr('class', 'wrapperRadio');

    this.controlStacked = this.wrapperRadio.append('div')
      .attr('class', 'custom-controls-stacked');

    this.customRadio1 = this.controlStacked.append('label')
      .attr('class', 'custom-control custom-radio');

    this.customRadio2 = this.controlStacked.append('label')
      .attr('class', 'custom-control custom-radio');

    this.radioValueRate = this.customRadio1.append('input')
      .attr('class', 'custom-control-input')
      .attr('id', 'menu-rate')
      .attr('type', 'radio')
      .attr('value', 'rate')
      .attr('name', 'valueRate');

    this.customRadio1.append('span')
      .attr('class', 'custom-control-indicator');

    this.customRadio1.append('span')
      .attr('class', 'custom-control-description description')
      .text('rate');

    this.radioValueAbs = this.customRadio2.append('input')
      .attr('class', 'custom-control-input')
      .attr('id', 'menu-abs')
      .attr('type', 'radio')
      .attr('value', 'abs')
      .attr('name', 'valueRate')
      .property('checked', 'checked');

    this.customRadio2.append('span')
      .attr('class', 'custom-control-indicator');

    this.customRadio2.append('span')
      .attr('class', 'custom-control-description description')
      .text('absolute');

    this.radioValueAbs
      .on('click', function () {
        that.inputCrime.html("");
        that.inputYear.html("");
        that.valueRateAbs = 'abs';
        that.createDropDown(this.valueRate, dataAsJSON);

      });

    this.radioValueRate
      .on('click', function () {

        that.inputCrime.html("");
        that.inputYear.html("");
        that.valueRateAbs = 'rate';
        that.createDropDown(this.valueRate, dataAsJSON);

      });

    this.button = d3.select(divClass).append('button')
      .attr('class', 'btn btn-outline-primary menuBtn')
      .text('Show Data');

    this.createDropDown(this.valueRate, dataAsJSON);

  }


  render(data) {

    let mapChartHeight = 500;
    let mapCharttWidth = 960;
    let myMapChart = new MapChart({ top: 40, bottom: 10, left: 120, right: 20 }, mapCharttWidth, mapChartHeight, '.wrapper-map', './assets/data/Crime_Region.json', './assets/data/us-states.json');

    let barchartHeight = window.innerWidth;
    let barchartWidth = window.innerWidth / 2;
    let myBarChart = new BarChart({ top: 40, bottom: 10, left: 120, right: 20 }, barchartWidth, barchartHeight, '.wrapper-barchart', './assets/data/Crime_Region.json');

    let linechartHeight = window.innerHeight / 3;
    let linechartWidth = window.innerWidth;
    new LineChart({ top: 40, bottom: 10, left: 120, right: 20 }, linechartWidth, linechartHeight, '.wrapper-graph', './assets/data/Crime_Region.json');

    this.button
      .on('click', function (event) {

        d3.event.preventDefault();
        var selYear = document.getElementById('menu-year-selection');
        selYear = selYear.options[selYear.selectedIndex].value;
        var selCrime = document.getElementById('menu-crime-selection');
        selCrime = selCrime.options[selCrime.selectedIndex].value;
        myMapChart.filter(data, selYear, selCrime);
        myBarChart.filter(data, selYear, selCrime);
      });
  }


  createDropDown(valueRate, dataAsJSON) {

    d3.json(dataAsJSON, (error, json) => {
      this.data = json;

      this.inputCrime.empty();

      let years = Object.keys(this.data[0].crimes.years);
      for (let i of years) {

        let option = this.inputYear.append('option');
        option.html(i);
        option.attr('value', i);

        if (i === '2015') option.attr('selected', 'selected');

      }
      let crimes = Object.keys(this.data[0].crimes.years['2009']);

      for (let i of crimes) {

        if (this.valueRateAbs == 'rate' && i.includes('rate')) {
          let option_1 = this.inputCrime.append('option');
          option_1.html(i);
          option_1.attr('value', i);
        } else if (this.valueRateAbs == 'abs' && i.includes('rate') != true) {
          let option_2 = this.inputCrime.append('option');
          option_2.html(i);
          option_2.attr('value', i);
          if (i === 'Murder.and.nonnegligent.manslaughter') option_2.attr('selected', 'selected');
        }
      }

      if (this.initConstruct === 0) {

        this.render(dataAsJSON);
        this.initConstruct++;

      }
    });

  }

}


export { Menu as default };