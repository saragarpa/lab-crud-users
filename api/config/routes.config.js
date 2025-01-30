const express = require("express");
const router= express.Router();
const createError = require("http-errors");
const users = require("../controllers/users.controller");

// EVENT ROUTES
// router.get('/users', users.list);
router.post('/users', users.create);
// router.get('/users/:id', users.detail);
// router.delete('/users/:id', users.delete);
// router.patch('/users/:id', users.update);



// Error Handling

// Not found Route
router.use((req, res, next) => {
    next(createError(404, "Route not found"))
});

module.exports = router;