import { NextApiHandler } from "next";

const user: NextApiHandler = (req, res) => {
  return res.status(200).send(null);
  /**
   * Uncomment the below if you want a fake test user
   */

  // return res.status(200).send({
  //   user: {
  //     userName: "Test User 1",
  //     walletAddress: "0xabcdefghijklmnopqrstuvxywz",
  //   },
  // });
};

export default user;
