"use client";

import { Box, Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";

// Define style variables
const styles = {
  title: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#1c252e",
    marginBottom: "1.0rem",
  },
  breadcrumb: {
    fontSize: "0.875rem",
    fontWeight: 400,
    color: "#1c252e",
  },
  separator: {
    color: "#1c252e",
    fontSize: "0.875rem",
    margin: "0 8px",
  },
};

// Define the link type
type BreadcrumbLink = {
  href: string;
  label: string;
};

interface FinAidBreadcrumbsProps {
  title: string;
  links: BreadcrumbLink[];
}

export default function SupervisorBreadcrumbs({ title, links }: FinAidBreadcrumbsProps) {
  return (
    <Box
      sx={{
        marginTop: 3,
        marginBottom: 5,
      }}
    >
      {/* 大標題 */}
      <Typography sx={styles.title}>{title}</Typography>

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<Typography sx={styles.separator}>•</Typography>}
        aria-label="breadcrumb"
      >
        {links.map((link, index) => (
          <Link key={index} href={link.href} style={styles.breadcrumb}>
            {link.label}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  );
}