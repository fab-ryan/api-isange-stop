import { v4 as uuidv4 } from 'uuid';
export const uuid = () => uuidv4();
export const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

interface User {
  email: string;
  role: string;
}
export const formatRequest = (req: Request) => {
  const { headers } = req;

  const user = (req as any).user as User;
  return {
    headers,
    user,
  };
};
