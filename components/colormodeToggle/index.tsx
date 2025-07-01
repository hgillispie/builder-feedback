import { IconButton, propNames } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import type { NextPage } from "next";
import { useColorMode } from "@chakra-ui/react";

const ColormodeToggle: NextPage = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<>
			<IconButton
				onClick={toggleColorMode}
				variant="outline"
				rounded="full"
				aria-label={colorMode === "light" ? "Dark mode" : "Light mode"}
				icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
			/>
		</>
	);
};

export default ColormodeToggle;
