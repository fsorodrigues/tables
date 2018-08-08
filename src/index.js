const msg = 'webpack template running';
console.log(msg);

// importing d3.js
import * as d3 from 'd3';

// importing utitily functions
import {parse} from './utils';

// importing stylesheets
import './style/main.css';

// importing components
import MapProjection from './components/MapProjection';
import Tooltip from './components/Tooltip';

// instantiating components
const mapProjection = MapProjection(document.querySelector('#map-projection'));
const mapTooltip = Tooltip(document.querySelector('#map-projection-tooltip'));

// loading data as promises
const mapData = d3.json('./data/vt-map.json');
const shortageData = d3.csv('./data/job_shortage_per_county.csv',parse);

// calling drawing functions
mapData.then((mapData) => {
    mapProjection(mapData);
});

mapProjection.on('node:enter', function(d) {
    d3.select(this.parentNode.appendChild(this))
        .style('fill','#2E8B57')
        .style('stroke','#F5F5F5')
        .style('stroke-width',1.5);

    const [x,y] = d3.mouse(this);

    mapTooltip.display(d);

    shortageData.then((shortageData) => {
        mapTooltip(shortageData,x,y);
    });
})
.on('node:leave', function(d) {
    d3.select(this)
        .style('stroke', '#696969')
        .style('stroke-width', 0.5)
        .style('fill', '#3CB371');

    mapTooltip.display('');
    mapTooltip([],0,0);
});
