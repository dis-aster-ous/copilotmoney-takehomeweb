"use client";

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";
import { useEffect, useState, type FormEvent, type CSSProperties } from "react";
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
import Modal from "@mui/material/Modal";

interface Note {
  location: string;
  note: string;
  timestamp: number;
}

interface Bird {
  uid: string;
  sort: number;
  nameEnglish: string;
  nameSpanish: string;
  nameLatin: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  notes: Note[];
}

interface NoteFormElements extends HTMLFormControlsCollection {
  location: HTMLInputElement;
  note: HTMLTextAreaElement;
}

interface NoteForm extends HTMLFormElement {
  readonly elements: NoteFormElements;
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

const fetchWatermarkedImage = async (imgUrl: string): Promise<string> => {
  const originalImageResponse = await fetch(imgUrl);
  const originalImage = await originalImageResponse.blob();

  const originalImageSize = originalImage.size;
  const originalImageBody = await originalImage.text();

  const watermarkedImageResponse = await fetch(
    "https://us-central1-copilot-take-home.cloudfunctions.net/watermark",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": originalImageSize.toString(),
      },
      body: originalImageBody,
    },
  );

  const watermarkedImage = await watermarkedImageResponse.blob();
  return watermarkedImage.text();
};

interface WatermarkedImageProps {
  src: string;
  style?: CSSProperties;
}

const WatermarkedImage = ({ src, style }: WatermarkedImageProps) => {
  const [watermarkedImage, setWatermarkedImage] = useState<
    string | undefined
  >();

  useEffect(() => {
    fetchWatermarkedImage(src as string).then(setWatermarkedImage);
  }, []);

  // fallback to original image if watermark fails
  return <img style={style} src={watermarkedImage ?? src} />;
};

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
        <WatermarkedImage src={imageUrl} />
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
      <WatermarkedImage style={{ maxWidth: "300px" }} src={imageFullUrl} />
      <Typography variant="h6">Notes</Typography>
      {notes
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((note, i) => (
          <Box key={i}>
            <Grid container spacing={3}>
              <Grid xs={2}>
                <WatermarkedImage style={{ maxWidth: "100px" }} src={imageThumbUrl} />
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
  const [shouldShowNoteModal, setShouldShowNoteModal] =
    useState<boolean>(false);
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
            uid: data.uid,
            sort: data.sort,
            nameEnglish: data.name.english,
            nameSpanish: data.name.spanish,
            nameLatin: data.name.latin,
            imageThumbUrl: data.images.thumb,
            imageFullUrl: data.images.full,
            notes: data.notes ?? [],
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

  const handleNoteSubmission = async (
    e: FormEvent<NoteForm>,
  ): Promise<void> => {
    e.preventDefault();
    if (!selectedBird) return;

    const newNote = {
      location: e.currentTarget.elements.location.value,
      note: e.currentTarget.elements.note.value,
      timestamp: Date.now(),
    };

    const birdDocRef = doc(db, "birds", selectedBird.uid);
    await setDoc(
      birdDocRef,
      { notes: [...selectedBird.notes, newNote] },
      { merge: true },
    );

    const updatedBird = {
      ...selectedBird,
      notes: [...selectedBird.notes, newNote],
    };

    setSelectedBird(updatedBird);
    setBirds(
      birds.filter((b) => b.uid !== updatedBird.uid).concat(updatedBird),
    );

    setShouldShowNoteModal(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Modal
        open={shouldShowNoteModal}
        onClose={() => setShouldShowNoteModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="subtitle1">Add a note</Typography>
          <Divider />
          <form action="" onSubmit={handleNoteSubmission}>
            <TextField
              sx={{ marginTop: "16px" }}
              name="location"
              label="Location"
              placeholder="Where did you spot it?"
            />
            <TextField
              sx={{ margin: "16px 0px" }}
              name="note"
              label="Note"
              placeholder="Enter your notes here"
              multiline
            />
            <Divider />
            <Box sx={{ marginTop: "16px" }}>
              <Button
                variant="text"
                type="reset"
                onClick={() => setShouldShowNoteModal(false)}
              >
                Cancel
              </Button>
              <Button
                sx={{ marginLeft: "8px" }}
                variant="contained"
                type="submit"
              >
                Add note
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
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
          {selectedBird && (
            <Button
              onClick={() => setShouldShowNoteModal(true)}
              sx={{ marginLeft: "auto" }}
            >
              Add Note
            </Button>
          )}
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
            {birds
              .filter(filterBirds)
              .sort((a, b) => a.sort - b.sort)
              .map((bird, i) => (
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
