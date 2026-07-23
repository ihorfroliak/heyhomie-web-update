const next = require('next');
const express = require('express');
// const sslRedirect = require('heroku-ssl-redirect').default;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // redirect to SSL
    //   server.use(sslRedirect(['production'], 301));

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`Server started on ${port}`);
    });
});
