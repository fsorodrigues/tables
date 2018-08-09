// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// importing utitily functions
import {isMobile} from '../utils';

// instantiating components & accessories
const mobile = isMobile();

// defining global variables

// defining Factory function
function MapProjection(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:5, r:5, b:5, l:5};

    let _dispatch = d3.dispatch('node:enter','node:leave');

    function exports(featuresData,data) {
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
            .translate([w/2.19,h/1.7]);

        const path = d3.geoPath()
            .projection(mapProjection);

        const shortageMap = d3.map(data, d => d.county);

        // setting up scale
        const scaleColor = d3.scaleLinear()
            .domain(d3.extent(data.map(d => d.shortage.length)))
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb('#8FBC8F'), d3.rgb('#2E8B57')]);

        /* HEADER */
        // appending <div> node for header
        // enter-exit-update pattern

        // appending svg to node
        // enter, exit, update pattern

        // update selection
        let svgUpdate = container.selectAll('.svg-map')
            .data([1]);
        // update selection
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('svg-map', true);
        // exit selection
        svgUpdate.exit().remove();
        // enter + update
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('width', clientWidth)
            .attr('height', clientHeight);

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
            .data(featuresData.features);
        const stateNodesEnter = stateNodesUpdate.enter()
            .append('path')
            .attr('id',d => `${d.properties.NAME}`.split(' ').join('-').toLowerCase())
            .classed('county',true);
        stateNodesUpdate.exit().remove();
        stateNodesUpdate = stateNodesUpdate.merge(stateNodesEnter)
            .attr('d', path)
            .style('stroke', '#696969')
            .style('stroke-width', 0.5)
            .style('fill', d => scaleColor(
                shortageMap.get(d.properties.NAME).shortage.length
            ))
            .style('fill-opacity', 0.85);

        if (mobile) {
            stateNodesUpdate.on('click',function(d) {
                const isActive = d3.select(this).classed('active');
                if (isActive) {
                    _dispatch.call('node:leave',this,null);
                } else {
                    const name = d.properties.NAME;
                    _dispatch.call('node:enter',this,name);
                }
            });
        } else {
            stateNodesUpdate.on('mouseenter',function(d) {
                const name = d.properties.NAME;
                _dispatch.call('node:enter',this,name);
            })
            .on('mouseleave',function(d) {
                _dispatch.call('node:leave',this,null);
            });
        }

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
