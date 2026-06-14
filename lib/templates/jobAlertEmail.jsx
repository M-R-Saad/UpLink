import {
  Html, Head, Body, Container, Section, Heading, Text, Button, Hr, Link, Img, Preview,
} from "@react-email/components";

export default function JobAlertEmail({ userName = "there", job = {}, company = {}, baseUrl = "" }) {
  const salaryText = job.salary?.isUndisclosed
    ? "Negotiable"
    : job.salary?.min && job.salary?.max
      ? `${job.salary.currency || "BDT"} ${job.salary.min.toLocaleString()} – ${job.salary.max.toLocaleString()}`
      : null;

  return (
    <Html>
      <Head />
      <Preview>New job match: {job.title} at {company.name}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>UpLink</Text>
          </Section>

          {/* Content */}
          <Section style={contentStyle}>
            <Text style={greetingStyle}>Hi {userName},</Text>
            <Text style={introStyle}>
              A new job matching your alert was just posted:
            </Text>

            {/* Job Card */}
            <Section style={jobCardStyle}>
              <Heading as="h2" style={jobTitleStyle}>
                {job.title || "Job Title"}
              </Heading>
              <Text style={companyStyle}>
                {company.name || "Company"} · {job.location || "Remote"}
              </Text>
              {job.jobType && (
                <Text style={metaStyle}>
                  {job.jobType} {salaryText ? ` · ${salaryText}` : ""}
                </Text>
              )}
              <Button
                href={`${baseUrl}/jobs/${job._id}`}
                style={ctaStyle}
              >
                View Job Details
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerTextStyle}>
              You received this email because of your job alert preferences.{" "}
              <Link href={`${baseUrl}/dashboard/alerts`} style={linkStyle}>
                Manage your alerts
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerSmallStyle}>
              © {new Date().getFullYear()} UpLink. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const bodyStyle = {
  backgroundColor: "#f4f4f5",
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 20px",
};

const headerStyle = {
  textAlign: "center",
  padding: "0 0 24px",
};

const logoStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#e8520a",
  textDecoration: "none",
  margin: 0,
};

const contentStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "32px 28px",
  border: "1px solid #e5e7eb",
};

const greetingStyle = {
  fontSize: "15px",
  color: "#1a1a1a",
  margin: "0 0 4px",
};

const introStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 20px",
  lineHeight: "1.5",
};

const jobCardStyle = {
  backgroundColor: "#fef7f3",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #fed7c7",
  textAlign: "center",
};

const jobTitleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "0 0 6px",
};

const companyStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 4px",
};

const metaStyle = {
  fontSize: "13px",
  color: "#9ca3af",
  margin: "0 0 16px",
  textTransform: "capitalize",
};

const ctaStyle = {
  display: "inline-block",
  backgroundColor: "#e8520a",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 24px",
  borderRadius: "10px",
  textDecoration: "none",
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footerTextStyle = {
  fontSize: "12px",
  color: "#9ca3af",
  lineHeight: "1.5",
  margin: 0,
};

const linkStyle = {
  color: "#e8520a",
  textDecoration: "underline",
};

const footerStyle = {
  textAlign: "center",
  padding: "24px 0 0",
};

const footerSmallStyle = {
  fontSize: "11px",
  color: "#9ca3af",
  margin: 0,
};
