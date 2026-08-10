import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const SOURCE_DIRS = ['components', 'pages', 'styles'];

// heyhomie-shared/BRAND.md is the canon for all four surfaces. The website was
// the last one still on the legacy values; these guards stop it drifting back
// one hand-edited hex at a time.
const LEGACY = {
    '#14133A': 'ink — use #141338',
    '#36F0C7': 'mint — use #77ECC8',
    '#FF3C87': 'pink — use #EB4E87',
    '#F4F7FF': 'light surface — use #F6FBFF',
    'Quicksand': 'heading font — use Manrope',
};

const walk = dir =>
    fs.readdirSync(dir, { withFileTypes: true }).reduce((acc, entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === 'node_modules' ? acc : [...acc, ...walk(full)];
        return /\.(js|jsx|css)$/.test(entry.name) ? [...acc, full] : acc;
    }, []);

const sourceFiles = SOURCE_DIRS.filter(d => fs.existsSync(path.join(ROOT, d))).reduce((acc, d) => [...acc, ...walk(path.join(ROOT, d))], []);

describe('brand canon', () => {
    it('reads a non-trivial number of source files', () => {
        // Guards the guard: a broken walk would make every check below pass.
        expect(sourceFiles.length).toBeGreaterThan(50);
    });

    it.each(Object.entries(LEGACY))('no source file still uses %s (%s)', (token, hint) => {
        const offenders = sourceFiles.filter(file => new RegExp(token, 'i').test(fs.readFileSync(file, 'utf8'))).map(file => path.relative(ROOT, file));

        expect(offenders).toEqual([]);
    });

    it('keeps the canon palette in the tailwind theme', () => {
        // Components should read tokens from the theme; if the theme itself
        // drifts, every consumer drifts with it.
        const config = fs.readFileSync(path.join(ROOT, 'tailwind.config.js'), 'utf8');

        expect(config).toContain('#141338'); // ink
        expect(config).toContain('#77ECC8'); // mint
        expect(config).toContain('#EB4E87'); // pink
        expect(config).toContain('Manrope');
    });

    it('loads Manrope, not the retired fonts', () => {
        const document = fs.readFileSync(path.join(ROOT, 'pages', '_document.js'), 'utf8');

        expect(document).toContain('family=Manrope');
        expect(document).not.toContain('family=Quicksand');
        expect(document).not.toContain('family=Lato');
    });
});
