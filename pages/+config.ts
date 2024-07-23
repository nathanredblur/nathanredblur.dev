import vikeReact from 'vike-react/config'
import type { Config } from 'vike/types'

import { personalData } from "@/utils/data/personal-data";

// Default configs (can be overridden by pages)
const config = {
  // <title>
  title: personalData.pageTitle,
  // https://vike.dev/stream
  stream: true,
  // https://vike.dev/ssr - this line can be removed since `true` is the default
  ssr: true,
  // https://vike.dev/extends
  extends: vikeReact
} satisfies Config

export { config }