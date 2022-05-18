import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import fg from 'fast-glob'
import { rankCount } from '../meta.json'
import { DifficultyRank, QUIZ_ROOT } from './constant'

export type Difficulty = 'warm' | 'easy' | 'medium' | 'hard' | 'extreme' | 'pending'

export interface Quiz {
  no: number
  title: string
  difficulty: Difficulty
  path: string
}

async function loadQuizzes(): Promise<Quiz[]> {
  const folders = await fg('{0..9}*-*', {
    onlyDirectories: true,
    cwd: QUIZ_ROOT,
  })

  const quizzes = await Promise.all(
    folders.map(async dir => loadQuiz(dir)),
  )

  return quizzes
}

async function loadQuiz(dir: string): Promise<Quiz> {
  return {
    no: Number(dir.replace(/^(\d+)-.*/, '$1')),
    difficulty: dir.replace(/^\d+-(.+?)-.*$/, '$1') as any,
    title: dir.replace(/^\d+-.+?-(.+?)$/, '$1'),
    path: dir,
  }
}

function toPlanTextLink(url: string, text: string) {
  return `<a href="${url}" target="_blank">${text}</a> `
}

function toDifficultyPlainText(difficulty: Difficulty, count: number) {
  return `${difficulty} (${count.toString()}/${rankCount[difficulty as Exclude<Difficulty, 'pending'>].toString()})`
}

async function updateREADME(quizzes: Quiz[]) {
  const filepath = resolve(dirname(fileURLToPath(import.meta.url)), '../README.md')
  let challengesREADME = ''
  let prev = ''

  // difficulty
  const quizzesByDifficulty = [...quizzes].sort((a, b) => DifficultyRank.indexOf(a.difficulty) - DifficultyRank.indexOf(b.difficulty))

  for (const quiz of quizzesByDifficulty) {
    if (prev !== quiz.difficulty)
      challengesREADME += `${prev ? '</ul>' : ''}<h3>${toDifficultyPlainText(quiz.difficulty, quizzesByDifficulty.filter(q => q.difficulty === quiz.difficulty).length)}</h3><ul>`
    challengesREADME += `<li>${toPlanTextLink(`./questions/${quiz.path}/README.md`, `${quiz.no}・${quiz.title}`)}</li>`
    prev = quiz.difficulty
  }
  challengesREADME += '</ul>'

  let readme = await readFile(filepath, 'utf-8')
  readme = readme.replace(
    /<!--challenges-start-->[\s\S]*<!--challenges-end-->/m,
    `<!--challenges-start-->\n${challengesREADME}\n<!--challenges-end-->`,
  )
  await writeFile(filepath, readme, 'utf-8')
}

(async () => {
  const quizzes = await loadQuizzes()
  quizzes.sort((a, b) => a.no - b.no)
  await updateREADME(quizzes)
})()
