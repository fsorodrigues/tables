// importing d3.js
import * as d3 from 'd3';

// importing utitily functions
import {XMLtoJSON} from './components/XMLtoJSON';
import {parse,createAcronym} from './utils';

// importing stylesheets
import './style/main.css';

// importing components
import MapProjection from './components/MapProjection';
import Legend from './components/Legend';
import LegendGradient from './components/LegendGradient';
import Switcher from './components/Switcher';
import Tooltip from './components/Tooltip';

// instantiating components
const mapProjection = MapProjection(document.querySelector('#map-projection'));
const legend = Legend(document.querySelector('#map-projection-legend'));
const legendGradient = LegendGradient(document.querySelector('#map-projection-legend'));
const switcher = Switcher(document.querySelector('#map-projection-switcher'));
const mapTooltip = Tooltip(document.querySelector('#map-projection-tooltip'));

// loading data as promises
const mapData = d3.json('./data/vt-map.json');

const url = 'https://vtelectionresults.sec.state.vt.us/rss/3246/ResultsData.xml';
const proxyurl = 'https://dig-cors.herokuapp.com/';
const feed = fetch(proxyurl + url);
const electionData = feed.then(response => response.text())
    .catch(() => console.log(`Can’t access ${url} response.`))
    .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
    .then(contents => XMLtoJSON(contents));

let mockdata;

// calling drawing functions
mapData.then((featuresData) => {
    electionData.then((electionData) => {
        const data = electionData['rss']['channel']['ResultsData'];
        mapProjection(featuresData,data);
        legend(data);
        legendGradient();
        switcher(['DEMOCRATIC','REPUBLICAN']);
    });
});

switcher.on('switcher:changed', function(d) {
    mapProjection.PartyName(d);
    legend.PartyName(d);
    legendGradient.PartyName(d);

    mapData.then((featuresData) => {
        electionData.then((electionData) => {
            const data = electionData['rss']['channel']['ResultsData'];
            mapProjection(featuresData,data);
            legend(data);
            legendGradient();
        });
    });
});


//
mapProjection.on('node:enter', function(data) {
    const [x,y] = d3.mouse(this);

    mapTooltip.x(x)
        .y(y)
        .padding('12px 9px')
        .opacity(1);

    mapTooltip(data);

    d3.select(this.parentNode.appendChild(this))
        .style('stroke','#000000')
        .style('stroke-width',2.5)
        .classed('active',true);

    mockdata = data;

    d3.select('#map-projection-tooltip')
        .style('pointer-events','all');

}).on('node:leave', function(data) {

    d3.select(this)
        .style('stroke', '#696969')
        .style('stroke-width', 0.5)
        .classed('active',false);

    d3.selectAll('.county')
        .style('stroke', '#696969')
        .style('stroke-width', 0.5);

    mapTooltip.x(0)
        .y(0)
        .padding('0 0')
        .opacity(0);

    mapTooltip(data);
});

mapTooltip.on('close:clicked', function(d) {

    d3.selectAll('.county')
        .style('stroke', '#696969')
        .style('stroke-width', 0.5)
        .classed('active',false);

    mapTooltip.x(0)
        .y(0)
        .padding('0 0')
        .opacity(0);

    mapTooltip(mockdata);

    d3.select('#map-projection-tooltip')
        .style('pointer-events','none');
});
//
// select.on('menu:selected', function(d) {
//
//     if (d === 'placeholder') {
//         d3.selectAll('.county')
//             .style('stroke', '#696969')
//             .style('stroke-width', 0.5)
//             .style('fill-opacity', 0.85)
//             .classed('active-group',false);
//
//         mapProjection.toggleAll(true);
//
//     } else {
//         d3.selectAll('.county')
//             .style('stroke', '#696969')
//             .style('stroke-width', 0.5)
//             .style('fill-opacity', 0.2)
//             .classed('active-group',false);
//
//         const these = d3.selectAll(`.${createAcronym([d])}`);
//
//         these.nodes().forEach(e => e.parentNode.appendChild(e));
//
//         these.style('stroke','#F5F5F5')
//             .style('stroke-width',1.5)
//             .style('fill-opacity', 1)
//             .classed('active-group',true);
//
//         mapProjection.toggleAll(false);
//
//     }
//
// });
