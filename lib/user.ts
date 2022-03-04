import { NextApiRequest, NextApiResponse } from "next";
import { getLoginSession } from "./auth";
import { appDB } from "./db";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const session = await getLoginSession(req);
  // appDB({
  // user: [
  //   {
  //     where: {
  //       username: { _eq: "person " },
  //     },
  //   },
  //   {
  //     id: true,
  //     username: true,
  //     user_todos: [
  //       {},
  //       {
  //         todo: {
  //           id: true,
  //           description: true,
  //           is_completed: true,
  //         },
  //       },
  //     ],
  //   },
  // ],
  // })

  // After getting the session you may want to fetch for the user instead
  // of sending the session's payload directly, this example doesn't have a DB
  // so it won't matter in this case
  res.status(200).json({ user: session || null });
}
