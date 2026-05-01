/** @jsxRuntime automatic @jsxImportSource react */
import {
	Document,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { experiences } from "@/data/experience";
import { resumeProfile } from "@/data/resume-profile";
import { featuredSkills } from "@/data/skills";
import { technicalProficiency } from "@/data/technical-proficiency";
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
import { classicTheme, publicAsset } from "../theme";

const styles = StyleSheet.create({
	page: {
		fontFamily: classicTheme.font,
		fontSize: 10,
		color: classicTheme.text,
		padding: 28,
	},
	header: {
		flexDirection: "row",
		marginBottom: 14,
	},
	photo: {
		width: 90,
		height: 90,
		borderRadius: 8,
		marginRight: 18,
		objectFit: "cover",
	},
	headerRight: { flex: 1, justifyContent: "center" },
	name: {
		fontSize: 26,
		color: classicTheme.accent,
		fontWeight: "bold",
		marginBottom: 2,
	},
	title: { fontSize: 13, color: classicTheme.muted, marginBottom: 8 },
	contactRow: { flexDirection: "row", flexWrap: "wrap" },
	quickProfile: {
		flexDirection: "row",
		backgroundColor: classicTheme.sidebarBg,
		padding: 10,
		borderRadius: 6,
		marginBottom: 14,
	},
	quickCol: { flex: 1, paddingHorizontal: 6 },
	quickLabel: {
		fontSize: 8,
		fontWeight: "bold",
		letterSpacing: 1,
		color: classicTheme.muted,
		textTransform: "uppercase",
		marginBottom: 2,
	},
	quickValue: { fontSize: 10, color: classicTheme.text, lineHeight: 1.3 },
	quickAccent: {
		fontSize: 10,
		color: classicTheme.accent,
		fontWeight: "bold",
		lineHeight: 1.3,
	},
	summary: { fontSize: 10, lineHeight: 1.45, marginBottom: 8 },
	skillGroup: { marginBottom: 6 },
	skillGroupLabel: {
		fontSize: 9,
		fontWeight: "bold",
		color: classicTheme.muted,
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
		borderColor: "#CCCCCC",
		borderRadius: 3,
		marginRight: 5,
		marginBottom: 5,
		color: classicTheme.text,
	},
	chipAccent: {
		fontSize: 9,
		paddingTop: 2,
		paddingBottom: 2,
		paddingLeft: 6,
		paddingRight: 6,
		borderWidth: 1,
		borderColor: classicTheme.accent,
		borderRadius: 3,
		marginRight: 5,
		marginBottom: 5,
		color: classicTheme.accent,
	},
	techLine: { fontSize: 9.5, marginBottom: 3, lineHeight: 1.35 },
	techLabel: { fontWeight: "bold" },
	eduItem: { marginBottom: 6 },
	eduDegree: { fontSize: 10, fontWeight: "bold" },
	eduMeta: { fontSize: 9, fontStyle: "italic", color: classicTheme.muted },
});

const topSkills = featuredSkills.slice(0, 3).map((s) => s.name);

export const Classic = () => (
	<Document
		title={`${resumeProfile.fullName} — Resume (Classic)`}
		author={resumeProfile.fullName}
	>
		<Page size="A4" style={styles.page}>
			{/* Header — renders only on page 1 because it's at the top of the flow */}
			<View style={styles.header}>
				<Image src={publicAsset(resumeProfile.photo)} style={styles.photo} />
				<View style={styles.headerRight}>
					<Text style={styles.name}>{resumeProfile.fullName}</Text>
					<Text style={styles.title}>{resumeProfile.title}</Text>
					<View style={styles.contactRow}>
						<ContactLine inline icon={<PinIcon color={classicTheme.accent} />}>
							{resumeProfile.location}
						</ContactLine>
						<ContactLine
							inline
							icon={<GlobeIcon color={classicTheme.accent} />}
						>
							{resumeProfile.website}
						</ContactLine>
						<ContactLine inline icon={<MailIcon color={classicTheme.accent} />}>
							{resumeProfile.email}
						</ContactLine>
						<ContactLine
							inline
							icon={<LinkedInIcon color={classicTheme.accent} />}
						>
							{resumeProfile.linkedin}
						</ContactLine>
					</View>
				</View>
			</View>

			{/* Quick Profile strip — 6-second recruiter scan */}
			<View style={styles.quickProfile}>
				<View style={styles.quickCol}>
					<Text style={styles.quickLabel}>Experience</Text>
					<Text style={styles.quickAccent}>
						{resumeProfile.yearsExperience}
					</Text>
				</View>
				<View style={styles.quickCol}>
					<Text style={styles.quickLabel}>Core Stack</Text>
					<Text style={styles.quickValue}>{topSkills.join(" · ")}</Text>
				</View>
				<View style={styles.quickCol}>
					<Text style={styles.quickLabel}>Availability</Text>
					<Text style={styles.quickValue}>{resumeProfile.availability}</Text>
				</View>
			</View>

			<Section title="Summary" color={classicTheme.accent} underline>
				<Text style={styles.summary}>{resumeProfile.summary}</Text>
			</Section>

			<Section title="Skills" color={classicTheme.accent} underline>
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

			<Section title="Work Experience" color={classicTheme.accent} underline>
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
				color={classicTheme.accent}
				underline
			>
				{technicalProficiency.map((cat) => (
					<Text key={cat.label} style={styles.techLine}>
						<Text style={styles.techLabel}>{cat.label}: </Text>
						{cat.items.join(", ")}
					</Text>
				))}
			</Section>

			<Section title="Education" color={classicTheme.accent} underline>
				{education.map((ed) => (
					<View key={ed.degree} style={styles.eduItem}>
						<Text style={styles.eduDegree}>{ed.degree}</Text>
						<Text style={styles.eduMeta}>
							{ed.institution} — {ed.duration}
						</Text>
					</View>
				))}
			</Section>

			<Section title="Certifications" color={classicTheme.accent} underline>
				{certifications.map((c) => (
					<Bullet key={c.name}>
						{c.name} — {c.issuer}
					</Bullet>
				))}
			</Section>
		</Page>
	</Document>
);
