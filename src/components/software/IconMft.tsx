import { Text } from "@mantine/core";
import { SoftwareDesktopIcon } from "components/reusable/SoftwareDesktopIcon";
import { FC } from "react";

import iconMft from 'assets/software/mft/mft.png';

export const IconMft: FC = () => <SoftwareDesktopIcon
    name='MFT'
    icon={iconMft}
    w={825}
    h={420}
    description={
        <Text>
            MFT (multi file templates) is a small app to generate files according to some variables.<br />
            <br />
            When editing, you can add templates, edit the template files and add and edit variables.<br />
            Then, after pressing 'run' or exporting as a runnable, you can edit the variables that you want to rune the template with, then run the template once or multiple times, choosing where the files are saved individually. You can have variables not only in the template text, but also on the individual and global file paths.
        </Text>
    }
/>
