import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { Box, Button, Container, Grid, Heading, Text } from "@chakra-ui/react";

import kalderHero from "../public/kalder-hero.png";
import kalderMobile from "../public/kalder-mobile.png";
import kalderLogo from "../public/kalder-logo.png";

const Home: NextPage = () => {
  return (
    <Grid
      backgroundColor="brand.border"
      bottom={0}
      gap="1px"
      height="100%"
      left={0}
      minHeight="100vh"
      overflow="hidden"
      padding="1px"
      position="absolute"
      right={0}
      templateColumns="1fr"
      templateRows="75px 1fr"
      top={0}
    >
      <Head>
        <title>Kalder</title>
        <meta name="description" content="Kalder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box display="flex" padding="19px 32px">
        <Image height={37} src={kalderLogo} layout="fixed" width={197} />
        <Button>Manifesto</Button>
        <Button>About</Button>
        <Box flex={1} />
        <Button>Log In</Button>
        <Button>Sign Up</Button>
      </Box>
      <Container maxW="6xl">
        <Box alignItems="center" display="flex" height="100%">
          <Box flex={1}>
            <Heading>Mobilize Communities</Heading>
            <Text>
              A unified platform for brands and creators to launch tokenized
              communities with tiered NFT membership cards, quests and beyond.
            </Text>
            <Text>
              Sign up to build digital economies to where communities build
              ownership and fandom.
            </Text>
            <Button
              backgroundColor="brand.button"
              color="white"
              variant="solid"
            >
              Build a New World
            </Button>
          </Box>
          <Box flex={1}>
            <Image src={kalderMobile} />
            <Image src={kalderHero} />
          </Box>
        </Box>
      </Container>
    </Grid>
  );
};

export default Home;
