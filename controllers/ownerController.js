const connection = require("../config/db");
const deleteFile = require("../utils/deleteFile");
const bcrypt = require("bcrypt");

class OwnerController {
  showRegister = (req, res) => {
    res.render("registerOwner");
  };

  register = (req, res) => {
    console.log(req.file);

    const {
      name,
      last_name,
      description,
      phone_number,
      email,
      password,
      repPassword,
    } = req.body;
    if (
      !name ||
      !last_name ||
      !description ||
      !phone_number ||
      !email ||
      !password ||
      !repPassword
    ) {
      res.render("registerOwner", {
        message: "Por favor rellene todos los campos",
      });
    } else if (password == repPassword) {
      bcrypt.hash(password, 10, (errHash, hash) => {
        if (errHash) {
          throw errHash;
        } else {
          let sql = `INSERT INTO owner (name, last_name, description, phone_number, email, password) VALUES (?, ?, ?, ?, ?, ?)`;
          let values = [
            name,
            last_name,
            description,
            phone_number,
            email,
            hash,
          ];
          if (req.file) {
            sql = `INSERT INTO owner (name, last_name, description, phone_number, email, password, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            values.push(req.file.filename);
          }

          connection.query(sql, values, (err, result) => {
            if (err) {
              if (err.errno == 1062) {
                res.render("registerOwner", { message: "El email ya existe" });
              } else {
                throw err;
              }
            } else {
              res.redirect("/");
            }
          });
        }
      });
    } else {
      res.render("registerOwner", { message: "Las contraseñas no coinciden" });
    }
  };

  showOneOwner = (req, res, next) => {
    const { id } = req.params;
    let sqlOwner =
      "SELECT * FROM owner WHERE owner_id = ? AND owner_is_deleted = 0";
    let sqlPet = "SELECT * FROM pet WHERE owner_id = ? AND pet_is_deleted = 0";

    connection.query(sqlOwner, [id], (errOwner, resultOwner) => {
      if (errOwner) {
        throw errOwner;
      } else {
        if (resultOwner.length == 0) {
          next();
        } else {
          connection.query(sqlPet, [id], (errPet, resultPet) => {
            if (errPet) {
              throw errPet;
            } else {
              console.log("**************", resultOwner);
              console.log("+++++++++++++++", resultPet);

              res.render("oneOwner", {
                resultOwner: resultOwner[0],
                resultPet,
              });
            }
          });
        }
      }
    });
  };

  showEditOwner = (req, res, next) => {
    const { owner_id } = req.params;
    let sql = "SELECT * FROM owner WHERE owner_id = ? AND owner_is_deleted = 0";
    connection.query(sql, [owner_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (!result.length) {
          next();
        } else {
          res.render("formEditOwner", { result: result[0] });
        }
      }
    });
  };

  editOwner = (req, res) => {
    const { owner_id, img } = req.params;
    const { name, last_name, description, phone_number } = req.body;

    if (!name || !last_name || !description || !phone_number) {
      let result = {
        owner_id: owner_id,
        name: name,
        last_name: last_name,
        description: description,
        phone_number: phone_number,
      };
      res.render("editOwner", {
        result,
        message: "Por favor rellene todos los campos",
      });
    } else {
      let sql =
        "UPDATE owner SET name = ?, last_name = ?, description = ?, phone_number = ? WHERE owner_id = ?";
      let values = [name, last_name, description, phone_number, owner_id];

      if (req.file) {
        sql =
          "UPDATE owner SET name = ?, last_name = ?, description = ?, phone_number = ?, image = ? WHERE owner_id = ?";
        values = [
          name,
          last_name,
          description,
          phone_number,
          req.file.filename,
          owner_id,
        ];
      }

      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (req.file) {
            if (img != "null") {
              deleteFile(img, "owner");
            }
          }
          res.redirect(`/owner/oneOwner/${owner_id}`);
        }
      });
    }
  };

  logicDel = (req, res) => {
    const { owner_id } = req.params;
    let sql = `UPDATE owner LEFT JOIN pet
    ON owner.owner_id = pet.owner_id
    SET
    owner.owner_is_deleted = 1, pet.pet_is_deleted = 1
    WHERE
    owner.owner_id = ?`;

    connection.query(sql, [owner_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/");
      }
    });
  };
}

module.exports = new OwnerController();
