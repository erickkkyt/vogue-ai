import { withDbRequestContext } from '@/db';
import { getAuth } from '@/lib/auth';

const handler = async (request: Request) => {
  return withDbRequestContext(async () => {
    const auth = await getAuth();

    return auth.handler(request);
  });
};

export { handler as GET, handler as POST };
