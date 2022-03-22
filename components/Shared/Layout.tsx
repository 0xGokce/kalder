import Head from "next/head";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  return (
    <div className="Layout">
      <Head>
        <title>Loyal3</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <Header />
      <div className="Content">{props.children}</div>
      {/* <NavBar navButtons={navButtons} /> */}
    </div>
  );
};

export default Layout;
