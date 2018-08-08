// // importing d3.js functions
// import {} from 'd3';

export const parse = d => {
    return {
        county: d.county,
        shortage: `${d.shortage}`.split(',')
    };
};
