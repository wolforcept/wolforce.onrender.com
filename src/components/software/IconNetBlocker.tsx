import { Text } from "@mantine/core";
import { SoftwareDesktopIcon } from "components/reusable/SoftwareDesktopIcon";
import { FC } from "react";

import iconNetblocker from 'assets/software/netblocker/netblocker.png';
import iconNetblocker2 from 'assets/software/netblocker/netblocker_printscreen1.png';

export const IconNetBlocker: FC = () => <SoftwareDesktopIcon
    name='Net Blocker'
    icon={iconNetblocker}
    icon2={iconNetblocker2}
    w={910}
    h={345}
    description={
        <Text>
            A small app to add application rules to the firewall.
        </Text>
    }
/>