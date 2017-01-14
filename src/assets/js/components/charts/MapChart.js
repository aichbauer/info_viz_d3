import * as d3 from 'd3';
import LineChart from './LineChart';


class MapChart {

  constructor(margin, width, height, mapChartDivClass, dataAsJSON, geoData) {

    const that = this;

    this.margin = margin;
    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;

    this.geoData = geoData;

    // D3 PROJECTION
    this.projection = d3.geoAlbersUsa()
      // translate to center of screen
      .translate([width / 2, height / 2])
      // scale things down so see entire US
      .scale([1000]);

    // DEFINE PATH GENERATOR
    // path generator that will convert GeoJSON to SVG paths
    this.path = d3.geoPath()
      // tell path generator to use albersUsa projection
      .projection(this.projection);

    // CREATE SVG ELEMENT AND APPEND MAP TO SVG
    this.svg = d3.select(mapChartDivClass).append('svg')
      .attr('class', 'svg-mapchart')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom);
    this.g = this.svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // APPEND DIV FOR tooltipMap TO SVG
    this.div = d3.select(mapChartDivClass).append('div')
      .attr('class', 'tooltipMap');

    this.render(dataAsJSON);
  }

  mapFillCol(crimeName, alphaVal) {

    let fillCol;

    switch (crimeName) {
      case 'Population':
        // lightblue
        fillCol = d3.rgb(31, 119, 180, alphaVal);
        break;
      case 'Violent.crime.number':
      case 'Violent.crime.number.rate':
        // lightpurple
        fillCol = d3.rgb(148, 103, 189, alphaVal);
        break;
      case 'Murder.and.nonnegligent.manslaughter':
      case 'Murder.and.nonnegligent.manslaughter.rate':
        // red
        fillCol = d3.rgb(214, 39, 40, alphaVal);
        break;
      case 'Rape':
      case 'Rape.rate':
        // orange
        fillCol = d3.rgb(255, 127, 14, alphaVal);
        break;
      case 'Robbery':
      case 'Robbery.rate':
        // dark-green
        fillCol = d3.rgb(44, 160, 44, alphaVal);
        break;
      case 'Aggravated.assault':
      case 'Aggravated.assault.rate':
        // brown
        fillCol = d3.rgb(140, 86, 75, alphaVal);
        break;
      case 'Property.crime':
      case 'Property.crime.rate':
        // yellow-brown
        fillCol = d3.rgb(188, 189, 34, alphaVal);
        break;
      case 'Burglary':
      case 'Burglary.rate':
        // turquoise
        fillCol = d3.rgb(23, 190, 207, alphaVal);
        break;
      case 'Larceny.theft':
      case 'Larceny.theft.rate':
        // light-pink
        fillCol = d3.rgb(227, 119, 194, alphaVal);
        break;
      case 'Motor.vehicle.theft':
      case 'Motor.vehicle.theft.rate':
        // light-green
        fillCol = d3.rgb(102, 170, 0, alphaVal);
        break;
      default:
        break;
    }

    return fillCol;
  }

  render(new_data, year = '2015', crime = 'Murder.and.nonnegligent.manslaughter') {

    const that = this;

    //////////////////////
    /// CREATE THE MAP ///
    //////////////////////

    // LOAD THE STATE DATA
    d3.json(new_data, (data) => {

      let allValues = [];

      // Load GeoJSON data and merge with states data
      d3.json(this.geoData, (json) => {

        // Loop through each state data value in the .json file
        for (let i = 0; i < data.length; i++) {

          // Grab State Name
          let dataState = data[i].location;

          // Grab the required data
          let dataValue = data[i].crimes.years[year][crime];
          let location = data[i].location;
          let code = data[i].code;

          /* We need to determine which state has the highest value
          * and then adjust the fill-opacity accordingly */
          allValues.push(dataValue);

          // Find the corresponding state inside the GeoJSON
          for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.name;

            if (dataState == jsonState) {

              // Copy the required data into the JSON
              json.features[j].properties.value = dataValue;
              json.features[j].properties.location = location;
              json.features[j].properties.code = code;

              // Stop looking through the JSON
              break;
            }
          }
        }

        // Get highest value
        allValues = allValues.sort((a, b) => a - b).reverse();
        let highestVal = allValues[0];

        let opacityVal = 1;
        let value = 0;

        let fillCol = 0;

        // Bind the data to the SVG and create one path per GeoJSON feature
        this.svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .data(json.features)
          .merge(this.svg.selectAll('path'))
          .attr('d', this.path)
          .style('stroke', '#7f7f7f')
          .attr('class', 'unclicked')
          .style('stroke-width', '1')

          /**** DEFAULT FILL ****/
          .style('fill', function (d) {

            // Get data value
            value = d.properties.value;
            opacityVal = 0.01 * ((value / highestVal) * 100);

            fillCol = that.mapFillCol(crime, opacityVal);

            if (value) {
              // If value exists…
              return d3.rgb(fillCol);
            } else {
              //If value is undefined…
              return 'rgb(213,222,217)';
            }
          })

          /**** ON-CLICK ****/
          .on('click', function (d) {

            d3.selectAll('.clicked')
              .attr('class', 'unclicked')
              .style('stroke', '#7f7f7f')
              .style('stroke-width', '1');

            d3.select(this)
              .attr('class', 'clicked')
              .style('stroke', '#002675')
              .style('stroke-width', '5');


            let linechartWidth = window.innerWidth;
            let linechartHeight = window.innerHeight / 3;

            d3.select('.wrapper-graph').html('');

            new LineChart({ top: 40, bottom: 10, left: 120, right: 20 }, linechartWidth, linechartHeight, '.wrapper-graph', './assets/data/Crime_Region.json', d.properties.location, document.querySelector('input[name="valueRate"]:checked').value);

          })
          /**** MOUSEOVER ****/
          .on('mouseover', function (d) {

            // Change fill-col and stroke-width
            d3.select(this)
              .style('cursor', 'pointer')
              .style('stroke', '#002675')
              .style('stroke-width', '5');

            // Add tooltipMapMap
            d3.selectAll('.tooltipMap').transition()
              .duration(200)
              .style("opacity", '1');
            d3.selectAll('.tooltipMap').html(
              d.properties.location +
              ' (' + d.properties.code + ')' +
              '<br/>' + 'Value: ' + d.properties.value)
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY + 50) + 'px');
          })

          /**** MOUSEOUT ****/
          .on('mouseout', function (d) {

            d3.selectAll('.unclicked')
              .style('stroke', '#7f7f7f')
              .style('stroke-width', '1');

            d3.selectAll('.tooltipMap').transition()
              .duration(500)
              .style("opacity", '0');

          })// END MOUSEOUT

          .exit().remove(); // END SVG

      });// END LOAD GEO DATA
    }); // END LOAD STATE DATA

  } // END RENDER

  filter(dataAsJSON, year, crime) {
    this.render(dataAsJSON, year, crime);
  }
}

// exporting our class as default so that we can import it in our app... ### ./src/assets/js/index.js ###
export { MapChart as default };