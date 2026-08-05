import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const url = process.env.DATABASE_URL;
    const connection = await mongoose.connect(url);

    console.log(
      colors.bgBlue.white(
        `Servidor MongoDB conectado en ${connection.connection.host} : ${connection.connection.port}`,
      ),
    );
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};
