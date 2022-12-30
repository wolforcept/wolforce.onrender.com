import { Accordion, Title } from '@mantine/core';
import styled from '@emotion/styled';

// const THEME: MantineThemeOverride = {
//     colorScheme: 'dark',
//     // spacing: { xs: 0, sm: 4, md: 8, lg: 12, xl: 16 },
//     colors: {
//         // Default Mantine colours: https://mantine.dev/theming/colors/
//         // define a base set of colours for Skill Assessment
//         //base: ['#F0BBDD', '#ED9BCF', '#EC7CC3', '#ED5DB8', '#F13EAF', '#F71FA7', '#FF00A1', '#E00890', '#C50E82', '#AD1374'],
//         light: ['#FFFFFF', // White
//             '#ED9BCF', // 
//             '#e0f0ff', // Blueish white
//             '#fff4f4', // Near white
//             '#a9c5cc', // Light gray
//             '#646482', // Gray
//             '#576973', // 
//             '#415058', // Dark green
//             '#C50E82', //
//             '#271027'], // Blackish
//         dark: ['#FFFFFF', // White
//             '#ED9BCF', // 
//             '#e0f0ff', // Blueish
//             '#fff4f4', // Near white
//             '#a9c5cc', // Light gray
//             '#646482', // Gray
//             '#576973', // 
//             '#415058', // Dark green
//             '#C50E82', //
//             '#271027'] // Blackish
//     },
//     primaryColor: 'light',
//     components: {
//     },
//     //globalStyles: () => ({
//     // class objects with final class names ex: '.mantine-obtds1': {}
//     // useStyles class names (ex:'.box') won't work here
//     //})
// };

export const StyledTitle = styled(Title)`
    margin-bottom: 20px;
`

export const StyledPanel = styled(Accordion.Panel)`
    margin-right: -16px;
`