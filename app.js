// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START gae_node_request_example]
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');

const app = express();
const {authRouter,projectRouter,influencerRouter,paymentRouter} = require('./router')
app.use(bearerToken())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// app.use(express.static('public'))
app.use(cors())
// app.use('/uploads',express.static('uploads'))
app.use('/public',express.static('public'))

app.get('/', (req, res) => {
  res
    .status(200)
    .send('selamat datang di api diendorse!')
    .end();
});
app.use('/auth', authRouter);
app.use('/project', projectRouter);
app.use('/influencer', influencerRouter);
app.use('/payment', paymentRouter);
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
