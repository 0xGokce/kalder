import { removeTokenCookie } from "@/lib/auth-cookies";
import { NextApiHandler } from "next";

const logout: NextApiHandler = async (req, res) => {
  try {
    removeTokenCookie(res);
    res.status(200).send({ done: true });
  } catch (error) {
    const e = error as any;
    res.status(e.status || 500).end(e.message);
  }
};

export default logout;
