import {
  Html, Head, Body, Container, Section, Heading, Text, Button, Hr, Preview,
} from "@react-email/components";

export default function WelcomeEmail({ name = "there", role = "jobseeker", baseUrl = "" }) {
  const isSeeker = role === "jobseeker";

  return (
    <Html>
      <Head />
      <Preview>Welcome to UpLink — {isSeeker ? "Your career starts here" : "Find top talent"}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>UpLink</Text>
          </Section>

          {/* Content */}
          <Section style={contentStyle}>
            <Heading as="h1" style={headingStyle}>
              Welcome to UpLink, {name}! 🎉
            </Heading>

            <Text style={introStyle}>
              {isSeeker
                ? "You've joined the best place to discover your next career opportunity. Here's what you can do:"
                : "You've joined the best platform to find top talent for your team. Here's what you can do:"}
            </Text>

            {/* Steps */}
            <Section style={stepsContainerStyle}>
              {isSeeker ? (
                <>
                  <StepItem number="1" title="Complete Your Profile" description="Add your skills, experience, and links to stand out" />
                  <StepItem number="2" title="Build Your Resume" description="Use our builder to create a professional resume" />
                  <StepItem number="3" title="Set Job Alerts" description="Get notified when matching jobs are posted" />
                </>
              ) : (
                <>
                  <StepItem number="1" title="Register Your Company" description="Set up your company profile for visibility" />
                  <StepItem number="2" title="Post Your First Job" description="Reach thousands of qualified candidates" />
                  <StepItem number="3" title="Review Applications" description="Manage applicants and find the perfect hire" />
                </>
              )}
            </Section>

            <Section style={{ textAlign: "center", paddingTop: "8px" }}>
              <Button
                href={isSeeker ? `${baseUrl}/dashboard` : `${baseUrl}/employer/dashboard`}
                style={ctaStyle}
              >
                {isSeeker ? "Explore Jobs" : "Get Started"}
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerTextStyle}>
              Thanks for joining UpLink. If you have any questions, just reply to this email.
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

function StepItem({ number, title, description }) {
  return (
    <div style={stepStyle}>
      <div style={stepNumberStyle}>{number}</div>
      <div>
        <Text style={stepTitleStyle}>{title}</Text>
        <Text style={stepDescStyle}>{description}</Text>
      </div>
    </div>
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

const headingStyle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "0 0 12px",
  textAlign: "center",
};

const introStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 24px",
  lineHeight: "1.6",
  textAlign: "center",
};

const stepsContainerStyle = {
  padding: "0",
};

const stepStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  marginBottom: "16px",
};

const stepNumberStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "8px",
  backgroundColor: "#fef7f3",
  color: "#e8520a",
  fontSize: "13px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  border: "1px solid #fed7c7",
  lineHeight: "28px",
  textAlign: "center",
};

const stepTitleStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 2px",
};

const stepDescStyle = {
  fontSize: "13px",
  color: "#6b7280",
  margin: 0,
  lineHeight: "1.4",
};

const ctaStyle = {
  display: "inline-block",
  backgroundColor: "#e8520a",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 32px",
  borderRadius: "10px",
  textDecoration: "none",
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "28px 0",
};

const footerTextStyle = {
  fontSize: "13px",
  color: "#9ca3af",
  lineHeight: "1.5",
  textAlign: "center",
  margin: 0,
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
