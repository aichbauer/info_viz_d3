import * as d3 from 'd3';


class MapChart {

  constructor(margin, width, height, mapChartDivClass, dataAsJSON, geoData) {

    const that = this;
    this.geoData = geoData;
    this.darkGrey = 'rgb(127, 127, 127)';
    this.lightGrey = 'rgb(199, 199, 199)';
    this.tooltipPadding = '15px';

    this.inputYear = d3.select(mapChartDivClass).append('select');
    this.inputYear.attr('id', 'mapchart-year-selection');
    this.inputCrime = d3.select(mapChartDivClass).append('select');
    this.inputCrime.attr('id', 'mapchart-crime-selection');

    this.button = d3.select(mapChartDivClass).append('button');
    this.button.html('Click me');
    this.button
      .on('click', function (event) {

        d3.event.preventDefault();
        var selYear = document.getElementById('mapchart-year-selection');
        selYear = selYear.options[selYear.selectedIndex].value;
        var selCrime = document.getElementById('mapchart-crime-selection');
        selCrime = selCrime.options[selCrime.selectedIndex].value;
        that.filter(dataAsJSON, selYear, selCrime);
      });

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


    this.margin = margin;

    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;


    // CREATE SVG ELEMENT AND APPEND MAP TO SVG
    this.svg = d3.select(mapChartDivClass).append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
      .attr('class', 'svg-mapchart');
    this.g = this.svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // APPEND DIV FOR TOOLTIP TO SVG
    this.div = d3.select(mapChartDivClass).append('div')
      .attr('class', 'tooltip')
      .style('opacity', '0')
      .style('position', 'absolute')
      .style('background', this.darkGrey)
      .style('color', 'white')
      .style('font-family', 'sans-serif')
      .style('padding', this.tooltipPadding);


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

  mapFillCol(crimeName, alphaVal) {

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

  render(new_data, year = '2009', crime = 'Violent.crime.number') {

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

        // Bind the data to the SVG and create one path per GeoJSON feature
        this.svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .data(json.features)
          .merge(this.svg.selectAll('path'))
          .attr('d', this.path)
          .style('stroke', this.darkGrey)
          .style('stroke-width', '1')

          /**** DEFAULT FILL ****/
          .style('fill', function (d) {

            // Get data value
            value = d.properties.value;
            opacityVal = 0.01 * ((value / highestVal) * 100);

            // Define min opacity
            if (opacityVal < 0.3) {
              opacityVal += 0.2;
            }

            let fillCol = that.mapFillCol(crime, opacityVal);

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
            console.log(d.properties.code);
          })
          /**** MOUSEOVER ****/
          .on('mouseover', function (d) {

            // Change fill-col and stroke-width
            d3.select(this)
              .style('cursor', 'pointer')
              .style('fill', that.lightGrey)
              .style('stroke-width', '2');

            // Add Tooltip
            d3.selectAll('.tooltip').transition()
              .duration(200)
              .style("opacity", '1');
            d3.selectAll('.tooltip').html(
              d.properties.location +
              ' (' + d.properties.code + ')' +
              '<br/>' + 'Value: ' + d.properties.value)
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY + 50) + 'px');
          })

          /**** MOUSEOUT ****/
          .on('mouseout', function (d) {

            // Change it back to normal value
            d3.select(this)
              .style('stroke-width', 1)

              // Change color to default settings
              .style('fill', function (d) {

                // Get data value
                value = d.properties.value;
                opacityVal = 0.01 * ((value / highestVal) * 100);

                let fillCol = that.mapFillCol(crime, opacityVal);

                if (value) {
                  // If value exists…
                  return d3.rgb(fillCol);
                } else {
                  //If value is undefined…
                  return 'rgb(213,222,217)';
                }
              });



            d3.selectAll('.tooltip').transition()
              .duration(500)
              .style("opacity", '0');


          })// END MOUSEOUT

          .exit().remove();

      });// END SVG
    });


  }

  filter(dataAsJSON, year, crime) {


    this.render(dataAsJSON, year, crime);
  }
}

// exporting our class as default so that we can import it in our app... ### ./src/assets/js/index.js ###
export { MapChart as default };