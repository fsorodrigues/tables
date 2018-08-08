// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// setting up modules

// setting up accessory factory function

// defining global variables

// defining Factory function
function MapProjection(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:5, r:5, b:5, l:5};

    let _dispatch = d3.dispatch('node:enter','node:leave');

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = _;
        const container = d3.select(root);

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        // setting up geo projection
        const mapProjection = d3.geoMercator()
            .scale(8000)
            .center([-72.6037393,43.7741865])
            .translate([w/2,h/2]);

        const path = d3.geoPath()
            .projection(mapProjection);

        // setting up scale

        /* HEADER */
        // appending <div> node for header
        // enter-exit-update pattern

        // appending svg to node
        // enter, exit, update pattern

        // update selection
        let svgUpdate = container.selectAll('.map-totals')
            .data([1]);
        // update selection
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('map-totals', true);
        // exit selection
        svgUpdate.exit().remove();
        // enter + update
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('width', clientWidth)
            .attr('height', clientHeight)
            .style('background-color', 'gainsboro');

        // appending <g> to SVG
        let plotUpdate = svgUpdate.selectAll('.plot')
            .data([1]);
        const plotEnter = plotUpdate.enter()
            .append('g')
            .classed('plot',true);
        plotUpdate.exit().remove();
        plotUpdate = plotUpdate.merge(plotEnter)
            .attr('transform',`translate(${margin.l},${margin.t})`);

        let mapUpdate = plotUpdate.selectAll('.map-tile')
            .data([1]);
        const mapEnter = mapUpdate.enter()
            .append('g')
            .classed('map-tile',true);
        mapUpdate.exit().remove();
        mapUpdate = mapUpdate.merge(mapEnter);

        let stateNodesUpdate = mapUpdate.selectAll('.county')
            .data(data.features);
        const stateNodesEnter = stateNodesUpdate.enter()
            .append('path')
            .attr('id',d => `${d.properties.NAME}`.split(' ').join('-').toLowerCase())
            .classed('county',true);
        stateNodesUpdate.exit().remove();
        stateNodesUpdate = stateNodesUpdate.merge(stateNodesEnter)
            .attr('d', path)
            .style('stroke', '#696969')
            .style('stroke-width', 0.5)
            .style('fill', '#3CB371')
            .on('mouseenter',function(d) {
                const name = d.properties.NAME;
                _dispatch.call('node:enter',this,name);
            })
            .on('mouseleave',function(d) {
                _dispatch.call('node:leave',this,null);
            });
            // .on('click',function(d) {
            //     _dispatch.call();
            // });

        // const circleTile = plot.append('g')
        //     .classed('circle-tile',true);
        //
        // const circleNodes = circleTile.selectAll('.circle-node')
        //     .data(data)
        //     .enter()
        //     .append('circle')
        //     .classed('circle-node', true)
        //     .attr('id', d => d.key)
        //     .attr('cx', d => mapProjection([d.lon,d.lat])[0])
        //     .attr('cy', d => mapProjection([d.lon,d.lat])[1])
        //     .attr('r', d => scaleSize(d[_circleArea]))
        //     .attr('fill','black')
        //     .attr("fill-opacity", 0.6)
        //     .on('mouseenter', function(d) {
        //         _dispatch.call('circle:enter',this,d,tooltip);
        //     })
        //     .on('mouseleave', function(d) {
        //         _dispatch.call('circle:leave',this,d,tooltip);
        //     });

        /* FOOTER */
        // appending <div> node for footer

    }

    // create getter-setter pattern for customization
    exports.on = function(eventType,cb) {
        // eventType is a string ===> custom eventType
        // cb is a function ===> callback
        _dispatch.on(eventType,cb);
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default MapProjection;
