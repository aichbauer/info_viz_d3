// import every dependency that we need (npm install)
import * as d3 from 'd3';

// Class -> constructor gets called when using ### new ### statement
class BarChart {

  // arguments that are passed to the constructor are assigned to this.argument
  // this.argument is available in every function inside this class
  constructor(margin, width, height, barchartDivClass, dataAsJSON) {

    const that = this;

    this.margin = margin;

    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;

    this.svg = d3.select(barchartDivClass).append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
      .attr('class', 'svg-barchart');
    this.g = this.svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.data;

    this.xscale = d3.scaleLinear().range([0, this.width]);
    this.yscale = d3.scaleBand().rangeRound([0, this.height]).paddingInner(0.1);

    this.xaxis = d3.axisTop().scale(this.xscale);
    this.g_xaxis = this.g.append('g').attr('class', 'x axis');
    this.yaxis = d3.axisLeft().scale(this.yscale);
    this.g_yaxis = this.g.append('g').attr('class', 'y axis');

    d3.json(dataAsJSON, (error, json) => {
      this.data = json;
      this.render(this.data);
    });

  }

  barFillCol(crimeName, alphaVal) {

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


  render(new_data, year = '2015', crime = 'Murder.and.nonnegligent.manslaughter') {

    this.xscale.domain([0, d3.max(new_data, (d) => d['crimes']['years'][year][crime])]);
    this.yscale.domain(new_data.map((d) => d.location));

    this.g_xaxis.call(this.xaxis);
    this.g_yaxis.call(this.yaxis);

    let allValues = [];
    let darkGrey = 'rgb(127, 127, 127)';

    for (let i = 0; i < new_data.length; i++) {
      allValues.push(new_data[i].crimes.years[year][crime]);
    }

    allValues.sort((a, b) => a - b).reverse();
    let highestVal = allValues[0];

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = this.g.selectAll('rect').data(new_data, (d) => d.location);

    // ENTER
    // new elements
    const rect_enter = rect.enter().append('rect')
      .attr('x', 0) //set intelligent default values for animation
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', 0)
    rect_enter.append('title');

    // ENTER + UPDATE
    // both old and new elements
    rect.merge(rect_enter).transition()
      .attr('height', this.yscale.bandwidth())
      .attr('width', (d) => this.xscale(d['crimes']['years'][year][crime]))
      .attr('y', (d) => this.yscale(d.location))
      .style('stroke', darkGrey)
      .style('stroke-width', 1)
      .style('fill', (d) => {
        // Get data value
        let value = d['crimes']['years'][year][crime];
        let opacityVal = 0.01 * ((value / highestVal) * 100);

        // Define min opacity
        if (opacityVal < 0.3) {
          opacityVal += 0.2;
        }

        let fillCol = this.barFillCol(crime, opacityVal);

        return d3.rgb(fillCol);
      });
    rect.merge(rect_enter).select('title').text((d) => d.location);
    // EXIT
    // elements that aren't associated with data
    rect.exit().remove();

  }

  filter(dataAsJSON, year, crime) {

    d3.json(dataAsJSON, (error, json) => {
      this.data = json;
      this.render(this.data, year, crime);

    });
  }
}


// exporting our class as default so that we can import it in our app... ### ./src/assets/js/index.js ###
export { BarChart as default };