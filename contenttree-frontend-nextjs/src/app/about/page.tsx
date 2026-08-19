"use server";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default async function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        About
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h4" component="h3" gutterBottom>
                Roboto Font
              </Typography>
              <Typography variant="body1">
                This application uses the Roboto font family, created and licensed by Google under
                the SIL Open Font License, Version 1.1.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" component="h4" gutterBottom>
                License
              </Typography>
              <Typography variant="body2">
                Copyright 2011 The Roboto Project Authors. This Font Software is licensed under the
                SIL Open Font License, Version 1.1.
              </Typography>
              <Typography variant="body2">You may obtain a copy of the License at:</Typography>
              <Link href="https://openfontlicense.org" target="_blank" rel="noopener noreferrer">
                openfontlicense.org
              </Link>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h4" component="h3" gutterBottom>
                Material Design Icons Font
              </Typography>
              <Typography variant="body1">
                This application uses the Material Icons set, created and licensed by Google under
                the Apache License Version 2.0.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" component="h4" gutterBottom>
                License
              </Typography>
              <Typography variant="body2">
                Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
                file except in compliance with the License.
              </Typography>
              <Typography variant="body2">You may obtain a copy of the License at:</Typography>
              <Link
                href="https://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.apache.org/licenses/LICENSE-2.0
              </Link>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h3" gutterBottom>
                Third-Party Licenses
              </Typography>
              <Typography variant="body1">
                This application includes dependencies from various open-source projects. For a
                complete list of licenses and copyright notices, please refer to the
                <Link
                  href="/third-party-licenses.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ ml: 1 }}
                >
                  licenses file
                </Link>
                .
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
