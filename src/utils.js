// // importing d3.js functions
// import {} from 'd3';

export const parse = d => {
    return {
        county: d.county,
        shortage: `${d.shortage}`.split(',').sort()
    };
};

export const isMobile = () => {
	if (navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	// || navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i) ) {

		return true;

	} else {
		return false;
	}
};

export const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
};

export const createAcronym = (d) => {
    const string = [];
    d.forEach(e => {
        const acronym = e.replace('-',' ')
            .replace('(','')
            .replace(')','')
            .split(' ')
            .reduce((acc, word) => acc + word.charAt(0), '');

        string.push(`job-${acronym.toUpperCase()}`);
    });

    return string.join(' ');
};
