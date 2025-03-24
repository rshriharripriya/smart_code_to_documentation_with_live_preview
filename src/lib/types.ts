export interface CodeChange {
  name: string;
  type: 'function' | 'component' | 'class';
  code: string;
  filePath: string;
}