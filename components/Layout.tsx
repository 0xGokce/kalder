import Head from "next/head";
// import "./Layout.scss";
// import "./index.scss";
import headerButtons from "../config/headerButtons";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const appTitle = "Loyal3";

  return (
    <div className="Layout">
      <Head>
        <title>Loyal3</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <Header appTitle={appTitle} headerButtons={headerButtons} />
      <div className="Content">{props.children}</div>
      {/* <NavBar navButtons={navButtons} /> */}
    </div>
  );
};

export default Layout;
