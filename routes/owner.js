var express = require("express");
var router = express.Router();
const ownerController = require("../controllers/ownerController");
const multer = require("../middlewares/multer");

router.get("/registerOwner", ownerController.showRegister);

router.post("/registerOwner", multer("owner"), ownerController.register);

router.get("/oneOwner/:id", ownerController.showOneOwner);

router.get('/edit/:owner_id', ownerController.showEditOwner);

router.post('/edit/:owner_id/:img', multer("owner"), ownerController.editOwner);

router.get('/logicDel/:owner_id', ownerController.logicDel);


module.exports = router;
