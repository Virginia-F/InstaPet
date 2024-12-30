const connection = require("../config/db");
const deleteFile = require("../utils/deleteFile");

class PetController {
  addPet = (req, res) => {
    console.log(req.file);
    const { owner_id } = req.params;
    const { name, species, year_adoption, description } = req.body;
    let sql =
      "INSERT INTO pet (name, species, year_adoption, description, owner_id) VALUES (?, ?, ?, ?, ?)";
    let values = [name, species, year_adoption, description, owner_id];

    if (req.file) {
      sql =
        "INSERT INTO pet (name, species, year_adoption, description, owner_id, pet_img) VALUES (?, ?, ?, ?, ?, ?)";
      values.push(req.file.filename);
    }
    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect(`/owner/oneOwner/${owner_id}`);
      }
    });
  };

  showFormAddPet = (req, res) => {
    let sql = "SELECT owner_id, name FROM owner WHERE owner_is_deleted = 0";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log(result);
        res.render("formAddPet", { result });
      }
    });
  };

  addPetSelect = (req, res) => {
    const { name, species, year_adoption, description, owner_id } = req.body;

    if (!name || !species || !year_adoption || !description || !owner_id) {
      let sql = "SELECT owner_id, name FROM owner WHERE owner_is_deleted = 0";
      connection.query(sql, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.render("formAddPet", {
            result,
            message: "Debe rellenar todos los campos",
          });
        }
      });
    } else {
      let sql =
        "INSERT INTO pet (name, species, year_adoption, description, owner_id) VALUES (?, ?, ?, ?, ?)";
      let values = [name, species, year_adoption, description, owner_id];
      if (req.file) {
        sql =
          "INSERT INTO pet (name, species, year_adoption, description, owner_id, pet_img) VALUES (?, ?, ?, ?, ?, ?)";
        values = [
          name,
          species,
          year_adoption,
          description,
          owner_id,
          req.file.filename,
        ];
      }
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.redirect(`/owner/oneOwner/${owner_id}`);
        }
      });
    }
  };

  showEditPet = (req, res, next) => {
    const { pet_id } = req.params;
    let sql = "SELECT * FROM pet WHERE pet_id = ? AND pet_is_deleted = 0";
    connection.query(sql, [pet_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (!result.length) {
          next();
        } else {
          res.render("formEditPet", { result: result[0] });
        }
      }
    });
  };

  editPet = (req, res) => {
    const { pet_id, img } = req.params;
    const { name, species, year_adoption, description } = req.body;

    if (!name || !species || !year_adoption || !description) {
      let result = {
        pet_id: pet_id,
        name: name,
        species: species,
        year_adoption: year_adoption,
        description: description
      };
      res.render("editPet", {
        result,
        message: "Algún campo no está relleno"
      });
    } else {
      let sql =
        "UPDATE pet SET name = ?, species = ?, year_adoption = ?, description = ? WHERE pet_id = ?";
      let values = [name, species, year_adoption, description, pet_id];

      if (req.file) {
        sql =
          "UPDATE pet SET  name = ?, species = ?, year_adoption = ?, description = ?, pet_img = ? WHERE pet_id = ?";
        values = [
          name,
          species,
          year_adoption,
          description,
          req.file.filename,
          pet_id
        ];
      }

      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (req.file) {
            if (img != "null") {
              deleteFile(img, "pet");
            }
          }
          res.redirect("/pet/allPets");
        }
      });
    }
  };

  showAllPet = (req, res) => {
    let sql = `SELECT * FROM pet WHERE pet_is_deleted = 0`;
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("*********************", result);

        res.render("allPets", { result });
      }
    });
  };

  delPet = (req, res) => {
    const {pet_id} = req.params;

    let sql1 = 'SELECT owner_id, pet_img FROM pet WHERE pet_id = ?'
    connection.query(sql1, [pet_id], (errSelect, resultSelect)=>{
        if(errSelect){
            throw errSelect
        }else{
            const {owner_id, pet_img} = resultSelect[0];
            let sql2 = 'DELETE FROM pet WHERE pet_id = ?'
            connection.query(sql2, [pet_id], (errDel, resultDel)=>{
                if(errDel){
                    throw errDel
                }else{
                    //borrar la foto
                    if(pet_img){
                        deleteFile(pet_img, "pet");
                    }
                    res.redirect(`/owner/oneOwner/${owner_id}`);
                };
            });     
        };
    });
  };
}

module.exports = new PetController();
