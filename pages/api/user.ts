import { getLoginSession } from "@/lib/auth";
import { NextApiHandler } from "next";

const user: NextApiHandler = async (req, res) => {
  try {
    if (!req.cookies.token) return res.json({ user: null });

    const user = await getLoginSession(req);
    res.status(200).json({ user });
  } catch (error) {
    res.status(200).json({ user: null });
  }
};

export default user;
