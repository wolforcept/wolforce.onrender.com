import { FC } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import Theme from 'Theme';
import 'App.scss'
import HueClue from 'components/HueClue/HueClue';
import Desktop from 'components/Windows/Desktop';
import DesktopIcon from 'components/Windows/DesktopIcon';

const App: FC = () => {

    return (

        <MantineProvider withCSSVariables withGlobalStyles withNormalizeCSS theme={Theme} >
            <ColorSchemeProvider colorScheme={'dark'} toggleColorScheme={(colorScheme?: ColorScheme | undefined) => { }}>
                <Desktop>
                    <DesktopIcon imgSrc='https://wolforcept.github.io/images/icon128.png' x={1} y={1}
                        initProps={{ title: 'Hue Clue', w: undefined, h: undefined }} makeComponent={() => <HueClue />} />
                </Desktop>
                {/* <RouterProvider router={router} /> */}
            </ColorSchemeProvider>
        </MantineProvider>

    );
}

export default App;

