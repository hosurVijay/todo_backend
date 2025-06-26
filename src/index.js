import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./DB/index.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is Live and Hot on ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log("Something Went worong....", error);
  });
