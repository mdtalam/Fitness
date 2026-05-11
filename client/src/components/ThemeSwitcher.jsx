import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';

const accents = {
    lime: { name: 'Cyber Lime', color: '#aff200' },
    blue: { name: 'Electric Blue', color: '#3b82f6' },
    rose: { name: 'Vibrant Rose', color: '#f43f5e' },
    amber: { name: 'Sunset Amber', color: '#f59e0b' },
    violet: { name: 'Deep Violet', color: '#8b5cf6' },
    cyan: { name: 'Neon Cyan', color: '#06b6d4' },
};

const navColors = {
    default: { name: 'Default', color: 'bg-muted' },
    primary: { name: 'Primary', color: 'bg-primary' },
    glass: { name: 'Glass', color: 'bg-white/20' },
    dark: { name: 'Dark', color: 'bg-black' },
    indigo: { name: 'Indigo', color: 'bg-indigo-950' },
};

const ThemeSwitcher = () => {
    const { 
        theme, setTheme, 
        accent, setAccent, availableAccents,
        navbarColor, setNavbarColor, availableNavbarColors
    } = useTheme();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-muted/50 hover:bg-muted transition-all">
                    <Palette className="h-5 w-5" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                className="w-64 p-3 rounded-2xl border-none shadow-2xl bg-background/95 backdrop-blur-xl ring-1 ring-black/5 max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 mb-2">
                    Appearance
                </DropdownMenuLabel>
                <div className="grid grid-cols-3 gap-2 px-1">
                    <Button 
                        variant={theme === 'light' ? 'default' : 'secondary'} 
                        size="sm" 
                        onClick={() => setTheme('light')}
                        className="h-10 rounded-xl font-bold"
                    >
                        <Sun className="h-4 w-4 mr-2" />
                    </Button>
                    <Button 
                        variant={theme === 'dark' ? 'default' : 'secondary'} 
                        size="sm" 
                        onClick={() => setTheme('dark')}
                        className="h-10 rounded-xl font-bold"
                    >
                        <Moon className="h-4 w-4 mr-2" />
                    </Button>
                    <Button 
                        variant={theme === 'system' ? 'default' : 'secondary'} 
                        size="sm" 
                        onClick={() => setTheme('system')}
                        className="h-10 rounded-xl font-bold"
                    >
                        <Monitor className="h-4 w-4 mr-2" />
                    </Button>
                </div>
                
                <DropdownMenuSeparator className="my-4 opacity-50" />
                
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 mb-2">
                    Accent Color
                </DropdownMenuLabel>
                <div className="grid grid-cols-6 gap-2 px-1">
                    {availableAccents.map((a) => (
                        <button
                            key={a}
                            onClick={() => setAccent(a)}
                            className={`
                                h-8 w-full rounded-lg flex items-center justify-center transition-all relative group
                                ${accent === a ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-90' : 'hover:scale-110'}
                            `}
                            style={{ backgroundColor: accents[a].color }}
                            title={accents[a].name}
                        >
                            {accent === a && (
                                <Check className={`h-3 w-3 ${['lime', 'amber', 'cyan'].includes(a) ? 'text-black' : 'text-white'}`} />
                            )}
                        </button>
                    ))}
                </div>

                <DropdownMenuSeparator className="my-4 opacity-50" />
                
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 mb-2">
                    Navbar Style
                </DropdownMenuLabel>
                <div className="grid grid-cols-1 gap-2 px-1">
                    {availableNavbarColors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setNavbarColor(c)}
                            className={`
                                flex items-center justify-between px-3 py-2 rounded-xl transition-all
                                ${navbarColor === c ? 'bg-primary text-primary-foreground font-black' : 'hover:bg-muted font-bold text-sm'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-4 w-4 rounded-full border border-white/20 ${navColors[c].color}`}></div>
                                <span className="capitalize">{navColors[c].name}</span>
                            </div>
                            {navbarColor === c && <Check className="h-4 w-4" />}
                        </button>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeSwitcher;
