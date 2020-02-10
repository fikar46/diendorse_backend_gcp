const authRouter = require('./authRouter')
const projectRouter = require('./projectRouter')
const paymentRouter = require('./paymentRouter');
module.exports={
    authRouter,
    projectRouter,
    influencerRouter : require('./influencerRouter'),
    paymentRouter
}
