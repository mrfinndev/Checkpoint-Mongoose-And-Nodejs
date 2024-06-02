import "dotenv/config";
import express from "express";
import { connectDB } from "./config/connectDatabase.js";
import { Person } from "./models/personSchema.js";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  res.status(200).send("<h1>Welcome To Mongoose Checkpoint</h1>");
});

// Create and Save a Record of a  person

app.get("/create-person-info", async (req, res) => {
  try {
    const person = new Person({
      name: "Daniel Finn",
      age: 25,
      favoriteFoods: ["Rice", "Beans"],
    });

    const data = await person.save();
    console.log("Person saved:", data);
    res.status(200).send("Person created successfully");
  } catch (error) {
    console.error(error);
    res.status(404).send("Error occurred while saving person");
  }
});

// Creating Many Records of people, using the function argument arrayOfPeople.

app.get("/create-people", async (req, res) => {
  try {
    const arrayOfPeople = [
      { name: "Mr Yusuf", age: 30, favoriteFoods: ["Fufu", "Soup"] },
      { name: "Ernest", age: 28, favoriteFoods: ["Burger", "Fries"] },
      { name: "Paul", age: 23, favoriteFoods: ["Egg", "Potato"] },
    ];

    const data = await Person.create(arrayOfPeople);

    console.log("Multiple people created:", data);
    res.status(200).send("Multiple people created");
  } catch (error) {
    console.error(error);
    res.status(404).send("Error occurred while creating multiple people");
  }
});

//  Searching my Database to Find all the people having a given name
app.get("/find-people", async (req, res) => {
  try {
    const data = await Person.find({
      name: ["Daniel Finn", "Mr Yusuf", "Ernest", "Paul"],
    });
    console.log("People found:", data);
    res.status(200).send("People Found");
  } catch (error) {
    console.error(error);
    res.status(404).send("Error occurred while finding people");
  }
});

// Find One Person by Favorite Food and Return a Single Matching Document

app.get("/findone-favorite-food", async (req, res) => {
  try {
    const data = await Person.findOne({
      favoriteFoods: ["Fufu", "Soup"],
    });
    console.log("Person found:", data);
    res.status(200).send("Find person with favorite food");
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .send("Error occurred while finding person with favorite food");
  }
});

// Finding someone by ID
app.get("/find-someone-by-id", async (req, res) => {
  try {
    const personId = "665c41ba4c15da793b78cf2e";

    const data = await Person.findById(personId);
    console.log("PersonId found:", data);
    res.status(200).send("Find Someone By Id");
  } catch (error) {
    console.error(error);
    res.status(404).send("Error occurred while finding someone by id");
  }
});

// Updating someone details by Running FindById, Edit, then Save
app.get("/updating-details", async (req, res) => {
  try {
    const personId = "665c46796e90940e708358b1";

    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).send("Person not found");
    }

    person.favoriteFoods.push("Hamburger");
    await person.save(); // Save the updated document

    console.log("Updated person:", person);
    res.status(200).send("Someone's details have been updated");
  } catch (error) {
    console.error(error);
    res.status(404).send("Error occurred while updating someone's details");
  }
});

// Finding someone by Name and set the person's age to 20.
app.get("/find-and-update", async (req, res) => {
  try {
    const personName = "Paul";

    const data = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    console.log("Updated person:", data);
    res.status(200).send("Someone age has been updated");
  } catch (error) {
    console.error(error);
    res.status(404).send("Error occurred while updating someone age");
  }
});

// Delete one person by the person's _id.
app.get("/find-and-remove", async (req, res) => {
  try {
    const personId = "665c51809a01228204925552";
    // findByIdAndRemove is not a function, so i used findByIdAndDelete
    const data = await Person.findByIdAndDelete(personId);
    if (!data) {
      return res.status(404).send("Person not found");
    }
    console.log("Removed person:", data);
    res.status(200).send("Someone has been removed");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while removing someone");
  }
});

// app.get("/delete-many", async (req, res) => {
//   try {

//     const data = await Person.deleteMany({name: "Mr Yusuf"});

//     console.log("Delete Many:", data);
//     res.status(200).send("Many people has been deleted");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error occurred while deleting many people");
//   }
// });

// Delete All People Named "Mary"

app.get("/delete-many", async (req, res) => {
  try {
    const data = await Person.deleteMany({ name: "Mary" });

    console.log("Delete Many:", data);
    res.status(200).send(`${data.deletedCount} people have been deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while deleting many people");
  }
});

// Find people who like burritos. Sort them by name, limit the results to two documents, and hide their age.
app.get("/chain-search", async (req, res) => {
  try {
    const data = await Person.find({ favoriteFoods: "Burritos" })
      .sort("name")
      .limit(2)
      .select("-age")
      .exec();

    console.log("People who like Burritos:", data);
    res.status(200).send("Finding People who like Burritos  (DONE)");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error occurred while finding people who like burritos");
  }
});

app.listen(port, async (req, res) => {
  try {
    await connectDB();
    console.log(`Server is connected on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
