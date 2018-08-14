// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets
import '../style/legend.css';

// importing utitily functions
// import {isMobile} from '../utils';

// instantiating components & accessories

// defining global variables

// defining Factory function
function LegendGradient(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:5, r:5, b:5, l:5};
    let _rectLength = 355;
    let _PartyName = 'DEMOCRATIC';
    let _PartyList = ['DEMOCRATIC','REPUBLICAN'];

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

        const range = d3.range(1,25);

        const scaleIntensity = d3.scaleLinear()
            .domain([0,range.length-1])
            .range([0.15,0.85]);

        const scaleColor = d3.scaleOrdinal()
            .domain(_PartyList)
            .range(['#8A2BE2','#FFD700']);

        let gradientTitleWrapperUpdate = container.selectAll('.legend-gradient-title-wrapper')
            .data([1]);
        const gradientTitleWrapperEnter = gradientTitleWrapperUpdate.enter()
            .append('div')
            .classed('legend-gradient-title-wrapper',true);
        gradientTitleWrapperUpdate.exit().remove();
        gradientTitleWrapperUpdate = gradientTitleWrapperUpdate.merge(gradientTitleWrapperEnter)
            .attr('transform', `translate(${0},${0})`);

        let gradientTitleUpdate = gradientTitleWrapperUpdate.selectAll('.legend-gradient-title')
            .data([1]);
        const gradientTitleEnter = gradientTitleUpdate.enter()
            .append('p')
            .classed('legend-gradient-title',true);
        gradientTitleUpdate.exit().remove();
        gradientTitleUpdate = gradientTitleUpdate.merge(gradientTitleEnter)
            .text('lead margin');

        let legendGradientUpdate = container.selectAll('.legend-gradient')
            .data([1]);
        const legendGradientEnter = legendGradientUpdate.enter()
            .append('div')
            .classed('legend-gradient',true);
        legendGradientUpdate.exit().remove();
        legendGradientUpdate = legendGradientUpdate.merge(legendGradientEnter)
            .attr('transform', `translate(${0},${0})`);

        let leftLabelUpdate = legendGradientUpdate.selectAll('.legend-gradient-left-label')
            .data([1]);
        const leftLabelEnter = leftLabelUpdate.enter()
            .append('span')
            .classed('legend-gradient-left-label',true)
            .classed('legend-gradient-label',true);
        leftLabelUpdate.exit().remove();
        leftLabelUpdate = leftLabelUpdate.merge(leftLabelEnter)
            .text('weaker');

        let gradientNodeUpdate = legendGradientUpdate.selectAll('.legend-gradient-node')
            .data(range);
        const gradientNodeEnter = gradientNodeUpdate.enter()
            .append('div')
            .classed('legend-gradient-node',true);
        gradientNodeUpdate.exit().remove();
        gradientNodeUpdate = gradientNodeUpdate.merge(gradientNodeEnter)
            .style('background-color', scaleColor(_PartyName))
            .style('opacity', (d,i) => scaleIntensity(i));

        let rightLabelUpdate = legendGradientUpdate.selectAll('.legend-gradient-right-label')
            .data([1]);
        const rightLabelEnter = rightLabelUpdate.enter()
            .append('span')
            .classed('legend-gradient-right-label',true)
            .classed('legend-gradient-label',true);
        rightLabelUpdate.exit().remove();
        rightLabelUpdate = rightLabelUpdate.merge(rightLabelEnter)
            .text('stronger');

        //
        // let gradientRectUpdate = plotUpdate.selectAll('.legend-gradient')
        //     .data([1]);
        // const gradientRectEnter = gradientRectUpdate.enter()
        //     .append('rect')
        //     .classed('legend-gradient',true);
        // gradientRectUpdate.exit().remove();
        // gradientRectUpdate = gradientRectUpdate.merge(gradientRectEnter)
        //     .attr('width', _rectLength/2)
        //     .attr('height', 20)
        //     .style('fill-opacity', 0.85)
        //     .style('fill', 'url(#linear-gradient)');
        //
        // const min = d3.min(data.map(d => d.shortage.length));
        // const max = d3.max(data.map(d => d.shortage.length));
        //
        // let labelLeftUpdate = plotUpdate.selectAll('.label-left')
        //     .data([min]);
        // const labelLeftEnter = labelLeftUpdate.enter()
        //     .append('text')
        //     .classed('label-left',true)
        //     .classed('label-text',true);
        // labelLeftUpdate.exit().remove();
        // labelLeftUpdate = labelLeftUpdate.merge(labelLeftEnter)
        //     .attr('transform', `translate(${-2*margin.l},${15})`)
        //     .text(d => d);
        //
        // let labelRightUpdate = plotUpdate.selectAll('.label-right')
        //     .data([max]);
        // const labelRightEnter = labelRightUpdate.enter()
        //     .append('text')
        //     .classed('label-right',true)
        //     .classed('label-text',true);
        // labelRightUpdate.exit().remove();
        // labelRightUpdate = labelRightUpdate.merge(labelRightEnter)
        //     .attr('transform', `translate(${_rectLength/2+margin.l/1.5},${15})`)
        //     .text(d => d);
        //
        // let legendTitleUpdate = plotUpdate.selectAll('.legend-title')
        //     .data(['Number of jobs in shortage']);
        // const legendTitleEnter = legendTitleUpdate.enter()
        //     .append('text')
        //     .classed('legend-title',true);
        // legendTitleUpdate.exit().remove();
        // legendTitleUpdate = legendTitleUpdate.merge(legendTitleEnter)
        //     .attr('transform', `translate(${3*margin.l},${-margin.l})`)
        //     .text(d => d);

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

    exports.PartyName = function(_) {
        // is a string 'DEMOCRATIC', 'REPUBLICAN', 'PROGRESSIVE'
        if (_ === 'undefined') return _PartyName;
        _PartyName = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default LegendGradient;
