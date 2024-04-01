// Import the necessary modules
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import dotenv from 'dotenv';

// Load the AWS credentials from the .env file
dotenv.config({ path: "./src/aws/.env" });

console.log('AWS credentials loaded');
console.log(`AWS region: ${process.env.AWS_REGION}`);
console.log(`AWS access key ID: ${process.env.AWS_ACCESS_KEY_ID}`);
console.log(`AWS secret access key: ${process.env.AWS_SECRET_ACCESS_KEY}`);

// Create a new instance of the TranscribeStreamingClient using the credentials from the .env file
const client = new TranscribeStreamingClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

export default client;
