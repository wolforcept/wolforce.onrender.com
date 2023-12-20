import { FC } from 'react';
import { Text, CopyButton, Tooltip, ActionIcon } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons';

interface ConnectionFooterProps {
    roomcode: string;
}

const ConnectionFooter: FC<ConnectionFooterProps> = function ({ roomcode }) {

    return (
        <div className="connectionFooter">
            <Text className='roomcodeLabel'>Room Code: </Text>
            <Text>{roomcode}</Text>
            <CopyButton value={roomcode} timeout={2000}>
                {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="bottom">
                        <ActionIcon className='copyIcon' color={copied ? 'teal' : 'gray'} onClick={copy}>
                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                    </Tooltip>
                )}
            </CopyButton>
        </div>
    )
}

export default ConnectionFooter;
