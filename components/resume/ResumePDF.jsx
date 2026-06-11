"use client";
import {
  Document, Page, Text, View, StyleSheet,
} from "@react-pdf/renderer";

const accent = "#e8520a";
const textMain = "#1a1a1a";
const textSub = "#555555";
const textMute = "#888888";
const chipBg = "#fff1e8";
const chipColor = "#c44a0a";

const s = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: textMain,
    lineHeight: 1.5,
  },
  // Header
  headerBorder: { borderBottomWidth: 2, borderBottomColor: accent, paddingBottom: 14, marginBottom: 14 },
  name: { fontSize: 22, fontWeight: 700, letterSpacing: -0.3 },
  headline: { fontSize: 10, fontWeight: 600, color: accent, marginTop: 3 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 6 },
  contactItem: { fontSize: 8, color: textSub },
  // Sections
  sectionTitle: {
    fontSize: 8, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: 2, color: accent, marginBottom: 6,
  },
  section: { marginBottom: 14 },
  // Experience / Education
  entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  entryTitle: { fontSize: 11, fontWeight: 600, color: textMain },
  entrySubtitle: { fontSize: 9, color: textSub, marginTop: 1 },
  entryDate: { fontSize: 8, color: textMute },
  entryDesc: { fontSize: 9, color: "#444", marginTop: 3, lineHeight: 1.6 },
  entryGap: { marginBottom: 10 },
  // Skills
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillChip: {
    fontSize: 8, fontWeight: 600, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, backgroundColor: chipBg, color: chipColor,
  },
  // Summary
  summary: { fontSize: 9, color: "#333", lineHeight: 1.6 },
});

export default function ResumePDF({ data }) {
  if (!data) return null;
  const { personalInfo, experience = [], education = [], skills = [], links = {} } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.headerBorder}>
          {personalInfo?.name ? <Text style={s.name}>{personalInfo.name}</Text> : null}
          {personalInfo?.headline ? <Text style={s.headline}>{personalInfo.headline}</Text> : null}

          <View style={s.contactRow}>
            {personalInfo?.email ? <Text style={s.contactItem}>{personalInfo.email}</Text> : null}
            {personalInfo?.phone ? <Text style={s.contactItem}>{personalInfo.phone}</Text> : null}
            {personalInfo?.location ? <Text style={s.contactItem}>{personalInfo.location}</Text> : null}
            {links.github ? <Text style={s.contactItem}>{links.github}</Text> : null}
            {links.linkedin ? <Text style={s.contactItem}>{links.linkedin}</Text> : null}
            {links.portfolio ? <Text style={s.contactItem}>{links.portfolio}</Text> : null}
          </View>
        </View>

        {/* Summary */}
        {personalInfo?.bio ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text style={s.summary}>{personalInfo.bio}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Work Experience</Text>
            {experience.map((exp, i) => (
              <View key={i} style={s.entryGap}>
                <View style={s.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>{exp.title || "Untitled Position"}</Text>
                    <Text style={s.entrySubtitle}>
                      {[exp.company, exp.location].filter(Boolean).join(" · ")}
                    </Text>
                  </View>
                  <Text style={s.entryDate}>
                    {exp.startDate || "–"} — {exp.isCurrent ? "Present" : exp.endDate || "–"}
                  </Text>
                </View>
                {exp.description ? <Text style={s.entryDesc}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={s.entryGap}>
                <View style={s.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>
                      {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Untitled"}
                    </Text>
                    <Text style={s.entrySubtitle}>{edu.institution || "Institution"}</Text>
                  </View>
                  <Text style={s.entryDate}>
                    {edu.startYear || "–"} — {edu.isOngoing ? "Present" : edu.endYear || "–"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <View style={s.skillsRow}>
              {skills.map((skill, i) => (
                <Text key={i} style={s.skillChip}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
}
