import { Flex } from '@mantine/core';
import { FC, ReactNode } from 'react';

interface FolderProps {
    children: ReactNode
}
export const Folder: FC<FolderProps> = ({ children }) => {

    return (
        <Flex direction='row' w='100%' wrap='wrap' >
            {children}
        </Flex>
    )
}
