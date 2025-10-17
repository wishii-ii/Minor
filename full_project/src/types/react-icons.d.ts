declare module 'react-icons/*' {
    import type { ComponentType, SVGProps } from 'react';
    type IconType = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;
    const content: { [key: string]: IconType };
    export = content;
}
