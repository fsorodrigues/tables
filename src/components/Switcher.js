// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets
import '../style/switcher.css';

// importing utitily functions
import {onlyUnique} from '../utils';

// instantiating components & accessories

// defining global variables

// defining Factory function
function Switcher(_) {

    // create getter-setter variables in factory scope

    // declaring dispatch
    const _dispatch = d3.dispatch('switcher:changed');

    function exports(data) {

        // selecting root element ==> svg container, div where function is called in index.js
        const root = _;
        const container = d3.select(root);

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;

        let labelUpdate = container.selectAll('.switcher-label')
            .data([1]);
        const labelEnter = labelUpdate.enter()
            .append('span')
            .classed('switcher-label',true);
        labelUpdate.exit().remove();
        labelUpdate = labelUpdate.merge(labelEnter)
            .text('click switch parties');

        // appending buttons
        let switcherUpdate = container.selectAll('.switch')
            .data([1]);
        const switcherEnter = switcherUpdate.enter()
            .append('label')
            .classed('switch', true);
        switcherUpdate.exit().remove();
        switcherUpdate = switcherUpdate.merge(switcherEnter);

        let inputUpdate = switcherUpdate.selectAll('.checkbox')
            .data([1]);
        const inputEnter = inputUpdate.enter()
            .append('input')
            .classed('checkbox', true);
        inputUpdate.exit().remove();
        inputUpdate = inputUpdate.merge(inputEnter)
            .attr('type', 'checkbox')
            .on('input', function(d) {
                const color = d3.select(this.parentNode).select('.slider').style('background-color');
                const party = getParty(color);

                _dispatch.call('switcher:changed',this,party);
            });

        let sliderUpdate = switcherUpdate.selectAll('.slider')
            .data([1]);
        const sliderEnter = sliderUpdate.enter()
            .append('span')
            .classed('slider', true);
        sliderUpdate.exit().remove();
        sliderUpdate = sliderUpdate.merge(sliderEnter);

        //
        // let placeholderUpdate = selectUpdate.selectAll('.option-placeholder')
        //     .data([1]);
        // const placeholderEnter = placeholderUpdate.enter()
        //     .append('option')
        //     .classed('option-placeholder',true);
        // placeholderUpdate.exit().remove();
        // placeholderUpdate = placeholderUpdate.merge(placeholderEnter)
        //     .attr('data-placeholder','true')
        //     .attr('value', 'placeholder')
        //     .text('Select to view counties affected');
        //
        // let optionsUpdate = selectUpdate.selectAll('.option-valid')
        //     .data(uniques);
        // const optionsEnter = optionsUpdate.enter()
        //     .append('option')
        //     .classed('option-valid',true);
        // optionsUpdate.exit().remove();
        // optionsUpdate = optionsUpdate.merge(optionsEnter)
        //     .attr('value', d => d)
        //     .text(d => d);

    }

    // TO DO: create getter-setter pattern for customization
    exports.on = function(eventType, cb) {
		// eventType is a string
		// cb is a function
		_dispatch.on(eventType, cb);
		return this;
	};

    // returning of module
    return exports;
}

// exporting factory function as default
export default Switcher;

const getParty = d3.scaleOrdinal()
    .domain(['rgb(65, 105, 225)', 'rgb(255, 99, 71)'])
    .range(['REPUBLICAN','DEMOCRATIC']);
