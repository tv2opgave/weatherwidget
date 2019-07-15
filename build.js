var path = require('path')
var fs = require('fs')

const input = path.join(__dirname, 'client', 'build', 'index.html')
const output = path.join(__dirname, 'server', 'views', 'layout.hbs')

const html = fs.readFileSync(input, "utf8");
const layout = html.split('<div id="root"></div>').join('<div id="root">{{{body}}}</div>');

fs.writeFileSync(output, layout, "utf8")
