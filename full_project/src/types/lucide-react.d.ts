declare module 'lucide-react' {
    import type { ComponentType, SVGProps } from 'react';
    type IconType = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;
    export const Users: IconType;
    export const Plus: IconType;
    const _default: { [key: string]: IconType };
    export default _default;
}
