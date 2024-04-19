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
import Link from "@mui/material/Link";

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
  onClick: () => void;
}

const BirdListItem = ({
  nameEnglish,
  nameLatin,
  imageUrl,
  onClick,
}: BirdListItemProps) => {
  return (
    <Grid xs={3}>
      <Box onClick={onClick}>
        <img src={imageUrl} />
        <p>{nameEnglish}</p>
        <p>{nameLatin}</p>
      </Box>
    </Grid>
  );
};

interface BirdDisplayProps {
  imageFullUrl: string;
  imageThumbUrl: string;
  nameSpanish: string;
  nameLatin: string;
  notes: Note[];
}

const BirdDisplay = ({
  imageFullUrl,
  imageThumbUrl,
  nameSpanish,
  nameLatin,
  notes,
}: BirdDisplayProps) => {
  return (
    <Box>
      <img style={{ maxWidth: "300px" }} src={imageFullUrl} />
      <Typography variant="h6">Notes</Typography>
      {notes.map((note, i) => (
        <Box key={i}>
          <Grid container spacing={3}>
            <Grid xs={2}>
              <img src={imageThumbUrl} />
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle1">{note.location}</Typography>
              <Typography variant="subtitle2">{note.note}</Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Typography variant="h6">In Other Languages</Typography>
      <Divider />
      <Grid container spacing={3}>
        <Grid xs={6}>
          <Typography variant="subtitle1">Spanish</Typography>
          <Typography variant="subtitle2">{nameSpanish}</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography variant="subtitle1">Latin</Typography>
          <Typography variant="subtitle2">{nameLatin}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [birds, setBirds] = useState<Bird[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedBird, setSelectedBird] = useState<Bird | undefined>();

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

  const filterBirds = (birdToFilter: Bird): boolean => {
    if (!search) return true;

    const searchRegex = new RegExp(search, "i");
    return (
      searchRegex.test(birdToFilter.nameEnglish) ||
      searchRegex.test(birdToFilter.nameSpanish) ||
      searchRegex.test(birdToFilter.nameLatin)
    );
  };

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
            <Link
              color="inherit"
              underline="hover"
              onClick={() => setSelectedBird(undefined)}
            >
              Birds
            </Link>
            {selectedBird && (
              <span color="inherit">{selectedBird.nameEnglish}</span>
            )}
          </Breadcrumbs>
        </Toolbar>
        <Toolbar>
          <TextField
            id="outlined-search"
            label="Search for birds"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
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
        <Button
          variant="contained"
          onClick={() => setSelectedBird(undefined)}
          disabled={!selectedBird}
          sx={{ margin: "8px 16px" }}
        >
          Home
        </Button>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Toolbar />
        {!selectedBird && (
          <Grid container spacing={3}>
            {birds.filter(filterBirds).map((bird, i) => (
              <BirdListItem
                key={i}
                nameEnglish={bird.nameEnglish}
                nameLatin={bird.nameLatin}
                imageUrl={bird.imageThumbUrl}
                onClick={() => setSelectedBird(bird)}
              />
            ))}
          </Grid>
        )}
        {selectedBird && (
          <BirdDisplay
            imageFullUrl={selectedBird.imageFullUrl}
            imageThumbUrl={selectedBird.imageThumbUrl}
            nameSpanish={selectedBird.nameSpanish}
            nameLatin={selectedBird.nameLatin}
            notes={selectedBird.notes}
          />
        )}
      </Box>
    </Box>
  );
}
