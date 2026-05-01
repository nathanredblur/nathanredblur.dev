import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import { certifications } from "../../../src/data/certifications";
import { education } from "../../../src/data/education";
import { experiences } from "../../../src/data/experience";
import { resumeProfile } from "../../../src/data/resume-profile";
import { technicalProficiency } from "../../../src/data/technical-proficiency";
import { atsTheme } from "../theme";

const styles = StyleSheet.create({
	page: {
		fontFamily: atsTheme.font,
		fontSize: 11,
		color: atsTheme.text,
		padding: 40,
		lineHeight: 1.4,
	},
	name: { fontSize: 18, fontWeight: "bold", marginBottom: 2 },
	title: { fontSize: 12, marginBottom: 2 },
	contact: { fontSize: 10, marginBottom: 10 },
	sectionTitle: {
		fontSize: 12,
		fontWeight: "bold",
		textTransform: "uppercase",
		marginTop: 10,
		marginBottom: 4,
	},
	summary: { fontSize: 10.5, lineHeight: 1.4, marginBottom: 4 },
	jobTitle: { fontSize: 11, fontWeight: "bold", marginTop: 6 },
	jobMeta: { fontSize: 10 },
	jobSummary: { fontSize: 10, marginBottom: 2 },
	bulletRow: { flexDirection: "row" },
	bulletMark: { width: 10 },
	bulletText: { flex: 1, fontSize: 10 },
	techLine: { fontSize: 10 },
});

export const AtsFriendly = () => (
	<Document title={`${resumeProfile.fullName} — Resume (ATS)`} author={resumeProfile.fullName}>
		<Page size="A4" style={styles.page}>
			<Text style={styles.name}>{resumeProfile.fullName}</Text>
			<Text style={styles.title}>{resumeProfile.title}</Text>
			<Text style={styles.contact}>
				Location: {resumeProfile.location} | Email: {resumeProfile.email} | Website: {resumeProfile.website} |
				LinkedIn: {resumeProfile.linkedin}
			</Text>

			<Text style={styles.sectionTitle}>Summary</Text>
			<Text style={styles.summary}>{resumeProfile.summary}</Text>

			<Text style={styles.sectionTitle}>Experience</Text>
			{experiences.map((exp) => (
				<View key={`${exp.company}-${exp.duration}`} wrap={false}>
					<Text style={styles.jobTitle}>
						{exp.title}, {exp.company}
					</Text>
					<Text style={styles.jobMeta}>{exp.duration}</Text>
					<Text style={styles.jobSummary}>{exp.resumeSummary}</Text>
					{exp.resumeBullets.map((b, i) => (
						<View key={`${exp.company}-${i}`} style={styles.bulletRow}>
							<Text style={styles.bulletMark}>-</Text>
							<Text style={styles.bulletText}>{b}</Text>
						</View>
					))}
				</View>
			))}

			<Text style={styles.sectionTitle}>Skills</Text>
			{technicalProficiency.map((cat) => (
				<Text key={cat.label} style={styles.techLine}>
					{cat.label}: {cat.items.join(", ")}
				</Text>
			))}

			<Text style={styles.sectionTitle}>Education</Text>
			{education.map((ed) => (
				<Text key={ed.degree} style={styles.techLine}>
					{ed.degree}, {ed.institution}, {ed.duration}
				</Text>
			))}

			<Text style={styles.sectionTitle}>Certifications</Text>
			{certifications.map((c) => (
				<Text key={c.name} style={styles.techLine}>
					- {c.name} — {c.issuer}
				</Text>
			))}
		</Page>
	</Document>
);
