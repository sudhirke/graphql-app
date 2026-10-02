import UserServices, {
  type CreateUserPayload,
} from "../../services/user.services.js";
const queries = {
  users: () => UserServices.getUsers(),
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    //const { firstName, lastName, email, password } = args;
    await UserServices.createUser(payload)
      .then((user) => {
        console.log("User created successfully!!!");
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        throw new Error("Failed to create user");
      });
  },
};

export const resolvers = { queries, mutations };
