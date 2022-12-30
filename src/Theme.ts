import { MantineThemeOverride } from "@mantine/core";

const Theme: MantineThemeOverride = {

    colorScheme: 'dark',
    primaryColor: 'blue',
    // // spacing: { xs: 0, sm: 4, md: 8, lg: 12, xl: 16 },

    colors: {
        blue: [
            '#F00000', // 0: Black (default text menu background)
            '#0F0000', // 1: Darker gray (app background)
            '#00F000', // 2: Light orange
            '#000F00', // 3: Vivid orange
            '#0000F0', // 4: Green (navbar)
            '#00000F', // 5: Dark green
            '#F00000', // 6: Vivid green
            '#0F0000', // 7: Darker gray 
            '#444455', // buttons background           
            '#000F00'], // 9: White (text)
    },

}

export default Theme;