const mongoose = require("mongoose");
const UserSchema = require("../../models/user.js");

describe("User Model Test", () => {
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

  test("User should have : _id / email and a hashed password", async () => {
    const validUserData = {
      email: "paf@the.doggy",
      password: "pafpaf",
    };

    const validUser = new UserSchema(validUserData);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUserData.email);
    expect(savedUser.password).not.toMatch(validUserData.password);
  });

  test.each([
    {
      email: "paf@the.doggy",
    },
    {
      password: "pafpaf",
    },
  ])("Missing parameter should throw errow : %s", async (invalidData) => {
    const userWithoutRequiredField = new UserSchema(invalidData);
    let err;
    try {
      const savedUserWithoutRequiredField =
        await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
