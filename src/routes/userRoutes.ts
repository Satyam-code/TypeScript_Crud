import { Router } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../entities/User";
import { sendEvent } from "../services/rabbitmqService";
import path from "path";

const router = Router();

router.get("/dashboard", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../public/Expense_Reports_Dashboard.html"
  );
  console.log(filePath);
  res.sendFile(filePath);
});

// Get all Users
router.get("/users", async (req, res) => {
  try {
    const users = await AppDataSource.manager.find(User, {
      select: ["id", "name", "email", "age"],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

// Get a single User by ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await AppDataSource.manager.findOne(User, {
      where: { id: parseInt(id) },
      select: ["id", "name", "email", "age"],
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user" });
  }
});

// Update a User by ID
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const user = await AppDataSource.manager.findOneBy(User, {
      id: parseInt(id),
    });
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.age = age || user.age;

      await AppDataSource.manager.save(user);
      res.status(200).json({
        message: "User updated",
        user: {
          id: user.id,
          email: user.email,
          age: user.age,
        },
      });
      // Send event to RabbitMQ
      await sendEvent(
        "audit_logs",
        JSON.stringify({
          type: "USER_UPDATED",
          data: {
            user_id: user.id,
            email: user.email,
            logData: "User Updated",
            created_at: Date.now(),
          },
        })
      );
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// Delete a User by ID
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await AppDataSource.manager.findOneBy(User, {
      id: parseInt(id),
    });
    if (user) {
      await AppDataSource.manager.remove(user);
      res.status(200).json({ message: "User deleted" });
      // Send event to RabbitMQ
      await sendEvent(
        "audit_logs",
        JSON.stringify({
          type: "USER_DELETED",
          data: {
            user_id: id,
            email: user.email,
            logData: "User Deleted",
            created_at: Date.now(),
          },
        })
      );
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
