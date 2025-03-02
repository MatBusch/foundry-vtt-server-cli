import { EC2Client, StartInstancesCommand, StopInstancesCommand, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

// Initialize the EC2 client
export const createEC2Client = (region: string = 'us-east-1') => {
  return new EC2Client({ region });
};

/**
 * Start an EC2 instance
 * @param instanceId The ID of the instance to start
 * @param ec2Client The EC2 client to use
 * @returns Promise with the response from the EC2 API
 */
export const startInstance = async (instanceId: string, ec2Client: EC2Client) => {
  try {
    const command = new StartInstancesCommand({
      InstanceIds: [instanceId],
    });
    
    const response = await ec2Client.send(command);
    return {
      success: true,
      message: `Instance ${instanceId} starting`,
      data: response.StartingInstances,
    };
  } catch (error) {
    console.error('Error starting EC2 instance:', error);
    return {
      success: false,
      message: `Failed to start instance ${instanceId}`,
      error,
    };
  }
};

/**
 * Stop an EC2 instance
 * @param instanceId The ID of the instance to stop
 * @param ec2Client The EC2 client to use
 * @returns Promise with the response from the EC2 API
 */
export const stopInstance = async (instanceId: string, ec2Client: EC2Client) => {
  try {
    const command = new StopInstancesCommand({
      InstanceIds: [instanceId],
    });
    
    const response = await ec2Client.send(command);
    return {
      success: true,
      message: `Instance ${instanceId} stopping`,
      data: response.StoppingInstances,
    };
  } catch (error) {
    console.error('Error stopping EC2 instance:', error);
    return {
      success: false,
      message: `Failed to stop instance ${instanceId}`,
      error,
    };
  }
};

/**
 * Get the status of an EC2 instance
 * @param instanceId The ID of the instance to check
 * @param ec2Client The EC2 client to use
 * @returns Promise with the instance status
 */
export const getInstanceStatus = async (instanceId: string, ec2Client: EC2Client) => {
  try {
    const command = new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    });
    
    const response = await ec2Client.send(command);
    
    if (!response.Reservations || response.Reservations.length === 0 || 
        !response.Reservations[0].Instances || response.Reservations[0].Instances.length === 0) {
      return {
        success: false,
        message: `Instance ${instanceId} not found`,
      };
    }
    
    const instance = response.Reservations[0].Instances[0];
    return {
      success: true,
      message: `Instance ${instanceId} is ${instance.State?.Name}`,
      data: instance,
    };
  } catch (error) {
    console.error('Error getting EC2 instance status:', error);
    return {
      success: false,
      message: `Failed to get status for instance ${instanceId}`,
      error,
    };
  }
};
