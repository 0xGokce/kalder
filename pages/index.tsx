import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { GET_CUSTOMER_BY_EMAIL } from "queries/getCustomerByEmail";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Where communities become owners.</h1>

        <p className={styles.description}>Join communities, collect rewards.</p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Starface Silver &rarr;</h2>
            <p>
              Starface is a digital-first lifestyle brand that brings beauty and
              joy to every day rituals
            </p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Adidas Ape Club &rarr;</h2>
            <p>
              Hill House Home is a digital-first lifestyle brand that brings
              beauty and joy to every day rituals.
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Balenciagaverse &rarr;</h2>
            <p>
              Hill House Home is a digital-first lifestyle brand that brings
              beauty and joy to every day rituals.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
