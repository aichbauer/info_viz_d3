import * as d3 from 'd3';
import MapChart from '../charts/MapChart';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';

class Menu {

  constructor(dataAsJSON, divClass) {

    const that = this;

    this.initConstruct = 0;

    this.valueRateAbs = 'abs';


    this.inputYear = d3.select(divClass).append('select');
    this.inputYear
      .attr('id', 'menu-year-selection');

    this.inputCrime = d3.select(divClass).append('select');
    this.inputCrime.attr('id', 'menu-crime-selection');

    this.button = d3.select(divClass).append('button');
    this.button.html('Show Data');

    const radioAbs = d3.select(divClass).append('div');
    const radioRate = d3.select(divClass).append('div');

    this.radioValueRate = radioRate.append('input');
    this.radioValueRate.attr('id', 'menu-rate')
      .attr('type', 'radio')
      .attr('value', 'rate')
      .attr('name', 'valueRate');
    radioRate.append('label').text('rate');

    this.radioValueAbs = radioAbs.append('input');
    this.radioValueAbs.attr('id', 'menu-abs')
      .attr('type', 'radio')
      .property('checked', 'checked')
      .attr('value', 'abs')
      .attr('name', 'valueRate');
    radioAbs.append('label').text('absolute');

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
        } else if (this.valueRateAbs == 'abs' && i.includes('rate') != true){
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