import path from 'path';
import { fileURLToPath } from 'url';

function fileName(fileURL){
  return path.basename(fileURLToPath(fileURL));
}

function dirName(fileURL){
  return path.dirname(fileURLToPath(fileURL));
}

export {fileName, dirName};
