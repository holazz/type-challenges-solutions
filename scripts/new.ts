import { existsSync, promises as fs } from 'node:fs'
import fg from 'fast-glob'
import { download } from 'down-git'
import { quizSet } from '../meta.json'
import { QUIZ_ROOT } from './constant'

async function newQuiz(no: number | string) {
  if (!no) return
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
