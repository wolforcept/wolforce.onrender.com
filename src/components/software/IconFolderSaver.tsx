import { Text } from "@mantine/core";
import { SoftwareDesktopIcon } from "components/reusable/SoftwareDesktopIcon";
import { FC } from "react";

import iconFoldersaver from 'assets/software/foldersaver/foldersaver.png';

export const IconFolderSaver: FC = () => <SoftwareDesktopIcon
    name='Folder Saver'
    icon={iconFoldersaver}
    w={706}
    h={275}
    description={
        <Text>
            A small app to save and load the current opened folders and its locations on the screen. You can have multiple independent saves and load them at any time to reopen the folders exactly where you left them. Right click for options. Double click to exit.
        </Text>
    }
/>