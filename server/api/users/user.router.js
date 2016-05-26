'use strict';

var router = require('express').Router();

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');
var Story = require('../stories/story.model');

router.param('id', function (req, res, next, id) {
  User.findById(id)
  .then(function (user) {
    if (!user) throw HttpError(404);
    req.requestedUser = user;
    next();
  })
  .catch(next);
});

router.get('/', function (req, res, next) {
  User.findAll({})
  .then(function (users) {
    res.json(users);
  })
  .catch(next);
});

router.post('/', function (req, res, next) {
  User.create(req.body)
  .then(function (user) {
    res.status(201).json(user);
  })
  .catch(next);
});

router.get('/:id', function (req, res, next) {
  // User.findById(req.session.passport.user)
  // .then(function(user){
  //   console.log(user.isAdmin)
  // })
  req.requestedUser.reload({include: [Story]})
  .then(function (requestedUser) {
    res.json(requestedUser);
  })
  .catch(next);
});

router.put('/:id', function (req, res, next) {
  User.findById(req.session.passport.user)
  .then(function(user){
    if ((req.requestedUser.id === user.id) || user.isAdmin) {
        req.requestedUser.update(req.body)
        .then(function (user) {
          res.json(user);
        })
        .catch(next);
    } 
    else {
      res.redirect('/')
    }
  });
});

router.delete('/:id', function (req, res, next) {
  User.findById(req.session.passport.user)
  .then(function(user){
    if ((req.requestedUser.id === user.id) || user.isAdmin) {
        req.requestedUser.destroy()
        .then(function () {
          res.status(204).end();
        })
        .catch(next);
    } 
    else {
      res.redirect('/')
    }
  })

});

module.exports = router;
