// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// importing utitily functions
// import {isMobile} from '../utils';

// instantiating components & accessories
// const mobile = isMobile();

// defining global variables

// defining Factory function
function Legend(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:5, r:5, b:5, l:5};
    let _rectLength = 355;

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = _;
        const svg = d3.select(root)
            .select('.svg-map');

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        // Append a defs (for definition) element to your SVG
        const defs = svg.append('defs');

        // Append a linearGradient element to the defs and give it a unique id
        const linearGradient = defs.append('linearGradient')
            .attr('id', 'linear-gradient');

        linearGradient.attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        // Set the color for the start (0%)
        linearGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', d3.rgb('#8FBC8F')); //light blue

        // Set the color for the end (100%)
        linearGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', d3.rgb('#2E8B57')); //dark blue

        let wrapperUpdate = svg.selectAll('.legend-wrapper')
            .data([1]);
        const wrapperEnter = wrapperUpdate.enter()
            .append('g')
            .classed('legend-wrapper',true);
        wrapperUpdate.exit().remove();
        wrapperUpdate = wrapperUpdate.merge(wrapperEnter)
            .attr('transform', `translate(${margin.l},${margin.t})`);

        let plotUpdate = wrapperUpdate.selectAll('.legend')
            .data([1]);
        const plotEnter = plotUpdate.enter()
            .append('g')
            .classed('legend',true);
        plotUpdate.exit().remove();
        plotUpdate = plotUpdate.merge(plotEnter)
            .attr('transform', `translate(${w/2-_rectLength/3.5},${9*margin.t})`);

        let gradientRectUpdate = plotUpdate.selectAll('.legend-gradient')
            .data([1]);
        const gradientRectEnter = gradientRectUpdate.enter()
            .append('rect')
            .classed('legend-gradient',true);
        gradientRectUpdate.exit().remove();
        gradientRectUpdate = gradientRectUpdate.merge(gradientRectEnter)
            .attr('width', _rectLength/2)
            .attr('height', 20)
            .style('fill-opacity', 0.85)
            .style('fill', 'url(#linear-gradient)');

        const min = d3.min(data.map(d => d.shortage.length));
        const max = d3.max(data.map(d => d.shortage.length));

        let labelLeftUpdate = plotUpdate.selectAll('.label-left')
            .data([min]);
        const labelLeftEnter = labelLeftUpdate.enter()
            .append('text')
            .classed('label-left',true)
            .classed('label-text',true);
        labelLeftUpdate.exit().remove();
        labelLeftUpdate = labelLeftUpdate.merge(labelLeftEnter)
            .attr('transform', `translate(${-2*margin.l},${15})`)
            .text(d => d);

        let labelRightUpdate = plotUpdate.selectAll('.label-right')
            .data([max]);
        const labelRightEnter = labelRightUpdate.enter()
            .append('text')
            .classed('label-right',true)
            .classed('label-text',true);
        labelRightUpdate.exit().remove();
        labelRightUpdate = labelRightUpdate.merge(labelRightEnter)
            .attr('transform', `translate(${_rectLength/2+margin.l/1.5},${15})`)
            .text(d => d);

        let legendTitleUpdate = plotUpdate.selectAll('.legend-title')
            .data(['Number of jobs in shortage']);
        const legendTitleEnter = legendTitleUpdate.enter()
            .append('text')
            .classed('legend-title',true);
        legendTitleUpdate.exit().remove();
        legendTitleUpdate = legendTitleUpdate.merge(legendTitleEnter)
            .attr('transform', `translate(${3*margin.l},${-margin.l})`)
            .text(d => d);

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
export default Legend;
