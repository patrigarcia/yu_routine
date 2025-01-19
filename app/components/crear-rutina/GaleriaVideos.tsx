import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

const VIDEOS = Array.from({ length: 52 }, (_, i) => `${i + 1}.mp4`);

interface GaleriaVideosProps {
  onVideoSelect?: (video: string) => void;
}

export default function GaleriaVideos({ onVideoSelect }: GaleriaVideosProps) {
  const theme = useTheme();
  const [draggedVideo, setDraggedVideo] = useState<string | null>(null);

  const handleDragStart = (video: string, e: React.DragEvent<HTMLVideoElement>) => {
    setDraggedVideo(video);
    e.dataTransfer?.setData("text/plain", video);
  };

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Galería de Videos
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          height: "230px",
          overflowY: "auto",
          justifyContent: "center",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
        }}
      >
        {VIDEOS.map((video) => (
          <Box
            key={video}
            sx={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.5)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                zIndex: 10,
              },
            }}
          >
            <video
              src={`/videos/${video}`}
              width="100"
              height="100"
              style={{
                objectFit: "cover",
                borderRadius: 8,
                filter: "brightness(1) contrast(1)",
                transition: "filter 0.3s ease",
              }}
              draggable
              onDragStart={(e) => handleDragStart(video, e)}
              preload="metadata"
              onClick={() => onVideoSelect && onVideoSelect(video)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
