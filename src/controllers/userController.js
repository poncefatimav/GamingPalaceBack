const { User, Productinchart, Cart } = require("../db");
const users = require("../utils/usersDB");

const getUsers = async () => {
  const allUsers = await User.count();
  if (allUsers < 1) {
    let newUser = {};
    let filter = users.map((user) => {
      newUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.image,
        address: user.address,
        role: user.role,
      };
      return newUser;
    });
    await User.bulkCreate(filter);
  }
};

const userToDB = async () => {
  const allUsers = await User.findAll();
  if (!allUsers.length) {
    let newUser = {};
    let filter = users.map((user) => {
      newUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.image,
        address: user.address,
        role: user.role,
      };
      return newUser;
    });
    await User.bulkCreate(filter);
    //
  } else {
    const usersEnable = await User.findAll({
      include: { all: true, nested: true },
      where: {
        disabled: false,
      },
    });
    return usersEnable;
  }
};

const postNewUser = async (userObj) => {
  let response = await validation(userObj.email);
  if (response === "Email already registered") {
    console.log("Email ya registrado");
    throw new Error("Post message: Email already registered");
  }
  console.log("Creando usuario");
  try {
    let { name, email, password, image, address, role, verified } = userObj;
    let cuenta = await User.count();
    cuenta++;
    id = cuenta;

    const user = {
      id,
      name,
      email,
      password,
      image,
      address,
      role,
      verified
    };

    let newUser = await User.create(user);
    //crear carrito
    let newcart = await Cart.create({
      id: id,
    });
    //anexionar carrito al user
    let creation = await newUser.addCart(newcart);
    //return creation
    return newUser;
  } catch (error) {
    console.log("Error in postNewProduct", error);
  }
};

const validation = async (email) => {
  if (!email) {
    throw new Error("function validation needs a mail");
  }
  let infoDB = await User.findAll({
    where: {
      email: email,
    },
  });
  console.log("infoDB es:");
  console.log(infoDB.length);
  if (infoDB.length > 0) {
    return "Email already registered";
  } else {
    //throw new Error("Email not registered");
    console.log("Email not registered");
    return "Email not registered";
  }
};

const login = async (email, password) => {
  //let { email, password } = user;
  let allusers = await User.findAll({
    where: {
      email: email,
      password: password,
    },
  });
  if (allusers.length > 0) {
    console.log(allusers[0].dataValues);
    return allusers[0].dataValues;
  } else {
    throw new Error("Invalid credentials");
  }
};

const updateInfo = async (id, name, email, password, image, address, role, verified) => {
  //const { name, email, password, image, address, role } = req.body;
  console.log("ENTRANDO A UPDATEINFO");
  console.log("ID ES");
  console.log(id);
  let updateUser = await User.update(
    {
      name: name,
      email: email,
      password: password,
      image: image,
      address: address,
      role: role,
      verified: verified
    },
    { where: { id: id } }
  );
  console.log("UPDATE USER:");
  console.log(updateUser);
  return updateUser;
};

// const infoupdate = async();
async function userbymail (mail) {
  console.log("ENTRANDO A funcion GET_USER_BY_MAIL")
  console.log("MAIL ES...")
  console.log(mail)
//chequear que tenga valor
if (!mail) {
  throw new Error ("UserByMail debe recibir un email")
}
//TRAER TODOS LOS USUARIOS CON DISABLED FALSE Y MAIL: MAIL
let data = await User.findAll({
  where: {
    email: mail,
    disabled: false
  }
})
if (data.length > 1) {throw new Error("There is more than one user with that mail")}
return data

}

module.exports = {
  getUsers,
  userToDB,
  postNewUser,
  validation,
  login,
  updateInfo,
  userbymail
};
