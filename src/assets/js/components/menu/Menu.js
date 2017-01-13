import * as d3 from 'd3';
import MapChart from '../charts/MapChart';
import BarChart from '../charts/BarChart';

class Menu {

  constructor(dataAsJSON, divClass) {

    this.inputYear = d3.select(divClass).append('select');
    this.inputYear.attr('id', 'menu-year-selection');
    this.inputCrime = d3.select(divClass).append('select');
    this.inputCrime.attr('id', 'menu-crime-selection');

    this.button = d3.select(divClass).append('button');
    this.button.html('Show Data');

    d3.json(dataAsJSON, (error, json) => {
      this.data = json;

      let years = Object.keys(this.data[0].crimes.years);
      for (let i of years) {

        let option = this.inputYear.append('option');
        option.html(i);
        option.attr('value', i);

      }
      let crimes = Object.keys(this.data[0].crimes.years['2009']);

      for (let i of crimes) {

        let option = this.inputCrime.append('option');
        option.html(i);
        option.attr('value', i);

      }
      this.render(dataAsJSON);
    });
  }


  render(data) {

    let MapChartHeight = 500;
    let MapCharttWidth = 960;
    let myMapChart = new MapChart({ top: 40, bottom: 10, left: 120, right: 20 }, MapCharttWidth, MapChartHeight, '.wrapper-map', './assets/data/Crime_Region.json', './assets/data/us-states.json');

    let BarchartHeight = window.innerWidth / 2;
    let BarchartWidth = window.innerWidth / 2;
    let myBarChart = new BarChart({ top: 40, bottom: 10, left: 120, right: 20 }, BarchartWidth, BarchartHeight, '.wrapper-barchart', './assets/data/Crime_Region_old.json');

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