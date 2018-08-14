// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets
import '../style/table.css';

// importing utitily functions
import {isMobile,getHeaders,formatThousands,formatPercent} from '../utils';

// instantiating components & accessories
const mobile = isMobile();

// defining global variables

// defining Factory function
function Tooltip(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:0, r:0, b:0, l:0};
    let _x = 0;
    let _y = 0;
    let _padding = '12px 9px';
    let _opacity = 0;

    let _dispatch = d3.dispatch('close:clicked');

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = _;
        const container = d3.select(root);

        // declaring setup/layout variables
        const clientWidth = root.parentNode.clientWidth;
        const clientHeight = root.parentNode.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        const listColumns = getHeaders(data);

        let countyUpdate = container.selectAll('.county-name')
            .data([data]);
        const countyEnter = countyUpdate.enter()
            .append('p')
            .classed('county-name',true);
        countyUpdate.exit().remove();
        countyUpdate = countyUpdate.merge(countyEnter)
            .html(d => `County: <b>${d.County}</b>` );

        let tableUpdate = container.selectAll('.table-node')
            .data([data]);
        const tableEnter = tableUpdate.enter()
            .append('table')
            .classed('table-node',true);
        tableUpdate.exit().remove();
        tableUpdate = tableUpdate.merge(tableEnter);

        let tableHeaderUpdate = tableUpdate.selectAll('.table-header')
            .data([data]);
        const tableHeaderEnter = tableHeaderUpdate.enter()
            .append('thead')
            .classed('table-header',true);
        tableHeaderUpdate.exit().remove();
        tableHeaderUpdate = tableHeaderUpdate.merge(tableHeaderEnter);

        let trHeaderUpdate = tableHeaderUpdate.selectAll('.tr-header')
            .data([data]);
        const trHeaderEnter = trHeaderUpdate.enter()
            .append('tr')
            .classed('tr-header', true);
        trHeaderUpdate.exit().remove();
        trHeaderUpdate = trHeaderUpdate.merge(trHeaderEnter);

        let thUpdate = trHeaderUpdate.selectAll('th')
            .data(listColumns);
        const thEnter = thUpdate.enter()
            .append('th');
        thUpdate.exit().remove();
        thUpdate = thUpdate.merge(thEnter)
            .text(d => d);

        let tableBodyUpdate = tableUpdate.selectAll('.table-body')
            .data([data]);
        const tableBodyEnter = tableBodyUpdate.enter()
            .append('tbody')
            .classed('table-body',true);
        tableBodyUpdate.exit().remove();
        tableBodyUpdate = tableBodyUpdate.merge(tableBodyEnter);

        let rowsUpdate = tableBodyUpdate.selectAll('.rows')
            .data(d => d.Candidates);
        const rowsEnter = rowsUpdate.enter()
            .append('tr')
            .attr('class',(d,i) => {
                if (i % 2 == 0) return 'rows-even';
                else return 'rows-odd';
            })
            .classed('rows', true);
        rowsUpdate.exit().remove();
        rowsUpdate = rowsUpdate.merge(rowsEnter);

        let tdUpdate = rowsUpdate.selectAll('.list-item')
        .data(d => {
            return listColumns.map(e => {
                if (e === 'Candidate') {
                    return { "value": d[e], "name": e};
                } else if (e === 'Votes') {
                    return { "value": formatThousands(d[e]), "name": e};
                } else {
                    return { "value": formatPercent(d[e]), "name": e};
                }

            });
        });
        const tdEnter = tdUpdate.enter()
            .append('td')
            .classed('list-item',true);
        tdUpdate.exit().remove();
        tdUpdate = tdUpdate.merge(tdEnter)
            .text(d => d.value);

        if (mobile) {
            container.style('top',`${_y}px`)
                .style('left',`${0}px`)
                .style('padding', _padding)
                .style('width',`${w - 2*(+_padding.split(' ')[1].replace('px',''))}px`)
                .style('opacity',_opacity);

            let closeUpdate = container.selectAll('.close')
                .data([1]);
            const closeEnter = closeUpdate.enter()
                .append('div')
                .classed('close',true);
            closeUpdate.exit().remove();
            closeUpdate = closeUpdate.merge(closeEnter)
                .on('click', function(d) {
                    _dispatch.call('close:clicked',this,d);


                });

        } else {
            container.style('top',`${_y-45}px`)
                .style('left',`${_x+10}px`)
                .style('padding', _padding)
                .style('opacity',_opacity);
        }

    }

    // create getter-setter pattern for customization
    exports.on = function(eventType,cb) {
        // eventType is a string ===> custom eventType
        // cb is a function ===> callback
        _dispatch.on(eventType,cb);
        return this;
    };

    exports.x = function(_) {
        // _ expects an int/float
        if (_ === 'undefined') return _x;
        _x = _;
        return this;
    };

    exports.y = function(_) {
        // _ expects an int/float
        if (_ === 'undefined') return _y;
        _y = _;
        return this;
    };

    exports.padding = function(_) {
        // _ expects an int/float
        if (_ === 'undefined') return _padding;
        _padding = _;
        return this;
    };

    exports.opacity = function(_) {
        // _ expects an int/float
        if (_ === 'undefined') return _opacity;
        _opacity = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default Tooltip;
