const msg = 'webpack template running';
console.log(msg);

// importing d3.js
import * as d3 from 'd3';

// importing utitily functions
import {parse,createAcronym} from './utils';

// importing stylesheets
import './style/main.css';

// importing components
import MapProjection from './components/MapProjection';
import Tooltip from './components/Tooltip';
import Legend from './components/Legend';
import Select from './components/Select';

// instantiating components
const mapProjection = MapProjection(document.querySelector('#map-projection'));
const mapTooltip = Tooltip(document.querySelector('#map-projection-tooltip'));
const legend = Legend(document.querySelector('#map-projection'));
const select = Select(document.querySelector('#map-projection-dropdown-menu'));

// loading data as promises
const mapData = d3.json('./data/vt-map.json');
const shortageData = d3.csv('./data/job_shortage_per_county.csv',parse);

// calling drawing functions
mapData.then((mapData) => {
    shortageData.then((shortageData) => {
        mapProjection(mapData,shortageData);
        legend(shortageData);
        select(shortageData);
    });
});

mapProjection.on('node:enter', function(d) {
    if (mapProjection.showAll()) {
        console.log(mapProjection.showAll());
        d3.selectAll('.county')
            .style('stroke', '#696969')
            .style('stroke-width', 0.5)
            .style('fill-opacity', 0.5)
            .classed('active',false);
    }

    d3.select(this.parentNode.appendChild(this))
        .style('fill-opacity', 1)
        .style('stroke','#F5F5F5')
        .style('stroke-width',1.5)
        .classed('active',true);

    const [x,y] = d3.mouse(this);

    mapTooltip.display(d)
        .x(x)
        .y(y)
        .padding('12px 9px')
        .opacity(1);

    shortageData.then((shortageData) => {
        mapTooltip(shortageData);
    });
})
.on('node:leave', function(d) {
    if (mapProjection.showAll()) {
        d3.select(this)
            .style('stroke', '#696969')
            .style('stroke-width', 0.5)
            .style('fill-opacity', 0.85)
            .classed('active',false);

        d3.selectAll('.county')
            .style('stroke', '#696969')
            .style('stroke-width', 0.5)
            .style('fill-opacity', 0.85);

    } else {
        const thisEl = d3.select(this);
        if (thisEl.classed('active-group')) {

        } else {
            const parentEl = this.parentNode;
            d3.select(parentEl.insertBefore(this,this.parentNode.firstChild))
                .style('stroke', '#696969')
                .style('stroke-width', 0.5)
                .style('fill-opacity', 0.2)
                .classed('active-group',false);
        }
    }


    mapTooltip.display('')
        .x(0)
        .y(0)
        .padding('0 0')
        .opacity(0);

    mapTooltip([]);
});

mapTooltip.on('node:leave', function(d) {
    d3.selectAll('.county')
        .style('stroke', '#696969')
        .style('stroke-width', 0.5)
        .style('fill-opacity', 0.85);

    mapTooltip.display('')
        .x(0)
        .y(0)
        .padding('0 0')
        .opacity(0);

    mapTooltip([]);
});

select.on('menu:selected', function(d) {

    if (d === 'placeholder') {
        d3.selectAll('.county')
            .style('stroke', '#696969')
            .style('stroke-width', 0.5)
            .style('fill-opacity', 0.85)
            .classed('active-group',false);

        mapProjection.toggleAll(true);

    } else {
        d3.selectAll('.county')
            .style('stroke', '#696969')
            .style('stroke-width', 0.5)
            .style('fill-opacity', 0.2)
            .classed('active-group',false);

        const these = d3.selectAll(`.${createAcronym([d])}`);

        these.nodes().forEach(e => e.parentNode.appendChild(e));

        these.style('stroke','#F5F5F5')
            .style('stroke-width',1.5)
            .style('fill-opacity', 1)
            .classed('active-group',true);

        mapProjection.toggleAll(false);

    }

});
