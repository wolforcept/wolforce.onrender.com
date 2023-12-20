import { Anchor, Button, Stack } from '@mantine/core';
import DesktopIcon from 'components/Windows/DesktopIcon';
import { FC } from 'react';
import { StyledTitle } from 'StyledComponents';

interface SoftwareDesktopIconProps {
    icon: string
    icon2?: string
    name: string
    description?: any
    moreContent?: any
    scroll?: boolean
    w?: number
    h?: number
    link?: string
}

export const SoftwareDesktopIcon: FC<SoftwareDesktopIconProps> = ({ icon, icon2, name, scroll, description, moreContent, w, h, link }) => {

    const content = <div style={{ padding: 30 }}>
        <div style={{ float: 'left' }}>
            <img src={icon2 ? icon2 : icon} alt={name} />
        </div>
        <div style={{ float: 'left', maxWidth: 500, paddingLeft: 30 }}>
            <Stack>
                <StyledTitle>{name}</StyledTitle>
                {description}
                {link && <Anchor href={link} target="_blank"><Button variant='default' color='white'>Download</Button></Anchor>}
            </Stack>
        </div>
        <div style={{ float: 'left' }}>
            {moreContent && moreContent}
        </div>
    </div>

    return <DesktopIcon name={name} imgSrc={icon} locked
        initProps={{ title: "Software: " + name, w, h, icon, scroll }}
        makeComponent={() => content} />
}
