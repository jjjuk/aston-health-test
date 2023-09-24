const { parse } = require('date-fns');

const date = parse('23121997', 'ddMMyyyy', new Date());

console.log(date.toISOString());
