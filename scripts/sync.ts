import { writeFile } from 'node:fs/promises'
import { Octokit } from '@octokit/rest'
import { DifficultyRank, META_PATH } from './constant'

async function fetchRemoteQuizzes() {
  const octokit = new Octokit()
  const { data } = await octokit.rest.repos.getContent({
    owner: 'type-challenges',
    repo: 'type-challenges',
    path: 'questions',
  })
  const state = {
    quizSet: (data as any).map((item: any) => item.name),
    rankCount: DifficultyRank.map(difficulty => ({
      [difficulty]: (data as any).filter((item: any) => item.name.match(/^\d+-(.+?)-.*$/)[1] === difficulty).length,
    })).reduce((p, n) => Object.assign(p, n), {}),
  }
  await writeFile(META_PATH, `${JSON.stringify(state, null, 2)}\n`, 'utf-8')
}

fetchRemoteQuizzes()
