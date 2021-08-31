const express = require('express');

const router = express.Router({ mergeParams: true });
const { authorize } = require('../middleware/auth');
const { get, update, remove } = require('../handlers/user');

router.route('/:userId')
  .get(authorize, get)
  .put(authorize, update)
  .delete(authorize, remove);

module.exports = router;
