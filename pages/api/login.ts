import { magicAdmin } from "../../lib/magic";
import { setLoginSession } from "../../lib/auth";
import { NextApiHandler } from "next";

const login: NextApiHandler = async (req, res) => {
  try {
    const didToken = req.headers?.authorization?.substr(7);
    if (!didToken) {
      throw new Error("No authorization header");
    }

    const metadata = await magicAdmin.users.getMetadataByToken(didToken);
    const session = { ...metadata };

    await setLoginSession(res, session);

    res.status(200).send({ done: true });
  } catch (error) {
    const e = error as any;
    res.status(e.status || 500).end(e.message);
  }
};

export default login;
