const User = require("../models/user");
const image = require("../utils/image");
const bcrypt = require("bcryptjs");

const getMe = async (req, res) => {
  const { user_id } = req.user;

  try {
    const response = await User.findById(user_id).select("-password -__v");

    if (!response) {
      return res.status(400).send({
        status: "error",
        message: "No se encontra usuario",
      });
    }
    return res.status(200).send({
      status: "success",
      response,
    });
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Error al obtener usuario",
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  const userData = req.body;

  // password
  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    const hasPassword = bcrypt.hashSync(userData.password, salt);
    userData.password = hasPassword;
  } else {
    delete userData.password;
  }

  // avatar

  if (req.files && req.files.avatar) {
    const imagePath = image.getFileName(req.files.avatar);
    userData.avatar = imagePath;
  }

  try {
    const user = await User.findByIdAndUpdate({ _id: id }, userData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado usuario a actualizar",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Usuario actualizado con exito",
      user,
    });
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Error del servidor al actulizar usuario",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userDel = await User.findByIdAndDelete({ _id: id });

    if (!userDel) {
      return res.status(404).send({
        status: "error",
        message: "No se encontró el usuario especificado",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Usuario Eliminado con éxito",
      user: userDel,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error interno del servidor al eliminar el usuario",
    });
  }
};
module.exports = {
  getMe,
  updateUser,
  deleteUser,
};
