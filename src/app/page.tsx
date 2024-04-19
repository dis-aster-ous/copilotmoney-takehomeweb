"use client";

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import Image from "next/image";
import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";

interface Note {
  location: string;
  note: string;
}

interface Bird {
  nameEnglish: string;
  nameSpanish: string;
  nameLatin: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  notes: Note[];
}

const firebaseConfig = {
  apiKey: "AIzaSyD76vQKsxYk19iRzACjT_A9apXAoFEtm7Q",
  authDomain: "copilot-take-home-fc0d7.firebaseapp.com",
  projectId: "copilot-take-home-fc0d7",
  storageBucket: "copilot-take-home-fc0d7.appspot.com",
  messagingSenderId: "410259109691",
  appId: "1:410259109691:web:48c8180df4ef8cbf47a91e",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(firebaseApp);
const birdsCol = collection(db, "birds");

const DRAWER_WIDTH = 240;

interface BirdListItemProps {
  nameEnglish: string;
  nameLatin: string;
  imageUrl: string;
}

const BirdListItem = ({
  nameEnglish,
  nameLatin,
  imageUrl,
}: BirdListItemProps) => {
  return (
    <Grid xs={3}>
      <Box>
        <img src={imageUrl} />
        <p>{nameEnglish}</p>
        <p>{nameLatin}</p>
      </Box>
    </Grid>
  );
};

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [birds, setBirds] = useState<Bird[]>([]);

  useEffect(() => {
    signInAnonymously(auth).then(() => setIsSignedIn(true));
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      getDocs(birdsCol).then((birdsDocs) => {
        const birdsData = birdsDocs.docs.map((doc) => {
          const data = doc.data();

          return {
            nameEnglish: data.name.english,
            nameSpanish: data.name.spanish,
            nameLatin: data.name.latin,
            imageThumbUrl: data.images.thumb,
            imageFullUrl: data.images.full,
            notes: [],
          };
        });

        setBirds(birdsData);
      });
    }
  }, [isSignedIn]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          backgroundColor: "white",
        }}
      >
        <Toolbar>
          <Breadcrumbs aria-label="breadcrumb">
            <span color="inherit">Birds</span>
          </Breadcrumbs>
        </Toolbar>
        <Toolbar>
          <TextField
            id="outlined-search"
            label="Search for birds"
            type="search"
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <p>The Birds App</p>
        </Toolbar>
        <Divider />
        <Button variant="contained" disabled sx={{ margin: "8px 16px" }}>
          Home
        </Button>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Toolbar />
        <Grid container spacing={3}>
          {birds.map((bird, i) => (
            <BirdListItem
              key={i}
              nameEnglish={bird.nameEnglish}
              nameLatin={bird.nameLatin}
              imageUrl={bird.imageThumbUrl}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
