import { Request, Response } from "express";
import User from "../models/user";

// Get the current user based on userId
const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(currentUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Create a new user if it doesn't already exist
const createCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth0Id } = req.body;

    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      res.status(200).send();
      return;
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Update the current user's details
const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, addressLine1, country, city } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update user fields
    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser,
};
