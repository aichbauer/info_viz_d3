// Import every Class before you can use it
import BarChart from './components/charts/BarChart';
import LineChart from './components/charts/LineChart';
import MapChart from './components/charts/MapChart';
import Menu from './components/menu/Menu';

// Create a new object of BarChart Class ###   TEST   ###
new BarChart(10, 200, 200, '.wrapper-barchart', './assets/data/Crime_Region.json');

new MapChart();


