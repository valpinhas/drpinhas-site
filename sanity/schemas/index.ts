import { page } from './page'
import { post } from './post'
import { category } from './category'
import { service } from './service'
import { question } from './question'
import { comment } from './comment'
import { author } from './author'
import { siteSettings } from './siteSettings'
import { navigation } from './navigation'
import { homepage } from './homepage'

export const schemaTypes = [
  // Documents
  page,
  post,
  category,
  service,
  question,
  comment,
  author,
  // Singletons
  siteSettings,
  navigation,
  homepage,
]
