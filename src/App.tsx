import { Box, Container, Typography } from "@mui/material";
import FontIcon from "./components/FontIcon";
import ContentItemButton from "./components/ContentItemButton";

function App() {
  return (
    <Container>
      <Box sx={{ p: 3 }}>
        <ContentItemButton />
      </Box>
    </Container>
  );
}

export default App;
