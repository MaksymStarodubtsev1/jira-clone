import { DndProvider as DNDProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import React, { FC, ReactNode } from "react";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const Backend = isMobile ? TouchBackend : HTML5Backend;

interface DndProviderProps {
    children: ReactNode
};
export const DndProvider: FC<DndProviderProps> = ({ children }) => (
    <DNDProvider backend={Backend} options={{ enableMouseEvents: true }}>
        {children}
    </DNDProvider>
)