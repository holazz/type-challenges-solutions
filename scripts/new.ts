import { existsSync, promises as fs } from 'node:fs'
import fg from 'fast-glob'
import { download } from 'down-git'
import { quizSet } from '../meta.json'
import { DifficultyRank, QUIZ_ROOT, loadQuiz, loadQuizzes } from './utils'
import type { Difficulty } from './utils'

type QuizzesNo = {
  [K in Difficulty]: number[]
}

async function getQuizzesNoByDifficulty(): Promise<QuizzesNo> {
  return quizSet.reduce(async (pre, cur) => {
    const { no, difficulty } = await loadQuiz(cur)
    ;(await pre as QuizzesNo)[difficulty].push(no)
    return pre
  }, DifficultyRank.reduce((pre, cur) => {
    return Object.assign(pre, {
      [cur]: [],
    })
  }, {})) as QuizzesNo
}

async function getNextQuizNo() {
  const quizzes = await loadQuizzes()
  const quizzesNo = await getQuizzesNoByDifficulty()
  for (let i = 0; i < DifficultyRank.length; i++) {
    const n1 = quizzes.filter(quiz => quiz.difficulty === DifficultyRank[i] as Difficulty).map(quiz => quiz.no)
    const n2 = quizzesNo[DifficultyRank[i] as Difficulty]
    if (n1.length < n2.length) {
      const rest = [...n1.filter(x => !n2.includes(x)), ...n2.filter(x => !n1.includes(x))].sort((a, b) => a - b)
      return rest[0]
    }
  }
}

async function newQuiz(no?: number | string): Promise<void> {
  if (!no) no = await getNextQuizNo()

  if (!no) {
    console.log('The next question does not exist.')
    return
  }

  const quiz = no.toString().padStart(5, '0')
  const path = quizSet.find(name => name.startsWith(quiz))
  const output = `${QUIZ_ROOT}/${path}`

  if (!path) {
    console.log(`${quiz} not found.`)
    return
  }

  if (existsSync(output)) {
    console.log(`\x1B[32m${path}\x1B[0m already exists!`)
    return
  }
  await download({
    route: `type-challenges/type-challenges/questions/${path}`,
    output,
  })

  const files = await fg(['*', '!*.ts', '!README.md'], {
    cwd: output,
  })
  await Promise.all(
    files.map(async file => await fs.unlink(`${output}/${file}`)),
  )
}

newQuiz(process.argv.slice(2)[0])
