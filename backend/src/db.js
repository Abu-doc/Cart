import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://abu:Abubakar@fnpdatabase.ruvgsom.mongodb.net/?appName=Fnpdatabase", 
      {
        dbName: "vibecart"
      }
    );
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error", err);
  }
};
