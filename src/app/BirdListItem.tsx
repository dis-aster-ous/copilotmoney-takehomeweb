import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import WatermarkedImage from "./WatermarkedImage";

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

export default BirdListItem;
