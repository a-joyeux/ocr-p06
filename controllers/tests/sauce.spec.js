const mongoose = require("mongoose");
const SauceSchema = require("../../models/sauce.js");

describe("Sauce Model Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { autoIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  test("Sauce creation", async () => {
    const validSauceData = {
      userId: "paf@the.doggy",
      name: "Chimichuri",
      manufacturer: "Sauce Inc.",
      description: "Sauce qui pique",
      mainPepper: "Poivre",
      imageUrl: "/public/data/img/chim.jpg",
      heat: 5,
      likes: 0,
    };

    const validSauce = new SauceSchema(validSauceData);
    const savedSauce = await validSauce.save();
    console.log(savedSauce);
    expect(savedSauce._id).toBeDefined();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
