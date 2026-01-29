import React from 'react';
import { cn } from '@/lib/utils';

const SectionHeader = ({ title, subtitle, description, centered = false, className }) => {
    return (
        <div className={cn(
            "mb-10 space-y-2",
            centered ? "text-center mx-auto max-w-2xl" : "text-left",
            className
        )}>
            {subtitle && (
                <div className={cn("flex items-center gap-3 mb-1", centered && "justify-center")}>
                    <span className="h-[1px] w-5 bg-primary/30 rounded-full" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/70">
                        {subtitle}
                    </span>
                    <span className="h-[1px] w-5 bg-primary/30 rounded-full" />
                </div>
            )}
            <h2 className="text-3xl font-black tracking-tighter sm:text-4xl text-foreground italic leading-tight">
                {title}
            </h2>
            {description && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium opacity-70 max-w-xl">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
