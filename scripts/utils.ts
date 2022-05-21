import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'

export type Difficulty = 'warm' | 'easy' | 'medium' | 'hard' | 'extreme'

export interface Quiz {
  no: number
  title: string
  difficulty: Difficulty
  path: string
}

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

export async function loadQuizzes(): Promise<Quiz[]> {
  const folders = await fg('{0..9}*-*', {
    onlyDirectories: true,
    cwd: QUIZ_ROOT,
  })

  const quizzes = await Promise.all(
    folders.map(async dir => loadQuiz(dir)),
  )

  return quizzes
}

export async function loadQuiz(dir: string): Promise<Quiz> {
  return {
    no: Number(dir.replace(/^(\d+)-.*/, '$1')),
    difficulty: dir.replace(/^\d+-(.+?)-.*$/, '$1') as any,
    title: dir.replace(/^\d+-.+?-(.+?)$/, '$1'),
    path: dir,
  }
}
