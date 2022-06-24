import mongoose from "mongoose";

/* 
0 = disconnected
1 = connected
2 = connecting
3 = disconnecting
*/
const mongooseConnection = {
  isConected: 0,
};

export const connect = async () => {
  if (mongooseConnection.isConected === 1) {
    return;
  }

  if (mongoose.connections.length > 0) {
    mongooseConnection.isConected = mongoose.connections[0].readyState;

    if (mongooseConnection.isConected == 1) {
      return;
    }

    mongooseConnection.isConected = 3;
    await mongoose.disconnect();
    mongooseConnection.isConected = 0;
  }

  mongooseConnection.isConected = 2;

  await mongoose.connect(process.env.MONGO_URL || "");
  mongooseConnection.isConected = 1;
  console.log("conectado a mongo...");
};

export const disconnect = async () => {
  if (mongooseConnection.isConected === 0) return;
  mongooseConnection.isConected = 3;
  await mongoose.disconnect();
  mongooseConnection.isConected = 0;
  console.log("desconectado de mongo");
};
