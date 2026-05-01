import { Path, Svg } from "@react-pdf/renderer";
import React from "react";

type IconProps = { size?: number; color?: string };

const base = (path: string) => (props: IconProps) => {
	const { size = 10, color = "#555555" } = props;
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24">
			<Path d={path} fill={color} />
		</Svg>
	);
};

export const PinIcon = base(
	"M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z",
);

export const GlobeIcon = base(
	"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9h-3.05a15.6 15.6 0 0 0-1.38-5.27A8.03 8.03 0 0 1 19.93 11zM12 4.07c.94 1.37 1.7 3.27 2.05 5.93H9.95C10.3 7.34 11.06 5.44 12 4.07zM4.07 11a8.03 8.03 0 0 1 4.43-5.27A15.6 15.6 0 0 0 7.12 11H4.07zM4.07 13h3.05a15.6 15.6 0 0 0 1.38 5.27A8.03 8.03 0 0 1 4.07 13zm7.93 6.93c-.94-1.37-1.7-3.27-2.05-5.93h4.1c-.35 2.66-1.11 4.56-2.05 5.93zM15.5 18.27A15.6 15.6 0 0 0 16.88 13h3.05a8.03 8.03 0 0 1-4.43 5.27z",
);

export const MailIcon = base(
	"M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
);

export const LinkedInIcon = base(
	"M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z",
);
