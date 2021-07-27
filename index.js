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
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = temp.replace(/{%IMAGE%}/g, product.image);
    output = temp.replace(/{%QUANTITY%}/g, product.quantity);
    output = temp.replace(/{%PRICE%}/g, product.price);
    output = temp.replace(/{%DESCRIPTION%}/g, product.description);
    output = temp.replace(/{%FROM%}/g, product.from);
    output = temp.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = temp.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const server = http.createServer((req, res) => {
    console.log('request url: ', req.url);
    console.log('url', url.parse(req.url, true));
    const {query, pathname} = url.parse(req.url, true);
    const pathName = req.url;

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(/{%TEMPLATE_CARDS%}/g, cardHtml)
        res.end(output);
    } else if (pathname === '/product') {
        if (query.id) {
            res.writeHead(200, {
                'Content-type': 'text/html'
            })
            res.end(tempProduct);
        }
        res.end('This is product');
    } else if (pathname === '/api') {
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