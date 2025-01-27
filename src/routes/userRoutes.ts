import { Router } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';
import path from 'path';

const router = Router();

// Create a new User
router.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const user = new User(name, email, age);
        user.name = name;
        user.email = email;
        user.age = age;

        await AppDataSource.manager.save(user);
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.get('/dashboard', (req, res) => {
    const filePath = path.join(__dirname, '../../public/Expense_Reports_Dashboard.html');
    console.log(filePath); // Debugging path
    res.sendFile(filePath);
});


// Get all Users
router.get('/users', async (req, res) => {
    try {
        const users = await AppDataSource.manager.find(User);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

// Get a single User by ID
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await AppDataSource.manager.findOneBy(User, { id: parseInt(id) });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user' });
    }
});

// Update a User by ID
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    try {
        const user = await AppDataSource.manager.findOneBy(User, { id: parseInt(id) });
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.age = age || user.age;

            await AppDataSource.manager.save(user);
            res.status(200).json({ message: 'User updated', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

// Delete a User by ID
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await AppDataSource.manager.findOneBy(User, { id: parseInt(id) });
        if (user) {
            await AppDataSource.manager.remove(user);
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

export default router;
