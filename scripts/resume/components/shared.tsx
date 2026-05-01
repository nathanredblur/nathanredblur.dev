import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React, { type ReactNode } from "react";

const styles = StyleSheet.create({
	section: { marginBottom: 12 },
	sectionTitle: {
		fontSize: 11,
		fontWeight: "bold",
		letterSpacing: 1.5,
		textTransform: "uppercase",
		marginBottom: 6,
	},
	sectionTitleUnderline: {
		borderBottomWidth: 1,
		paddingBottom: 3,
	},
	bulletRow: { flexDirection: "row", marginBottom: 2 },
	bulletMark: { width: 10 },
	bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
	contactRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 3,
	},
	contactRowInline: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 14,
		marginBottom: 2,
	},
	contactIcon: { marginRight: 6 },
	contactText: { fontSize: 9, color: "#333333" },
	experienceItem: { marginBottom: 10 },
	roleTitle: { fontSize: 11, fontWeight: "bold" },
	roleMeta: { fontSize: 9.5, fontStyle: "italic", marginBottom: 2 },
	roleSummary: { fontSize: 9.5, lineHeight: 1.35, marginBottom: 3 },
});

export type SectionProps = {
	title: string;
	color?: string;
	underline?: boolean;
	children: ReactNode;
};

export const Section = ({ title, color, underline, children }: SectionProps) => {
	const titleStyles = [
		styles.sectionTitle,
		color ? { color } : null,
		underline ? styles.sectionTitleUnderline : null,
		underline ? { borderBottomColor: color ?? "#000000" } : null,
	].filter(Boolean);
	return (
		<View style={styles.section}>
			<Text style={titleStyles}>{title}</Text>
			{children}
		</View>
	);
};

export type BulletProps = { children: ReactNode; mark?: string };

export const Bullet = ({ children, mark = "•" }: BulletProps) => (
	<View style={styles.bulletRow}>
		<Text style={styles.bulletMark}>{mark}</Text>
		<Text style={styles.bulletText}>{children}</Text>
	</View>
);

export type ContactLineProps = {
	icon?: ReactNode;
	inline?: boolean;
	children: ReactNode;
};

export const ContactLine = ({ icon, inline, children }: ContactLineProps) => (
	<View style={inline ? styles.contactRowInline : styles.contactRow}>
		{icon ? <View style={styles.contactIcon}>{icon}</View> : null}
		<Text style={styles.contactText}>{children}</Text>
	</View>
);

export type ExperienceItemProps = {
	title: string;
	company: string;
	duration: string;
	summary: string;
	bullets: string[];
};

export const ExperienceItem = ({ title, company, duration, summary, bullets }: ExperienceItemProps) => (
	<View style={styles.experienceItem} wrap={false}>
		<Text style={styles.roleTitle}>{title}</Text>
		<Text style={styles.roleMeta}>
			{company} | {duration}
		</Text>
		<Text style={styles.roleSummary}>{summary}</Text>
		{bullets.map((b, i) => (
			<Bullet key={`${title}-${i}`}>{b}</Bullet>
		))}
	</View>
);
