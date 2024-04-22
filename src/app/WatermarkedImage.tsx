import { useEffect, useState, type CSSProperties } from "react";

interface WatermarkedImageProps {
  src: string;
  style?: CSSProperties;
}

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

const WatermarkedImage = ({ src, style }: WatermarkedImageProps) => {
  const [watermarkedImage, setWatermarkedImage] = useState<
    string | undefined
  >();

  useEffect(() => {
    fetchWatermarkedImage(src as string).then(setWatermarkedImage);
  }, [src]);

  // fallback to original image if watermark fails
  return <img style={style} src={watermarkedImage ?? src} alt="" />;
};

export default WatermarkedImage;
