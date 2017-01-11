// import every dependency that we need (npm install)
import * as d3 from 'd3';

// Class -> constructor gets called when using ### new ### statement
class BarChart {

  // arguments that are passed to the constructor are assigned to this.argument
  // this.argument is available in every function inside this class
  constructor(margin, width, height, barchartDivClass, dataAsJSON) {

    this.margin = margin;

    this.width = width - this.margin*2;
    this.height = height - this.margin*2;

    this.svg = d3.select(barchartDivClass).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin},${this.margin})`);

    this.data;

    this.xscale = d3.scaleLinear().range([0, width]);
    this.yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);

    this.xaxis = d3.axisTop().scale(this.xscale);
    this.g_xaxis = this.g.append('g').attr('class', 'x axis');
    this.yaxis = d3.axisLeft().scale(this.yscale);
    this.g_yaxis = this.g.append('g').attr('class', 'y axis');

    d3.json(dataAsJSON, (error, json) => {
      this.data = json;
      console.log(this.data);
      this.render(this.data);
    });

  }


  render(new_data) {
    
    this.xscale.domain([0, d3.max(new_data, (d) => d.crimes.years.Larceny.theft)]);
    this.yscale.domain(new_data.map((d) => d.location));
    
    this.g_xaxis.call(this.xaxis);
    this.g_yaxis.call(this.yaxis);

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = this.g.selectAll('rect').data(new_data, (d) => d.location);

    // ENTER
    // new elements
    const rect_enter = rect.enter().append('rect')
      .attr('x', 0) //set intelligent default values for animation
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', 0);
    rect_enter.append('title');

    // ENTER + UPDATE
    // both old and new elements
    rect.merge(rect_enter).transition()
      .attr('height', this.yscale.bandwidth())
      .attr('width', (d) => this.xscale(d.crimes))
      .attr('y', (d) => this.yscale(d.location));
    rect.merge(rect_enter).select('title').text((d) => d.location);
    // EXIT
    // elements that aren't associated with data
    rect.exit().remove();

  }


  filter() {



  }

}


// exporting our class as default so that we can import it in our app... ### ./src/assets/js/index.js ###
export { BarChart as default };