var mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => console.log('conected2'))
  .catch((err) => console.log(err));
