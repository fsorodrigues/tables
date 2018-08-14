// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets
import '../style/legend.css';

// importing utitily functions
import {titleCase,flatten} from '../utils';

// instantiating components & accessories
// const mobile = isMobile();

// defining global variables

// defining Factory function
function Legend(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:5, r:5, b:45, l:5};
    // let _rectLength = 355;

    let _PartyName = 'DEMOCRATIC';
    let _Office = 'GOVERNOR';
    let listCandidates;
    let _listDemocrats = ['James Ehlers', 'Christine Hallquist', 'Brenda Siegel', 'Ethan Sonneborn'];
    let _listRepublicans = ['Phil Scott', 'Keith Stern'];

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

        // Append a defs (for definition) element to your SVG

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
                            Votes: d3.sum(e.values, f => f.Votes)
                        };
                    }).sort((a,b) => b.Votes - a.Votes);

                return {
                    County: titleCase(d.key),
                    Towns: d.values,
                    Party: _PartyName,
                    Candidates: nestVotes,
                    TotalVotes: d3.sum(nestVotes, e => e.Votes)
            };
        });

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

        let legendTitleUpdate = container.selectAll('.legend-title')
            .data([1]);
        const legendTitleEnter = legendTitleUpdate.enter()
            .append('p')
            .classed('legend-title',true);
        legendTitleUpdate.exit().remove();
        legendTitleUpdate = legendTitleUpdate.merge(legendTitleEnter)
            .text('Leading candidate');

        let legendUpdate = container.selectAll('.legend')
            .data([1]);
        const legendEnter = legendUpdate.enter()
            .append('div')
            .classed('legend',true);
        legendUpdate.exit().remove();
        legendUpdate = legendUpdate.merge(legendEnter)
            .attr('transform', `translate(${0},${0})`);

        let legendCandidateUpdate = legendUpdate.selectAll('.legend-candidates')
            .data(nestData[0].Candidates);
        const legendCandidateEnter = legendCandidateUpdate.enter()
            .append('div')
            .classed('legend-candidates',true);
        legendCandidateUpdate.exit().remove();
        legendCandidateUpdate = legendCandidateUpdate.merge(legendCandidateEnter)
            .attr('transform', `translate(${0},${0})`);

        let candidateIconUpdate = legendCandidateUpdate.selectAll('.legend-candidate-icon')
            .data(d => [d]);
        const candidateIconEnter = candidateIconUpdate.enter()
            .append('div')
            .classed('legend-candidate-icon',true);
        candidateIconUpdate.exit().remove();
        candidateIconUpdate = candidateIconUpdate.merge(candidateIconEnter)
            .style('background-color',d => scaleColor(d.Candidate));

        let candidateNameUpdate = legendCandidateUpdate.selectAll('.legend-candidate-name')
            .data(d => [d]);
        const candidateNameEnter = candidateNameUpdate.enter()
            .append('span')
            .classed('legend-candidate-name',true);
        candidateNameUpdate.exit().remove();
        candidateNameUpdate = candidateNameUpdate.merge(candidateNameEnter)
            .text(d => d.Candidate.split(' ')[1].toLowerCase());

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
export default Legend;
