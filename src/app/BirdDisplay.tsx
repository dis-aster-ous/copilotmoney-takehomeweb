import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { type Note } from "./page";
import WatermarkedImage from "./WatermarkedImage";

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
}: BirdDisplayProps) => (
  <Box>
    <WatermarkedImage style={{ maxWidth: "300px" }} src={imageFullUrl} />
    <Typography variant="h6">Notes</Typography>
    {notes
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((note, i) => (
        <Box key={i}>
          <Grid container spacing={3}>
            <Grid xs={2}>
              <WatermarkedImage
                style={{ maxWidth: "100px" }}
                src={imageThumbUrl}
              />
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

export default BirdDisplay;
