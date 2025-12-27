import * as Icons from 'lucide-react';

export const DynamicIcon = ({name, size = 24, className = ""}) => {
    const IconComponent = Icons[name] || Icons.Wrench; // 找不到时默认显示扳手
    return <IconComponent size={size} className={className}/>;
};