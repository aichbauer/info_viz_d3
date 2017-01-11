// Import every Class before you can use it
import BarChart from './components/charts/BarChart';
import LineChart from './components/charts/LineChart';
import MapChart from './components/charts/MapChart';
import Menu from './components/menu/Menu';
import * as d3 from 'd3';

// Import data
d3.csv("../assets/data/CrimeInTheUS_Volume_Rate_per_100000_inhabitants_1996-2015.csv", function(data) {
  console.log(data);
});

// Create a new object of BarChart Class ###   TEST   ###
new BarChart(10,200,200,'.wrapper-barchart','./assets/data/test.json');


