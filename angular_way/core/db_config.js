var mongoose = require('mongoose');

module.exports = mongoose.model('Kaminario', {
  firstname : String,
  lastname : String,
  email : String,
  age : String,
  is_mark : { type: Boolean, default: false }
});