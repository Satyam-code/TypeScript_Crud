import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

const router = Router();

// Create a new User
router.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, age, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await AppDataSource.manager.findOneBy(User, { email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    // If no existing user, proceed with creation
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(name, email, age, hashedPassword);
    user.name = name;
    user.email = email;
    user.age = age;
    user.password = hashedPassword;

    await AppDataSource.manager.save(user);

    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
});

export default router;
