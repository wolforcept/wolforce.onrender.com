// Globals not known to the type checker
declare const Matter: any;   // matter-js, loaded from the CDN in index.html

interface Navigator {
    deviceMemory?: number;   // Chrome only
}
