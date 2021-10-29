const express = require('express')


const displayLink = (req, res, next) => {
    const { userId } = req.session
    if (userId) {
      res.locals = {
        displayLink: true
      }
    } else {
      res.locals = {
        displayLink: false
      }
    }
    next()
  
  }


  module.exports = displayLink