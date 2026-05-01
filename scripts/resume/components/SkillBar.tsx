import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
	wrap: { marginBottom: 8 },
	label: { fontSize: 10, marginBottom: 3 },
	trackBg: { height: 5, backgroundColor: "#FFFFFF", borderRadius: 2 },
	trackFill: { height: 5, borderRadius: 2 },
});

export type SkillBarProps = {
	name: string;
	proficiency: number;
	color: string;
};

export const SkillBar = ({ name, proficiency, color }: SkillBarProps) => {
	const pct = Math.max(0, Math.min(100, proficiency));
	return (
		<View style={styles.wrap}>
			<Text style={styles.label}>{name}</Text>
			<View style={styles.trackBg}>
				<View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: color }]} />
			</View>
		</View>
	);
};
