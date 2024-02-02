import crypto from 'crypto';

export const generateHash = (data: any): string | null => {
  try {
    const jsonString = JSON.stringify(data);
    const hashValue = crypto.createHash('sha256').update(jsonString).digest('hex');
    return hashValue;
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  }
};
