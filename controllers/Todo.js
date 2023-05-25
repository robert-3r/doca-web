const Todo = require("../models/todo");

const createTodo = async (req, res) => {
  const userId = req.user.user_id;

  const todo = new Todo({
    name: req.body.name,
    user: userId, // Asignar el ID del usuario al campo user
    description: req.body.description,
    completed: req.body.completed,
  });

  try {
    const todoStored = await todo.save();

    if (!todoStored) {
      return res.status(404).send({
        status: "error",
        message: "Ocurrio un error  al crear la tarea",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Tearea creado con exito",
      todoStored,
    });
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Ocurrio un error en el servidor",
      error,
    });
  }
};

const getTodos = async (req, res) => {
  const { completed, search } = req.query;
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: { createAt: -1 },
  };
  const userId = req.user.user_id;
  const query = { user: userId };

  if (completed !== undefined) {
    const completedValue = completed === "true"; // Convertir el valor de "completed" a booleano
    query.completed = completedValue;
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  try {
    const todos = await Todo.paginate(query, options);
    if (!todos) {
      return res.status(400).send({
        status: "error",
        message: "Error al obtener las tareas",
      });
    }

    return res.status(200).send({
      status: "success",
      todos,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Error del servidor al obtener las tareas",
      error: error.message,
    });
  }
};

const updateTodo = async (req, res) => {
  const { id } = req.params;

  const todoData = req.body;

  try {
    const todoStored = await Todo.findByIdAndUpdate({ _id: id }, todoData, {
      new: true,
      runValidators: true,
    });

    if (!todoStored) {
      return res.status(404).send({
        status: "error",
        message: "No se encontro tarea a actulizar",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Tarea actulizado con exito",
      todoStored,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Ocurrió un error al actualizar la tarea",
      error: error.message,
    });
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const TodoDel = await Todo.findOneAndDelete({ _id: id });

    if (!TodoDel) {
      return res.status(404).send({
        status: "error",
        message: "No se encontró la tarea a eliminar",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Tarea eliminado con exito",
      user: TodoDel,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error interno del servidor al eliminar una tarea",
    });
  }
};

// const searchTodos = async (req, res) => {
//   const { search } = req.params;
//   const userId = req.user.user_id;

//   let response = null;
//   let query = { user: userId };

//   if (search) {
//     query.name = { $regex: search, $options: "i" };
//   }

//   try {
//     response = await Todo.find(query)
//       .sort({ createAt: -1 })
//       .select("-__v")
//       .lean();

//     if (response.length === 0) {
//       return res.status(404).send({
//         status: "success",
//         message: "No se encontraron coincidencias.",
//       });
//     }

//     return res.status(200).send({
//       status: "success",
//       response,
//     });
//   } catch (error) {
//     return res.status(404).send({
//       status: "error",
//       message: "Error al obtener las tareas",
//     });
//   }
// };

const deleteAllUserTodos = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const deletedTodos = await Todo.deleteMany({ user: userId });

    if (deletedTodos.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "No se encontraron tareas para eliminar",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Todas las tareas del usuario han sido eliminadas",
      deletedCount: deletedTodos.deletedCount,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error interno del servidor al eliminar las tareas del usuario",
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  deleteAllUserTodos,
};
