// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// setting up modules

// setting up accessory factory function

// defining global variables

// defining Factory function
function Tooltip(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:0, r:0, b:0, l:0};
    let _display;

    // let _dispatch = d3.dispatch('node:enter','node:leave');

    function exports(data,x,y) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = _;
        const container = d3.select(root);

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        const filterData = data.filter(d => d.county === _display);

        let countyUpdate = container.selectAll('.county-name')
            .data(filterData);
        const countyEnter = countyUpdate.enter()
            .append('h3')
            .classed('county-name',true);
        countyUpdate.exit().remove();
        countyUpdate = countyUpdate.merge(countyEnter)
            .text(d => `County: ${d.county}` );

        let tableUpdate = container.selectAll('.table-node')
            .data(filterData);
        const tableEnter = tableUpdate.enter()
            .append('table')
            .classed('table-node',true);
        tableUpdate.exit().remove();
        tableUpdate = tableUpdate.merge(tableEnter);

        let rowsUpdate = tableUpdate.selectAll('tr')
            .data(d => d.shortage);
        const rowsEnter = rowsUpdate.enter()
            .append('tr')
            .attr('class',(d,i) => {
                if (i % 2 == 0) return 'even';
                else return 'odd';
            });
        rowsUpdate.exit().remove();
        rowsUpdate = rowsUpdate.merge(rowsEnter);

        let listUpdate = rowsUpdate.selectAll('.list-item')
            .data(d => [d]);
        const listEnter = listUpdate.enter()
            .append('td')
            .classed('list-item',true);
        listUpdate.exit().remove();
        listUpdate = listUpdate.merge(listEnter)
            .text(d => d);

        container.style('top',`${y}px`)
            .style('left',`${x}px`);

    }

    // create getter-setter pattern for customization
    exports.display = function(_) {
        // _ expects a string
        if (_ === 'undefined') return _display;
        _display = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default Tooltip;
