var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime');

function readBooks(callback) {
    fs.readFile('./book.json','utf8',function (err,data) {
        if(err || data == ''){
            callback([]);
        }else{
            callback(JSON.parse(data));
        }
    });
}

function writeBooks(data,callback) {
    fs.writeFile('./book.json',JSON.stringify(data),callback);
}

http.createServer(function (req,res) {
    let {pathname,query} = url.parse(req.url,true);
    if(pathname == '/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/^\/book(\/\d+)?$/.test(pathname)){
        var id = /^\/book(?:\/(\d+))?$/.exec(pathname)[1];
        switch(req.method){
            case 'GET':
                if(id){
                    readBooks(function (books) {
                        var b = books.find(function (book) {
                           return book.id == id;
                        });
                        res.end(JSON.stringify(b));
                        console.log(1);
                    });
                }else{
                    readBooks(function (books) {
                        res.end(JSON.stringify(books));
                    });
                }
                break;
            case 'POST':
                var str = '';
                req.on('data',function (chunk) {
                    str += chunk;
                });
                req.on('end',function () {
                    var book = JSON.parse(str);
                    readBooks(function (books) {
                        book.id = books.length == 0 ? 1 : books[books.length - 1].id + 1;
                        books.push(book);
                        writeBooks(books,function () {
                            res.end(JSON.stringify(book));
                        })

                    });
                });
                break;
            case 'PUT':
                if(id){
                    readBooks(function (books) {
                        books = books.filter(function (item) {
                            return item.id != id;
                        });
                        writeBooks(books,function () {
                            res.end(JSON.stringify({}));
                        })
                    });
                }else{

                }
                break;
            case 'DELETE':
                if(id){

                }else{

                }
                break;
        }
    }else{
        fs.exists('.'+pathname,function (flag) {
          if(flag){
              res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
              fs.createReadStream('.'+pathname).pipe(res);
          }else{
              res.statusCode = 404;
              res.end('Not Found');
          }
        });
    }
}).listen(8080,function () {
    console.log('port 8080 is on listening!');
});
