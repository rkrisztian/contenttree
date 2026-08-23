"use server";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { getT } from "next-i18next/server";
import { Trans } from "react-i18next/TransWithoutContext";
import { getRemoteConfig } from "@/app/tree/_lib/remote-config";
import styles from "./page.module.scss";

export default async function PrivacyPolicyPage() {
  const company = (await getRemoteConfig()).company;
  const { t, i18n } = await getT("privacy-policy");

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        {t("privacy-policy.title")}
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }} className={styles["card-container"]}>
          <Card>
            <CardContent>
              <Typography>
                <strong>{t("privacy-policy.last-updated-label")}:</strong>{" "}
                {t("privacy-policy.last-updated-date")}
              </Typography>
              <Typography>
                <strong>{t("privacy-policy.effective-for")}:</strong>{" "}
                {t("privacy-policy.effective-for-description")}
              </Typography>

              <Typography>
                <Trans
                  t={t}
                  i18n={i18n}
                  i18nKey="privacy-policy.intro-1"
                  values={{ companyName: company.name }}
                  components={{ strong: <strong /> }}
                />
              </Typography>

              <Typography>{t("privacy-policy.intro-2")}</Typography>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-1-title")}
                </Typography>
                <Typography>
                  {t("privacy-policy.section-1-text", { companyName: company.name })}
                </Typography>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-2-title")}
                </Typography>
                <Typography>{t("privacy-policy.section-2-intro")}</Typography>

                <Typography variant="h5" component="h4">
                  {t("privacy-policy.section-2a-title")}
                </Typography>
                <Box component="ul">
                  <li>
                    <strong>{t("privacy-policy.section-2a-item-1-label")}</strong>:{" "}
                    {t("privacy-policy.section-2a-item-1-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-2a-item-2-label")}</strong>:{" "}
                    {t("privacy-policy.section-2a-item-2-text")}
                  </li>
                </Box>

                <Typography variant="h5" component="h4">
                  {t("privacy-policy.section-2b-title")}
                </Typography>
                <Box component="ul">
                  <li>
                    <strong>{t("privacy-policy.section-2b-item-1-label")}</strong>:{" "}
                    {t("privacy-policy.section-2b-item-1-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-2b-item-2-label")}</strong>:{" "}
                    {t("privacy-policy.section-2b-item-2-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-2b-item-3-label")}</strong>:{" "}
                    <Box component="ul">
                      <li>
                        <em>{t("privacy-policy.section-2b-item-3a-label")}:</em>{" "}
                        <Trans
                          t={t}
                          i18n={i18n}
                          i18nKey="privacy-policy.section-2b-item-3a-text"
                          components={{ code: <code /> }}
                        />
                      </li>
                      <li>
                        <em>{t("privacy-policy.section-2b-item-3b-label")}:</em>{" "}
                        <Trans
                          t={t}
                          i18n={i18n}
                          i18nKey="privacy-policy.section-2b-item-3b-text"
                          components={{ code: <code /> }}
                        />
                      </li>
                    </Box>
                  </li>
                </Box>

                <Box>
                  <strong>{t("privacy-policy.section-2-highlight-label")}:</strong>{" "}
                  {t("privacy-policy.section-2-highlight-text")}
                </Box>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-3-title")}
                </Typography>
                <Typography>{t("privacy-policy.section-3-intro")}</Typography>
                <Box component="ol">
                  <li>
                    <strong>{t("privacy-policy.section-3-item-1-label")}</strong>:{" "}
                    {t("privacy-policy.section-3-item-1-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-3-item-2-label")}</strong>:{" "}
                    {t("privacy-policy.section-3-item-3-label")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-3-item-3-label")}</strong>:{" "}
                    {t("privacy-policy.section-3-item-3-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-3-item-4-label")}</strong>:{" "}
                    {t("privacy-policy.section-3-item-4-text")}
                  </li>
                </Box>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-4-title")}
                </Typography>
                <Typography>{t("privacy-policy.section-4-intro")}</Typography>
                <Box component="ul">
                  <li>
                    <strong>{t("privacy-policy.section-4-item-1-label")}</strong>:{" "}
                    {t("privacy-policy.section-4-item-1-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-4-item-2-label")}</strong>:{" "}
                    {t("privacy-policy.section-4-item-2-text")}
                  </li>
                </Box>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-5-title")}
                </Typography>
                <Typography>{t("privacy-policy.section-5-intro")}</Typography>
                <Box component="ul">
                  <li>
                    <strong>{t("privacy-policy.section-5-item-1-label")}</strong>:{" "}
                    {t("privacy-policy.section-5-item-1-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-5-item-2-label")}</strong>:{" "}
                    {t("privacy-policy.section-5-item-2-text")}
                  </li>
                </Box>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-6-title")}
                </Typography>

                <Typography variant="h5" component="h4">
                  {t("privacy-policy.section-6a-title")}
                </Typography>
                <Box component="ul">
                  <li>
                    <strong>{t("privacy-policy.section-6a-item-1-label")}</strong>:{" "}
                    {t("privacy-policy.section-6a-item-1-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-6a-item-2-label")}</strong>:{" "}
                    {t("privacy-policy.section-6a-item-2-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-6a-item-3-label")}</strong>:{" "}
                    {t("privacy-policy.section-6a-item-3-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-6a-item-4-label")}</strong>:{" "}
                    {t("privacy-policy.section-6a-item-4-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-6a-item-5-label")}</strong>:{" "}
                    {t("privacy-policy.section-6a-item-5-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-6a-item-6-label")}</strong>:{" "}
                    {t("privacy-policy.section-6a-item-6-text")}
                  </li>
                </Box>

                <Typography variant="h5" component="h4">
                  {t("privacy-policy.section-6b-title")}
                </Typography>
                <Box component="ul">
                  <li>
                    <strong>{t("privacy-policy.section-6b-item-1-label")}</strong>:{" "}
                    {t("privacy-policy.section-6b-item-1-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-6b-item-2-label")}</strong>:{" "}
                    {t("privacy-policy.section-6b-item-2-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-6b-item-3-label")}</strong>:{" "}
                    {t("privacy-policy.section-6b-item-3-text")}
                  </li>
                </Box>

                <Box>
                  <strong>{t("privacy-policy.section-6b-highlight-label")}:</strong>{" "}
                  {t("privacy-policy.section-6b-highlight-text")}
                </Box>

                <Typography variant="h5" component="h4">
                  {t("privacy-policy.section-6c-title")}
                </Typography>
                <Typography>{t("privacy-policy.section-6c-text")}</Typography>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-7-title")}
                </Typography>
                <Box component="ul">
                  <li>
                    <strong>{t("privacy-policy.section-7-item-1-label")}</strong>:{" "}
                    {t("privacy-policy.section-7-item-1-text")}
                  </li>
                  <li>
                    <strong>{t("privacy-policy.section-7-item-2-label")}</strong>:{" "}
                    {t("privacy-policy.section-7-item-2-text", {
                      count: company.dataRetentionDays,
                    })}
                  </li>
                </Box>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-8-title")}
                </Typography>
                <Typography>{t("privacy-policy.section-8-text")}</Typography>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-9-title")}
                </Typography>
                <Typography>{t("privacy-policy.section-9-text")}</Typography>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-10-title")}
                </Typography>
                <Typography>{t("privacy-policy.section-10-text")}</Typography>
              </Box>

              <Box component="section">
                <Typography variant="h4" component="h3">
                  {t("privacy-policy.section-11-title")}
                </Typography>
                <address>
                  <strong>{company.name}</strong>
                  <br />
                  {company.address}
                  <br />
                  Email: <Link href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</Link>
                </address>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
