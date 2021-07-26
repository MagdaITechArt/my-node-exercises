const fs = require('fs');
const http = require('http');
const url = require('url');

//////////////////
/// FILES

// SYNC - synchronously way of read and write file
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log('TEXTin: ', textIn);

const textOut = `Some text about avocado: ${textIn} has been shown at ${new Date()}`;

fs.writeFileSync('./txt/output.txt', textOut);

// ASYNC - asynchronously way of read and write file
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log(`ERROR: ${err}`);
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            fs.writeFile('./txt/final.txt', `${data2} with ${data3})`, (err) => {
                console.log('File written');
            })
        })
    })
});
console.log('1. this message should show first');

//////////////////
/// SERVER

//it will read the file only once when program will starts
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    console.log('request url: ', req.url);
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is overview');
    } else if (pathName === '/product') {
        res.end('This is product');
    } else if (pathName === '/api') {
        res.end(data);
    } else  {
        res.writeHead(404, {
           'Content-Type': 'text/html',
            'my-custom-header': 'blablabla'
        })
        res.end('<h1>Page NOT found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});