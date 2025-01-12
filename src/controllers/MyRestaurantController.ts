import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const getMyRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

const createMyRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      res.status(409).json({ message: "User restaurant already exists" });
      return;
    }

    const imageUrl = req.file ? await uploadImage(req.file) : undefined;

    const restaurant = new Restaurant({
      ...req.body,
      imageUrl,
      user: new mongoose.Types.ObjectId(req.userId),
      lastUpdated: new Date(),
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const { restaurantName, city, country, deliveryPrice, estimatedDeliveryTime, cuisines, menuItems } = req.body;

    restaurant.restaurantName = restaurantName || restaurant.restaurantName;
    restaurant.city = city || restaurant.city;
    restaurant.country = country || restaurant.country;
    restaurant.deliveryPrice = deliveryPrice || restaurant.deliveryPrice;
    restaurant.estimatedDeliveryTime = estimatedDeliveryTime || restaurant.estimatedDeliveryTime;
    restaurant.cuisines = cuisines || restaurant.cuisines;
    restaurant.menuItems = menuItems || restaurant.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  const base64Image = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
};
