import { db } from "../lib/db.js";
import { createHmac, randomBytes } from "node:crypto";

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile_image_url: string;
}

class UserServices {
  public static async getUsers() {
    return db.orm.public.User.select(
      "id",
      "firstName",
      "lastName",
      "email",
      "profileImageURL",
    ).all();
  }

  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password, profile_image_url } = payload;

    //create a salt if not provided
    const userSalt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", userSalt)
      .update(password)
      .digest("hex");
    // Implement the logic to create a user using the provided payload
    // For example, you might want to save the user data to a database

    await db.orm.public.User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImageURL: profile_image_url,
      salt: userSalt,
    })
      .then((user) => {
        console.log("Created user:", user.firstName, user.lastName, user.email);
        return user;
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        throw new Error("Failed to create user");
      });

    // Add your implementation here
  }
}

//export default UserServices;
export default UserServices;
