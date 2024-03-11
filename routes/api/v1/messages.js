//require express
const express = require("express");
//create new router
const router = express.Router();

//import controller
const messagesContoller = require("../../../controllers/api/v1/messages");

router.get("/", messagesContoller.index);
router.post("/", messagesContoller.create);
router.put("/:id", messagesContoller.update);
router.patch("/:id", messagesContoller.update);
// router.delete("/:id", commentsController.destroy);


module.exports = router;