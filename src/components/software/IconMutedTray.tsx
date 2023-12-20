import { Text } from "@mantine/core";
import { SoftwareDesktopIcon } from "components/reusable/SoftwareDesktopIcon";
import { FC } from "react";

import iconMutedtray from 'assets/software/mutedtray/mutedtray.png';

export const IconMutedTray: FC = () => <SoftwareDesktopIcon
    name='Muted Tray'
    icon={iconMutedtray}
    w={706}
    h={245}
    description={
        <Text>
            A small app to display the muted state of your current microphone. You may also use it to mute/unmute your microphone with right click. Double click to exit.
        </Text>
    }
/>
