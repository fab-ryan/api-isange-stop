import { v4 as uuidv4 } from 'uuid';
export const uuid = () => uuidv4();
export const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
