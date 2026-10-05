import UserServices, {
  type CreateUserPayload,
} from "../../services/user.services.js";
const queries = {
  users: async () => {
    return await UserServices.getUsers();
  },
  getUserToken: async (
    _: any,
    payload: { email: string; password: string },
  ) => {
    const { email, password } = payload;
    const user = await UserServices.getUserToken({ email, password });
    return user.token;
  },
  getLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (!context.user || !context.user) {
      throw new Error("User not authenticated");
    }
    //const user = await UserServices.getUserByEmail(email);
    return context.user;
  },
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
