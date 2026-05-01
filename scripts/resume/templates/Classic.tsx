import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import { certifications } from "../../../src/data/certifications";
import { education } from "../../../src/data/education";
import { experiences } from "../../../src/data/experience";
import { resumeProfile } from "../../../src/data/resume-profile";
import { featuredSkills } from "../../../src/data/skills";
import { technicalProficiency } from "../../../src/data/technical-proficiency";
import { SkillBar } from "../components/SkillBar";
import { Bullet, ContactLine, ExperienceItem, Section } from "../components/shared";
import { GlobeIcon, LinkedInIcon, MailIcon, PinIcon } from "../components/icons";
import { classicTheme, publicAsset } from "../theme";

const styles = StyleSheet.create({
	page: {
		flexDirection: "row",
		fontFamily: classicTheme.font,
		fontSize: 10,
		color: classicTheme.text,
	},
	main: { width: "65%", padding: 24 },
	sidebar: { width: "35%", backgroundColor: classicTheme.sidebarBg, padding: 20 },
	name: { fontSize: 28, color: classicTheme.accent, fontWeight: "bold" },
	title: { fontSize: 13, marginBottom: 16 },
	summary: { fontSize: 10, lineHeight: 1.45, marginBottom: 14 },
	techLine: { fontSize: 9.5, marginBottom: 3, lineHeight: 1.35 },
	techLabel: { fontWeight: "bold" },
	photo: { width: 110, height: 140, alignSelf: "center", marginBottom: 14 },
	sidebarTitle: { fontSize: 11, fontWeight: "bold", marginTop: 10, marginBottom: 6 },
	eduItem: { marginBottom: 6 },
	eduDegree: { fontSize: 10, fontWeight: "bold" },
	eduMeta: { fontSize: 9, fontStyle: "italic" },
});

export const Classic = () => (
	<Document title={`${resumeProfile.fullName} — Resume (Classic)`} author={resumeProfile.fullName}>
		<Page size="A4" style={styles.page}>
			<View style={styles.main}>
				<Text style={styles.name}>{resumeProfile.fullName}</Text>
				<Text style={styles.title}>{resumeProfile.title}</Text>

				<Section title="Summary" color={classicTheme.accent}>
					<Text style={styles.summary}>{resumeProfile.summary}</Text>
				</Section>

				<Section title="Technical Proficiency" color={classicTheme.accent}>
					{technicalProficiency.map((cat) => (
						<Text key={cat.label} style={styles.techLine}>
							<Text style={styles.techLabel}>{cat.label}: </Text>
							{cat.items.join(", ")}
						</Text>
					))}
				</Section>

				<Section title="Work Experience" color={classicTheme.accent}>
					{experiences.map((exp) => (
						<ExperienceItem
							key={`${exp.company}-${exp.duration}`}
							title={exp.title}
							company={exp.company}
							duration={exp.duration}
							summary={exp.resumeSummary}
							bullets={exp.resumeBullets}
						/>
					))}
				</Section>

				<Section title="Education" color={classicTheme.accent}>
					{education.map((ed) => (
						<View key={ed.degree} style={styles.eduItem}>
							<Text style={styles.eduDegree}>{ed.degree}</Text>
							<Text style={styles.eduMeta}>
								{ed.institution} — {ed.duration}
							</Text>
						</View>
					))}
				</Section>

				<Section title="Certifications" color={classicTheme.accent}>
					{certifications.map((c) => (
						<Bullet key={c.name}>
							{c.name} — {c.issuer}
						</Bullet>
					))}
				</Section>
			</View>

			<View style={styles.sidebar}>
				<Image src={publicAsset(resumeProfile.photo)} style={styles.photo} />

				<ContactLine icon={<PinIcon color={classicTheme.accent} />}>{resumeProfile.location}</ContactLine>
				<ContactLine icon={<GlobeIcon color={classicTheme.accent} />}>{resumeProfile.website}</ContactLine>
				<ContactLine icon={<MailIcon color={classicTheme.accent} />}>{resumeProfile.email}</ContactLine>
				<ContactLine icon={<LinkedInIcon color={classicTheme.accent} />}>{resumeProfile.linkedin}</ContactLine>

				<Text style={styles.sidebarTitle}>Skills</Text>
				{featuredSkills.map((s) => (
					<SkillBar key={s.name} name={s.name} proficiency={s.proficiency} color={classicTheme.accent} />
				))}

				<Text style={styles.sidebarTitle}>Soft Skills</Text>
				{resumeProfile.softSkills.map((s) => (
					<Bullet key={s}>{s}</Bullet>
				))}
			</View>
		</Page>
	</Document>
);
