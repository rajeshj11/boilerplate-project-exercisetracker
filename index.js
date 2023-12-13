const express = require('express')
const app = express()
const cors = require('cors');
const glob = require('glob');
const path = require('path'); 
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const mongoInit = require('./conn/mongo_init');
require('dotenv').config()
mongoInit();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.use('/api/users', userRouter);
const routesDirectory = path.join(__dirname, 'test'); // Adjust this path as needed
const routesFiles = glob.sync(`${routesDirectory}/**/*.js`);
routesFiles.forEach((path)=>{
  const router = require(path);
  router(app);
})
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
