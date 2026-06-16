import { getAuth } from '@/lib/auth';

const handler = async (request: Request) => {
  const auth = await getAuth();

  return auth.handler(request);
};

export { handler as GET, handler as POST };
