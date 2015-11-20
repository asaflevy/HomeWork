var kaminarioDb = require('./db_config');
module.exports = function (app) {

  app.get('/', function (req, res) {
    res.sendfile('./index.html');
  });

  app.get('/api/rowItems', function (req, res) {
    kaminarioDb.find(function (err, tableRows) {
      if (err) {
        res.status(400);
        return res.send({reason: err.toString()});
      }
      res.send(tableRows);
    });
  });

  /**
   * remove row Item from DB by row Id
   */
  app.delete('/api/rowItems/:row_id', function (req, res) {

    kaminarioDb.remove({_id : req.params.row_id}, function(err, rowsItem) {
      console.log('req.body.row_id',req.params.row_id)
      if (err)
        res.send(err);

      //return all the rest Items
      kaminarioDb.find({},function(err, rowsItem) {
        if (err)
          res.send(err)
        res.json(rowsItem);
      });
    });
  });


  /**
   * create new row Item
   */
  app.post('/api/rowItems', function (req, res) {
    var rowItemData = req.body;
    rowItemData.firstname = rowItemData.firstname;
    rowItemData.lastname = rowItemData.lastname;
    rowItemData.email = rowItemData.email;
    rowItemData.age = rowItemData.age;
    rowItemData.is_mark = rowItemData.is_mark;
    rowItemData.id = rowItemData._id;
    kaminarioDb.findById(rowItemData.id, function (err, rowItems) {
      if (!rowItems) {
        kaminarioDb.create(rowItemData, function (err, rowItems) {
          if (err) {
            res.status(400);
            return res.send({reason: err.toString()});
          }
          res.send(rowItems);
        })

      }
      else {
        rowItems.firstname = rowItemData.firstname;
        rowItems.lastname = rowItemData.lastname;
        rowItems.age = rowItemData.age;
        rowItems.is_mark = rowItemData.is_mark;
        rowItems.email = rowItemData.firstname;
        rowItems.save(rowItemData, function(err, rowItem) {
          if (err) {
            res.status(400);
            return res.send({reason: err.toString()});
          }
          res.send(rowItem);
        });
      }
    });
  })

  /**
   * delete a rowItem
   */
  app.delete('/api/rowItems/:row_id', function (req, res) {

  });

};