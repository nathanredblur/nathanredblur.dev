import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { certifications } from "../../../src/data/certifications";
import { education } from "../../../src/data/education";
import { experiences } from "../../../src/data/experience";
import { resumeProfile } from "../../../src/data/resume-profile";
import { featuredSkills } from "../../../src/data/skills";
import { technicalProficiency } from "../../../src/data/technical-proficiency";
import {
	GlobeIcon,
	LinkedInIcon,
	MailIcon,
	PinIcon,
} from "../components/icons";
import {
	Bullet,
	ContactLine,
	ExperienceItem,
	Section,
} from "../components/shared";
import { modernTheme } from "../theme";

const styles = StyleSheet.create({
	page: {
		fontFamily: modernTheme.font,
		fontSize: 10,
		color: modernTheme.text,
		padding: 36,
	},
	header: { marginBottom: 18 },
	name: { fontSize: 26, fontWeight: "bold", color: modernTheme.accent },
	title: { fontSize: 12, color: modernTheme.muted, marginBottom: 8 },
	contactStrip: { flexDirection: "row", flexWrap: "wrap" },
	summary: { fontSize: 10, lineHeight: 1.5, marginBottom: 10 },
	skillGroup: { marginBottom: 6 },
	skillGroupLabel: {
		fontSize: 9,
		fontWeight: "bold",
		color: modernTheme.muted,
		marginBottom: 3,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	skillGrid: { flexDirection: "row", flexWrap: "wrap" },
	chip: {
		fontSize: 9,
		paddingTop: 2,
		paddingBottom: 2,
		paddingLeft: 6,
		paddingRight: 6,
		borderWidth: 1,
		borderColor: modernTheme.subtle,
		borderRadius: 3,
		marginRight: 5,
		marginBottom: 5,
		color: modernTheme.text,
	},
	chipAccent: {
		fontSize: 9,
		paddingTop: 2,
		paddingBottom: 2,
		paddingLeft: 6,
		paddingRight: 6,
		borderWidth: 1,
		borderColor: modernTheme.accent,
		borderRadius: 3,
		marginRight: 5,
		marginBottom: 5,
		color: modernTheme.accent,
	},
	techCategory: { marginBottom: 4 },
	techLabel: { fontWeight: "bold", fontSize: 10 },
	techItems: { fontSize: 9.5, color: modernTheme.muted },
	eduItem: { marginBottom: 4 },
	eduDegree: { fontSize: 10.5, fontWeight: "bold" },
	eduMeta: { fontSize: 9.5, color: modernTheme.muted },
});

export const Modern = () => (
	<Document
		title={`${resumeProfile.fullName} — Resume (Modern)`}
		author={resumeProfile.fullName}
	>
		<Page size="A4" style={styles.page}>
			<View style={styles.header}>
				<Text style={styles.name}>{resumeProfile.fullName}</Text>
				<Text style={styles.title}>{resumeProfile.title}</Text>
				<View style={styles.contactStrip}>
					<ContactLine inline icon={<PinIcon color={modernTheme.accent} />}>
						{resumeProfile.location}
					</ContactLine>
					<ContactLine inline icon={<GlobeIcon color={modernTheme.accent} />}>
						{resumeProfile.website}
					</ContactLine>
					<ContactLine inline icon={<MailIcon color={modernTheme.accent} />}>
						{resumeProfile.email}
					</ContactLine>
					<ContactLine
						inline
						icon={<LinkedInIcon color={modernTheme.accent} />}
					>
						{resumeProfile.linkedin}
					</ContactLine>
				</View>
			</View>

			<Section title="Summary" color={modernTheme.accent} underline>
				<Text style={styles.summary}>{resumeProfile.summary}</Text>
			</Section>

			<Section title="Skills" color={modernTheme.accent} underline>
				<View style={styles.skillGroup}>
					<Text style={styles.skillGroupLabel}>Technical</Text>
					<View style={styles.skillGrid}>
						{featuredSkills.map((s) => (
							<Text key={s.name} style={styles.chipAccent}>
								{s.name}
							</Text>
						))}
					</View>
				</View>
				<View style={styles.skillGroup}>
					<Text style={styles.skillGroupLabel}>Soft</Text>
					<View style={styles.skillGrid}>
						{resumeProfile.softSkills.map((s) => (
							<Text key={s} style={styles.chip}>
								{s}
							</Text>
						))}
					</View>
				</View>
			</Section>

			<Section title="Experience" color={modernTheme.accent} underline>
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

			<Section
				title="Technical Proficiency"
				color={modernTheme.accent}
				underline
			>
				{technicalProficiency.map((cat) => (
					<View key={cat.label} style={styles.techCategory}>
						<Text>
							<Text style={styles.techLabel}>{cat.label}: </Text>
							<Text style={styles.techItems}>{cat.items.join(", ")}</Text>
						</Text>
					</View>
				))}
			</Section>

			<Section title="Education" color={modernTheme.accent} underline>
				{education.map((ed) => (
					<View key={ed.degree} style={styles.eduItem}>
						<Text style={styles.eduDegree}>{ed.degree}</Text>
						<Text style={styles.eduMeta}>
							{ed.institution} — {ed.duration}
						</Text>
					</View>
				))}
			</Section>

			<Section title="Certifications" color={modernTheme.accent} underline>
				{certifications.map((c) => (
					<Bullet key={c.name}>
						{c.name} — {c.issuer}
					</Bullet>
				))}
			</Section>
		</Page>
	</Document>
);
