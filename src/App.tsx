import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import 'App.scss';
import Desktop from 'components/Windows/Desktop';
import DesktopIcon from 'components/Windows/DesktopIcon';
import { Folder } from 'components/Windows/Folder';
import { FC } from 'react';
import Theme from 'Theme';

import icon from 'assets/icon.png';
import iconSoftware from 'assets/software.png';
import HueClue from 'components/HueClue/HueClue';
import Kanban from 'components/Kanban/Kanban';
import { IconAtv } from 'components/software/IconAtv';
import { IconFolderSaver } from 'components/software/IconFolderSaver';
import { IconMft } from 'components/software/IconMft';
import { IconMutedTray } from 'components/software/IconMutedTray';
import { IconNetBlocker } from 'components/software/IconNetBlocker';

const App: FC = () => {

    return (

        <MantineProvider withCSSVariables withGlobalStyles withNormalizeCSS theme={Theme} >
            <ColorSchemeProvider colorScheme={'dark'} toggleColorScheme={(colorScheme?: ColorScheme | undefined) => { }}>
                <Desktop>

                    <DesktopIcon name='Software' imgSrc={iconSoftware} x={1} y={1} initProps={{ title: 'Software', icon: iconSoftware }} makeComponent={() => <Folder>
                        <IconAtv />
                        <IconFolderSaver />
                        <IconMft />
                        <IconMutedTray />
                        <IconNetBlocker />
                    </Folder>} />

                    <DesktopIcon name='HueClue' imgSrc={icon} x={5} y={1}
                        initProps={{ title: 'Hue Clue', w: undefined, h: undefined }} makeComponent={() => <HueClue />} />


                    <DesktopIcon name='Kanban' imgSrc={icon} x={8} y={1}
                        initProps={{ title: 'Kanban Board', w: undefined, h: undefined }} makeComponent={() => <Kanban />} />

                </Desktop>
                {/* <RouterProvider router={router} /> */}
            </ColorSchemeProvider>
        </MantineProvider>

    );
}

export default App;

