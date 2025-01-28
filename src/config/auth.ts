import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/ormconfig";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";

// Generate JWT token
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

// Verify JWT token
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(403).json({ message: "Access denied." });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({ message: "Invalid token." });
      return;
    }

    const userId = decoded.userId;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      (req as Request & { user: User }).user = user;
      next();
    } catch (err) {
      res.status(500).json({ message: "Server error." });
    }
  });
};

// Authenticate user and generate JWT token on login
export const authenticateUser = async (email: string, password: string) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) throw new Error("User not found");

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Generate and return the JWT token
    const token = generateToken(user.id.toString());
    return token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
