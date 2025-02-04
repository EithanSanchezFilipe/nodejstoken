import fs from 'fs';
import path from 'path';
const privateKey = fs.readFileSync(path.resolve('./routes/private.key'));
export { privateKey };
