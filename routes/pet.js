var express = require("express");
var router = express.Router();
const petController = require("../controllers/petController");
const multer = require("../middlewares/multer");

router.post("/add/:owner_id", multer("pet"), petController.addPet);

router.get("/formAddPetSelect", petController.showFormAddPet);

router.post("/addPetSelect", multer("pet"), petController.addPetSelect);

router.get("/edit/:pet_id", petController.showEditPet);

router.post("/edit/:pet_id/:img", multer("pet"), petController.editPet);

router.get('/delPet/:pet_id', petController.delPet);

router.get("/allPets", petController.showAllPet);

module.exports = router;
