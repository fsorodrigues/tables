// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// importing utitily functions
import {isMobile,createAcronym,titleCase,flatten,formatThousands,formatPercent} from '../utils';

// instantiating components & accessories
const mobile = isMobile();

// defining global variables

// defining Factory function
function MapProjection(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:5, r:5, b:5, l:5};
    let _toggleAll = true;
    let _PartyName = 'DEMOCRATIC';
    let _Office = 'GOVERNOR';
    let listCandidates;
    let _listDemocrats = ['James Ehlers', 'Christine Hallquist', 'Brenda Siegel', 'Ethan Sonneborn'];
    let _listRepublicans = ['Phil Scott', 'Keith Stern'];

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
            .scale(7500)
            .center([-72.6037393,43.7741865])
            .translate([w/2.19,h/1.9]);

        const path = d3.geoPath()
            .projection(mapProjection);

        // data transformation
        const nestData = d3.nest()
            .key(d => d['County'])
            .entries(data['Town'])
            .map(d => {
                let filter = d.values.map(e => e.Party.filter(f => f.PartyName === _PartyName)
                    .map(e => e.Office.filter(g => g.OfficeName === _Office))
                    .map(e => e[0].Candidate));

                const nestVotes = d3.nest()
                    .key(e => e.Name)
                    .entries(flatten(filter))
                    .map(e => {
                        return {
                            Candidate: titleCase(e.key),
                            // Votes: d3.sum(e.values, f => f.Votes)
                            Votes: Math.floor(10000*Math.random())
                        };
                    }).sort((a,b) => b.Votes - a.Votes);

                const writeIns = flatten(d.values.map(e => e.Party.filter(f => f.PartyName === _PartyName)
                    .map(e => e.Office.filter(g => g.OfficeName === _Office))));

                let totalVotes = d3.sum(nestVotes, e => e.Votes) + d3.sum(writeIns, e => e.OtherWriteInVotes);

                for (let i = 0; i < nestVotes.length; i++) {
                    if (totalVotes === 0) totalVotes = 1;
                    nestVotes[i]['%'] = nestVotes[i].Votes / totalVotes;
                }

                return {
                    County: titleCase(d.key),
                    Towns: d.values,
                    Party: _PartyName,
                    Candidates: nestVotes,
                    TotalVotes: totalVotes

            };
        });

        const countyMap = d3.map(nestData, d => d.County);

        // setting up scale
        const scaleIntensity = d3.scaleLinear()
            .range([0.15,0.85]);

        if (_PartyName === 'DEMOCRATIC') {
            listCandidates = _listDemocrats;
        } else {
            listCandidates = _listRepublicans;
        }

        const scaleColor = d3.scaleOrdinal()
            .domain(listCandidates);

        if (_PartyName === 'DEMOCRATIC') {
            scaleColor.range(['#8A2BE2', '#008B8B', '#9ACD32', '#FFB6C1', '#FF6347', '#FFD700']);
        } else {
            scaleColor.range(['#FFD700', '#FFB6C1', '#008B8B', '#4169E1', '#9ACD32', '#8A2BE2']);
        }

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

        let defsUpdate = svgUpdate.selectAll('defs')
            .data([1]);
        const defsEnter = defsUpdate.enter()
            .append('defs');
        defsUpdate.exit().remove();
        defsUpdate = defsUpdate.merge(defsEnter);

        let filterUpdate = defsUpdate.selectAll('filter')
            .data([1]);
        const filterEnter = filterUpdate.enter()
            .append('filter');
        filterUpdate.exit().remove();
        filterUpdate = filterUpdate.merge(filterEnter)
            .attr('id', 'drop-shadow')
            .attr('height', '125%');

        let gaussianBlurUpdate = filterUpdate.selectAll('feGaussianBlur')
            .data([1]);
        const gaussianBlurEnter = gaussianBlurUpdate.enter()
            .append('feGaussianBlur');
        gaussianBlurUpdate.exit().remove();
        gaussianBlurUpdate = gaussianBlurUpdate.merge(gaussianBlurEnter)
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3)
            .attr('result', 'blur');

        let offsetUpdate = filterUpdate.selectAll('feOffset')
            .data([1]);
        const offsetEnter = offsetUpdate.enter()
            .append('feOffset');
        offsetUpdate.exit().remove();
        offsetUpdate = offsetUpdate.merge(offsetEnter)
            .attr('in', 'blur')
            .attr('dx', 1)
            .attr('dy', 1)
            .attr('result', 'offsetBlur');

        let mergeUpdate = filterUpdate.selectAll('feMerge')
            .data([1]);
        const mergeEnter = mergeUpdate.enter()
            .append('feMerge');
        mergeUpdate.exit().remove();
        mergeUpdate = mergeUpdate.merge(mergeEnter);

        let mergeNodeUpdate = mergeUpdate.selectAll('feMergeNode')
            .data(['offsetBlur','SourceGraphic']);
        const mergeNodeEnter = mergeNodeUpdate.enter()
            .append('feMergeNode');
        mergeNodeUpdate.exit().remove();
        mergeNodeUpdate = mergeNodeUpdate.merge(mergeNodeEnter)
            .attr('in', d => d);

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

        let stateTileUpdate = mapUpdate.selectAll('.county-bg')
            .data(featuresData.features);
        const stateTileEnter = stateTileUpdate.enter()
            .append('path')
            .classed('county-bg',true);
        stateTileUpdate.exit().remove();
        stateTileUpdate = stateTileUpdate.merge(stateTileEnter)
            .attr('d', path)
            .style('fill', 'none');

        let combinedD = '';
        mapUpdate.selectAll('.county-bg')
            .each(function() { combinedD += d3.select(this).attr('d'); });
        stateTileUpdate.remove();
        let shadowLayerUpdate = mapUpdate.selectAll('.shadow-layer')
            .data([1]);
        const shadowLayerEnter = shadowLayerUpdate.enter()
            .append('path')
            .classed('shadow-layer',true);
        shadowLayerUpdate.exit().remove();
        shadowLayerUpdate = shadowLayerUpdate.merge(shadowLayerEnter)
            .attr('d', combinedD)
            .style('stroke', 'none')
            .style('stroke-width', 0)
            .style('fill', 'white')
            .style('fill-opacity',1)
            .style('filter', 'url(#drop-shadow)');

        let stateNodesUpdate = mapUpdate.selectAll('.county')
            .data(featuresData.features);
        const stateNodesEnter = stateNodesUpdate.enter()
            .append('path')
            .attr('id',d => `${d.properties.NAME}`.split(' ').join('-').toLowerCase())
            .attr('class', d => 'class')
            .classed('county',true);
        stateNodesUpdate.exit().remove();
        stateNodesUpdate = stateNodesUpdate.merge(stateNodesEnter)
            .attr('d', path)
            .style('stroke', '#696969')
            .style('stroke-width', 0.5)
            .style('fill', d => scaleColor(countyMap.get(d.properties.NAME).Candidates[0].Candidate))
            .style('fill-opacity', d => {
                const votePct = countyMap.get(d.properties.NAME).Candidates[0]['%'];
                const totalVotes = countyMap.get(d.properties.NAME).TotalVotes;
                scaleIntensity.domain([0,1]);
                return scaleIntensity(votePct);
            });

        if (mobile) {
            stateNodesUpdate.on('click',function(d) {
                const isActive = d3.select(this).classed('active');
                if (isActive) {
                    const name = d.properties.NAME;
                    const data = countyMap.get(name);
                    _dispatch.call('node:leave',this,data);
                } else {
                    const name = d.properties.NAME;
                    const data = countyMap.get(name);
                    _dispatch.call('node:enter',this,data);
                }
            });
        } else {
            stateNodesUpdate.on('mouseenter',function(d) {
                const name = d.properties.NAME;
                const data = countyMap.get(name);
                _dispatch.call('node:enter',this,data);
            })
            .on('mouseleave',function(d) {
                const name = d.properties.NAME;
                const data = countyMap.get(name);
                _dispatch.call('node:leave',this,data);
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

    exports.toggleAll = function(_) {
        // _ is a boolean
        _toggleAll = _;
    };

    exports.showAll = function() {
        return _toggleAll;
    };

    exports.PartyName = function(_) {
        // is a string 'DEMOCRATIC', 'REPUBLICAN', 'PROGRESSIVE'
        if (_ === 'undefined') return _PartyName;
        _PartyName = _;
        return this;
    };

    exports.Office = function(_) {
        // is a string 'DEMOCRATIC', 'REPUBLICAN', 'PROGRESSIVE'
        if (_ === 'undefined') return _Office;
        _Office = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default MapProjection;
