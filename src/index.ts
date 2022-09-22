import mongoose from 'mongoose';
import server from './server';

const defaultPort = 8000;

const port = process.env.PORT || defaultPort;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
start();

server.listen(port, () => {
  console.info(`Server is started on port ${port}`);
});
