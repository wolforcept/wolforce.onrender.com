import { Text } from "@mantine/core";
import { SoftwareDesktopIcon } from "components/reusable/SoftwareDesktopIcon";
import { FC } from "react";

import iconAtv2 from 'assets/software/atv/atv.gif';
import iconAtv from 'assets/software/atv/atv.png';

export const IconAtv: FC = () => <SoftwareDesktopIcon
    name='aTV'
    icon={iconAtv}
    icon2={iconAtv2}
    // w={1092}
    // h={594}
    description={
        <Text>
            aTV (animated Texture Viewer) is a micro java app to view vertical (Minecraft-compatible) animated spritesheets while editing the image. Will automatically refresh when you save.<br />
            <br />
            To load a new image press load.<br />
            Manually reloading is also possible by pressing the update button<br />
            Double click the image to toggle between showing GUI and not showing GUI.<br />
            Right click the image to choose the desired preview size.
        </Text>
    }
    link={"assets/software/atv/atv.gif"}
/>