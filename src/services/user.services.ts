import { db } from "../lib/db.js";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile_image_url: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
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

  public static async getUserByEmail(email: string) {
    return await db.orm.public.User.select(
      "id",
      "firstName",
      "lastName",
      "email",
      "password",
      "salt",
    )
      .where({ email: email })
      .first();
  }

  public static async getUserById(userId: number) {
    return await db.orm.public.User.select(
      "id",
      "firstName",
      "lastName",
      "email",
      "profileImageURL",
    )
      .where({ id: userId })
      .first();
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

  // Implement the getUserToken method to retrieve a user token based on email and password
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;

    // Implement the logic to retrieve a user token based on the provided email and password
    // For example, you might want to check the credentials against a database and generate a token

    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      throw new Error("Invalid credentials");
    }

    // Generate a token (for example, using JWT)
    const token = JWT.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET || "UHfTBCsNIb",
      {
        expiresIn: "1h",
      },
    ); // Replace with actual token generation logic

    //return the generated token
    return { token };
  }

  //decode the token and verify it and return the user details
  public static async verifyUserToken(token: string) {
    try {
      const decoded = JWT.verify(
        token,
        process.env.JWT_SECRET || "UHfTBCsNIb",
      ) as {
        userId: number;
        email: string;
        firstName: string;
        lastName: string;
      };

      console.log("Decoded token:", decoded);

      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

//export default UserServices;
export default UserServices;
