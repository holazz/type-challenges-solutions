import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const QUIZ_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../questions')
export const META_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../meta.json')
export const README_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../README.md')
export const DifficultyRank = [
  'warm',
  'easy',
  'medium',
  'hard',
  'extreme',
]
