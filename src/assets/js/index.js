// Import every Class before you can use it
import BarChart from './components/charts/BarChart';
import LineChart from './components/charts/LineChart';
import MapChart from './components/charts/MapChart';
import Menu from './components/menu/Menu';

// Create a new object of BarChart Class ###   TEST   ###
let BarchartHeight = window.innerWidth/2;
let BarchartWidth = window.innerWidth/2;
new BarChart({top: 40, bottom: 10, left: 120, right: 20}, BarchartWidth, BarchartHeight, '.wrapper-barchart', './assets/data/Crime_Region_old.json');


let MapChartHeight = 500;
let MapCharttWidth = 960;
new MapChart({top: 40, bottom: 10, left: 120, right: 20}, MapCharttWidth, MapChartHeight, '.wrapper-map', './assets/data/Crime_Region.json', './assets/data/us-states.json'); 
