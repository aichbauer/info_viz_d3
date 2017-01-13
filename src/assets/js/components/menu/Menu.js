import * as d3 from 'd3';
import MapChart from '../charts/MapChart';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';

class Menu {

  constructor(dataAsJSON, divClass) {


    this.inputYear = d3.select(divClass).append('select');
    this.inputYear
      .attr('id', 'menu-year-selection');

    this.inputCrime = d3.select(divClass).append('select');
    this.inputCrime.attr('id', 'menu-crime-selection');

    this.button = d3.select(divClass).append('button');
    this.button.html('Show Data');

    const checkAbs = d3.select(divClass).append('div');
    const checkRate = d3.select(divClass).append('div');

    this.radioValueRate = checkRate.append('input');
    this.radioValueRate.attr('id', 'menu-rate')
      .attr('type', 'radio')
      .attr('value', 'rate')
      .attr('name', 'valueRate');
    checkRate.append('label').text('rate');

    this.radioValueAbs = checkAbs.append('input');
    this.radioValueAbs.attr('id', 'menu-abs')
      .attr('type', 'radio')
      .property('checked', true)
      .attr('value', 'abs')
      .attr('name', 'valueRate');
    checkAbs.append('label').text('absolute');


    d3.json(dataAsJSON, (error, json) => {
      this.data = json;

      let years = Object.keys(this.data[0].crimes.years);
      for (let i of years) {

        let option = this.inputYear.append('option');
        option.html(i);
        option.attr('value', i);

        if (i === '2015') option.attr('selected', 'selected');

      }
      let crimes = Object.keys(this.data[0].crimes.years['2009']);

      for (let i of crimes) {

        let option = this.inputCrime.append('option');
        option.html(i);
        option.attr('value', i);

        if (i === 'Murder.and.nonnegligent.manslaughter') option.attr('selected', 'selected');

      }
      this.render(dataAsJSON);
    });
  }


  render(data) {

    let mapChartHeight = 500;
    let mapCharttWidth = 960;
    let myMapChart = new MapChart({ top: 40, bottom: 10, left: 120, right: 20 }, mapCharttWidth, mapChartHeight, '.wrapper-map', './assets/data/Crime_Region.json', './assets/data/us-states.json');

    let barchartHeight = window.innerWidth / 2;
    let barchartWidth = window.innerWidth / 2;
    let myBarChart = new BarChart({ top: 40, bottom: 10, left: 120, right: 20 }, barchartWidth, barchartHeight, '.wrapper-barchart', './assets/data/Crime_Region_old.json');

    let linechartHeight = window.innerHeight / 3;
    let linechartWidth = window.innerWidth;
    new LineChart({ top: 40, bottom: 10, left: 120, right: 20 }, linechartWidth, linechartHeight, '.wrapper-graph', './assets/data/Crime_Region_old.json');

    this.button
      .on('click', function (event) {

        d3.event.preventDefault();
        var selYear = document.getElementById('menu-year-selection');
        selYear = selYear.options[selYear.selectedIndex].value;
        console.log(selYear);
        var selCrime = document.getElementById('menu-crime-selection');
        selCrime = selCrime.options[selCrime.selectedIndex].value;
        console.log(selCrime);
        myMapChart.filter(data, selYear, selCrime);
        myBarChart.filter(data, selYear, selCrime);
      });
  }

}


export { Menu as default };