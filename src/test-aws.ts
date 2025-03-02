import * as dotenv from 'dotenv';
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

dotenv.config();

async function testAWS() {
  console.log("Testing AWS connection...");
  console.log("AWS_REGION:", process.env.AWS_REGION);
  console.log("EC2_INSTANCE_ID:", process.env.EC2_INSTANCE_ID);
  
  // Make sure instanceId is not undefined
  const instanceId = process.env.EC2_INSTANCE_ID;
  if (!instanceId) {
    console.error("EC2_INSTANCE_ID environment variable is not set");
    return;
  }
  
  try {
    const ec2Client = new EC2Client({ region: process.env.AWS_REGION || 'us-east-1' });
    const command = new DescribeInstancesCommand({
      InstanceIds: [instanceId]  // Using the validated instanceId
    });
    
    console.log("Sending request to AWS...");
    const response = await ec2Client.send(command);
    console.log("Response received:", JSON.stringify(response, null, 2));
    console.log("AWS connection successful!");
  } catch (error) {
    console.error("AWS connection failed:", error);
  }
}

testAWS(); 