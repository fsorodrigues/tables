// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// importing utitily functions
import {onlyUnique} from '../utils';

// instantiating components & accessories

// defining global variables

// defining Factory function
function Select(_) {

    // create getter-setter variables in factory scope

    // declaring dispatch
    const _dispatch = d3.dispatch('menu:selected');

    function exports(data) {

        // selecting root element ==> svg container, div where function is called in index.js
        const root = _;
        const container = d3.select(root);

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;

        // let left = container.selectAll('.left-menu-label')
        //     .data(['abcdeFgh']);
        // const leftEnter = left.enter()
        //     .append('span');
        // left = left.merge(leftEnter)
        //     .classed('left-menu-label',true)
        //     .html(d => d.toLowerCase());

        // setting up scales
        let uniques = [];
        uniques = uniques.concat
            .apply(uniques, data.map(d => d.shortage))
            .filter(onlyUnique)
            .sort();

        // appending buttons
        let selectUpdate = container.selectAll('.dropdown-menu')
            .data([1]);
        const selectEnter = selectUpdate.enter()
            .append('select')
            .classed('dropdown-menu', true);
        selectUpdate.exit().remove();
        selectUpdate = selectUpdate.merge(selectEnter)
            .on('input', function(d) {
                const value = d3.select(this).node().value;
                _dispatch.call('menu:selected',this,value);
            });

        let placeholderUpdate = selectUpdate.selectAll('.option-placeholder')
            .data([1]);
        const placeholderEnter = placeholderUpdate.enter()
            .append('option')
            .classed('option-placeholder',true);
        placeholderUpdate.exit().remove();
        placeholderUpdate = placeholderUpdate.merge(placeholderEnter)
            .attr('data-placeholder','true')
            .attr('value', 'placeholder')
            .text('Select to view counties affected');

        let optionsUpdate = selectUpdate.selectAll('.option-valid')
            .data(uniques);
        const optionsEnter = optionsUpdate.enter()
            .append('option')
            .classed('option-valid',true);
        optionsUpdate.exit().remove();
        optionsUpdate = optionsUpdate.merge(optionsEnter)
            .attr('value', d => d)
            .text(d => d);

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
export default Select;
